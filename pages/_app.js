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
  const [supabaseClient, setSupabaseClient] = useState(null);

  // Initialize Supabase client on client-side only
  useEffect(() => {
    setSupabaseClient(createPagesBrowserClient());

    // Initialize AOS after window exists
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
    });

    // Optional: log uncaught errors on the page for iPhone debugging
    window.onerror = (msg, url, line, col, error) => {
      document.body.innerHTML = `<pre style="color:red;">${msg}\n${error?.stack}</pre>`;
    };
  }, []);

  // Show loading until client is ready
  if (!supabaseClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400 animate-pulse">
          Loading application…
        </p>
      </div>
    );
  }

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
    </SessionContextProvider >
  );
}
