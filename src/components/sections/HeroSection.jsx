export default function HeroSection({ values, lang }) {
  return (
    <div
      className="hero-section"
      style={{
        backgroundImage: `url(${values.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "100px 20px",
        color: "#fff",
      }}
    >
      <h1>{values.title?.[lang]}</h1>
      <p>{values.subtitle?.[lang]}</p>
    </div>
  );
}
