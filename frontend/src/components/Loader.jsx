export default function Loader({ label = "Yuklanmoqda..." }) {
  return (
    <div className="grid min-h-64 place-items-center rounded-3xl border border-white/10 bg-[#111827]/70 p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl">
      <div>
        <span className="mx-auto block h-11 w-11 animate-spin rounded-full border-4 border-yellow-300 border-t-transparent shadow-[0_0_30px_rgba(250,204,21,0.35)]" />
        <p className="mt-4 text-sm font-black text-slate-300">{label}</p>
      </div>
    </div>
  );
}
