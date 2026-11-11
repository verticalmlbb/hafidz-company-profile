import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, OrderRecord } from "@/lib/db";

// GET /api/admin/orders - Ambil semua tiket pesanan untuk dashboard admin
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Akses ditolak: Hanya admin yang diizinkan." },
        { status: 403 }
      );
    }

    const allOrders = await db.query<OrderRecord>("Orders");
    const sorted = [...allOrders].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({ success: true, orders: sorted });
  } catch (err: any) {
    console.error("GET /api/admin/orders error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal memuat seluruh tiket pesanan." },
      { status: 500 }
    );
  }
}

