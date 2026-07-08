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
    <footer className="bg-surface border-t border-outline-variant w-full py-10 mt-section-margin">
      <div className="max-w-7xl mx-auto px-container-padding flex flex-col md:flex-row justify-between items-center gap-element-gap">
        <span className="font-headline-md text-primary text-sm md:text-base">
          Aether Weather
        </span>

        <div className="flex items-center gap-element-gap">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <span className="text-sm text-on-surface-variant">
          &copy; {year} Aether Weather. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
