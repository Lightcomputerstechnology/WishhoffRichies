// pages/admin/login.js
import Head from "next/head";
import Navbar from "../../components/Navbar";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function requestMagicLink(e) {
    e.preventDefault();
    setMessage("");
    if (!email) return setMessage("Enter your admin email");
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      setMessage("Magic link sent — check your email. Use the admin account.");
    } catch (err) {
      setMessage(err.message || "Sign-in failed");
    }
  }

  return (
    <>
      <Head><title>Admin sign in — WishhoffRichies</title></Head>
      <Navbar />
      <main className="container py-8">
        <div className="form-card">
          <h1 className="text-xl font-bold">Admin sign in</h1>
          <p className="muted">Enter the admin email. You'll receive a magic link if authorized.</p>
          <form onSubmit={requestMagicLink} className="mt-4">
            <input value={email} onChange={(e) => setEmail(e.target.value)} name="email" type="email" placeholder="admin@example.com" className="mb-3 w-full" />
            <button className="btn primary" type="submit">Send magic link</button>
          </form>
          {message && <p className="message mt-3">{message}</p>}
        </div>
      </main>
    </>
  );
}
