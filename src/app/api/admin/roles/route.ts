import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, RoleRecord } from "@/lib/db";

async function verifyAdmin() {
  const session = await getCurrentUser();
  if (!session || session.role !== "admin") {
    return null;
  }
  return session;
}

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Akses ditolak: Hanya admin yang diizinkan." }, { status: 403 });
  }

  const roles = await db.query<RoleRecord>("Roles");
  return NextResponse.json({ success: true, data: roles });
}

export async function POST(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Akses ditolak: Hanya admin yang diizinkan." }, { status: 403 });
  }

  try {
    const { name, description, permissions } = await req.json();

    if (!name) {
      return NextResponse.json({ success: false, error: "Nama role wajib diisi." }, { status: 400 });
    }

    const cleanName = String(name).toLowerCase().trim().replace(/\s+/g, "_");
    const existing = await db.query<RoleRecord>("Roles", { name: cleanName });
    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: "Role dengan nama tersebut sudah ada." }, { status: 409 });
    }

    const newRole = await db.insert<RoleRecord>("Roles", {
      id: `role_${cleanName}`,
      name: cleanName,
      description: description || "",
      permissions: permissions || "read_only",
      is_system: false,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, data: newRole });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Akses ditolak: Hanya admin yang diizinkan." }, { status: 403 });
  }

  try {
    const { id, description, permissions } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: "ID role wajib ada." }, { status: 400 });
    }

    const roles = await db.query<RoleRecord>("Roles", { id });
    if (roles.length === 0) {
      return NextResponse.json({ success: false, error: "Role tidak ditemukan." }, { status: 404 });
    }

    const role = roles[0];
    const updateData: Partial<RoleRecord> = {};
    if (description !== undefined) updateData.description = description;
    if (permissions !== undefined) updateData.permissions = permissions;

    await db.update("Roles", id, updateData);
    return NextResponse.json({ success: true, message: "Role berhasil diperbarui." });
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
      return NextResponse.json({ success: false, error: "ID role wajib ada." }, { status: 400 });
    }

    const roles = await db.query<RoleRecord>("Roles", { id });
    if (roles.length === 0) {
      return NextResponse.json({ success: false, error: "Role tidak ditemukan." }, { status: 404 });
    }

    const role = roles[0];
    if (role.is_system === true || String(role.is_system) === "true") {
      return NextResponse.json(
        { success: false, error: "Role sistem bawaan (admin & user) tidak dapat dihapus." },
        { status: 400 }
      );
    }

    await db.delete("Roles", id);
    return NextResponse.json({ success: true, message: "Role berhasil dihapus." });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

