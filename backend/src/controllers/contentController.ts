import { Request, Response } from "express";
import { Content } from "../models/Content";
import { Category } from "../models/Category";
import { Collection } from "../models/Collection";
import { Product } from "../models/Product";
import { SeoService } from "../services/seoService";
import { AuthenticatedRequest, logAdminAction } from "../middlewares/auth";

export class ContentController {
  // Public categories
  public static async getCategories(req: Request, res: Response) {
    try {
      const categories = await Category.find().sort({ order: 1, name: 1 }).lean();
      return res.json({ success: true, categories });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: "Failed to fetch categories." });
    }
  }

  // Public collections
  public static async getCollections(req: Request, res: Response) {
    try {
      const collections = await Collection.find({ active: true })
        .populate("products", "name slug thumbnail sellingPrice MRP rating reviewCount")
        .sort({ order: 1 })
        .lean();
      return res.json({ success: true, collections });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: "Failed to fetch collections." });
    }
  }

  // Public content list
  public static async getContentList(req: Request, res: Response) {
    try {
      const { type = "guide", limit = "10" } = req.query;
      const content = await Content.find({ type, status: "published" })
        .sort({ publishedAt: -1, createdAt: -1 })
        .limit(parseInt(limit as string, 10))
        .lean();

      return res.json({ success: true, content });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: "Failed to fetch content." });
    }
  }

  // Public content by slug
  public static async getContentBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const item = await Content.findOne({ slug, status: "published" })
        .populate("relatedProducts", "name slug thumbnail sellingPrice MRP rating reviewCount");

      if (!item) {
        return res.status(404).json({ success: false, message: "Article or guide not found." });
      }

      return res.json({ success: true, content: item });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: "Failed to load content." });
    }
  }

  // XML Sitemap Generator
  public static async getSitemapXml(req: Request, res: Response) {
    try {
      const siteUrl = process.env.SITE_URL || "https://www.seedcosmetics.in";

      const [products, categories, guides] = await Promise.all([
        Product.find({ status: "published" }).select("slug updatedAt").lean(),
        Category.find().select("slug updatedAt").lean(),
        Content.find({ status: "published" }).select("slug updatedAt type").lean(),
      ]);

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      // Static routes
      const staticRoutes = [
        { path: "", priority: "1.0", changefreq: "daily" },
        { path: "/shop", priority: "0.9", changefreq: "daily" },
        { path: "/about-seed-cosmetics", priority: "0.7", changefreq: "monthly" },
        { path: "/faq", priority: "0.7", changefreq: "monthly" },
        { path: "/shipping-policy", priority: "0.5", changefreq: "yearly" },
        { path: "/returns-refunds", priority: "0.5", changefreq: "yearly" },
        { path: "/privacy-policy", priority: "0.5", changefreq: "yearly" },
        { path: "/terms", priority: "0.5", changefreq: "yearly" },
      ];

      for (const r of staticRoutes) {
        xml += `  <url>\n    <loc>${siteUrl}${r.path}</loc>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>\n`;
      }

      // Categories
      for (const c of categories) {
        xml += `  <url>\n    <loc>${siteUrl}/category/${c.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
      }

      // Products
      for (const p of products) {
        const lastMod = p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString();
        xml += `  <url>\n    <loc>${siteUrl}/products/${p.slug}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
      }

      // Guides
      for (const g of guides) {
        const lastMod = g.updatedAt ? new Date(g.updatedAt).toISOString() : new Date().toISOString();
        xml += `  <url>\n    <loc>${siteUrl}/guides/${g.slug}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
      }

      xml += `</urlset>`;

      res.header("Content-Type", "application/xml");
      return res.send(xml);
    } catch (err: any) {
      console.error("[Sitemap] Generation error:", err);
      return res.status(500).send("Error generating sitemap");
    }
  }

  // Robots.txt Generator
  public static async getRobotsTxt(req: Request, res: Response) {
    const siteUrl = process.env.SITE_URL || "https://www.seedcosmetics.in";
    const content = SeoService.generateRobotsTxt(siteUrl);
    res.header("Content-Type", "text/plain");
    return res.send(content);
  }

  // Admin Content Management
  public static async createContent(req: AuthenticatedRequest, res: Response) {
    try {
      const payload = req.body;
      if (!payload.title || !payload.body) {
        return res.status(400).json({ success: false, message: "Title and body are required." });
      }

      if (!payload.slug) {
        payload.slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      }

      const item = await Content.create(payload);
      await logAdminAction(req, "CREATE_CONTENT", "Content", item._id.toString(), { title: item.title });

      return res.status(201).json({ success: true, message: "Content published successfully.", content: item });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message || "Failed to create content." });
    }
  }
}
