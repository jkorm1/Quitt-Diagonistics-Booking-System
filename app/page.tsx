"use client";

import { useAuth } from "@/lib/auth-context";
import LandingPage from "@/components/landing-page";
import GlassBookingWizard from "@/components/glass-booking-wizard";
import AdminDashboardFunctional from "@/components/admin-dashboard-functional";
import DoctorDashboard from "@/components/doctor-dashboard";

export default function Home() {
  const { userType, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  // Patient booking - no authentication needed
  if (userType === "patient") {
    return <GlassBookingWizard />;
  }

  // Admin dashboard with database integration
  if (userType === "admin") {
    return <AdminDashboardFunctional />;
  }

  // Doctor dashboard
  if (userType === "doctor") {
    return <DoctorDashboard />;
  }

  // Default landing page for unauthenticated users
  return <LandingPage />;
}
