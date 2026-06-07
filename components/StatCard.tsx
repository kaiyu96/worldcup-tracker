type StatCardProps = {
  label: string;
  value: string;
  helper?: string;
};

export function StatCard({ label, value, helper }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-line bg-panel/70 p-4 shadow-glow">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-100/45">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-emerald-50">{value}</p>
      {helper ? <p className="mt-1 text-xs text-emerald-100/45">{helper}</p> : null}
    </div>
  );
}
