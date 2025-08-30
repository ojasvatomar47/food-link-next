import { NextRequest } from "next/server";
import { register } from "@/controllers/authController";

export async function POST(req: NextRequest) {
  return register(req);
}
