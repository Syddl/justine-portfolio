"use client";
import { BiLogoGmail } from "react-icons/bi";
import { inter } from "../font";
import { FaSquareGithub } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { RiTelegram2Line } from "react-icons/ri";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import MouseHoverEffect from "@/component/MouseHoverEffect";

export default function ContactPage() {
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

    // Basic validation
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
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error(data.error || "Failed to send message");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow mx-auto max-w-3xl w-full p-4 pb-6 pt-10 sm:px-6 lg:px-8 lg:pb-8 lg:pt-8 mb-5 ">
      <MouseHoverEffect />
      <div className="h-80 flex gap-3 text-gray-100 mb-10">
        <div className="w-[50%] flex flex-col gap-3">
          <motion.a
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            href="https://mail.google.com/mail/?view=cm&fs=1&to=justinecuevas19@gmail.com"
            target="_blank"
            className="h-[50%] rounded-xl flex justify-center items-center border-1 border-gray-500 cursor-pointer hover:bg-gray-700/10"
          >
            <BiLogoGmail className="text-6xl" />
          </motion.a>
          <motion.a
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            href="https://github.com/Syddl"
            target="_blank"
            className="h-[50%] rounded-xl flex justify-center items-center border-1 border-gray-500 cursor-pointer hover:bg-gray-700/10"
          >
            <FaSquareGithub className="text-6xl" />
          </motion.a>
        </div>
        <motion.a
          initial={{ x: -70, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          href="https://www.linkedin.com/in/justine-jude-cuevas-6b6235285/"
          target="_blank"
          className="border-1 border-gray-500 w-[50%]  rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-700/10"
        >
          <FaLinkedin className="text-6xl" />
        </motion.a>
      </div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className={`${inter.className}`}>
          <h1 className="text-gray-100 text-xl font-bold mb-2">
            Contact with me
          </h1>
          <p className="text-[#A8ADB2] mb-5 text-sm font-semibold">
            You can also get in touch with me through this form below
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className={`${inter.className} text-gray-100`}
        >
          <div className="flex flex-col md:flex-row gap-3 mb-5">
            <div className="flex flex-col">
              <label htmlFor="name" className="mb-2 text-sm font-semibold">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="border-1 border-gray-700 p-2 md:w-86.5 rounded-md w-full"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className="mb-2 text-sm font-semibold">
                Email
              </label>
              <input
                id="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                name="email"
                placeholder="Your email"
                className="border-1 border-gray-700 p-2 md:w-86.5 rounded-md"
                required
              />
            </div>
          </div>
          <div className="flex flex-col mb-5">
            <label htmlFor="message" className="mb-2 text-sm font-semibold">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message"
              className="rounded-md border-1 border-gray-700 p-2 min-h-[150px]"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-gray-400/20 flex items-center justify-center py-3 rounded-md w-full gap-2 md:w-50 cursor-pointer hover:bg-gray-200/20"
          >
            <RiTelegram2Line className="text-xl" />
            <p>{loading ? "Sending..." : "Send Message"}</p>
          </button>
        </form>
      </motion.div>
    </main>
  );
}
