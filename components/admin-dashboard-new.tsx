"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, Plus, Clock } from "lucide-react";
import { format } from "date-fns";

interface Booking {
  id: string;
  patient_name: string;
  phone_number: string;
  dept_id: number;
  service_type: string;
  appointment_time: string;
  status: "Pending" | "Completed" | "Cancelled";
  dept_name?: string;
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("queue");
  const [error, setError] = useState<string | null>(null);

  // Manual Booking Form
  const [walkInName, setWalkInName] = useState("");
  const [walkInPhone, setWalkInPhone] = useState("");
  const [walkInDept, setWalkInDept] = useState("");
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    fetchQueue();
    fetchDepartments();
  }, []);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/queue");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch queue");
      }
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error("Failed to fetch queue:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch queue",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await fetch("/api/departments");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch departments");
      }
      const data = await res.json();
      setDepartments(data);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    }
  };

  const handleCheckIn = async (bookingId: string) => {
    try {
      const res = await fetch("/api/queue", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: "Completed" }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to check in");
      }

      setBookings(
        bookings.map((b) =>
          b.id === bookingId ? { ...b, status: "Completed" } : b,
        ),
      );
    } catch (error) {
      console.error("Failed to check in:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to check in. Please try again.",
      );
    }
  };

  const handleCancel = async (bookingId: string) => {
    try {
      const res = await fetch("/api/queue", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: "Cancelled" }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to cancel");
      }

      setBookings(
        bookings.map((b) =>
          b.id === bookingId ? { ...b, status: "Cancelled" } : b,
        ),
      );
    } catch (error) {
      console.error("Failed to cancel:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to cancel. Please try again.",
      );
    }
  };

  const handleWalkIn = async () => {
    if (!walkInName || !walkInPhone || !walkInDept) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const appointmentTime = format(new Date(), "yyyy-MM-dd HH:mm");
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: walkInName,
          phoneNumber: walkInPhone,
          deptId: parseInt(walkInDept),
          appointmentTime,
          serviceType: "In-Clinic",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add walk-in");
      }

      setWalkInName("");
      setWalkInPhone("");
      setWalkInDept("");
      fetchQueue();
    } catch (error) {
      console.error("Failed to add walk-in:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to add walk-in. Please try again.",
      );
    }
  };

  const pendingBookings = bookings.filter((b) => b.status === "Pending");
  const completedBookings = bookings.filter((b) => b.status === "Completed");

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 p-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-900">
            Front Desk Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage appointments and patient queue
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p>{error}</p>
            </div>
          </div>
        )}

        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white border-2 border-blue-200">
            <TabsTrigger value="queue" className="text-blue-900">
              Live Queue
            </TabsTrigger>
            <TabsTrigger value="walkIn" className="text-blue-900">
              Walk-In Booking
            </TabsTrigger>
            <TabsTrigger value="history" className="text-blue-900">
              History
            </TabsTrigger>
          </TabsList>

          {/* Live Queue */}
          <TabsContent value="queue" className="space-y-4">
            <Card className="p-6 border-2 border-blue-200 shadow-xl bg-white">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">
                Today&apos;s Queue
              </h2>

              {loading ? (
                <p className="text-gray-600">Loading...</p>
              ) : pendingBookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-blue-200">
                        <TableHead className="text-blue-900">Time</TableHead>
                        <TableHead className="text-blue-900">
                          Patient Name
                        </TableHead>
                        <TableHead className="text-blue-900">Phone</TableHead>
                        <TableHead className="text-blue-900">
                          Department
                        </TableHead>
                        <TableHead className="text-blue-900">
                          Service Type
                        </TableHead>
                        <TableHead className="text-blue-900">Status</TableHead>
                        <TableHead className="text-blue-900">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingBookings.map((booking) => (
                        <TableRow
                          key={booking.id}
                          className="hover:bg-blue-50 border-blue-100"
                        >
                          <TableCell className="font-mono font-semibold text-blue-900">
                            {format(
                              new Date(booking.appointment_time),
                              "HH:mm",
                            )}
                          </TableCell>
                          <TableCell className="font-semibold text-blue-900">
                            {booking.patient_name}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {booking.phone_number}
                          </TableCell>
                          <TableCell className="text-blue-600">
                            {booking.dept_name || "Unknown"}
                          </TableCell>
                          <TableCell className="text-sm text-gray-700">
                            {booking.service_type}
                          </TableCell>
                          <TableCell>
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                              Pending
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleCheckIn(booking.id)}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                Check In
                              </Button>
                              <Button
                                onClick={() => handleCancel(booking.id)}
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-300 hover:bg-red-50"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No pending appointments today</p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Walk-In Booking */}
          <TabsContent value="walkIn">
            <Card className="p-6 border-2 border-blue-200 shadow-xl bg-white max-w-md">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">
                Add Walk-In Booking
              </h2>

              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="walk-in-name"
                    className="font-semibold text-blue-900"
                  >
                    Patient Name
                  </Label>
                  <Input
                    id="walk-in-name"
                    value={walkInName}
                    onChange={(e) => setWalkInName(e.target.value)}
                    placeholder="Enter patient name"
                    className="mt-2 h-10 border-2 border-blue-200 focus:border-blue-600"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="walk-in-phone"
                    className="font-semibold text-blue-900"
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="walk-in-phone"
                    value={walkInPhone}
                    onChange={(e) => setWalkInPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="mt-2 h-10 border-2 border-blue-200 focus:border-blue-600"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="walk-in-dept"
                    className="font-semibold text-blue-900"
                  >
                    Department
                  </Label>
                  <select
                    id="walk-in-dept"
                    value={walkInDept}
                    onChange={(e) => setWalkInDept(e.target.value)}
                    className="w-full mt-2 px-3 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={handleWalkIn}
                  className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-base mt-6 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Walk-In
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* History */}
          <TabsContent value="history" className="space-y-4">
            <Card className="p-6 border-2 border-blue-200 shadow-xl bg-white">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">
                Completed Appointments
              </h2>

              {completedBookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-blue-200">
                        <TableHead className="text-blue-900">Time</TableHead>
                        <TableHead className="text-blue-900">
                          Patient Name
                        </TableHead>
                        <TableHead className="text-blue-900">Phone</TableHead>
                        <TableHead className="text-blue-900">
                          Department
                        </TableHead>
                        <TableHead className="text-blue-900">
                          Service Type
                        </TableHead>
                        <TableHead className="text-blue-900">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completedBookings.map((booking) => (
                        <TableRow
                          key={booking.id}
                          className="hover:bg-green-50 border-blue-100"
                        >
                          <TableCell className="font-mono font-semibold text-blue-900">
                            {format(
                              new Date(booking.appointment_time),
                              "HH:mm",
                            )}
                          </TableCell>
                          <TableCell className="font-semibold text-blue-900">
                            {booking.patient_name}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {booking.phone_number}
                          </TableCell>
                          <TableCell className="text-blue-600">
                            {booking.dept_name || "Unknown"}
                          </TableCell>
                          <TableCell className="text-sm text-gray-700">
                            {booking.service_type}
                          </TableCell>
                          <TableCell>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                              Completed
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-center text-gray-600 py-8">
                  No completed appointments yet
                </p>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
