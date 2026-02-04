import { useEffect, useState } from "react";
import api from "../../services/api";

type Organization = {
  id: string;
  name: string;
  email: string;
  org_type: string;
  ngo_category?: string;
  city: string;
  state: string;
  status: string;
};

export default function AdminDashboard() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchPendingOrgs = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("❌ No admin token found");
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/admin/pending", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("✅ Pending orgs response:", res.data);
        setOrgs(res.data);
      } catch (err: any) {
        console.error(
          "❌ Fetch pending orgs failed:",
          err.response?.status,
          err.response?.data
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPendingOrgs();
  }, []);

  const approveOrg = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setActionLoading(id);

      await api.put(
        `/admin/approve/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrgs(prev => prev.filter(org => org.id !== id));
    } catch (err: any) {
      console.error(
        "❌ Approve failed:",
        err.response?.status,
        err.response?.data
      );
      alert("Failed to approve organization");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-black px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Admin Dashboard
          </h1>
          <p className="text-zinc-400 mt-1">
            Review and approve organization registrations
          </p>
        </div>

        {loading ? (
          <div className="text-red-500">Loading organizations...</div>
        ) : orgs.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-zinc-400">
            🎉 No pending organizations
          </div>
        ) : (
          <div className="overflow-x-auto bg-zinc-900 border border-zinc-800 rounded-xl">
            <table className="min-w-full text-sm text-zinc-300">
              <thead className="bg-zinc-800 text-zinc-400">
                <tr>
                  <th className="px-4 py-3 text-left">Organization</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>


              <tbody>
                {orgs.map(org => (
                  <tr
                    key={org.id}
                    className="border-t border-zinc-800 hover:bg-zinc-800/60"
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">
                        {org.name}
                      </div>
                      <div className="text-xs text-zinc-400">
                        {org.email}
                      </div>
                    </td>

                    <td className="px-4 py-3 capitalize">
                      {org.org_type}
                    </td>

                    <td className="px-4 py-3">
                      {org.ngo_category || "—"}
                    </td>

                    <td className="px-4 py-3">
                      {org.city}, {org.state}
                    </td>

                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-yellow-900/40 text-yellow-400">
                        Pending
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => approveOrg(org.id)}
                        disabled={actionLoading === org.id}
                        className="bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded-md text-white text-xs font-semibold disabled:opacity-50"
                      >
                        {actionLoading === org.id
                          ? "Approving..."
                          : "Approve"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
