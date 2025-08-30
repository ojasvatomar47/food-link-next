"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/features/store";
import { setUser, clearUser } from "@/features/auth/authSlice";

export default function Home() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <main className="flex flex-col items-center justify-center h-screen gap-3">
      <h1 className="text-2xl font-bold">Redux Test</h1>
      <p>{user ? `User: ${user}` : "No User"}</p>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => dispatch(setUser("Ojasva"))}
      >
        Set User
      </button>
      <button
        className="px-4 py-2 bg-gray-300 rounded"
        onClick={() => dispatch(clearUser())}
      >
        Clear User
      </button>
    </main>
  );
}
