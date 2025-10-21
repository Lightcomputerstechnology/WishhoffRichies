// pages/_app.js
"use client";

import '../styles/globals.css';
import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Toaster } from 'react-hot-toast';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

export default function MyApp({ Component, pageProps }) {
  // ✅ Create Supabase client only on the client
  const [supabaseClient, setSupabaseClient] = useState(null);

  useEffect(() => {
    setSupabaseClient(createPagesBrowserClient());
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
    });
  }, []);

  // Render nothing until client is ready
  if (!supabaseClient) return null;

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
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
          success: { iconTheme: { primary: '#4ADE80', secondary: '#1E293B' } },
          error: { iconTheme: { primary: '#F87171', secondary: '#1E293B' } },
        }}
      />
    </SessionContextProvider>
  );
}