// components/KYCModal.js
// components/KYCModal.js
import { useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";

export default function KYCModal({ userId, onUploaded, onClose }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progresses, setProgresses] = useState({});
  const [message, setMessage] = useState("");
  const fileInputRef = useRef();

  // Handle file selection
  function handleFilesSelected(selectedFiles) {
    setFiles(Array.from(selectedFiles));
  }

  function handleDrop(e) {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  async function uploadAll() {
    if (files.length === 0) return setMessage("Choose files first");
    setLoading(true);
    setProgresses({});
    setMessage("");

    try {
      const uploadedUrls = [];

      for (const file of files) {
        const filename = `${userId}_${Date.now()}_${file.name}`;

        const { data, error: upErr } = await supabase.storage
          .from("kyc")
          .upload(filename, file, {
            cacheControl: "3600",
            upsert: false,
            onUploadProgress: (event) => {
              const percent = Math.round((event.loaded * 100) / event.total);
              setProgresses((prev) => ({ ...prev, [file.name]: percent }));
            },
          });

        if (upErr) throw upErr;

        const { data: urlData } = supabase.storage
          .from("kyc")
          .getPublicUrl(data.path);

        uploadedUrls.push({ name: file.name, url: urlData.publicUrl });
      }

      // Register files in DB
      const res = await fetch("/api/wishes/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, files: uploadedUrls }),
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "KYC registration failed");

      setMessage("✅ Uploaded and submitted for review");
      onUploaded && onUploaded(body);
      setFiles([]);
      setProgresses({});
    } catch (err) {
      setMessage(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 w-full max-w-md flex flex-col gap-4 animate-fade-up">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Upload KYC Documents
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Upload government-issued IDs or official documents. Moderators will
          verify before large payouts.
        </p>

        {/* Drag & Drop Area */}
        <div
          className="border-2 border-dashed border-primary rounded-lg p-4 text-center cursor-pointer hover:bg-primary/10 transition"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current.click()}
        >
          {files.length > 0 ? (
            files.map((file) => (
              <p key={file.name} className="text-primary font-semibold">
                {file.name}
              </p>
            ))
          ) : (
            <p className="text-slate-500 dark:text-slate-400">
              Drag & drop files here or click to select
            </p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => handleFilesSelected(e.target.files)}
          />
        </div>

        {/* Progress Bars */}
        {files.map((file) => (
          <div key={file.name} className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden mt-1">
            <div
              className="bg-primary h-3 rounded-full transition-all"
              style={{ width: `${progresses[file.name] || 0}%` }}
            ></div>
          </div>
        ))}

        {/* Buttons */}
        <div className="flex justify-between gap-3 mt-2">
          <button
            onClick={uploadAll}
            disabled={loading || files.length === 0}
            className="flex-1 bg-primary text-white font-semibold py-2 rounded-lg hover:bg-primary/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Uploading…" : "Upload All"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-primary text-primary font-semibold py-2 rounded-lg hover:bg-primary/10 transition"
          >
            Close
          </button>
        </div>

        {/* Message */}
        {message && (
          <p className="text-sm text-center text-slate-700 dark:text-slate-200 mt-2">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
