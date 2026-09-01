import "./globals.css";
import Link from "next/link";
import { Toaster } from "sonner";
import Script from "next/script";
import { inter, jetbrainsMono } from "./fonts";
import MouseHoverEffect from "@/component/MouseHoverEffect";
import { siteUrl, siteName, github, linkedin } from "@/lib/site";

const gaId = process.env.NEXT_PUBLIC_GA_ID;

const description =
  "Justine Jude Cuevas is a full stack developer from the Philippines building fast, clean, and user-friendly web apps with React, Next.js, Tailwind CSS, FastAPI, and Express.js.";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Justine Jude Cuevas | Full Stack Developer",
    template: "%s | Justine Jude Cuevas",
  },
  description,
  keywords: [
    "Justine Jude Cuevas",
    "full stack developer",
    "frontend developer",
    "React developer",
    "Next.js",
    "Tailwind CSS",
    "web developer Philippines",
  ],
  authors: [{ name: "Justine Jude Cuevas" }],
  creator: "Justine Jude Cuevas",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Justine Jude Cuevas",
    title: "Justine Jude Cuevas | Full Stack Developer",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Justine Jude Cuevas | Full Stack Developer",
    description,
  },
  icons: {
    icon: "/favicon.jpg",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Justine Jude Cuevas",
  jobTitle: "Full Stack Developer",
  url: siteUrl,
  address: {
    "@type": "PostalAddress",
    addressCountry: "Philippines",
  },
  sameAs: [github, linkedin],
};

export default function RootLayout({ children }) {
  const year = new Date().getFullYear();

  return (
    <html lang="en">
      <body className="bg-neutral-900 w-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <MouseHoverEffect />
        <header className="lg:w-[50%] lg:relative lg:left-[25%] ">
          <div className="text-[#A8ADB2] flex justify-between items-center py-5 px-6 md:justify-center md:gap-120">
            <Link
              href="/"
              className={`${jetbrainsMono.className} font-semibold hover:text-gray-100 cursor-pointer text-lg`}
            >
              {`.justine`}
            </Link>
            <nav className={`${inter.className} flex gap-8`}>
              <Link href="/projects" className="text-[16px] hover:text-gray-100">
                Projects
              </Link>
              <Link href="/contact" className="text-[16px] hover:text-gray-100">
                Contact
              </Link>
            </nav>
          </div>
        </header>
        {children}
        <Toaster richColors />
        <footer className="border-t-1 border-solid border-gray-800 ">
          <div className="flex items-center h-15 flex-grow mx-auto max-w-3xl w-full px-6 md:px-8 gap-2">
            <p
              className={`${inter.className} text-sm font-semibold text-[#A8ADB2]`}
            >
              © {year} Justine Jude Cuevas
            </p>
          </div>
        </footer>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
