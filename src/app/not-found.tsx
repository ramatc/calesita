import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-5 px-5 py-16 text-center">
      <h1 className="font-display text-5xl text-brand-yellow">Te caíste de la calesita</h1>
      <p className="text-lg text-muted-foreground">Esta página no existe.</p>
      <Button asChild size="xl">
        <Link href="/">Volver al inicio</Link>
      </Button>
    </main>
  );
}
