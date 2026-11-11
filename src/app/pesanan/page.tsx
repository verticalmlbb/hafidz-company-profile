"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";

interface OrderItem {
  id: string;
  client_name: string;
  company_name: string;
  service_type: string;
  db_type: string;
  booking_date: string;
  amount: number;
  status: "menunggu_konfirmasi" | "dikonfirmasi" | "ditolak" | string;
  created_at: string;
}

export default function UserOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const meRes = await fetch("/api/auth/me");
        const meData = await meRes.json();
        if (!meData.authenticated || !meData.user) {
          router.push(`/login?redirect=${encodeURIComponent("/pesanan")}`);
          return;
        }
        setUser(meData.user);

        const ordersRes = await fetch("/api/orders");
        const ordersData = await ordersRes.json();
        if (ordersData.success && Array.isArray(ordersData.orders)) {
          setOrders(ordersData.orders);
        }
      } catch (err) {
        console.error("Gagal memuat pesanan:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-sans selection:bg-secondary-container selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-outline-variant/30 bg-surface/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-8 px-2 bg-white rounded flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
              <Image
                src={siteConfig.logo}
                alt={siteConfig.name}
                width={120}
                height={32}
                className="h-5 w-auto object-contain"
              />
            </div>
            <span className="font-display font-bold tracking-tight text-on-surface text-sm sm:text-base">
              {siteConfig.shortName}
            </span>
          </Link>

          <div className="flex items-center gap-4 text-xs font-medium">
            <Link
              href="/"
              className="text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">home</span>
              <span>Beranda</span>
            </Link>
            <Link
              href="/booking"
              className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container font-semibold hover:bg-secondary-container hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              <span>Konsultasi Baru</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-secondary-container/20 border border-primary/30 text-primary text-xs font-mono uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Portal Klien
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-on-surface">
              Pesanan & Tiket Konsultasi Anda
            </h1>
            <p className="text-xs text-on-surface-variant mt-1">
              Daftar seluruh tiket permintaan audit, tuning, dan konsultasi arsitektur database Anda.
            </p>
          </div>

          <Link
            href="/booking"
            className="px-4 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-semibold hover:bg-secondary-container hover:text-white transition-all text-xs flex items-center gap-1.5 shrink-0 shadow-lg shadow-secondary-container/20"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>Buat Tiket Konsultasi Baru</span>
          </Link>
        </div>

        {/* Content State */}
        {loading ? (
          <div className="p-12 text-center text-xs text-on-surface-variant flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>Memuat tiket pesanan Anda...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-surface border border-outline-variant/40 flex items-center justify-center mx-auto text-primary">
              <span className="material-symbols-outlined text-3xl">receipt_long</span>
            </div>
            <h3 className="text-base font-bold text-on-surface">
              Belum Ada Tiket Pesanan
            </h3>
            <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
              Anda belum pernah memesan sesi konsultasi database. Jadwalkan audit performa pertama Anda dan nikmati optimasi query tingkat enterprise.
            </p>
            <div className="pt-2">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-semibold text-xs hover:bg-secondary-container hover:text-white transition-colors"
              >
                <span>Pesan Jadwal Konsultasi Sekarang</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => {
              const isPending = ord.status === "menunggu_konfirmasi";
              const isConfirmed = ord.status === "dikonfirmasi";
              const isRejected = ord.status === "ditolak";

              return (
                <div
                  key={ord.id}
                  className="bg-surface-container-low border border-outline-variant/30 hover:border-primary/40 rounded-2xl p-6 transition-all duration-200 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/20">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded bg-surface border border-outline-variant/30 text-xs font-mono font-bold text-primary">
                        {ord.id}
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        {new Date(ord.created_at).toLocaleDateString("id-ID", {
                          dateStyle: "medium",
                        })}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {isPending && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-semibold text-xs">
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                          Menunggu Konfirmasi
                        </span>
                      )}
                      {isConfirmed && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-semibold text-xs">
                          <span className="material-symbols-outlined text-sm">check_circle</span>
                          Dikonfirmasi
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container/20 border border-error/40 text-error font-semibold text-xs">
                          <span className="material-symbols-outlined text-sm">cancel</span>
                          Ditolak
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    <div className="sm:col-span-8 space-y-1">
                      <h3 className="text-base font-bold text-on-surface">
                        {ord.service_type}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
                        <span>Database: <strong className="text-on-surface">{ord.db_type}</strong></span>
                        <span>•</span>
                        <span>Jadwal: <strong className="text-on-surface">{ord.booking_date}</strong></span>
                        {ord.company_name && ord.company_name !== "-" && (
                          <>
                            <span>•</span>
                            <span>Instansi: <strong className="text-on-surface">{ord.company_name}</strong></span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-4 flex sm:flex-col sm:items-end justify-between items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] text-on-surface-variant block uppercase font-mono">
                          Total Biaya
                        </span>
                        <span className="text-base font-bold font-mono text-primary">
                          {formatRupiah(ord.amount)}
                        </span>
                      </div>

                      <Link
                        href={`/pesanan/${ord.id}`}
                        className="px-4 py-2 rounded-lg bg-surface border border-outline-variant/40 hover:border-primary text-xs font-semibold text-on-surface hover:text-primary transition-colors flex items-center gap-1.5"
                      >
                        <span>Lihat Tiket & QRIS</span>
                        <span className="material-symbols-outlined text-sm">
                          qr_code_2
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

