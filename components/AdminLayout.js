import Navbar from "./Navbar";
export default function AdminLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="container py-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow">{children}</div>
      </main>
    </>
  );
}
