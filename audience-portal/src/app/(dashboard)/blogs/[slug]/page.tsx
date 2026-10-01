"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, User, Calendar, Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import DOMPurify from "dompurify";
import { db, BlogEntry } from "@/lib/db";
import { useAcadsphere } from "@/context/AcadsphereContext";
import ShareButton from "@/components/ShareButton";

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isDarkMode } = useAcadsphere();

  const [blog, setBlog] = useState<BlogEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!params.slug || typeof params.slug !== 'string') {
        setError(true);
        setLoading(false);
        return;
      }

      const data = await db.getBlogBySlug(params.slug);
      if (data) {
        setBlog(data);
      } else {
        setError(true);
      }
      setLoading(false);
    };
    fetchBlog();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#06B6D4] border-t-transparent"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => router.push('/blogs')}
          className={`flex items-center gap-2 text-sm font-bold transition-colors ${isDarkMode ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-black"}`}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Blogs
        </button>
        <div className={`glass-card p-12 text-center rounded-2xl border ${isDarkMode ? "bg-zinc-900/30 border-zinc-800" : "bg-white border-zinc-200"}`}>
          <Newspaper className="h-16 w-16 text-zinc-500 mx-auto mb-4 opacity-50" />
          <h1 className="text-2xl font-bold tracking-tight mb-2">Article Not Found</h1>
          <p className="text-zinc-500 max-w-md mx-auto mb-6">
            The article you're looking for doesn't exist, has been removed, or you might have followed a broken link.
          </p>
          <button
            onClick={() => router.push('/blogs')}
            className="px-6 py-3 bg-[#06B6D4] hover:bg-[#0891B2] text-white font-bold rounded-xl shadow-lg transition-all active:scale-95"
          >
            Return to Blog Feed
          </button>
        </div>
      </div>
    );
  }

  // Safely sanitize HTML if type is HTML
  const sanitizedContent = blog.content_type === 'html'
    ? DOMPurify.sanitize(blog.content)
    : '';

  return (
    <article className="max-w-6xl mx-auto space-y-8 md:space-y-10 pb-20 w-full px-2 sm:px-4 lg:px-0">
      {/* Navigation */}
      <button
        onClick={() => router.push('/blogs')}
        className={`flex items-center gap-2 text-sm font-bold transition-colors ${isDarkMode ? "text-zinc-400 hover:text-[#06B6D4]" : "text-zinc-500 hover:text-[#0891B2]"}`}
      >
        <ArrowLeft className="h-4 w-4" /> Back to Blogs
      </button>

      {/* Header Section */}
      <header className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-[10px] sm:text-xs font-bold tracking-wider uppercase">
            <span className="px-3 py-1.5 bg-[#06B6D4]/10 text-[#06B6D4] rounded-lg border border-[#06B6D4]/20">
              Article
            </span>
            {blog.published_at && (
              <span className={`flex items-center gap-1.5 ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                <Calendar className="h-3.5 w-3.5" />
                Published {format(new Date(blog.published_at), 'MMMM dd, yyyy')}
              </span>
            )}
            {blog.expiry_date && !blog.is_always_running && (
              <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${isDarkMode ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-amber-100 text-amber-700 border-amber-200"}`}>
                <Clock className="h-3.5 w-3.5" />
                Available until {format(new Date(blog.expiry_date), 'MMMM dd, yyyy')}
              </span>
            )}
          </div>
          <ShareButton
            url={`https://www.acadsphere.in/blog/${blog.slug}`}
            title={blog.title}
            text={blog.excerpt || `Read ${blog.title} on Acadsphere`}
          />
        </div>

        <h1 className={`text-3xl md:text-5xl font-extrabold tracking-tight leading-tight ${isDarkMode ? "text-white" : "text-zinc-900"}`}>
          {blog.title}
        </h1>

        {blog.excerpt && (
          <p className={`text-lg md:text-xl font-medium leading-relaxed ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}>
            {blog.excerpt}
          </p>
        )}
      </header>

      {/* Cover Image */}
      {blog.cover_image && !imageError && (
        <div className="relative w-full aspect-[21/9] md:aspect-[2.5/1] lg:aspect-[3/1] rounded-2xl md:rounded-3xl overflow-hidden bg-zinc-900 shadow-2xl">
          <Image
            src={blog.cover_image}
            alt={blog.title}
            fill
            className="object-cover"
            priority
            onError={() => setImageError(true)}
          />
        </div>
      )}

      {/* Blog Content */}
      <div className={`prose prose-lg md:prose-xl mx-auto max-w-4xl prose-img:rounded-2xl prose-headings:font-bold ${isDarkMode ? "prose-invert prose-p:text-zinc-300 prose-a:text-[#06B6D4] prose-headings:text-white" : "prose-zinc prose-p:text-zinc-700 prose-a:text-[#0891B2] prose-headings:text-zinc-900"}`}>
        {blog.content_type === 'text' ? (
          <div className="whitespace-pre-wrap">{blog.content}</div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        )}
      </div>

      {/* Footer Meta */}
      <footer className={`mt-16 pt-8 border-t max-w-4xl mx-auto flex items-center justify-between ${isDarkMode ? "border-zinc-800" : "border-zinc-200"}`}>
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 rounded-xl overflow-hidden bg-black flex items-center justify-center border border-white/10 shadow-md">
            <Image src="/icon.png" alt="Acadsphere Logo" fill className="object-cover p-1" />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">By</span>
            <span className={`block text-sm font-extrabold tracking-wide ${isDarkMode ? "text-zinc-100" : "text-zinc-900"}`}>
              Acadsphere Team
            </span>
          </div>
        </div>
        <ShareButton
          url={`https://www.acadsphere.in/blog/${blog.slug}`}
          title={blog.title}
          text={blog.excerpt || `Read ${blog.title} on Acadsphere`}
        />
      </footer>
    </article>
  );
}
