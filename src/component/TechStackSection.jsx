import StackCard from "@/component/StackCard";
import { stack } from "@/data/stackdata";

const TechStackSection = ({ inter }) => {
  return (
    <section className="mb-10">
      <h1
        className={`${inter.className} text-gray-100 text-xl font-bold mb-10`}
      >
        Tech Stack
      </h1>
      <div className="flex flex-wrap gap-5 justify-center items-center">
        {stack.map((data, index) => (
          <StackCard key={index} img={data.img} name={data.name} />
        ))}
      </div>
    </section>
  );
};

export default TechStackSection;
