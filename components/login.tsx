"use client";

import { useState } from "react";
import { useAuth, type UserType } from "@/lib/auth-context";
import { Mail, Lock, LogIn, Heart } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedType, setSelectedType] = useState<UserType>("patient");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError("Please fill in all fields");
        return;
      }
      await login(email, password, selectedType);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white to-blue-50">
      <div className="w-full max-w-md">
        <div className="hospital-card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-8 h-8 text-red-600" />
              <h1 className="text-2xl font-bold text-blue-900">
                Hospital Care
              </h1>
            </div>
            <p className="text-gray-600">Professional Healthcare Management</p>
          </div>

          {/* User Type Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {["patient", "frontdesk"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type as UserType)}
                className={`py-2 px-3 rounded-lg font-medium transition-all ${
                  selectedType === type
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-blue-50 text-gray-700 hover:bg-blue-100 border border-blue-200"
                }`}
              >
                {type === "frontdesk"
                  ? "Front Desk"
                  : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-blue-600" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="hospital-input w-full pl-10"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-blue-600" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="hospital-input w-full pl-10"
                disabled={isLoading}
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <LogIn className="w-5 h-5" />
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Demo Notice */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-gray-600 text-center">
              Demo mode: Use any email and password. Try{" "}
              <strong>patient</strong> or <strong>frontdesk</strong> roles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
