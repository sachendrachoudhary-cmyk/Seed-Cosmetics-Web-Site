import { Router } from "express";
import { OrderController } from "../controllers/orderController";
import { authenticate, optionalAuth } from "../middlewares/auth";

const router = Router();

router.get("/me", authenticate, OrderController.getMyOrders);
router.post("/track", OrderController.trackOrder);
router.get("/:orderNumber", optionalAuth, OrderController.getOrderDetails);

export default router;
