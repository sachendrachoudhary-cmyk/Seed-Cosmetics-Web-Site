import { Request, Response } from "express";
import { Order } from "../models/Order";
import { AuthenticatedRequest } from "../middlewares/auth";

export class OrderController {
  public static async getMyOrders(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });

      const orders = await Order.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .lean();

      return res.json({
        success: true,
        orders,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: "Failed to retrieve order history." });
    }
  }

  public static async getOrderDetails(req: AuthenticatedRequest, res: Response) {
    try {
      const { orderNumber } = req.params;

      const order = await Order.findOne({ orderNumber }).populate("items.product", "name slug thumbnail");
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found." });
      }

      // Check ownership if user is logged in and not admin
      if (req.user && req.user.role === "customer" && order.user && order.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "Access forbidden." });
      }

      return res.json({
        success: true,
        order,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: "Failed to load order details." });
    }
  }

  public static async trackOrder(req: Request, res: Response) {
    try {
      const { orderNumber, phoneOrEmail } = req.body;

      if (!orderNumber) {
        return res.status(400).json({ success: false, message: "Order number is required." });
      }

      const query: any = { orderNumber: orderNumber.toUpperCase().trim() };
      if (phoneOrEmail) {
        const val = phoneOrEmail.trim().toLowerCase();
        query.$or = [{ customerEmail: val }, { customerPhone: val }];
      }

      const order = await Order.findOne(query).select(
        "orderNumber customerName fulfillmentStatus paymentStatus trackingNumber courier timeline createdAt items pricing"
      );

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "No order found matching the provided details. Please verify your order number.",
        });
      }

      return res.json({
        success: true,
        order,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: "Tracking lookup failed." });
    }
  }
}
