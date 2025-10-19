// pages/_app.js
import '../styles/globals.css';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    AOS.init({
      duration: 1000,     // Animation duration
      once: true,         // Only animate once
      easing: 'ease-out-cubic',
    });
  }, []);

  return <Component {...pageProps} />;
}
