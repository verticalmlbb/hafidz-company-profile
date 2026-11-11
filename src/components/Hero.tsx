"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Hero() {
  const [latency, setLatency] = useState("0.42");
  const [p99, setP99] = useState("1.82");
  const [tps, setTps] = useState(42850);
  const [timeStr, setTimeStr] = useState("14:02:18");

  useEffect(() => {
    const updateMetrics = () => {
      const baseLat = 0.4;
      const jitterLat = Math.random() * 0.08 - 0.04;
      setLatency((baseLat + jitterLat).toFixed(2));

      const p99Base = 1.82;
      const p99Jitter = Math.random() * 0.06 - 0.03;
      setP99((p99Base + p99Jitter).toFixed(2));

      const baseTps = 42850;
      const tpsJitter = Math.floor(Math.random() * 260 - 130);
      setTps(baseTps + tpsJitter);

      const now = new Date();
      setTimeStr(now.toTimeString().split(" ")[0]);
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden border-b border-outline-variant/20"
    >
      {/* Ambient Crimson Backlights */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-secondary-container/20 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-48 w-[400px] h-[400px] bg-primary-container/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Top Telemetry Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-container-high border border-outline-variant/40 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="font-mono text-xs text-primary uppercase tracking-wider font-medium">
              Enterprise Engine v4.8 • Real-time Optimizer Active
            </span>
          </div>
        </div>

        {/* Main Headlines */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[56px] text-on-surface font-extrabold tracking-tight leading-tight">
            Analisis &amp; Optimasi Kinerja Database Enterprise Anda{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">
              Tanpa Hambatan
            </span>
          </h1>

          <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
            Tingkatkan kecepatan kueri hingga 10x lipat, deteksi bottleneck latensi secara instan, dan amankan reliabilitas basis data berskala tinggi dengan teknologi analitik presisi Hafidz Company.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/booking"
              className="w-full sm:w-auto px-7 py-3.5 rounded bg-primary-container text-on-primary-container font-semibold hover:bg-secondary-container hover:text-white transition-all duration-200 active:scale-95 shadow-lg shadow-primary-container/30 flex items-center justify-center gap-2 border-t border-white/20"
            >
              <span className="material-symbols-outlined text-lg" aria-hidden="true">
                calendar_month
              </span>
              <span>Booking Konsultasi &amp; Audit</span>
            </Link>
            <Link
              href="#services"
              className="w-full sm:w-auto px-7 py-3.5 rounded bg-surface-container-high border border-outline-variant/50 text-on-surface font-medium hover:border-primary transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 hover:bg-surface-container-highest"
            >
              <span className="material-symbols-outlined text-lg" aria-hidden="true">
                play_circle
              </span>
              <span>Pelajari Layanan Lengkap</span>
            </Link>
          </div>

          {/* Feature Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-sm text-primary" aria-hidden="true">
                verified
              </span>
              <span>99.99% Uptime Guarantee</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-sm text-primary" aria-hidden="true">
                speed
              </span>
              <span>10x Faster Query Execution</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-sm text-primary" aria-hidden="true">
                database
              </span>
              <span>Mendukung PostgreSQL, MySQL, Oracle, MongoDB</span>
            </span>
          </div>
        </div>

        {/* Database Analyzer Dashboard Mockup */}
        <div className="mt-14 max-w-5xl mx-auto rounded-xl bg-surface-container-lowest border border-outline-variant/30 p-2 sm:p-4 crimson-glow relative shadow-2xl transition-all duration-300 hover:border-primary/40">
          <div className="h-1 w-full horizon-line absolute top-0 left-0 rounded-t-xl" />

          {/* Mockup Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-outline-variant/20 mb-4 bg-surface-container/60 rounded">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-secondary-container inline-block shadow-sm shadow-secondary-container" />
              <span className="w-3 h-3 rounded-full bg-surface-bright inline-block" />
              <span className="w-3 h-3 rounded-full bg-surface-bright inline-block" />
              <span className="ml-2 font-mono text-xs text-on-surface-variant hidden sm:inline flex items-center gap-1.5">
                <span className="text-primary">⚡</span> cluster-node-prod-01.hafidz-telemetry.net
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2.5 py-0.5 rounded bg-secondary-container/20 text-primary text-xs font-semibold border border-secondary-container/40">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <span className="tracking-wide">STREAMING IOPS</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-on-surface-variant">
                <span className="hidden md:inline">Latency:</span>
                <span className="text-primary font-bold">{latency}ms</span>
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Telemetry Sync Healthy" />
              </div>
            </div>
          </div>

          {/* Interactive Live Waveform & Telemetry Spline Chart */}
          <div className="mb-4 mx-2 p-3 sm:p-4 rounded-lg bg-surface-container-low/90 border border-outline-variant/30 relative overflow-hidden group">
            {/* Radar Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
              <div className="w-24 h-full bg-gradient-to-r from-transparent via-primary-container to-transparent animate-radar-scan blur-sm" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-2 border-b border-outline-variant/20 relative z-10">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-primary-container/20 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-base" aria-hidden="true">
                    show_chart
                  </span>
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-on-surface flex items-center gap-2">
                    Real-time Latency &amp; Workload Spline Waveform
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/30">
                      Live 100Hz
                    </span>
                  </h4>
                  <p className="text-xs text-on-surface-variant">
                    Monitoring P99 query latency (ms) vs NVMe buffer throughput synchronization
                  </p>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-primary inline-block rounded" />
                  <span className="text-on-surface">
                    P99 Latency (<span className="text-primary font-semibold">{p99}ms</span>)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-tertiary-container inline-block rounded" />
                  <span className="text-on-surface-variant">
                    Throughput (<span className="text-primary-container font-semibold">{(tps / 1000).toFixed(1)}k tps</span>)
                  </span>
                </div>
              </div>
            </div>

            {/* SVG Spline Chart */}
            <div className="relative w-full h-36 sm:h-44">
              <div className="absolute inset-0 grid grid-rows-3 grid-cols-6 border-b border-l border-outline-variant/20 pointer-events-none opacity-40">
                {Array.from({ length: 18 }).map((_, idx) => (
                  <div key={idx} className="border-r border-t border-outline-variant/15" />
                ))}
              </div>

              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 160">
                <defs>
                  <linearGradient id="crimsonAreaGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#ff5545" stopOpacity="0.38" />
                    <stop offset="60%" stopColor="#bb0102" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#121315" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="amberWaveGrad" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#ff5545" />
                    <stop offset="50%" stopColor="#ffb4a9" />
                    <stop offset="100%" stopColor="#f85c48" />
                  </linearGradient>
                  <filter id="crimsonGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Area Under Curve */}
                <path
                  d="M 0,160 L 0,110 Q 55,95 110,120 T 220,70 T 330,95 T 440,40 T 550,75 T 660,35 T 750,45 L 800,28 L 800,160 Z"
                  fill="url(#crimsonAreaGrad)"
                />

                {/* Secondary Buffer Dash */}
                <path
                  d="M 0,135 Q 70,125 140,110 T 280,125 T 420,85 T 560,95 T 700,60 L 800,50"
                  fill="none"
                  opacity="0.55"
                  stroke="#f85c48"
                  strokeDasharray="4 3"
                  strokeWidth="1.5"
                />

                {/* Primary Spline Line */}
                <path
                  className="chart-flow-line"
                  d="M 0,110 Q 55,95 110,120 T 220,70 T 330,95 T 440,40 T 550,75 T 660,35 T 750,45 L 800,28"
                  fill="none"
                  filter="url(#crimsonGlowFilter)"
                  stroke="url(#amberWaveGrad)"
                  strokeWidth="2.5"
                />

                {/* Pulsating Nodes */}
                <g>
                  <circle cx="110" cy="120" r="3.5" fill="#ffb4a9" stroke="#bb0102" strokeWidth="2" />
                  <circle cx="220" cy="70" r="3.5" fill="#ffb4a9" stroke="#bb0102" strokeWidth="2" />
                  <circle cx="330" cy="95" r="3.5" fill="#ffb4a9" stroke="#bb0102" strokeWidth="2" />
                  <circle cx="440" cy="40" r="4.5" fill="#ffffff" stroke="#ff5545" strokeWidth="2" className="animate-pulse-node" />
                  <circle cx="550" cy="75" r="3.5" fill="#ffb4a9" stroke="#bb0102" strokeWidth="2" />
                  <circle cx="660" cy="35" r="3.5" fill="#ffb4a9" stroke="#bb0102" strokeWidth="2" />
                  <circle cx="800" cy="28" r="5" fill="#ff5545" stroke="#ffffff" strokeWidth="2" className="animate-ping" />
                  <circle cx="800" cy="28" r="4" fill="#ffffff" stroke="#ff5545" strokeWidth="2" />
                </g>
              </svg>

              {/* Floating Tooltip */}
              <div className="absolute right-4 top-2 px-2.5 py-1.5 rounded bg-surface-container-highest/90 border border-primary/40 text-on-surface font-mono text-xs shadow-lg backdrop-blur-sm pointer-events-none hidden sm:flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span>
                  Live Node: <strong className="text-primary">{timeStr}</strong>
                </span>
                <span className="text-outline-variant">|</span>
                <span>
                  Delta: <strong className="text-emerald-400">-0.14ms</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Mockup Telemetry Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-2">
            {/* Metric 1 */}
            <div className="bg-surface-container-low p-4 rounded border border-outline-variant/20 hover:border-primary/60 transition-all duration-300 group hover:-translate-y-0.5 relative overflow-hidden">
              <div className="h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-300 absolute top-0 left-0" />
              <div className="flex items-center justify-between text-xs text-on-surface-variant uppercase font-medium">
                <span className="group-hover:text-primary transition-colors">Avg Query Latency</span>
                <span className="material-symbols-outlined text-sm text-primary group-hover:rotate-12 transition-transform" aria-hidden="true">
                  timer
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-on-surface flex items-baseline gap-1">
                <span>{p99}</span> <span className="text-xs font-normal text-on-surface-variant">ms</span>
              </div>
              <div className="mt-1 font-mono text-xs text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-xs" aria-hidden="true">
                  trending_down
                </span>
                <span>-84.6% vs un-indexed</span>
              </div>
              <div className="mt-2 pt-2 border-t border-outline-variant/15 flex items-center justify-between text-[11px] text-on-surface-variant/70 font-mono">
                <span>Target: &lt; 2.0ms</span>
                <span className="text-emerald-400 font-semibold">PASS (99.9%)</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-surface-container-low p-4 rounded border border-outline-variant/20 hover:border-primary/60 transition-all duration-300 group hover:-translate-y-0.5 relative overflow-hidden">
              <div className="h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-300 absolute top-0 left-0" />
              <div className="flex items-center justify-between text-xs text-on-surface-variant uppercase font-medium">
                <span className="group-hover:text-primary transition-colors">Active Transactions</span>
                <span className="material-symbols-outlined text-sm text-primary group-hover:scale-110 transition-transform" aria-hidden="true">
                  sync_alt
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-on-surface flex items-baseline gap-1">
                <span>{tps.toLocaleString()}</span> <span className="text-xs font-normal text-on-surface-variant">tps</span>
              </div>
              <div className="mt-1 font-mono text-xs text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-xs" aria-hidden="true">
                  trending_up
                </span>
                <span>+320% buffer throughput</span>
              </div>
              <div className="mt-2 pt-2 border-t border-outline-variant/15 flex items-center justify-between text-[11px] text-on-surface-variant/70 font-mono">
                <span>Concurrency: Auto-scale</span>
                <span className="text-primary font-semibold">48 Workers</span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-surface-container-low p-4 rounded border border-outline-variant/20 hover:border-primary/60 transition-all duration-300 group hover:-translate-y-0.5 relative overflow-hidden">
              <div className="h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-300 absolute top-0 left-0" />
              <div className="flex items-center justify-between text-xs text-on-surface-variant uppercase font-medium">
                <span className="group-hover:text-primary transition-colors">Deadlock Contention</span>
                <span className="material-symbols-outlined text-sm text-primary group-hover:scale-110 transition-transform" aria-hidden="true">
                  security
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-on-surface">
                0.00% <span className="text-xs font-normal text-on-surface-variant">clean</span>
              </div>
              <div className="mt-1 font-mono text-xs text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-primary" aria-hidden="true">
                  check_circle
                </span>
                <span>Zero lock stalls</span>
              </div>
              <div className="mt-2 pt-2 border-t border-outline-variant/15 flex items-center justify-between text-[11px] text-on-surface-variant/70 font-mono">
                <span>Lock queue: 0 ops</span>
                <span className="text-emerald-400 font-semibold">SECURE</span>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="bg-surface-container-low p-4 rounded border border-outline-variant/20 hover:border-primary/60 transition-all duration-300 group hover:-translate-y-0.5 relative overflow-hidden">
              <div className="h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-300 absolute top-0 left-0" />
              <div className="flex items-center justify-between text-xs text-on-surface-variant uppercase font-medium">
                <span className="group-hover:text-primary transition-colors">Storage Buffer Hit</span>
                <span className="material-symbols-outlined text-sm text-primary group-hover:rotate-45 transition-transform" aria-hidden="true">
                  memory
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-on-surface">
                99.8% <span className="text-xs font-normal text-on-surface-variant">cache</span>
              </div>
              <div className="mt-1 font-mono text-xs text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-xs" aria-hidden="true">
                  flash_on
                </span>
                <span>NVMe optimization</span>
              </div>
              <div className="mt-2 pt-2 border-t border-outline-variant/15 flex items-center justify-between text-[11px] text-on-surface-variant/70 font-mono">
                <span>Dirty pages: 0.12%</span>
                <span className="text-primary font-semibold">FLUSHED</span>
              </div>
            </div>
          </div>

          {/* Terminal Query Simulation */}
          <div className="mt-4 p-4 bg-surface-container-low rounded border border-outline-variant/20 mx-2 relative overflow-hidden group">
            <div className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-progress" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-outline-variant/20">
              <div className="font-mono text-xs text-on-surface font-semibold flex items-center gap-1.5 flex-wrap">
                <span className="material-symbols-outlined text-primary text-sm animate-pulse" aria-hidden="true">
                  terminal
                </span>
                <span className="text-primary-container">&gt;</span>
                <span>EXPLAIN ANALYZE SELECT * FROM orders WHERE tenant_id = &apos;id_9281&apos; AND created_at &gt;= NOW() - INTERVAL &apos;7 DAYS&apos;</span>
                <span className="inline-block w-2 h-4 bg-primary blinking-cursor align-middle ml-1" />
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> EXECUTING
                </span>
                <span className="text-xs font-mono text-primary px-2 py-0.5 rounded bg-primary-container/20 border border-primary/30">
                  Cost: 12.04 (Optimized)
                </span>
              </div>
            </div>

            <div className="my-2.5 py-1 px-2 rounded bg-surface-container-lowest/80 border border-outline-variant/20 flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
              <div className="flex items-center gap-2">
                <span className="text-primary font-semibold">ANALYZER PHASE:</span>
                <span className="text-on-surface">Hash Index Scan [100%] &gt; Buffer Shared Memory [100%] &gt; Result Emitted</span>
              </div>
              <span className="text-primary hidden sm:inline">Execution Time: 0.184 ms</span>
            </div>

            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="flex items-center justify-between text-xs bg-surface p-2 rounded border border-transparent hover:border-primary/30 transition-all">
                <span className="text-on-surface-variant">Index Scan:</span>
                <span className="font-mono text-on-surface font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-primary" aria-hidden="true">
                    check
                  </span>
                  idx_orders_tenant_created
                </span>
              </div>
              <div className="flex items-center justify-between text-xs bg-surface p-2 rounded border border-transparent hover:border-primary/30 transition-all">
                <span className="text-on-surface-variant">Heap Buffer Shared:</span>
                <span className="font-mono text-primary font-medium">Hit=14, Read=0 (100% Mem)</span>
              </div>
              <div className="flex items-center justify-between text-xs bg-surface p-2 rounded border border-transparent hover:border-primary/30 transition-all">
                <span className="text-on-surface-variant">Replica Lag:</span>
                <span className="font-mono text-on-surface font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  &lt; 1.2 ms (Synchronous)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

