"use client";
import Link from "next/link";
import Head from "next/head";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturedWishesSection from "../components/FeaturedWishesSection";
import MilestonesSection from "../components/MilestonesSection";
import TestimonialsSection from "../components/TestimonialsSection";
import PartnersSection from "../components/PartnersSection";
import NewsletterSection from "../components/NewsletterSection";
import FeaturedWishesStats from "../components/FeaturedWishesStats";
import Footer from "../components/Footer";
import CTASection from "../components/CTASection";

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
      <FeaturedWishesSection />
      <FeaturedWishesStats />
      <MilestonesSection />
      <TestimonialsSection />
      <PartnersSection />
      <NewsletterSection />

      <CTASection
        title="Become a Generous Donor"
        subtitle="Your contribution can change a life today."
        buttonText="Start Giving"
        buttonLink="/wish/new"
      />

      <CTASection
        title="Join Our Mission"
        subtitle="Sign up and start helping people now."
        buttonText="Sign Up"
        buttonLink="/signup"
      />

      <Footer />
    </>
  );
}
