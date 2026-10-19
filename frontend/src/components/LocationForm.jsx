import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { categoryOptions } from "../api/locations.js";
import LocationPicker from "./LocationPicker.jsx";

const emptyForm = {
  category: "stadium",
  name: "",
  phone_number: "",
  price: "",
  lat: "",
  lon: "",
  description: "",
  image: null,
};

export default function LocationForm({ apiKey, initialValues, submitLabel = "Joylashuv qo‘shish", onSubmit, submitting }) {
  const [form, setForm] = useState(emptyForm);
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    if (initialValues) {
      setForm({
        category: initialValues.category || "stadium",
        name: initialValues.name || "",
        phone_number: initialValues.phone_number || "",
        price: initialValues.price ?? "",
        lat: initialValues.lat ?? "",
        lon: initialValues.lon ?? "",
        description: initialValues.description || "",
        image: null,
      });
    }
  }, [initialValues]);

  const updateField = (event) => {
    const { name, value, files } = event.target;
    setForm((current) => ({
      ...current,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.lat || !form.lon) {
      setLocationError("Davom etish uchun xaritadan joy tanlang.");
      return;
    }
    setLocationError("");
    onSubmit(form);
  };

  return (
    <form className="panel space-y-5 p-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className="label">Joy nomi</span>
          <input className="input" name="name" required value={form.name} onChange={updateField} />
        </label>
        <label className="space-y-2">
          <span className="label">Kategoriya</span>
          <select className="input" name="category" value={form.category} onChange={updateField}>
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="label">Telefon raqami</span>
          <div className="flex overflow-hidden rounded-2xl border border-white/10 bg-[#020617]/70 focus-within:border-yellow-300 focus-within:ring-4 focus-within:ring-yellow-300/10">
            <span className="grid place-items-center border-r border-white/10 px-4 text-sm font-bold text-slate-400">+998</span>
            <input className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm font-semibold text-white outline-none placeholder:text-slate-500" name="phone_number" required maxLength={9} minLength={9} pattern="[0-9]{9}" placeholder="901234567" value={form.phone_number} onChange={updateField} />
          </div>
        </label>
        <label className="space-y-2">
          <span className="label">Narxi (so‘m)</span>
          <input className="input" name="price" required type="number" min="0" step="0.01" value={form.price} onChange={updateField} />
        </label>
      </div>
      {apiKey ? (
        <>
          <LocationPicker
            apiKey={apiKey}
            value={{ lat: form.lat, lon: form.lon }}
            onChange={({ lat, lon }) => {
              setLocationError("");
              setForm((current) => ({ ...current, lat, lon }));
            }}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="label">Kenglik</span>
              <input className="input" readOnly value={form.lat} />
            </label>
            <label className="space-y-2">
              <span className="label">Uzunlik</span>
              <input className="input" readOnly value={form.lon} />
            </label>
          </div>
          {locationError && <p className="text-sm font-bold text-red-200" role="alert">{locationError}</p>}
        </>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="label">Kenglik</span>
            <input className="input" name="lat" required type="number" step="any" value={form.lat} onChange={updateField} />
          </label>
          <label className="space-y-2">
            <span className="label">Uzunlik</span>
            <input className="input" name="lon" required type="number" step="any" value={form.lon} onChange={updateField} />
          </label>
        </div>
      )}
      <label className="block space-y-2">
        <span className="label">Tavsif</span>
        <textarea className="input min-h-28" name="description" value={form.description} onChange={updateField} />
      </label>
      <label className="block space-y-2">
        <span className="label">Rasm (ixtiyoriy)</span>
        <input className="input" name="image" type="file" accept="image/*" onChange={updateField} />
      </label>
      <button className="btn btn-primary w-full sm:w-auto" disabled={submitting}>
        <Save size={16} />
        {submitting ? "Saqlanmoqda..." : submitLabel}
      </button>
    </form>
  );
}
