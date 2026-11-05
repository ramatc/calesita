import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Shrikhand } from "next/font/google";
import "./globals.css";

const body = Bricolage_Grotesque({
  variable: "--font-body",
  subsets: ["latin"],
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
  themeColor: "#24104f",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-AR"
      className={`dark ${body.variable} ${marquee.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
