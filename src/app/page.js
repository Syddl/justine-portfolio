import { JetBrains_Mono } from 'next/font/google'
import { Inter } from 'next/font/google'
import { FaSquareGithub } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";

export const metadata = {
  title: "Justine Jude Cuevas",
  description: "",
};

const inter = Inter({
    display: 'swap',
    subsets: ['latin']
})

const jetbrains = JetBrains_Mono({
  subsets:['latin'],
  display: 'swap',
  weight: ['400'],
})

export default function Home() {
  return (
    <main className=" flex items-center px-4 py-6 text-[#A8ADB2] sm:px-6 md:mx-32 lg:mx-32 xl:mx-64 2xl:mx-96">
      <div>
        <p className={`${jetbrains.className} mb-3`}>Hey, my name is</p>
        <div className='mb-5'>
          <h1 className={`${inter.className} text-white text-5xl font-extrabold md:text-6xl `}>Justine</h1>
          <h1 className={`${inter.className} text-5xl font-extrabold md:text-6xl lg:text-7xl`}>Front end</h1>
          <h1 className={`${inter.className} text-5xl font-extrabold md:text-6xl lg:text-7xl`}>Developer</h1>
        </div>
        <p className={`${jetbrains.className} mb-3`}>Creating clean and fast web apps</p>
        <div className='flex gap-2 items-center mb-5'>
          <div className='flex items-center bg-green-600/20 rounded-2xl py-1 px-2'>
            <span className="p-1 mb-px mr-1 inline-block bg-green-600 rounded-full"></span>
            <h1 className={`${inter.className} text-green-600 font-bold text-sm `}>Open to internship</h1>
          </div>
          <h1 className={`${jetbrains.className}`}>🏠 Philippines.</h1>
        </div>
        <div className='flex items-center gap-3'>
          <a href="https://github.com/Syddl" target='_blank'>
            <FaSquareGithub className='text-4xl'/>
          </a>
          <a href="https://www.linkedin.com/in/justine-jude-cuevas-6b6235285/" target='_blank'>
            <FaLinkedin className='text-4xl'/>
          </a>
        </div>
      </div>

    </main>
  );
}
