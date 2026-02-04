import { useState } from "react";
import api from "../services/api";

type FormData = {
  name: string;
  email: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  registrationNumber: string;
  panNumber: string;
  about: string;
  orgType: string;
  ngoCategory?: string;
  customCategory?: string;
  password: string;
};

export default function RegistrationForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    registrationNumber: "",
    panNumber: "",
    about: "",
    orgType: "",
    ngoCategory: "",
    customCategory: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validate = () => {
    if (!form.name) return "Organization name is required";
    if (!form.email.match(/^\S+@\S+\.\S+$/))
      return "Please enter a valid email";
    if (!form.orgType) return "Select organization type";
    if (form.orgType === "ngo" && !form.ngoCategory)
      return "Select NGO category";
    if (form.ngoCategory === "Custom" && !form.customCategory)
      return "Enter custom category";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorMsg = validate();
    if (errorMsg) return setError(errorMsg);

    try {
      setLoading(true);
      await api.post("/org/register", {
        ...form,
        ngoCategory:
          form.ngoCategory === "Custom"
            ? form.customCategory
            : form.ngoCategory,
      });
      alert("Registration submitted for admin approval.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Organization Registration
        </h2>
        <p className="text-zinc-400 mb-6">
          Hospitals & NGOs must be approved by admin before login
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-zinc-900/40 border border-red-700 text-red-300 px-4 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Organization Name */}
          <div className="md:col-span-2">
            <label className="label">Organization Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input"
              placeholder="My Savior Foundation"
            />
          </div>

          <div>
            <label className="label">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="input"
              placeholder="contact@email.com"
            />
          </div>

          <div>
            <label className="label">Organization Type</label>
            <select
              name="orgType"
              value={form.orgType}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select</option>
              <option value="hospital">Hospital</option>
              <option value="ngo">NGO</option>
            </select>
          </div>

          {form.orgType === "ngo" && (
            <>
              <div>
                <label className="label">NGO Category</label>
                <select
                  name="ngoCategory"
                  value={form.ngoCategory}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Select</option>
                  <option value="Medical">Medical</option>
                  <option value="Education">Education</option>
                  <option value="Child Welfare">Child Welfare</option>
                  <option value="Old Age">Old Age</option>
                  <option value="Food & Shelter">Food & Shelter</option>
                  <option value="Animal Care">Animal Care</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              {form.ngoCategory === "Custom" && (
                <div>
                  <label className="label">Custom Category</label>
                  <input
                    name="customCategory"
                    value={form.customCategory}
                    onChange={handleChange}
                    className="input"
                    placeholder="Enter category"
                  />
                </div>
              )}
            </>
          )}

          <div>
            <label className="label">City</label>
            <input name="city" value={form.city} onChange={handleChange} className="input" />
          </div>

          <div>
            <label className="label">District</label>
            <input name="district" value={form.district} onChange={handleChange} className="input" />
          </div>

          <div>
            <label className="label">State</label>
            <input name="state" value={form.state} onChange={handleChange} className="input" />
          </div>

          <div>
            <label className="label">Pincode</label>
            <input name="pincode" value={form.pincode} onChange={handleChange} className="input" />
          </div>

          <div>
            <label className="label">Registration Number</label>
            <input name="registrationNumber" value={form.registrationNumber} onChange={handleChange} className="input" />
          </div>

          <div>
            <label className="label">PAN Number</label>
            <input name="panNumber" value={form.panNumber} onChange={handleChange} className="input uppercase" />
          </div>

          <div className="md:col-span-2">
            <label className="label">About Organization</label>
            <textarea
              name="about"
              rows={3}
              value={form.about}
              onChange={handleChange}
              className="input resize-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="label">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 transition rounded-lg py-3 text-white font-semibold disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit for Approval"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
