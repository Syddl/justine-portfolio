"use client";

import {
  FiArrowUpRight,
  FiCheck,
  FiCopy,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiSend,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import TimezoneLine from "@/component/TimezoneLine";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { email, github, githubHandle, linkedin } from "@/lib/site";
import SectionHeading from "@/component/SectionHeading";
import Cameo from "@/component/mascot/Cameo";

const container = staggerContainer(0.1, 0.1);
const cardItem = fadeInUp(20, 0.4);

// One row style for every contact link, matching the project rows.
const rowClass =
  "group -mx-3 flex w-full items-center gap-4 rounded-card px-3 py-3.5 text-left transition-colors duration-150 hover:bg-hover";
const iconTile =
  "grid size-9 shrink-0 place-items-center rounded-card border border-line-strong bg-surface text-ink-2";
const linkedinHandle = linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\//, "");

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
      // Clipboard can be unavailable (permissions, http) - fall back to
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
    <main className="flex-grow mx-auto max-w-col w-full px-6 pt-8 pb-24 lg:pt-12">
      {/* Intro - indexable copy, not just a form. The timezone line replaces
          the old "my mornings overlap with US evenings" sentence with the
          visitor's own numbers. */}
      <motion.div
        initial={{ y: 14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10"
      >
        <h1 className="text-[2.125rem] font-medium tracking-[-0.02em] leading-tight text-ink mb-3">
          Let&apos;s build something for your business
        </h1>
        <p className="text-body text-[15px] leading-relaxed max-w-xl mb-4">
          I&apos;m an AI full-stack engineer in the Philippines, available for
          full-time remote roles and freelance projects worldwide. Describe your project in a couple of
          sentences and I&apos;ll reply within 24 hours with an honest read on
          scope and cost.
        </p>
        <TimezoneLine />
      </motion.div>

      {/* Where to reach me, as rows like the rest of the site. The email row
          copies the address (falling back to the mail app); the others open
          in a new tab. */}
      <motion.ul
        variants={container}
        initial="hidden"
        animate="show"
        className="mb-14 border-t border-line divide-y divide-line"
      >
        <motion.li variants={cardItem}>
          <button
            type="button"
            onClick={copyEmail}
            className={rowClass}
          >
            <span className={iconTile}>
              <FiMail className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium text-ink">Email</span>
              <span className="block truncate text-sm text-muted">{email}</span>
            </span>
            <span className="text-sm text-muted">{copied ? "Copied" : "Copy"}</span>
            {copied ? (
              <FiCheck className="size-4 text-accent" aria-hidden="true" />
            ) : (
              <FiCopy className="size-4 text-faint group-hover:text-ink" aria-hidden="true" />
            )}
          </button>
        </motion.li>

        <motion.li variants={cardItem}>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={rowClass}
          >
            <span className={iconTile}>
              <FiLinkedin className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium text-ink">LinkedIn</span>
              <span className="block truncate text-sm text-muted">{linkedinHandle}</span>
            </span>
            <FiArrowUpRight className="size-4 text-faint group-hover:text-ink" aria-hidden="true" />
          </a>
        </motion.li>

        <motion.li variants={cardItem}>
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className={rowClass}
          >
            <span className={iconTile}>
              <FiGithub className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium text-ink">GitHub</span>
              <span className="block truncate text-sm text-muted">@{githubHandle}</span>
            </span>
            <FiArrowUpRight className="size-4 text-faint group-hover:text-ink" aria-hidden="true" />
          </a>
        </motion.li>
      </motion.ul>

      {/* Contact form */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <SectionHeading
          title="Send a message"
          lede={
            <>
              A rough idea is enough. &quot;We track this in a spreadsheet and
              it&apos;s breaking&quot; is a perfectly good first message.
            </>
          }
          action={<Cameo kind="envelope" />}
        />

        <form
          onSubmit={handleSubmit}
          className="text-ink"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="name"
                className="text-sm font-medium text-ink-2"
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
                className="bg-surface border border-line-strong rounded-card px-4 py-2.5 text-sm
                  text-ink placeholder:text-muted
                  focus:outline-none focus:border-muted focus:ring-1 focus:ring-muted/30
                  transition-all duration-200"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-ink-2"
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
                className="bg-surface border border-line-strong rounded-card px-4 py-2.5 text-sm
                  text-ink placeholder:text-muted
                  focus:outline-none focus:border-muted focus:ring-1 focus:ring-muted/30
                  transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mb-6">
            <label
              htmlFor="message"
              className="text-sm font-medium text-ink-2"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="What are you trying to build or replace?"
              rows={5}
              className="bg-surface border border-line-strong rounded-card px-4 py-2.5 text-sm
                text-ink placeholder:text-muted resize-none
                focus:outline-none focus:border-muted focus:ring-1 focus:ring-muted/30
                transition-all duration-200"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="pill">
            <FiSend className="w-4 h-4" />
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </motion.div>
    </main>
  );
}
