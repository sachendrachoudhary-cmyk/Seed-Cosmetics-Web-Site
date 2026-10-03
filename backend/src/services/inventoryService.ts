import { Product } from "../models/Product";
import { Variant } from "../models/Variant";
import { InventoryLog } from "../models/InventoryLog";

export class InventoryService {
  public static async validateItemsStock(items: Array<{ productId: string; variantId?: string; quantity: number }>) {
    for (const item of items) {
      if (item.variantId) {
        const variant = await Variant.findById(item.variantId);
        if (!variant) {
          throw new Error(`Variant not found for item: ${item.productId}`);
        }
        if (variant.stock < item.quantity) {
          throw new Error(`Insufficient stock for "${variant.title}". Available: ${variant.stock}, requested: ${item.quantity}`);
        }
      } else {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${item.quantity}`);
        }
      }
    }
  }

  public static async decrementStockForOrder(
    items: Array<{ product: any; variantId?: string; sku: string; quantity: number }>,
    orderNumber: string,
    actor = "system"
  ) {
    for (const item of items) {
      const prodId = item.product._id || item.product;
      if (item.variantId) {
        const variant = await Variant.findById(item.variantId);
        if (variant) {
          const prev = variant.stock;
          variant.stock = Math.max(0, variant.stock - item.quantity);
          await variant.save();

          await InventoryLog.create({
            productId: prodId,
            variantId: item.variantId,
            sku: variant.sku,
            change: -item.quantity,
            previousStock: prev,
            newStock: variant.stock,
            reason: "order_placed",
            referenceId: orderNumber,
            actor,
          });
        }
      } else {
        const product = await Product.findById(prodId);
        if (product) {
          const prev = product.stock;
          product.stock = Math.max(0, product.stock - item.quantity);
          await product.save();

          await InventoryLog.create({
            productId: prodId,
            sku: product.sku,
            change: -item.quantity,
            previousStock: prev,
            newStock: product.stock,
            reason: "order_placed",
            referenceId: orderNumber,
            actor,
          });
        }
      }
    }
  }

  public static async restoreStockForOrder(
    items: Array<{ product: any; variantId?: string; sku: string; quantity: number }>,
    orderNumber: string,
    actor = "admin",
    reason: "order_cancelled" | "return" = "order_cancelled"
  ) {
    for (const item of items) {
      const prodId = item.product._id || item.product;
      if (item.variantId) {
        const variant = await Variant.findById(item.variantId);
        if (variant) {
          const prev = variant.stock;
          variant.stock += item.quantity;
          await variant.save();

          await InventoryLog.create({
            productId: prodId,
            variantId: item.variantId,
            sku: variant.sku,
            change: item.quantity,
            previousStock: prev,
            newStock: variant.stock,
            reason,
            referenceId: orderNumber,
            actor,
          });
        }
      } else {
        const product = await Product.findById(prodId);
        if (product) {
          const prev = product.stock;
          product.stock += item.quantity;
          await product.save();

          await InventoryLog.create({
            productId: prodId,
            sku: product.sku,
            change: item.quantity,
            previousStock: prev,
            newStock: product.stock,
            reason,
            referenceId: orderNumber,
            actor,
          });
        }
      }
    }
  }

  public static async adjustStockManually(params: {
    productId: string;
    variantId?: string;
    sku: string;
    newStock: number;
    reason: "manual_adjustment" | "restock" | "damaged";
    note?: string;
    actor: string;
  }) {
    const { productId, variantId, sku, newStock, reason, note, actor } = params;

    if (variantId) {
      const variant = await Variant.findById(variantId);
      if (!variant) throw new Error("Variant not found");
      const prev = variant.stock;
      const change = newStock - prev;
      variant.stock = newStock;
      await variant.save();

      return await InventoryLog.create({
        productId,
        variantId,
        sku,
        change,
        previousStock: prev,
        newStock,
        reason,
        referenceId: note,
        actor,
      });
    } else {
      const product = await Product.findById(productId);
      if (!product) throw new Error("Product not found");
      const prev = product.stock;
      const change = newStock - prev;
      product.stock = newStock;
      await product.save();

      return await InventoryLog.create({
        productId,
        sku,
        change,
        previousStock: prev,
        newStock,
        reason,
        referenceId: note,
        actor,
      });
    }
  }
}
