"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center px-5">
        {/* The home hero already shows the big logo. */}
        {pathname !== "/" && (
          <Link href="/" aria-label="Calesita, ir al inicio" className="rounded-lg">
            <Logo className="text-3xl" />
          </Link>
        )}
        <nav aria-label="Principal" className="ml-auto">
          <Button asChild variant="ghost" size="chip">
            <Link href="/juegos">Juegos</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
