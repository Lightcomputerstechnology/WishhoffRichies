import Link from "next/link";
export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-slate-200 py-12 mt-10 border-t border-slate-700">
      <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8 text-center md:text-left">
        {/* About / Branding */}
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-bold text-white">WishhoffRichies</h2>
          <p className="text-sm text-slate-400">
            Inspiring small acts of kindness, one wish at a time.
          </p>
          <div className="flex justify-center md:justify-start gap-4 mt-2">
            <a href="#" className="hover:text-accent transition">Twitter</a>
            <a href="#" className="hover:text-accent transition">Instagram</a>
            <a href="#" className="hover:text-accent transition">LinkedIn</a>
            <a href="#" className="hover:text-accent transition">Facebook</a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-white mb-2">Quick Links</h3>
          <Link href="/" className="hover:text-accent transition">Home</Link>
          <Link href="/browse-wishes" className="hover:text-accent transition">Browse Wishes</Link>
          <Link href="/create-wish" className="hover:text-accent transition">Make a Wish</Link>
          <Link href="/faq" className="hover:text-accent transition">FAQ</Link>
          <Link href="/contact" className="hover:text-accent transition">Contact Us</Link>
        </div>

        {/* Newsletter / Call to Action */}
        <div className="flex flex-col gap-3 items-center md:items-start">
          <h3 className="text-lg font-semibold text-white mb-2">Subscribe to Newsletter</h3>
          <p className="text-sm text-slate-400">Get updates about new wishes and success stories.</p>
          <form className="mt-2 flex w-full max-w-sm">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-l-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="submit"
              className="bg-accent text-white px-4 py-2 rounded-r-lg font-semibold hover:bg-primary transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Trust badges / security info */}
      <div className="mt-8 flex flex-col md:flex-row justify-center md:justify-between items-center gap-4 border-t border-slate-700 pt-4 text-sm text-slate-400">
        <div className="flex flex-wrap gap-4 justify-center">
          <span className="px-3 py-1 bg-slate-800 rounded-full">✅ Verified Wishes</span>
          <span className="px-3 py-1 bg-slate-800 rounded-full">🔒 Secure Payments</span>
          <span className="px-3 py-1 bg-slate-800 rounded-full">💯 Transparent Donations</span>
        </div>

        <div className="text-center md:text-right mt-2 md:mt-0">
          © {new Date().getFullYear()} WishhoffRichies — Built with 💙 by Light Tech Hub
        </div>
      </div>
    </footer>
  );
}