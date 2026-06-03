"use client";

import { motion } from "framer-motion";

const AboutMeSection = ({ inter }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-16"
    >
      <h1
        className={`${inter.className} text-gray-100 text-xl font-bold mb-8`}
      >
        About me
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        {/* Left side — text (60%) */}
        <div className="md:col-span-3">
          <div className={`${inter.className} text-[#A8ADB2] space-y-4 leading-relaxed`}>
            <p>
              I&apos;m Justine, a full stack developer based in the Philippines. I
              build clean, fast, and user-friendly web applications using React,
              Next.js, and Tailwind CSS on the frontend, and FastAPI and Express.js
              on the backend. For data, I work with PostgreSQL, MongoDB, Supabase,
              and Firebase.
            </p>
            <p>
              I&apos;m currently open to work and looking to collaborate on projects
              where I can keep growing. I like solving problems, learning new tools,
              and shipping things that actually work well for people.
            </p>
          </div>
        </div>

        {/* Right side — code card (40%) */}
        <motion.div
          className="md:col-span-2"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="rounded-xl border border-neutral-700/60 bg-neutral-900/80 backdrop-blur-sm p-5 shadow-lg shadow-black/20 relative overflow-hidden">
            {/* Subtle glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-violet-500/5 pointer-events-none" />

            {/* macOS window dots */}
            <div className="flex items-center gap-1.5 mb-4 relative z-10">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>

            {/* Code content */}
            <pre className="font-mono text-xs leading-relaxed relative z-10 overflow-x-auto">
              <code>
                <span className="text-violet-400">const</span>{" "}
                <span className="text-blue-300">developer</span>{" "}
                <span className="text-neutral-500">=</span>{" "}
                <span className="text-neutral-400">{"{"}</span>
                {"\n"}
                {"  "}<span className="text-emerald-400">name</span>
                <span className="text-neutral-500">:</span>{" "}
                <span className="text-amber-300">&quot;Justine&quot;</span>
                <span className="text-neutral-500">,</span>
                {"\n"}
                {"  "}<span className="text-emerald-400">role</span>
                <span className="text-neutral-500">:</span>{" "}
                <span className="text-amber-300">&quot;Full Stack Dev&quot;</span>
                <span className="text-neutral-500">,</span>
                {"\n"}
                {"  "}<span className="text-emerald-400">location</span>
                <span className="text-neutral-500">:</span>{" "}
                <span className="text-amber-300">&quot;Philippines 🇵🇭&quot;</span>
                <span className="text-neutral-500">,</span>
                {"\n"}
                {"  "}<span className="text-emerald-400">openToWork</span>
                <span className="text-neutral-500">:</span>{" "}
                <span className="text-blue-400">true</span>
                <span className="text-neutral-500">,</span>
                {"\n"}
                {"  "}<span className="text-emerald-400">frontend</span>
                <span className="text-neutral-500">:</span>{" "}
                <span className="text-neutral-400">[</span>
                {"\n"}
                {"    "}<span className="text-amber-300">&quot;React&quot;</span>
                <span className="text-neutral-500">,</span>{" "}
                <span className="text-amber-300">&quot;Next.js&quot;</span>
                <span className="text-neutral-500">,</span>
                {"\n"}
                {"    "}<span className="text-amber-300">&quot;TypeScript&quot;</span>
                <span className="text-neutral-500">,</span>{" "}
                <span className="text-amber-300">&quot;Tailwind&quot;</span>
                {"\n"}
                {"  "}<span className="text-neutral-400">]</span>
                <span className="text-neutral-500">,</span>
                {"\n"}
                {"  "}<span className="text-emerald-400">backend</span>
                <span className="text-neutral-500">:</span>{" "}
                <span className="text-neutral-400">[</span>
                {"\n"}
                {"    "}<span className="text-amber-300">&quot;FastAPI&quot;</span>
                <span className="text-neutral-500">,</span>{" "}
                <span className="text-amber-300">&quot;Express.js&quot;</span>
                {"\n"}
                {"  "}<span className="text-neutral-400">]</span>
                <span className="text-neutral-500">,</span>
                {"\n"}
                <span className="text-neutral-400">{"}"}</span>
                <span className="text-neutral-500">;</span>
              </code>
            </pre>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AboutMeSection;
