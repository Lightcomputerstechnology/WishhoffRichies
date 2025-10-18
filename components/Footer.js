export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-slate-200 py-10 mt-10 border-t border-slate-700">
      <div className="container mx-auto text-center px-4">
        <p className="text-lg font-semibold tracking-wide">
          © {new Date().getFullYear()} WishhoffRichies — Built with 💙 by Light Tech Hub
        </p>
        <p className="text-sm text-slate-400 mt-2">
          Inspiring small acts of kindness, one wish at a time.
        </p>
      </div>
    </footer>
  );
}
