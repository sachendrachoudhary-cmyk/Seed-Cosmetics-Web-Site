import { Request, Response } from "express";
import { Product } from "../models/Product";
import { Variant } from "../models/Variant";
import { Category } from "../models/Category";
import { Review } from "../models/Review";
import { SeoService } from "../services/seoService";
import { AuthenticatedRequest } from "../middlewares/auth";

export class ProductController {
  public static async getProducts(req: Request, res: Response) {
    try {
      const {
        category,
        collection,
        skinConcern,
        skinType,
        minPrice,
        maxPrice,
        sort = "popular",
        page = "1",
        limit = "12",
        status = "published",
      } = req.query;

      const filter: any = {};

      if (status) {
        filter.status = status;
      }

      if (category) {
        // Can be slug or ObjectId
        const cat = await Category.findOne({ slug: category as string });
        if (cat) {
          filter.category = cat._id;
        } else {
          filter.category = category;
        }
      }

      if (skinConcern) {
        const concerns = (skinConcern as string).split(",").map((c) => c.trim());
        filter.skinConcern = { $in: concerns };
      }

      if (skinType) {
        const types = (skinType as string).split(",").map((t) => t.trim());
        filter.skinType = { $in: types };
      }

      if (minPrice || maxPrice) {
        filter.sellingPrice = {};
        if (minPrice) filter.sellingPrice.$gte = Number(minPrice);
        if (maxPrice) filter.sellingPrice.$lte = Number(maxPrice);
      }

      let sortOptions: any = {};
      switch (sort) {
        case "price-asc":
          sortOptions = { sellingPrice: 1 };
          break;
        case "price-desc":
          sortOptions = { sellingPrice: -1 };
          break;
        case "newest":
          sortOptions = { createdAt: -1 };
          break;
        case "rating":
          sortOptions = { rating: -1, reviewCount: -1 };
          break;
        case "popular":
        default:
          sortOptions = { bestSeller: -1, rating: -1, createdAt: -1 };
          break;
      }

      const pageNum = Math.max(1, parseInt(page as string, 10));
      const limitNum = Math.max(1, Math.min(50, parseInt(limit as string, 10)));
      const skip = (pageNum - 1) * limitNum;

      const [products, totalCount] = await Promise.all([
        Product.find(filter)
          .populate("category", "name slug")
          .sort(sortOptions)
          .skip(skip)
          .limit(limitNum)
          .lean(),
        Product.countDocuments(filter),
      ]);

      return res.json({
        success: true,
        products,
        pagination: {
          totalCount,
          currentPage: pageNum,
          totalPages: Math.ceil(totalCount / limitNum),
          limit: limitNum,
        },
      });
    } catch (err: any) {
      console.error("[Products] Error fetching products:", err);
      return res.status(500).json({ success: false, message: "Failed to retrieve products." });
    }
  }

  public static async getProductBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;

      const product = await Product.findOne({ slug })
        .populate("category", "name slug")
        .populate("collectionRef", "name slug");

      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found." });
      }

      const [variants, reviews, relatedProducts] = await Promise.all([
        Variant.find({ productId: product._id }).sort({ price: 1 }).lean(),
        Review.find({ productId: product._id, status: "approved" }).sort({ createdAt: -1 }).limit(20).lean(),
        Product.find({
          _id: { $ne: product._id },
          category: product.category,
          status: "published",
        })
          .populate("category", "name slug")
          .limit(4)
          .lean(),
      ]);

      const jsonLd = SeoService.generateProductJsonLd(product, variants);

      return res.json({
        success: true,
        product,
        variants,
        reviews,
        relatedProducts,
        structuredData: jsonLd,
      });
    } catch (err: any) {
      console.error("[Products] Error fetching product by slug:", err);
      return res.status(500).json({ success: false, message: "Failed to retrieve product details." });
    }
  }

  public static async getFeaturedAndBestsellers(req: Request, res: Response) {
    try {
      const [bestSellers, newArrivals, featured] = await Promise.all([
        Product.find({ status: "published", bestSeller: true })
          .populate("category", "name slug")
          .limit(8)
          .lean(),
        Product.find({ status: "published", newArrival: true })
          .populate("category", "name slug")
          .sort({ createdAt: -1 })
          .limit(8)
          .lean(),
        Product.find({ status: "published", featured: true })
          .populate("category", "name slug")
          .limit(8)
          .lean(),
      ]);

      return res.json({
        success: true,
        bestSellers,
        newArrivals,
        featured,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: "Failed to retrieve showcase products." });
    }
  }

  public static async search(req: Request, res: Response) {
    try {
      const q = (req.query.q as string || "").trim();
      if (!q) {
        return res.json({ success: true, products: [], suggestions: [], categories: [] });
      }

      const regex = new RegExp(q, "i");

      const [products, categories] = await Promise.all([
        Product.find({
          status: "published",
          $or: [
            { name: regex },
            { sku: regex },
            { shortDescription: regex },
            { "ingredients.name": regex },
            { skinConcern: regex },
          ],
        })
          .populate("category", "name slug")
          .limit(10)
          .lean(),
        Category.find({ name: regex }).limit(5).lean(),
      ]);

      const suggestions = Array.from(new Set(products.map((p) => p.name)));

      return res.json({
        success: true,
        products,
        suggestions,
        categories,
        query: q,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: "Search query failed." });
    }
  }

  public static async submitReview(req: AuthenticatedRequest, res: Response) {
    try {
      const { slug } = req.params;
      const { authorName, rating, title, content } = req.body;

      if (!authorName || !rating || !content) {
        return res.status(400).json({ success: false, message: "Name, rating, and review text are required." });
      }

      const product = await Product.findOne({ slug });
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found." });
      }

      const review = await Review.create({
        productId: product._id,
        userId: req.user?._id,
        authorName,
        rating: Number(rating),
        title: title || "Product Review",
        content,
        isVerifiedPurchase: Boolean(req.user),
        status: "approved",
      });

      // Recalculate average rating
      const reviews = await Review.find({ productId: product._id, status: "approved" });
      const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      product.rating = Math.round(avg * 10) / 10;
      product.reviewCount = reviews.length;
      await product.save();

      return res.status(201).json({
        success: true,
        message: "Thank you for your feedback! Review published.",
        review,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: "Failed to submit review." });
    }
  }
}
