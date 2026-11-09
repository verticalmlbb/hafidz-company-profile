import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const AUTH_COOKIE_NAME = "hafidz_auth_token";
const DEFAULT_SECRET = "hafidz_company_secure_jwt_secret_token_2026";
const SECRET_KEY = new TextEncoder().encode(process.env.AUTH_SECRET || DEFAULT_SECRET);

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | string;
}

/**
 * Hash password dengan bcrypt
 */
export async function hashPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, 10);
}

/**
 * Cek kesesuaian password polos dengan hash di database
 */
export async function verifyPassword(plainText: string, hashed: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plainText, hashed);
  } catch {
    return false;
  }
}

/**
 * Membuat token JWT bertanda tangan
 */
export async function createSessionToken(user: UserSession): Promise<string> {
  return new SignJWT({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);
}

/**
 * Memvalidasi dan membaca payload token JWT
 */
export async function verifySessionToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return {
      id: String(payload.id),
      name: String(payload.name),
      email: String(payload.email),
      role: String(payload.role),
    };
  } catch {
    return null;
  }
}

/**
 * Menyimpan sesi login ke httpOnly Cookie
 */
export async function setAuthCookie(user: UserSession): Promise<void> {
  const token = await createSessionToken(user);
  cookies().set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 hari
  });
}

/**
 * Menghapus cookie sesi saat logout
 */
export async function clearAuthCookie(): Promise<void> {
  cookies().delete(AUTH_COOKIE_NAME);
}

/**
 * Mendapatkan pengguna yang sedang login saat ini di server
 */
export async function getCurrentUser(): Promise<UserSession | null> {
  const cookie = cookies().get(AUTH_COOKIE_NAME);
  if (!cookie || !cookie.value) return null;
  return verifySessionToken(cookie.value);
}
