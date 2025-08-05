import { FaSquareGithub } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";

const HeroSection = ({ jetbrains, inter }) => {
  return (
    <section className="flex flex-col items-start text-[#A8ADB2] mb-20">
      <p className={`${jetbrains.className} mb-3`}>Hello, my name is</p>
      <div className="mb-5">
        <h1 className="text-5xl font-extrabold md:text-6xl flex flex-col">
          <span className={`${inter.className} text-gray-100`}>Justine</span>
          <span className={`${inter.className} `}>Front end</span>
          <span className={`${inter.className}`}>Developer</span>
        </h1>
      </div>
      <p className={`${jetbrains.className} mb-5`}>
        Creating clean and fast web apps
      </p>
      <div className="flex gap-2 items-center mb-5">
        <div className="flex items-center bg-green-600/20 rounded-2xl py-1 px-3 cursor-pointer hover:bg-green-600/30">
          <span className="p-1 mb-px mr-1 inline-block bg-green-600 rounded-full"></span>
          <h1
            className={`${inter.className} text-green-600  font-bold text-sm `}
          >
            Open to work
          </h1>
        </div>
        <h1 className={`${jetbrains.className}`}>🏠 Philippines.</h1>
      </div>
      <div className="flex items-center gap-3">
        <a href="https://github.com/Syddl" target="_blank">
          <FaSquareGithub className="text-4xl hover:text-gray-100 " />
        </a>
        <a
          href="https://www.linkedin.com/in/justine-jude-cuevas-6b6235285/"
          target="_blank"
        >
          <FaLinkedin className="text-4xl hover:text-gray-100" />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
