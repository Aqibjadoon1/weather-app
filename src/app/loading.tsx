export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-aether-bg gap-4">
      <div className="w-10 h-10 border-2 border-aether-gold border-t-transparent rounded-full animate-spin" />
      <p className="text-aether-text-muted text-sm font-label-bold">Loading...</p>
    </div>
  );
}
