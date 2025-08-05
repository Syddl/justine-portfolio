import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({
  display: "swap",
  subsets: ["latin"],
});

export default function StackCard({ img, name }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-300 text-sm hover:bg-neutral-700 transition-colors duration-200 w-30 h-24">
      <Image
        src={img}
        width={24}
        height={24}
        alt={name}
        className="object-contain w-10 h-10 mb-1"
      />
      <span className={`${inter.className} text-center`}>{name}</span>
    </div>
  );
}
