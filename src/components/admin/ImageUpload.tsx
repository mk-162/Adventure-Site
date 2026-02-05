"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Loader2 } from "lucide-react";

interface ImageUploadProps {
  name: string;
  label: string;
  currentUrl?: string | null;
  accept?: string;
  aspectHint?: "square" | "landscape" | "portrait";
}

export default function ImageUpload({
  name,
  label,
  currentUrl,
  accept = "image/*",
  aspectHint,
}: ImageUploadProps) {
  const [url, setUrl] = useState(currentUrl || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectLabel =
    aspectHint === "square"
      ? "Recommended: square (1:1)"
      : aspectHint === "landscape"
        ? "Recommended: landscape (16:9)"
        : aspectHint === "portrait"
          ? "Recommended: portrait (3:4)"
          : "";

  const uploadFile = useCallback(async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("contentType", "operators");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Upload failed");
      }

      const data = await res.json();
      setUrl(data.url);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(`${message} — you can paste a URL instead`);
      setShowUrlInput(true);
    } finally {
      setUploading(false);
    }
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleRemove = useCallback(() => {
    setUrl("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {aspectLabel && (
        <p className="text-xs text-gray-400 mb-2">{aspectLabel}</p>
      )}

      {/* Hidden input to carry the URL value in the form */}
      <input type="hidden" name={name} value={url} />

      {url ? (
        /* Preview */
        <div className="relative group rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
          <div
            className={`relative ${
              aspectHint === "square"
                ? "aspect-square max-w-[200px]"
                : aspectHint === "landscape"
                  ? "aspect-video max-w-[400px]"
                  : "max-w-[300px]"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={label}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center justify-between px-3 py-2 bg-white border-t border-gray-100">
            <span className="text-xs text-gray-500 truncate max-w-[250px]">
              {url}
            </span>
            <button
              type="button"
              onClick={handleRemove}
              className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              title="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Upload zone */
        <div>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 cursor-pointer transition-colors ${
              dragOver
                ? "border-[#ea580c] bg-orange-50"
                : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
            } ${uploading ? "pointer-events-none opacity-60" : ""}`}
          >
            {uploading ? (
              <>
                <Loader2 className="h-8 w-8 text-[#ea580c] animate-spin mb-2" />
                <p className="text-sm text-gray-600">Uploading…</p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-[#ea580c]">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, WebP up to 5MB
                </p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* URL fallback input */}
          <div className="mt-2">
            {showUrlInput ? (
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <input
                  type="url"
                  placeholder="Or paste image URL…"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setError("");
                  }}
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowUrlInput(true)}
                className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
              >
                <LinkIcon className="h-3 w-3" />
                Or paste a URL
              </button>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
