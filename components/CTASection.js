// components/CTASection.js
import Link from "next/link";

export default function CTASection({ title, subtitle, buttonText, buttonLink }) {
  return (
    <section className="py-16 bg-primary text-white text-center rounded-xl mx-6 my-12 shadow-lg">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
      <p className="text-lg mb-8">{subtitle}</p>
      <Link
        href={buttonLink}
        className="inline-block bg-white text-primary font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition"
      >
        {buttonText}
      </Link>
    </section>
  );
}
