export default function Header() {
  return (
    <header className="flex items-center justify-between border-b bg-white px-6 py-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          Admin Dashboard
        </h2>
        <p className="text-sm text-slate-500">
          Manage your room rental platform
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-600">Administrator</span>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
          A
        </div>
      </div>
    </header>
  );
}
