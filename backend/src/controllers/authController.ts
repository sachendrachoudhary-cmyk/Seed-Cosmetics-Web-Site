import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User, IUser } from "../models/User";
import { generateToken, AuthenticatedRequest } from "../middlewares/auth";

export class AuthController {
  public static async register(req: Request, res: Response) {
    try {
      const { name, email, password, phone } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "Name, email, and password are required." });
      }

      if (password.length < 6) {
        return res.status(400).json({ success: false, message: "Password must be at least 6 characters long." });
      }

      const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
      if (existingUser) {
        return res.status(400).json({ success: false, message: "An account with this email already exists." });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Check if this is the first user; if so, assign admin role
      const userCount = await User.countDocuments();
      const role = userCount === 0 ? "admin" : "customer";

      const user = await User.create({
        name,
        email: email.toLowerCase().trim(),
        passwordHash,
        phone,
        role,
      });

      const token = generateToken(user);

      return res.status(201).json({
        success: true,
        message: "Account registered successfully.",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          addresses: user.addresses,
        },
      });
    } catch (err: any) {
      console.error("[Auth] Registration error:", err);
      return res.status(500).json({ success: false, message: "Registration failed. Please try again." });
    }
  }

  public static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required." });
      }

      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) {
        return res.status(401).json({ success: false, message: "Invalid email or password." });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid email or password." });
      }

      const token = generateToken(user);

      return res.json({
        success: true,
        message: "Logged in successfully.",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          addresses: user.addresses,
        },
      });
    } catch (err: any) {
      console.error("[Auth] Login error:", err);
      return res.status(500).json({ success: false, message: "Login failed. Please try again." });
    }
  }

  public static async getMe(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }

      return res.json({
        success: true,
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          phone: req.user.phone,
          role: req.user.role,
          addresses: req.user.addresses,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: "Failed to fetch user profile" });
    }
  }

  public static async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });

      const { name, phone } = req.body;
      if (name) req.user.name = name;
      if (phone !== undefined) req.user.phone = phone;

      await req.user.save();

      return res.json({
        success: true,
        message: "Profile updated successfully.",
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          phone: req.user.phone,
          role: req.user.role,
          addresses: req.user.addresses,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: "Failed to update profile" });
    }
  }

  public static async addAddress(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });

      const { fullName, phone, addressLine1, addressLine2, city, state, pincode, country, isDefault } = req.body;

      if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
        return res.status(400).json({ success: false, message: "Please fill all required address fields." });
      }

      if (isDefault) {
        req.user.addresses.forEach((addr) => (addr.isDefault = false));
      }

      req.user.addresses.push({
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        pincode,
        country: country || "India",
        isDefault: isDefault ?? (req.user.addresses.length === 0),
      });

      await req.user.save();

      return res.status(201).json({
        success: true,
        message: "Address added successfully.",
        addresses: req.user.addresses,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: "Failed to add address" });
    }
  }

  public static async deleteAddress(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });

      const { addressId } = req.params;
      req.user.addresses = req.user.addresses.filter((addr: any) => addr._id.toString() !== addressId);
      await req.user.save();

      return res.json({
        success: true,
        message: "Address removed.",
        addresses: req.user.addresses,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: "Failed to remove address" });
    }
  }
}
