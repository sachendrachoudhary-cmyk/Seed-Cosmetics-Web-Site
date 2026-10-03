import { IProduct } from "../models/Product";
import { IVariant } from "../models/Variant";

export interface ISeoAuditResult {
  score: number;
  status: "READY" | "NEEDS_ATTENTION" | "CRITICAL";
  issues: Array<{
    field: string;
    level: "CRITICAL" | "WARNING" | "INFO";
    message: string;
    recommendation: string;
  }>;
}

export class SeoService {
  private static defaultSiteUrl = process.env.SITE_URL || "https://www.seedcosmetics.in";

  public static generateProductJsonLd(product: any, variants: any[] = [], siteUrl = this.defaultSiteUrl) {
    const productUrl = `${siteUrl}/products/${product.slug}`;
    const primaryImage = product.images?.find((img: any) => img.isPrimary)?.url || product.thumbnail || product.images?.[0]?.url;

    const offers = variants.length > 0
      ? variants.map((variant) => ({
          "@type": "Offer",
          sku: variant.sku,
          name: `${product.name} - ${variant.title}`,
          price: variant.price,
          priceCurrency: "INR",
          availability: variant.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          url: `${productUrl}?variant=${variant.sku}`,
          itemCondition: "https://schema.org/NewCondition",
          seller: {
            "@type": "Organization",
            name: "Seed Cosmetics",
          },
        }))
      : [
          {
            "@type": "Offer",
            sku: product.sku,
            price: product.sellingPrice,
            priceCurrency: "INR",
            availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: productUrl,
            itemCondition: "https://schema.org/NewCondition",
            seller: {
              "@type": "Organization",
              name: "Seed Cosmetics",
            },
          },
        ];

    const jsonLd: any = {
      "@context": "https://schema.org/",
      "@type": "Product",
      name: product.name,
      image: product.images?.map((img: any) => img.url) || [primaryImage],
      description: product.shortDescription || product.description,
      sku: product.sku,
      brand: {
        "@type": "Brand",
        name: product.brand || "Seed Cosmetics",
      },
      offers: offers.length === 1 ? offers[0] : offers,
    };

    if (product.rating && product.reviewCount > 0) {
      jsonLd.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviewCount,
        bestRating: "5",
        worstRating: "1",
      };
    }

    return jsonLd;
  }

  public static generateBreadcrumbJsonLd(
    breadcrumbs: Array<{ name: string; path: string }>,
    siteUrl = this.defaultSiteUrl
  ) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: crumb.path.startsWith("http") ? crumb.path : `${siteUrl}${crumb.path}`,
      })),
    };
  }

  public static generateOrganizationJsonLd(siteUrl = this.defaultSiteUrl) {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Seed Cosmetics",
      url: siteUrl,
      logo: `${siteUrl}/images/seed-cosmetics-logo.png`,
      sameAs: [
        "https://www.instagram.com/seedcosmetics.in",
        "https://www.facebook.com/seedcosmetics.in",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "care@seedcosmetics.in",
        availableLanguage: ["English", "Hindi"],
      },
    };
  }

  public static generateRobotsTxt(siteUrl = this.defaultSiteUrl): string {
    return `# Seed Cosmetics Robots.txt
# Technical SEO & AI Search / GEO Discovery Architecture

User-agent: *
Allow: /
Allow: /products/
Allow: /category/
Allow: /collections/
Allow: /guides/
Allow: /about-seed-cosmetics
Allow: /faq
Disallow: /admin/
Disallow: /cart
Disallow: /checkout
Disallow: /account
Disallow: /api/
Allow: /api/seo/sitemap.xml

# OpenAI ChatGPT Search Discovery Crawler
User-agent: OAI-SearchBot
Allow: /
Disallow: /admin/
Disallow: /cart
Disallow: /checkout

# Perplexity AI Search Crawler
User-agent: PerplexityBot
Allow: /

# Anthropic Claude Crawler
User-agent: ClaudeBot
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
  }

  public static auditProductSeo(product: Partial<IProduct>): ISeoAuditResult {
    const issues: ISeoAuditResult["issues"] = [];
    let score = 100;

    // 1. Product Name
    if (!product.name || product.name.trim().length < 5) {
      issues.push({
        field: "name",
        level: "CRITICAL",
        message: "Product name is missing or too short.",
        recommendation: "Provide a descriptive product name including botanical key actives (e.g. 'Niacinamide Clarifying Toner').",
      });
      score -= 25;
    }

    // 2. Slug
    if (!product.slug || !/^[a-z0-9-]+$/.test(product.slug)) {
      issues.push({
        field: "slug",
        level: "CRITICAL",
        message: "Invalid SEO slug format.",
        recommendation: "Use lowercase alphanumeric characters with hyphens only.",
      });
      score -= 20;
    }

    // 3. Short & Full Description
    if (!product.shortDescription || product.shortDescription.length < 30) {
      issues.push({
        field: "shortDescription",
        level: "WARNING",
        message: "Short description is brief or missing.",
        recommendation: "Include a 50-150 character synopsis highlighting primary skin benefits.",
      });
      score -= 10;
    }

    // 4. Repeatable Bullet Points
    if (!product.bulletPoints || product.bulletPoints.length < 3) {
      issues.push({
        field: "bulletPoints",
        level: "WARNING",
        message: "Fewer than 3 bullet points provided.",
        recommendation: "Add at least 3-5 scannable highlight bullets for mobile shoppers and AI extractors.",
      });
      score -= 10;
    }

    // 5. Images & Alt Text
    if (!product.images || product.images.length === 0) {
      issues.push({
        field: "images",
        level: "CRITICAL",
        message: "No product gallery images uploaded.",
        recommendation: "Upload at least 2 high-resolution product and lifestyle images.",
      });
      score -= 20;
    } else {
      const missingAlt = product.images.some((img) => !img.alt || img.alt.trim().length === 0);
      if (missingAlt) {
        issues.push({
          field: "images.alt",
          level: "WARNING",
          message: "One or more images lack descriptive ALT text.",
          recommendation: "Add descriptive ALT text for accessibility and Google Image search ranking.",
        });
        score -= 10;
      }
    }

    // 6. Ingredients
    if (!product.ingredients || product.ingredients.length === 0) {
      issues.push({
        field: "ingredients",
        level: "WARNING",
        message: "Ingredient list is empty.",
        recommendation: "Declare active botanical ingredients to satisfy customer transparency and GEO queries.",
      });
      score -= 10;
    }

    // 7. SEO Metadata
    const seoTitle = product.seo?.title || product.name;
    if (!seoTitle || seoTitle.length < 20 || seoTitle.length > 70) {
      issues.push({
        field: "seo.title",
        level: "INFO",
        message: "SEO title length should ideally be between 30 and 60 characters.",
        recommendation: "Refine title length to fit standard Google search SERP snippets.",
      });
      score -= 5;
    }

    score = Math.max(0, Math.min(100, score));

    let status: ISeoAuditResult["status"] = "READY";
    if (issues.some((i) => i.level === "CRITICAL")) {
      status = "CRITICAL";
    } else if (score < 80) {
      status = "NEEDS_ATTENTION";
    }

    return {
      score,
      status,
      issues,
    };
  }
}
