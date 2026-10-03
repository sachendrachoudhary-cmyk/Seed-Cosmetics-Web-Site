import { Request, Response } from "express";
import { Cart, ICart } from "../models/Cart";
import { Product } from "../models/Product";
import { Variant } from "../models/Variant";
import { Coupon } from "../models/Coupon";
import { PricingEngine } from "../services/pricingEngine";
import { AuthenticatedRequest } from "../middlewares/auth";

export class CartController {
  private static async recalculateCart(cart: ICart): Promise<ICart> {
    const validItems: any[] = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (!product || product.status !== "published") continue;

      let unitPrice = product.sellingPrice;
      let unitMrp = product.MRP;
      let variantTitle = undefined;

      if (item.variantId) {
        const variant = await Variant.findById(item.variantId);
        if (variant) {
          unitPrice = variant.price;
          unitMrp = variant.mrp;
          variantTitle = variant.title;
        }
      }

      validItems.push({
        _id: item._id,
        product: product._id,
        variantId: item.variantId,
        variantTitle: variantTitle || item.variantTitle,
        quantity: Math.max(1, item.quantity),
        unitPrice,
        unitMrp,
        lineTotal: Math.round(unitPrice * item.quantity * 100) / 100,
      });
    }

    cart.items = validItems;

    // Check coupon if present
    let coupon = null;
    if (cart.couponCode) {
      coupon = await Coupon.findOne({ code: cart.couponCode, isActive: true });
      if (!coupon) {
        cart.couponCode = undefined;
      }
    }

    const pricing = PricingEngine.calculateCartTotals(
      validItems.map((i) => ({ unitPrice: i.unitPrice, quantity: i.quantity })),
      coupon
    );

    cart.subtotal = pricing.subtotal;
    cart.couponDiscount = pricing.discount;
    cart.shippingFee = pricing.shippingFee;
    cart.grandTotal = pricing.grandTotal;

    await cart.save();
    return cart;
  }

  public static async getCart(req: AuthenticatedRequest, res: Response) {
    try {
      const { guestSessionId } = req.query;
      let cart = null;

      if (req.user) {
        cart = await Cart.findOne({ user: req.user._id });
        if (!cart && guestSessionId) {
          cart = await Cart.findOne({ guestSessionId: guestSessionId as string });
          if (cart) {
            cart.user = req.user._id;
            cart.guestSessionId = undefined;
          }
        }
      } else if (guestSessionId) {
        cart = await Cart.findOne({ guestSessionId: guestSessionId as string });
      }

      if (!cart) {
        cart = new Cart({
          user: req.user?._id,
          guestSessionId: req.user ? undefined : (guestSessionId as string || `guest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`),
          items: [],
          couponDiscount: 0,
          shippingFee: 0,
          subtotal: 0,
          grandTotal: 0,
        });
        await cart.save();
      } else {
        await CartController.recalculateCart(cart);
      }

      await cart.populate("items.product", "name slug thumbnail images stock sellingPrice MRP");

      return res.json({
        success: true,
        cart,
      });
    } catch (err: any) {
      console.error("[Cart] Fetch error:", err);
      return res.status(500).json({ success: false, message: "Failed to load cart." });
    }
  }

  public static async addItem(req: AuthenticatedRequest, res: Response) {
    try {
      const { productId, variantId, quantity = 1, guestSessionId } = req.body;

      const product = await Product.findById(productId);
      if (!product || product.status !== "published") {
        return res.status(404).json({ success: false, message: "Product not found or unavailable." });
      }

      let unitPrice = product.sellingPrice;
      let unitMrp = product.MRP;
      let variantTitle = undefined;
      let availableStock = product.stock;

      if (variantId) {
        const variant = await Variant.findById(variantId);
        if (!variant) return res.status(404).json({ success: false, message: "Variant not found." });
        unitPrice = variant.price;
        unitMrp = variant.mrp;
        variantTitle = variant.title;
        availableStock = variant.stock;
      }

      if (availableStock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${availableStock} units in stock.`,
        });
      }

      let cart = null;
      if (req.user) {
        cart = await Cart.findOne({ user: req.user._id });
      } else if (guestSessionId) {
        cart = await Cart.findOne({ guestSessionId });
      }

      if (!cart) {
        cart = new Cart({
          user: req.user?._id,
          guestSessionId: req.user ? undefined : (guestSessionId || `guest_${Date.now()}`),
          items: [],
        });
      }

      const existingIndex = cart.items.findIndex(
        (i) => i.product.toString() === productId && (i.variantId || "") === (variantId || "")
      );

      if (existingIndex > -1) {
        const newQty = cart.items[existingIndex].quantity + quantity;
        if (newQty > availableStock) {
          return res.status(400).json({
            success: false,
            message: `Cannot add more. Total in cart would exceed available stock (${availableStock}).`,
          });
        }
        cart.items[existingIndex].quantity = newQty;
        cart.items[existingIndex].lineTotal = Math.round(unitPrice * newQty * 100) / 100;
      } else {
        cart.items.push({
          product: product._id,
          variantId,
          variantTitle,
          quantity,
          unitPrice,
          unitMrp,
          lineTotal: Math.round(unitPrice * quantity * 100) / 100,
        });
      }

      await CartController.recalculateCart(cart);
      await cart.populate("items.product", "name slug thumbnail images stock sellingPrice MRP");

      return res.json({
        success: true,
        message: `${product.name} added to cart.`,
        cart,
      });
    } catch (err: any) {
      console.error("[Cart] Add item error:", err);
      return res.status(500).json({ success: false, message: "Failed to add item to cart." });
    }
  }

  public static async updateItemQuantity(req: AuthenticatedRequest, res: Response) {
    try {
      const { itemId } = req.params;
      const { quantity, guestSessionId } = req.body;

      let cart = null;
      if (req.user) {
        cart = await Cart.findOne({ user: req.user._id });
      } else if (guestSessionId) {
        cart = await Cart.findOne({ guestSessionId });
      }

      if (!cart) return res.status(404).json({ success: false, message: "Cart not found." });

      const itemIndex = cart.items.findIndex((i: any) => i._id.toString() === itemId);
      if (itemIndex === -1) {
        return res.status(404).json({ success: false, message: "Item not in cart." });
      }

      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].lineTotal = Math.round(cart.items[itemIndex].unitPrice * quantity * 100) / 100;
      }

      await CartController.recalculateCart(cart);
      await cart.populate("items.product", "name slug thumbnail images stock sellingPrice MRP");

      return res.json({
        success: true,
        message: "Cart updated.",
        cart,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: "Failed to update item quantity." });
    }
  }

  public static async removeItem(req: AuthenticatedRequest, res: Response) {
    try {
      const { itemId } = req.params;
      const { guestSessionId } = req.query;

      let cart = null;
      if (req.user) {
        cart = await Cart.findOne({ user: req.user._id });
      } else if (guestSessionId) {
        cart = await Cart.findOne({ guestSessionId: guestSessionId as string });
      }

      if (!cart) return res.status(404).json({ success: false, message: "Cart not found." });

      cart.items = cart.items.filter((i: any) => i._id.toString() !== itemId);

      await CartController.recalculateCart(cart);
      await cart.populate("items.product", "name slug thumbnail images stock sellingPrice MRP");

      return res.json({
        success: true,
        message: "Item removed from cart.",
        cart,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: "Failed to remove item." });
    }
  }

  public static async applyCoupon(req: AuthenticatedRequest, res: Response) {
    try {
      const { code, guestSessionId } = req.body;
      if (!code) return res.status(400).json({ success: false, message: "Coupon code is required." });

      const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), isActive: true });
      if (!coupon) {
        return res.status(400).json({ success: false, message: "Invalid or expired coupon code." });
      }

      let cart = null;
      if (req.user) {
        cart = await Cart.findOne({ user: req.user._id });
      } else if (guestSessionId) {
        cart = await Cart.findOne({ guestSessionId });
      }

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, message: "Cart is empty." });
      }

      const rawSubtotal = cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      if (rawSubtotal < coupon.minCartValue) {
        return res.status(400).json({
          success: false,
          message: `Minimum order value for ${coupon.code} is ₹${coupon.minCartValue}. Add ₹${coupon.minCartValue - rawSubtotal} more.`,
        });
      }

      cart.couponCode = coupon.code;
      await CartController.recalculateCart(cart);
      await cart.populate("items.product", "name slug thumbnail images stock sellingPrice MRP");

      return res.json({
        success: true,
        message: `Coupon ${coupon.code} applied! Saved ₹${cart.couponDiscount}.`,
        cart,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: "Failed to apply coupon." });
    }
  }

  public static async removeCoupon(req: AuthenticatedRequest, res: Response) {
    try {
      const { guestSessionId } = req.body;

      let cart = null;
      if (req.user) {
        cart = await Cart.findOne({ user: req.user._id });
      } else if (guestSessionId) {
        cart = await Cart.findOne({ guestSessionId });
      }

      if (!cart) return res.status(404).json({ success: false, message: "Cart not found." });

      cart.couponCode = undefined;
      cart.couponDiscount = 0;

      await CartController.recalculateCart(cart);
      await cart.populate("items.product", "name slug thumbnail images stock sellingPrice MRP");

      return res.json({
        success: true,
        message: "Coupon removed.",
        cart,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: "Failed to remove coupon." });
    }
  }
}
