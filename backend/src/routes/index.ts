import { Router } from "express";
import authRoutes from "./authRoutes";
import productRoutes from "./productRoutes";
import cartRoutes from "./cartRoutes";
import checkoutRoutes from "./checkoutRoutes";
import orderRoutes from "./orderRoutes";
import adminRoutes from "./adminRoutes";
import contentRoutes from "./contentRoutes";
import { CheckoutController } from "../controllers/checkoutController";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/checkout", checkoutRoutes);
router.use("/orders", orderRoutes);
router.use("/admin", adminRoutes);
router.use("/content", contentRoutes);
router.post("/webhooks/razorpay", CheckoutController.handleWebhook);

export default router;
