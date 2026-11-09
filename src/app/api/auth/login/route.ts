import { NextResponse } from "next/server";
import { db, UserRecord } from "@/lib/db";
import { verifyPassword, setAuthCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const users = await db.query<UserRecord>("Users", { email: normalizedEmail });

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, error: "Email atau password yang Anda masukkan salah." },
        { status: 401 }
      );
    }

    const user = users[0];

    // Cek status aktif
    if (user.status === "inactive") {
      return NextResponse.json(
        { success: false, error: "Akun Anda telah dinonaktifkan oleh Administrator." },
        { status: 403 }
      );
    }

    // Verifikasi hash password
    const isMatch = await verifyPassword(password, user.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Email atau password yang Anda masukkan salah." },
        { status: 401 }
      );
    }

    // Set cookie sesi
    const userSession = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role_id,
    };

    await setAuthCookie(userSession);

    return NextResponse.json({
      success: true,
      message: "Login berhasil.",
      user: userSession,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: `Terjadi kesalahan internal: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    );
  }
}
