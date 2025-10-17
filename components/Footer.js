// components/Footer.js
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p>© {new Date().getFullYear()} WishhoffRichies — Built by Light Tech Hub</p>
        <p className="muted">Trusted platform for small acts of kindness.</p>
      </div>
    </footer>
  );
}
