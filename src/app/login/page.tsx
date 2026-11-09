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
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12 relative overflow-hidden">
      {/* Background ambient crimson */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-secondary-container/20 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-md p-8 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-2xl space-y-6 relative crimson-glow">
        <div className="h-1 w-full horizon-line absolute top-0 left-0 rounded-t-xl" />

        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center justify-center h-10 px-3 bg-white rounded shadow-sm group">
            <Image
              src={siteConfig.logo}
              alt={siteConfig.name}
              width={140}
              height={32}
              className="h-6 w-auto object-contain"
            />
          </Link>
          <h1 className="text-2xl font-display font-bold text-on-surface tracking-tight">
            Masuk ke Portal
          </h1>
          <p className="text-xs text-on-surface-variant">
            Akses dashboard administrasi dan layanan analitik {siteConfig.shortName}
          </p>
        </div>

        {/* Quick Admin Helper Badge */}
        <div className="p-3 rounded bg-surface-container border border-outline-variant/30 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-on-surface font-medium">
            <span className="flex items-center gap-1 text-primary">
              <span className="material-symbols-outlined text-sm" aria-hidden="true">
                key
              </span>
              <span>Kredensial Admin Awal</span>
            </span>
            <button
              type="button"
              onClick={fillAdminCredentials}
              className="text-[11px] text-primary hover:underline font-semibold"
            >
              Isi Otomatis
            </button>
          </div>
          <div className="font-mono text-[11px] text-on-surface-variant flex justify-between">
            <span>Email: admin@gmail.com</span>
            <span>Password: 123456</span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded bg-error-container/20 border border-error/40 text-error text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-base" aria-hidden="true">
              error
            </span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@perusahaan.co.id"
              className="w-full bg-surface-container-low border border-outline-variant/40 rounded px-3.5 py-2.5 text-on-surface placeholder:text-outline-variant/60 focus:outline-none focus:border-primary text-sm transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-on-surface-variant">
                Password
              </label>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-surface-container-low border border-outline-variant/40 rounded px-3.5 py-2.5 text-on-surface placeholder:text-outline-variant/60 focus:outline-none focus:border-primary text-sm transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded bg-primary-container text-on-primary-container font-semibold hover:bg-secondary-container hover:text-white transition-all duration-200 active:scale-95 shadow-lg shadow-primary-container/20 flex items-center justify-center gap-2 border border-primary/20 text-sm disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="material-symbols-outlined text-base" aria-hidden="true">
                  login
                </span>
                <span>Masuk Sekarang</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-on-surface-variant space-y-2">
          <div>
            Belum punya akun?{" "}
            <Link href="/register" className="text-primary hover:underline font-semibold">
              Daftar akun baru
            </Link>
          </div>
          <div>
            <Link href="/" className="text-on-surface-variant/70 hover:text-on-surface transition-colors">
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
