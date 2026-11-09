"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dbType: "postgresql",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-surface-container-high border border-outline-variant/40">
            <span className="text-primary text-xs uppercase tracking-wider font-semibold">
              HUBUNGI KAMI
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-on-surface font-bold">
            Konsultasikan Kebutuhan Performa Basis Data Anda
          </h2>
          <p className="text-base text-on-surface-variant">
            Diskusikan tantangan latensi atau kebutuhan arsitektur Anda dengan Lead Database Architect {siteConfig.shortName}.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Details & Form */}
          <div className="lg:col-span-6 space-y-8">
            {/* Quick Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded bg-surface-container-low border border-outline-variant/30">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <span className="material-symbols-outlined text-xl" aria-hidden="true">
                    location_on
                  </span>
                  <span className="text-xs font-semibold uppercase">Kantor Pusat</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {siteConfig.contact.address}
                </p>
              </div>

              <div className="p-4 rounded bg-surface-container-low border border-outline-variant/30">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <span className="material-symbols-outlined text-xl" aria-hidden="true">
                    schedule
                  </span>
                  <span className="text-xs font-semibold uppercase">Jam Operasional</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {siteConfig.contact.hours}
                  <br />
                  <span className="text-primary font-semibold">{siteConfig.contact.hoursDetail}</span>
                </p>
              </div>

              <div className="p-4 rounded bg-surface-container-low border border-outline-variant/30">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <span className="material-symbols-outlined text-xl" aria-hidden="true">
                    call
                  </span>
                  <span className="text-xs font-semibold uppercase">Telepon &amp; WhatsApp</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {siteConfig.contact.phone}
                  <br />
                  <a
                    href={`https://wa.me/${siteConfig.contact.whatsappFormatted}?text=Halo%20Hafidz%20Company,%20saya%20ingin%20konsultasi%20database`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors inline-flex items-center gap-1 font-medium"
                  >
                    <span>{siteConfig.contact.whatsapp}</span>
                    <span className="text-emerald-400 text-[10px] uppercase font-bold">(WhatsApp)</span>
                  </a>
                </p>
              </div>

              <div className="p-4 rounded bg-surface-container-low border border-outline-variant/30">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <span className="material-symbols-outlined text-xl" aria-hidden="true">
                    mail
                  </span>
                  <span className="text-xs font-semibold uppercase">Email Resmi</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-primary transition-colors">
                    {siteConfig.contact.email}
                  </a>
                  <br />
                  <a href={`mailto:${siteConfig.contact.enterpriseEmail}`} className="hover:text-primary transition-colors">
                    {siteConfig.contact.enterpriseEmail}
                  </a>
                </p>
              </div>
            </div>

            {/* Interactive Form */}
            <div className="p-6 md:p-8 rounded-lg bg-surface-container-lowest border border-outline-variant/30 shadow-xl">
              <h3 className="text-lg font-semibold text-on-surface mb-4">
                Kirim Permintaan Konsultasi
              </h3>

              {submitted ? (
                <div className="p-6 rounded bg-surface-container border border-emerald-500/40 text-center space-y-3">
                  <span className="material-symbols-outlined text-4xl text-emerald-400">
                    check_circle
                  </span>
                  <h4 className="text-base font-bold text-on-surface">Pesan Terkirim!</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Terima kasih, <strong className="text-primary">{formData.name}</strong>. Tim Lead Database Architect {siteConfig.shortName} akan segera menghubungi email <strong className="text-primary">{formData.email}</strong> dalam 1x24 jam.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", dbType: "postgresql", message: "" });
                    }}
                    className="text-xs text-primary underline hover:text-white pt-2 inline-block"
                  >
                    Kirim pesan lain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name-input" className="block text-xs font-medium text-on-surface-variant mb-1.5">
                      Nama Lengkap
                    </label>
                    <input
                      id="name-input"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contoh: Raden Surya Pratama"
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded px-3.5 py-2.5 text-on-surface placeholder:text-outline-variant/60 focus:outline-none focus:border-primary text-sm transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="email-input" className="block text-xs font-medium text-on-surface-variant mb-1.5">
                      Email Perusahaan
                    </label>
                    <input
                      id="email-input"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="surya@perusahaan.co.id"
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded px-3.5 py-2.5 text-on-surface placeholder:text-outline-variant/60 focus:outline-none focus:border-primary text-sm transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="db-select" className="block text-xs font-medium text-on-surface-variant mb-1.5">
                      Jenis Basis Data Utama
                    </label>
                    <select
                      id="db-select"
                      value={formData.dbType}
                      onChange={(e) => setFormData({ ...formData, dbType: e.target.value })}
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded px-3.5 py-2.5 text-on-surface focus:outline-none focus:border-primary text-sm transition-colors"
                    >
                      <option value="postgresql">PostgreSQL (Cluster / RDS / Aurora)</option>
                      <option value="mysql">MySQL / MariaDB Enterprise</option>
                      <option value="oracle">Oracle Database Enterprise</option>
                      <option value="mongodb">MongoDB / DocumentDB</option>
                      <option value="redis">Redis / In-Memory Caching</option>
                      <option value="other">Kombinasi Multi-Database Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message-input" className="block text-xs font-medium text-on-surface-variant mb-1.5">
                      Pesan atau Tantangan Kinerja Saat Ini
                    </label>
                    <textarea
                      id="message-input"
                      rows={3}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Ceritakan kendala latensi, beban kueri, atau rencana migrasi data yang dihadapi..."
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded px-3.5 py-2.5 text-on-surface placeholder:text-outline-variant/60 focus:outline-none focus:border-primary text-sm transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded bg-primary-container text-on-primary-container font-semibold hover:bg-secondary-container hover:text-white transition-all duration-200 active:scale-95 shadow-lg shadow-primary-container/20 flex items-center justify-center gap-2 border border-primary/20 text-sm"
                  >
                    <span className="material-symbols-outlined text-lg" aria-hidden="true">
                      send
                    </span>
                    <span>Kirim Pesan &amp; Request Audit</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Google Maps Embed & HUD */}
          <div className="lg:col-span-6 h-full">
            <div className="rounded-lg overflow-hidden border border-outline-variant/40 bg-surface-container-lowest p-2 relative h-full min-h-[580px] flex flex-col shadow-2xl">
              {/* Map Top Bar HUD */}
              <div className="flex items-center justify-between px-3 py-2 bg-surface-container rounded mb-2 border border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm" aria-hidden="true">
                    explore
                  </span>
                  <span className="text-xs text-on-surface font-medium">
                    Peta Lokasi Kantor Pusat • Rasuna Said, Jakarta
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-primary animate-ping" />
                  <span className="font-mono text-xs text-primary">GPS ACTIVE</span>
                </div>
              </div>

              {/* Map Visual / Iframe Embed */}
              <div className="relative flex-grow rounded overflow-hidden border border-outline-variant/30 min-h-[460px] bg-surface-container-lowest">
                <iframe
                  title="Peta Lokasi Hafidz Company di Menara Cyber 2 Jakarta"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent("Menara Cyber 2, Jl. H.R. Rasuna Said, Jakarta")}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                  width="100%"
                  height="100%"
                  loading="lazy"
                  className="w-full h-full min-h-[460px] border-0 filter grayscale-[60%] invert-[90%] hue-rotate-[180deg] contrast-[1.2]"
                  allowFullScreen
                />

                {/* Directions CTA Overlay */}
                <div className="absolute bottom-4 left-4 z-10">
                  <a
                    href={siteConfig.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded bg-surface-container-highest/95 text-on-surface border border-outline-variant/50 text-xs font-semibold flex items-center gap-2 hover:border-primary transition-colors shadow-xl backdrop-blur-md"
                  >
                    <span className="material-symbols-outlined text-primary text-sm" aria-hidden="true">
                      directions
                    </span>
                    <span>Buka Petunjuk Arah (Google Maps)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
