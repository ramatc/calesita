"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/brand/logo";
import { SurpriseButton } from "@/components/catalog/surprise-button";
import { PlayerSelector } from "@/components/design/player-selector";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/juegos", label: "Juegos", section: "/juegos" },
  { href: "/#categorias", label: "Categorías", section: null },
] as const;

function isCurrent(pathname: string, section: string | null) {
  return section !== null && pathname.startsWith(section);
}

function DesktopNav({ pathname }: { pathname: string }) {
  return (
    <nav aria-label="Principal" className="ml-5 hidden items-center gap-1 md:flex">
      {NAV_LINKS.map(({ href, label, section }) => {
        const current = isCurrent(pathname, section);

        return (
          <Link
            key={href}
            href={href}
            aria-current={current ? "page" : undefined}
            className={cn(
              "relative flex h-11 items-center rounded-full px-3.5 font-medium transition-colors duration-150 hover:bg-accent",
              current && "text-brand-yellow",
            )}
          >
            {label}
            {current && (
              <span
                aria-hidden="true"
                className="absolute bottom-1 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-brand-yellow"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function MobileMenu({ pathname, showAction }: { pathname: string; showAction: boolean }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="touch" aria-label="Abrir menú" className="md:hidden">
          <Menu />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-64 flex-col gap-1 md:hidden">
        <nav aria-label="Principal" className="flex flex-col gap-1">
          {NAV_LINKS.map(({ href, label, section }) => {
            const current = isCurrent(pathname, section);

            return (
              <PopoverClose key={href} asChild>
                <Link
                  href={href}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "flex h-12 items-center rounded-2xl px-3 text-lg font-semibold transition-colors duration-150 hover:bg-accent",
                    current && "text-brand-yellow",
                  )}
                >
                  {label}
                </Link>
              </PopoverClose>
            );
          })}
        </nav>
        {showAction && <SurpriseButton compact className="mt-2" />}
      </PopoverContent>
    </Popover>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  // The home hero already offers Sorprendeme.
  const showAction = pathname !== "/";

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center rounded-full bg-card/90 pr-2 pl-4 shadow-raised sm:pr-2.5 sm:pl-5 backdrop-blur-sm">
        <Link
          href="/"
          aria-label="Calesita, ir al inicio"
          className="flex min-h-11 items-center rounded-lg"
        >
          <Logo className="text-[1.625rem] sm:text-3xl" />
        </Link>
        <DesktopNav pathname={pathname} />
        <div className="ml-auto flex items-center gap-1.5 pl-2 sm:gap-2">
          <PlayerSelector />
          {showAction && <SurpriseButton compact className="hidden md:block" />}
          <MobileMenu pathname={pathname} showAction={showAction} />
        </div>
      </div>
    </header>
  );
}
