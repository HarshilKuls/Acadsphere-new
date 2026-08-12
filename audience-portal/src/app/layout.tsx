import type { Metadata } from "next";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { AcadsphereProvider } from "@/context/AcadsphereContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Acadsphere | Your Academic Command Center",
  description: "Acadsphere is a highly elegant, minimalist, and futuristic academic operating system for students to track schedules, attendance margins, CGPA courses, and grade projections.",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="font-sans h-full antialiased"
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">
        <GoogleAnalytics />
        <AcadsphereProvider>
          {children}
        </AcadsphereProvider>
      </body>
    </html>
  );
}


