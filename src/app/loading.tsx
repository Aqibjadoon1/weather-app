export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface gap-4">
      <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-on-surface-variant text-sm font-label-bold">Loading...</p>
    </div>
  );
}
