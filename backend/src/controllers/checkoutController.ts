import { Request, Response } from "express";
import { Order, IOrder } from "../models/Order";
import { Cart } from "../models/Cart";
import { Product } from "../models/Product";
import { Variant } from "../models/Variant";
import { Coupon } from "../models/Coupon";
import { Payment } from "../models/Payment";
import { PricingEngine } from "../services/pricingEngine";
import { RazorpayService } from "../services/razorpayService";
import { InventoryService } from "../services/inventoryService";
import { AuthenticatedRequest } from "../middlewares/auth";

export class CheckoutController {
  public static async validateCheckout(req: AuthenticatedRequest, res: Response) {
    try {
      const { guestSessionId, shippingAddress } = req.body;

      let cart = null;
      if (req.user) {
        cart = await Cart.findOne({ user: req.user._id });
      } else if (guestSessionId) {
        cart = await Cart.findOne({ guestSessionId });
      }

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, message: "Your cart is empty." });
      }

      // Check stock
      await InventoryService.validateItemsStock(
        cart.items.map((i) => ({ productId: i.product.toString(), variantId: i.variantId, quantity: i.quantity }))
      );

      // Authoritative pricing
      let coupon = null;
      if (cart.couponCode) {
        coupon = await Coupon.findOne({ code: cart.couponCode, isActive: true });
      }

      const pricing = PricingEngine.calculateCartTotals(
        cart.items.map((i) => ({ unitPrice: i.unitPrice, quantity: i.quantity })),
        coupon
      );

      return res.json({
        success: true,
        pricing,
        itemsCount: cart.items.reduce((s, i) => s + i.quantity, 0),
        shippingAddressValid: Boolean(shippingAddress?.fullName && shippingAddress?.pincode),
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message || "Checkout validation failed." });
    }
  }

  public static async createRazorpayOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const { guestSessionId, customerName, customerEmail, customerPhone, shippingAddress, paymentMethod = "razorpay" } = req.body;

      let cart = null;
      if (req.user) {
        cart = await Cart.findOne({ user: req.user._id });
      } else if (guestSessionId) {
        cart = await Cart.findOne({ guestSessionId });
      }

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, message: "Cart is empty." });
      }

      const name = req.user?.name || customerName || shippingAddress?.fullName;
      const email = req.user?.email || customerEmail;
      const phone = req.user?.phone || customerPhone || shippingAddress?.phone;

      if (!name || !email || !phone || !shippingAddress?.addressLine1 || !shippingAddress?.city || !shippingAddress?.pincode) {
        return res.status(400).json({ success: false, message: "Complete customer name, email, phone, and delivery address are required." });
      }

      // 1. Validate stock
      await InventoryService.validateItemsStock(
        cart.items.map((i) => ({ productId: i.product.toString(), variantId: i.variantId, quantity: i.quantity }))
      );

      // 2. Authoritative pricing calculation
      let coupon = null;
      if (cart.couponCode) {
        coupon = await Coupon.findOne({ code: cart.couponCode, isActive: true });
      }

      // Snapshot items with live product data
      const orderItems = [];
      for (const item of cart.items) {
        const prod = await Product.findById(item.product);
        if (!prod) continue;

        let price = prod.sellingPrice;
        let mrp = prod.MRP;
        let sku = prod.sku;
        let variantTitle = undefined;

        if (item.variantId) {
          const variant = await Variant.findById(item.variantId);
          if (variant) {
            price = variant.price;
            mrp = variant.mrp;
            sku = variant.sku;
            variantTitle = variant.title;
          }
        }

        orderItems.push({
          product: prod._id,
          variantId: item.variantId,
          name: prod.name,
          sku,
          image: prod.thumbnail || prod.images[0]?.url,
          variantTitle,
          price,
          mrp,
          quantity: item.quantity,
          lineTotal: Math.round(price * item.quantity * 100) / 100,
        });
      }

      const pricing = PricingEngine.calculateCartTotals(
        orderItems.map((i) => ({ unitPrice: i.price, quantity: i.quantity })),
        coupon
      );

      const orderNumber = `SC-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

      // 3. Create Razorpay order
      const rzpOrder = await RazorpayService.createOrder({
        amount: pricing.grandTotal,
        receipt: orderNumber,
        notes: {
          customerEmail: email,
          customerName: name,
        },
      });

      // 4. Save Order in DB
      const order = await Order.create({
        orderNumber,
        user: req.user?._id,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        items: orderItems,
        shippingAddress,
        pricing: {
          subtotal: pricing.subtotal,
          discount: pricing.discount,
          couponCode: pricing.couponCode,
          shippingFee: pricing.shippingFee,
          tax: pricing.tax,
          grandTotal: pricing.grandTotal,
        },
        paymentStatus: "pending",
        fulfillmentStatus: "unfulfilled",
        paymentMethod: "razorpay",
        razorpayOrderId: rzpOrder.id,
        timeline: [
          {
            status: "Order Created",
            note: `Order initiated with total ₹${pricing.grandTotal}. Awaiting payment confirmation.`,
            actor: name,
          },
        ],
      });

      return res.status(201).json({
        success: true,
        orderNumber: order.orderNumber,
        orderId: order._id,
        razorpayOrderId: rzpOrder.id,
        amount: Math.round(pricing.grandTotal * 100), // in paise
        currency: "INR",
        keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_SeedCosmeticsKey123",
        isMock: rzpOrder.isMock,
        pricing,
      });
    } catch (err: any) {
      console.error("[Checkout] Create Razorpay order error:", err);
      return res.status(500).json({ success: false, message: err.message || "Failed to initialize payment." });
    }
  }

  public static async verifyPayment(req: AuthenticatedRequest, res: Response) {
    try {
      const { orderNumber, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

      if (!orderNumber || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return res.status(400).json({ success: false, message: "Incomplete payment verification payload." });
      }

      const order = await Order.findOne({ orderNumber, razorpayOrderId });
      if (!order) {
        return res.status(404).json({ success: false, message: "Order matching payment was not found." });
      }

      if (order.paymentStatus === "paid") {
        return res.json({ success: true, message: "Payment already verified.", orderNumber: order.orderNumber });
      }

      // Verify signature securely
      const isValid = RazorpayService.verifyPaymentSignature({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      });

      if (!isValid) {
        order.paymentStatus = "failed";
        order.timeline.push({
          status: "Payment Failed",
          note: `Payment verification failed for Razorpay ID ${razorpayPaymentId}.`,
          timestamp: new Date(),
          actor: "Razorpay Gateway",
        });
        await order.save();
        return res.status(400).json({ success: false, message: "Payment signature verification failed." });
      }

      // 1. Update Order
      order.paymentStatus = "paid";
      order.fulfillmentStatus = "processing";
      order.razorpayPaymentId = razorpayPaymentId;
      order.razorpaySignature = razorpaySignature;
      order.timeline.push({
        status: "Payment Confirmed",
        note: `Paid ₹${order.pricing.grandTotal} via Razorpay (Payment ID: ${razorpayPaymentId}).`,
        timestamp: new Date(),
        actor: "Razorpay Gateway",
      });
      await order.save();

      // 2. Decrement inventory atomically
      await InventoryService.decrementStockForOrder(order.items, order.orderNumber, order.customerName);

      // 3. Record Payment transaction
      await Payment.create({
        orderId: order._id,
        orderNumber: order.orderNumber,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        amount: order.pricing.grandTotal,
        currency: "INR",
        status: "captured",
        method: "razorpay",
      });

      // 4. Update coupon usage if applicable
      if (order.pricing.couponCode) {
        await Coupon.findOneAndUpdate(
          { code: order.pricing.couponCode },
          { $inc: { usedCount: 1 } }
        );
      }

      // 5. Clear user/guest cart
      if (order.user) {
        await Cart.findOneAndDelete({ user: order.user });
      }

      return res.json({
        success: true,
        message: "Payment successfully verified! Your order is being processed.",
        orderNumber: order.orderNumber,
        orderId: order._id,
      });
    } catch (err: any) {
      console.error("[Checkout] Payment verification error:", err);
      return res.status(500).json({ success: false, message: "Payment verification processing failed." });
    }
  }

  public static async handleWebhook(req: Request, res: Response) {
    try {
      const signature = req.headers["x-razorpay-signature"] as string;
      const rawBody = JSON.stringify(req.body);

      if (!signature || !RazorpayService.verifyWebhookSignature(rawBody, signature)) {
        return res.status(400).json({ success: false, message: "Invalid webhook signature." });
      }

      const event = req.body.event;
      const payload = req.body.payload;

      console.log(`[Razorpay Webhook] Received verified event: ${event}`);

      if (event === "payment.captured") {
        const paymentEntity = payload.payment.entity;
        const razorpayOrderId = paymentEntity.order_id;
        const paymentId = paymentEntity.id;

        const order = await Order.findOne({ razorpayOrderId });
        if (order && order.paymentStatus !== "paid") {
          order.paymentStatus = "paid";
          order.fulfillmentStatus = "processing";
          order.razorpayPaymentId = paymentId;
          order.timeline.push({
            status: "Payment Captured (Webhook)",
            note: `Payment verified via webhook event (ID: ${paymentId}).`,
            timestamp: new Date(),
            actor: "Razorpay Webhook",
          });
          await order.save();
          await InventoryService.decrementStockForOrder(order.items, order.orderNumber, "Webhook");
        }
      }

      return res.json({ status: "ok" });
    } catch (err: any) {
      console.error("[Razorpay Webhook] Processing error:", err);
      return res.status(500).json({ success: false, message: "Webhook processing error." });
    }
  }
}
