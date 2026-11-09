export interface NavItem {
  label: string;
  href: string;
}

export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  thumbnail: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  field: string;
  description: string;
  logo: string;
  mapUrl: string;
  mapEmbedUrl: string;
  contact: {
    address: string;
    hours: string;
    hoursDetail: string;
    phone: string;
    whatsapp: string;
    whatsappFormatted: string;
    email: string;
    enterpriseEmail: string;
  };
  navLinks: NavItem[];
  services: ServiceItem[];
  news: NewsArticle[];
}

export const siteConfig: SiteConfig = {
  name: "Hafidz's Company",
  shortName: "Hafidz Company",
  tagline: "Enterprise Database Performance & Intelligence Architecture",
  field: "Database Analyzer",
  description:
    "Perusahaan spesialis analisis dan optimasi kinerja basis data enterprise. Kami mendiagnostik bottleneck latensi, mengoptimasi kueri dan indeks, serta menjamin keandalan sistem berkecepatan tinggi dengan SLA 99.99%.",
  logo: "/images/logo.jpg",
  mapUrl: "https://maps.app.goo.gl/Jdh9cNYorKEtH8gB9",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2758153424164!2d106.8288544!3d-6.227318!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3ef0f9689f1%3A0x6b5c3272449e7b23!2sMenara%20Cyber%202!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid",
  contact: {
    address: "Menara Cyber 2, Lt. 18, Jl. H.R. Rasuna Said, Kuningan, Jakarta Selatan 12950",
    hours: "Senin – Jumat, 08.30 – 17.30 WIB",
    hoursDetail: "NOC & Engineering On-Call 24/7 (SLA Enterprise)",
    phone: "+62 21 5088 7720",
    whatsapp: "+62 811 9876 5432",
    whatsappFormatted: "6281198765432",
    email: "halo@hafidzcompany.id",
    enterpriseEmail: "enterprise@hafidzcompany.id",
  },
  navLinks: [
    { label: "Home", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "News", href: "#news" },
    { label: "Contact", href: "#contact" },
  ],
  services: [
    {
      id: "query-tuning",
      icon: "manage_search",
      title: "Audit & Tuning Kueri SQL/NoSQL",
      description:
        "Optimasi execution plan, profiling beban kerja intensif, pembenahan slow query berulang, dan mitigasi bottleneck CPU pada tingkat granular kueri.",
    },
    {
      id: "index-opt",
      icon: "schema",
      title: "Automated Index Optimization",
      description:
        "Deteksi missing index cerdas, penghapusan index redundan yang memboroskan ruang penulisan, dan optimasi menyeluruh throughput disk I/O.",
    },
    {
      id: "health-monitor",
      icon: "vital_signs",
      title: "Health & Anomaly Monitoring",
      description:
        "Observability real-time untuk pemanfaatan core CPU, efisiensi RAM buffer pool, keterlambatan replication lag, serta saturasi write buffer.",
    },
    {
      id: "cluster-arch",
      icon: "hub",
      title: "High Availability & Cluster Architecture",
      description:
        "Perancangan sistem failover nir-interupsi, automasi disaster recovery, dan tata kelola replikasi multi-region active-active berlatensi minimal.",
    },
    {
      id: "cloud-migration",
      icon: "cloud_sync",
      title: "Cloud & Database Migration Analytics",
      description:
        "Migrasi mulus dari infrastruktur on-premise ke ekosistem AWS, Google Cloud, atau Microsoft Azure dengan jaminan zero downtime dan validasi integritas data.",
    },
    {
      id: "security-audit",
      icon: "shield",
      title: "Compliance & Security Auditing",
      description:
        "Audit izin akses hierarkis, enkripsi mutlak pada data at-rest & in-transit, serta deteksi proaktif kerentanan serangan injeksi SQL berbasis pola.",
    },
  ],
  news: [
    {
      id: "1",
      slug: "strategi-mengatasi-deadlock-postgresql-transaksi-tinggi",
      title: "Strategi Mengatasi Deadlock pada PostgreSQL Berskala Transaksi Finansial Tinggi",
      excerpt:
        "Ulasan komprehensif mengenai isolasi transaksi, lock queue prioritization, serta arsitektur retry otomatis untuk mencegah penumpukan lock contention di perbankan digital.",
      date: "12 Feb 2025",
      readTime: "5 min baca",
      category: "Optimasi Database",
      thumbnail: "/images/news-1.jpg",
    },
    {
      id: "2",
      slug: "tren-observability-data-2025-metrik-iops-tidak-cukup",
      title: "Tren Observability Data 2025: Mengapa Metrik IOPS Konvensional Tidak Lagi Cukup",
      excerpt:
        "Mengapa tim platform engineering modern kini beralih ke telemetri eBPF kernel level untuk mendeteksi storage delay mikro sebelum memicu kerugian finansial.",
      date: "5 Feb 2025",
      readTime: "7 min baca",
      category: "Arsitektur Cloud",
      thumbnail: "/images/news-2.jpg",
    },
    {
      id: "3",
      slug: "hafidz-company-rilis-modul-prediksi-lonjakan-kueri-ml",
      title: "Hafidz Company Rilis Modul Prediksi Lonjakan Kueri Berbasis Machine Learning",
      excerpt:
        "Inovasi mesin analitik terbaru yang mampu mengantisipasi lonjakan beban traffic tak terduga hingga 45 menit sebelum terjadi spike traffic skala festival belanja online.",
      date: "28 Jan 2025",
      readTime: "4 min baca",
      category: "Rilis Produk",
      thumbnail: "/images/news-3.jpg",
    },
  ],
};
