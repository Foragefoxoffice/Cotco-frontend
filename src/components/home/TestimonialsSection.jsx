const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Dr. Aarti Menon",
      text: "MedAgg transformed our hospital’s operational workflow. Their tools are intuitive and powerful.",
    },
    {
      name: "Rahul K., MBBS Student",
      text: "Their clinical learning modules helped me bridge the gap between theory and practice.",
    },
  ];

  return (
    <section className="py-16 px-6 bg-white text-center">
      <h2 className="text-3xl font-bold mb-12 text-blue-800">Client Testimonials</h2>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {testimonials.map((t, i) => (
          <div key={i} className="p-6 border rounded-xl shadow-sm bg-gray-50">
            <p className="text-gray-700 italic mb-4">“{t.text}”</p>
            <h4 className="font-semibold text-blue-700">{t.name}</h4>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
