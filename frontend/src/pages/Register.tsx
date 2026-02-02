import { useState } from "react";
import api from "../services/api";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    aadhar: "",
    bloodGroup: "",
    emergencyContact: "",
    isDonor: false,
    termsAccepted: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.termsAccepted) {
      alert("Please accept terms & conditions");
      return;
    }

    try {
      await api.post("/auth/register", form);
      alert("Registration successful");
    } catch (err: any) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-6 rounded-xl w-full max-w-2xl shadow-lg"
      >
        <h1 className="text-2xl font-bold text-red-600 mb-6 text-center">
          Blood Donation Registration
        </h1>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="fullName" required placeholder="Full Name"
            className="input" onChange={handleChange} />

          <input name="email" type="email" required placeholder="Email"
            className="input" onChange={handleChange} />

          <input name="mobile" required placeholder="Mobile Number"
            className="input" onChange={handleChange} />

          <input name="password" type="password" required placeholder="Password"
            className="input" onChange={handleChange} />

          <input name="city" required placeholder="City"
            className="input" onChange={handleChange} />

          <input name="district" required placeholder="District"
            className="input" onChange={handleChange} />

          <input name="state" required placeholder="State"
            className="input" onChange={handleChange} />

          <input name="pincode" required placeholder="Pincode"
            className="input" onChange={handleChange} />

          <input name="aadhar" required placeholder="Aadhar Number"
            className="input" onChange={handleChange} />

          <select
            name="bloodGroup"
            required
            className="input"
            onChange={handleChange}
          >
            <option value="">Select Blood Group</option>
            {bloodGroups.map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>

          <input name="emergencyContact" required placeholder="Emergency Contact"
            className="input md:col-span-2" onChange={handleChange} />
        </div>

        {/* Checkboxes */}
        <div className="mt-4 space-y-2 text-sm text-zinc-300">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isDonor" onChange={handleChange} />
            Register as Blood Donor
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" name="termsAccepted" required onChange={handleChange} />
            I accept the Terms & Conditions
          </label>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}
