export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 sky-gradient" style={{ background: "linear-gradient(180deg, #2B6CB0 0%, #4A90D9 25%, #6DB3F2 50%, #8FC5F7 75%, #B0D9FA 100%)" }}>
      <div className="w-10 h-10 border-2 border-aether-gold border-t-transparent rounded-full animate-spin" />
      <p className="text-aether-text-muted text-sm font-label-bold">Loading...</p>
    </div>
  );
}
