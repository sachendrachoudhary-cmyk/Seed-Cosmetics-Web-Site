import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";
import { AdminAuditLog } from "../models/AdminAuditLog";

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

const JWT_SECRET = process.env.JWT_SECRET || "seed_cosmetics_jwt_super_secret_key_change_in_production";

export const generateToken = (user: IUser): string => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Authentication required. Please login." });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User account no longer exists." });
    }

    req.user = user;
    next();
  } catch (err: any) {
    return res.status(401).json({ success: false, message: "Invalid or expired token. Please log in again." });
  }
};

export const optionalAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
      }
    }
  } catch {
    // Ignore invalid token in optional auth
  }
  next();
};

export const requireRole = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }

    if (!roles.includes(req.user.role) && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: `Forbidden. This action requires one of the following roles: [${roles.join(", ")}]. Current role: ${req.user.role}`,
      });
    }

    next();
  };
};

export const logAdminAction = async (
  req: AuthenticatedRequest,
  action: string,
  resource: string,
  resourceId?: string,
  details?: any
) => {
  try {
    if (req.user) {
      await AdminAuditLog.create({
        actorId: req.user._id,
        actorEmail: req.user.email,
        actorRole: req.user.role,
        action,
        resource,
        resourceId,
        details,
        ipAddress: req.ip,
      });
    }
  } catch (err) {
    console.error("[AdminAuditLog] Failed to record log:", err);
  }
};
