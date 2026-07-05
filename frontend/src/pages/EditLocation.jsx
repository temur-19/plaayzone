import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAdminLocations, updateLocation } from "../api/locations.js";
import LoadingBlock from "../components/LoadingBlock.jsx";
import LocationForm from "../components/LocationForm.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import { getErrorMessage } from "../utils/errors.js";

export default function EditLocation() {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminLocations()
      .then((items) => {
        const match = items.find((item) => String(item.id) === String(id));
        if (!match) throw new Error("Location not found.");
        setLocation(match);
      })
      .catch((err) => setError(getErrorMessage(err, err.message || "Could not load location.")))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (payload) => {
    setSaving(true);
    setError("");
    try {
      await updateLocation(id, payload);
      navigate("/locations");
    } catch (err) {
      setError(getErrorMessage(err, "Could not update location."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingBlock label="Loading location..." />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-black text-ink">Edit location</h1>
        <p className="mt-2 text-slate-600">Updates the selected location with a PATCH request.</p>
      </div>
      <StatusMessage type="error">{error}</StatusMessage>
      {location && <LocationForm initialValues={location} submitLabel="Update location" submitting={saving} onSubmit={handleSubmit} />}
    </div>
  );
}
