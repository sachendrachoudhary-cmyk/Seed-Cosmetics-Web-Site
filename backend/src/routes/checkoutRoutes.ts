import { Router } from "express";
import { CheckoutController } from "../controllers/checkoutController";
import { optionalAuth } from "../middlewares/auth";

const router = Router();

router.post("/validate", optionalAuth, CheckoutController.validateCheckout);
router.post("/razorpay/order", optionalAuth, CheckoutController.createRazorpayOrder);
router.post("/razorpay/verify", optionalAuth, CheckoutController.verifyPayment);

export default router;
