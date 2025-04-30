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
      <body className="bg-[#0c0f11] w-full">
        <header className="lg:w-[50%] lg:relative lg:left-[25%]">
          <div className="text-[#A8ADB2] flex justify-between items-center py-3 px-6 md:justify-center md:gap-110">
            <Link href="/#home" className={`${jetbrains.className} cursor-pointer text-lg`}>
              {`<Justine/>`}
            </Link>
            <nav className={`${inter.className} flex gap-8`}>
              <Link href="/#project" 
                className="text-[16px]">
                Projects
              </Link>
              <Link href="/#contact" 
                className="text-[16px]">
                Contact
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
