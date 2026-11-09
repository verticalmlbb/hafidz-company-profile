import { NextResponse } from "next/server";
import { getCurrentUser, verifyPassword, hashPassword } from "@/lib/auth";
import { db, UserRecord } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ success: false, error: "Harap login terlebih dahulu." }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Password saat ini dan password baru wajib diisi." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password baru minimal 6 karakter." },
        { status: 400 }
      );
    }

    const users = await db.query<UserRecord>("Users", { id: session.id });
    if (users.length === 0) {
      return NextResponse.json({ success: false, error: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    const user = users[0];
    const isCurrentMatch = await verifyPassword(currentPassword, user.password_hash);
    if (!isCurrentMatch) {
      return NextResponse.json(
        { success: false, error: "Password saat ini tidak sesuai." },
        { status: 400 }
      );
    }

    const newHash = await hashPassword(newPassword);
    await db.update("Users", user.id, { password_hash: newHash });

    return NextResponse.json({
      success: true,
      message: "Password berhasil diperbarui.",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: `Gagal memperbarui password: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    );
  }
}
