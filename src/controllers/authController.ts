import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { dbConnect } from "@/lib/dbConnect";

const JWT_SECRET = process.env.JWT_SECRET!; // set in .env.local

export async function register(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
  const { username, email, password, userType, verificationCode, latitude, longitude, locationName } = body;

  if (!username || !email || !password || !userType || !verificationCode || !latitude || !longitude) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) return NextResponse.json({ error: "Email already in use" }, { status: 409 });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    userType,
    verificationCode,
    latitude,
    longitude,
    locationName,
  });

  return NextResponse.json({
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      userType: user.userType,
    },
  }, { status: 201 });
}

export async function login(req: NextRequest) {
  await dbConnect();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: "Email not registered" }, { status: 401 });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return NextResponse.json({ error: "Invalid password" }, { status: 401 });

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

  return NextResponse.json({
    token,
    user: { id: user._id, username: user.username, email: user.email, userType: user.userType },
  });
}

export async function logout() {
  // With JWT, frontend can just delete token. You can also implement cookie clearing if needed.
  return NextResponse.json({ message: "Logged out" });
}
