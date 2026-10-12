import { Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getServiceRating, submitServiceRating } from "../api/serviceRating.js";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../utils/errors.js";

const PROMPTED_KEY = "playzone:service-rating-prompted";

export default function ServiceRatingPrompt() {
  const { isAuthenticated, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      setIsOpen(false);
      return;
    }
    if (sessionStorage.getItem(PROMPTED_KEY)) return;

    sessionStorage.setItem(PROMPTED_KEY, "true");
    setIsOpen(true);
    setLoading(true);
    getServiceRating()
      .then((rating) => setScore(rating.my_rating || 0))
      .catch((requestError) => setError(getErrorMessage(requestError, "Bahoni yuklab bo‘lmadi.")))
      .finally(() => setLoading(false));
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  const saveRating = async (event) => {
    event.preventDefault();
    if (score < 1 || score > 5) return;

    setSubmitting(true);
    setError("");
    try {
      const rating = await submitServiceRating(score);
      setSaved(true);
      window.dispatchEvent(new CustomEvent("playzone:service-rating-updated", { detail: rating }));
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Bahoni saqlab bo‘lmadi. Qayta urinib ko‘ring."));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <section
        aria-labelledby="service-rating-title"
        aria-modal="true"
        className="glass relative w-full max-w-md rounded-3xl p-6 sm:p-8"
        role="dialog"
      >
        <button
          aria-label="Yopish"
          className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
          onClick={() => setIsOpen(false)}
          type="button"
        >
          <X size={20} />
        </button>
        {saved ? (
          <div className="py-4 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-yellow-300/15 text-yellow-300">
              <Star fill="currentColor" size={28} />
            </div>
            <h2 className="mt-5 text-2xl font-black text-white">Rahmat!</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">Bahoyingiz saqlandi. Fikringiz PlayZone xizmatini yaxshilashga yordam beradi.</p>
            <button className="btn btn-primary mt-6 w-full" onClick={() => setIsOpen(false)} type="button">Yopish</button>
          </div>
        ) : (
          <form onSubmit={saveRating}>
            <span className="yellow-pill">Xizmat bahosi</span>
            <h2 className="mt-5 pr-7 text-2xl font-black text-white" id="service-rating-title">PlayZone xizmatini baholang</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Tajribaingizga mos ravishda 1 dan 5 gacha yulduz tanlang.</p>
            {loading ? (
              <p className="mt-6 text-sm text-slate-400" role="status">Baholash ma’lumoti yuklanmoqda...</p>
            ) : (
              <div aria-label="Xizmat bahosi" className="mt-6 flex justify-center gap-2" role="group">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    aria-label={`${value} yulduz`}
                    aria-pressed={score === value}
                    className="rounded-xl p-2 text-yellow-300 transition hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-300 disabled:opacity-50"
                    disabled={submitting}
                    key={value}
                    onClick={() => setScore(value)}
                    type="button"
                  >
                    <Star fill={value <= score ? "currentColor" : "none"} size={32} />
                  </button>
                ))}
              </div>
            )}
            {error && <p className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200" role="alert">{error}</p>}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button className="btn btn-primary flex-1" disabled={loading || submitting || score === 0} type="submit">
                {submitting ? "Saqlanmoqda..." : "Bahoni yuborish"}
              </button>
              <button className="btn btn-secondary" onClick={() => setIsOpen(false)} type="button">Keyinroq</button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
