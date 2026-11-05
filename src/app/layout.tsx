import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree, Shrikhand } from "next/font/google";
import "./globals.css";

const body = Figtree({
  variable: "--font-body",
  subsets: ["latin"],
});

const headline = Bricolage_Grotesque({
  variable: "--font-headline",
  subsets: ["latin"],
  axes: ["opsz"],
});

const marquee = Shrikhand({
  variable: "--font-marquee",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Calesita · La juntada sigue girando",
    template: "%s · Calesita",
  },
  description:
    "Party games para jugar con amigos en persona, con un solo celular. Sin registro y sin descargar nada.",
};

export const viewport: Viewport = {
  themeColor: "#130a24",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-AR"
      className={`dark ${body.variable} ${headline.variable} ${marquee.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
