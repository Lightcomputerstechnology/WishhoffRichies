// pages/_app.js
import '../styles/globals.css';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Toaster } from 'react-hot-toast';

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      once: true,     // Only animate once
      easing: 'ease-out-cubic',
    });
  }, []);

  return (
    <>
      <Component {...pageProps} />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1E293B',
            color: '#fff',
            borderRadius: '8px',
            padding: '10px 16px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#4ADE80',
              secondary: '#1E293B',
            },
          },
          error: {
            iconTheme: {
              primary: '#F87171',
              secondary: '#1E293B',
            },
          },
        }}
      />
    </>
  );
}
