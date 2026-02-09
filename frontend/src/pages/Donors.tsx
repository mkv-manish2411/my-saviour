import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import DonorCard from "../components/DonorCard";
import { indiaStatesWithDistricts } from "../locations/indiaLocations";
import { Helmet } from "react-helmet-async";

const bloodGroups = ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const PAGE_SIZE = 6;

export default function Donors() {
  const [donors, setDonors] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    bloodGroup: "",
    state: "",
    district: "",
  });

  /* ================= FETCH DONORS ================= */
  const fetchDonors = async () => {
    setLoading(true);
    const res = await api.get("/donors", { params: filters });
    setDonors(res.data);
    setPage(1);
    setLoading(false);
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  /* ================= SEARCH ================= */
  const filteredDonors = useMemo(() => {
    return donors.filter((d) =>
      `${d.full_name} ${d.city} ${d.district} ${d.state}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [donors, search]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredDonors.length / PAGE_SIZE);

  const paginatedDonors = filteredDonors.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* ================= CTA ================= */
  const handleCta = async (donorId: string) => {
    await api.post(`/donors/${donorId}/cta`);
    fetchDonors();
  };

  return (
    <>
      {/* ================= SEO ================= */}
      <Helmet>
        <title>Blood Donors Near You | My Savior</title>
        <meta
          name="description"
          content="Find eligible blood donors by blood group and location. Updated automatically after each donation."
        />
      </Helmet>

      <section className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
        <div className="max-w-7xl mx-auto">
          {/* ================= HEADER ================= */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-100">
              Blood Donors Directory
            </h1>
            <p className="text-zinc-400 mt-2">
              Showing currently eligible blood donors
            </p>
          </header>

          {/* ================= FILTERS ================= */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-10">
            <div className="grid md:grid-cols-5 gap-4">
              <input
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500"
                placeholder="Search name or location"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2"
                value={filters.bloodGroup}
                onChange={(e) =>
                  setFilters({ ...filters, bloodGroup: e.target.value })
                }
              >
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg || "Blood Group"}
                  </option>
                ))}
              </select>

              <select
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2"
                value={filters.state}
                onChange={(e) =>
                  setFilters({ ...filters, state: e.target.value, district: "" })
                }
              >
                <option value="">State</option>
                {Object.keys(indiaStatesWithDistricts).map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>

              <select
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2"
                value={filters.district}
                disabled={!filters.state}
                onChange={(e) =>
                  setFilters({ ...filters, district: e.target.value })
                }
              >
                <option value="">
                  {filters.state ? "District" : "Select State"}
                </option>
                {filters.state &&
                  indiaStatesWithDistricts[filters.state]?.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
              </select>

              <button
                onClick={fetchDonors}
                className="bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
              >
                Apply
              </button>
            </div>
          </div>

          {/* ================= DONOR GRID ================= */}
          {loading && <p className="text-zinc-400">Loading donors…</p>}

          {!loading && paginatedDonors.length === 0 && (
            <p className="text-zinc-400">No donors found.</p>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedDonors.map((donor) => (
              <DonorCard
                key={donor.id}
                donor={donor}
                onCta={handleCta}
              />
            ))}
          </div>

          {/* ================= PAGINATION ================= */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-4 mt-12">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 border border-zinc-800 rounded-lg disabled:opacity-40 hover:bg-zinc-900"
              >
                ← Prev
              </button>

              <span className="text-zinc-400">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 border border-zinc-800 rounded-lg disabled:opacity-40 hover:bg-zinc-900"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
