import { NextRequest } from "next/server";
import { dbConnect } from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    return new Response("MongoDB Connected ✅", { status: 200 });
  } catch (err) {
    return new Response("MongoDB Connection Failed ❌", { status: 500 });
  }
}
