import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { saveFile } from "@/lib/storage";

export async function POST(req: Request) {
  const session = await getCurrentUser();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ success: false, error: "Akses ditolak: Hanya admin yang diizinkan mengunggah file." }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "File tidak ditemukan dalam form data." }, { status: 400 });
    }

    const result = await saveFile(file);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      path: result.path,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
