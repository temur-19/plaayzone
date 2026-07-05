import { AlertTriangle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteLocation, fetchAdminLocations } from "../api/locations.js";
import LoadingBlock from "../components/LoadingBlock.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import { getErrorMessage } from "../utils/errors.js";

export default function DeleteLocation() {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
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

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      await deleteLocation(id);
      navigate("/locations");
    } catch (err) {
      setError(getErrorMessage(err, "Could not delete location."));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingBlock label="Loading location..." />;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="panel p-6">
        <AlertTriangle className="text-coral" size={34} />
        <h1 className="mt-4 text-3xl font-black text-ink">Delete location</h1>
        <p className="mt-2 leading-7 text-slate-600">
          Confirm permanent deletion of <span className="font-bold text-ink">{location?.name || "this location"}</span>.
        </p>
        <div className="mt-6">
          <StatusMessage type="error">{error}</StatusMessage>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button className="btn btn-danger flex-1" disabled={deleting || !location} onClick={handleDelete}>
            <Trash2 size={16} />
            {deleting ? "Deleting..." : "Delete"}
          </button>
          <Link className="btn btn-secondary flex-1" to="/locations">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
