// components/NewsletterSection.js
import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    // handle subscription logic
    alert(`Subscribed with ${email}`);
    setEmail("");
  };

  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="mb-8 text-lg">
          Subscribe to our newsletter and never miss a wish or opportunity to help.
        </p>
        <form
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-xl mx-auto"
        >
          <input
            type="email"
            placeholder="Your email address"
            className="w-full sm:flex-1 p-4 rounded-lg text-dark"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-accent hover:bg-white hover:text-primary px-6 py-3 rounded-lg font-semibold transition"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
