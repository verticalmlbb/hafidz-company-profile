"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Konfirmasi password tidak cocok.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password minimal 6 karakter.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Pendaftaran gagal. Silakan coba kembali.");
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setErrorMsg("Koneksi gagal. Silakan coba sesaat lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12 relative overflow-hidden">
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
            Daftar Akun Baru
          </h1>
          <p className="text-xs text-on-surface-variant">
            Buat akun untuk memantau status pesanan dan layanan {siteConfig.shortName}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded bg-error-container/20 border border-error/40 text-error text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-base" aria-hidden="true">
              error
            </span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1.5">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Raden Surya Pratama"
              className="w-full bg-surface-container-low border border-outline-variant/40 rounded px-3.5 py-2.5 text-on-surface placeholder:text-outline-variant/60 focus:outline-none focus:border-primary text-sm transition-colors"
            />
          </div>

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
            <label className="block text-xs font-medium text-on-surface-variant mb-1.5">
              Password (Min. 6 Karakter)
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-surface-container-low border border-outline-variant/40 rounded px-3.5 py-2.5 text-on-surface placeholder:text-outline-variant/60 focus:outline-none focus:border-primary text-sm transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1.5">
              Konfirmasi Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                  person_add
                </span>
                <span>Buat Akun</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-on-surface-variant space-y-2">
          <div>
            Sudah memiliki akun?{" "}
            <Link href="/login" className="text-primary hover:underline font-semibold">
              Masuk di sini
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

