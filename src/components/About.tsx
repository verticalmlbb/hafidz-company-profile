import Image from "next/image";
import { siteConfig } from "@/config/site";

export default function About() {
  return (
    <section
      id="about"
      className="py-20 md:py-28 bg-surface-container-lowest border-b border-outline-variant/20"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Story & Vision */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-surface-container border border-outline-variant/40">
              <span className="text-primary text-xs uppercase tracking-wider font-semibold">
                TENTANG {siteConfig.shortName.toUpperCase()}
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-on-surface font-bold tracking-tight">
              Membangun Ketahanan Data untuk Transformasi Digital Indonesia
            </h2>

            <p className="text-base text-on-surface-variant leading-relaxed">
              Berangkat dari kompleksitas penanganan beban kerja basis data skala masif di era transformasi digital, {siteConfig.name} hadir sebagai mitra strategis enterprise di Indonesia. Kami mendedikasikan keahlian dalam membedah hambatan konkurensi data, kueri yang tidak efisien, serta risiko kegagalan sistem pada industri perbankan, fintech, e-commerce, dan infrastruktur publik.
            </p>

            <p className="text-sm text-on-surface-variant/80 leading-relaxed">
              Melalui kombinasi arsitek database senior berkaliber dunia dan instrumen analitik mutakhir, kami membantu ratusan korporasi mengatasi downtime tak terduga, degradasi I/O, serta merampingkan pengeluaran infrastruktur komputasi awan.
            </p>

            {/* 3 Key Strengths */}
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4 p-4 rounded bg-surface-container border border-outline-variant/30 hover:border-primary/40 transition-colors">
                <div className="p-2.5 rounded bg-primary-container/20 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl" aria-hidden="true">
                    psychology
                  </span>
                </div>
                <div>
                  <h3 className="text-base text-on-surface font-semibold">
                    Analisis Deep-Query AI
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Diagnostik indeks dan kueri otomatis hingga level microsecond execution guna mengeliminasi sequential table scans yang membebani memori server.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded bg-surface-container border border-outline-variant/30 hover:border-primary/40 transition-colors">
                <div className="p-2.5 rounded bg-primary-container/20 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl" aria-hidden="true">
                    monitor_heart
                  </span>
                </div>
                <div>
                  <h3 className="text-base text-on-surface font-semibold">
                    Monitoring Real-time 24/7
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Deteksi anomali memory leak, IOPS spike, dan deadlocks secara proaktif sebelum eskalasi gangguan dirasakan langsung oleh pengguna akhir.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded bg-surface-container border border-outline-variant/30 hover:border-primary/40 transition-colors">
                <div className="p-2.5 rounded bg-primary-container/20 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl" aria-hidden="true">
                    encrypted
                  </span>
                </div>
                <div>
                  <h3 className="text-base text-on-surface font-semibold">
                    Standar Keamanan Enterprise
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Kepatuhan regulasi ketat ISO 27001 dan enkripsi end-to-end tanpa pernah mengekspos isi payload data sensitif maupun informasi personal klien.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual of Modern Data NOC Lab */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-xl overflow-hidden border border-outline-variant/40 crimson-border-glow shadow-2xl">
              <div className="relative w-full h-[400px] sm:h-[480px]">
                <Image
                  src="/images/about-noc.svg"
                  alt="Laboratorium Observabilitas NOC Hafidz Company"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent pointer-events-none" />

              {/* Floating Telemetry Overlay Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded bg-surface-container/90 backdrop-blur-md border border-outline-variant/40 flex items-center justify-between">
                <div>
                  <div className="text-xs text-primary uppercase font-semibold">
                    Track Record Teruji
                  </div>
                  <div className="text-lg font-bold text-on-surface mt-0.5">
                    500M+ Kueri Teroptimasi Harian
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-xl" aria-hidden="true">
                    verified_user
                  </span>
                  <span className="font-mono text-sm font-bold">100% SLA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
