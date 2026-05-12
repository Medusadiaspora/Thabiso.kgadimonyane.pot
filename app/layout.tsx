import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BOONDOCK CYBERDEV | Thabiso Carlton Kgadimonyane",
  description:
    "Fullstack Engineer cultivating future technologies. Johannesburg, ZA. Next.js, GSAP, Three.js, TypeScript.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
