import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createLocation } from "../api/locations.js";
import { getMapConfig } from "../api/locationApi.js";
import LocationForm from "../components/LocationForm.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import Loader from "../components/Loader.jsx";
import { getErrorMessage } from "../utils/errors.js";

export default function AddLocation() {
  const [apiKey, setApiKey] = useState("");
  const [loadingMapConfig, setLoadingMapConfig] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getMapConfig()
      .then((config) => setApiKey(config.api_key || ""))
      .catch((err) => setError(getErrorMessage(err, "Xarita sozlamalarini yuklab bo‘lmadi.")))
      .finally(() => setLoadingMapConfig(false));
  }, []);

  const handleSubmit = async (payload) => {
    setLoading(true);
    setError("");
    try {
      await createLocation(payload);
      navigate("/map");
    } catch (err) {
      setError(getErrorMessage(err, "Joylashuvni qo‘shib bo‘lmadi."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <span className="yellow-pill">PlayZone hamjamiyati</span>
        <h1 className="mt-4 text-3xl font-black text-white">Yangi joylashuv qo‘shing</h1>
        <p className="mt-2 max-w-2xl leading-7 text-slate-400">O‘yin yoki sport joyingiz haqidagi ma’lumotlarni kiriting va xaritadan aniq joyini belgilang.</p>
      </div>
      <StatusMessage type="error">{error}</StatusMessage>
      {loadingMapConfig ? <Loader label="Xarita sozlamalari yuklanmoqda..." /> : apiKey ? (
        <LocationForm apiKey={apiKey} submitLabel="Joylashuvni yuborish" submitting={loading} onSubmit={handleSubmit} />
      ) : (
        <StatusMessage type="error">Xarita kaliti mavjud emas. Hozircha joylashuv qo‘shib bo‘lmaydi.</StatusMessage>
      )}
    </div>
  );
}
