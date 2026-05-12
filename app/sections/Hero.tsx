"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

interface Glyph {
  char: string;
  x: number;
  y: number;
  speed: number;
  opacity: number;
  size: number;
  color: string;
}

interface MouseTrail {
  x: number;
  y: number;
  life: number;
  char: string;
}

interface LightningBolt {
  points: { x: number; y: number }[];
  life: number;
  maxLife: number;
  hue: number;
}

const GREEK_GLYPHS = "αβγδεζηθικλμνξοπρστυφχψωΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ";
const TERMINAL_TEXT =
  "Fullstack Architect weaving code like Athena weaves fate — building digital realms where mortals become gods of the terminal.";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hologramCanvasRef = useRef<HTMLCanvasElement>(null);
  const trailCanvasRef = useRef<HTMLCanvasElement>(null);
  const lightningCanvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const scanlineRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [terminalText, setTerminalText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const particlesRef = useRef<Particle[]>([]);
  const glyphsRef = useRef<Glyph[]>([]);
  const mouseTrailRef = useRef<MouseTrail[]>([]);
  const lightningBoltsRef = useRef<LightningBolt[]>([]);
  const animFrameRef = useRef<number>(0);
  const glyphFrameRef = useRef<number>(0);
  const trailFrameRef = useRef<number>(0);
  const lightningFrameRef = useRef<number>(0);
  const timeRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioDataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const isAudioInitRef = useRef(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const bgX = useTransform(smoothMouseX, [-0.5, 0.5], [30, -30]);
  const bgY = useTransform(smoothMouseY, [-0.5, 0.5], [30, -30]);

  const holoRotateX = useTransform(smoothMouseY, [-0.5, 0.5], [8, -8]);
  const holoRotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-8, 8]);

  const holo1X = useTransform(smoothMouseX, [-0.5, 0.5], [-60, 60]);
  const holo1Y = useTransform(smoothMouseY, [-0.5, 0.5], [-40, 40]);

  const holo2X = useTransform(smoothMouseX, [-0.5, 0.5], [40, -40]);
  const holo2Y = useTransform(smoothMouseY, [-0.5, 0.5], [30, -30]);

  // ─── AUDIO REACTIVITY ───
  const initAudio = useCallback(async () => {
    if (isAudioInitRef.current) return;
    try {
      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      audioDataRef.current = new Uint8Array(analyser.frequencyBinCount);
      isAudioInitRef.current = true;
    } catch (e) {
      console.log("Audio not available, using simulated reactivity");
    }
  }, []);

  const getAudioLevel = useCallback(() => {
    if (analyserRef.current && audioDataRef.current) {
      analyserRef.current.getByteFrequencyData(audioDataRef.current);
      const average =
        audioDataRef.current.reduce((a, b) => a + b, 0) /
        audioDataRef.current.length;
      return average / 255;
    }
    return Math.abs(mouseX.get()) * 2;
  }, [mouseX]);

  // ─── PARTICLES ───
  const initParticles = useCallback(() => {
    const particles: Particle[] = [];
    for (let i = 0; i < 200; i++) {
      particles.push({
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        z: Math.random() * 2 - 1,
        vx: (Math.random() - 0.5) * 0.002,
        vy: (Math.random() - 0.5) * 0.002,
        vz: (Math.random() - 0.5) * 0.002,
        life: Math.random() * 100,
        maxLife: 100 + Math.random() * 100,
        size: 1 + Math.random() * 3,
        hue: 180 + Math.random() * 60,
      });
    }
    particlesRef.current = particles;
  }, []);

  // ─── GLYPHS ───
  const initGlyphs = useCallback(() => {
    const canvas = hologramCanvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const columns = Math.floor(w / 20);
    const glyphs: Glyph[] = [];

    for (let i = 0; i < columns; i++) {
      glyphs.push({
        char: GREEK_GLYPHS[Math.floor(Math.random() * GREEK_GLYPHS.length)],
        x: i * 20 + 10,
        y: Math.random() * canvas.height,
        speed: 0.5 + Math.random() * 1.5,
        opacity: Math.random() * 0.5 + 0.1,
        size: 12 + Math.random() * 8,
        color: Math.random() > 0.7 ? "#ff00ff" : "#00ffff",
      });
    }
    glyphsRef.current = glyphs;
  }, []);

  // ─── PARTICLE ANIMATION (AUDIO-REACTIVE) ───
  const animateParticles = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    timeRef.current += 0.016;
    const audioLevel = getAudioLevel();

    ctx.fillStyle = `rgba(0, 0, 0, ${0.05 + audioLevel * 0.02})`;
    ctx.fillRect(0, 0, w, h);

    const particles = particlesRef.current;
    const centerX = w / 2;
    const centerY = h / 2;

    particles.forEach((p) => {
      const dist = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
      const force = 0.0001 / (dist + 0.1);

      const audioBoost = 1 + audioLevel * 3;
      p.vx += (-p.x * force + (Math.random() - 0.5) * 0.001) * audioBoost;
      p.vy += (-p.y * force + (Math.random() - 0.5) * 0.001) * audioBoost;
      p.vz += -p.z * force;

      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;
      p.life += 1;

      if (p.life > p.maxLife || dist > 2) {
        p.x = (Math.random() - 0.5) * 0.5;
        p.y = (Math.random() - 0.5) * 0.5;
        p.z = (Math.random() - 0.5) * 0.5;
        p.vx = (Math.random() - 0.5) * 0.002;
        p.vy = (Math.random() - 0.5) * 0.002;
        p.vz = (Math.random() - 0.5) * 0.002;
        p.life = 0;
        p.hue = 180 + Math.random() * 60;
      }

      const fov = 400;
      const scale = fov / (fov + p.z * 200);
      const screenX = centerX + p.x * w * 0.4 * scale;
      const screenY = centerY + p.y * h * 0.4 * scale;
      const alpha = (1 - p.life / p.maxLife) * scale;
      const reactiveSize = p.size * scale * (1 + audioLevel * 2);

      if (
        alpha > 0.01 &&
        screenX > -50 &&
        screenX < w + 50 &&
        screenY > -50 &&
        screenY < h + 50
      ) {
        ctx.beginPath();
        ctx.arc(screenX, screenY, reactiveSize, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue + audioLevel * 60}, 100%, ${60 + audioLevel * 40}%, ${alpha})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(screenX, screenY, reactiveSize * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue + audioLevel * 60}, 100%, 50%, ${alpha * 0.15})`;
        ctx.fill();
      }
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dz = p1.z - p2.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 0.3) {
          const fov = 400;
          const s1 = fov / (fov + p1.z * 200);
          const s2 = fov / (fov + p2.z * 200);
          const x1 = centerX + p1.x * w * 0.4 * s1;
          const y1 = centerY + p1.y * h * 0.4 * s1;
          const x2 = centerX + p2.x * w * 0.4 * s2;
          const y2 = centerY + p2.y * h * 0.4 * s2;
          const lineAlpha = (1 - dist / 0.3) * 0.2;

          if (
            x1 > -100 &&
            x1 < w + 100 &&
            y1 > -100 &&
            y1 < h + 100 &&
            x2 > -100 &&
            x2 < w + 100 &&
            y2 > -100 &&
            y2 < h + 100
          ) {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = `hsla(${200 + audioLevel * 60}, 100%, 50%, ${lineAlpha})`;
            ctx.lineWidth = 0.5 + audioLevel;
            ctx.stroke();
          }
        }
      }
    }

    animFrameRef.current = requestAnimationFrame(animateParticles);
  }, [getAudioLevel]);

  // ─── GLYPH ANIMATION ───
  const animateGlyphs = useCallback(() => {
    const canvas = hologramCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const glyphs = glyphsRef.current;
    glyphs.forEach((g) => {
      g.y += g.speed;
      if (g.y > h + 20) {
        g.y = -20;
        g.char = GREEK_GLYPHS[Math.floor(Math.random() * GREEK_GLYPHS.length)];
        g.speed = 0.5 + Math.random() * 1.5;
      }

      if (Math.random() < 0.02) {
        g.char = GREEK_GLYPHS[Math.floor(Math.random() * GREEK_GLYPHS.length)];
      }

      ctx.font = `${g.size}px "Courier New", monospace`;
      ctx.fillStyle = g.color;
      ctx.globalAlpha =
        g.opacity * (0.5 + 0.5 * Math.sin(Date.now() * 0.003 + g.x));
      ctx.fillText(g.char, g.x, g.y);
    });

    ctx.globalAlpha = 1;
    glyphFrameRef.current = requestAnimationFrame(animateGlyphs);
  }, []);

  // ─── MOUSE TRAIL WITH GREEK GLYPHS ───
  const animateMouseTrail = useCallback(() => {
    const canvas = trailCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const trails = mouseTrailRef.current;
    for (let i = trails.length - 1; i >= 0; i--) {
      const t = trails[i];
      t.life -= 0.02;
      if (t.life <= 0) {
        trails.splice(i, 1);
        continue;
      }

      ctx.font = `14px "Courier New", monospace`;
      ctx.fillStyle = `hsla(${180 + Math.random() * 60}, 100%, 70%, ${t.life})`;
      ctx.fillText(t.char, t.x, t.y);

      ctx.shadowColor = `hsla(${180 + Math.random() * 60}, 100%, 50%, ${t.life})`;
      ctx.shadowBlur = 10;
      ctx.fillText(t.char, t.x, t.y);
      ctx.shadowBlur = 0;
    }

    trailFrameRef.current = requestAnimationFrame(animateMouseTrail);
  }, []);

  // ─── LIGHTNING BOLTS ───
  const spawnLightning = useCallback((x: number, y: number) => {
    const points: { x: number; y: number }[] = [];
    let currentX = x;
    let currentY = y;
    const segments = 8 + Math.floor(Math.random() * 6);
    const targetX = x + (Math.random() - 0.5) * 300;
    const targetY = y + (Math.random() - 0.5) * 300;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const baseX = x + (targetX - x) * t;
      const baseY = y + (targetY - y) * t;
      const jitter = (1 - t) * 40;
      points.push({
        x: baseX + (Math.random() - 0.5) * jitter,
        y: baseY + (Math.random() - 0.5) * jitter,
      });
    }

    lightningBoltsRef.current.push({
      points,
      life: 1,
      maxLife: 1,
      hue: Math.random() > 0.5 ? 180 : 280,
    });
  }, []);

  const animateLightning = useCallback(() => {
    const canvas = lightningCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bolts = lightningBoltsRef.current;
    for (let i = bolts.length - 1; i >= 0; i--) {
      const bolt = bolts[i];
      bolt.life -= 0.05;
      if (bolt.life <= 0) {
        bolts.splice(i, 1);
        continue;
      }

      const alpha = bolt.life;
      ctx.beginPath();
      ctx.moveTo(bolt.points[0].x, bolt.points[0].y);
      for (let j = 1; j < bolt.points.length; j++) {
        ctx.lineTo(bolt.points[j].x, bolt.points[j].y);
      }
      ctx.strokeStyle = `hsla(${bolt.hue}, 100%, 80%, ${alpha})`;
      ctx.lineWidth = 2 + alpha * 2;
      ctx.shadowColor = `hsla(${bolt.hue}, 100%, 50%, ${alpha})`;
      ctx.shadowBlur = 20;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.moveTo(bolt.points[0].x + 2, bolt.points[0].y + 2);
      for (let j = 1; j < bolt.points.length; j++) {
        ctx.lineTo(bolt.points[j].x + 2, bolt.points[j].y + 2);
      }
      ctx.strokeStyle = `hsla(${bolt.hue + 30}, 100%, 90%, ${alpha * 0.5})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    lightningFrameRef.current = requestAnimationFrame(animateLightning);
  }, []);

  // ─── TYPEWRITER EFFECT ───
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= TERMINAL_TEXT.length) {
        setTerminalText(TERMINAL_TEXT.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 40);

    const cursorInterval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);

    return () => {
      clearInterval(interval);
      clearInterval(cursorInterval);
    };
  }, []);

  // ─── MOUSE HANDLER ───
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      mouseX.set(x);
      mouseY.set(y);
      setMousePos({ x: e.clientX, y: e.clientY });

      if (Math.random() > 0.7) {
        mouseTrailRef.current.push({
          x: e.clientX,
          y: e.clientY,
          life: 1,
          char: GREEK_GLYPHS[Math.floor(Math.random() * GREEK_GLYPHS.length)],
        });
      }
    },
    [mouseX, mouseY],
  );

  const handleClick = useCallback(
    (e: MouseEvent) => {
      spawnLightning(e.clientX, e.clientY);
      initAudio();
    },
    [spawnLightning, initAudio],
  );

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // ─── GSAP ───
  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-title-line",
        { y: 100, opacity: 0, rotateX: -45 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: "power4.out",
          delay: 0.5,
        },
      );

      gsap.fromTo(
        ".hero-subtitle",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 1.2 },
      );

      gsap.fromTo(
        ".hero-cta",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 1.5 },
      );

      gsap.fromTo(
        ".hologram-card",
        { scale: 0, rotateY: 180, opacity: 0 },
        {
          scale: 1,
          rotateY: 0,
          opacity: 1,
          duration: 1.4,
          stagger: 0.2,
          ease: "elastic.out(1, 0.5)",
          delay: 0.8,
        },
      );

      gsap.to(".hologram-card", {
        y: -100,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(scanlineRef.current, {
        y: "100vh",
        duration: 3,
        repeat: -1,
        ease: "none",
      });

      gsap.to(".holo-ring", {
        rotateZ: 360,
        duration: 20,
        repeat: -1,
        ease: "none",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // ─── CANVAS SETUP ───
  useEffect(() => {
    if (typeof window === "undefined") return;

    const canvas = canvasRef.current;
    const holoCanvas = hologramCanvasRef.current;
    const trailCanvas = trailCanvasRef.current;
    const lightningCanvas = lightningCanvasRef.current;
    if (!canvas || !holoCanvas || !trailCanvas || !lightningCanvas) return;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      holoCanvas.width = w;
      holoCanvas.height = h;
      trailCanvas.width = w;
      trailCanvas.height = h;
      lightningCanvas.width = w;
      lightningCanvas.height = h;
      initParticles();
      initGlyphs();
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    animFrameRef.current = requestAnimationFrame(animateParticles);
    glyphFrameRef.current = requestAnimationFrame(animateGlyphs);
    trailFrameRef.current = requestAnimationFrame(animateMouseTrail);
    lightningFrameRef.current = requestAnimationFrame(animateLightning);

    setTimeout(() => setIsLoaded(true), 300);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(animFrameRef.current);
      cancelAnimationFrame(glyphFrameRef.current);
      cancelAnimationFrame(trailFrameRef.current);
      cancelAnimationFrame(lightningFrameRef.current);
    };
  }, [
    initParticles,
    initGlyphs,
    animateParticles,
    animateGlyphs,
    animateMouseTrail,
    animateLightning,
    handleMouseMove,
    handleClick,
  ]);

  // ─── GLITCH ───
  useEffect(() => {
    const glitchInterval = setInterval(
      () => {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 150);
      },
      3000 + Math.random() * 4000,
    );
    return () => clearInterval(glitchInterval);
  }, []);

  const cursorGlow = {
    x: mousePos.x - 150,
    y: mousePos.y - 150,
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-black cursor-none"
      style={{ perspective: "1200px" }}
    >
      {/* ═══ CUSTOM CURSOR ═══ */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: mousePos.x - 12,
          y: mousePos.y - 12,
        }}
      >
        <div className="relative w-6 h-6">
          <div className="absolute inset-0 border-2 border-cyan-400 rounded-full" />
          <div className="absolute inset-2 bg-cyan-400 rounded-full opacity-80" />
          <motion.div
            className="absolute -inset-4 border border-cyan-400/30 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* ═══ LAYER 0: BACKGROUND ═══ */}
      <motion.div className="absolute inset-0 z-0" style={{ x: bgX, y: bgY }}>
        <div className="absolute inset-0 scale-110">
          <Image
            src="/score.PNG"
            alt="Cyberpunk Continental"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-[40vh] opacity-30"
          style={{
            background: `
              linear-gradient(to bottom, transparent 0%, rgba(0,255,255,0.1) 100%),
              repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(0,255,255,0.1) 40px, rgba(0,255,255,0.1) 41px),
              repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,255,255,0.1) 40px, rgba(0,255,255,0.1) 41px)
            `,
            transform: "perspective(500px) rotateX(60deg)",
            transformOrigin: "bottom center",
          }}
        />
      </motion.div>

      {/* ═══ LAYER 1: PARTICLE NEBULA (AUDIO-REACTIVE) ═══ */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* ═══ LAYER 2: GLYPH RAIN ═══ */}
      <canvas
        ref={hologramCanvasRef}
        className="absolute inset-0 z-10 pointer-events-none opacity-40"
      />

      {/* ═══ LAYER 3: MOUSE TRAIL ═══ */}
      <canvas
        ref={trailCanvasRef}
        className="absolute inset-0 z-[60] pointer-events-none"
      />

      {/* ═══ LAYER 4: LIGHTNING BOLTS ═══ */}
      <canvas
        ref={lightningCanvasRef}
        className="absolute inset-0 z-[55] pointer-events-none"
      />

      {/* ═══ LAYER 5: VIGNETTE & ATMOSPHERE ═══ */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="absolute top-8 left-8 w-24 h-24 border-l-2 border-t-2 border-cyan-400/50" />
        <div className="absolute top-8 right-8 w-24 h-24 border-r-2 border-t-2 border-cyan-400/50" />
        <div className="absolute bottom-8 left-8 w-24 h-24 border-l-2 border-b-2 border-cyan-400/50" />
        <div className="absolute bottom-8 right-8 w-24 h-24 border-r-2 border-b-2 border-cyan-400/50" />

        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

        <div
          ref={scanlineRef}
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
          style={{ top: "-2px" }}
        />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* ═══ LAYER 6: CURSOR GLOW ═══ */}
      <motion.div
        className="fixed w-[300px] h-[300px] rounded-full pointer-events-none z-50 mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle, rgba(0,255,255,0.15) 0%, transparent 70%)",
        }}
        animate={{
          x: cursorGlow.x,
          y: cursorGlow.y,
          transition: { type: "spring", damping: 30, stiffness: 200 },
        }}
      />

      {/* ═══ LAYER 7: MAIN CONTENT ═══ */}
      <div className="relative z-30 min-h-screen flex items-center">
        <div className="w-full max-w-[1800px] mx-auto px-6 lg:px-12 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* LEFT: TEXT */}
            <div className="relative" style={{ perspective: "1000px" }}>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-cyan-300 text-xs font-mono tracking-[0.3em] uppercase">
                  The Continental — Est. MMXIV
                </span>
              </motion.div>

              <div ref={textRef} className="overflow-hidden">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight">
                  <div className="hero-title-line overflow-hidden">
                    <motion.span
                      className="block bg-gradient-to-r from-cyan-300 via-white to-purple-400 bg-clip-text text-transparent"
                      style={{
                        fontFamily:
                          "'Cinzel', 'Trajan Pro', 'Times New Roman', serif",
                        textShadow:
                          "0 0 40px rgba(0,255,255,0.3), 0 0 80px rgba(0,255,255,0.1)",
                      }}
                    >
                      ΘΑΒΙΣΟ
                    </motion.span>
                  </div>
                  <div className="hero-title-line overflow-hidden">
                    <motion.span
                      className="block bg-gradient-to-r from-purple-400 via-pink-300 to-cyan-300 bg-clip-text text-transparent"
                      style={{
                        fontFamily:
                          "'Cinzel', 'Trajan Pro', 'Times New Roman', serif",
                        textShadow:
                          "0 0 40px rgba(255,0,255,0.3), 0 0 80px rgba(255,0,255,0.1)",
                      }}
                    >
                      CYBERDEV
                    </motion.span>
                  </div>
                </h1>
              </div>

              {/* TYPEWRITER SUBTITLE */}
              <motion.p
                className="hero-subtitle mt-8 text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed font-mono"
                style={{ textShadow: "0 0 20px rgba(0,255,255,0.2)" }}
              >
                <span className="text-cyan-400">&gt;</span> {terminalText}
                <motion.span
                  className="inline-block w-[3px] h-[1.2em] bg-cyan-400 ml-1 align-middle"
                  animate={{ opacity: cursorVisible ? 1 : 0 }}
                  transition={{ duration: 0.1 }}
                />
              </motion.p>

              <motion.div
                className="hero-subtitle flex flex-wrap gap-6 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                {[
                  { label: "EXCOMMUNICADO", value: "∞", color: "text-red-400" },
                  {
                    label: "BOUNTY",
                    value: "FULLSTACK",
                    color: "text-cyan-400",
                  },
                  { label: "STATUS", value: "ACTIVE", color: "text-green-400" },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col items-start">
                    <span className="text-[10px] font-mono tracking-[0.2em] text-gray-500 uppercase">
                      {stat.label}
                    </span>
                    <span
                      className={`text-sm font-bold font-mono ${stat.color}`}
                    >
                      {stat.value}
                    </span>
                  </div>
                ))}
              </motion.div>

              <motion.div className="hero-cta flex flex-wrap gap-4 mt-10">
                <motion.button
                  onClick={() => scrollToSection("contact")}
                  className="group relative px-8 py-4 bg-transparent border border-cyan-500/50 text-cyan-300 font-mono text-sm tracking-wider uppercase overflow-hidden rounded-sm cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                  <span className="relative flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                    Initiate Contact
                  </span>
                </motion.button>

                <motion.button
                  onClick={() => scrollToSection("skills")}
                  className="group relative px-8 py-4 bg-cyan-500/10 border border-cyan-400/30 text-white font-mono text-sm tracking-wider uppercase overflow-hidden rounded-sm cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="absolute inset-0 bg-cyan-400/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative flex items-center gap-2">
                    View Arsenal
                    <svg
                      className="w-4 h-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                </motion.button>
              </motion.div>

              <motion.div
                className="mt-8 flex items-center gap-3 text-xs font-mono text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent" />
                <span className="text-cyan-600/60 tracking-[0.2em]">
                  ΜΟΛΩΝ ΛΑΒΕ — COME AND TAKE IT
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-cyan-500/30 to-transparent" />
              </motion.div>
            </div>

            {/* RIGHT: HOLOGRAMS */}
            <motion.div
              className="relative h-[600px] lg:h-[700px]"
              style={{
                transformStyle: "preserve-3d",
                rotateX: holoRotateX,
                rotateY: holoRotateY,
              }}
            >
              {/* HOLOGRAM 1: score(1).PNG */}
              <motion.div
                className="hologram-card absolute top-[5%] right-[5%] w-[280px] h-[380px] md:w-[320px] md:h-[440px]"
                style={{ x: holo1X, y: holo1Y }}
              >
                <div className="relative w-full h-full group">
                  <div className="holo-ring absolute -inset-8 border border-cyan-500/20 rounded-full pointer-events-none" />
                  <div
                    className="holo-ring absolute -inset-12 border border-purple-500/10 rounded-full pointer-events-none"
                    style={{ animationDelay: "-5s" }}
                  />

                  <div className="absolute -inset-2 bg-gradient-to-b from-cyan-500/20 via-transparent to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div
                    className="relative w-full h-full overflow-hidden rounded-lg border border-cyan-500/30 bg-black/50 backdrop-blur-sm"
                    style={{
                      boxShadow: glitchActive
                        ? "0 0 30px rgba(255,0,255,0.6), inset 0 0 30px rgba(0,255,255,0.2)"
                        : "0 0 20px rgba(0,255,255,0.2), inset 0 0 20px rgba(0,255,255,0.05)",
                    }}
                  >
                    <Image
                      src="/score.PNG"
                      alt="Cyberpunk Avatar"
                      fill
                      className="object-cover opacity-90"
                    />

                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.03) 2px, rgba(0,255,255,0.03) 4px)",
                      }}
                    />

                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-screen"
                      style={{
                        background:
                          "linear-gradient(45deg, rgba(255,0,0,0.1), transparent, rgba(0,255,255,0.1))",
                      }}
                    />

                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-cyan-400 tracking-wider">
                          ID: THABISO_01
                        </span>
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      </div>
                      <div className="mt-1 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-cyan-400 to-purple-400"
                          initial={{ width: "0%" }}
                          animate={{ width: "85%" }}
                          transition={{
                            delay: 2,
                            duration: 1.5,
                            ease: "easeOut",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <motion.div
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <span className="text-xs font-mono text-cyan-400/70 tracking-[0.2em]">
                      NEURAL LINK
                    </span>
                  </motion.div>
                </div>
              </motion.div>

              {/* HOLOGRAM 2: spora.png */}
              <motion.div
                className="hologram-card absolute top-[35%] left-[0%] w-[240px] h-[320px] md:w-[280px] md:h-[370px]"
                style={{ x: holo2X, y: holo2Y }}
              >
                <div className="relative w-full h-full group">
                  <div className="holo-ring absolute -inset-6 border border-purple-500/20 rounded-full pointer-events-none" />
                  <div
                    className="holo-ring absolute -inset-10 border border-pink-500/10 rounded-full pointer-events-none"
                    style={{ animationDelay: "-8s" }}
                  />

                  <div
                    className="relative w-full h-full overflow-hidden rounded-lg border border-purple-500/30 bg-black/50 backdrop-blur-sm"
                    style={{
                      boxShadow:
                        "0 0 20px rgba(255,0,255,0.15), inset 0 0 20px rgba(255,0,255,0.05)",
                    }}
                  >
                    <Image
                      src="/spora.png"
                      alt="Developer Portrait"
                      fill
                      className="object-cover opacity-90"
                    />

                    <div
                      className="absolute inset-0 pointer-events-none opacity-20"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 10V30L20 40L0 30V10L20 0Z' fill='none' stroke='rgba(255,0,255,0.3)' stroke-width='0.5'/%3E%3C/svg%3E")`,
                        backgroundSize: "30px 30px",
                      }}
                    />

                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute h-[2px] bg-cyan-400/40"
                          style={{ top: `${20 + i * 15}%`, left: 0, right: 0 }}
                          animate={{
                            opacity: [0, 0.6, 0],
                            x: ["-100%", "100%"],
                          }}
                          transition={{
                            duration: 2,
                            delay: i * 0.4,
                            repeat: Infinity,
                            repeatDelay: 3,
                          }}
                        />
                      ))}
                    </div>

                    <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-purple-400/60" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-purple-400/60" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-purple-400/60" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-purple-400/60" />

                    <div className="absolute top-4 left-4 right-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-purple-400">
                          SYS.STATUS
                        </span>
                        <span className="text-[9px] font-mono text-green-400">
                          ONLINE
                        </span>
                      </div>
                      <div className="mt-1 font-mono text-[8px] text-purple-300/60 leading-tight">
                        {`> initializing neural_net...`}
                        <br />
                        {`> loading avatar_matrix...`}
                        <br />
                        {`> connection: SECURE`}
                      </div>
                    </div>
                  </div>

                  <motion.div
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                  >
                    <span className="text-xs font-mono text-purple-400/70 tracking-[0.2em]">
                      AVATAR MATRIX
                    </span>
                  </motion.div>
                </div>
              </motion.div>

              {/* CONNECTING LINES */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ zIndex: -1 }}
              >
                <defs>
                  <linearGradient
                    id="lineGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="rgba(0,255,255,0.3)" />
                    <stop offset="100%" stopColor="rgba(255,0,255,0.3)" />
                  </linearGradient>
                </defs>
                <motion.line
                  x1="70%"
                  y1="25%"
                  x2="20%"
                  y2="55%"
                  stroke="url(#lineGrad)"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                  animate={{ strokeDashoffset: [0, -20] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </svg>

              {/* FLOATING MYTHOLOGICAL SYMBOLS */}
              {["⚡", "🔱", "🛡️", "🏹", "⚔️"].map((symbol, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl opacity-20"
                  style={{
                    left: `${15 + i * 18}%`,
                    top: `${10 + (i % 3) * 30}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 360],
                    opacity: [0.1, 0.3, 0.1],
                  }}
                  transition={{
                    duration: 5 + i * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.8,
                  }}
                >
                  {symbol}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ═══ LAYER 8: DATA TICKER ═══ */}
      <div className="absolute bottom-0 left-0 right-0 z-40 overflow-hidden bg-black/60 backdrop-blur-sm border-t border-cyan-500/20">
        <motion.div
          className="flex whitespace-nowrap py-3"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="text-xs font-mono text-cyan-500/40 mx-8 tracking-wider"
            >
              {" "}
              ⚡ ZEUS_PROTOCOL_ACTIVE ⚡ HADES_FIREWALL_ENGAGED ⚡
              ATHENA_AI_ONLINE ⚡ POSEIDON_DB_SYNCED ⚡ HERMES_API_LATENCY_12ms
              ⚡ ARES_LOAD_BALANCER ⚡ ARTEMIS_CDN_GLOBAL ⚡ APOLLO_CACHE_WARM
              ⚡{" "}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ═══ LAYER 9: LOADING OVERLAY ═══ */}
      <motion.div
        className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{ pointerEvents: isLoaded ? "none" : "auto" }}
      >
        <div className="text-center">
          <motion.div
            className="text-4xl font-black font-mono text-cyan-400 mb-4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            INITIALIZING
          </motion.div>
          <div className="w-64 h-1 bg-gray-900 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </div>
          <div className="mt-2 text-xs font-mono text-gray-600">
            {`> loading_the_continental_v9.0...`}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
