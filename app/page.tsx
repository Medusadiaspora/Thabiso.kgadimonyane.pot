"use client";

import { useState } from "react";
import CyberScene from "./components/CyberScene";
import Hero from "./sections/Hero";
import CyberManifesto from "./sections/CyberManifesto";
import Skills from "./sections/Skills";
import Contact from "./sections/Contact";
import WeServModal from "./components/WeServModal";
// Or: import { WeServModal } from "./components/WeServModal";

export default function Home() {
  const [isWeServOpen, setIsWeServOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-black selection:bg-cyan-500 selection:text-black overflow-hidden">
      <CyberScene />
      <div className="scanlines" />
      <Hero />
      <CyberManifesto />
      <Skills />
      <WeServModal />
      <Contact />

      {/* MODAL COMPONENT */}
    </main>
  );
}
