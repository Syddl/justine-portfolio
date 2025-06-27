import "./globals.css";
import { JetBrains_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Toaster } from "sonner";
import Script from "next/script";

export const metadata = {
  title: "Justine Jude Cuevas",
  icons: {
    icon: "/favicon.jpg",
  },
};

const inter = Inter({ subsets: ["latin"] });

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["600"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        ></Script>
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body className="bg-[#171717] w-full">
        <header className="lg:w-[50%] lg:relative lg:left-[25%]">
          <div className="text-[#A8ADB2] flex justify-between items-center py-5 px-6 md:justify-center md:gap-120">
            <Link
              href="/"
              className={`${jetbrains.className} hover:text-gray-100 cursor-pointer text-lg`}
            >
              {`.justine`}
            </Link>
            <nav className={`${inter.className} flex gap-8`}>
              <Link
                href="/projects"
                className="text-[16px] hover:text-gray-100"
              >
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
            <h1
              className={`${inter.className} text-sm font-semibold text-[#A8ADB2]`}
            >
              © 2025 Justine Jude Cuevas
            </h1>
          </div>
        </footer>
      </body>
    </html>
  );
}
