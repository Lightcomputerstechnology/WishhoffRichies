// pages/_app.js
"use client";

import "../styles/globals.css";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Toaster } from "react-hot-toast";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

export default function MyApp({ Component, pageProps }) {
  const [supabaseClient, setSupabaseClient] = useState(null);
  const [envError, setEnvError] = useState("");

  useEffect(() => {
    // Check required environment variables
    const requiredVars = [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "NEXT_PUBLIC_FLW_PUBLIC",
      "NEXT_PUBLIC_NOWPAY_PUBLIC",
      "NEXT_PUBLIC_PAYSTACK_PUBLIC",
      "NEXT_PUBLIC_SITE_URL",
    ];

    const missing = requiredVars.filter((v) => !process.env[v]);
    if (missing.length > 0) {
      console.error("❌ Missing environment variables:", missing);
      setEnvError(
        `❌ Missing environment variables: ${missing.join(", ")}`
      );
      return;
    }

    // Initialize Supabase client
    setSupabaseClient(createPagesBrowserClient());

    // Initialize AOS
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
    });

    // Optional: log uncaught errors for debugging
    window.onerror = (msg, url, line, col, error) => {
      console.error(msg, error);
    };
  }, []);

  if (envError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <pre className="text-red-600 font-bold">{envError}</pre>
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
            background: "#1E293B",
            color: "#fff",
            borderRadius: "8px",
            padding: "10px 16px",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#4ADE80", secondary: "#1E293B" } },
          error: { iconTheme: { primary: "#F87171", secondary: "#1E293B" } },
        }}
      />
    </SessionContextProvider>
  );
}
