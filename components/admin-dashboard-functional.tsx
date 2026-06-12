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
  Plus,
  Download,
  Printer,
} from "lucide-react";
import GlassBookingWizard from "@/components/glass-booking-wizard";

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
  prescription_image?: string;
}

interface Department {
  id: number;
  name: string;
  max_concurrency: number;
}

export default function AdminDashboardFunctional() {
  const { logout } = useAuth();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [selectedTab, setSelectedTab] = useState<
    "queue" | "history" | "analytics"
  >("queue");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
      const res = await fetch(`/api/bookings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bookingId, status: newStatus }),
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

  const handleDownloadImage = (imageUrl: string, fileName: string) => {
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch((error) => console.error("Error downloading image:", error));
  };

  const handlePrintImage = (imageUrl: string) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Prescription</title>
            <style>
              body { margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; }
              img { max-width: 100%; max-height: 100vh; }
            </style>
          </head>
          <body>
            <img src="${imageUrl}" onload="window.print(); window.close();" />
          </body>
        </html>
      `);
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
            <div className="inline-block mb-6">
              <div className="h-20 w-20 sm:h-14 sm:w-14 rounded-full overflow-hidden bg-white shadow-md">
                <img
                  src="/logo.png"
                  alt="Quitt Diagnostics Logo"
                  className="w-full h-full object-cover"
                />
              </div>
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
              onClick={() => setShowBookingModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Book Appointment
            </button>
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
                          Service Type
                        </th>
                        <th className="text-left px-4 py-3 text-blue-900 font-bold">
                          Prescription
                        </th>
                        <th className="text-left px-4 py-3 text-blue-900 font-bold">
                          Chief Complaint
                        </th>
                        <th className="text-left px-4 py-3 text-blue-900 font-bold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingBookings.map((booking) => (
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
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                booking.service_type === "Home-Service"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {booking.service_type}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {booking.prescription_image ? (
                              <div className="flex items-center gap-2">
                                <img
                                  src={booking.prescription_image}
                                  alt="Prescription"
                                  className="w-12 h-12 object-cover rounded cursor-pointer"
                                  onClick={() =>
                                    setSelectedImage(
                                      booking.prescription_image!,
                                    )
                                  }
                                />
                                <div className="flex gap-1">
                                  <button
                                    onClick={() =>
                                      handleDownloadImage(
                                        booking.prescription_image!,
                                        `prescription-${booking.patient_name}.jpg`,
                                      )
                                    }
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Download"
                                  >
                                    <Download className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handlePrintImage(
                                        booking.prescription_image!,
                                      )
                                    }
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Print"
                                  >
                                    <Printer className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">
                                No prescription
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-blue-900">
                            {booking.problem_description ? (
                              <div
                                className="max-w-xs truncate"
                                title={booking.problem_description}
                              >
                                {booking.problem_description}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">
                                No description
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  updateBookingStatus(booking.id, "Completed")
                                }
                                className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition-colors flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                Check In
                              </button>
                              <button
                                onClick={() =>
                                  updateBookingStatus(booking.id, "Cancelled")
                                }
                                className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors flex items-center gap-1"
                              >
                                <X className="w-4 h-4" />
                                Cancel
                              </button>
                            </div>
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
                          Prescription
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
                            {booking.prescription_image ? (
                              <div className="flex items-center gap-2">
                                <img
                                  src={booking.prescription_image}
                                  alt="Prescription"
                                  className="w-12 h-12 object-cover rounded cursor-pointer"
                                  onClick={() =>
                                    setSelectedImage(
                                      booking.prescription_image!,
                                    )
                                  }
                                />
                                <div className="flex gap-1">
                                  <button
                                    onClick={() =>
                                      handleDownloadImage(
                                        booking.prescription_image!,
                                        `prescription-${booking.patient_name}.jpg`,
                                      )
                                    }
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Download"
                                  >
                                    <Download className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handlePrintImage(
                                        booking.prescription_image!,
                                      )
                                    }
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Print"
                                  >
                                    <Printer className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">
                                No prescription
                              </span>
                            )}
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

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="hospital-card border border-slate-200 p-8 rounded-[28px] max-w-4xl w-full my-8 relative bg-white/95 shadow-2xl">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 text-blue-600 hover:text-blue-900 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <GlassBookingWizard onClose={() => setShowBookingModal(false)} />
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={selectedImage}
              alt="Prescription Preview"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
