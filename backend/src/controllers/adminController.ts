import { Response } from "express";
import { Product } from "../models/Product";
import { Variant } from "../models/Variant";
import { Order } from "../models/Order";
import { User } from "../models/User";
import { Coupon } from "../models/Coupon";
import { InventoryLog } from "../models/InventoryLog";
import { Redirect } from "../models/Redirect";
import { AdminAuditLog } from "../models/AdminAuditLog";
import { SeoService } from "../services/seoService";
import { InventoryService } from "../services/inventoryService";
import { AuthenticatedRequest, logAdminAction } from "../middlewares/auth";

export class AdminController {
  public static async getDashboardAnalytics(req: AuthenticatedRequest, res: Response) {
    try {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const [
        totalOrders,
        paidOrders,
        todayOrders,
        lowStockProducts,
        recentOrders,
        coupons,
        allProducts,
      ] = await Promise.all([
        Order.countDocuments(),
        Order.find({ paymentStatus: "paid" }).lean(),
        Order.find({ createdAt: { $gte: startOfToday } }).lean(),
        Product.find({ stock: { $lte: 5 } }).select("name sku stock lowStockThreshold thumbnail").lean(),
        Order.find().sort({ createdAt: -1 }).limit(8).lean(),
        Coupon.find().sort({ usedCount: -1 }).limit(5).lean(),
        Product.find().select("name slug shortDescription bulletPoints images ingredients seo status").lean(),
      ]);

      const totalRevenue = paidOrders.reduce((sum, o) => sum + o.pricing.grandTotal, 0);
      const unitsSold = paidOrders.reduce(
        (sum, o) => sum + o.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
        0
      );
      const aov = paidOrders.length > 0 ? Math.round(totalRevenue / paidOrders.length) : 0;

      const todayRevenue = todayOrders
        .filter((o) => o.paymentStatus === "paid")
        .reduce((sum, o) => sum + o.pricing.grandTotal, 0);

      const pendingOrders = await Order.countDocuments({ paymentStatus: "pending" });
      const processingOrders = await Order.countDocuments({ fulfillmentStatus: "processing" });
      const shippedOrders = await Order.countDocuments({ fulfillmentStatus: "shipped" });

      // SEO Health Audit
      let seoReady = 0;
      let seoNeedsAttention = 0;
      let seoCritical = 0;

      for (const prod of allProducts) {
        const audit = SeoService.auditProductSeo(prod as any);
        if (audit.status === "READY") seoReady++;
        else if (audit.status === "NEEDS_ATTENTION") seoNeedsAttention++;
        else seoCritical++;
      }

      return res.json({
        success: true,
        analytics: {
          totalRevenue: Math.round(totalRevenue),
          totalOrders,
          aov,
          unitsSold,
          today: {
            orders: todayOrders.length,
            revenue: Math.round(todayRevenue),
            pendingOrders,
            processingOrders,
            shippedOrders,
          },
          lowStockProducts,
          recentOrders,
          topCoupons: coupons,
          seoHealth: {
            ready: seoReady,
            needsAttention: seoNeedsAttention,
            critical: seoCritical,
            total: allProducts.length,
          },
        },
      });
    } catch (err: any) {
      console.error("[Admin] Analytics error:", err);
      return res.status(500).json({ success: false, message: "Failed to generate dashboard analytics." });
    }
  }

  // ==================== PRODUCT CRUD ====================

  public static async createProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const payload = req.body;

      if (!payload.name || !payload.sku || !payload.category || payload.MRP === undefined || payload.sellingPrice === undefined) {
        return res.status(400).json({
          success: false,
          message: "Product name, SKU, category, MRP, and selling price are required.",
        });
      }

      // Generate slug if not provided
      if (!payload.slug) {
        payload.slug = payload.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      }

      // Automatically run SEO Quality Gate
      const seoAudit = SeoService.auditProductSeo(payload);

      // Auto-generate canonical URL if empty
      if (!payload.seo) payload.seo = {};
      if (!payload.seo.canonicalUrl) {
        payload.seo.canonicalUrl = `https://www.seedcosmetics.in/products/${payload.slug}`;
      }
      if (!payload.seo.title) {
        payload.seo.title = `${payload.name} | Seed Cosmetics India`;
      }
      if (!payload.seo.metaDescription && payload.shortDescription) {
        payload.seo.metaDescription = payload.shortDescription.slice(0, 160);
      }

      const product = await Product.create(payload);

      // Log initial stock movement
      if (product.stock > 0) {
        await InventoryLog.create({
          productId: product._id,
          sku: product.sku,
          change: product.stock,
          previousStock: 0,
          newStock: product.stock,
          reason: "restock",
          referenceId: "Initial product stock creation",
          actor: req.user?.email || "Admin",
        });
      }

      await logAdminAction(req, "CREATE", "Product", product._id.toString(), { name: product.name, sku: product.sku });

      return res.status(201).json({
        success: true,
        message: "Product created successfully.",
        product,
        seoAudit,
      });
    } catch (err: any) {
      console.error("[Admin] Product creation error:", err);
      return res.status(400).json({ success: false, message: err.message || "Failed to create product." });
    }
  }

  public static async updateProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const payload = req.body;

      const product = await Product.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
      if (!product) return res.status(404).json({ success: false, message: "Product not found." });

      const seoAudit = SeoService.auditProductSeo(product);
      await logAdminAction(req, "UPDATE", "Product", product._id.toString(), { name: product.name });

      return res.json({
        success: true,
        message: "Product updated successfully.",
        product,
        seoAudit,
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message || "Failed to update product." });
    }
  }

  public static async deleteProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const product = await Product.findByIdAndDelete(id);
      if (!product) return res.status(404).json({ success: false, message: "Product not found." });

      await Variant.deleteMany({ productId: id });
      await logAdminAction(req, "DELETE", "Product", id, { name: product.name, sku: product.sku });

      return res.json({
        success: true,
        message: `Product ${product.name} deleted.`,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: "Failed to delete product." });
    }
  }

  public static async updateProductStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ success: false, message: "Product not found." });

      product.status = status;
      if (status === "published" && !product.publishedAt) {
        product.publishedAt = new Date();
      }
      await product.save();

      await logAdminAction(req, "UPDATE_STATUS", "Product", id, { status });

      return res.json({
        success: true,
        message: `Product status updated to ${status}.`,
        product,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: "Failed to change status." });
    }
  }

  // ==================== INVENTORY ====================

  public static async getInventory(req: AuthenticatedRequest, res: Response) {
    try {
      const { lowStockOnly } = req.query;
      const filter: any = {};
      if (lowStockOnly === "true") {
        filter.stock = { $lte: 5 };
      }

      const products = await Product.find(filter)
        .select("name sku stock lowStockThreshold thumbnail sellingPrice MRP category")
        .populate("category", "name")
        .sort({ stock: 1 })
        .lean();

      const variants = await Variant.find()
        .populate("productId", "name sku")
        .lean();

      return res.json({
        success: true,
        products,
        variants,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: "Failed to fetch inventory." });
    }
  }

  public static async adjustStock(req: AuthenticatedRequest, res: Response) {
    try {
      const { productId, variantId, sku, newStock, reason, note } = req.body;

      if (!productId || !sku || newStock === undefined || !reason) {
        return res.status(400).json({ success: false, message: "Product ID, SKU, newStock, and reason are required." });
      }

      const log = await InventoryService.adjustStockManually({
        productId,
        variantId,
        sku,
        newStock: Number(newStock),
        reason,
        note,
        actor: req.user?.email || "Admin",
      });

      await logAdminAction(req, "ADJUST_STOCK", "Inventory", productId, { sku, newStock, reason });

      return res.json({
        success: true,
        message: `Stock updated for SKU ${sku} to ${newStock} units.`,
        log,
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message || "Failed to adjust stock." });
    }
  }

  public static async getInventoryLogs(req: AuthenticatedRequest, res: Response) {
    try {
      const { sku } = req.query;
      const filter: any = {};
      if (sku) filter.sku = sku;

      const logs = await InventoryLog.find(filter).sort({ createdAt: -1 }).limit(50).lean();
      return res.json({ success: true, logs });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: "Failed to load inventory logs." });
    }
  }

  // ==================== ORDERS ====================

  public static async getOrders(req: AuthenticatedRequest, res: Response) {
    try {
      const { search, paymentStatus, fulfillmentStatus, page = "1", limit = "20" } = req.query;
      const filter: any = {};

      if (paymentStatus) filter.paymentStatus = paymentStatus;
      if (fulfillmentStatus) filter.fulfillmentStatus = fulfillmentStatus;

      if (search) {
        const regex = new RegExp((search as string).trim(), "i");
        filter.$or = [
          { orderNumber: regex },
          { customerName: regex },
          { customerEmail: regex },
          { customerPhone: regex },
          { "items.sku": regex },
        ];
      }

      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const skip = (pageNum - 1) * limitNum;

      const [orders, total] = await Promise.all([
        Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
        Order.countDocuments(filter),
      ]);

      return res.json({
        success: true,
        orders,
        pagination: {
          total,
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: "Failed to fetch orders." });
    }
  }

  public static async updateOrderStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { orderNumber } = req.params;
      const { fulfillmentStatus, paymentStatus, courier, trackingNumber, note } = req.body;

      const order = await Order.findOne({ orderNumber });
      if (!order) return res.status(404).json({ success: false, message: "Order not found." });

      const prevFulfillment = order.fulfillmentStatus;

      if (fulfillmentStatus) order.fulfillmentStatus = fulfillmentStatus;
      if (paymentStatus) order.paymentStatus = paymentStatus;
      if (courier) order.courier = courier;
      if (trackingNumber) order.trackingNumber = trackingNumber;

      const statusNote = note || `Status updated to ${fulfillmentStatus || paymentStatus}`;
      order.timeline.push({
        status: fulfillmentStatus ? `Fulfillment: ${fulfillmentStatus}` : `Payment: ${paymentStatus}`,
        note: statusNote,
        timestamp: new Date(),
        actor: req.user?.email || "Admin",
      });

      // If order is cancelled, automatically restore stock
      if (fulfillmentStatus === "cancelled" && prevFulfillment !== "cancelled") {
        await InventoryService.restoreStockForOrder(
          order.items,
          order.orderNumber,
          req.user?.email || "Admin",
          "order_cancelled"
        );
        order.timeline.push({
          status: "Stock Restored",
          note: "Items returned to inventory due to order cancellation.",
          timestamp: new Date(),
          actor: "Inventory System",
        });
      }

      await order.save();
      await logAdminAction(req, "UPDATE_ORDER", "Order", orderNumber, { fulfillmentStatus, paymentStatus });

      return res.json({
        success: true,
        message: "Order updated successfully.",
        order,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: "Failed to update order status." });
    }
  }

  // ==================== COUPONS ====================

  public static async getCoupons(req: AuthenticatedRequest, res: Response) {
    try {
      const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
      return res.json({ success: true, coupons });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: "Failed to load coupons." });
    }
  }

  public static async createCoupon(req: AuthenticatedRequest, res: Response) {
    try {
      const payload = req.body;
      payload.code = payload.code?.toUpperCase().trim();

      const existing = await Coupon.findOne({ code: payload.code });
      if (existing) {
        return res.status(400).json({ success: false, message: `Coupon ${payload.code} already exists.` });
      }

      const coupon = await Coupon.create(payload);
      await logAdminAction(req, "CREATE_COUPON", "Coupon", coupon._id.toString(), { code: coupon.code });

      return res.status(201).json({
        success: true,
        message: `Coupon ${coupon.code} created.`,
        coupon,
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message || "Failed to create coupon." });
    }
  }

  public static async toggleCoupon(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const coupon = await Coupon.findById(id);
      if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found." });

      coupon.isActive = !coupon.isActive;
      await coupon.save();

      return res.json({
        success: true,
        message: `Coupon ${coupon.code} is now ${coupon.isActive ? "active" : "inactive"}.`,
        coupon,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: "Failed to toggle coupon status." });
    }
  }

  // ==================== SEO & AUDIT ====================

  public static async getSeoReport(req: AuthenticatedRequest, res: Response) {
    try {
      const products = await Product.find().select("name slug shortDescription bulletPoints images ingredients seo status").lean();
      const report = products.map((prod) => {
        const audit = SeoService.auditProductSeo(prod as any);
        return {
          id: prod._id,
          name: prod.name,
          slug: prod.slug,
          publishingStatus: prod.status,
          score: audit.score,
          seoStatus: audit.status,
          issues: audit.issues,
        };
      });

      return res.json({
        success: true,
        report,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: "Failed to generate SEO report." });
    }
  }
}
