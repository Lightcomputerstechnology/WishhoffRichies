export default function Footer() {
  return (
    <footer className="bg-[#1E3A8A] text-white py-10 mt-10">
      <div className="container mx-auto text-center px-4">
        <p className="text-lg font-medium">
          © {new Date().getFullYear()} WishhoffRichies — Built by Light Tech Hub
        </p>
        <p className="text-sm opacity-80 mt-1">
          Trusted platform for small acts of kindness 💙
        </p>
      </div>
    </footer>
  );
}