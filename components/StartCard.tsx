type StatCardProps = {
  title: string;
  value: string;
  icon: string;
  description: string;
};

export default function StatCard({
  title,
  value,
  icon,
  description,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>
        <span className="text-2xl">{icon}</span>
      </div>

      <h3 className="mt-4 text-3xl font-bold text-slate-800">{value}</h3>

      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}
