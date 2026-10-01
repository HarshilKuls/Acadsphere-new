"use client";

import { useEffect, useRef } from "react";
import { db } from "@/lib/db";

export default function BlogViewTracker({ slug }: { slug: string }) {
  const tracked = useRef(false);
  
  useEffect(() => {
    if (!tracked.current) {
      tracked.current = true;
      db.recordUnauthenticatedCheck("blog_view", slug).catch(() => {});
    }
  }, [slug]);

  return null;
}
