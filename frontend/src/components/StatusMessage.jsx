export default function StatusMessage({ type = "info", children }) {
  const classes = {
    info: "border-slate-200 bg-white text-slate-700",
    error: "border-red-200 bg-red-50 text-red-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };

  if (!children) return null;

  return <div className={`rounded-md border px-4 py-3 text-sm font-medium ${classes[type]}`}>{children}</div>;
}
