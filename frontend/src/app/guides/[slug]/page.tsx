import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Calendar, User, ArrowLeft } from "lucide-react";
import { formatDate } from "@/utils/formatters";

interface GuideProps {
  params: {
    slug: string;
  };
}

async function getGuide(slug: string) {
  try {
    const res = await fetch("http://localhost:5000/api/content/articles/" + slug, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      return data.content;
    }
  } catch (err) {
    console.error("Failed to load article:", err);
  }
  return null;
}

export async function generateMetadata({ params }: GuideProps) {
  const guide = await getGuide(params.slug);
  if (!guide) return { title: "Article Not Found | Seed Cosmetics" };

  return {
    title: guide.seo?.title || (guide.title + " | Seed Journal"),
    description: guide.seo?.metaDescription || guide.excerpt,
    alternates: { canonical: "https://www.seedcosmetics.in/guides/" + guide.slug },
  };
}

export default async function GuidePage({ params }: GuideProps) {
  const guide = await getGuide(params.slug);

  if (!guide) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <nav className="flex items-center space-x-2 text-xs text-charcoal-muted uppercase tracking-wider">
        <Link href="/" className="hover:text-botanical">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/about-seed-cosmetics" className="hover:text-botanical">The Journal</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-charcoal font-semibold truncate max-w-xs">{guide.title}</span>
      </nav>

      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] text-botanical font-semibold">
          {guide.category || "Botanical Science"}
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-charcoal leading-tight">
          {guide.title}
        </h1>
        <div className="flex items-center justify-center gap-4 text-xs text-charcoal-muted pt-2">
          <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {guide.author}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {formatDate(guide.publishedAt || guide.createdAt)}</span>
        </div>
      </div>

      {guide.featuredImage && (
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-cream-border shadow-luxury">
          <img src={guide.featuredImage} alt={guide.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="prose prose-stone max-w-none text-charcoal-light leading-relaxed whitespace-pre-line text-sm sm:text-base pt-4">
        {guide.body}
      </div>

      <div className="border-t border-cream-border pt-8 flex justify-between items-center">
        <Link href="/shop" className="text-xs uppercase tracking-widest font-semibold text-botanical flex items-center gap-1.5 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Return to Shop
        </Link>
      </div>
    </article>
  );
}