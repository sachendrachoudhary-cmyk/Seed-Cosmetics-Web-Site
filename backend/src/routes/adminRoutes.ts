import { Router } from "express";
import { AdminController } from "../controllers/adminController";
import { ContentController } from "../controllers/contentController";
import { authenticate, requireRole } from "../middlewares/auth";

const router = Router();

// Protect all admin routes with authentication and role check
router.use(authenticate);
router.use(requireRole("admin", "product_admin", "content_admin", "operations"));

// Dashboard & Analytics
router.get("/dashboard", AdminController.getDashboardAnalytics);

// Product Management
router.post("/products", requireRole("admin", "product_admin"), AdminController.createProduct);
router.put("/products/:id", requireRole("admin", "product_admin"), AdminController.updateProduct);
router.patch("/products/:id/status", requireRole("admin", "product_admin"), AdminController.updateProductStatus);
router.delete("/products/:id", requireRole("admin"), AdminController.deleteProduct);

// Inventory
router.get("/inventory", AdminController.getInventory);
router.post("/inventory/adjust", requireRole("admin", "operations", "product_admin"), AdminController.adjustStock);
router.get("/inventory/logs", AdminController.getInventoryLogs);

// Orders
router.get("/orders", AdminController.getOrders);
router.put("/orders/:orderNumber/status", requireRole("admin", "operations"), AdminController.updateOrderStatus);

// Coupons
router.get("/coupons", AdminController.getCoupons);
router.post("/coupons", requireRole("admin"), AdminController.createCoupon);
router.patch("/coupons/:id/toggle", requireRole("admin"), AdminController.toggleCoupon);

// Content CMS
router.post("/content", requireRole("admin", "content_admin"), ContentController.createContent);

// SEO
router.get("/seo/report", AdminController.getSeoReport);

export default router;
