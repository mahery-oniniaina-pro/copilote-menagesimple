"use client";

import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Copilote" },
  { href: "/banc-essai", label: "Banc d'essai" },
  { href: "/coherence", label: "Cohérence du site" },
  { href: "/methode", label: "Méthode" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="nav" aria-label="Navigation principale">
      {LINKS.map((link) => (
        <a key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}>
          {link.label}
        </a>
      ))}
    </nav>
  );
}
