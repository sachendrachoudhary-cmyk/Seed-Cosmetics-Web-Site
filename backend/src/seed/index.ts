import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { Category } from "../models/Category";
import { Collection } from "../models/Collection";
import { Product } from "../models/Product";
import { Variant } from "../models/Variant";
import { Coupon } from "../models/Coupon";
import { Content } from "../models/Content";
import { connectDB } from "../config/db";
import { categoriesData } from "./categories";
import { getProductsData } from "./products";

export async function seedDatabase() {
  console.log("[Seeder] Starting Seed Cosmetics catalogue seeder...");

  // 1. Users
  const salt = await bcrypt.genSalt(10);
  const adminHash = await bcrypt.hash("SeedAdmin@2026!", salt);
  const customerHash = await bcrypt.hash("Customer@2026!", salt);

  await User.findOneAndUpdate(
    { email: "admin@seedcosmetics.in" },
    {
      name: "Seed Cosmetics Admin",
      email: "admin@seedcosmetics.in",
      passwordHash: adminHash,
      role: "admin",
      phone: "+91 98765 43210",
      addresses: [
        {
          fullName: "Seed Cosmetics HQ",
          phone: "+91 98765 43210",
          addressLine1: "Plot 42, Botanical Park Avenue",
          addressLine2: "Cyber City, Phase 2",
          city: "Gurugram",
          state: "Haryana",
          pincode: "122002",
          country: "India",
          isDefault: true,
        },
      ],
    },
    { upsert: true, new: true }
  );

  await User.findOneAndUpdate(
    { email: "priya.sharma@example.com" },
    {
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      passwordHash: customerHash,
      role: "customer",
      phone: "+91 91234 56789",
      addresses: [
        {
          fullName: "Priya Sharma",
          phone: "+91 91234 56789",
          addressLine1: "Flat 402, Green Meadows",
          addressLine2: "Indiranagar 100ft Road",
          city: "Bengaluru",
          state: "Karnataka",
          pincode: "560038",
          country: "India",
          isDefault: true,
        },
      ],
    },
    { upsert: true, new: true }
  );

  // 2. Categories
  const categoryMap: Record<string, any> = {};
  for (const cat of categoriesData) {
    const saved = await Category.findOneAndUpdate(
      { slug: cat.slug },
      { ...cat, seo: { title: `${cat.name} | Seed Cosmetics`, canonicalUrl: `https://www.seedcosmetics.in/category/${cat.slug}` } },
      { upsert: true, new: true }
    );
    categoryMap[cat.slug] = saved;
  }

  // 3. Collections
  const collectionsData = [
    {
      name: "Best Sellers",
      slug: "best-sellers",
      description: "Our most coveted, community-loved botanical formulations.",
      featured: true,
      active: true,
      order: 1,
    },
    {
      name: "Barrier Repair Collection",
      slug: "barrier-repair",
      description: "Formulations engineered to calm irritation, lock in moisture, and rebuild compromised skin lipid barriers.",
      featured: true,
      active: true,
      order: 2,
    },
  ];

  const collectionMap: Record<string, any> = {};
  for (const col of collectionsData) {
    const saved = await Collection.findOneAndUpdate({ slug: col.slug }, col, { upsert: true, new: true });
    collectionMap[col.slug] = saved;
  }

  // 4. Products & Variants
  const products = getProductsData(categoryMap, collectionMap);
  for (const p of products) {
    const { variants, ...fields } = p;
    const prod = await Product.findOneAndUpdate({ slug: fields.slug }, fields, { upsert: true, new: true });

    if (variants && variants.length > 0) {
      for (const v of variants) {
        await Variant.findOneAndUpdate({ sku: v.sku }, { ...v, productId: prod._id }, { upsert: true, new: true });
      }
    }
  }

  // 5. Coupons
  const couponsData = [
    {
      code: "WELCOME10",
      discountType: "percentage",
      discountValue: 10,
      minCartValue: 500,
      maxDiscount: 250,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      usageLimit: 10000,
      perCustomerLimit: 1,
      firstOrderOnly: true,
      freeShipping: false,
      isActive: true,
    },
    {
      code: "SEED200",
      discountType: "fixed",
      discountValue: 200,
      minCartValue: 1499,
      startDate: new Date(),
      endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      usageLimit: 5000,
      perCustomerLimit: 2,
      firstOrderOnly: false,
      freeShipping: false,
      isActive: true,
    },
    {
      code: "FREESHIP",
      discountType: "fixed",
      discountValue: 0,
      minCartValue: 0,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      perCustomerLimit: 5,
      freeShipping: true,
      isActive: true,
    },
  ];

  for (const c of couponsData) {
    await Coupon.findOneAndUpdate({ code: c.code }, c, { upsert: true, new: true });
  }

  // 6. Content Guides
  const guides = [
    {
      type: "guide",
      title: "The Science of Cold-Pressed Seed Oils: Why Lipid Ratios Matter for Your Skin",
      slug: "science-of-cold-pressed-seed-oils",
      excerpt: "Not all facial oils are created equal. Discover why high-linoleic seed oils are nature's secret to clear pores and a strong lipid barrier.",
      author: "Dr. Ananya Ray, Formulation Chemist",
      body: "Healthy skin begins with lipid balance. When skin produces thick, oleic-acid dominant sebum without sufficient linoleic acid, pores become sticky and susceptible to micro-comedones.\n\nBy utilizing high-linoleic botanical seed oils such as Chilean Rosehip and Squalane, Seed Cosmetics formulations supply the exact fatty acids needed to keep sebum fluid and protective.",
      featuredImage: "https://images.unsplash.com/photo-1608248597359-59754f923297?auto=format&fit=crop&w=1000&q=80",
      category: "Formulation Science",
      status: "published",
      publishedAt: new Date(),
      seo: {
        title: "The Science of Cold-Pressed Seed Oils | Seed Cosmetics Journal",
        metaDescription: "Understand linoleic vs oleic fatty acids and why cold-pressed botanical seed oils restore damaged skin barriers without clogging pores.",
        canonicalUrl: "https://www.seedcosmetics.in/guides/science-of-cold-pressed-seed-oils",
      },
    },
  ];

  for (const g of guides) {
    await Content.findOneAndUpdate({ slug: g.slug }, g, { upsert: true, new: true });
  }

  console.log("[Seeder] Database successfully seeded!");
}

if (require.main === module) {
  connectDB().then(() => {
    seedDatabase().then(() => process.exit(0));
  });
}
