import fs from "fs/promises";
import path from "path";

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL || "";
const APPS_SCRIPT_SECRET = process.env.APPS_SCRIPT_SECRET || "";

// File database lokal cadangan (aktif jika APPS_SCRIPT_URL belum disetel)
const LOCAL_DB_PATH = path.join(process.cwd(), "data", "local-db.json");

export interface RoleRecord {
  id: string;
  name: string;
  description: string;
  permissions: string;
  is_system: boolean | string;
  created_at: string;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role_id: string;
  status: "active" | "inactive" | string;
  created_at: string;
  updated_at: string;
}

export interface NewsRecord {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_path: string;
  status: "publish" | "draft" | string;
  author_id: string;
  created_at: string;
  updated_at: string;
}

interface LocalDatabase {
  Roles: RoleRecord[];
  Users: UserRecord[];
  News: NewsRecord[];
  Orders: any[];
}

const INITIAL_DB: LocalDatabase = {
  Roles: [
    {
      id: "role_admin",
      name: "admin",
      description: "Administrator Sistem & Manajemen Penuh",
      permissions: "all",
      is_system: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "role_user",
      name: "user",
      description: "Pengguna Standar / Klien",
      permissions: "view_profile,create_order",
      is_system: true,
      created_at: new Date().toISOString(),
    },
  ],
  Users: [
    {
      id: "usr_admin_01",
      name: "Lead System Administrator",
      email: "admin@gmail.com",
      // Bcrypt hash untuk '123456'
      password_hash: "$2b$10$1XDcgI7VbIo.Ar3SPuhyfem3yI32yYDE0PGdF1hiNnCCvAREuWYLK",
      role_id: "admin",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  News: [
    {
      id: "news_01",
      title: "Strategi Mengatasi Deadlock pada PostgreSQL Berskala Transaksi Finansial Tinggi",
      slug: "strategi-mengatasi-deadlock-postgresql-transaksi-tinggi",
      excerpt:
        "Ulasan komprehensif mengenai isolasi transaksi, lock queue prioritization, serta arsitektur retry otomatis untuk mencegah penumpukan lock contention di perbankan digital.",
      content:
        "Penanganan transaksi konkurensi tinggi membutuhkan pemahaman arsitektur MVCC PostgreSQL, lock level, serta monitoring pg_stat_activity secara real-time.",
      thumbnail_path: "/images/news-1.svg",
      status: "publish",
      author_id: "usr_admin_01",
      created_at: "2025-02-12T08:00:00.000Z",
      updated_at: "2025-02-12T08:00:00.000Z",
    },
    {
      id: "news_02",
      title: "Tren Observability Data 2025: Mengapa Metrik IOPS Konvensional Tidak Lagi Cukup",
      slug: "tren-observability-data-2025-metrik-iops-tidak-cukup",
      excerpt:
        "Mengapa tim platform engineering modern kini beralih ke telemetri eBPF kernel level untuk mendeteksi storage delay mikro sebelum memicu kerugian finansial.",
      content:
        "Metrik IOPS agregat sering kali menutupi p99 tail latency. eBPF memungkinkan analisis mendalam hingga tingkat sub-milidetik pada storage I/O controller.",
      thumbnail_path: "/images/news-2.svg",
      status: "publish",
      author_id: "usr_admin_01",
      created_at: "2025-02-05T08:00:00.000Z",
      updated_at: "2025-02-05T08:00:00.000Z",
    },
    {
      id: "news_03",
      title: "Hafidz Company Rilis Modul Prediksi Lonjakan Kueri Berbasis Machine Learning",
      slug: "hafidz-company-rilis-modul-prediksi-lonjakan-kueri-ml",
      excerpt:
        "Inovasi mesin analitik terbaru yang mampu mengantisipasi lonjakan beban traffic tak terduga hingga 45 menit sebelum terjadi spike traffic skala festival belanja online.",
      content:
        "Algoritma prediktif kami memetakan histori beban transaksi dan secara proaktif mengalokasikan buffer memory serta replica read scaling.",
      thumbnail_path: "/images/news-3.svg",
      status: "publish",
      author_id: "usr_admin_01",
      created_at: "2025-01-28T08:00:00.000Z",
      updated_at: "2025-01-28T08:00:00.000Z",
    },
  ],
  Orders: [],
};

async function getLocalDb(): Promise<LocalDatabase> {
  try {
    const content = await fs.readFile(LOCAL_DB_PATH, "utf-8");
    return JSON.parse(content) as LocalDatabase;
  } catch {
    await fs.mkdir(path.dirname(LOCAL_DB_PATH), { recursive: true });
    await fs.writeFile(LOCAL_DB_PATH, JSON.stringify(INITIAL_DB, null, 2), "utf-8");
    return INITIAL_DB;
  }
}

async function saveLocalDb(data: LocalDatabase): Promise<void> {
  await fs.mkdir(path.dirname(LOCAL_DB_PATH), { recursive: true });
  await fs.writeFile(LOCAL_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export const db = {
  /**
   * Menanyakan apakah sedang menggunakan Google Spreadsheet atau Local fallback
   */
  isGoogleSpreadsheetActive(): boolean {
    return Boolean(APPS_SCRIPT_URL && APPS_SCRIPT_SECRET);
  },

  /**
   * Query data dari tabel
   */
  async query<T = any>(table: string, filter?: Record<string, any>): Promise<T[]> {
    if (this.isGoogleSpreadsheetActive()) {
      try {
        const res = await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: APPS_SCRIPT_SECRET,
            action: "query",
            table,
            filter,
          }),
          cache: "no-store",
        });
        const json = await res.json();
        if (json.success) return json.data as T[];
        throw new Error(json.error || "Gagal query data dari Apps Script");
      } catch (err) {
        console.error("Gagal koneksi ke Apps Script, beralih ke local fallback:", err);
      }
    }

    // Local fallback
    const local = await getLocalDb();
    const rows = (local[table as keyof LocalDatabase] || []) as any[];
    if (!filter) return rows as T[];

    return rows.filter((item) => {
      for (const key of Object.keys(filter)) {
        if (filter[key] !== undefined && filter[key] !== null && filter[key] !== "") {
          if (String(item[key]) !== String(filter[key])) return false;
        }
      }
      return true;
    }) as T[];
  },

  /**
   * Insert baris baru ke tabel
   */
  async insert<T = any>(table: string, data: any): Promise<T> {
    const record = {
      id: data.id || `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString(),
      ...data,
    };

    if (this.isGoogleSpreadsheetActive()) {
      try {
        const res = await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: APPS_SCRIPT_SECRET,
            action: "insert",
            table,
            data: record,
          }),
          cache: "no-store",
        });
        const json = await res.json();
        if (json.success) return json.data as T;
        throw new Error(json.error || "Gagal insert data ke Apps Script");
      } catch (err) {
        console.error("Gagal insert ke Apps Script, beralih ke local fallback:", err);
      }
    }

    // Local fallback
    const local = await getLocalDb();
    if (!local[table as keyof LocalDatabase]) {
      (local as any)[table] = [];
    }
    (local[table as keyof LocalDatabase] as any[]).push(record);
    await saveLocalDb(local);
    return record as T;
  },

  /**
   * Update baris data berdasarkan ID
   */
  async update(table: string, id: string, data: any): Promise<boolean> {
    if (this.isGoogleSpreadsheetActive()) {
      try {
        const res = await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: APPS_SCRIPT_SECRET,
            action: "update",
            table,
            id,
            data,
          }),
          cache: "no-store",
        });
        const json = await res.json();
        if (json.success) return true;
        throw new Error(json.error || "Gagal update data di Apps Script");
      } catch (err) {
        console.error("Gagal update ke Apps Script, beralih ke local fallback:", err);
      }
    }

    // Local fallback
    const local = await getLocalDb();
    const rows = (local[table as keyof LocalDatabase] || []) as any[];
    const index = rows.findIndex((r) => String(r.id) === String(id));
    if (index === -1) return false;

    rows[index] = {
      ...rows[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    await saveLocalDb(local);
    return true;
  },

  /**
   * Hapus baris data berdasarkan ID
   */
  async delete(table: string, id: string): Promise<boolean> {
    if (this.isGoogleSpreadsheetActive()) {
      try {
        const res = await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: APPS_SCRIPT_SECRET,
            action: "delete",
            table,
            id,
          }),
          cache: "no-store",
        });
        const json = await res.json();
        if (json.success) return true;
        throw new Error(json.error || "Gagal delete data di Apps Script");
      } catch (err) {
        console.error("Gagal delete ke Apps Script, beralih ke local fallback:", err);
      }
    }

    // Local fallback
    const local = await getLocalDb();
    const rows = (local[table as keyof LocalDatabase] || []) as any[];
    const filtered = rows.filter((r) => String(r.id) !== String(id));
    if (filtered.length === rows.length) return false;

    (local as any)[table] = filtered;
    await saveLocalDb(local);
    return true;
  },
};
