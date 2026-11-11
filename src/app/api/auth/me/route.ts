import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null });
    }
    return NextResponse.json({ authenticated: true, user });
  } catch (err) {
    return NextResponse.json(
      { authenticated: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

