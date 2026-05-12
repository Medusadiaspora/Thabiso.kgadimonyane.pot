import CyberScene from "./components/CyberScene";
import Hero from "./sections/Hero";
import CyberManifesto from "./sections/CyberManifesto";
import Skills from "./sections/Skills";
//import Projects from "./sections/Projects";
import Contact from "./sections/Contact";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black selection:bg-cyan-500 selection:text-black overflow-hidden">
      <CyberScene />
      <div className="scanlines" />
      <Hero />
      <CyberManifesto /> {/* INSERTED HERE */}
      <Skills />
      <Contact />
      {/* Fixed status bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-gray-900 bg-black/90 backdrop-blur px-4 py-2 flex justify-between items-center text-[10px] font-mono text-gray-600">
        <span>BOONDOCK_CYBERDEV © 2026</span>
        <span className="hidden sm:flex gap-4">
          <span className="text-cyan-600">STATUS: ONLINE</span>
          <span className="text-pink-600">NODE: JHB_ZA</span>
          <span className="text-green-600">MANIFESTO: LOADED</span>
        </span>
        <span>THABISO C. KGADIMONYANE</span>
      </div>
    </main>
  );
}
