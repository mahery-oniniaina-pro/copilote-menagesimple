"use client";

import { BookOpenText, FileWarning, Inbox, ListChecks } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Registre", icon: Inbox },
  { href: "/banc-essai", label: "Banc d'essai", icon: ListChecks },
  { href: "/coherence", label: "Errata", icon: FileWarning },
  { href: "/methode", label: "Méthode", icon: BookOpenText },
];

export function Rail() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navigation principale"
      className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-stretch border-t border-ink-150 bg-sheet md:static md:h-auto md:w-[76px] md:flex-col md:border-t-0 md:border-r md:py-3"
    >
      <Link
        href="/"
        aria-label="Copilote, accueil"
        className="hidden md:mx-auto md:mb-5 md:flex md:size-11 md:items-center md:justify-center md:rounded-md md:border-[1.5px] md:border-ink-900 md:bg-signal"
      >
        <span className="stamp text-[11px] font-medium text-ink-900">RR</span>
      </Link>
      {LINKS.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`group flex flex-1 flex-col items-center justify-center gap-1 text-[11px] leading-none transition-colors md:mx-2 md:mb-1 md:flex-none md:rounded-lg md:py-2.5 ${
              active ? "text-ink-900 md:bg-ink-50" : "text-ink-500 hover:text-ink-900 md:hover:bg-ink-50"
            }`}
          >
            <Icon aria-hidden className="size-[19px]" strokeWidth={active ? 2 : 1.6} />
            <span className={`text-center ${active ? "font-medium" : ""}`}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
