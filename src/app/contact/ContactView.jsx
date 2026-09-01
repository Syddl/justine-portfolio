"use client";

import { BiLogoGmail } from "react-icons/bi";
import { FaSquareGithub } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FiSend, FiCheck } from "react-icons/fi";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { inter } from "@/app/fonts";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { email, github, linkedin } from "@/lib/site";
import FaqAccordion from "@/component/FaqAccordion";

const container = staggerContainer(0.1, 0.1);
const cardItem = fadeInUp(20, 0.4);

export default function ContactView() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      toast.success("Email copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be unavailable (permissions, http) — fall back to
      // opening the mail app instead of failing silently.
      window.location.href = `mailto:${email}`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      form.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_KEY);
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("message", formData.message);
      form.append("subject", `Portfolio Contact: ${formData.name}`);

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow mx-auto max-w-3xl w-full p-6 pt-10 sm:px-6 lg:pt-8 mb-10">
      {/* Intro — indexable copy, not just a form */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`${inter.className} mb-10`}
      >
        <h1 className="text-gray-100 text-3xl font-bold mb-3">
          Let&apos;s build something for your business
        </h1>
        <p className="text-neutral-400 text-sm leading-relaxed max-w-2xl">
          I&apos;m a freelance full-stack developer based in the Philippines
          (GMT+8), working remotely with clients worldwide — my mornings
          overlap with US evenings, my evenings with European mornings.
          Describe your project in a couple of sentences and I&apos;ll reply
          within 24 hours with an honest read on scope and cost.
        </p>
      </motion.div>

      {/* Social links grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-3 mb-12"
      >
        <motion.button
          type="button"
          variants={cardItem}
          whileHover={{ y: -3, borderColor: "rgba(255,255,255,0.15)" }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={copyEmail}
          aria-label="Copy email address"
          className="h-36 rounded-xl flex flex-col items-center justify-center gap-3
            border border-neutral-700/60 bg-neutral-800/30
            hover:bg-neutral-800/60 transition-all duration-200 cursor-pointer"
        >
          {copied ? (
            <FiCheck className="text-5xl text-green-500" />
          ) : (
            <BiLogoGmail className="text-5xl text-neutral-200" />
          )}
          <span className={`${inter.className} text-xs text-neutral-400`}>
            {copied ? "Copied!" : `${email} — click to copy`}
          </span>
        </motion.button>

        <motion.a
          variants={cardItem}
          whileHover={{ y: -3, borderColor: "rgba(255,255,255,0.15)" }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit LinkedIn profile"
          className="h-36 rounded-xl flex flex-col items-center justify-center gap-3
            border border-neutral-700/60 bg-neutral-800/30
            hover:bg-neutral-800/60 transition-all duration-200 cursor-pointer"
        >
          <FaLinkedin className="text-5xl text-neutral-200" />
          <span className={`${inter.className} text-xs text-neutral-400`}>
            LinkedIn
          </span>
        </motion.a>

        <motion.a
          variants={cardItem}
          whileHover={{ y: -3, borderColor: "rgba(255,255,255,0.15)" }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit GitHub profile"
          className="h-36 rounded-xl flex flex-col items-center justify-center gap-3
            border border-neutral-700/60 bg-neutral-800/30
            hover:bg-neutral-800/60 transition-all duration-200 cursor-pointer col-span-2 sm:col-span-1"
        >
          <FaSquareGithub className="text-5xl text-neutral-200" />
          <span className={`${inter.className} text-xs text-neutral-400`}>
            @Syddl
          </span>
        </motion.a>
      </motion.div>

      {/* Contact form */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className={`${inter.className} mb-6`}>
          <h2 className="text-gray-100 text-xl font-bold mb-1">
            Send a message
          </h2>
          <p className="text-neutral-400 text-sm">
            A rough idea is enough — &quot;we track this in a spreadsheet and
            it&apos;s breaking&quot; is a perfectly good first message.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`${inter.className} text-gray-100`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="name"
                className="text-sm font-medium text-neutral-300"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="bg-neutral-800/50 border border-neutral-700/60 rounded-lg px-4 py-2.5 text-sm
                  text-neutral-100 placeholder-neutral-500
                  focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500/30
                  transition-all duration-200"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-neutral-300"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
                className="bg-neutral-800/50 border border-neutral-700/60 rounded-lg px-4 py-2.5 text-sm
                  text-neutral-100 placeholder-neutral-500
                  focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500/30
                  transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mb-6">
            <label
              htmlFor="message"
              className="text-sm font-medium text-neutral-300"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="What are you trying to build — or replace?"
              rows={5}
              className="bg-neutral-800/50 border border-neutral-700/60 rounded-lg px-4 py-2.5 text-sm
                text-neutral-100 placeholder-neutral-500 resize-none
                focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500/30
                transition-all duration-200"
              required
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg
              bg-neutral-100 text-neutral-900 font-medium text-sm
              hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200"
          >
            <FiSend className="w-4 h-4" />
            {loading ? "Sending..." : "Send Message"}
          </motion.button>
        </form>
      </motion.div>

      {/* FAQ */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="mt-16"
      >
        <div className={`${inter.className} mb-6`}>
          <h2 className="text-gray-100 text-xl font-bold mb-1">
            Common questions
          </h2>
          <p className="text-neutral-400 text-sm">
            The things clients usually want to know before writing the first
            email.
          </p>
        </div>
        <FaqAccordion />
      </motion.div>
    </main>
  );
}
