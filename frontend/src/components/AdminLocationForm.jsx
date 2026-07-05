import { UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import { categories } from "../api/locationApi.js";

const empty = { name: "", category: "playstation", lat: "", lon: "", address: "", phone: "", price: "", description: "", image: null };

export default function AdminLocationForm({ initialValue, loading, onSubmit }) {
  const [form, setForm] = useState(empty);
  useEffect(() => { if (initialValue) setForm({ ...empty, ...initialValue, image: null }); }, [initialValue]);
  const setField = (name, value) => setForm((current) => ({ ...current, [name]: value }));
  const submit = (event) => { event.preventDefault(); onSubmit(form); };

  return (
    <form className="glass rounded-[2rem] p-5 sm:p-6" onSubmit={submit}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nomi"><input className="input" required value={form.name} onChange={(e) => setField("name", e.target.value)} /></Field>
        <Field label="Kategoriya"><select className="input" value={form.category} onChange={(e) => setField("category", e.target.value)}>{categories.filter((item) => item.value !== "all").map((item) => <option className="bg-[#020617]" key={item.value} value={item.value}>{item.label === "Mini Stadium" ? "Stadion" : item.label}</option>)}</select></Field>
        <Field label="Latitude"><input className="input" required step="any" type="number" value={form.lat} onChange={(e) => setField("lat", e.target.value)} /></Field>
        <Field label="Longitude"><input className="input" required step="any" type="number" value={form.lon} onChange={(e) => setField("lon", e.target.value)} /></Field>
        <Field label="Manzil"><input className="input" disabled placeholder="Server modelida manzil maydoni yo‘q" value={form.address || ""} /></Field>
        <Field label="Telefon"><input className="input" disabled placeholder="Server modelida telefon maydoni yo‘q" value={form.phone || ""} /></Field>
        <Field label="Narx"><input className="input" disabled placeholder="Server modelida narx maydoni yo‘q" value={form.price || ""} /></Field>
        <Field label="Rasm"><label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-yellow-300/35 bg-yellow-300/5 px-4 py-3 text-sm font-black text-yellow-200"><UploadCloud size={18} />{form.image?.name || "Rasm yuklash"}<input className="hidden" accept="image/*" type="file" onChange={(e) => setField("image", e.target.files?.[0] || null)} /></label></Field>
      </div>
      <Field label="Tavsif"><textarea className="input mt-2 min-h-32" value={form.description || ""} onChange={(e) => setField("description", e.target.value)} /></Field>
      <button className="btn btn-primary mt-5 w-full sm:w-auto" disabled={loading}>{loading ? "Saqlanmoqda..." : "Saqlash"}</button>
    </form>
  );
}
function Field({ label, children }) { return <label className="block space-y-2"><span className="label">{label}</span>{children}</label>; }
