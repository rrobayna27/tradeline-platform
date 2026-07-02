import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";

// Brand fonts are Archivo (display/body) and Space Mono (data/numerals), per
// DECISIONS.md. They're normally loaded via `next/font/google`, which
// self-hosts them at build time — but that requires fetching
// fonts.googleapis.com, which this build sandbox's network policy blocks.
// That fetch works fine on any real host (Vercel, Netlify, a normal dev
// machine). To restore the real webfonts once deployed, replace this
// comment block with:
//
//   import { Archivo, Space_Mono } from "next/font/google";
//   const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], display: "swap" });
//   const spaceMono = Space_Mono({ variable: "--font-space-mono", subsets: ["latin"], weight: ["400", "700"], display: "swap" });
//
// and swap the two className strings below from "font-fallback" to
// `${archivo.variable} ${spaceMono.variable}`. Until then, globals.css maps
// --font-sans/--font-mono to solid system-font stacks so the app still looks
// intentional everywhere.
const fontFallbackClass = "font-fallback";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — South Florida Construction Intelligence`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: `${SITE_NAME} — South Florida Construction Intelligence`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — South Florida Construction Intelligence`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
  };

  return (
    <html lang="en" suppressHydrationWarning className={`${fontFallbackClass} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-foreground"
          >
            Skip to content
          </a>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
