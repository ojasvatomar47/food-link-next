import { NextRequest } from "next/server";
import { login } from "@/controllers/authController";

export async function POST(req: NextRequest) {
  return login(req);
}
