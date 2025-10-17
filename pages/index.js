import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>WishhoffRichies — Turn wishes into reality</title>
        <meta name="description" content="WishhoffRichies connects generous donors with real people who need a helping hand." />
      </Head>
      <Navbar />
      <header className="container py-12">
        <div className="md:flex md:items-center md:gap-8">
          <div className="md:flex-1">
            <h1 className="text-3xl font-bold">Turn wishes into reality</h1>
            <p className="mt-4 text-slate-600 dark:text-slate-300">A safe, verified platform where donors fund honest needs. Fast, transparent, and human.</p>
            <div className="mt-6 flex gap-3">
              <Link href="/wish/new"><a className="px-4 py-2 rounded bg-primary text-white">Make a Wish</a></Link>
              <Link href="/explore"><a className="px-4 py-2 rounded border border-primary text-primary">Browse Wishes</a></Link>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>• Manual moderation for high-value requests</li>
              <li>• Secure payments via Stripe</li>
              <li>• Email receipts and transparent records</li>
            </ul>
          </div>
          <div className="md:w-96 mt-8 md:mt-0">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow">
              <h4 className="text-slate-500">Featured Wish</h4>
              <h3 className="font-bold">School fees for Ada</h3>
              <div className="mt-3 bg-slate-100 rounded-full h-3 overflow-hidden">
                <div style={{ width: "62%" }} className="bg-primary h-3 rounded-full"></div>
              </div>
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">$620 raised of $1000</div>
              <div className="mt-4"><Link href="/explore"><a className="px-3 py-1 bg-primary text-white rounded">View Wishes</a></Link></div>
            </div>
          </div>
        </div>
      </header>
      <section className="container grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded shadow">
          <h4 className="font-semibold">Simple</h4>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Post a wish in under 60 seconds.</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded shadow">
          <h4 className="font-semibold">Trustworthy</h4>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Moderation and KYC for larger payouts.</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded shadow">
          <h4 className="font-semibold">Secure</h4>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Payments via Stripe; records in Supabase.</p>
        </div>
      </section>
      <Footer />
    </>
  );
}
