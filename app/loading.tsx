export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="rounded-3xl border border-line bg-panel/70 p-8 text-center shadow-glow">
        <div className="mx-auto h-12 w-12 animate-pulse rounded-full border border-matrix/50 bg-matrix/10" />
        <p className="mt-5 font-mono text-sm text-matrix">正在连接世界杯市场数据...</p>
        <p className="mt-2 text-sm text-emerald-100/45">获取冠军、晋级、球队与交易异动信号</p>
      </div>
    </main>
  );
}
