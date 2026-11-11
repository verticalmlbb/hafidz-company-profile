import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, OrderRecord } from "@/lib/db";

// GET /api/orders/[id] - Detail spesifik satu tiket pesanan
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const { id } = params;
    const orders = await db.query<OrderRecord>("Orders", { id });
    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { success: false, error: "Tiket pesanan tidak ditemukan." },
        { status: 404 }
      );
    }

    const order = orders[0];

    // Keamanan: Hanya pemilik tiket atau admin yang berhak melihat
    if (order.user_id !== user.id && user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Anda tidak memiliki akses ke tiket ini." },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    console.error("GET /api/orders/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data tiket pesanan." },
      { status: 500 }
    );
  }
}

