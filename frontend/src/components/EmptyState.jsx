import { SearchX } from "lucide-react";

export default function EmptyState({ title = "Lokatsiyalar topilmadi", text = "Qidiruv yoki kategoriyani o‘zgartirib ko‘ring." }) {
  return (
    <div className="grid min-h-44 place-items-center rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-6 text-center">
      <div>
        <SearchX className="mx-auto text-yellow-300" size={34} />
        <h3 className="mt-3 text-lg font-black text-white">{title}</h3>
        <p className="mt-2 text-sm text-slate-400">{text}</p>
      </div>
    </div>
  );
}
