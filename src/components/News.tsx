import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";

export default function News() {
  return (
    <section
      id="news"
      className="py-20 md:py-28 bg-surface-container-lowest border-b border-outline-variant/20"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-surface-container border border-outline-variant/40 mb-3">
              <span className="text-primary text-xs uppercase tracking-wider font-semibold">
                BERITA &amp; WAWASAN
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-on-surface font-bold">
              Wawasan Teknis &amp; Berita Terbaru
            </h2>
            <p className="text-base text-on-surface-variant mt-2 max-w-2xl leading-relaxed">
              Eksplorasi praktik terbaik rekayasa database, riset latensi, dan laporan teknis terkini dari para arsitek sistem kami.
            </p>
          </div>
          <div>
            <Link
              href="#news"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-surface-container border border-outline-variant/50 text-on-surface text-xs font-semibold hover:border-primary transition-colors"
            >
              <span>Lihat Semua Artikel</span>
              <span className="material-symbols-outlined text-sm" aria-hidden="true">
                arrow_outward
              </span>
            </Link>
          </div>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {siteConfig.news.map((article) => (
            <article
              key={article.id}
              className="rounded-lg overflow-hidden bg-surface-container-low border border-outline-variant/30 flex flex-col group hover:border-primary/40 transition-colors"
            >
              <div className="relative h-48 overflow-hidden bg-surface-container">
                <Image
                  src={article.thumbnail.replace(/\.jpg$/, ".svg")}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded bg-surface-container-lowest/90 backdrop-blur-md text-primary text-xs font-semibold border border-outline-variant/30">
                    {article.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-2">
                  <span className="material-symbols-outlined text-xs" aria-hidden="true">
                    calendar_today
                  </span>
                  <span>{article.date}</span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>

                <h3 className="text-base font-semibold text-on-surface mb-3 group-hover:text-primary transition-colors leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs text-on-surface-variant line-clamp-3 mb-6 leading-relaxed">
                  {article.excerpt}
                </p>

                <div className="mt-auto">
                  <Link
                    href={`#news`}
                    className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold group-hover:translate-x-1 transition-transform"
                  >
                    <span>Baca Selengkapnya</span>
                    <span className="material-symbols-outlined text-sm" aria-hidden="true">
                      chevron_right
                    </span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
