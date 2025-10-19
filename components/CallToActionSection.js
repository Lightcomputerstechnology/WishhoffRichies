// components/CallToActionSection.js
import Link from "next/link";

export default function CallToActionSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-accent text-white text-center">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Make a Difference?
        </h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Post a wish or donate today. Every contribution helps bring dreams to life!
        </p>
        <div className="flex justify-center gap-6 flex-wrap">
          <Link
            href="/wish/new"
            className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Make a Wish
          </Link>
          <Link
            href="/explore"
            className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition"
          >
            Browse Wishes
          </Link>
        </div>
      </div>
    </section>
  );
}
