import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-aether-bg text-aether-text-primary overflow-x-hidden">
      {children}
    </div>
  );
}
