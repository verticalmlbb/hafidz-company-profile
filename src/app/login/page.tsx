import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md p-8 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-2xl space-y-6 text-center">
        <div className="inline-flex items-center justify-center h-10 px-3 bg-white rounded shadow-sm mx-auto">
          <Image
            src={siteConfig.logo}
            alt={siteConfig.name}
            width={120}
            height={30}
            className="h-6 w-auto object-contain"
          />
        </div>
        <div>
          <h1 className="text-xl font-display font-bold text-on-surface">
            Portal Autentikasi
          </h1>
          <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
            Sistem Login, Register, dan Dashboard Admin dengan basis data Google Spreadsheet akan diaktifkan di <strong>Step 2</strong>.
          </p>
        </div>
        <div className="p-4 rounded bg-surface-container border border-primary/30 text-xs text-primary font-mono">
          STATUS: TAHAP IMPLEMENTASI STEP 1 SELESAI
        </div>
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-primary-container text-on-primary-container text-xs font-semibold hover:bg-secondary-container hover:text-white transition-colors"
          >
            Kembali ke Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}
