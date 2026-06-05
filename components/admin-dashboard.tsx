"use client";

import { useState, useEffect } from "react";
import {
  LogOut,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  Phone,
  MapPin,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface Booking {
  id: string;
  patient_name: string;
  phone_number: string;
  department: string;
  appointment_time: string;
  service_type: string;
  location_address?: string;
  problem_description?: string;
  status: "pending" | "completed" | "cancelled";
}

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"queue" | "history">("queue");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/queue");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch bookings");
      }
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch bookings",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/queue`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: "completed" }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to check in");
      }
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: "completed" } : b,
        ),
      );
    } catch (error) {
      console.error("Error checking in:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to check in. Please try again.",
      );
    }
  };

  const handleCancel = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/queue`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: "cancelled" }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to cancel");
      }
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: "cancelled" } : b,
        ),
      );
    } catch (error) {
      console.error("Error cancelling:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to cancel. Please try again.",
      );
    }
  };

  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const completedBookings = bookings.filter((b) => b.status === "completed");

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-blue-900">
              Front Desk Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Manage appointments and patient queue
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors font-semibold"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto mb-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-blue-900">
              Appointments ({bookings.length})
            </h2>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="space-y-2">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="w-full p-3 rounded-lg transition-all bg-blue-50 border border-blue-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{booking.patient_name}</p>
                        <p className="text-xs opacity-80">
                          {booking.department}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : booking.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="hospital-card p-6 rounded-2xl border-2 border-blue-200">
              <p className="text-sm text-gray-600 mb-2">Pending</p>
              <p className="text-4xl font-bold text-blue-900">
                {pendingBookings.length}
              </p>
            </div>
            <div className="hospital-card p-6 rounded-2xl border-2 border-blue-200">
              <p className="text-sm text-gray-600 mb-2">Completed</p>
              <p className="text-4xl font-bold text-blue-900">
                {completedBookings.length}
              </p>
            </div>
            <div className="hospital-card p-6 rounded-2xl border-2 border-blue-200">
              <p className="text-sm text-gray-600 mb-2">Total Bookings</p>
              <p className="text-4xl font-bold text-blue-900">
                {bookings.length}
              </p>
            </div>
            <div className="hospital-card p-6 rounded-2xl border-2 border-blue-200">
              <p className="text-sm text-gray-600 mb-2">Time</p>
              <p className="text-2xl font-bold text-blue-900">
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab("queue")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "queue"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "hospital-button hover:bg-blue-100 border-2 border-blue-200"
              }`}
            >
              Live Queue
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "history"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "hospital-button hover:bg-blue-100 border-2 border-blue-200"
              }`}
            >
              Completed
            </button>
          </div>

          {activeTab === "queue" && (
            <div className="hospital-card p-8 rounded-2xl border-2 border-blue-200">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">
                Pending Appointments
              </h2>
              {pendingBookings.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  No pending appointments
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-blue-50 p-6 rounded-xl flex items-center justify-between hover:bg-blue-100 transition-all border border-blue-200"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {booking.patient_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-lg text-blue-900">
                              {booking.patient_name}
                            </p>
                            <div className="flex gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />{" "}
                                {booking.phone_number}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />{" "}
                                {new Date(
                                  booking.appointment_time,
                                ).toLocaleString()}
                              </span>
                              <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-semibold">
                                {booking.department}
                              </span>
                            </div>
                            {booking.problem_description && (
                              <p className="text-sm text-gray-600 mt-2">
                                Issue: {booking.problem_description}
                              </p>
                            )}
                            {booking.location_address &&
                              booking.service_type === "Home-Service" && (
                                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                  <MapPin className="w-4 h-4" />{" "}
                                  {booking.location_address}
                                </p>
                              )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCheckIn(booking.id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Check In
                        </button>
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
                        >
                          <XCircle className="w-5 h-5" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div className="hospital-card p-8 rounded-2xl border-2 border-blue-200">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">
                Completed Appointments
              </h2>
              {completedBookings.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  No completed appointments yet
                </p>
              ) : (
                <div className="space-y-4">
                  {completedBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-green-50 p-6 rounded-xl flex items-center justify-between border-2 border-green-200"
                    >
                      <div className="flex items-center gap-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                        <div>
                          <p className="font-semibold text-blue-900">
                            {booking.patient_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.department}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-green-700 font-semibold">
                        Completed
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
