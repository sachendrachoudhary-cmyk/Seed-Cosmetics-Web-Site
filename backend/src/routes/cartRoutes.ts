import { Router } from "express";
import { CartController } from "../controllers/cartController";
import { optionalAuth } from "../middlewares/auth";

const router = Router();

router.use(optionalAuth);

router.get("/", CartController.getCart);
router.post("/items", CartController.addItem);
router.put("/items/:itemId", CartController.updateItemQuantity);
router.delete("/items/:itemId", CartController.removeItem);
router.post("/coupon", CartController.applyCoupon);
router.delete("/coupon", CartController.removeCoupon);

export default router;
