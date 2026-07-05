import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createLocation } from "../api/locations.js";
import LocationForm from "../components/LocationForm.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import { getErrorMessage } from "../utils/errors.js";

export default function AddLocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    setLoading(true);
    setError("");
    try {
      await createLocation(payload);
      navigate("/locations");
    } catch (err) {
      setError(getErrorMessage(err, "Could not create location."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-black text-ink">Add location</h1>
        <p className="mt-2 text-slate-600">Creates a location through `/management/api/locations/create/`.</p>
      </div>
      <StatusMessage type="error">{error}</StatusMessage>
      <LocationForm submitLabel="Create location" submitting={loading} onSubmit={handleSubmit} />
    </div>
  );
}
