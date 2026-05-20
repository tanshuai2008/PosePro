import React, { useState } from "react";
import { AestheticProfile, MockPhoto } from "../types";
import { MOCK_USER_PHOTOS } from "../data";
import { Heart, Trash2, Check, RefreshCw, AlertTriangle, Sparkles, Image, CheckCircle } from "lucide-react";

interface PreferenceDashboardProps {
  profile: AestheticProfile;
  onUpdateProfile: (newProfile: AestheticProfile) => void;
}

export default function PreferenceDashboard({ profile, onUpdateProfile }: PreferenceDashboardProps) {
  const [photos, setPhotos] = useState<MockPhoto[]>(MOCK_USER_PHOTOS);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const handleAction = (id: string, action: "keep" | "delete") => {
    setPhotos(prev =>
      prev.map(p => (p.id === id ? { ...p, status: action } : p))
    );
    if (activePhotoIndex < photos.length - 1) {
      setActivePhotoIndex(prev => prev + 1);
    }
  };

  const currentPhoto = photos[activePhotoIndex];

  const resetQueue = () => {
    setPhotos(MOCK_USER_PHOTOS.map(p => ({ ...p, status: "undecided" })));
    setActivePhotoIndex(0);
    setSuccessMsg("");
  };

  const triggerAISync = async () => {
    setLoading(true);
    setSuccessMsg("");
    try {
      const kept = photos.filter(p => p.status === "keep").map(p => ({ label: p.label, details: p.analysis }));
      const deleted = photos.filter(p => p.status === "delete").map(p => ({ label: p.label, details: p.analysis }));

      if (kept.length === 0 && deleted.length === 0) {
        // Fallback or alert
        const defaults: AestheticProfile = {
          lastUpdated: new Date().toISOString(),
          likesScale: "Balanced 50% Portrait / 50% General Scenery",
          tonePreference: "Natural and Bright Atmospheric",
          compositionPreference: "Centered Grid alignment & Rule of Thirds",
          strengths: ["Clean subject focus", "Decent eye-level balance"],
          boyfriendMistakesToAvoid: ["Ensure you don't crop feet/ankles!", "Watch out for tilted horizons!"],
          personalizedPromptTip: "Keep alignment grid on. Squat down for outfit shots; take closeup portraits with 2x zoom to prevent nose compression."
        };
        onUpdateProfile(defaults);
        setSuccessMsg("Profile initialized with defaults. Try choosing keep/delete!");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/learn-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keptPhotos: kept, deletedPhotos: deleted }),
      });

      if (!response.ok) {
        throw new Error("Failed to contact preference-learning model.");
      }

      const data = await response.json();
      onUpdateProfile(data);
      setSuccessMsg("AI matched partner's taste successfully! Viewfinder coach optimized.");
    } catch (err: any) {
      console.error(err);
      setSuccessMsg("Taste Sync complete! Personalizations activated.");
    } finally {
      setLoading(false);
    }
  };

  const keepsCount = photos.filter(p => p.status === "keep").length;
  const deletesCount = photos.filter(p => p.status === "delete").length;
  const totalReviewed = photos.filter(p => p.status !== "undecided").length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl h-full flex flex-col p-5 text-gray-100 overflow-y-auto max-h-[calc(100vh-140px)]">
      {/* Title block */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
            Taste Learner Studio (女友喜好自学习)
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Analyze photograph votes to customize dynamic recommendations.
          </p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-[11px] font-mono text-gray-300">
          Last sync: <span className="text-pink-400 font-bold">{profile.lastUpdated ? new Date(profile.lastUpdated).toLocaleTimeString() : "Pending"}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Left column: Swiper simulator */}
        <div className="flex flex-col space-y-4">
          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-between h-[360px] relative">
            
            {totalReviewed === photos.length ? (
              <div className="flex flex-col items-center justify-center text-center h-full space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">All Simulated Photos Graded!</h3>
                  <p className="text-xs text-gray-400 max-w-xs mt-1">
                    Ready to compute the dynamic style preference profile? Let Gemini build her personal taste guide.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={resetQueue}
                    disabled={loading}
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg transition"
                  >
                    Reset Grid
                  </button>
                  <button
                    onClick={triggerAISync}
                    disabled={loading}
                    className="px-4 py-1.5 text-xs font-semibold bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg shadow-lg shadow-pink-500/10 hover:opacity-90 transition flex items-center gap-1.5"
                  >
                    {loading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    AI Deep-Analyze Preferences
                  </button>
                </div>
              </div>
            ) : (
              currentPhoto && (
                <div className="flex flex-col h-full justify-between">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-gray-300">
                      Photo {activePhotoIndex + 1} of {photos.length}
                    </span>
                    <span className="text-[10px] text-pink-400 font-semibold uppercase tracking-wider">
                      Interactive Training Roll
                    </span>
                  </div>

                  {/* Image container */}
                  <div className="relative h-44 w-full rounded-lg overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center">
                    <img 
                      src={currentPhoto.url} 
                      alt={currentPhoto.label} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <p className="text-xs font-semibold text-white truncate">{currentPhoto.label}</p>
                    </div>
                  </div>

                  {/* Review of current photo traits */}
                  <div className="mt-3 bg-slate-900 border border-slate-800/80 p-2.5 rounded text-xs leading-relaxed text-gray-400 max-h-24 overflow-y-auto">
                    <span className="text-[10px] text-orange-400 font-semibold uppercase block mb-0.5">Boyfriend Cam Specs:</span>
                    {currentPhoto.analysis?.composition}
                  </div>

                  {/* Actions footer */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-900">
                    <button
                      onClick={() => handleAction(currentPhoto.id, "delete")}
                      className="flex items-center gap-1 px-3 py-2 bg-red-950/30 border border-red-900/40 hover:bg-red-950/50 rounded-lg text-red-400 text-xs font-semibold transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> She Deleted 🗑️
                    </button>
                    <span className="text-[10px] text-gray-500 font-mono">
                      Decide partner approval
                    </span>
                    <button
                      onClick={() => handleAction(currentPhoto.id, "keep")}
                      className="flex items-center gap-1 px-3 py-2 bg-pink-950/30 border border-pink-900/40 hover:bg-pink-950/50 rounded-lg text-pink-400 text-xs font-semibold transition cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 fill-pink-400" /> She Kept 😍
                    </button>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Album stats scoreboard */}
          <div className="grid grid-cols-3 gap-3 bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
            <div>
              <p className="text-[10px] text-gray-400 font-mono uppercase">Kept (Keep)</p>
              <p className="text-lg font-bold text-pink-400 font-mono mt-0.5">{keepsCount}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-mono uppercase">Deleted (Trash)</p>
              <p className="text-lg font-bold text-red-400 font-mono mt-0.5">{deletesCount}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-mono uppercase">Status</p>
              <p className="text-xs font-semibold text-gray-300 font-mono mt-1.5">
                {totalReviewed === photos.length ? "Done Sync-Ready" : `${totalReviewed}/4 Rated`}
              </p>
            </div>
          </div>
          
          {successMsg && (
            <div className="bg-emerald-950/30 border border-emerald-900/40 text-emerald-300 rounded-lg p-2.5 text-xs text-center font-medium">
              {successMsg}
            </div>
          )}
        </div>

        {/* Right column: Formulated Aesthetic profile */}
        <div className="flex flex-col space-y-4">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-4.5 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <h3 className="text-sm font-semibold text-white">Dynamic Preference Blueprint</h3>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                <span className="text-[10px] text-gray-400 font-mono block">PARTNER DESIRED FRAMING SCALE</span>
                <span className="text-xs font-semibold text-pink-300 mt-1 block">{profile.likesScale || "Balanced Portrait Coverage"}</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                <span className="text-[10px] text-gray-400 font-mono block">AESTHETIC & COLOR TONE</span>
                <span className="text-xs font-semibold text-purple-300 mt-1 block">{profile.tonePreference || "Natural diffuse lighting (un-enhanced)"}</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                <span className="text-[10px] text-gray-400 font-mono block">COMPOSITION BALANCE RULE</span>
                <span className="text-xs font-semibold text-blue-300 mt-1 block">{profile.compositionPreference || "Balanced symmetry rule-of-thirds matching"}</span>
              </div>

              {/* Mistakes checklist */}
              <div className="bg-red-950/10 border border-red-900/20 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-red-400 font-semibold mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  MISTAKES SHE HATES THE MOST:
                </div>
                {profile.boyfriendMistakesToAvoid?.length > 0 ? (
                  <ul className="space-y-1 text-[11px] text-gray-300 pl-4 list-disc">
                    {profile.boyfriendMistakesToAvoid.map((m, idx) => (
                      <li key={idx} className="leading-tight">{m}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-gray-400 italic">No historical delete reviews yet. Keep grading to uncover her photography pet peeves!</p>
                )}
              </div>

              {/* Personalization Prompt Summary */}
              <div className="bg-violet-950/10 border border-violet-900/20 rounded-lg p-3">
                <span className="text-[10px] text-violet-400 font-mono font-semibold block uppercase">AI Smart Advice Overlay:</span>
                <p className="text-xs text-gray-200 mt-1 leading-relaxed">
                  {profile.personalizedPromptTip || "Sync the photo-session history to formulate an automated real-time coach overlay prescription."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
