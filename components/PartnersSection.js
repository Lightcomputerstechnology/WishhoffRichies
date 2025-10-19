// components/PartnersSection.js
import ScrollWrapper from "./ScrollWrapper";

const partners = [
  "/partners/logo1.png",
  "/partners/logo2.png",
  "/partners/logo3.png",
  "/partners/logo4.png",
  "/partners/logo5.png",
];

export default function PartnersSection() {
  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-primary mb-10">
          Our Trusted Partners
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-12">
          {partners.map((logo, i) => (
            <ScrollWrapper key={i} animation="fade-up" duration={500 + i * 200}>
              <img src={logo} alt={`Partner ${i + 1}`} className="h-16 object-contain" />
            </ScrollWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
