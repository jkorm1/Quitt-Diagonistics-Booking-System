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
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

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
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
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
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
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
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-gradient-to-r from-blue-50 to-white border border-blue-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <User className="w-5 h-5 text-blue-600" />
                          <h3 className="font-bold text-blue-950 text-lg">
                            {appointment.patient_name}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              appointment.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : appointment.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : appointment.status === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {appointment.status.charAt(0).toUpperCase() +
                              appointment.status.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-blue-600" />
                            <span>{appointment.phone_number}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span>
                              {new Date(
                                appointment.appointment_time,
                              ).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span>
                              {appointment.dept_name ||
                                `Department ${appointment.dept_id}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span>{appointment.service_type}</span>
                          </div>
                        </div>

                        {appointment.location_address && (
                          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <strong>Location:</strong>{" "}
                              {appointment.location_address}
                            </p>
                          </div>
                        )}

                        {appointment.problem_description && (
                          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <strong>Description:</strong>{" "}
                              {appointment.problem_description}
                            </p>
                          </div>
                        )}
                        {appointment.prescription_image && (
                          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Prescription:</strong>
                            </p>
                            <img
                              src={appointment.prescription_image}
                              alt="Prescription"
                              className="w-full h-48 object-cover rounded-lg border border-blue-200"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        {appointment.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                updateAppointmentStatus(
                                  appointment.id,
                                  "completed",
                                )
                              }
                              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
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
                              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                              Cancel
                            </button>
                          </>
                        )}
                        {appointment.status === "completed" && (
                          <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
                            Checked In
                          </span>
                        )}
                        {appointment.status === "cancelled" && (
                          <span className="px-4 py-2 bg-red-100 text-red-800 rounded-lg font-medium">
                            Cancelled
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
