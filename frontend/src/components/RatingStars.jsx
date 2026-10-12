import { Star } from "lucide-react";

export default function RatingStars({ average, size = 18 }) {
  const value = Math.max(0, Math.min(5, Number(average) || 0));

  return (
    <span
      aria-label={`${value.toFixed(1)} / 5 yulduz`}
      className="inline-flex items-center gap-0.5"
      role="img"
    >
      {Array.from({ length: 5 }, (_, index) => {
        const fill = Math.max(0, Math.min(1, value - index)) * 100;
        return (
          <span className="relative inline-flex" key={index}>
            <Star aria-hidden="true" className="text-slate-600" size={size} />
            <Star
              aria-hidden="true"
              className="absolute left-0 top-0 fill-yellow-300 text-yellow-300"
              size={size}
              style={{ clipPath: `inset(0 ${100 - fill}% 0 0)` }}
            />
          </span>
        );
      })}
    </span>
  );
}
