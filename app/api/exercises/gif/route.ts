import { NextResponse } from "next/server";
import { mapToEnglish } from "@/lib/exercise-mapping";

export const revalidate = 86400; // 24h cache

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const apiKey = process.env.EXERCISEDB_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ gifUrl: null, reason: "no_api_key" });
  }

  const englishName = mapToEnglish(name);

  try {
    const res = await fetch(
      `https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(englishName)}?limit=1&offset=0`,
      {
        headers: {
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
        },
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ gifUrl: null, reason: "api_error" });
    }

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ gifUrl: null, reason: "not_found" });
    }

    return NextResponse.json({ gifUrl: data[0].gifUrl ?? null });
  } catch {
    return NextResponse.json({ gifUrl: null, reason: "fetch_error" });
  }
}
