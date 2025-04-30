import Image from "next/image"
import { Inter } from 'next/font/google'

const inter = Inter({
    display: 'swap',
    subsets: ['latin']
})

export default function StackCard({img, name}) {
  return(
    <div className="hover:scale-110 transition-transform cursor-pointer hover:bg-gray-100/5 border-1 border-gray-500 flex flex-col items-center justify-center h-23 w-30 gap-2 rounded-lg">
      <Image 
        src={img}
        width={30}
        height={30}
        alt={name}
      />
      <h1 className={`${inter.className} text-[#A8ADB2]`}>{name}</h1>
    </div>
  )
}