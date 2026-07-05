import { Search } from "lucide-react";

export default function SearchBar({ value, onChange }) {
  return (
    <label className="relative block min-w-0 flex-1">
      <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-yellow-300" size={18} />
      <input className="input h-12 pl-11" placeholder="Manzil yoki joy qidiring..." value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
