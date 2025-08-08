import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({
  display: "swap",
  subsets: ["latin"],
});

export default function StackCard({ icon: Icon, name }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-300 text-sm hover:bg-neutral-700 transition-colors duration-200 w-24 h-24">
      <Icon className=" w-10 h-10 mb-1 text-white" />
      <span className={`${inter.className} text-center`}>{name}</span>
    </div>
  );
}
