"use client";

import { BiLogoGmail } from "react-icons/bi";
import { FaSquareGithub } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { inter } from "@/app/fonts";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const container = staggerContainer(0.1, 0.1);
const cardItem = fadeInUp(20, 0.4);

export default function ContactView() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      {/* Social links grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-3 mb-12"
      >
        <motion.a
          variants={cardItem}
          whileHover={{ y: -3, borderColor: "rgba(255,255,255,0.15)" }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          href="https://mail.google.com/mail/?view=cm&fs=1&to=justinecuevas19@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Send email via Gmail"
          className="h-36 rounded-xl flex flex-col items-center justify-center gap-3
            border border-neutral-700/60 bg-neutral-800/30
            hover:bg-neutral-800/60 transition-all duration-200 cursor-pointer"
        >
          <BiLogoGmail className="text-5xl text-neutral-200" />
          <span className={`${inter.className} text-xs text-neutral-400`}>
            justinecuevas19@gmail.com
          </span>
        </motion.a>

        <motion.a
          variants={cardItem}
          whileHover={{ y: -3, borderColor: "rgba(255,255,255,0.15)" }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          href="https://www.linkedin.com/in/justine-jude-cuevas-6b6235285/"
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
          href="https://github.com/Syddl"
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
          <h1 className="text-gray-100 text-xl font-bold mb-1">Get in touch</h1>
          <p className="text-neutral-400 text-sm">
            Have a project in mind or just want to say hello? Drop me a message.
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
              placeholder="Your message"
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
    </main>
  );
}
