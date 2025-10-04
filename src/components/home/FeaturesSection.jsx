const FeaturesSection = () => {
  const features = [
    { title: "Chapter-wise Tests", desc: "Practice by topics & chapters to strengthen your basics." },
    { title: "Real-time Analytics", desc: "Detailed performance reports to track your progress." },
    { title: "Expert Solutions", desc: "Get step-by-step solutions by NEET experts." },
  ];

  return (
    <section className="py-16 px-6 text-center bg-gray-50">
      <h2 className="text-3xl font-bold mb-12">Why Choose Us?</h2>
      <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
        {features.map((f, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
