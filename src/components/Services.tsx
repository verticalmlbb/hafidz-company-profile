import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Services() {
  return (
    <section
      id="services"
      className="py-20 md:py-28 bg-surface border-b border-outline-variant/20"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-surface-container-high border border-outline-variant/40">
            <span className="text-primary text-xs uppercase tracking-wider font-semibold">
              LAYANAN KAMI
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-on-surface font-bold">
            Solusi Arsitektur &amp; Kinerja Database End-to-End
          </h2>
          <p className="text-base text-on-surface-variant">
            Layanan rekayasa presisi tinggi untuk menjamin integritas, kecepatan, dan skalabilitas ekosistem data korporat Anda.
          </p>
        </div>

        {/* 6 Bento Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteConfig.services.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-lg bg-surface-container-low border border-outline-variant/30 hover:border-primary/50 transition-all duration-300 group hover:-translate-y-1 relative flex flex-col justify-between"
            >
              <div className="h-0.5 w-12 bg-primary group-hover:w-full transition-all duration-300 absolute top-0 left-0 rounded-t" />

              <div>
                <div className="w-12 h-12 rounded bg-surface-container flex items-center justify-center text-primary mb-5 group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-2xl" aria-hidden="true">
                    {item.icon}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-on-surface mb-3 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              <Link
                href="#contact"
                className="inline-flex items-center gap-2 text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform"
              >
                <span>Jelajahi Solusi</span>
                <span className="material-symbols-outlined text-sm" aria-hidden="true">
                  arrow_forward
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
