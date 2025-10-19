// pages/index.js
import Head from "next/head";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import FeaturedWishesSection from "../components/FeaturedWishesSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Head>
        <title>WishhoffRichies — Turn wishes into reality</title>
        <meta
          name="description"
          content="WishhoffRichies connects generous donors with real people who need a helping hand."
        />
      </Head>

      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <FeaturedWishesSection />
      <Footer />
    </>
  );
}
