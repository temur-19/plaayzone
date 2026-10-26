export default function StatusMessage({ type = "info", children }) {
  const classes = {
    info: "border-white/10 bg-white/5 text-slate-200",
    error: "border-red-400/30 bg-red-500/10 text-red-200",
    success: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
  };

  if (!children) return null;

  return <div className={`rounded-2xl border px-4 py-3 text-sm font-bold ${classes[type]}`} role={type === "error" ? "alert" : "status"}>{children}</div>;
}
