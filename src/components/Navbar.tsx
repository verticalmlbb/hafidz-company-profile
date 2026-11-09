"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      } catch {
        // Not logged in
      }
    }
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.reload();
  };

  return (
    <header className="bg-surface/80 backdrop-blur-md top-0 sticky z-50 border-b border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between w-full">
        {/* Brand Logo Left */}
        <Link href="#hero" className="flex items-center gap-3 group">
          <div className="h-9 px-2 bg-white rounded flex items-center justify-center overflow-hidden transition-transform duration-200 group-hover:scale-105 shadow-sm">
            <Image
              src={siteConfig.logo}
              alt={`${siteConfig.name} Logo`}
              width={140}
              height={36}
              className="h-6 w-auto object-contain"
              priority
            />
          </div>
          <span className="text-headline-sm font-display font-bold tracking-tight text-on-surface">
            {siteConfig.shortName}
          </span>
        </Link>

        {/* Center Nav Links (Desktop) */}
        <nav
          aria-label="Navigasi Utama"
          className="hidden md:flex items-center gap-8"
        >
          {siteConfig.navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-on-surface-variant font-medium hover:text-primary transition-colors pb-1 text-label-md font-label-md"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Trailing Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              {user.role === "admin" ? (
                <Link
                  href="/dashboard"
                  className="px-3 py-1.5 rounded bg-surface-container border border-primary/40 text-primary hover:bg-primary-container hover:text-on-primary-container transition-colors text-xs font-semibold flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">dashboard</span>
                  <span>Dashboard Admin</span>
                </Link>
              ) : (
                <span className="text-xs text-on-surface-variant font-medium px-2">
                  Halo, {user.name}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="text-on-surface-variant hover:text-error transition-colors text-xs font-medium px-2 py-1"
              >
                Keluar
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-on-surface hover:text-primary transition-colors duration-150 text-label-md font-label-md font-medium px-3 py-2 active:scale-95"
            >
              Login
            </Link>
          )}

          <Link
            href="#contact"
            className="bg-primary-container text-on-primary-container font-semibold hover:bg-secondary-container hover:text-white transition-all duration-200 active:scale-95 text-label-md font-label-md px-4 py-2 rounded shadow-lg shadow-secondary-container/20 flex items-center gap-1.5 border border-primary/20"
          >
            <span
              className="material-symbols-outlined text-sm"
              aria-hidden="true"
            >
              support_agent
            </span>
            <span>Konsultasi Gratis</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded text-on-surface hover:text-primary hover:bg-surface-container-high transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu navigasi"}
          aria-expanded={mobileMenuOpen}
        >
          <span className="material-symbols-outlined text-2xl" aria-hidden="true">
            {mobileMenuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-outline-variant/30 bg-surface-container-low px-6 py-4 space-y-3">
          <nav aria-label="Navigasi Mobile" className="flex flex-col space-y-2">
            {siteConfig.navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-on-surface-variant hover:text-primary py-2 text-base font-medium transition-colors border-b border-outline-variant/20 last:border-b-0"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="pt-2 flex flex-col gap-2">
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2.5 rounded bg-surface-container border border-primary/40 text-primary font-semibold text-sm"
                  >
                    Buka Dashboard Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="text-center py-2 rounded text-error text-sm font-medium"
                >
                  Keluar dari Akun
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 rounded border border-outline-variant/40 text-on-surface font-medium hover:border-primary transition-colors text-sm"
              >
                Login Akun
              </Link>
            )}
            <Link
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2.5 rounded bg-primary-container text-on-primary-container font-semibold hover:bg-secondary-container hover:text-white transition-colors text-sm shadow flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm" aria-hidden="true">
                support_agent
              </span>
              <span>Konsultasi Gratis</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
