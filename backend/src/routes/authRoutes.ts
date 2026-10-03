import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/me", authenticate, AuthController.getMe);
router.put("/profile", authenticate, AuthController.updateProfile);
router.post("/addresses", authenticate, AuthController.addAddress);
router.delete("/addresses/:addressId", authenticate, AuthController.deleteAddress);

export default router;
