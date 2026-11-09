import { NextResponse } from "next/server";
import { db, NewsRecord } from "@/lib/db";

export async function GET() {
  try {
    const news = await db.query<NewsRecord>("News", { status: "publish" });
    // Urutkan dari yang terbaru
    news.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return NextResponse.json({ success: true, data: news });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
