import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

async function getCategoryData(slug: string) {
  try {
    const [catRes, prodRes] = await Promise.all([
      fetch(`http://localhost:5000/api/content/categories`, { next: { revalidate: 60 } }),
      fetch(`http://localhost:5000/api/products?category=${slug}`, { next: { revalidate: 60 } }),
    ]);

    const catData = await catRes.json();
    const prodData = await prodRes.json();

    const category = catData.categories?.find((c: any) => c.slug === slug);
    return {
      category,
      products: prodData.products || [],
    };
  } catch (err) {
    console.error("Error fetching category data:", err);
    return { category: null, products: [] };
  }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await getCategoryData(params.slug);
  if (!category) return { title: "Category Not Found | Seed Cosmetics" };

  return {
    title: `${category.name} | Seed Cosmetics India`,
    description: category.description || `Discover pure, cold-pressed ${category.name} formulations by Seed Cosmetics.`,
    alternates: {
      canonical: `https://www.seedcosmetics.in/category/${category.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category, products } = await getCategoryData(params.slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs text-charcoal-muted uppercase tracking-wider">
        <Link href="/" className="hover:text-botanical transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-botanical transition-colors">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-charcoal font-semibold">{category.name}</span>
      </nav>

      {/* Category Hero Banner */}
      <div className="bg-white rounded-2xl border border-cream-border p-8 sm:p-12 shadow-sm text-center max-w-4xl mx-auto space-y-4">
        <p className="text-xs uppercase tracking-[0.25em] text-botanical font-semibold">
          Targeted Regimen
        </p>
        <h1 className="font-serif text-3xl sm:text-5xl text-charcoal">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-sm text-charcoal-muted max-w-xl mx-auto leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      {/* Products Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-cream-border pb-4">
          <p className="text-xs uppercase tracking-wider font-semibold text-charcoal-muted">
            {products.length} {products.length === 1 ? "Formulation Available" : "Formulations Available"}
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-xl border border-cream-border p-8 space-y-3">
            <p className="font-serif text-lg text-charcoal">New Formulations Coming Soon</p>
            <p className="text-xs text-charcoal-muted">We are formulating new bio-actives for this category.</p>
            <Link href="/shop" className="text-xs text-botanical font-semibold underline inline-block">
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}