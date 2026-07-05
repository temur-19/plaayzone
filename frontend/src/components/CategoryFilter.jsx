import { categories } from "../api/locationApi.js";

export default function CategoryFilter({ value, onChange, compact = false }) {
  return (
    <div className={`flex gap-2 overflow-x-auto ${compact ? "p-2" : "pb-1"}`}>
      {categories.map((category) => (
        <button
          className={`shrink-0 rounded-full border px-4 py-2 text-sm font-black transition ${
            value === category.value ? "border-yellow-300 bg-yellow-300 text-slate-950 shadow-[0_0_28px_rgba(250,204,21,0.30)]" : "border-white/10 bg-[#111827]/85 text-slate-300 hover:border-yellow-300/60 hover:text-yellow-200"
          }`}
          key={category.value}
          onClick={() => onChange(category.value)}
          type="button"
        >
          {category.label === "All" ? "Hammasi" : category.label === "Mini Stadium" ? "Stadion" : category.label}
        </button>
      ))}
    </div>
  );
}
