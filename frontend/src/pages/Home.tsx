import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* NAVBAR
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
        <h1 className="text-2xl font-bold text-red-600">My-Savior</h1>
        <div className="space-x-4">
          <Link
            to="/login"
            className="text-sm text-zinc-300 hover:text-white"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-semibold"
          >
            Register
          </Link>
        </div>
      </nav> */}

      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Be Someone’s <span className="text-red-600">Saviour</span>
        </h2>
        <p className="mt-4 max-w-xl text-zinc-400">
          My-Savior connects blood donors with those in urgent need.
          One donation can save multiple lives.
        </p>

        <div className="mt-8 flex gap-4">
          <Link
            to="/register"
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold"
          >
            Become a Donor
          </Link>
          <Link
            to="/donors"
            className="border border-zinc-700 hover:border-red-600 px-6 py-3 rounded-lg font-semibold"
          >
            Find Blood
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 max-w-5xl mx-auto">
        {[
          { title: "10,000+", desc: "Lives Saved" },
          { title: "5,000+", desc: "Active Donors" },
          { title: "24/7", desc: "Emergency Support" },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-zinc-900 p-6 rounded-xl text-center border border-zinc-800"
          >
            <h3 className="text-3xl font-bold text-red-600">
              {item.title}
            </h3>
            <p className="mt-2 text-zinc-400">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold text-center mb-12">
          How <span className="text-red-600">My-Savior</span> Works
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Register",
              desc: "Sign up as a donor or a user in seconds.",
            },
            {
              step: "2",
              title: "Search",
              desc: "Find blood donors by group and location.",
            },
            {
              step: "3",
              title: "Save Lives",
              desc: "Connect instantly in emergencies.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-zinc-900 p-6 rounded-xl border border-zinc-800"
            >
              <div className="text-red-600 text-4xl font-extrabold">
                {item.step}
              </div>
              <h4 className="mt-4 text-xl font-semibold">
                {item.title}
              </h4>
              <p className="mt-2 text-zinc-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="bg-gradient-to-r from-red-700 to-red-900 py-16 text-center px-6">
        <h3 className="text-3xl font-bold">
          Your Blood Can Save a Life Today
        </h3>
        <p className="mt-3 text-red-100">
          Join My-Savior and become a hero for someone in need.
        </p>
        <Link
          to="/register"
          className="inline-block mt-6 bg-black hover:bg-zinc-900 px-8 py-3 rounded-lg font-semibold"
        >
          Get Started
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 py-6 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} My-Savior. All rights reserved.
      </footer>
    </div>
  );
}
