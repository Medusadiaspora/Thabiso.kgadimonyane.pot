import type { Metadata } from "next";
import "./globals.css";
import VisitorCounter from "@/app/components/VisitorCounter";

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
      <body className="antialiased">
        {children}
        <VisitorCounter />
      </body>
    </html>
  );
}
