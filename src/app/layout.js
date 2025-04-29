import "./globals.css";
import { JetBrains_Mono } from 'next/font/google'
import { Inter } from 'next/font/google'
import Link from 'next/link'

export const metadata = {
  title: "Justine Jude Cuevas",
  description: "",
};

const inter = Inter({ subsets: ['latin'] })

const jetbrains = JetBrains_Mono({
  subsets:['latin'],
  display: 'swap',
  weight: ['600'],
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0c0f11]">
        <header className="text-[#A8ADB2] flex justify-between items-center py-4 px-6 lg:mx-32 xl:mx-64 2xl:mx-96">
          <Link href="/" className={`${jetbrains.className} cursor-pointer text-lg`}>
            {`<Justine/>`}
          </Link>
          <nav className={`${inter.className} flex gap-5 sm:gap-7 md:gap-8`}>
            <Link href="/#project" 
              className="text-[16px]">
              Projects
            </Link>
            <Link href="/#contact" 
              className="text-[16px]">
              Contact
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
