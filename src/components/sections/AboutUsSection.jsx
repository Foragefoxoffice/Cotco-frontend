import { Image } from "antd";

export default function AboutUsSection({ values, lang }) {
  return (
    <div className="about-section flex gap-6 items-center py-16 px-10 bg-gray-50">
      <div className="flex-1">
        <h2 className="text-3xl font-bold mb-4">{values.title?.[lang]}</h2>
        <p className="text-gray-600">Some description could go here...</p>
      </div>
      <div className="flex-1">
        <Image src={values.image} alt={values.title?.[lang]} />
      </div>
    </div>
  );
}
