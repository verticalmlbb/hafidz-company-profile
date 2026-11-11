"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Gagal masuk. Periksa kembali email dan password.");
        setLoading(false);
        return;
      }

      if (data.user.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
      router.refresh();
    } catch {
      setErrorMsg("Koneksi gagal. Silakan coba kembali sesaat lagi.");
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setEmail("admin@gmail.com");
    setPassword("123456");
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col justify-between relative overflow-hidden font-sans selection:bg-secondary-container selection:text-white">
      {/* Ambient Crimson Glow Gradients */}
      <div className="absolute -top-40 -left-40 w-[650px] h-[650px] bg-secondary-container/15 blur-[160px] rounded-full pointer-events-none -z-10" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-primary-container/10 blur-[160px] rounded-full pointer-events-none -z-10" />

      {/* Top Simple Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-20">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-9 px-2.5 bg-white rounded flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-105">
            <Image
              src={siteConfig.logo}
              alt={`${siteConfig.name} Logo`}
              width={130}
              height={32}
              className="h-6 w-auto object-contain"
              priority
            />
          </div>
          <span className="text-lg font-display font-bold tracking-tight text-on-surface">
            {siteConfig.shortName}
          </span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors py-1.5 px-3 rounded-full bg-surface-container border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-sm" aria-hidden="true">
            arrow_back
          </span>
          <span>Kembali ke Beranda</span>
        </Link>
      </header>

      {/* Main Split Content */}
      <main className="w-full max-w-7xl mx-auto px-6 py-6 lg:py-12 flex-grow flex items-center z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
          
          {/* Left Column: Enterprise Security & Telemetry Showcase */}
          <div className="hidden lg:flex lg:col-span-7 flex-col space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/40 shadow-sm w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-mono text-[11px] text-primary uppercase tracking-wider font-semibold">
                  GATEWAY NODE ONLINE • PROTOCOL TLS 1.3 ACTIVE
                </span>
              </div>

              <h1 className="font-display text-4xl xl:text-5xl font-extrabold text-on-surface tracking-tight leading-[1.15]">
                Akses Konsol Presisi{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">
                  Arsitektur Basis Data
                </span>
              </h1>

              <p className="text-base text-on-surface-variant max-w-xl leading-relaxed">
                Masuk ke konsol enterprise Hafidz Company untuk memonitor throughput cluster, menganalisis profil latensi kueri realtime, dan mengelola keamanan database korporat.
              </p>
            </div>

            {/* Futuristic Terminal Status Card */}
            <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/30 p-5 shadow-2xl relative crimson-glow overflow-hidden">
              <div className="h-1 w-full horizon-line absolute top-0 left-0" />
              
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-3 text-xs font-mono text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary-container inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-surface-bright inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-surface-bright inline-block" />
                  <span className="ml-1 text-on-surface font-semibold">auth.hafidz-telemetry.net</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  <span>ENCRYPTED (256-BIT)</span>
                </div>
              </div>

              <div className="space-y-1.5 font-mono text-xs text-on-surface-variant/90 leading-relaxed">
                <p className="text-primary flex items-center gap-1.5">
                  <span className="text-primary-container">&gt;</span>
                  <span>CONNECT auth-cluster-id-01.jakarta.internal:5432</span>
                </p>
                <p className="text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-xs text-emerald-400">check_circle</span>
                  <span>Mutual TLS Handshake Succeeded (Session TTL: 7 Days)</span>
                </p>
                <p className="text-on-surface-variant/80 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-xs text-primary">verified_user</span>
                  <span>RBAC Security Engine: Admin &amp; User Access Partitioning Ready</span>
                </p>
              </div>

              {/* 3 Telemetry Metrics */}
              <div className="mt-4 pt-4 border-t border-outline-variant/20 grid grid-cols-3 gap-3 text-center">
                <div className="p-2 rounded bg-surface-container/60 border border-outline-variant/20">
                  <div className="text-[10px] text-on-surface-variant uppercase font-medium">Latency P99</div>
                  <div className="text-sm font-bold text-primary font-mono mt-0.5">&lt; 0.42 ms</div>
                </div>
                <div className="p-2 rounded bg-surface-container/60 border border-outline-variant/20">
                  <div className="text-[10px] text-on-surface-variant uppercase font-medium">SLA Uptime</div>
                  <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">99.999%</div>
                </div>
                <div className="p-2 rounded bg-surface-container/60 border border-outline-variant/20">
                  <div className="text-[10px] text-on-surface-variant uppercase font-medium">Compliance</div>
                  <div className="text-sm font-bold text-on-surface font-mono mt-0.5">ISO 27001</div>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-4 text-xs text-on-surface-variant/80">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-primary">security</span>
                <span>Enkripsi Password Bcrypt</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-primary">cookie</span>
                <span>Sesi Terisolasi HTTP-Only</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-primary">database</span>
                <span>Google Sheets Sync</span>
              </span>
            </div>
          </div>

          {/* Right Column: Modern High-Tech Authentication Card */}
          <div className="w-full lg:col-span-5 max-w-md mx-auto">
            <div className="rounded-2xl bg-surface-container-lowest/90 backdrop-blur-xl border border-outline-variant/40 p-6 sm:p-8 shadow-2xl relative crimson-border-glow">
              <div className="h-1 w-full horizon-line absolute top-0 left-0 rounded-t-2xl" />

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-primary-container/20 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg" aria-hidden="true">
                      shield_person
                    </span>
                  </div>
                  <h2 className="text-xl font-display font-bold text-on-surface">
                    Portal Autentikasi
                  </h2>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Silakan masukkan akun Anda untuk mengakses dashboard manajemen database.
                </p>
              </div>

              {/* Smart Keycard: Default Admin Credential Box */}
              <div className="mb-6 p-3.5 rounded-xl bg-surface-container border border-primary/30 relative overflow-hidden group">
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-1.5 text-primary font-semibold">
                    <span className="material-symbols-outlined text-base" aria-hidden="true">
                      vpn_key
                    </span>
                    <span>Kredensial Default Admin</span>
                  </div>
                  <button
                    type="button"
                    onClick={fillAdminCredentials}
                    className="text-[11px] px-2.5 py-1 rounded bg-primary-container text-on-primary-container font-semibold hover:bg-secondary-container hover:text-white transition-all shadow-sm active:scale-95"
                  >
                    Isi Otomatis
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-on-surface-variant bg-surface-container-lowest/70 p-2 rounded border border-outline-variant/20">
                  <div>
                    <span className="text-[10px] text-on-surface-variant/60 block">Email:</span>
                    <strong className="text-on-surface">admin@gmail.com</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-on-surface-variant/60 block">Password:</span>
                    <strong className="text-on-surface">123456</strong>
                  </div>
                </div>
              </div>

              {/* Error Message Banner */}
              {errorMsg && (
                <div className="mb-5 p-3 rounded-lg bg-error-container/20 border border-error/50 text-error text-xs flex items-center gap-2.5 animate-shake">
                  <span className="material-symbols-outlined text-lg shrink-0" aria-hidden="true">
                    error
                  </span>
                  <span className="leading-snug">{errorMsg}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-on-surface mb-1.5">
                    Alamat Email Perusahaan
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-3 text-on-surface-variant/60 text-lg pointer-events-none" aria-hidden="true">
                      mail
                    </span>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@perusahaan.co.id"
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg pl-10 pr-3.5 py-2.5 text-on-surface placeholder:text-outline-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="password" className="block text-xs font-semibold text-on-surface">
                      Kata Sandi (Password)
                    </label>
                    <span className="text-[11px] text-on-surface-variant/70">Minimal 6 karakter</span>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-3 text-on-surface-variant/60 text-lg pointer-events-none" aria-hidden="true">
                      lock
                    </span>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg pl-10 pr-10 py-2.5 text-on-surface placeholder:text-outline-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-on-surface-variant/70 hover:text-on-surface transition-colors p-0.5"
                      aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    >
                      <span className="material-symbols-outlined text-lg" aria-hidden="true">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-on-surface-variant select-none">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded bg-surface-container-low border-outline-variant/40 text-primary focus:ring-primary accent-primary"
                    />
                    <span>Ingat sesi saya (7 hari)</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg bg-primary-container text-on-primary-container font-semibold hover:bg-secondary-container hover:text-white transition-all duration-200 active:scale-95 shadow-lg shadow-primary-container/20 flex items-center justify-center gap-2 border border-primary/20 text-sm disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Memverifikasi Otoritas...</span>
                    </div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg" aria-hidden="true">
                        login
                      </span>
                      <span>Masuk ke Konsol</span>
                    </>
                  )}
                </button>
              </form>

              {/* Registration Link */}
              <div className="mt-6 pt-5 border-t border-outline-variant/20 text-center space-y-2 text-xs">
                <p className="text-on-surface-variant">
                  Belum memiliki akun terdaftar?{" "}
                  <Link href="/register" className="text-primary hover:underline font-bold">
                    Daftar Akun Baru
                  </Link>
                </p>
                <p className="text-[11px] text-on-surface-variant/60 font-mono">
                  Sistem Terproteksi • Hafidz Company ID Auth v4.8
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-[11px] text-on-surface-variant/60 border-t border-outline-variant/15 z-10">
        © {new Date().getFullYear()} PT Hafidz Company Indonesia. Enterprise Database Performance &amp; Intelligence Architecture.
      </footer>
    </div>
  );
}
