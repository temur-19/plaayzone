import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { categoryOptions } from "../api/locations.js";

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

export default function LocationForm({ initialValues, submitLabel = "Save location", onSubmit, submitting }) {
  const [form, setForm] = useState(emptyForm);

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
    onSubmit(form);
  };

  return (
    <form className="panel space-y-5 p-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className="label">Name</span>
          <input className="input" name="name" required value={form.name} onChange={updateField} />
        </label>
        <label className="space-y-2">
          <span className="label">Category</span>
          <select className="input" name="category" value={form.category} onChange={updateField}>
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="label">Phone</span>
          <input className="input" name="phone_number" required maxLength={9} minLength={9} pattern="[0-9]{9}" placeholder="901234567" value={form.phone_number} onChange={updateField} />
        </label>
        <label className="space-y-2">
          <span className="label">Price</span>
          <input className="input" name="price" required type="number" min="0" step="0.01" value={form.price} onChange={updateField} />
        </label>
        <label className="space-y-2">
          <span className="label">Latitude</span>
          <input className="input" name="lat" required type="number" step="any" value={form.lat} onChange={updateField} />
        </label>
        <label className="space-y-2">
          <span className="label">Longitude</span>
          <input className="input" name="lon" required type="number" step="any" value={form.lon} onChange={updateField} />
        </label>
      </div>
      <label className="block space-y-2">
        <span className="label">Description</span>
        <textarea className="input min-h-28" name="description" value={form.description} onChange={updateField} />
      </label>
      <label className="block space-y-2">
        <span className="label">Image</span>
        <input className="input" name="image" type="file" accept="image/*" onChange={updateField} />
      </label>
      <button className="btn btn-primary w-full sm:w-auto" disabled={submitting}>
        <Save size={16} />
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
