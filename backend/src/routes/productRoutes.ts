import { Router } from "express";
import { ProductController } from "../controllers/productController";
import { optionalAuth } from "../middlewares/auth";

const router = Router();

router.get("/", ProductController.getProducts);
router.get("/showcase", ProductController.getFeaturedAndBestsellers);
router.get("/search", ProductController.search);
router.get("/:slug", ProductController.getProductBySlug);
router.post("/:slug/reviews", optionalAuth, ProductController.submitReview);

export default router;
