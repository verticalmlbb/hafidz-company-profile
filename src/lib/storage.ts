import fs from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export interface SaveFileResult {
  success: boolean;
  path?: string;
  error?: string;
}

/**
 * Menyimpan file yang diunggah ke folder lokal `public/uploads/`
 */
export async function saveFile(file: File): Promise<SaveFileResult> {
  try {
    if (!file) {
      return { success: false, error: "File tidak ditemukan." };
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        success: false,
        error: "Format file tidak didukung. Harap unggah gambar JPG, PNG, WEBP, atau SVG.",
      };
    }

    if (file.size > MAX_SIZE_BYTES) {
      return {
        success: false,
        error: "Ukuran file melebihi batas maksimum 5MB.",
      };
    }

    // Pastikan folder public/uploads/ ada
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    // Tentukan ekstensi
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${extension}`;
    const destinationPath = path.join(UPLOAD_DIR, uniqueName);

    // Tulis buffer ke disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(destinationPath, buffer);

    return {
      success: true,
      path: `/uploads/${uniqueName}`,
    };
  } catch (err) {
    return {
      success: false,
      error: `Gagal menyimpan file: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Menghapus file lokal yang sebelumnya diunggah
 */
export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    if (!filePath || !filePath.startsWith("/uploads/")) {
      return false;
    }
    const fileName = path.basename(filePath);
    const fullPath = path.join(UPLOAD_DIR, fileName);
    await fs.unlink(fullPath);
    return true;
  } catch {
    return false;
  }
}

