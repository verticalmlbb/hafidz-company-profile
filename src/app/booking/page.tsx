"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { siteConfig } from "@/config/site";

const SERVICE_OPTIONS = [
  {
    id: "audit-latensi",
    title: "Audit Latensi & Query Tuning",
    desc: "Analisis bottleneck kueri, indeksasi, dan optimasi p99 tail latency hingga sub-milidetik.",
    price: "Rp 2.500.000",
    badge: "Populer",
  },
  {
    id: "arsitektur-ha",
    title: "Arsitektur High Availability & Failover",
    desc: "Perancangan multi-node cluster, auto-failover, zero-data-loss Patroni/Raft, dan replication lag minimal.",
    price: "Rp 3.800.000",
    badge: "Enterprise",
  },
  {
    id: "emergency-recovery",
    title: "Emergency Rescue & Deadlock Recovery",
    desc: "Intervensi darurat penanganan database hang, deadlock cascade massal, atau storage corrupt.",
    price: "Rp 4.500.000",
    badge: "24/7 SLA",
  },
  {
    id: "security-audit",
    title: "Database Security & Compliance Audit",
    desc: "Audit privilege least-access, audit log, enkripsi at-rest/in-transit, dan kesiapan regulasi PDP.",
    price: "Rp 2.500.000",
    badge: "Compliance",
  },
];

const DB_OPTIONS = [
  "PostgreSQL",
  "MySQL / MariaDB",
  "MongoDB",
  "Oracle Database",
  "Redis Cluster",
  "Microsoft SQL Server",
  "Lainnya (Multi-DB Hybrid)",
];

export default function BookingPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Form states
  const [clientName, setClientName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [selectedService, setSelectedService] = useState(SERVICE_OPTIONS[0].title);
  const [selectedDb, setSelectedDb] = useState(DB_OPTIONS[0]);
  const [bookingDate, setBookingDate] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          setClientName(data.user.name || "");
        }
      } catch {
        // Not logged in
      } finally {
        setAuthChecked(true);
      }
    }
    checkAuth();

    // Default booking date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split("T")[0]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent("/booking")}`);
      return;
    }

    if (!clientName.trim()) {
      setErrorMsg("Nama pemesan wajib diisi.");
      return;
    }

    if (!whatsapp.trim() || whatsapp.trim().length < 8) {
      setErrorMsg("Nomor WhatsApp minimal 8 digit.");
      return;
    }

    if (!bookingDate) {
      setErrorMsg("Silakan pilih tanggal konsultasi.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: clientName,
          company_name: companyName,
          whatsapp,
          service_type: selectedService,
          db_type: selectedDb,
          booking_date: bookingDate,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal membuat tiket pesanan.");
      }

      // Redirect ke halaman detail tiket & pembayaran QRIS
      router.push(`/pesanan/${data.order.id}`);
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat memproses pesanan.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-sans selection:bg-secondary-container selection:text-white">
      {/* Top Simple Header */}
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
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Beranda</span>
            </Link>
            {user && (
              <Link
                href="/pesanan"
                className="text-primary hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">receipt_long</span>
                <span>Pesanan Anda</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        {/* Title Header */}
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/20 border border-primary/30 text-primary text-xs font-mono uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
            Sistem Booking Konsultasi & Audit Database
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-on-surface mb-3">
            Jadwalkan Konsultasi Teknis
          </h1>
          <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed">
            Pesan tiket audit performa database enterprise Anda. Sistem kami langsung menghasilkan tiket resmi yang dapat diverifikasi melalui pembayaran QRIS instan.
          </p>
        </div>

        {/* Not Logged In Banner */}
        {authChecked && !user && (
          <div className="mb-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-amber-400 text-2xl">
                info
              </span>
              <div>
                <p className="text-sm font-semibold text-amber-200">
                  Anda belum login ke akun klien
                </p>
                <p className="text-xs text-amber-200/70">
                  Untuk melacak status tiket konsultasi di menu &quot;Pesanan Anda&quot;, silakan login atau buat akun terlebih dahulu.
                </p>
              </div>
            </div>
            <Link
              href={`/login?redirect=${encodeURIComponent("/booking")}`}
              className="px-4 py-2 rounded bg-amber-500 text-black font-semibold text-xs hover:bg-amber-400 transition-colors shrink-0 flex items-center gap-1.5"
            >
              <span>Login / Register Akun</span>
              <span className="material-symbols-outlined text-sm">login</span>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Guarantees & Pricing Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6">
              <h2 className="text-base font-bold text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">
                  verified
                </span>
                Jaminan Kualitas Konsultasi
              </h2>
              <ul className="space-y-3.5 text-xs text-on-surface-variant">
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>
                    <strong className="text-on-surface">NDA & Kerahasiaan Data 100%:</strong> Kami menandatangani kesepakatan kerahasiaan sebelum menganalisis skema query dan log server Anda.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>
                    <strong className="text-on-surface">Laporan Komprehensif:</strong> Berisi analisis akar masalah (root-cause), rekomendasi konfigurasi kernel, dan script index migration.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>
                    <strong className="text-on-surface">Verifikasi QRIS Otomatis:</strong> Pembayaran instan melalui QRIS nasional terhubung ke sistem tiket resmi admin.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>
                    <strong className="text-on-surface">SLA Tanggap 24/7:</strong> Admin kami memverifikasi tiket dan menghubungi WhatsApp Anda segera setelah konfirmasi.
                  </span>
                </li>
              </ul>
            </div>

            {/* QRIS Preview Box */}
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-white p-1 shrink-0 flex items-center justify-center">
                <Image
                  src="/images/qris.svg"
                  alt="QRIS Preview"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-on-surface mb-0.5">
                  Metode Pembayaran QRIS Resmi
                </div>
                <div className="text-on-surface-variant leading-relaxed">
                  Mendukung seluruh m-Banking (BCA, Mandiri, BRI, BNI) dan e-Wallet (GoPay, OVO, Dana, ShopeePay).
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 sm:p-8 space-y-6"
            >
              {errorMsg && (
                <div className="p-3.5 rounded-lg bg-error-container/20 border border-error/30 text-error text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">error</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* 1. Data Pemesan */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-primary mb-3">
                  1. Informasi Kontak Klien
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">
                      Nama Lengkap <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="cth. Hafidz Nurfikri"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">
                      Nama Perusahaan / Startup
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="cth. PT Solusi Data Mandiri"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">
                      Nomor WhatsApp Aktif <span className="text-primary">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="cth. 081234567890 atau +6281234567890"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                    <p className="text-[11px] text-on-surface-variant/60 mt-1">
                      Admin kami akan menghubungi nomor ini untuk koordinasi teknis dan konfirmasi jadwal.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Pilihan Layanan */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-primary mb-3">
                  2. Pilih Paket Layanan
                </h3>
                <div className="space-y-2.5">
                  {SERVICE_OPTIONS.map((srv) => {
                    const isSelected = selectedService === srv.title;
                    return (
                      <label
                        key={srv.id}
                        className={`block p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-secondary-container/20 border-primary shadow-sm"
                            : "bg-surface border-outline-variant/30 hover:border-outline-variant/60"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="service_type"
                              checked={isSelected}
                              onChange={() => setSelectedService(srv.title)}
                              className="text-primary focus:ring-primary accent-primary"
                            />
                            <div>
                              <div className="text-sm font-semibold text-on-surface flex items-center gap-2">
                                <span>{srv.title}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-mono">
                                  {srv.badge}
                                </span>
                              </div>
                              <p className="text-xs text-on-surface-variant mt-0.5 leading-snug">
                                {srv.desc}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold text-primary shrink-0">
                            {srv.price}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 3. Tipe Database & Jadwal */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-primary mb-3">
                  3. Spesifikasi Database & Jadwal
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">
                      Tipe / Engine Database <span className="text-primary">*</span>
                    </label>
                    <select
                      value={selectedDb}
                      onChange={(e) => setSelectedDb(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:border-primary transition-colors"
                    >
                      {DB_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-surface text-on-surface">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">
                      Rencana Tanggal Konsultasi <span className="text-primary">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">
                    Deskripsi Masalah / Gejala Teknis
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Terjadi lonjakan CPU 100% pada jam sibuk, deadlock query invoice, atau replikasi slave sering lagging."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-primary-container text-on-primary-container font-semibold hover:bg-secondary-container hover:text-white transition-all duration-200 active:scale-95 shadow-lg shadow-secondary-container/20 flex items-center justify-center gap-2 border border-primary/30 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Memproses Tiket Pesanan...</span>
                    </>
                  ) : (
                    <>
                      <span>Buat Tiket Pesanan & Lanjut ke QRIS</span>
                      <span className="material-symbols-outlined text-base">
                        qr_code_scanner
                      </span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-center text-on-surface-variant/60 mt-2.5">
                  Setelah submit, Anda akan diarahkan ke laman pembayaran resmi dengan kode QRIS dan rincian tiket.
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

