// components/KYCModal.js
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function KYCModal({ userId, onUploaded, onClose }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function upload() {
    if (!file) return setMessage("Choose a file first");
    setLoading(true);
    try {
      // create a unique path
      const filename = `${userId}_${Date.now()}_${file.name}`;
      const { data, error: upErr } = await supabase.storage.from("kyc").upload(filename, file, {
        cacheControl: "3600",
        upsert: false
      });
      if (upErr) throw upErr;

      // create public URL
      const { data: urlData } = supabase.storage.from("kyc").getPublicUrl(data.path);
      const fileUrl = urlData.publicUrl;

      // register in DB via API
      const res = await fetch("/api/wishes/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, fileUrl })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "KYC registration failed");
      setMessage("Uploaded and submitted for review");
      onUploaded && onUploaded(body);
    } catch (err) {
      setMessage(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="bg-white dark:bg-slate-800 p-6 rounded shadow z-10 max-w-md w-full">
        <h3 className="font-semibold mb-2">Upload KYC document</h3>
        <p className="text-sm text-slate-600 mb-3">Upload a government ID or official document. Moderators will verify this before large payouts.</p>
        <input type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0])} className="mb-3" />
        <div className="flex gap-2">
          <button onClick={upload} className="btn primary" disabled={loading}>{loading ? "Uploading…" : "Upload"}</button>
          <button onClick={onClose} className="btn outline">Close</button>
        </div>
        {message && <p className="mt-2 text-sm">{message}</p>}
      </div>
    </div>
  );
}