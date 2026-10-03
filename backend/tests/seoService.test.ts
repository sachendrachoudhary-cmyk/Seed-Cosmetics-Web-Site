import { SeoService } from "../src/services/seoService";

describe("SeoService Unit Tests", () => {
  test("generates valid Schema.org Product and Offer JSON-LD", () => {
    const product: any = {
      name: "Bakuchiol & Cold-Pressed Rosehip Youth Elixir",
      slug: "bakuchiol-rosehip-youth-elixir",
      sku: "SC-SER-001",
      sellingPrice: 899,
      MRP: 1199,
      shortDescription: "Gentle natural retinol alternative",
      stock: 25,
      rating: 4.9,
      reviewCount: 120,
      images: [{ url: "https://example.com/image.jpg", alt: "Youth elixir" }],
    };

    const jsonLd = SeoService.generateProductJsonLd(product, []);

    expect(jsonLd["@context"]).toBe("https://schema.org/");
    expect(jsonLd["@type"]).toBe("Product");
    expect(jsonLd.name).toBe(product.name);
    expect(jsonLd.sku).toBe(product.sku);
    expect(jsonLd.offers.price).toBe(899);
    expect(jsonLd.offers.availability).toBe("https://schema.org/InStock");
    expect(jsonLd.aggregateRating.ratingValue).toBe(4.9);
  });

  test("generates robots.txt explicitly allowing OAI-SearchBot and Googlebot while shielding admin", () => {
    const robots = SeoService.generateRobotsTxt("https://www.seedcosmetics.in");

    expect(robots).toContain("User-agent: OAI-SearchBot");
    expect(robots).toContain("Disallow: /admin/");
    expect(robots).toContain("Disallow: /checkout");
    expect(robots).toContain("Sitemap: https://www.seedcosmetics.in/sitemap.xml");
  });

  test("evaluates product SEO Quality Gate correctly", () => {
    const completeProduct: any = {
      name: "Niacinamide 5% & Green Tea Clarifying Toner Mist",
      slug: "niacinamide-green-tea-clarifying-mist",
      shortDescription: "A soothing alcohol-free clarifying facial mist that refines pores.",
      bulletPoints: ["Point 1", "Point 2", "Point 3"],
      images: [{ url: "https://example.com/img.jpg", alt: "Descriptive alt text" }],
      ingredients: [{ name: "Niacinamide" }],
      seo: { title: "Niacinamide Green Tea Toner | Seed Cosmetics India" },
    };

    const audit = SeoService.auditProductSeo(completeProduct);
    expect(audit.score).toBeGreaterThanOrEqual(80);
    expect(audit.status).toBe("READY");
  });

  test("flags critical SEO quality gate failure if name or slug missing", () => {
    const defectiveProduct: any = {
      name: "Toner",
      slug: "invalid slug with spaces",
      images: [],
    };

    const audit = SeoService.auditProductSeo(defectiveProduct);
    expect(audit.status).toBe("CRITICAL");
    expect(audit.issues.some((i) => i.level === "CRITICAL")).toBe(true);
  });
});
