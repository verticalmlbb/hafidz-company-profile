"use client";

import { useEffect, useState, useRef } from "react";

const TERMINAL_LINES = [
  { delay: 300,  text: "▶  Menginisialisasi cluster database...",     color: "text-green-400" },
  { delay: 700,  text: "▶  Memuat modul telemetri & monitoring...",   color: "text-green-400" },
  { delay: 1100, text: "▶  Menghubungkan ke node primer...",          color: "text-green-400" },
  { delay: 1500, text: "▶  Gateway autentikasi siap.",                color: "text-crimson"   },
  { delay: 1850, text: "▶  Rendering antarmuka enterprise...",        color: "text-green-400" },
  { delay: 2200, text: "✔  Sistem siap. Selamat datang.",             color: "text-primary"   },
];

/** Animated SVG waveform – same style as Hero telemetry chart */
function TelemetryWave() {
  return (
    <svg
      viewBox="0 0 320 60"
      className="w-full h-14 opacity-60"
      preserveAspectRatio="none"
    >
      {/* Background grid */}
      {[0, 15, 30, 45].map((y) => (
        <line key={y} x1="0" y1={y} x2="320" y2={y}
          stroke="rgba(255,85,69,0.08)" strokeWidth="1" />
      ))}
      {[0, 80, 160, 240, 320].map((x) => (
        <line key={x} x1={x} y1="0" x2={x} y2="60"
          stroke="rgba(255,85,69,0.08)" strokeWidth="1" />
      ))}

      {/* Animated telemetry line */}
      <polyline
        points="0,45 20,38 40,42 60,25 80,35 100,20 120,30 140,15 160,28 180,22 200,35 220,18 240,30 260,25 280,38 300,20 320,32"
        fill="none"
        stroke="url(#waveGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="chart-flow-line"
        style={{ strokeDasharray: 700 }}
      />

      {/* Crimson dot nodes */}
      {[
        [60, 25], [100, 20], [140, 15], [180, 22], [220, 18], [260, 25],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r="3"
          fill="#ff5545"
          className="animate-pulse-node"
          style={{ animationDelay: `${i * 0.3}s` }}
        />
      ))}

      {/* Scan line */}
      <rect
        x="0" y="0"
        width="8" height="60"
        fill="url(#scanGrad)"
        className="animate-radar-scan"
      />

      <defs>
        <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#ff5545" stopOpacity="0.3" />
          <stop offset="50%"  stopColor="#ff5545" stopOpacity="1" />
          <stop offset="100%" stopColor="#bb0102" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="scanGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#ff5545" stopOpacity="0" />
          <stop offset="100%" stopColor="#ff5545" stopOpacity="0.4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Dual spinning rings (loader icon) */
function SpinnerRings() {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      {/* Outer ring */}
      <svg
        className="absolute inset-0 animate-spin-ring"
        viewBox="0 0 96 96"
        fill="none"
      >
        <circle
          cx="48" cy="48" r="44"
          stroke="rgba(255,85,69,0.15)"
          strokeWidth="3"
        />
        <path
          d="M48 4 A44 44 0 0 1 92 48"
          stroke="#ff5545"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M48 92 A44 44 0 0 1 4 48"
          stroke="#bb0102"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />
      </svg>

      {/* Inner ring (counter-spin) */}
      <svg
        className="absolute inset-0 animate-spin-ring-reverse"
        viewBox="0 0 96 96"
        fill="none"
        style={{ inset: "12px", width: "72px", height: "72px" }}
      >
        <circle
          cx="36" cy="36" r="30"
          stroke="rgba(255,85,69,0.08)"
          strokeWidth="2"
        />
        <path
          d="M36 6 A30 30 0 0 1 66 36"
          stroke="#ff5545"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.7"
        />
      </svg>

      {/* Center logo circle */}
      <div className="relative z-10 w-10 h-10 rounded-full bg-secondary-container/30 border border-crimson/40 flex items-center justify-center animate-logo-pulse">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo.jpg"
          alt="Logo"
          className="w-7 h-7 rounded-full object-cover"
        />
      </div>
    </div>
  );
}

/** Floating particle dots */
function Particles() {
  const particles = [
    { x: "10%",  y: "20%", delay: "0s",    dur: "3s",   size: 3 },
    { x: "85%",  y: "15%", delay: "0.5s",  dur: "4s",   size: 2 },
    { x: "70%",  y: "75%", delay: "1s",    dur: "3.5s", size: 3 },
    { x: "20%",  y: "80%", delay: "0.3s",  dur: "4.2s", size: 2 },
    { x: "50%",  y: "10%", delay: "0.8s",  dur: "3.8s", size: 2 },
    { x: "90%",  y: "60%", delay: "1.2s",  dur: "3.2s", size: 3 },
    { x: "5%",   y: "55%", delay: "0.6s",  dur: "4.5s", size: 2 },
    { x: "60%",  y: "88%", delay: "1.5s",  dur: "3.6s", size: 3 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-primary-container"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            animation: `floatParticle ${p.dur} ease-in-out ${p.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

/** Hexagonal dot-grid background */
function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,85,69,0.12) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
      {/* Radial vignette overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, #121315 100%)",
        }}
      />
    </div>
  );
}

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [progress, setProgress] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    // Trigger progress bar fill
    const pTimer = setTimeout(() => setProgress(true), 100);

    // Reveal terminal lines sequentially
    const timers: ReturnType<typeof setTimeout>[] = [pTimer];
    TERMINAL_LINES.forEach((line, idx) => {
      timers.push(
        setTimeout(() => {
          setVisibleLines((prev) => [...prev, idx]);
        }, line.delay)
      );
    });

    // Fade out + call onDone after full duration
    const totalDuration = 2900;
    timers.push(
      setTimeout(() => {
        if (!doneRef.current) {
          doneRef.current = true;
          setFadingOut(true);
          setTimeout(onDone, 700); // wait for fade-out animation
        }
      }, totalDuration)
    );

    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center select-none ${
        fadingOut ? "animate-loading-fade-out" : ""
      }`}
    >
      {/* Dot grid + vignette */}
      <GridBackground />

      {/* Floating particles */}
      <Particles />

      {/* Scanline sweep effect */}
      <div
        className="absolute left-0 w-full h-[2px] pointer-events-none animate-scan-sweep"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,85,69,0.5) 50%, transparent 100%)",
        }}
      />

      {/* === MAIN CONTENT === */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 max-w-md w-full">

        {/* Logo + Spinner */}
        <SpinnerRings />

        {/* Company name */}
        <div className="text-center">
          <h1
            className="text-2xl font-bold tracking-widest uppercase text-on-surface"
            style={{ fontFamily: "var(--font-jakarta), sans-serif", letterSpacing: "0.18em" }}
          >
            Hafidz<span className="text-primary-container">.</span>Company
          </h1>
          <p className="text-xs text-on-surface/40 mt-1 tracking-[0.3em] uppercase">
            Enterprise Database Intelligence
          </p>
        </div>

        {/* Telemetry waveform */}
        <div className="w-full crimson-border-glow rounded-lg p-3 bg-black/20">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
            <span className="text-[10px] text-on-surface/40 uppercase tracking-widest">
              Live Telemetry
            </span>
          </div>
          <TelemetryWave />
        </div>

        {/* Progress bar */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] text-on-surface/40 uppercase tracking-widest">
              Memuat Sistem
            </span>
            <span className="text-[10px] text-primary-container font-mono">
              {progress ? "100%" : "0%"}
            </span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${progress ? "animate-progress-fill" : "w-0"}`}
              style={{
                background: "linear-gradient(90deg, #bb0102, #ff5545, #ff9a8b)",
                boxShadow: "0 0 10px rgba(255,85,69,0.6)",
              }}
            />
          </div>
        </div>

        {/* Terminal boot log */}
        <div
          className="w-full rounded-lg p-4 font-mono text-[11px] leading-relaxed space-y-1 overflow-hidden"
          style={{
            background: "rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,85,69,0.12)",
          }}
        >
          <div className="text-on-surface/30 mb-2 text-[10px] uppercase tracking-widest">
            Boot Log
          </div>
          {TERMINAL_LINES.map((line, idx) => (
            <div
              key={idx}
              className={`${
                visibleLines.includes(idx) ? "animate-terminal-line" : "invisible"
              } ${line.color}`}
              style={{ animationDelay: "0s" }}
            >
              {line.text}
              {idx === visibleLines[visibleLines.length - 1] &&
                idx < TERMINAL_LINES.length - 1 && (
                  <span className="ml-1 blinking-cursor">▌</span>
                )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom horizon line */}
      <div
        className="absolute bottom-0 left-0 w-full h-[2px] horizon-line opacity-40"
      />
    </div>
  );
}

