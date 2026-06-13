// Builds a complete, consistent metadata object for a page.
// Next.js overwrites (does not deep-merge) nested metadata objects like
// `openGraph`/`twitter` per route segment, so each page must emit the full set.
const siteUrl = "https://devjustine.me";
const siteName = "Justine Jude Cuevas";

export function pageMetadata({ title, description, path = "/" }) {
  const url = `${siteUrl}${path}`;
  const fullTitle = `${title} | ${siteName}`;
  const imageAlt = "Justine Jude Cuevas - Full Stack Developer";

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName,
      title: fullTitle,
      description,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          type: "image/png",
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [{ url: "/twitter-image", alt: imageAlt }],
    },
  };
}
