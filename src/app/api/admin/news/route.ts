import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, NewsRecord } from "@/lib/db";
import { deleteFile } from "@/lib/storage";

async function verifyAdmin() {
  const session = await getCurrentUser();
  if (!session || session.role !== "admin") {
    return null;
  }
  return session;
}

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Akses ditolak: Hanya admin yang diizinkan." }, { status: 403 });
  }

  const news = await db.query<NewsRecord>("News");
  // Urutkan dari yang terbaru
  news.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return NextResponse.json({ success: true, data: news });
}

export async function POST(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Akses ditolak: Hanya admin yang diizinkan." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { title, slug, excerpt, content, thumbnail_path, status } = body;

    if (!title) {
      return NextResponse.json({ success: false, error: "Judul berita wajib diisi." }, { status: 400 });
    }

    const autoSlug =
      slug ||
      String(title)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const newArticle = await db.insert<NewsRecord>("News", {
      id: `news_${Date.now()}`,
      title: String(title).trim(),
      slug: autoSlug,
      excerpt: excerpt || "",
      content: content || "",
      thumbnail_path: thumbnail_path || "/images/news-1.svg",
      status: status || "draft",
      author_id: admin.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, data: newArticle });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Akses ditolak: Hanya admin yang diizinkan." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, title, slug, excerpt, content, thumbnail_path, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "ID berita wajib ada." }, { status: 400 });
    }

    const updateData: Partial<NewsRecord> = {};
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) updateData.content = content;
    if (thumbnail_path !== undefined) updateData.thumbnail_path = thumbnail_path;
    if (status !== undefined) updateData.status = status;

    await db.update("News", id, updateData);
    return NextResponse.json({ success: true, message: "Berita berhasil diperbarui." });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Akses ditolak: Hanya admin yang diizinkan." }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID berita wajib ada." }, { status: 400 });
    }

    const existing = await db.query<NewsRecord>("News", { id });
    if (existing.length > 0 && existing[0].thumbnail_path) {
      // Hapus file media lokal jika tersimpan di /uploads/
      await deleteFile(existing[0].thumbnail_path);
    }

    await db.delete("News", id);
    return NextResponse.json({ success: true, message: "Berita berhasil dihapus." });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

