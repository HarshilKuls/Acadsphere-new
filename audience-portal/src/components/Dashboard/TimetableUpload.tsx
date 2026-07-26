import React, { useState, useRef, useCallback } from "react";
import { Upload, FileText, X, Check, AlertCircle, Loader2, Sparkles, Trash2, Image as ImageIcon } from "lucide-react";

interface ExtractedEntry {
  subject: string;
  faculty: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
}

interface TimetableUploadProps {
  isDarkMode: boolean;
  onImport: (entries: ExtractedEntry[]) => void;
  onClose: () => void;
  triggerToast: (msg: string) => void;
}

const ACCEPTED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
];

const ACCEPTED_EXTENSIONS = ".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.xlsx,.xls,.csv";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const DAY_COLORS: Record<string, string> = {
  Monday: "bg-purple-500/15 text-purple-400 border-purple-500/25",
  Tuesday: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  Wednesday: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  Thursday: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  Friday: "bg-rose-500/15 text-rose-400 border-rose-500/25",
  Saturday: "bg-blue-500/15 text-blue-400 border-blue-500/25",
};

export default function TimetableUpload({ isDarkMode, onImport, onClose, triggerToast }: TimetableUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedEntries, setExtractedEntries] = useState<ExtractedEntry[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<"upload" | "preview">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleFile = useCallback(async (file: File) => {
    if (isExtracting) return;
    setError(null);

    // Validate type
    const ext = "." + (file.name.split(".").pop()?.toLowerCase() || "");
    const isValidType = ACCEPTED_TYPES.includes(file.type) || ACCEPTED_EXTENSIONS.includes(ext);
    if (!isValidType) {
      setError("Unsupported file type. Please upload a PDF, image, DOC, or Excel file.");
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File is too large (${formatFileSize(file.size)}). Maximum size is 10MB.`);
      return;
    }

    setSelectedFile(file);
    setIsExtracting(true);
    setPhase("upload");

    try {
      // Read file as base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove data URL prefix (e.g., "data:application/pdf;base64,")
          const base64Data = result.split(",")[1];
          resolve(base64Data);
        };
        reader.onerror = () => reject(new Error("Failed to read file."));
        reader.readAsDataURL(file);
      });

      // Send to API
      const response = await fetch("/api/extract-timetable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileData: base64,
          fileName: file.name,
          mimeType: file.type,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Extraction failed. Please try again.");
        setIsExtracting(false);
        return;
      }

      if (data.entries && data.entries.length > 0) {
        setExtractedEntries(data.entries);
        setSelectedIndices(new Set(data.entries.map((_: ExtractedEntry, i: number) => i)));
        setPhase("preview");
        triggerToast(`Extracted ${data.entries.length} class entries!`);
      } else {
        setError("No timetable entries could be extracted from this file. Try a clearer image or document.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Network error. Please check your connection.";
      setError(message);
    } finally {
      setIsExtracting(false);
    }
  }, [triggerToast]);

  // Drag handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const toggleEntry = (index: number) => {
    setSelectedIndices(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIndices.size === extractedEntries.length) {
      setSelectedIndices(new Set());
    } else {
      setSelectedIndices(new Set(extractedEntries.map((_, i) => i)));
    }
  };

  const handleImport = () => {
    const selected = extractedEntries.filter((_, i) => selectedIndices.has(i));
    if (selected.length === 0) {
      triggerToast("Please select at least one entry to import.");
      return;
    }
    onImport(selected);
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setExtractedEntries([]);
    setSelectedIndices(new Set());
    setError(null);
    setPhase("upload");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Group entries by day for preview
  const groupedByDay = extractedEntries.reduce<Record<string, { entry: ExtractedEntry; index: number }[]>>(
    (acc, entry, index) => {
      if (!acc[entry.day]) acc[entry.day] = [];
      acc[entry.day].push({ entry, index });
      return acc;
    },
    {}
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl border shadow-2xl flex flex-col ${
          isDarkMode
            ? "bg-[#14121b] border-zinc-800 shadow-purple-500/5"
            : "bg-white border-zinc-200 shadow-purple-500/10"
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b ${isDarkMode ? "border-zinc-800" : "border-zinc-200"}`}>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <h2 className={`text-sm font-bold ${isDarkMode ? "text-zinc-100" : "text-zinc-900"}`}>
                AI Timetable Extractor
              </h2>
              <p className={`text-[10px] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                Upload your timetable file — AI will extract the schedule
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all ${
              isDarkMode ? "hover:bg-zinc-800 text-zinc-400" : "hover:bg-zinc-100 text-zinc-500"
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">

          {/* PHASE 1: Upload */}
          {phase === "upload" && (
            <div className="space-y-4">
              {/* Drop zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isExtracting && fileInputRef.current?.click()}
                className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
                  isExtracting ? "pointer-events-none opacity-60" : ""
                } ${
                  isDragging
                    ? isDarkMode
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-purple-500 bg-purple-50"
                    : isDarkMode
                    ? "border-zinc-700 hover:border-purple-500/50 hover:bg-zinc-800/30"
                    : "border-zinc-300 hover:border-purple-400 hover:bg-purple-50/50"
                }`}
              >
                {isExtracting ? (
                  <div className="flex flex-col items-center gap-3 py-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center animate-pulse">
                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${isDarkMode ? "text-zinc-200" : "text-zinc-800"}`}>
                        Extracting with Groq AI...
                      </p>
                      <p className={`text-[11px] mt-1 ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                        Analyzing {selectedFile?.name} — this may take a few seconds
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 py-4">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                      isDarkMode ? "bg-zinc-800" : "bg-zinc-100"
                    }`}>
                      <Upload className={`h-5 w-5 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${isDarkMode ? "text-zinc-200" : "text-zinc-800"}`}>
                        Drop your timetable here
                      </p>
                      <p className={`text-[11px] mt-1 ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                        or click to browse • PDF, Image, DOC, Excel • Max 10MB
                      </p>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_EXTENSIONS}
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>

              {/* Selected file display */}
              {selectedFile && !isExtracting && (
                <div className={`flex items-center gap-3 rounded-lg border p-3 ${
                  isDarkMode ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-200 bg-zinc-50"
                }`}>
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                    isDarkMode ? "bg-purple-500/15 text-purple-400" : "bg-purple-100 text-purple-600"
                  }`}>
                    {getFileIcon(selectedFile)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold truncate ${isDarkMode ? "text-zinc-200" : "text-zinc-800"}`}>
                      {selectedFile.name}
                    </p>
                    <p className={`text-[10px] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  <button
                    onClick={resetUpload}
                    className={`p-1.5 rounded-md transition-all ${
                      isDarkMode ? "hover:bg-zinc-800 text-zinc-500" : "hover:bg-zinc-200 text-zinc-400"
                    }`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className={`flex items-start gap-3 rounded-lg border p-3 ${
                  isDarkMode ? "border-red-500/20 bg-red-500/5" : "border-red-200 bg-red-50"
                }`}>
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-red-500">{error}</p>
                    <button
                      onClick={resetUpload}
                      className="text-[10px] text-red-400 hover:text-red-300 underline mt-1"
                    >
                      Try another file
                    </button>
                  </div>
                </div>
              )}

              {/* Supported formats hint */}
              <div className={`grid grid-cols-4 gap-2 ${isDarkMode ? "text-zinc-600" : "text-zinc-400"}`}>
                {[
                  { label: "PDF", icon: "📄" },
                  { label: "Image", icon: "🖼️" },
                  { label: "Word", icon: "📝" },
                  { label: "Excel", icon: "📊" },
                ].map(f => (
                  <div
                    key={f.label}
                    className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-[10px] font-semibold ${
                      isDarkMode ? "border-zinc-800/60" : "border-zinc-200"
                    }`}
                  >
                    <span>{f.icon}</span> {f.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PHASE 2: Preview extracted entries */}
          {phase === "preview" && (
            <div className="space-y-4">
              {/* Summary bar */}
              <div className={`flex items-center justify-between rounded-lg border p-3 ${
                isDarkMode ? "border-emerald-500/20 bg-emerald-500/5" : "border-emerald-200 bg-emerald-50"
              }`}>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span className={`text-xs font-bold ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
                    {extractedEntries.length} entries extracted
                  </span>
                  <span className={`text-[10px] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                    from {selectedFile?.name}
                  </span>
                </div>
                <button
                  onClick={toggleAll}
                  className={`text-[10px] font-bold px-2 py-1 rounded transition-all ${
                    isDarkMode ? "text-purple-400 hover:bg-purple-500/10" : "text-purple-600 hover:bg-purple-50"
                  }`}
                >
                  {selectedIndices.size === extractedEntries.length ? "Deselect All" : "Select All"}
                </button>
              </div>

              {/* Entries grouped by day */}
              <div className="space-y-3">
                {Object.entries(groupedByDay)
                  .sort((a, b) => {
                    const order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    return order.indexOf(a[0]) - order.indexOf(b[0]);
                  })
                  .map(([day, items]) => (
                    <div key={day}>
                      <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${
                        isDarkMode ? "text-zinc-500" : "text-zinc-400"
                      }`}>
                        {day} ({items.length})
                      </p>
                      <div className="space-y-1.5">
                        {items.map(({ entry, index }) => {
                          const isSelected = selectedIndices.has(index);
                          return (
                            <button
                              key={index}
                              onClick={() => toggleEntry(index)}
                              className={`w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                                isSelected
                                  ? `${DAY_COLORS[day] || "bg-purple-500/15 text-purple-400 border-purple-500/25"}`
                                  : isDarkMode
                                  ? "border-zinc-800 bg-zinc-900/30 opacity-50"
                                  : "border-zinc-200 bg-zinc-50 opacity-50"
                              }`}
                            >
                              {/* Checkbox */}
                              <div className={`h-4 w-4 rounded border flex-shrink-0 flex items-center justify-center transition-all ${
                                isSelected
                                  ? "bg-purple-600 border-purple-600"
                                  : isDarkMode
                                  ? "border-zinc-600"
                                  : "border-zinc-300"
                              }`}>
                                {isSelected && <Check className="h-2.5 w-2.5 text-white" />}
                              </div>

                              {/* Entry details */}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold truncate">{entry.subject}</p>
                                <p className={`text-[10px] truncate ${isDarkMode ? "opacity-70" : "opacity-60"}`}>
                                  {entry.faculty} • {entry.room}
                                </p>
                              </div>

                              {/* Time */}
                              <span className="text-[10px] font-bold flex-shrink-0">
                                {entry.startTime} – {entry.endTime}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Try another file */}
              <button
                onClick={resetUpload}
                className={`text-[10px] font-semibold underline ${isDarkMode ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-400 hover:text-zinc-600"}`}
              >
                ← Upload a different file
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {phase === "preview" && (
          <div className={`flex items-center justify-between p-4 border-t ${isDarkMode ? "border-zinc-800" : "border-zinc-200"}`}>
            <p className={`text-[10px] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
              {selectedIndices.size} of {extractedEntries.length} selected
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className={`rounded-lg border px-4 py-2 text-xs font-bold transition-all ${
                  isDarkMode
                    ? "border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                    : "border-zinc-300 text-zinc-500 hover:bg-zinc-100"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={selectedIndices.size === 0}
                className="rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-2 text-xs font-bold text-white shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Import {selectedIndices.size} {selectedIndices.size === 1 ? "Entry" : "Entries"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
