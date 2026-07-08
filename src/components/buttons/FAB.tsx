"use client";

interface FABProps {
  icon: string;
  onClick?: () => void;
  className?: string;
}

export default function FAB({ icon, onClick, className = "" }: FABProps) {
  return (
    <button
      onClick={onClick}
      className={[
        "fixed bottom-10 right-10 max-sm:bottom-6 max-sm:right-6",
        "w-16 h-16 rounded-full bg-tertiary-container text-on-tertiary-container",
        "shadow-2xl hover:scale-110 active:scale-90 transition-all duration-200",
        "flex items-center justify-center cursor-pointer",
        className,
      ].join(" ")}
    >
      <span className="material-symbols-outlined text-3xl leading-none">
        {icon}
      </span>
    </button>
  );
}
