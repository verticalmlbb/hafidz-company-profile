import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, OrderRecord } from "@/lib/db";

// POST /api/admin/orders/[id]/status - Konfirmasi atau tolak pesanan
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Akses ditolak: Hanya admin yang diizinkan." },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await req.json();
    const { action, reason } = body; // action: "confirm" | "reject"

    if (action !== "confirm" && action !== "reject") {
      return NextResponse.json(
        { success: false, error: "Aksi status tidak valid. Gunakan 'confirm' atau 'reject'." },
        { status: 400 }
      );
    }

    const orders = await db.query<OrderRecord>("Orders", { id });
    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { success: false, error: "Tiket pesanan tidak ditemukan." },
        { status: 404 }
      );
    }

    const newStatus = action === "confirm" ? "dikonfirmasi" : "ditolak";
    const updateData: Partial<OrderRecord> = {
      status: newStatus,
      rejection_reason: action === "reject" ? (reason || "Dibatalkan oleh administrator").trim() : "",
      updated_at: new Date().toISOString(),
    };

    const updated = await db.update("Orders", id, updateData);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Gagal memperbarui status tiket di database." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Status tiket berhasil diubah menjadi '${newStatus}'.`,
      status: newStatus,
    });
  } catch (err: any) {
    console.error("POST /api/admin/orders/[id]/status error:", err);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan saat memproses status tiket." },
      { status: 500 }
    );
  }
}

