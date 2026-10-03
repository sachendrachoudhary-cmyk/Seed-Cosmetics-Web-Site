import React from "react";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

interface PDPProps {
  params: {
    slug: string;
  };
}

async function getProductData(slug: string) {
  try {
    const res = await fetch("http://localhost:5000/api/products/" + slug, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error("Error fetching product data:", err);
  }
  return null;
}

export async function generateMetadata({ params }: PDPProps) {
  const data = await getProductData(params.slug);
  if (!data || !data.product) {
    return { title: "Product Not Found | Seed Cosmetics" };
  }

  const p = data.product;
  const title = p.seo?.title || (p.name + " | Seed Cosmetics India");
  const description = p.seo?.metaDescription || p.shortDescription;

  return {
    title,
    description,
    alternates: {
      canonical: "https://www.seedcosmetics.in/products/" + p.slug,
    },
    openGraph: {
      title,
      description,
      url: "https://www.seedcosmetics.in/products/" + p.slug,
      images: [
        {
          url: p.thumbnail || p.images?.[0]?.url,
          width: 800,
          height: 800,
          alt: p.name,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: PDPProps) {
  const data = await getProductData(params.slug);

  if (!data || !data.product) {
    notFound();
  }

  const { product, variants, reviews, relatedProducts, structuredData } = data;

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <ProductDetailClient
        product={product}
        variants={variants || []}
        reviews={reviews || []}
        relatedProducts={relatedProducts || []}
      />
    </>
  );
}