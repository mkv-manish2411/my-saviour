import { useEffect, useState } from "react";
import api from "../../services/api";

interface LastDonationData {
  last_donated_at: string | null;
  days_remaining: number;
}

export default function LastDonated() {
  const [data, setData] = useState<LastDonationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [donatedAt, setDonatedAt] = useState("");

  const fetchLastDonation = async () => {
    const res = await api.get("/donors/last-donation");
    setData(res.data);
  };

  useEffect(() => {
    fetchLastDonation()
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const submitDonationDate = async () => {
    if (!donatedAt) return alert("Please select a date");

    await api.post("/donors/donate", {
      donatedAt, // YYYY-MM-DD
    });

    alert("Donation date saved successfully ❤️");
    fetchLastDonation();
  };

  if (loading) return <div className="p-8">Loading...</div>;

  const formattedDate = data?.last_donated_at
    ? new Date(data.last_donated_at).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold">Last Donation</h2>

      <div className="bg-white p-6 rounded-xl shadow space-y-3">
        {data?.last_donated_at ? (
          <>
            <p>
              <strong>Last Donated On:</strong> {formattedDate}
            </p>

            {data.days_remaining > 0 ? (
              <p className="text-orange-600">
                ⏳ Eligible in {data.days_remaining} days
              </p>
            ) : (
              <p className="text-green-600">
                ✅ You are eligible to donate again
              </p>
            )}
          </>
        ) : (
          <p className="text-gray-500">
            You have not donated blood yet.
          </p>
        )}
      </div>

      {/* MANUAL DATE ENTRY */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h3 className="font-semibold text-lg">
          Add / Update Donation Date
        </h3>

        <input
          type="date"
          value={donatedAt}
          max={new Date().toISOString().split("T")[0]}
          onChange={e => setDonatedAt(e.target.value)}
          className="border rounded-lg px-3 py-2 w-60"
        />

        <div>
          <button
            onClick={submitDonationDate}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Save Donation Date
          </button>
        </div>
      </div>
    </div>
  );
}
