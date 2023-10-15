import { NextRequest, NextResponse } from "next/server";

const words = Array.from({ length: 25 }, (_, i) => `dummy.${i + 1}`);

export function GET(req: NextRequest) {
  const res = NextResponse.json({ data: words });
  return res;
}
