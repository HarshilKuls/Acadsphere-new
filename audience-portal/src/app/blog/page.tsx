import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { db } from '@/lib/db';
import PublicNavbar from '@/components/PublicNavbar';


export const metadata: Metadata = {
  title: 'Blogs | Acadsphere',
  description: 'Read the latest articles, updates, and academic resources from Acadsphere.',
  openGraph: {
    title: 'Acadsphere Blogs',
    description: 'Read the latest articles, updates, and academic resources from Acadsphere.',
  }
};

export default async function PublicBlogList() {
  // Fetch blogs server-side (only published ones)
  const blogs = await db.getBlogs();

  return (
    <div className="min-h-screen bg-[#09090f] text-[#e6e0ee] font-sans selection:bg-[#7C3AED]/30">
      <PublicNavbar />
      
      <main className="max-w-[1400px] mx-auto px-4 md:px-8 pt-24 pb-12 md:pt-32">
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Acadsphere <span className="text-[#7C3AED]">Editorial</span></h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Discover articles on academics, technology, internships, and student life.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="py-20 text-center border border-zinc-800/50 rounded-2xl bg-zinc-900/20">
            <p className="text-zinc-500">No public blogs available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link href={`/blog/${blog.slug}`} key={blog.id} className="group flex flex-col h-full bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden hover:border-[#7C3AED]/50 transition-colors duration-300">
                {blog.cover_image ? (
                  <div className="w-full h-48 sm:h-56 overflow-hidden relative bg-zinc-800">
                    <img 
                      src={blog.cover_image} 
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 sm:h-56 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center border-b border-zinc-800/50">
                    <span className="text-zinc-700 font-bold text-2xl tracking-widest uppercase">Acadsphere</span>
                  </div>
                )}
                
                <div className="p-6 flex flex-col flex-1">

                  
                  <h2 className="text-xl font-bold text-zinc-100 mb-3 line-clamp-2 group-hover:text-[#7C3AED] transition-colors">
                    {blog.title}
                  </h2>
                  
                  {blog.excerpt && (
                    <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                      {blog.excerpt}
                    </p>
                  )}
                  
                  <div className="mt-auto pt-4 border-t border-zinc-800/50 text-[#06B6D4] text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    Read Article <span className="text-lg leading-none transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
