import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest w-full block border-t border-outline-variant/20">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6 w-full">
        {/* Brand & Summary Left */}
        <div className="flex flex-col items-center md:items-start gap-3 max-w-md text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="h-8 px-2 bg-white rounded flex items-center justify-center">
              <Image
                src={siteConfig.logo}
                alt={`${siteConfig.name} Logo`}
                width={120}
                height={28}
                className="h-5 w-auto object-contain"
              />
            </div>
            <span className="text-xl font-display font-bold text-on-surface">
              {siteConfig.shortName}
            </span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {siteConfig.description}
          </p>
          <p className="text-xs text-on-surface-variant/70">
            © {new Date().getFullYear()} PT Hafidz Company Indonesia. Hak Cipta Dilindungi Undang-Undang. Enterprise Database Performance &amp; Intelligence Architecture.
          </p>
        </div>

        {/* Links & Socials Right */}
        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
            <Link
              href="#contact"
              className="text-on-surface-variant/70 hover:text-primary transition-colors"
            >
              Privasi &amp; Kebijakan
            </Link>
            <Link
              href="#contact"
              className="text-on-surface-variant/70 hover:text-primary transition-colors"
            >
              Syarat &amp; Ketentuan
            </Link>
            <Link
              href="#hero"
              className="text-on-surface-variant/70 hover:text-primary transition-colors"
            >
              Status Sistem
            </Link>
            <Link
              href="#services"
              className="text-on-surface-variant/70 hover:text-primary transition-colors"
            >
              Dokumentasi API
            </Link>
            <Link
              href="#contact"
              className="text-on-surface-variant/70 hover:text-primary transition-colors"
            >
              Pusat Bantuan
            </Link>
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Hafidz Company"
              className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-sm" aria-hidden="true">
                work
              </span>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Hafidz Company"
              className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-sm" aria-hidden="true">
                code
              </span>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter X Hafidz Company"
              className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-sm" aria-hidden="true">
                tag
              </span>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube Hafidz Company"
              className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-sm" aria-hidden="true">
                smart_display
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
