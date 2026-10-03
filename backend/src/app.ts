import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import routes from "./routes";
import { ContentController } from "./controllers/contentController";

const app = express();

// Security & Optimization Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(compression());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Technical SEO Root Endpoints
app.get("/robots.txt", ContentController.getRobotsTxt);
app.get("/sitemap.xml", ContentController.getSitemapXml);

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    brand: "Seed Cosmetics",
    tagline: "Care Begins Here.",
    market: "India",
    currency: "INR",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api", routes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("[ServerError]", err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "An unexpected error occurred. Please contact care@seedcosmetics.in",
  });
});

export default app;
