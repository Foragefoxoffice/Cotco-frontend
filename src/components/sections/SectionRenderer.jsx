import HeroSection from "./HeroSection";
import AboutUsSection from "./AboutUsSection";

export default function SectionRenderer({ block, lang }) {
  switch (block.sectionType) {
    case "hero":
      return <HeroSection values={block.values} lang={lang} />;
    case "aboutus":
      return <AboutUsSection values={block.values} lang={lang} />;
    default:
      return (
        <div className="p-10 bg-red-50 border border-red-200">
          <p>⚠️ No renderer for section type: {block.sectionType}</p>
        </div>
      );
  }
}
