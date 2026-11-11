import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import PageWrapper from "@/components/PageWrapper";

export const metadata: Metadata = {
  metadataBase: new URL("https://hafidzcompany.id"),
  title: `${siteConfig.name} | ${siteConfig.tagline}`,
  description: siteConfig.description,
  keywords: [
    "Database Analyzer",
    "Database Optimization Indonesia",
    "PostgreSQL Tuning",
    "MySQL Performance",
    "High Availability Database",
    "Hafidz Company",
  ],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: "https://hafidzcompany.id",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.logo,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  icons: {
    icon: "/images/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-surface antialiased min-h-screen flex flex-col font-sans selection:bg-secondary-container selection:text-white overflow-x-hidden">
        <PageWrapper>{children}</PageWrapper>
      </body>
    </html>
  );
}
