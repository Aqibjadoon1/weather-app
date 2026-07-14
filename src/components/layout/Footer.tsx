import Link from "next/link";

const footerLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/support", label: "Support" },
  { href: "/press", label: "Press" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-aether-bg border-t border-aether-gold/10 w-full py-10 mt-section-margin">
      <div className="max-w-7xl mx-auto px-container-padding flex flex-col md:flex-row justify-between items-center gap-element-gap">
        <span className="font-headline-md text-aether-gold text-sm md:text-base">
          Accurate Weather
        </span>

        <div className="flex items-center gap-element-gap">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-aether-text-muted hover:text-aether-gold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold focus-visible:rounded-sm"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <span className="text-sm text-aether-text-muted">
          &copy; {year} Accurate Weather. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
