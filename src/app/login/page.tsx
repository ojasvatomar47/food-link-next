"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/features/store";
import { loginUser } from "@/features/auth/authSlice";

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-3">
      <h1 className="text-2xl font-bold">Login</h1>
      {user && <p>Logged in as {user.username}</p>}
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded"
      />
      <button
        disabled={loading}
        onClick={handleLogin}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}
