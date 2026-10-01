"use client";

import React, { useEffect, useRef, useState } from "react";

interface AutoResizingIframeProps {
  content: string;
  className?: string;
}

export default function AutoResizingIframe({ content, className = "" }: AutoResizingIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number>(150); // initial minimum height

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (iframeRef.current && event.source === iframeRef.current.contentWindow) {
        if (event.data && event.data.type === "iframe-resize" && typeof event.data.height === "number") {
          setHeight(event.data.height);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Inject the resize observer script into the HTML
  // We use postMessage to securely communicate height changes to the parent
  // We also ensure a proper viewport meta tag exists if missing, as required by the prompt
  // We inject CSS to override fixed max-widths in generated HTML so it expands naturally
  const injectedScript = `
    <style>
      /* Ensure responsive images */
      img, video, iframe { max-width: 100% !important; height: auto !important; }
      /* Prevent horizontal scroll */
      body, html { overflow-x: hidden !important; }
      /* Allow Stitch containers to expand */
      body, main, .container, .content-wrapper, .article-content, .stitch-container, article, section {
         max-width: 100% !important;
      }
    </style>
    <script>
      (function() {
        function reportHeight() {
          const h = Math.max(
            document.body.scrollHeight, 
            document.body.offsetHeight, 
            document.documentElement.clientHeight, 
            document.documentElement.scrollHeight, 
            document.documentElement.offsetHeight
          );
          window.parent.postMessage({ type: 'iframe-resize', height: h }, '*');
        }
        
        window.addEventListener('load', reportHeight);
        
        if (typeof ResizeObserver !== 'undefined') {
          const observer = new ResizeObserver(reportHeight);
          observer.observe(document.documentElement);
          if (document.body) observer.observe(document.body);
        }
        
        // Also observe images loading
        const imgs = document.querySelectorAll('img');
        imgs.forEach(img => {
          img.addEventListener('load', reportHeight);
        });
      })();
    </script>
  `;

  // We append our script to the end. The browser will execute it.
  const srcDoc = `
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${content}
    ${injectedScript}
  `;

  return (
    <iframe
      ref={iframeRef}
      srcDoc={srcDoc}
      sandbox="allow-scripts"
      className={`w-full border-0 overflow-hidden block ${className}`}
      style={{ width: '100%', maxWidth: '100%', height: `${height}px`, transition: 'height 0.2s ease-out' }}
      title="Blog Article Content"
      scrolling="no"
    />
  );
}
