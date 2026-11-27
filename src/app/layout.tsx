import type { Metadata, Viewport } from "next";
import { Jersey_10, Manrope, Shrikhand } from "next/font/google";
import "./globals.css";

const marquee = Shrikhand({
  variable: "--font-marquee",
  weight: "400",
  subsets: ["latin"],
});

/* Arcade system: pixel display for headings and short labels, Manrope for everything functional. */
const pixel = Jersey_10({
  variable: "--font-jersey",
  weight: "400",
  subsets: ["latin"],
});

const ui = Manrope({
  variable: "--font-manrope",
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
  themeColor: "#201038",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-AR"
      className={`dark ${marquee.variable} ${pixel.variable} ${ui.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
