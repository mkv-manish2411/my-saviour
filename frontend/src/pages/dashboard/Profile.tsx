import { useEffect, useState } from "react";
import api from "../../services/api";

interface UserProfile {
  full_name: string;
  email: string;
  mobile: string;
  blood_group: string;
  city: string;
  district: string;
  state: string;
  emergency_contact: string;
}

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get<UserProfile>("/auth/me");
        setUser(res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="p-8">Loading profile...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }

  if (!user) {
    return <div className="p-8">No profile data found</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>

      <div className="bg-white rounded-xl shadow p-6 grid grid-cols-2 gap-4">
        <ProfileField label="Full Name" value={user.full_name} />
        <ProfileField label="Blood Group" value={user.blood_group} />
        <ProfileField label="Mobile" value={user.mobile} />
        <ProfileField label="Emergency Contact" value={user.emergency_contact} />
        <ProfileField label="City" value={user.city} />
        <ProfileField label="District" value={user.district} />
        <ProfileField label="State" value={user.state} />
        <ProfileField label="Email" value={user.email} />
      </div>
    </div>
  );
}

function ProfileField({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value || "—"}</p>
    </div>
  );
}
