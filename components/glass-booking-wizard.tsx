"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Home,
  FileText,
  PrinterIcon,
  LogOut,
  CheckCircle2,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface Department {
  id: number;
  name: string;
  allows_home_service: boolean;
}

interface SlotInfo {
  time: string;
  available: boolean;
}

interface GlassBookingWizardProps {
  onClose?: () => void;
}

export default function GlassBookingWizard({
  onClose,
}: GlassBookingWizardProps = {}) {
  const { logout, user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedDept, setSelectedDept] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [patientName, setPatientName] = useState(user?.name || "");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [serviceType, setServiceType] = useState<"In-Clinic" | "Home-Service">(
    "In-Clinic",
  );
  const [locationAddress, setLocationAddress] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [availableSlots, setAvailableSlots] = useState<SlotInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await fetch("/api/departments");
      if (!res.ok) throw new Error("Failed to fetch departments");
      const data = await res.json();
      setDepartments(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch departments",
      );
    }
  };

  const fetchSlots = async (deptId: number, date: string) => {
    try {
      const res = await fetch(`/api/slots?deptId=${deptId}&date=${date}`);
      if (!res.ok) throw new Error("Failed to fetch slots");
      const data = await res.json();
      setAvailableSlots(data.slots || []);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch slots",
      );
    }
  };

  const handleDeptSelect = (deptId: number) => {
    setSelectedDept(deptId);
    setSelectedDate("");
    setSelectedTime("");
    setAvailableSlots([]);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime("");
    if (selectedDept) {
      fetchSlots(selectedDept, date);
    }
  };

  const handleSubmit = async () => {
    if (
      !selectedDept ||
      !selectedDate ||
      !selectedTime ||
      !patientName ||
      !phoneNumber
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert 12-hour time (e.g., "8:00 AM") to 24-hour time (e.g., "08:00")
      const convertTo24HourFormat = (time12h: string) => {
        const [time, modifier] = time12h.split(" ");
        let [hours, minutes] = time.split(":");

        if (hours === "12") {
          hours = "00";
        }

        if (modifier === "PM") {
          hours = (parseInt(hours, 10) + 12).toString();
        }

        return `${hours.padStart(2, "0")}:${minutes}`;
      };

      const time24 = convertTo24HourFormat(selectedTime);
      const appointmentTime = `${selectedDate} ${time24}:00`; // Format: YYYY-MM-DD HH:MM:SS

      const bookingData = {
        deptId: selectedDept,
        appointmentTime,
        patientName,
        phoneNumber,
        serviceType,
        problemDescription,
        locationAddress:
          serviceType === "Home-Service" ? locationAddress : null,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create booking");
      }

      setSuccess(true);
      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create booking",
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedDept(null);
    setSelectedDate("");
    setSelectedTime("");
    setPatientName(user?.name || "");
    setPhoneNumber("");
    setProblemDescription("");
    setServiceType("In-Clinic");
    setLocationAddress("");
    setError(null);
    setSuccess(false);
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-blue-950 mb-2">
          Booking Confirmed!
        </h2>
        <p className="text-gray-600 mb-6">
          Your appointment has been successfully scheduled. You will receive a
          confirmation shortly.
        </p>
        <button
          onClick={resetForm}
          className="px-6 py-3 bg-blue-950 hover:bg-blue-900 text-white rounded-lg font-medium"
        >
          Book Another Appointment
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-950 rounded-full flex items-center justify-center overflow-hidden">
            <img
              src="/logo.png"
              alt="Quitt Diagnostics Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-blue-950">
              Book Appointment
            </h1>
            <p className="text-gray-600">Schedule your diagnostic services</p>
          </div>
        </div>
        {user && (
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        )}
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3, 4].map((stepNum) => (
          <div key={stepNum} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= stepNum
                  ? "bg-blue-950 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {stepNum}
            </div>
            {stepNum < 4 && (
              <div
                className={`w-16 h-1 mx-2 ${
                  step > stepNum ? "bg-blue-950" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Step 1: Department Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-blue-950">Select Department</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => handleDeptSelect(dept.id)}
                className={`p-6 rounded-xl border-2 text-left transition-all ${
                  selectedDept === dept.id
                    ? "border-blue-950 bg-blue-50"
                    : "border-blue-200 hover:border-blue-400 bg-white"
                }`}
              >
                <h3 className="font-bold text-blue-950 mb-2">{dept.name}</h3>
                <p className="text-gray-600 text-sm">
                  {dept.allows_home_service
                    ? "Available for home service"
                    : "In-clinic service only"}
                </p>
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setStep(2)}
              disabled={!selectedDept}
              className="px-6 py-3 bg-blue-950 hover:bg-blue-900 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Date & Time Selection */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-blue-950">
            Select Date & Time
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-blue-950 mb-2">
                Appointment Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateSelect(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {selectedDate && availableSlots.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-blue-950 mb-2">
                  Available Times
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() =>
                        slot.available && setSelectedTime(slot.time)
                      }
                      disabled={!slot.available}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        selectedTime === slot.time
                          ? "border-blue-950 bg-blue-50 text-blue-950"
                          : slot.available
                            ? "border-blue-200 hover:border-blue-400 bg-white text-gray-700"
                            : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                      }`}
                      title={
                        slot.available ? "Select this time" : "Fully Booked"
                      }
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 border border-blue-200 text-blue-950 hover:bg-blue-50 rounded-lg font-medium"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!selectedTime}
              className="px-6 py-3 bg-blue-950 hover:bg-blue-900 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Service Type & Personal Info */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-blue-950">Service Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-950 mb-2">
                Service Type
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setServiceType("In-Clinic")}
                  className={`flex-1 p-4 rounded-lg border-2 text-left transition-all ${
                    serviceType === "In-Clinic"
                      ? "border-blue-950 bg-blue-50"
                      : "border-blue-200 hover:border-blue-400 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Home className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-950">In-Clinic</p>
                      <p className="text-sm text-gray-600">
                        Visit our facility
                      </p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setServiceType("Home-Service")}
                  disabled={
                    !departments.find((d) => d.id === selectedDept)
                      ?.allows_home_service
                  }
                  className={`flex-1 p-4 rounded-lg border-2 text-left transition-all ${
                    serviceType === "Home-Service"
                      ? "border-blue-950 bg-blue-50"
                      : "border-blue-200 hover:border-blue-400 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Home className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-950">Home Service</p>
                      <p className="text-sm text-gray-600">
                        Service at your location
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {serviceType === "Home-Service" && (
              <div>
                <label className="block text-sm font-medium text-blue-950 mb-2">
                  Service Address
                </label>
                <textarea
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  placeholder="Enter your full address for home service"
                  className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={3}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-950 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-950 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-950 mb-2">
                Problem Description (Optional)
              </label>
              <textarea
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="Describe your symptoms or reason for visit"
                className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 border border-blue-200 text-blue-950 hover:bg-blue-50 rounded-lg font-medium"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={!patientName || !phoneNumber}
              className="px-6 py-3 bg-blue-950 hover:bg-blue-900 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-blue-950">Confirm Booking</h2>

          <div className="bg-blue-50 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-blue-950">
                <strong>Department:</strong>{" "}
                {departments.find((d) => d.id === selectedDept)?.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-blue-950">
                <strong>Date & Time:</strong> {selectedDate} at {selectedTime}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-blue-600" />
              <span className="text-blue-950">
                <strong>Patient:</strong> {patientName}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-blue-600" />
              <span className="text-blue-950">
                <strong>Phone:</strong> {phoneNumber}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Home className="w-5 h-5 text-blue-600" />
              <span className="text-blue-950">
                <strong>Service:</strong> {serviceType}
              </span>
            </div>
            {locationAddress && (
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 mt-1" />
                <span className="text-blue-950">
                  <strong>Address:</strong> {locationAddress}
                </span>
              </div>
            )}
            {problemDescription && (
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 mt-1" />
                <span className="text-blue-950">
                  <strong>Description:</strong> {problemDescription}
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 border border-blue-200 text-blue-950 hover:bg-blue-50 rounded-lg font-medium"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-blue-950 rounded-lg font-medium flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-950"></div>
                  Booking...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Confirm Booking
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
