"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function WishForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Upload image to Supabase Storage
  const uploadImage = async (file) => {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from("wish-images")
      .upload(fileName, file);

    if (error) {
      console.error("Image upload error:", error);
      return null;
    }
    // Get public URL
    const { publicUrl } = supabase.storage.from("wish-images").getPublicUrl(fileName);
    return publicUrl;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !description || !amount) return alert("Fill all required fields");

    setLoading(true);
    let imageUrl = null;

    if (image) {
      imageUrl = await uploadImage(image);
      if (!imageUrl) {
        alert("Image upload failed. Submit without image or try again.");
        setLoading(false);
        return;
      }
    }

    const { data, error } = await supabase
      .from("wishes")
      .insert([{
        title,
        description,
        amount_target: parseFloat(amount),
        currency: "USD",
        status: "pending",
        image: imageUrl,
        verified: false
      }])
      .select()
      .single();

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Error creating wish");
    } else {
      alert("Wish submitted — pending admin approval.");
      setTitle(""); setDescription(""); setAmount(""); setImage(null);
    }
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className="max-w-lg mx-auto bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg space-y-4"
    >
      <h2 className="text-2xl font-bold text-primary dark:text-accent mb-4 text-center">
        Submit Your Wish
      </h2>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
        className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent transition"
      />

      <textarea
        placeholder="Describe the wish"
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
        rows={4}
        className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent transition resize-none"
      />

      <input
        type="number"
        placeholder="Amount (USD)"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        required
        className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent transition"
      />

      {/* Image Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 transition"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary dark:bg-accent text-white font-bold py-3 rounded-lg hover:bg-primary/90 dark:hover:bg-accent/90 transition"
      >
        {loading ? "Submitting..." : "Submit Wish"}
      </button>
    </form>
  );
}