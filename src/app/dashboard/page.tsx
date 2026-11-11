"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role_id: string;
  status: string;
  created_at: string;
}

interface RoleItem {
  id: string;
  name: string;
  description: string;
  permissions: string;
  is_system: boolean | string;
}

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_path: string;
  status: string;
  created_at: string;
}

interface OrderItem {
  id: string;
  user_id: string;
  user_email: string;
  client_name: string;
  company_name: string;
  whatsapp: string;
  service_type: string;
  db_type: string;
  booking_date: string;
  notes: string;
  amount: number;
  status: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "roles" | "news" | "orders">("overview");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Data states
  const [users, setUsers] = useState<UserItem[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [orderFilter, setOrderFilter] = useState<"all" | "menunggu_konfirmasi" | "dikonfirmasi" | "ditolak">("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [rejectModal, setRejectModal] = useState<{ open: boolean; orderId: string; reason: string }>({
    open: false,
    orderId: "",
    reason: "",
  });

  // Modals & alerts
  const [alertMsg, setAlertMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Role creation modal
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRoleForm, setNewRoleForm] = useState({ name: "", description: "", permissions: "read_only" });

  // News modal
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsForm, setNewsForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    thumbnail_path: "/images/news-1.svg",
    status: "publish",
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch initial data
  useEffect(() => {
    async function loadData() {
      try {
        const meRes = await fetch("/api/auth/me");
        const meData = await meRes.json();
        if (!meData.authenticated || meData.user.role !== "admin") {
          router.push("/login");
          return;
        }
        setCurrentUser(meData.user);

        // Fetch users, roles, news, orders
        const [usersRes, rolesRes, newsRes, ordersRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/roles"),
          fetch("/api/admin/news"),
          fetch("/api/admin/orders"),
        ]);

        const [usersJson, rolesJson, newsJson, ordersJson] = await Promise.all([
          usersRes.json(),
          rolesRes.json(),
          newsRes.json(),
          ordersRes.json(),
        ]);

        if (usersJson.success) setUsers(usersJson.data);
        if (rolesJson.success) setRoles(rolesJson.data);
        if (newsJson.success) setNews(newsJson.data);
        if (ordersJson.success && Array.isArray(ordersJson.orders)) setOrders(ordersJson.orders);
      } catch (err) {
        console.error("Gagal memuat data dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  // Actions
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const showNotification = (type: "success" | "error", text: string) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 5000);
  };

  // Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotification("error", "Konfirmasi password baru tidak cocok.");
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification("success", "Password berhasil diubah!");
        setShowPasswordModal(false);
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        showNotification("error", data.error || "Gagal mengubah password.");
      }
    } catch {
      showNotification("error", "Gagal menghubungi server.");
    } finally {
      setPasswordLoading(false);
    }
  };

  // User Status & Role Change
  const handleToggleUserStatus = async (user: UserItem) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    if (user.id === currentUser?.id) {
      showNotification("error", "Anda tidak dapat menonaktifkan akun sendiri.");
      return;
    }
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers(users.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)));
        showNotification("success", `Status akun ${user.email} diubah menjadi ${newStatus}.`);
      } else {
        showNotification("error", data.error || "Gagal memperbarui status user.");
      }
    } catch {
      showNotification("error", "Koneksi gagal.");
    }
  };

  const handleChangeUserRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role_id: newRole }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, role_id: newRole } : u)));
        showNotification("success", "Role pengguna berhasil diperbarui.");
      } else {
        showNotification("error", data.error || "Gagal mengubah role.");
      }
    } catch {
      showNotification("error", "Koneksi gagal.");
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus user ${email}?`)) return;
    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers(users.filter((u) => u.id !== userId));
        showNotification("success", `Pengguna ${email} berhasil dihapus.`);
      } else {
        showNotification("error", data.error || "Gagal menghapus user.");
      }
    } catch {
      showNotification("error", "Koneksi gagal.");
    }
  };

  // Role Management
  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoleForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRoles([...roles, data.data]);
        setShowRoleModal(false);
        setNewRoleForm({ name: "", description: "", permissions: "read_only" });
        showNotification("success", `Role '${data.data.name}' berhasil ditambahkan.`);
      } else {
        showNotification("error", data.error || "Gagal membuat role.");
      }
    } catch {
      showNotification("error", "Koneksi gagal.");
    }
  };

  const handleDeleteRole = async (roleId: string, roleName: string) => {
    if (!confirm(`Hapus role '${roleName}'?`)) return;
    try {
      const res = await fetch(`/api/admin/roles?id=${roleId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setRoles(roles.filter((r) => r.id !== roleId));
        showNotification("success", `Role '${roleName}' dihapus.`);
      } else {
        showNotification("error", data.error || "Gagal menghapus role.");
      }
    } catch {
      showNotification("error", "Koneksi gagal.");
    }
  };

  // News Image Upload
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNewsForm({ ...newsForm, thumbnail_path: data.path });
        showNotification("success", "Gambar thumbnail berhasil diunggah.");
      } else {
        showNotification("error", data.error || "Gagal mengunggah gambar.");
      }
    } catch {
      showNotification("error", "Koneksi unggah gagal.");
    } finally {
      setUploadingImage(false);
    }
  };

  // News Save (Create or Update)
  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingNewsId) {
        const res = await fetch("/api/admin/news", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingNewsId, ...newsForm }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setNews(news.map((n) => (n.id === editingNewsId ? { ...n, ...newsForm } : n)));
          setShowNewsModal(false);
          setEditingNewsId(null);
          showNotification("success", "Artikel berita berhasil diperbarui.");
        } else {
          showNotification("error", data.error || "Gagal memperbarui berita.");
        }
      } else {
        const res = await fetch("/api/admin/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newsForm),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setNews([data.data, ...news]);
          setShowNewsModal(false);
          showNotification("success", "Artikel berita baru berhasil dipublikasikan.");
        } else {
          showNotification("error", data.error || "Gagal menambah berita.");
        }
      }
    } catch {
      showNotification("error", "Koneksi gagal.");
    }
  };

  const handleDeleteNews = async (newsId: string, title: string) => {
    if (!confirm(`Hapus artikel '${title}'?`)) return;
    try {
      const res = await fetch(`/api/admin/news?id=${newsId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setNews(news.filter((n) => n.id !== newsId));
        showNotification("success", "Artikel berita berhasil dihapus.");
      } else {
        showNotification("error", data.error || "Gagal menghapus berita.");
      }
    } catch {
      showNotification("error", "Koneksi gagal.");
    }
  };

  const openCreateNewsModal = () => {
    setEditingNewsId(null);
    setNewsForm({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      thumbnail_path: "/images/news-1.svg",
      status: "publish",
    });
    setShowNewsModal(true);
  };

  const openEditNewsModal = (item: NewsItem) => {
    setEditingNewsId(item.id);
    setNewsForm({
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      content: item.content || item.excerpt,
      thumbnail_path: item.thumbnail_path,
      status: item.status,
    });
    setShowNewsModal(true);
  };

  // Order actions
  const handleConfirmOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "confirm" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(
          orders.map((o) => (o.id === orderId ? { ...o, status: "dikonfirmasi" } : o))
        );
        showNotification("success", `Tiket ${orderId} berhasil dikonfirmasi!`);
      } else {
        showNotification("error", data.error || "Gagal mengonfirmasi tiket.");
      }
    } catch {
      showNotification("error", "Koneksi ke server gagal.");
    }
  };

  const handleRejectOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = rejectModal.orderId;
    const reason = rejectModal.reason;
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", reason }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(
          orders.map((o) =>
            o.id === orderId
              ? { ...o, status: "ditolak", rejection_reason: reason }
              : o
          )
        );
        setRejectModal({ open: false, orderId: "", reason: "" });
        showNotification("success", `Tiket ${orderId} telah ditolak.`);
      } else {
        showNotification("error", data.error || "Gagal menolak tiket.");
      }
    } catch {
      showNotification("error", "Koneksi ke server gagal.");
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesFilter =
      orderFilter === "all" ? true : o.status === orderFilter;
    const matchesSearch =
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.client_name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.company_name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.whatsapp.includes(orderSearch);
    return matchesFilter && matchesSearch;
  });

  const pendingOrdersCount = orders.filter(
    (o) => o.status === "menunggu_konfirmasi"
  ).length;

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs text-primary">Memuat Antarmuka Admin...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-surface-container-lowest border-b border-outline-variant/30 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-8 px-2 bg-white rounded flex items-center justify-center shadow-sm">
                <Image
                  src={siteConfig.logo}
                  alt={siteConfig.name}
                  width={110}
                  height={24}
                  className="h-5 w-auto object-contain"
                />
              </div>
              <span className="text-base font-display font-bold tracking-tight text-on-surface">
                {siteConfig.shortName} <span className="text-primary text-xs font-mono font-semibold">CONSOLE</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded bg-surface-container border border-outline-variant/30 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-on-surface-variant font-medium">{currentUser?.email}</span>
              <span className="px-1.5 py-0.2 rounded bg-primary-container text-on-primary-container text-[10px] font-bold uppercase">
                {currentUser?.role}
              </span>
            </div>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="p-2 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors text-xs flex items-center gap-1 border border-outline-variant/30"
              title="Ganti Password"
            >
              <span className="material-symbols-outlined text-base">lock_reset</span>
              <span className="hidden md:inline">Ganti Password</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="p-2 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors text-xs flex items-center gap-1 border border-outline-variant/30"
              title="Buka Website Publik"
            >
              <span className="material-symbols-outlined text-base">open_in_new</span>
              <span className="hidden md:inline">Lihat Web</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded bg-error-container/20 text-error hover:bg-error-container hover:text-white transition-colors text-xs font-semibold flex items-center gap-1 border border-error/30"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 py-8 w-full flex-grow flex flex-col space-y-6">
        {/* Toast Alert */}
        {alertMsg && (
          <div
            className={`p-3.5 rounded flex items-center gap-2 text-xs font-medium border ${
              alertMsg.type === "success"
                ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                : "bg-error-container/20 border-error/40 text-error"
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {alertMsg.type === "success" ? "check_circle" : "error"}
            </span>
            <span>{alertMsg.text}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 text-xs font-semibold rounded-t flex items-center gap-2 transition-colors border-b-2 ${
              activeTab === "overview"
                ? "border-primary text-primary bg-surface-container/50"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-base">dashboard</span>
            <span>Ikhtisar</span>
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 text-xs font-semibold rounded-t flex items-center gap-2 transition-colors border-b-2 ${
              activeTab === "users"
                ? "border-primary text-primary bg-surface-container/50"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-base">group</span>
            <span>Manajemen User ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("roles")}
            className={`px-4 py-2 text-xs font-semibold rounded-t flex items-center gap-2 transition-colors border-b-2 ${
              activeTab === "roles"
                ? "border-primary text-primary bg-surface-container/50"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-base">badge</span>
            <span>Manajemen Role ({roles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("news")}
            className={`px-4 py-2 text-xs font-semibold rounded-t flex items-center gap-2 transition-colors border-b-2 ${
              activeTab === "news"
                ? "border-primary text-primary bg-surface-container/50"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-base">article</span>
            <span>CRUD Berita ({news.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 text-xs font-semibold rounded-t flex items-center gap-2 transition-colors border-b-2 ${
              activeTab === "orders"
                ? "border-primary text-primary bg-surface-container/50"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-base">receipt_long</span>
            <span>Kelola Pesanan ({orders.length})</span>
            {pendingOrdersCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[10px] font-bold">
                {pendingOrdersCount} baru
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Security Notice for Default Password */}
            <div className="p-4 rounded-lg bg-secondary-container/20 border border-secondary-container/50 text-xs text-primary space-y-1.5 flex items-start gap-3">
              <span className="material-symbols-outlined text-2xl text-primary shrink-0">warning</span>
              <div>
                <strong className="text-sm font-bold block text-white">Peringatan Keamanan Kredensial Awal</strong>
                <span>
                  Jika Anda masih menggunakan password awal (<code className="bg-black/40 px-1 py-0.5 rounded font-mono">123456</code>), segera gunakan tombol <strong>Ganti Password</strong> di pojok kanan atas sebelum website ini di-deploy ke produksi.
                </span>
              </div>
            </div>

            {/* Quick Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div
                onClick={() => setActiveTab("orders")}
                className="p-5 rounded-lg bg-surface-container-low border border-outline-variant/30 hover:border-primary/50 transition-colors cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between text-xs text-on-surface-variant uppercase font-medium">
                  <span>Pesanan / Tiket</span>
                  <span className="material-symbols-outlined text-primary text-lg group-hover:scale-110 transition-transform">receipt_long</span>
                </div>
                <div className="text-3xl font-bold text-on-surface">{orders.length}</div>
                <div className="text-[11px] text-amber-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span>{pendingOrdersCount} Menunggu Konfirmasi</span>
                </div>
              </div>

              <div className="p-5 rounded-lg bg-surface-container-low border border-outline-variant/30 space-y-2">
                <div className="flex items-center justify-between text-xs text-on-surface-variant uppercase font-medium">
                  <span>Total Pengguna</span>
                  <span className="material-symbols-outlined text-primary text-lg">group</span>
                </div>
                <div className="text-3xl font-bold text-on-surface">{users.length}</div>
                <div className="text-[11px] text-on-surface-variant/70 font-mono">
                  {users.filter((u) => u.status === "active").length} Akun Aktif
                </div>
              </div>

              <div className="p-5 rounded-lg bg-surface-container-low border border-outline-variant/30 space-y-2">
                <div className="flex items-center justify-between text-xs text-on-surface-variant uppercase font-medium">
                  <span>Total Role</span>
                  <span className="material-symbols-outlined text-primary text-lg">badge</span>
                </div>
                <div className="text-3xl font-bold text-on-surface">{roles.length}</div>
                <div className="text-[11px] text-on-surface-variant/70 font-mono">
                  {roles.filter((r) => r.is_system).length} Role Bawaan Sistem
                </div>
              </div>

              <div className="p-5 rounded-lg bg-surface-container-low border border-outline-variant/30 space-y-2">
                <div className="flex items-center justify-between text-xs text-on-surface-variant uppercase font-medium">
                  <span>Artikel Berita</span>
                  <span className="material-symbols-outlined text-primary text-lg">article</span>
                </div>
                <div className="text-3xl font-bold text-on-surface">{news.length}</div>
                <div className="text-[11px] text-on-surface-variant/70 font-mono">
                  {news.filter((n) => n.status === "publish").length} Dipublikasikan
                </div>
              </div>

              <div className="p-5 rounded-lg bg-surface-container-low border border-outline-variant/30 space-y-2">
                <div className="flex items-center justify-between text-xs text-on-surface-variant uppercase font-medium">
                  <span>Infrastruktur DB</span>
                  <span className="material-symbols-outlined text-emerald-400 text-lg">database</span>
                </div>
                <div className="text-2xl font-bold text-emerald-400">Google Sheets</div>
                <div className="text-[11px] text-on-surface-variant/70 font-mono">
                  Apps Script Web App Connector Ready
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 rounded-lg bg-surface-container-low border border-outline-variant/30 space-y-4">
              <h3 className="text-sm font-semibold text-on-surface">Pintasan Tindakan Cepat</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setActiveTab("news");
                    openCreateNewsModal();
                  }}
                  className="px-4 py-2.5 rounded bg-primary-container text-on-primary-container font-semibold hover:bg-secondary-container hover:text-white transition-colors text-xs flex items-center gap-1.5 shadow"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  <span>Tulis Artikel Berita Baru</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("roles");
                    setShowRoleModal(true);
                  }}
                  className="px-4 py-2.5 rounded bg-surface-container border border-outline-variant/40 hover:border-primary text-on-surface transition-colors text-xs flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">person_add</span>
                  <span>Tambah Role Kustom</span>
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className="px-4 py-2.5 rounded bg-surface-container border border-outline-variant/40 hover:border-primary text-on-surface transition-colors text-xs flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">manage_accounts</span>
                  <span>Kelola Status Pengguna</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USERS MANAGEMENT */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-base">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Cari nama atau email pengguna..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded pl-9 pr-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
              <div className="text-xs text-on-surface-variant">
                Menampilkan {filteredUsers.length} dari {users.length} pengguna
              </div>
            </div>

            <div className="rounded-lg border border-outline-variant/30 overflow-hidden bg-surface-container-low">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container border-b border-outline-variant/20 text-on-surface-variant uppercase font-semibold">
                    <th className="p-3.5">Nama</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Terdaftar</th>
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-on-surface-variant">
                        Tidak ada pengguna yang cocok dengan kriteria pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-surface-container/50 transition-colors">
                        <td className="p-3.5 font-medium text-on-surface">{u.name}</td>
                        <td className="p-3.5 text-on-surface-variant font-mono">{u.email}</td>
                        <td className="p-3.5">
                          <select
                            value={u.role_id}
                            onChange={(e) => handleChangeUserRole(u.id, e.target.value)}
                            disabled={u.id === currentUser?.id}
                            className="bg-surface-container border border-outline-variant/30 rounded px-2 py-1 text-xs text-on-surface focus:border-primary disabled:opacity-50"
                          >
                            {roles.map((r) => (
                              <option key={r.id} value={r.name}>
                                {r.name.toUpperCase()}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              u.status === "active"
                                ? "bg-emerald-950/40 text-emerald-300 border border-emerald-500/30"
                                : "bg-error-container/20 text-error border border-error/30"
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-on-surface-variant font-mono text-[11px]">
                          {new Date(u.created_at).toLocaleDateString("id-ID")}
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => handleToggleUserStatus(u)}
                            disabled={u.id === currentUser?.id}
                            className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors disabled:opacity-40"
                            title={u.status === "active" ? "Nonaktifkan Pengguna" : "Aktifkan Pengguna"}
                          >
                            <span className="material-symbols-outlined text-base">
                              {u.status === "active" ? "block" : "check_circle"}
                            </span>
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id, u.email)}
                            disabled={u.id === currentUser?.id}
                            className="p-1.5 rounded hover:bg-error-container/20 text-error transition-colors disabled:opacity-40"
                            title="Hapus Pengguna"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ROLES MANAGEMENT */}
        {activeTab === "roles" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-on-surface">Daftar Hak Akses (Roles)</h3>
                <p className="text-xs text-on-surface-variant">
                  Role bawaan sistem tidak dapat dihapus demi keamanan integritas aplikasi.
                </p>
              </div>
              <button
                onClick={() => setShowRoleModal(true)}
                className="px-3.5 py-2 rounded bg-primary-container text-on-primary-container font-semibold hover:bg-secondary-container hover:text-white transition-colors text-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>Tambah Role</span>
              </button>
            </div>

            <div className="rounded-lg border border-outline-variant/30 overflow-hidden bg-surface-container-low">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container border-b border-outline-variant/20 text-on-surface-variant uppercase font-semibold">
                    <th className="p-3.5">Nama Role</th>
                    <th className="p-3.5">Deskripsi</th>
                    <th className="p-3.5">Izin (Permissions)</th>
                    <th className="p-3.5">Tipe</th>
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {roles.map((r) => {
                    const isSys = r.is_system === true || String(r.is_system) === "true";
                    return (
                      <tr key={r.id} className="hover:bg-surface-container/50 transition-colors">
                        <td className="p-3.5 font-bold text-on-surface uppercase font-mono">{r.name}</td>
                        <td className="p-3.5 text-on-surface-variant">{r.description}</td>
                        <td className="p-3.5 font-mono text-[11px] text-primary">{r.permissions}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isSys
                                ? "bg-primary-container/20 text-primary border border-primary/30"
                                : "bg-surface-container text-on-surface border border-outline-variant/30"
                            }`}
                          >
                            {isSys ? "SISTEM BAWAAN" : "KUSTOM"}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          {!isSys && (
                            <button
                              onClick={() => handleDeleteRole(r.id, r.name)}
                              className="p-1.5 rounded hover:bg-error-container/20 text-error transition-colors"
                              title="Hapus Role"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: NEWS CRUD */}
        {activeTab === "news" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-on-surface">Manajemen Berita &amp; Artikel</h3>
                <p className="text-xs text-on-surface-variant">
                  Artikel dengan status &apos;publish&apos; akan langsung tampil di halaman depan website.
                </p>
              </div>
              <button
                onClick={openCreateNewsModal}
                className="px-3.5 py-2 rounded bg-primary-container text-on-primary-container font-semibold hover:bg-secondary-container hover:text-white transition-colors text-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>Tulis Berita Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg bg-surface-container-low border border-outline-variant/30 overflow-hidden flex flex-col group hover:border-primary/40 transition-colors"
                >
                  <div className="relative h-44 overflow-hidden bg-surface-container">
                    <Image
                      src={item.thumbnail_path}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase backdrop-blur-md ${
                          item.status === "publish"
                            ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                            : "bg-surface-container-highest/80 text-on-surface-variant border border-outline-variant/40"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-grow space-y-2">
                    <h4 className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                      {item.excerpt}
                    </p>
                    <div className="pt-2 mt-auto border-t border-outline-variant/15 flex items-center justify-between text-xs">
                      <span className="font-mono text-[11px] text-on-surface-variant/70">
                        {new Date(item.created_at).toLocaleDateString("id-ID")}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditNewsModal(item)}
                          className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
                          title="Ubah Berita"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteNews(item.id, item.title)}
                          className="p-1.5 rounded hover:bg-error-container/20 text-error transition-colors"
                          title="Hapus Berita"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: KELOLA PESANAN & PEMBAYARAN QRIS */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">
                    receipt_long
                  </span>
                  <span>Kelola Tiket Pesanan & Pembayaran QRIS</span>
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Verifikasi bukti transfer QRIS dan kelola jadwal sesi konsultasi klien database Anda.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/booking"
                  target="_blank"
                  className="px-3.5 py-2 rounded bg-surface-container border border-outline-variant/40 hover:border-primary text-xs font-semibold text-on-surface flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                  <span>Form Booking Publik</span>
                </Link>
              </div>
            </div>

            {/* Filter Pills & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {[
                  { key: "all", label: `Semua (${orders.length})` },
                  {
                    key: "menunggu_konfirmasi",
                    label: `Menunggu (${pendingOrdersCount})`,
                  },
                  {
                    key: "dikonfirmasi",
                    label: `Dikonfirmasi (${orders.filter((o) => o.status === "dikonfirmasi").length})`,
                  },
                  {
                    key: "ditolak",
                    label: `Ditolak (${orders.filter((o) => o.status === "ditolak").length})`,
                  },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setOrderFilter(tab.key as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
                      orderFilter === tab.key
                        ? "bg-primary-container text-on-primary-container font-semibold"
                        : "bg-surface-container-low border border-outline-variant/30 text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="relative sm:w-64">
                <input
                  type="text"
                  placeholder="Cari ID tiket, nama, WA..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg pl-8 pr-3 py-1.5 text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-2 text-on-surface-variant/70 text-sm">
                  search
                </span>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-container border-b border-outline-variant/30 text-on-surface-variant uppercase font-mono text-[10px]">
                    <tr>
                      <th className="px-4 py-3">ID Tiket</th>
                      <th className="px-4 py-3">Klien & Instansi</th>
                      <th className="px-4 py-3">Kontak WA</th>
                      <th className="px-4 py-3">Layanan & DB</th>
                      <th className="px-4 py-3">Jadwal</th>
                      <th className="px-4 py-3">Biaya</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/15 text-on-surface">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-12 text-center text-on-surface-variant">
                          <span className="material-symbols-outlined text-4xl block mb-2 text-on-surface-variant/40">
                            receipt_long
                          </span>
                          Tidak ada tiket pesanan yang sesuai dengan filter.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => {
                        const isPending = ord.status === "menunggu_konfirmasi";
                        const isConfirmed = ord.status === "dikonfirmasi";
                        const isRejected = ord.status === "ditolak";
                        const cleanPhone = ord.whatsapp.replace(/[^0-9]/g, "");
                        const waUrl = `https://wa.me/${cleanPhone.startsWith("0") ? "62" + cleanPhone.slice(1) : cleanPhone}?text=${encodeURIComponent(
                          `Halo ${ord.client_name}, kami dari Hafidz's Company terkait tiket konsultasi #${ord.id}.`
                        )}`;

                        return (
                          <tr key={ord.id} className="hover:bg-surface-container/30 transition-colors">
                            <td className="px-4 py-3 font-mono font-bold text-primary whitespace-nowrap">
                              <Link
                                href={`/pesanan/${ord.id}`}
                                target="_blank"
                                className="hover:underline flex items-center gap-1"
                              >
                                <span>{ord.id}</span>
                                <span className="material-symbols-outlined text-[12px] opacity-70">open_in_new</span>
                              </Link>
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-semibold text-on-surface">{ord.client_name}</div>
                              <div className="text-[11px] text-on-surface-variant/80">{ord.company_name || "-"}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="font-mono text-[11px]">{ord.whatsapp}</div>
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] text-emerald-400 hover:underline mt-0.5"
                              >
                                <span className="material-symbols-outlined text-[11px]">chat</span>
                                <span>Chat WA</span>
                              </a>
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-medium text-on-surface">{ord.service_type}</div>
                              <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded bg-surface border border-outline-variant/30 text-[10px] font-mono text-primary">
                                {ord.db_type}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px]">
                              {ord.booking_date}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap font-mono font-semibold text-on-surface">
                              {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(ord.amount)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {isPending && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-semibold text-[10px]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                  Menunggu
                                </span>
                              )}
                              {isConfirmed && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-semibold text-[10px]">
                                  <span className="material-symbols-outlined text-[12px]">check</span>
                                  Dikonfirmasi
                                </span>
                              )}
                              {isRejected && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container/20 border border-error/40 text-error font-semibold text-[10px]" title={ord.rejection_reason}>
                                  <span className="material-symbols-outlined text-[12px]">cancel</span>
                                  Ditolak
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                {isPending && (
                                  <>
                                    <button
                                      onClick={() => handleConfirmOrder(ord.id)}
                                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px] flex items-center gap-1 transition-colors"
                                      title="Konfirmasi Pembayaran QRIS"
                                    >
                                      <span className="material-symbols-outlined text-xs">check_circle</span>
                                      <span>Konfirmasi</span>
                                    </button>
                                    <button
                                      onClick={() => setRejectModal({ open: true, orderId: ord.id, reason: "" })}
                                      className="px-2 py-1 rounded bg-error-container/20 hover:bg-error-container text-error hover:text-white font-medium text-[11px] transition-colors border border-error/30"
                                      title="Tolak Tiket"
                                    >
                                      Tolak
                                    </button>
                                  </>
                                )}
                                <Link
                                  href={`/pesanan/${ord.id}`}
                                  target="_blank"
                                  className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
                                  title="Lihat Detail QRIS & Tiket"
                                >
                                  <span className="material-symbols-outlined text-sm">visibility</span>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: CHANGE PASSWORD */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">lock_reset</span>
                <span>Ganti Password Akun</span>
              </h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-on-surface-variant mb-1 font-medium">Password Saat Ini</label>
                <input
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-on-surface-variant mb-1 font-medium">Password Baru (Min. 6 Karakter)</label>
                <input
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-on-surface-variant mb-1 font-medium">Konfirmasi Password Baru</label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-3.5 py-2 rounded bg-surface-container text-on-surface font-medium hover:bg-surface-bright transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-4 py-2 rounded bg-primary-container text-on-primary-container font-semibold hover:bg-secondary-container hover:text-white transition-colors disabled:opacity-50"
                >
                  {passwordLoading ? "Menyimpan..." : "Simpan Password Baru"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD ROLE */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">badge</span>
                <span>Tambah Role Kustom</span>
              </h3>
              <button onClick={() => setShowRoleModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-on-surface-variant mb-1 font-medium">Nama Role (misal: editor, supervisor)</label>
                <input
                  type="text"
                  required
                  value={newRoleForm.name}
                  onChange={(e) => setNewRoleForm({ ...newRoleForm, name: e.target.value })}
                  placeholder="editor"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-on-surface-variant mb-1 font-medium">Deskripsi Tugas</label>
                <input
                  type="text"
                  value={newRoleForm.description}
                  onChange={(e) => setNewRoleForm({ ...newRoleForm, description: e.target.value })}
                  placeholder="Mengelola artikel dan konten publik"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-on-surface-variant mb-1 font-medium">Daftar Izin (Pisahkan koma)</label>
                <input
                  type="text"
                  value={newRoleForm.permissions}
                  onChange={(e) => setNewRoleForm({ ...newRoleForm, permissions: e.target.value })}
                  placeholder="create_news,edit_news,view_reports"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
                  className="px-3.5 py-2 rounded bg-surface-container text-on-surface font-medium hover:bg-surface-bright transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-primary-container text-on-primary-container font-semibold hover:bg-secondary-container hover:text-white transition-colors"
                >
                  Simpan Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT NEWS */}
      {showNewsModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-6 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">article</span>
                <span>{editingNewsId ? "Ubah Artikel Berita" : "Tulis Artikel Berita Baru"}</span>
              </h3>
              <button onClick={() => setShowNewsModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveNews} className="space-y-4 text-xs">
              <div>
                <label className="block text-on-surface-variant mb-1 font-medium">Judul Berita</label>
                <input
                  type="text"
                  required
                  value={newsForm.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const autoSlug = title
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)+/g, "");
                    setNewsForm({ ...newsForm, title, slug: autoSlug });
                  }}
                  placeholder="Contoh: Optimasi Arsitektur Partitioning Table PostgreSQL"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded px-3 py-2 text-on-surface focus:outline-none focus:border-primary text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-on-surface-variant mb-1 font-medium">Slug URL</label>
                  <input
                    type="text"
                    required
                    value={newsForm.slug}
                    onChange={(e) => setNewsForm({ ...newsForm, slug: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded px-3 py-2 text-on-surface font-mono"
                  />
                </div>
                <div>
                  <label className="block text-on-surface-variant mb-1 font-medium">Status Publikasi</label>
                  <select
                    value={newsForm.status}
                    onChange={(e) => setNewsForm({ ...newsForm, status: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded px-3 py-2 text-on-surface"
                  >
                    <option value="publish">Publish (Tampil di Landing Page)</option>
                    <option value="draft">Draft (Disimpan Internal)</option>
                  </select>
                </div>
              </div>

              {/* Thumbnail Media Upload */}
              <div>
                <label className="block text-on-surface-variant mb-1 font-medium">Gambar Thumbnail</label>
                <div className="flex items-center gap-4">
                  <div className="relative w-28 h-20 rounded border border-outline-variant/30 overflow-hidden bg-surface-container shrink-0">
                    <Image
                      src={newsForm.thumbnail_path}
                      alt="Thumbnail Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleUploadImage}
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={uploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded bg-surface-container border border-outline-variant/40 hover:border-primary text-on-surface transition-colors text-xs flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">cloud_upload</span>
                      <span>{uploadingImage ? "Mengunggah..." : "Pilih File Gambar Baru"}</span>
                    </button>
                    <p className="text-[11px] text-on-surface-variant/70">
                      Tersimpan secara lokal di folder <code className="font-mono">public/uploads/</code> (Maks. 5MB).
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-on-surface-variant mb-1 font-medium">Ringkasan (Excerpt)</label>
                <textarea
                  rows={2}
                  required
                  value={newsForm.excerpt}
                  onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                  placeholder="Ringkasan 1-2 kalimat untuk kartu depan..."
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded px-3 py-2 text-on-surface"
                />
              </div>

              <div>
                <label className="block text-on-surface-variant mb-1 font-medium">Konten Lengkap</label>
                <textarea
                  rows={5}
                  value={newsForm.content}
                  onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                  placeholder="Tuliskan ulasan teknis mendalam di sini..."
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded px-3 py-2 text-on-surface font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowNewsModal(false)}
                  className="px-4 py-2 rounded bg-surface-container text-on-surface font-medium hover:bg-surface-bright transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-primary-container text-on-primary-container font-semibold hover:bg-secondary-container hover:text-white transition-colors"
                >
                  {editingNewsId ? "Perbarui Artikel" : "Simpan & Publikasikan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REJECT ORDER */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface-container-lowest border border-error/40 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-lg">cancel</span>
                <span>Tolak / Batalkan Tiket {rejectModal.orderId}</span>
              </h3>
              <button
                onClick={() => setRejectModal({ open: false, orderId: "", reason: "" })}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handleRejectOrder} className="space-y-4 text-xs">
              <div>
                <label className="block text-on-surface-variant mb-1 font-medium">
                  Alasan Penolakan / Pembatalan
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectModal.reason}
                  onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                  placeholder="Contoh: Bukti transfer QRIS tidak terverifikasi atau jadwal bentrok dengan deployment nasabah lain."
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded px-3 py-2 text-on-surface focus:outline-none focus:border-error"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setRejectModal({ open: false, orderId: "", reason: "" })}
                  className="px-4 py-2 rounded bg-surface-container text-on-surface font-medium hover:bg-surface-bright transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-error text-white font-semibold hover:bg-red-700 transition-colors"
                >
                  Konfirmasi Tolak Tiket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

