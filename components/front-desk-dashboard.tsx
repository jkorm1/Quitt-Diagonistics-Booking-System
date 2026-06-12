"use client";

import { useState, useEffect } from "react";
import {
  LogOut,
  Calendar,
  User,
  Phone,
  FileText,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  X,
  Download,
  Printer,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import GlassBookingWizard from "@/components/glass-booking-wizard";

interface Appointment {
  id: string;
  patient_name: string;
  phone_number: string;
  dept_id: number;
  dept_name?: string;
  appointment_time: string;
  service_type: string;
  location_address?: string;
  problem_description?: string;
  prescription_image?: string;
  status: string;
}

export default function FrontDeskDashboard() {
  const { logout } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch appointments");
      }
      const data = await res.json();
      setAppointments(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch appointments",
      );
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/bookings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        throw new Error("Failed to update appointment status");
      }
      fetchAppointments();
      setSelectedAppointment(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update appointment",
      );
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

  const todayAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.appointment_time);
    const today = new Date();
    return (
      aptDate.getDate() === today.getDate() &&
      aptDate.getMonth() === today.getMonth() &&
      aptDate.getFullYear() === today.getFullYear()
    );
  });

  const upcomingAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.appointment_time);
    const today = new Date();
    return aptDate > today;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-blue-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-950 rounded-full flex items-center justify-center overflow-hidden">
                <img
                  src="/logo.png"
                  alt="Quitt Diagnostics Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-950">
                  Front Desk Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Manage patient appointments and direct to departments
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowBookingModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                Book Appointment
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-blue-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-950" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-950">
                  {todayAppointments.length}
                </p>
                <p className="text-sm text-gray-600">Today's Appointments</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-blue-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-950">
                  {upcomingAppointments.length}
                </p>
                <p className="text-sm text-gray-600">Upcoming</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-blue-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-950">
                  {
                    appointments.filter((apt) => apt.status === "completed")
                      .length
                  }
                </p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-xl border border-blue-200 shadow-sm">
          <div className="p-6 border-b border-blue-200">
            <h2 className="text-xl font-bold text-blue-950">
              Patient Appointments
            </h2>
            <p className="text-gray-600">
              Direct patients to appropriate departments and services
            </p>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-950 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading appointments...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600">{error}</p>
                <button
                  onClick={fetchAppointments}
                  className="mt-4 px-4 py-2 bg-blue-950 hover:bg-blue-900 text-white rounded-lg font-medium"
                >
                  Retry
                </button>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No appointments found</p>
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
                          Status
                        </th>
                        <th className="text-left px-4 py-3 text-blue-900 font-bold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appointment) => (
                        <tr
                          key={appointment.id}
                          className="border-b border-blue-100 hover:bg-blue-50 transition-colors"
                        >
                          <td className="px-4 py-3 text-blue-900 font-semibold">
                            {appointment.patient_name}
                          </td>
                          <td className="px-4 py-3 text-blue-600 font-semibold">
                            {appointment.dept_name ||
                              `Department ${appointment.dept_id}`}
                          </td>
                          <td className="px-4 py-3 text-blue-900">
                            {new Date(
                              appointment.appointment_time,
                            ).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-blue-900">
                            {appointment.phone_number}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                appointment.service_type === "Home-Service"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {appointment.service_type}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {appointment.prescription_image ? (
                              <div className="flex items-center gap-2">
                                <img
                                  src={appointment.prescription_image}
                                  alt="Prescription"
                                  className="w-12 h-12 object-cover rounded cursor-pointer"
                                  onClick={() =>
                                    setSelectedImage(
                                      appointment.prescription_image!,
                                    )
                                  }
                                />
                                <div className="flex gap-1">
                                  <button
                                    onClick={() =>
                                      handleDownloadImage(
                                        appointment.prescription_image!,
                                        `prescription-${appointment.patient_name}.jpg`,
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
                                        appointment.prescription_image!,
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
                            {appointment.problem_description ? (
                              <div
                                className="max-w-xs truncate"
                                title={appointment.problem_description}
                              >
                                {appointment.problem_description}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">
                                No description
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                appointment.status.toLowerCase() === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : appointment.status.toLowerCase() ===
                                      "completed"
                                    ? "bg-green-100 text-green-800"
                                    : appointment.status.toLowerCase() ===
                                        "cancelled"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {appointment.status.charAt(0).toUpperCase() +
                                appointment.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {appointment.status.toLowerCase() === "pending" && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    updateAppointmentStatus(
                                      appointment.id,
                                      "completed",
                                    )
                                  }
                                  className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition-colors flex items-center gap-1"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  Check In
                                </button>
                                <button
                                  onClick={() =>
                                    updateAppointmentStatus(
                                      appointment.id,
                                      "cancelled",
                                    )
                                  }
                                  className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors flex items-center gap-1"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Cancel
                                </button>
                              </div>
                            )}
                            {appointment.status.toLowerCase() ===
                              "completed" && (
                              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-lg font-medium">
                                Checked In
                              </span>
                            )}
                            {appointment.status.toLowerCase() ===
                              "cancelled" && (
                              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-lg font-medium">
                                Cancelled
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
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
