import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import PublicNavbar from '@/components/PublicNavbar';
import Image from 'next/image';


type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug;
  const blog = await db.getBlogBySlug(slug);

  if (!blog) {
    return {
      title: 'Not Found | Acadsphere',
    };
  }

  return {
    title: `${blog.title} | Acadsphere`,
    description: blog.excerpt || 'Read the full article on Acadsphere.',
    alternates: {
      canonical: `https://www.acadsphere.in/blog/${slug}`,
    },
    openGraph: {
      title: blog.title,
      description: blog.excerpt || 'Read the full article on Acadsphere.',
      images: blog.cover_image ? [blog.cover_image] : [],
      type: 'article',
      publishedTime: blog.created_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.excerpt || 'Read the full article on Acadsphere.',
      images: blog.cover_image ? [blog.cover_image] : [],
    },
  };
}

import AutoResizingIframe from '@/components/AutoResizingIframe';
import BlogCoverImage from '@/components/BlogCoverImage';
import ShareButton from '@/components/ShareButton';
import BlogViewTracker from '@/components/BlogViewTracker';
export default async function PublicBlogArticle(props: Props) {
  const params = await props.params;
  const blog = await db.getBlogBySlug(params.slug);

  if (!blog) {
    notFound();
  }

  // Structured Data (JSON-LD)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.cover_image ? [blog.cover_image] : [],
    datePublished: blog.created_at,
    author: {
      '@type': 'Organization',
      name: 'Acadsphere',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Acadsphere',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.acadsphere.in/Acadshpere%20website%20logo.png'
      }
    }
  };



  return (
    <div className="min-h-screen bg-[#09090f] text-[#e6e0ee] font-sans selection:bg-[#7C3AED]/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <BlogViewTracker slug={blog.slug} />

      <PublicNavbar />

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 pt-24 pb-12 md:pt-32 md:pb-20">
        <header className="mb-10 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight flex-1">
              {blog.title}
            </h1>
            <div className="flex justify-center md:justify-end">
              <ShareButton
                url={`https://www.acadsphere.in/blog/${blog.slug}`}
                title={blog.title}
                text={blog.excerpt || `Read ${blog.title} on Acadsphere`}
              />
            </div>
          </div>
          {blog.excerpt && (
            <p className="text-xl text-zinc-400 leading-relaxed mb-8 border-l-4 border-[#06B6D4] pl-4 italic">
              {blog.excerpt}
            </p>
          )}
        </header>

        {blog.cover_image && (
          <div className="mb-12">
            <BlogCoverImage
              src={blog.cover_image}
              alt={blog.title}
              className="w-full aspect-video md:aspect-[2.5/1] lg:aspect-[3/1] rounded-2xl md:rounded-3xl"
            />
          </div>
        )}

        <div className="w-full">
          {blog.content_type === 'html' ? (
            <AutoResizingIframe content={blog.content} className="w-full" />
          ) : (
            <article className="prose prose-invert prose-zinc max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[#06B6D4] hover:prose-a:text-[#7C3AED] prose-img:rounded-2xl">
              <div className="whitespace-pre-wrap">{blog.content}</div>
            </article>
          )}
        </div>

        <footer className="mt-16 pt-8 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-black flex items-center justify-center border border-white/10 shadow-lg">
              <Image src="/icon.png" alt="Acadsphere Logo" fill className="object-cover p-1" />
            </div>
            <div className="text-left">
              <span className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-0.5">By</span>
              <span className="block text-base font-extrabold tracking-wide text-white">
                Team Acadsphere
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center sm:items-end gap-2">
            <span className="text-zinc-500 text-[10px] font-bold tracking-wider uppercase">Share this article</span>
            <ShareButton
              url={`https://www.acadsphere.in/blog/${blog.slug}`}
              title={blog.title}
              text={blog.excerpt || `Read ${blog.title} on Acadsphere`}
            />
          </div>
        </footer>
      </main>
    </div>
  );
}
