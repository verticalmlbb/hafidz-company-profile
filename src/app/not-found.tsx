import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 text-center">
      <div className="max-w-md p-8 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-2xl space-y-5">
        <div className="font-mono text-5xl font-extrabold text-primary">404</div>
        <h1 className="text-xl font-bold text-on-surface">Halaman Tidak Ditemukan</h1>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Node rute yang Anda tuju tidak terdaftar di cluster sistem Hafidz Company.
        </p>
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-primary-container text-on-primary-container text-xs font-semibold hover:bg-secondary-container hover:text-white transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
