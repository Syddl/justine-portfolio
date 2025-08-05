import React from "react";

const AboutMeSection = ({ jetbrains, inter }) => {
  const about =
    "I'm Justine, a frontend developer based in the Philippines with a passion for building clean, fast, and user-friendly web applications. I enjoy turning ideas into functional and visually appealing interfaces using tools like React, Next.js, and Tailwind CSS. Currently open to work opportunities, I'm eager to grow as a developer and collaborate on meaningful projects that make a difference. Whether it's crafting sleek UI or learning new tech, I'm always up for a challenge.";

  return (
    <section className="mb-10">
      <h1
        className={`${inter.className} text-gray-100 text-xl font-bold mb-10`}
      >
        About me
      </h1>
      <p className={`${jetbrains.className} text-[#A8ADB2] text-justify`}>
        {about}
      </p>
    </section>
  );
};

export default AboutMeSection;
