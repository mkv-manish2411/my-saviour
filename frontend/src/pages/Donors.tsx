import { useEffect, useState } from "react";
import api from "../services/api";

const bloodGroups = ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function Donors() {
  const [donors, setDonors] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    bloodGroup: "",
    city: "",
    district: "",
    state: "",
  });

  const fetchDonors = async () => {
    const res = await api.get("/donors", { params: filters });
    setDonors(res.data);
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-3xl font-bold text-red-600 mb-6">
        Available Blood Donors
      </h1>

      {/* FILTERS */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <select name="bloodGroup" className="input" onChange={handleChange}>
          {bloodGroups.map(bg => (
            <option key={bg} value={bg}>
              {bg || "Blood Group"}
            </option>
          ))}
        </select>

        <input name="city" placeholder="City" className="input" onChange={handleChange} />
        <input name="district" placeholder="District" className="input" onChange={handleChange} />
        <input name="state" placeholder="State" className="input" onChange={handleChange} />
      </div>

      <button
        onClick={fetchDonors}
        className="mb-8 bg-red-600 hover:bg-red-700 px-6 py-2 rounded font-semibold"
      >
        Apply Filters
      </button>

      {/* DONOR LIST */}
      {donors.length === 0 ? (
        <p className="text-zinc-400">No donors found.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {donors.map((donor) => (
            <div
              key={donor.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
            >
              <h2 className="text-xl font-semibold text-red-500">
                {donor.full_name}
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                Blood Group: <span className="text-white">{donor.blood_group}</span>
              </p>
              <p className="text-sm text-zinc-400">
                Location: {donor.city}, {donor.district}, {donor.state}
              </p>

              <div className="mt-4 text-sm">
                📞 <span className="text-white">{donor.mobile}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
