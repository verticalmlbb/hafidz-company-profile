"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { siteConfig } from "@/config/site";

interface OrderDetail {
  id: string;
  user_id: string;
  user_email: string;
  client_name: string;
  company_name: string;
  whatsapp: string;
  service_type: string;
  db_type: string;
  booking_date: string;
  notes: string;
  amount: number;
  status: "menunggu_konfirmasi" | "dikonfirmasi" | "ditolak" | string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    if (!id) return;
    try {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal memuat detail tiket.");
      }
      setOrder(data.order);
    } catch (err: any) {
      setError(err.message || "Gagal mengambil data tiket.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // Poll every 10 seconds in case admin confirms in background
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [id]);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-on-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-on-surface-variant font-mono">
            Memuat data tiket {id}...
          </span>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background text-on-surface flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-surface-container-low border border-error/30 rounded-2xl p-8 text-center space-y-4">
          <span className="material-symbols-outlined text-error text-5xl">
            error_outline
          </span>
          <h1 className="text-lg font-bold text-on-surface">
            Tiket Tidak Ditemukan
          </h1>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {error || "Tiket tidak terdaftar atau Anda tidak memiliki akses untuk melihat tiket ini."}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/pesanan"
              className="px-4 py-2 rounded-lg bg-surface border border-outline-variant/40 text-xs font-semibold text-on-surface hover:border-primary transition-colors"
            >
              Daftar Pesanan Anda
            </Link>
            <Link
              href="/"
              className="px-4 py-2 rounded-lg bg-primary-container text-on-primary-container text-xs font-semibold hover:bg-secondary-container hover:text-white transition-colors"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isConfirmed = order.status === "dikonfirmasi";
  const isRejected = order.status === "ditolak";
  const isPending = order.status === "menunggu_konfirmasi";

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
              href="/pesanan"
              className="text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Daftar Pesanan</span>
            </Link>
            <Link
              href="/booking"
              className="text-primary hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              <span>Pesan Baru</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        {/* Top Header Card */}
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-outline-variant/20">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-mono text-on-surface-variant uppercase tracking-wider">
                  Tiket Resmi Konsultasi
                </span>
                <span className="text-xs font-mono text-primary font-bold">
                  #{order.id}
                </span>
              </div>
              <h1 className="text-2xl font-display font-extrabold text-on-surface">
                {order.service_type}
              </h1>
              <p className="text-xs text-on-surface-variant mt-1">
                Dibuat pada {new Date(order.created_at).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" })}
              </p>
            </div>

            {/* Status Badge */}
            <div className="sm:text-right shrink-0">
              <span className="text-[10px] text-on-surface-variant block mb-1 uppercase tracking-wider">
                Status Tiket
              </span>
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

          {/* Status Alert Banner */}
          <div className="pt-6">
            {isPending && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-200">
                <span className="material-symbols-outlined text-amber-400 text-xl shrink-0 mt-0.5">
                  pending
                </span>
                <div className="text-xs space-y-1">
                  <p className="font-semibold text-amber-300">
                    Tiket dalam antrean verifikasi pembayaran
                  </p>
                  <p className="text-amber-200/80 leading-relaxed">
                    Silakan selesaikan pembayaran sebesar <strong className="text-white">{formatRupiah(order.amount)}</strong> melalui barcode QRIS di bawah. Setelah bukti pembayaran diverifikasi oleh admin kami, status tiket ini akan otomatis berubah menjadi <strong>Dikonfirmasi</strong>.
                  </p>
                </div>
              </div>
            )}

            {isConfirmed && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-emerald-200">
                <span className="material-symbols-outlined text-emerald-400 text-xl shrink-0 mt-0.5">
                  task_alt
                </span>
                <div className="text-xs space-y-1">
                  <p className="font-semibold text-emerald-300">
                    Selamat, pembayaran Anda telah dikonfirmasi!
                  </p>
                  <p className="text-emerald-200/90 leading-relaxed">
                    Silakan tunggu informasi selanjutnya dari tim teknis Hafidz&apos;s Company melalui email atau WhatsApp. Jadwal sesi konsultasi telah dikunci pada tanggal <strong>{order.booking_date}</strong>.
                  </p>
                </div>
              </div>
            )}

            {isRejected && (
              <div className="p-4 rounded-xl bg-error-container/20 border border-error/30 flex items-start gap-3 text-error">
                <span className="material-symbols-outlined text-error text-xl shrink-0 mt-0.5">
                  info
                </span>
                <div className="text-xs space-y-1">
                  <p className="font-semibold">
                    Tiket Tidak Dapat Diproses / Ditolak
                  </p>
                  <p className="text-error/80 leading-relaxed">
                    Alasan: {order.rejection_reason || "Tidak ada rincian alasan."}. Silakan hubungi admin kami via WhatsApp jika ada pertanyaan.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Two Columns: Ticket Info & QRIS Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Data Ringkasan */}
          <div className="md:col-span-6 space-y-6">
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-3">
                <span className="material-symbols-outlined text-primary text-lg">
                  assignment
                </span>
                Rincian Pemesanan Klien
              </h2>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-on-surface-variant block">Nama Pemesan</span>
                  <span className="font-semibold text-on-surface">{order.client_name}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Perusahaan / Instansi</span>
                  <span className="font-semibold text-on-surface">{order.company_name || "-"}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Nomor WhatsApp</span>
                  <span className="font-semibold text-on-surface">{order.whatsapp}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Email Terdaftar</span>
                  <span className="font-semibold text-on-surface">{order.user_email}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Engine Database</span>
                  <span className="inline-block px-2 py-0.5 rounded bg-surface border border-outline-variant/30 font-mono text-[11px] text-primary">
                    {order.db_type}
                  </span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Rencana Tanggal</span>
                  <span className="font-semibold text-on-surface">{order.booking_date}</span>
                </div>
              </div>

              {order.notes && order.notes !== "-" && (
                <div className="pt-2 border-t border-outline-variant/20">
                  <span className="text-on-surface-variant text-xs block mb-1">
                    Catatan Masalah Teknis:
                  </span>
                  <p className="text-xs text-on-surface-variant/90 italic bg-surface p-3 rounded-lg border border-outline-variant/20">
                    &ldquo;{order.notes}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Total Pembayaran Box */}
            <div className="bg-surface-container-low border border-primary/30 rounded-2xl p-6 crimson-border-glow">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider block">
                    Total Tagihan Konsultasi
                  </span>
                  <span className="text-2xl font-bold font-mono text-primary-container">
                    {formatRupiah(order.amount)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 font-mono">
                    Bebas Biaya Admin
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`https://wa.me/${siteConfig.contact.whatsappFormatted}?text=${encodeURIComponent(
                  `Halo Admin Hafidz's Company, saya ingin konfirmasi tiket pemesanan #${order.id} atas nama ${order.client_name}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-surface border border-outline-variant/40 hover:border-primary text-on-surface text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-emerald-400 text-base">
                  chat
                </span>
                <span>Hubungi Admin via WA ({siteConfig.contact.whatsapp})</span>
              </a>
              <Link
                href="/pesanan"
                className="py-3 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Semua Tiket Saya</span>
              </Link>
            </div>
          </div>

          {/* Right Column: QRIS Card */}
          <div className="md:col-span-6">
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 sm:p-8 flex flex-col items-center">
              <div className="text-center mb-4">
                <h3 className="text-base font-bold text-on-surface">
                  Pembayaran QRIS Nasional
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Scan barcode berikut untuk menyelesaikan pembayaran tiket
                </p>
              </div>

              {/* QRIS SVG Display */}
              <div className="w-full max-w-[320px] rounded-xl overflow-hidden shadow-2xl border-2 border-white/10 bg-white">
                <Image
                  src="/images/qris.svg"
                  alt="QRIS Hafidz Company"
                  width={420}
                  height={560}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>

              {/* Payment Step Instructions */}
              <div className="w-full mt-6 bg-surface p-4 rounded-xl border border-outline-variant/20 text-xs space-y-2 text-on-surface-variant">
                <div className="font-semibold text-on-surface text-xs mb-1">
                  Panduan Scan Pembayaran:
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-primary/20 text-primary font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <span>Buka aplikasi m-Banking (BCA, Mandiri, BRI, BNI) atau e-Wallet (GoPay, OVO, Dana).</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-primary/20 text-primary font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <span>Pilih menu <strong>Scan QRIS</strong> dan arahkan kamera ke barcode di atas.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-primary/20 text-primary font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <span>Pastikan nama merchant tertera <strong>HAFIDZ&apos;S COMPANY</strong> dan masukkan nominal <strong>{formatRupiah(order.amount)}</strong>.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

