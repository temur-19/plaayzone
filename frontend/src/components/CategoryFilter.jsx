import { categories } from "../api/locationApi.js";

export default function CategoryFilter({ value, onChange, compact = false }) {
  return (
    <div className={`flex gap-1.5 overflow-x-auto ${compact ? "p-1.5" : "pb-1"}`}>
      {categories.map((category) => (
        <button
          className={`shrink-0 rounded-xl border px-3.5 py-2 text-xs font-black transition sm:text-sm ${
            value === category.value ? "border-slate-950 bg-slate-950 text-white shadow-sm" : "border-transparent bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-950"
          }`}
          key={category.value}
          aria-pressed={value === category.value}
          onClick={() => onChange(value === category.value ? null : category.value)}
          type="button"
        >
          {category.label === "All" ? "Hammasi" : category.label === "Mini Stadium" ? "Stadion" : category.label}
        </button>
      ))}
    </div>
  );
}
