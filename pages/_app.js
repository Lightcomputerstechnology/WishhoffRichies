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
  const [envError, setEnvError] = useState(null);

  useEffect(() => {
    // Validate required client-side environment variables
    const requiredClientVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'NEXT_PUBLIC_FLW_PUBLIC',
      'NEXT_PUBLIC_NOWPAY_PUBLIC',
      'NEXT_PUBLIC_PAYSTACK_PUBLIC',
      'NEXT_PUBLIC_SITE_URL',
    ];

    const missingVars = requiredClientVars.filter(
      (key) => !process.env[key]
    );

    if (missingVars.length > 0) {
      setEnvError(
        `❌ Missing client environment variables: ${missingVars.join(', ')}`
      );
      console.error('Missing environment variables:', missingVars);
      return;
    }

    // Initialize Supabase client
    setSupabaseClient(createPagesBrowserClient());

    // Initialize AOS
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
    });

    // Optional: log uncaught errors on page for debugging
    window.onerror = (msg, url, line, col, error) => {
      document.body.innerHTML = `<pre style="color:red;">${msg}\n${error?.stack}</pre>`;
    };
  }, []);

  if (envError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <pre className="text-red-500 font-bold text-center">{envError}</pre>
        <p className="mt-4 text-slate-700 dark:text-slate-300 text-center">
          Please check your environment variables in Render and redeploy the app.
        </p>
      </div>
    );
  }

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
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
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
