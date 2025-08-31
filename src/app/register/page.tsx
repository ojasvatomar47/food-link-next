"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { registerUser } from "@/features/auth/authSlice";
import { AppDispatch, RootState } from "@/features/store";
import toast from "react-hot-toast";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    userType: "Restaurant",
    verificationCode: "",
    latitude: 0,
    longitude: 0,
    locationName: "",
  });

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading } = useSelector((state: RootState) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
          toast.success("Location fetched successfully!");
        },
        (error) => {
          toast.error("Error getting location. Please enter manually.");
          console.error("Geolocation error:", error);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(resultAction)) {
      toast.success("Registration successful! Please log in.");
      router.push("/login");
    } else if (registerUser.rejected.match(resultAction)) {
      toast.error(resultAction.payload as string);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-lg">
        <h1 className="text-center text-3xl font-bold text-gray-800">Create an Account</h1>
        <p className="mt-2 text-center text-gray-500">Join our community to share and receive food</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Username</label>
              <input type="text" name="username" value={form.username} onChange={handleChange} required className="block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-green-500 focus:ring-green-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required className="block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-green-500 focus:ring-green-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required className="block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-green-500 focus:ring-green-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">User Type</label>
              <select name="userType" value={form.userType} onChange={handleChange} required className="block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-green-500 focus:ring-green-500">
                <option value="Restaurant">Restaurant</option>
                <option value="Charity/NGO">Charity/NGO</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Verification Code</label>
              <input type="text" name="verificationCode" value={form.verificationCode} onChange={handleChange} required className="block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-green-500 focus:ring-green-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Location Name (Optional)</label>
              <input type="text" name="locationName" value={form.locationName} onChange={handleChange} className="block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-green-500 focus:ring-green-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Latitude</label>
              <input type="number" name="latitude" value={form.latitude} onChange={handleChange} required className="block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-green-500 focus:ring-green-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Longitude</label>
              <input type="number" name="longitude" value={form.longitude} onChange={handleChange} required className="block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-green-500 focus:ring-green-500" />
            </div>
          </div>
          <button
            type="button"
            onClick={handleGetLocation}
            className="w-full rounded-md bg-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Get My Current Location
          </button>
          <button
            type="submit"
            className="w-full rounded-md bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-green-600 hover:text-green-700">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}