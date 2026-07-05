import { Save, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../api/client.js";
import { fetchProfile, updateProfile } from "../api/profile.js";
import LoadingBlock from "../components/LoadingBlock.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import { getErrorMessage } from "../utils/errors.js";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ bio: "", phone_number: "", avatar: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfile()
      .then((data) => {
        setProfile(data);
        setForm({ bio: data.bio || "", phone_number: data.phone_number || "", avatar: null });
      })
      .catch((err) => setError(getErrorMessage(err, "Could not load profile.")))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const data = await updateProfile(form);
      setProfile(data);
      setForm((current) => ({ ...current, avatar: null }));
      setSuccess("Profile updated.");
    } catch (err) {
      setError(getErrorMessage(err, "Could not update profile."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingBlock label="Loading profile..." />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-black text-ink">User profile</h1>
        <p className="mt-2 text-slate-600">Reads and updates `/head/api/profile/`.</p>
      </div>
      <form className="panel space-y-5 p-5" onSubmit={handleSubmit}>
        <StatusMessage type="error">{error}</StatusMessage>
        <StatusMessage type="success">{success}</StatusMessage>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-md bg-slate-100">
            {profile?.avatar ? (
              <img className="h-full w-full object-cover" src={absoluteMediaUrl(profile.avatar)} alt="Profile avatar" />
            ) : (
              <UserRound className="text-slate-400" size={34} />
            )}
          </div>
          <label className="block flex-1 space-y-2">
            <span className="label">Avatar</span>
            <input className="input" type="file" accept="image/*" onChange={(e) => setForm({ ...form, avatar: e.target.files?.[0] || null })} />
          </label>
        </div>
        <label className="block space-y-2">
          <span className="label">Bio</span>
          <textarea className="input min-h-32" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        </label>
        <label className="block space-y-2">
          <span className="label">Phone number</span>
          <input className="input" value={form.phone_number} maxLength={11} onChange={(e) => setForm({ ...form, phone_number: e.target.value })} />
        </label>
        <button className="btn btn-primary w-full sm:w-auto" disabled={saving}>
          <Save size={16} />
          {saving ? "Saving..." : "Save profile"}
        </button>
      </form>
    </div>
  );
}

function absoluteMediaUrl(url) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url}`;
}
