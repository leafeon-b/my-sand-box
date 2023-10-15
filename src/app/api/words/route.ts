import fsPromises from "fs/promises";
import path from "path";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const filePath = path.join(process.cwd(), "src/app/api/words/words.txt");
  const data = await fsPromises.readFile(filePath, "utf-8");
  const words = data.split("\n").filter((word) => word.trim() !== ""); // 空の行または空白のみの行をフィルタリング

  const res = NextResponse.json({ data: words });
  return res;
}
