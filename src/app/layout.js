import "./globals.css";
import Link from "next/link";
import { Toaster } from "sonner";
import Script from "next/script";
import { inter, jetbrainsMono } from "./fonts";
import Logo from "@/component/Logo";
import MouseHoverEffect from "@/component/MouseHoverEffect";
import { siteUrl, siteName, github, linkedin, email, personId } from "@/lib/site";

const gaId = process.env.NEXT_PUBLIC_GA_ID;

const description =
  "Justine Jude Cuevas is a freelance full-stack developer in the Philippines building web apps, dashboards, and AI tools for startups and small businesses.";

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

// Entity backbone for Google and AI answer engines: the @id lets every
// other schema block (WebSite, ProfilePage, CreativeWork) reference this
// one Person instead of redefining it.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": personId,
  name: siteName,
  givenName: "Justine Jude",
  familyName: "Cuevas",
  jobTitle: "Full Stack Developer",
  description,
  url: siteUrl,
  email: `mailto:${email}`,
  image: `${siteUrl}/opengraph-image`,
  address: {
    "@type": "PostalAddress",
    addressCountry: "Philippines",
  },
  knowsAbout: [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Tailwind CSS",
    "Node.js",
    "Express.js",
    "Python",
    "FastAPI",
    "PostgreSQL",
    "MongoDB",
    "Supabase",
    "Firebase",
    "Redis",
    "Stripe",
    "FFmpeg",
    "Docker",
  ],
  worksFor: {
    "@type": "Organization",
    name: "Interactive Content Digital s.r.o.",
  },
  hasOccupation: {
    "@type": "Occupation",
    name: "Full Stack Developer",
  },
  sameAs: [github, linkedin],
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  url: siteUrl,
  publisher: { "@id": personId },
};

export default function RootLayout({ children }) {
  const year = new Date().getFullYear();

  return (
    <html lang="en">
      <body className="bg-neutral-900 w-full min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
        <MouseHoverEffect />
        {/* Header, main, and footer share one column so every left edge lines
            up: the old half-width header only matched the content by accident
            at ~1280px. */}
        <header className="mx-auto max-w-3xl w-full px-6">
          <div className="text-[#A8ADB2] flex justify-between items-center py-5">
            <Logo />
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
        <footer className="border-t border-solid border-gray-800">
          <div className="mx-auto max-w-3xl w-full px-6 h-15 flex items-center justify-between gap-4">
            <p
              className={`${inter.className} text-sm font-semibold text-[#A8ADB2]`}
            >
              © {year} Justine Jude Cuevas
            </p>
            <nav
              aria-label="Elsewhere"
              className={`${jetbrainsMono.className} flex items-center gap-4 text-xs text-neutral-500`}
            >
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-100 transition-colors"
              >
                GitHub
              </a>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-100 transition-colors"
              >
                LinkedIn
              </a>
              <a
                href={`mailto:${email}`}
                className="hover:text-gray-100 transition-colors"
              >
                email
              </a>
            </nav>
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
