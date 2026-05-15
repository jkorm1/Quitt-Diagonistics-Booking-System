"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar, Clock, CheckCircle2, X } from "lucide-react";
import { format, addDays } from "date-fns";

interface Department {
  id: number;
  name: string;
  allows_home_service: boolean;
}

interface SlotInfo {
  time: string;
  available: boolean;
}

interface BookingWizardProps {
  onClose?: () => void;
}

export default function BookingWizard({ onClose }: BookingWizardProps = {}) {
  const [step, setStep] = useState(1);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);

  // Step 1: Department Selection
  const [selectedDept, setSelectedDept] = useState<number | null>(null);

  // Step 2: Date & Time Selection
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<SlotInfo[]>([]);

  // Step 3: Patient Info
  const [patientName, setPatientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [serviceType, setServiceType] = useState("In-Clinic");
  const [locationAddress, setLocationAddress] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await fetch("/api/departments");
      if (!res.ok) throw new Error("API Error");
      const data = await res.json();
      if (Array.isArray(data)) {
        setDepartments(data);
      } else {
        setDepartments([]);
      }
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      setDepartments([
        { id: 1, name: "Laboratory", allows_home_service: true },
        { id: 2, name: "Imaging", allows_home_service: false },
        { id: 3, name: "General Consultation", allows_home_service: false },
      ]);
    }
  };

  const fetchAvailableSlots = async (date: string) => {
    if (!selectedDept) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/slots?deptId=${selectedDept}&date=${date}`);
      if (!res.ok) throw new Error("API Error");
      const data = await res.json();
      setAvailableSlots(Array.isArray(data.slots) ? data.slots : []);
    } catch (error) {
      console.error("Failed to fetch slots:", error);
      setAvailableSlots([
        { time: "08:00 AM", available: true },
        { time: "08:30 AM", available: true },
        { time: "09:00 AM", available: true },
        { time: "09:30 AM", available: true },
        { time: "10:00 AM", available: true },
        { time: "10:30 AM", available: true },
        { time: "02:00 PM", available: true },
        { time: "02:30 PM", available: true },
        { time: "03:00 PM", available: true },
        { time: "03:30 PM", available: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedTime("");
    fetchAvailableSlots(date);
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

    try {
      setLoading(true);
      setError("");
      const appointmentTime = `${selectedDate} ${selectedTime}`;
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName,
          phoneNumber,
          deptId: selectedDept,
          appointmentTime,
          serviceType,
          locationAddress:
            serviceType === "Home-Service" ? locationAddress : undefined,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Booking failed");
      }

      setSubmitted(true);
    } catch (error) {
      console.error("[v0] Booking error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create booking. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBookingComplete = () => {
    setSubmitted(false);
    setStep(1);
    if (onClose) onClose();
  };

  const selectedDeptName = departments.find((d) => d.id === selectedDept)?.name;
  const selectedDeptAllowsHome = departments.find(
    (d) => d.id === selectedDept,
  )?.allows_home_service;

  if (submitted) {
    return (
      <div className="flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center border-2 border-blue-200 shadow-xl bg-white">
          <CheckCircle2 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-blue-900 mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-gray-600 mb-4">
            Your appointment has been confirmed. A WhatsApp notification has
            been sent to {phoneNumber}
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left border border-blue-200">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-blue-900">Department:</span>{" "}
              {selectedDeptName || "Not selected"}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-blue-900">Date & Time:</span>{" "}
              {selectedDate} at {selectedTime}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-blue-900">Patient Name:</span>{" "}
              {patientName}
            </p>
          </div>
          <Button
            onClick={handleBookingComplete}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {onClose ? "Close" : "Book Another Appointment"}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= num
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {num}
                </div>
                {num < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      step > num ? "bg-blue-600" : "bg-blue-100"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="p-8 border-2 border-blue-200 shadow-xl bg-white">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Step 1: Department Selection */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-6">
                Select Department
              </h2>
              <div className="space-y-3">
                {departments.map((dept) => (
                  <label
                    key={dept.id}
                    className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-400"
                    style={{
                      borderColor:
                        selectedDept === dept.id ? "#0066cc" : "#bfdbfe",
                      backgroundColor:
                        selectedDept === dept.id ? "#dbeafe" : "transparent",
                    }}
                  >
                    <RadioGroup
                      value={selectedDept?.toString()}
                      onValueChange={(val) => setSelectedDept(parseInt(val))}
                    >
                      <RadioGroupItem value={dept.id.toString()} />
                    </RadioGroup>
                    <div className="ml-4">
                      <p className="font-semibold text-blue-900">{dept.name}</p>
                      {dept.allows_home_service && (
                        <p className="text-sm text-blue-600">
                          Home service available
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
              <Button
                onClick={() => selectedDept && setStep(2)}
                disabled={!selectedDept}
                className="w-full mt-8 bg-blue-600 hover:bg-blue-700 h-12 text-lg text-white"
              >
                Continue
              </Button>
            </div>
          )}

          {/* Step 2: Date & Time Selection */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-6">
                Select Date & Time
              </h2>

              {/* Date Picker */}
              <div className="mb-8">
                <Label className="text-base font-semibold mb-3 block text-blue-900">
                  Choose Date
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                  {[...Array(7)].map((_, i) => {
                    const date = addDays(new Date(), i);
                    const dateStr = format(date, "yyyy-MM-dd");
                    return (
                      <button
                        key={dateStr}
                        onClick={() => handleDateChange(dateStr)}
                        className={`p-3 rounded-lg font-medium transition-all border-2 ${
                          selectedDate === dateStr
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-blue-900 border-blue-200 hover:border-blue-400"
                        }`}
                      >
                        <div className="text-xs">{format(date, "EEE")}</div>
                        <div className="text-sm">{format(date, "d")}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div>
                  <Label className="text-base font-semibold mb-3 block text-blue-900">
                    Choose Time
                  </Label>
                  {loading ? (
                    <p className="text-gray-600">Loading available times...</p>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() =>
                            slot.available && setSelectedTime(slot.time)
                          }
                          disabled={!slot.available}
                          className={`p-3 rounded-lg font-medium transition-all border-2 ${
                            selectedTime === slot.time
                              ? "bg-blue-600 text-white border-blue-600"
                              : slot.available
                                ? "bg-white text-blue-900 border-blue-200 hover:border-blue-400"
                                : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                          }`}
                          title={
                            slot.available ? "Select this time" : "Fully Booked"
                          }
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-red-600 font-medium">
                      No slots available for this date
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-4 mt-8">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1 h-12 text-lg border-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  Back
                </Button>
                <Button
                  onClick={() => selectedDate && selectedTime && setStep(3)}
                  disabled={!selectedDate || !selectedTime}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 h-12 text-lg text-white"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Patient Information */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-6">
                Your Information
              </h2>

              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="name"
                    className="text-base font-semibold mb-2 block text-blue-900"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter your full name"
                    className="h-12 text-base border-2 border-blue-200 focus:border-blue-600"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="phone"
                    className="text-base font-semibold mb-2 block text-blue-900"
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter your phone number"
                    className="h-12 text-base border-2 border-blue-200 focus:border-blue-600"
                  />
                </div>

                {selectedDeptAllowsHome && (
                  <>
                    <div>
                      <Label className="text-base font-semibold mb-3 block text-blue-900">
                        Service Type
                      </Label>
                      <RadioGroup
                        value={serviceType}
                        onValueChange={setServiceType}
                      >
                        <div className="flex items-center space-x-2 mb-3">
                          <RadioGroupItem value="In-Clinic" id="in-clinic" />
                          <Label
                            htmlFor="in-clinic"
                            className="font-normal cursor-pointer text-gray-700"
                          >
                            In-Clinic
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="Home-Service"
                            id="home-service"
                          />
                          <Label
                            htmlFor="home-service"
                            className="font-normal cursor-pointer text-gray-700"
                          >
                            Home Service
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {serviceType === "Home-Service" && (
                      <div>
                        <Label
                          htmlFor="address"
                          className="text-base font-semibold mb-2 block text-blue-900"
                        >
                          GPS Address / Location
                        </Label>
                        <Input
                          id="address"
                          value={locationAddress}
                          onChange={(e) => setLocationAddress(e.target.value)}
                          placeholder="Enter your address"
                          className="h-12 text-base border-2 border-blue-200 focus:border-blue-600"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="flex gap-4 mt-8">
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="flex-1 h-12 text-lg border-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !patientName || !phoneNumber}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 h-12 text-lg text-white"
                >
                  {loading ? "Booking..." : "Confirm Booking"}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
