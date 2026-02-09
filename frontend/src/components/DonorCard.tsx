interface DonorCardProps {
  donor: any;
  onCta: (id: string) => void;
}

export default function DonorCard({ donor, onCta }: DonorCardProps) {
  return (
    <article className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-100">
            {donor.full_name}
          </h2>

          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-600 text-white">
            {donor.blood_group}
          </span>
        </div>

        <p className="text-sm text-zinc-400 mt-2">
          📍 {donor.city}, {donor.district}, {donor.state}
        </p>
      </div>

      {/* CTA */}
      <div className="mt-6 flex gap-3">
        <a
          href={`tel:${donor.mobile}`}
          onClick={() => onCta(donor.id)}
          className="flex-1 text-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Call Donor
        </a>

        {/* <a
          href={`tel:${donor.emergency_contact}`}
          className="flex-1 text-center border border-zinc-700 hover:bg-zinc-800 text-zinc-200 font-semibold py-2 rounded-lg transition"
        >
          Emergency
        </a> */}
      </div>
    </article>
  );
}
