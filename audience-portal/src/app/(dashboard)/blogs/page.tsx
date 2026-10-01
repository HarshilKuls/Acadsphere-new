"use client";

import React, { useEffect, useState } from "react";
import { Newspaper, ChevronRight, Clock, ArrowRight } from "lucide-react";
import { useAcadsphere } from "@/context/AcadsphereContext";
import PageHero from "@/components/PageHero";
import { db, BlogEntry } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

export default function BlogsPage() {
  const { currentUser, isDarkMode } = useAcadsphere();
  const [blogs, setBlogs] = useState<BlogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;
    const fetchBlogs = async () => {
      const data = await db.getBlogs((freshBlogs) => {
        if (isMounted) setBlogs(freshBlogs);
      });
      if (isMounted) {
        setBlogs(data);
        setLoading(false);
      }
    };
    fetchBlogs();
    return () => { isMounted = false; };
  }, []);

  if (!currentUser) return null;

  return (
    <div className="space-y-6">
      <PageHero title="ACADSPHERE BLOGS" compactMobile={true} />

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#06B6D4] border-t-transparent"></div>
        </div>
      ) : blogs.length === 0 ? (
        <div className={`glass-card p-6 text-center py-16 border-dashed ${isDarkMode ? "border-zinc-800 bg-zinc-900/20" : "border-zinc-300 bg-zinc-50"}`}>
          <Newspaper className="h-12 w-12 text-[#06B6D4] mx-auto mb-4 opacity-80" />
          <h2 className={`text-xl font-bold tracking-widest uppercase mb-2 ${isDarkMode ? "text-white" : "text-zinc-900"}`}>
            No Publications Yet
          </h2>
          <p className="text-sm font-medium text-zinc-500">
            Check back later for new articles, insights, and updates from the Acadsphere team.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link key={blog.id} href={`/blogs/${blog.slug}`} className="group">
              <div className={`h-full flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl hover:shadow-[#06B6D4]/10 ${isDarkMode ? "border-zinc-800/50 bg-zinc-900/40 hover:border-[#06B6D4]/30 hover:bg-zinc-900/80" : "border-zinc-200 bg-white hover:border-[#06B6D4]/30"}`}>

                {/* Cover Image */}
                <div className="relative h-48 w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  {blog.cover_image && !imageError[blog.id] ? (
                    <Image 
                      src={blog.cover_image} 
                      alt={blog.title} 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-105" 
                      onError={() => setImageError(prev => ({ ...prev, [blog.id]: true }))}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
                      <Newspaper className="h-12 w-12 text-zinc-700" />
                    </div>
                  )}
                  {/* Category Tag */}
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-white bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
                      Article
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5">
                  <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    <Clock className="h-3.5 w-3.5" />
                    {blog.published_at ? format(new Date(blog.published_at), 'MMM dd, yyyy') : 'Recently'}
                  </div>

                  <h3 className={`text-lg font-bold leading-tight mb-2 transition-colors ${isDarkMode ? "text-zinc-100 group-hover:text-white" : "text-zinc-900 group-hover:text-black"}`}>
                    {blog.title}
                  </h3>

                  {blog.excerpt && (
                    <p className={`text-sm mb-6 flex-1 line-clamp-3 ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                      {blog.excerpt}
                    </p>
                  )}

                  <div className="mt-auto pt-4 border-t border-zinc-800/20 dark:border-zinc-800">
                    <div className="flex items-center text-[#06B6D4] text-xs font-bold uppercase tracking-wider group-hover:text-[#0891B2] transition-colors">
                      Read Full Story
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
