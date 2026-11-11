import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, OrderRecord } from "@/lib/db";

// GET /api/orders - Daftar pesanan/tiket milik user yang sedang login
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const allOrders = await db.query<OrderRecord>("Orders", { user_id: user.id });
    // Urutkan pesanan terbaru di atas
    const sorted = [...allOrders].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({ success: true, orders: sorted });
  } catch (err: any) {
    console.error("GET /api/orders error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal memuat daftar tiket pesanan." },
      { status: 500 }
    );
  }
}

// POST /api/orders - Buat tiket pesanan/booking baru
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Silakan login terlebih dahulu untuk melakukan pemesanan." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      client_name,
      company_name,
      whatsapp,
      service_type,
      db_type,
      booking_date,
      notes,
    } = body;

    // Validasi input
    if (!client_name || typeof client_name !== "string" || client_name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Nama pemesan minimal 2 karakter." },
        { status: 400 }
      );
    }

    if (!whatsapp || typeof whatsapp !== "string" || !/^[0-9+\s\-]{8,20}$/.test(whatsapp.trim())) {
      return NextResponse.json(
        { success: false, error: "Nomor WhatsApp tidak valid (minimal 8 digit angka)." },
        { status: 400 }
      );
    }

    if (!service_type || typeof service_type !== "string") {
      return NextResponse.json(
        { success: false, error: "Silakan pilih jenis layanan konsultasi." },
        { status: 400 }
      );
    }

    if (!db_type || typeof db_type !== "string") {
      return NextResponse.json(
        { success: false, error: "Silakan pilih tipe database." },
        { status: 400 }
      );
    }

    if (!booking_date || typeof booking_date !== "string") {
      return NextResponse.json(
        { success: false, error: "Silakan pilih rencana tanggal konsultasi." },
        { status: 400 }
      );
    }

    // Tentukan biaya estimasi (flat tier konsultasi database)
    let amount = 2500000;
    if (service_type.toLowerCase().includes("emergency")) {
      amount = 4500000;
    } else if (service_type.toLowerCase().includes("arsitektur")) {
      amount = 3800000;
    }

    const timestamp = Date.now().toString().slice(-6);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const orderId = `ORD-${dateStr}-${timestamp}`;
    const now = new Date().toISOString();

    const newOrder: OrderRecord = {
      id: orderId,
      user_id: user.id,
      user_email: user.email,
      client_name: client_name.trim(),
      company_name: (company_name || "").trim() || "-",
      whatsapp: whatsapp.trim(),
      service_type: service_type.trim(),
      db_type: db_type.trim(),
      booking_date: booking_date.trim(),
      notes: (notes || "").trim() || "-",
      amount,
      status: "menunggu_konfirmasi",
      rejection_reason: "",
      created_at: now,
      updated_at: now,
    };

    const inserted = await db.insert<OrderRecord>("Orders", newOrder);
    if (!inserted) {
      return NextResponse.json(
        { success: false, error: "Gagal menyimpan tiket pemesanan ke database." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tiket pesanan berhasil dibuat. Silakan lakukan pembayaran QRIS.",
      order: newOrder,
    });
  } catch (err: any) {
    console.error("POST /api/orders error:", err);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan internal saat membuat pesanan." },
      { status: 500 }
    );
  }
}

