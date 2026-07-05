export default function LoadingBlock({ label = "Loading..." }) {
  return (
    <div className="grid min-h-48 place-items-center rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-ocean border-t-transparent" />
        {label}
      </div>
    </div>
  );
}
