import { NextResponse } from "next/server";
import { db, UserRecord } from "@/lib/db";
import { hashPassword, setAuthCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Nama, email, dan password wajib diisi." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password minimal terdiri dari 6 karakter." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Cek apakah email sudah terdaftar
    const existingUsers = await db.query<UserRecord>("Users", { email: normalizedEmail });
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { success: false, error: "Email sudah terdaftar. Silakan gunakan email lain atau langsung login." },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    const now = new Date().toISOString();

    const newUser = await db.insert<UserRecord>("Users", {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: String(name).trim(),
      email: normalizedEmail,
      password_hash: hashedPassword,
      role_id: "user", // Default register selalu user
      status: "active",
      created_at: now,
      updated_at: now,
    });

    const userSession = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role_id,
    };

    await setAuthCookie(userSession);

    return NextResponse.json({
      success: true,
      message: "Pendaftaran berhasil.",
      user: userSession,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: `Terjadi kesalahan saat pendaftaran: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    );
  }
}
