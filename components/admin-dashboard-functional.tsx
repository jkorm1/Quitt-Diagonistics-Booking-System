"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  BarChart3,
  Users,
  Calendar,
  TrendingUp,
  LogOut,
  RefreshCw,
  CheckCircle2,
  X,
  Clock,
} from "lucide-react";

interface Booking {
  id: string;
  patient_name: string;
  phone_number: string;
  dept_id: number;
  appointment_time: string;
  service_type: string;
  location_address: string;
  problem_description: string;
  status: string;
  dept_name?: string;
}

interface Department {
  id: number;
  name: string;
  max_concurrency: number;
}

export default function AdminDashboardFunctional() {
  const { logout } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [selectedTab, setSelectedTab] = useState<
    "queue" | "history" | "analytics"
  >("queue");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, deptsRes] = await Promise.all([
        fetch("/api/bookings"),
        fetch("/api/departments"),
      ]);

      if (bookingsRes.ok && deptsRes.ok) {
        const bookingsData = await bookingsRes.json();
        const deptsData = await deptsRes.json();

        // Handle both array and object responses
        const bookingsList = Array.isArray(bookingsData)
          ? bookingsData
          : bookingsData.bookings || [];
        const deptsList = Array.isArray(deptsData)
          ? deptsData
          : deptsData.departments || [];

        setBookings(bookingsList);
        setDepartments(deptsList);

        // Calculate stats
        const pending = bookingsList.filter(
          (b: Booking) => b.status === "Pending",
        ).length;
        const completed = bookingsList.filter(
          (b: Booking) => b.status === "Completed",
        ).length;
        setStats({ total: bookingsList.length, pending, completed });
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("[v0] Error fetching data:", error);
      // Use demo data if API fails
      setDepartments([
        { id: 1, name: "Laboratory", max_concurrency: 5 },
        { id: 2, name: "Imaging", max_concurrency: 2 },
        { id: 3, name: "General Consultation", max_concurrency: 3 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const getDepartmentName = (deptId: number) => {
    return departments.find((d) => d.id === deptId)?.name || "Unknown";
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/queue`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });

      if (res.ok) {
        // Update local state
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId ? { ...b, status: newStatus } : b,
          ),
        );
      } else {
        const error = await res.json();
        throw new Error(error.error || "Failed to update booking status");
      }
    } catch (error) {
      console.error("[v0] Error updating booking:", error);
      alert("Failed to update booking status. Please try again.");
    }
  };

  const pendingBookings = bookings
    .filter((b) => b.status === "Pending")
    .sort(
      (a, b) =>
        new Date(a.appointment_time).getTime() -
        new Date(b.appointment_time).getTime(),
    );

  const completedBookings = bookings.filter((b) => b.status === "Completed");

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-blue-600 font-semibold">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white border-b-2 border-blue-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-900">
                Admin Dashboard
              </h1>
              <p className="text-xs text-gray-600">Appointment Management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleRefresh}
              className={`p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all ${refreshing ? "animate-spin" : ""}`}
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Bookings",
              value: stats.total,
              icon: Calendar,
              color: "bg-blue-100 text-blue-600",
            },
            {
              label: "Pending",
              value: stats.pending,
              icon: Clock,
              color: "bg-yellow-100 text-yellow-600",
            },
            {
              label: "Completed",
              value: stats.completed,
              icon: CheckCircle2,
              color: "bg-green-100 text-green-600",
            },
            {
              label: "Departments",
              value: departments.length,
              icon: Users,
              color: "bg-red-100 text-red-600",
            },
          ].map((stat, i) => (
            <div key={i} className="hospital-card p-6 border-2 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 ${stat.color} rounded-lg`}>
                  <stat.icon className="w-8 h-8" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          {[
            { id: "queue", label: "Live Queue", icon: Clock },
            { id: "history", label: "History", icon: TrendingUp },
            { id: "analytics", label: "Analytics", icon: BarChart3 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                selectedTab === tab.id
                  ? "hospital-card border-2 border-blue-600 text-blue-900 bg-blue-50"
                  : "hospital-button border-2 border-blue-200 text-blue-900 hover:bg-blue-100"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Queue Tab */}
        {selectedTab === "queue" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">
              Pending Appointments
            </h2>
            {pendingBookings.length === 0 ? (
              <div className="hospital-card p-12 text-center border-2 border-blue-200">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No pending appointments</p>
              </div>
            ) : (
              pendingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="hospital-card p-6 border-2 border-blue-200 hover:border-blue-400 transition-all"
                >
                  <div className="grid md:grid-cols-5 gap-6 mb-4 pb-4 border-b-2 border-blue-200">
                    <div>
                      <p className="text-gray-600 text-sm">Patient Name</p>
                      <p className="text-blue-900 font-semibold">
                        {booking.patient_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Department</p>
                      <p className="text-blue-600 font-semibold">
                        {booking.dept_name ||
                          getDepartmentName(booking.dept_id)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Date & Time</p>
                      <p className="text-blue-900 font-semibold">
                        {new Date(booking.appointment_time).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Contact</p>
                      <p className="text-blue-900 font-semibold">
                        {booking.phone_number}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Service Type</p>
                      <p
                        className={`font-semibold ${booking.service_type === "Home-Service" ? "text-blue-600" : "text-green-600"}`}
                      >
                        {booking.service_type}
                      </p>
                    </div>
                  </div>

                  {booking.problem_description && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-gray-600 text-sm mb-1">
                        Chief Complaint
                      </p>
                      <p className="text-blue-900">
                        {booking.problem_description}
                      </p>
                    </div>
                  )}

                  {booking.location_address &&
                    booking.service_type === "Home-Service" && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-gray-600 text-sm mb-1">
                          Home Address
                        </p>
                        <p className="text-blue-900">
                          {booking.location_address}
                        </p>
                      </div>
                    )}

                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        updateBookingStatus(booking.id, "Completed")
                      }
                      className="flex-1 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Check In
                    </button>
                    <button
                      onClick={() =>
                        updateBookingStatus(booking.id, "Cancelled")
                      }
                      className="flex-1 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      Cancel
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* History Tab */}
        {selectedTab === "history" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">
              Completed Appointments
            </h2>
            {completedBookings.length === 0 ? (
              <div className="hospital-card p-12 text-center border-2 border-blue-200">
                <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No completed appointments yet</p>
              </div>
            ) : (
              <div className="hospital-card p-6 border-2 border-blue-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-blue-200">
                        <th className="text-left px-4 py-3 text-blue-900 font-bold">
                          Patient
                        </th>
                        <th className="text-left px-4 py-3 text-blue-900 font-bold">
                          Department
                        </th>
                        <th className="text-left px-4 py-3 text-blue-900 font-bold">
                          Date/Time
                        </th>
                        <th className="text-left px-4 py-3 text-blue-900 font-bold">
                          Contact
                        </th>
                        <th className="text-left px-4 py-3 text-blue-900 font-bold">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedBookings.map((booking) => (
                        <tr
                          key={booking.id}
                          className="border-b border-blue-100 hover:bg-blue-50 transition-colors"
                        >
                          <td className="px-4 py-3 text-blue-900 font-semibold">
                            {booking.patient_name}
                          </td>
                          <td className="px-4 py-3 text-blue-600 font-semibold">
                            {booking.dept_name ||
                              getDepartmentName(booking.dept_id)}
                          </td>
                          <td className="px-4 py-3 text-blue-900">
                            {new Date(
                              booking.appointment_time,
                            ).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-blue-900">
                            {booking.phone_number}
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                              Completed
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {selectedTab === "analytics" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="hospital-card p-6 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-blue-900 mb-6">
                Bookings by Department
              </h3>
              <div className="space-y-4">
                {departments.map((dept) => {
                  const count = bookings.filter(
                    (b) => b.dept_id === dept.id,
                  ).length;
                  const percentage =
                    stats.total > 0 ? (count / stats.total) * 100 : 0;
                  return (
                    <div key={dept.id}>
                      <div className="flex justify-between mb-2">
                        <p className="text-blue-900 font-semibold">
                          {dept.name}
                        </p>
                        <p className="text-blue-600">{count}</p>
                      </div>
                      <div className="w-full h-3 bg-blue-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="hospital-card p-6 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-blue-900 mb-6">
                Service Type Distribution
              </h3>
              <div className="space-y-4">
                {["In-Clinic", "Home-Service"].map((type) => {
                  const count = bookings.filter(
                    (b) => b.service_type === type,
                  ).length;
                  const percentage =
                    stats.total > 0 ? (count / stats.total) * 100 : 0;
                  return (
                    <div key={type}>
                      <div className="flex justify-between mb-2">
                        <p className="text-blue-900 font-semibold">{type}</p>
                        <p className="text-blue-600">{count}</p>
                      </div>
                      <div className="w-full h-3 bg-blue-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${type === "Home-Service" ? "bg-purple-600" : "bg-green-600"}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
