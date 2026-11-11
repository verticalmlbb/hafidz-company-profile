import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, UserRecord } from "@/lib/db";

async function verifyAdmin() {
  const session = await getCurrentUser();
  if (!session || session.role !== "admin") {
    return null;
  }
  return session;
}

export async function GET(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Akses ditolak: Hanya admin yang diizinkan." }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase().trim();

  const allUsers = await db.query<UserRecord>("Users");
  const sanitized = allUsers.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role_id: u.role_id,
    status: u.status,
    created_at: u.created_at,
    updated_at: u.updated_at,
  }));

  if (!q) {
    return NextResponse.json({ success: true, data: sanitized });
  }

  const filtered = sanitized.filter(
    (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  );

  return NextResponse.json({ success: true, data: filtered });
}

export async function PUT(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Akses ditolak: Hanya admin yang diizinkan." }, { status: 403 });
  }

  try {
    const { id, role_id, status } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: "ID pengguna wajib ada." }, { status: 400 });
    }

    const targetUsers = await db.query<UserRecord>("Users", { id });
    if (targetUsers.length === 0) {
      return NextResponse.json({ success: false, error: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    const targetUser = targetUsers[0];

    // Proteksi: Admin tidak boleh menonaktifkan atau mengubah role dirinya sendiri
    if (targetUser.id === admin.id) {
      if (status && status !== "active") {
        return NextResponse.json(
          { success: false, error: "Anda tidak dapat menonaktifkan akun admin Anda sendiri." },
          { status: 400 }
        );
      }
      if (role_id && role_id !== "admin") {
        return NextResponse.json(
          { success: false, error: "Anda tidak dapat mencabut hak akses admin dari diri Anda sendiri." },
          { status: 400 }
        );
      }
    }

    // Proteksi: Jangan biarkan admin aktif terakhir dinonaktifkan atau diturunkan role-nya
    if ((status === "inactive" || (role_id && role_id !== "admin")) && targetUser.role_id === "admin") {
      const allUsers = await db.query<UserRecord>("Users");
      const activeAdmins = allUsers.filter((u) => u.role_id === "admin" && u.status === "active");
      if (activeAdmins.length <= 1) {
        return NextResponse.json(
          { success: false, error: "Tindakan ditolak: Sistem harus menyisakan minimal satu akun admin aktif." },
          { status: 400 }
        );
      }
    }

    const updateData: Partial<UserRecord> = {};
    if (role_id) updateData.role_id = role_id;
    if (status) updateData.status = status;

    await db.update("Users", id, updateData);
    return NextResponse.json({ success: true, message: "Data pengguna berhasil diperbarui." });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Akses ditolak: Hanya admin yang diizinkan." }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID pengguna wajib ada." }, { status: 400 });
    }

    if (id === admin.id) {
      return NextResponse.json(
        { success: false, error: "Anda tidak dapat menghapus akun admin Anda sendiri." },
        { status: 400 }
      );
    }

    const targetUsers = await db.query<UserRecord>("Users", { id });
    if (targetUsers.length === 0) {
      return NextResponse.json({ success: false, error: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    const targetUser = targetUsers[0];
    if (targetUser.role_id === "admin") {
      const allUsers = await db.query<UserRecord>("Users");
      const activeAdmins = allUsers.filter((u) => u.role_id === "admin" && u.status === "active");
      if (activeAdmins.length <= 1) {
        return NextResponse.json(
          { success: false, error: "Tindakan ditolak: Tidak dapat menghapus admin terakhir." },
          { status: 400 }
        );
      }
    }

    await db.delete("Users", id);
    return NextResponse.json({ success: true, message: "Pengguna berhasil dihapus." });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

