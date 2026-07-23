import React, { useState, useRef } from "react";
import {
  UploadCloud,
  MapPin,
  Sparkles,
  Loader2,
  X,
  CheckCircle,
  AlertCircle,
  Camera,
} from "lucide-react";
import { AIDetectionResult, CivicIssue } from "../../types/civicEye";
import { detectCivicIssue, reportCivicIssue } from "../../api/civicEye";
import { AIDetectionBadge } from "./AIDetectionBadge";

interface ComplaintFormProps {
  onSuccess?: (newIssue: CivicIssue) => void;
}

const CATEGORIES = [
  "Potholes & Road Damage",
  "Waste & Garbage",
  "Water Leakage & Drainage",
  "Streetlight & Electrical",
  "Public Facilities",
  "Other",
];

export const ComplaintForm: React.FC<ComplaintFormProps> = ({ onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [severity, setSeverity] = useState<"low" | "medium" | "high" | "critical">("medium");

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [address, setAddress] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [aiResult, setAiResult] = useState<AIDetectionResult | null>(null);
  const [isScanningAI, setIsScanningAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setImagePreviewUrl(URL.createObjectURL(selectedFile));
      setAiResult(null);
      setAiError(null);
      runAIDetection(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setImagePreviewUrl(URL.createObjectURL(droppedFile));
      setAiResult(null);
      setAiError(null);
      runAIDetection(droppedFile);
    }
  };

  const runAIDetection = async (imageFile: File) => {
    setIsScanningAI(true);
    setAiError(null);
    try {
      const result = await detectCivicIssue(imageFile);
      setAiResult(result);
      if (result.suggested_category && CATEGORIES.includes(result.suggested_category)) {
        setCategory(result.suggested_category);
      }
      if (result.priority) {
        setSeverity(result.priority as "low" | "medium" | "high" | "critical");
      }
      if (!title) {
        setTitle(`Reported ${result.detected_issue}`);
      }
    } catch (err: any) {
      console.warn("AI detection notice:", err);
      setAiError("Could not complete AI detection automatically. You can still submit manually.");
    } finally {
      setIsScanningAI(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    setIsGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);

        // Attempt reverse geocoding via OpenStreetMap API
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await res.json();
          if (data && data.display_name) {
            setAddress(data.display_name);
          } else {
            setAddress(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
          }
        } catch {
          setAddress(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error("Location access error:", error);
        setLocationError("Permission denied or location unavailable. Enter address manually below.");
        setIsGettingLocation(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const removeFile = () => {
    setFile(null);
    setImagePreviewUrl(null);
    setAiResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!title.trim()) {
      setSubmitError("Please enter a title for your complaint.");
      return;
    }
    if (!description.trim()) {
      setSubmitError("Please describe the civic issue.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("category", category);
      formData.append("severity", severity);
      formData.append("community_id", "community_default");
      formData.append("reporter_id", "user_demo");

      if (latitude !== null) formData.append("latitude", latitude.toString());
      if (longitude !== null) formData.append("longitude", longitude.toString());
      if (address) formData.append("address", address);

      if (aiResult) {
        if (aiResult.labels) {
          formData.append("ai_detected_labels", aiResult.labels.join(","));
        }
        if (aiResult.confidence_score) {
          formData.append("ai_confidence", aiResult.confidence_score.toString());
        }
      }

      if (file) {
        formData.append("file", file);
      }

      const createdIssue = await reportCivicIssue(formData);
      setSubmitSuccess(true);

      // Reset Form after brief success flash
      setTimeout(() => {
        setTitle("");
        setDescription("");
        removeFile();
        setSubmitSuccess(false);
        if (onSuccess) {
          onSuccess(createdIssue);
        }
      }, 1500);
    } catch (err: any) {
      console.error("Failed to report civic issue:", err);
      setSubmitError(err?.response?.data?.detail || "Failed to submit complaint. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl max-w-2xl mx-auto transition-all duration-300">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
          <Camera className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Report Civic Issue with AI
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Upload an image to trigger instant YOLO vision analysis & automatic classification
          </p>
        </div>
      </div>

      {submitSuccess ? (
        <div className="p-8 text-center bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3 animate-bounce" />
          <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-200">
            Complaint Submitted Successfully!
          </h3>
          <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
            Your report has been logged and sent to your community administrators.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* File Upload / Scanner Box */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Complaint Photo (Runs AI Scanner)
            </label>
            {!imagePreviewUrl ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-indigo-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-xl p-6 text-center cursor-pointer bg-slate-50/50 dark:bg-slate-800/40 hover:bg-indigo-50/30 transition-all duration-200"
              >
                <UploadCloud className="w-10 h-10 text-indigo-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Click or drag photo here to scan
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Supports JPG, PNG, WebP (YOLO will detect potholes, garbage, leaks)
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group bg-slate-900">
                <img
                  src={imagePreviewUrl}
                  alt="Civic Issue Preview"
                  className="w-full h-56 object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>

                {isScanningAI && (
                  <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                    <Sparkles className="w-8 h-8 text-indigo-400 animate-spin mb-2" />
                    <span className="text-sm font-medium text-indigo-200">
                      Running YOLO AI Detector...
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* AI Detection Result Component */}
          {aiResult && <AIDetectionBadge result={aiResult} />}

          {aiError && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{aiError}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Issue Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Deep pothole near main gate"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Category & Severity Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Priority / Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              >
                <option value="low">Low - Minor issue</option>
                <option value="medium">Medium - Standard repair</option>
                <option value="high">High - Urgent attention</option>
                <option value="critical">Critical - Safety hazard</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Description *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Provide specific details about the issue location, hazard level, or impact..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Location Picker */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-500" />
                Issue Location
              </span>
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={isGettingLocation}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm disabled:opacity-50 transition-colors"
              >
                {isGettingLocation ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <MapPin className="w-3.5 h-3.5" />
                )}
                Fetch Current GPS
              </button>
            </div>

            {locationError && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mb-2">{locationError}</p>
            )}

            <input
              type="text"
              placeholder="Enter building, street name, or landmark..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            {latitude !== null && longitude !== null && (
              <div className="mt-2 text-[11px] font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30 p-1.5 rounded border border-indigo-100 dark:border-indigo-900">
                Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </div>
            )}
          </div>

          {submitError && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isScanningAI}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 disabled:opacity-50 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting Complaint...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Submit Civic Issue Report
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
