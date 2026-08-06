"use client";

import { useState } from "react";
import { useAuth, type UserType } from "@/lib/auth-context";
import { Mail, Lock, LogIn, Heart, User, X, Eye, EyeOff } from "lucide-react";
import "@/app/globals.css";
import { useToast } from "@/hooks/use-toast";

export default function Login({ onClose }: { onClose?: () => void }) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedType, setSelectedType] = useState<UserType>("admin");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!username || !password) {
        setError("Please fill in all fields");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please fill in all fields",
        });
        return;
      }
      await login(username, password, selectedType);
      toast({
        variant: "default",
        className: "bg-green-600 text-white border-green-600",
        title: "Success",
        description: "Login successful",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Login failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const userTypes: { id: UserType; label: string }[] = [
    { id: "admin", label: "Administrator" },
    { id: "frontdesk", label: "Front Desk" },
  ];
  const selectedIndex = userTypes.findIndex((t) => t.id === selectedType);

  return (
    <div className="liquid-stage relative flex items-center justify-center p-4">
      {/* Ambient flowing background */}
      <div className="liquid-blob liquid-blob-1" />
      <div className="liquid-blob liquid-blob-2" />
      <div className="liquid-blob liquid-blob-3" />
      <div className="liquid-blob liquid-blob-4" />

      <div className="relative w-full max-w-md">
        <div className="liquid-card relative p-8">
          {/* Close Button — the only one, inside the card */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-blue-900/70 hover:text-blue-900 transition-colors bg-white/50 hover:bg-white/80 rounded-full p-2 backdrop-blur-sm border border-white/60 shadow-sm"
              aria-label="Close login"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-full overflow-hidden bg-white shadow-md">
                <img
                  src="/logo.png"
                  alt="Quitt Diagnostics Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-2xl font-bold text-blue-900 tracking-tight">
                Quitt Diagnostics
              </h1>
            </div>

            <p className="text-gray-600">
              {selectedType === "admin" ? "Administrator Login" : "Staff Login"}
            </p>
          </div>

          {error && (
            <div className="bg-red-100/80 backdrop-blur border border-red-300 text-red-700 px-4 py-3 rounded-2xl mb-4">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username */}
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-5 h-5 text-blue-600 pointer-events-none" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="liquid-input w-full pl-10"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-blue-600 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="liquid-input w-full pl-10 pr-10"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-900"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* User Type Selection — sliding segmented control */}
            <div className="liquid-segment-track grid grid-cols-2">
              <div
                className="liquid-segment-thumb"
                style={{ transform: `translateX(${selectedIndex * 100}%)` }}
              />
              {userTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
                  className={`liquid-segment-btn py-2 px-3 rounded-full font-medium text-sm ${
                    selectedType === type.id ? "text-white" : "text-gray-700"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="liquid-submit w-full text-white font-semibold py-3 rounded-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <LogIn className="w-5 h-5" />
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Company Slogan */}
          <div className="mt-6 p-4 bg-white/40 backdrop-blur rounded-2xl border border-white/50">
            <p className="text-xs text-gray-600 text-center italic">
              "Quitt Diagnostics — Quality Equipments, Trusted Report."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
