"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Heart,
  Clock,
  Users,
  Award,
  ArrowRight,
  CheckCircle,
  Star,
  Lock,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  AnimatedSection,
  CarAnimation,
  ServicesShowcase,
} from "@/components/animations";
import GlassBookingWizard from "@/components/glass-booking-wizard";

export default function LandingPage() {
  const { login } = useAuth();
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [adminRole, setAdminRole] = useState<"admin" | "doctor">("admin");

  const handleBookingClick = async () => {
    setShowBookingModal(true);
  };

  const handleAdminLogin = async () => {
    await login(`${adminRole}@hospital.com`, "demo", adminRole);
    setShowAdminModal(false);
    setShowBookingModal(false);
  };

  const handleBookingClose = () => {
    setShowBookingModal(false);
  };

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full opacity-10 blur-3xl"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="mb-8">
                <div className="inline-block mb-6">
                  <div className="h-20 w-20 sm:h-14 sm:w-14 rounded-full overflow-hidden bg-white shadow-md">
                    <img
                      src="/logo.png"
                      alt="Quitt Diagnostics Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-balance">
                Excellence in Healthcare,
                <br />
                Just a Click Away
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 text-balance">
                Experience world-class diagnostic services with transparent,
                convenient, and compassionate care. Book your appointment in
                seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button
                  onClick={handleBookingClick}
                  className="bg-yellow-400 hover:bg-yellow-500 text-blue-950 font-bold text-lg px-8 py-6 rounded-lg"
                >
                  Book Appointment
                </button>
                <button className="border-white text-white hover:bg-white hover:text-blue-950 font-bold text-lg px-8 py-6 rounded-lg border">
                  Learn More
                </button>
                <button
                  onClick={() => setShowAdminModal(true)}
                  className="bg-white text-blue-950 hover:bg-blue-100 font-bold text-lg px-8 py-6 rounded-lg border border-blue-200"
                >
                  Staff Login
                </button>
              </div>
              <div className="space-y-3 text-blue-100">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <span className="font-semibold">Quality Care Guaranteed</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <span>24/7 Online Booking</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative w-full h-96 mb-6">
                <CarAnimation>
                  <Image
                    src="/logoanimate.png"
                    alt="Quitt Diagnostics"
                    fill
                    className="object-contain"
                    priority
                  />
                </CarAnimation>
              </div>
            </div>
          </div>
        </div>

        {/* Curved bottom wave — sharp left entry, deep flare up on the right */}
        <div
          className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none"
          style={{ height: "90px" }}
        >
          <svg
            viewBox="0 0 1440 90"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M0,90 L0,72 C120,80 340,88 700,82 C1000,76 1260,40 1440,16 L1440,90 Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Departments Showcase Section */}
      {/* Departments Showcase Section */}
      <section className="py-20 px-0 w-full bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 relative z-10">
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-center text-blue-950 mb-4">
              Our Services
            </h2>
            <p className="text-center text-gray-600 mb-16 text-lg">
              Comprehensive diagnostic services tailored to your needs
            </p>
          </AnimatedSection>
        </div>

        <div className="hidden md:block">
          <div className="relative w-full h-96 mb-6">
            <CarAnimation>
              <Image
                src="/logoanimate.png"
                alt="Quitt Diagnostics"
                fill
                className="object-contain"
                priority
              />
            </CarAnimation>
          </div>
        </div>

        {/* Full-width Grid with Animated Cards */}
        <ServicesShowcase
          services={[
            {
              title: "Laboratory",
              tag: "Advanced Diagnostics",
              desc: "Comprehensive blood tests, urinalysis, and genetic testing using state-of-the-art equipment for accurate results.",
              items: [
                "24-hour turnaround",
                "Expert pathologists",
                "Digital reports",
              ],
              icon: CheckCircle,
              dir: "left",
              imgGrad: ["#3b82f6", "#1e40af"],
              accent: "#3b82f6",
              iconBg: "#ffffff",
              iconColor: "#3b82f6",
              revBg: "#1e40af",
              shape: "ring",
              image:
                "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80",
            },
            {
              title: "Imaging",
              tag: "Radiology & Scans",
              desc: "High-resolution X-rays, CT scans, MRIs, and ultrasounds for precise internal diagnosis and treatment planning.",
              items: [
                "Latest technology",
                "Radiologist on-site",
                "Same-day reports",
              ],
              icon: Heart,
              dir: "right",
              imgGrad: ["#ef4444", "#991b1b"],
              accent: "#ef4444",
              iconBg: "#ffffff",
              iconColor: "#ef4444",
              revBg: "#991b1b",
              shape: "cross",
              image:
                "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80",
            },
            {
              title: "Cardiology",
              tag: "Heart Health",
              desc: "Expert cardiac care including ECGs, stress tests, and echocardiograms for comprehensive heart health assessment.",
              items: [
                "Cardiologists available",
                "Non-invasive testing",
                "Preventive care",
              ],
              icon: Heart,
              dir: "left",
              imgGrad: ["#f59e0b", "#b45309"],
              accent: "#f59e0b",
              iconBg: "#ffffff",
              iconColor: "#f59e0b",
              revBg: "#b45309",
              shape: "circle",
              image:
                "https://media.istockphoto.com/id/1321166286/photo/female-doctor-listens-to-a-patients-lungs-during-a-medical-exam.webp?a=1&b=1&s=612x612&w=0&k=20&c=xRGZT-3z-OXzNwuOlr3I77103P6yGu-ehYkBhE2waDg=",
            },
            {
              title: "Neurology",
              tag: "Brain & Nerves",
              desc: "Specialized care for neurological conditions with advanced EEG and nerve conduction studies for accurate diagnosis.",
              items: [
                "Neurologists on staff",
                "Advanced diagnostics",
                "Personalized treatment",
              ],
              icon: Users,
              dir: "right",
              imgGrad: ["#8b5cf6", "#5b21b6"],
              accent: "#8b5cf6",
              iconBg: "#ffffff",
              iconColor: "#8b5cf6",
              revBg: "#5b21b6",
              shape: "ring",
              image:
                "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGElMjBibGFjayUyMG5ldXJvbG9naXN0fGVufDB8fDB8fHww",
            },
            {
              title: "Orthopedics",
              tag: "Bones & Joints",
              desc: "Comprehensive bone and joint care including X-rays, MRIs, and physical therapy consultations for optimal recovery.",
              items: [
                "Orthopedic surgeons",
                "Sports medicine",
                "Rehabilitation services",
              ],
              icon: Users,
              dir: "left",
              imgGrad: ["#10b981", "#047857"],
              accent: "#10b981",
              iconBg: "#ffffff",
              iconColor: "#10b981",
              revBg: "#047857",
              shape: "cross",
              image:
                "https://media.istockphoto.com/id/1185470154/photo/orthopedic-doctor-examines-injured-soldiers-ankle.webp?a=1&b=1&s=612x612&w=0&k=20&c=xk3HBuyDjYm54hzVyRYEWRRLic3sTLa4o4ceSNBgxu4=",
            },
            {
              title: "General Consultation",
              tag: "Primary Care",
              desc: "Expert medical guidance and advice from experienced physicians for all your health concerns and preventive care.",
              items: [
                "Experienced doctors",
                "Holistic approach",
                "Follow-up care",
              ],
              icon: CheckCircle,
              dir: "right",
              imgGrad: ["#6366f1", "#4338ca"],
              accent: "#6366f1",
              iconBg: "#ffffff",
              iconColor: "#6366f1",
              revBg: "#4338ca",
              shape: "circle",
              image:
                "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
            },
          ]}
        />
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gradient-to-br from-blue-950 to-blue-900 relative overflow-hidden">
        {/* Top wave — curves down from white Services section */}
        <div
          className="absolute top-0 left-0 w-full overflow-hidden leading-none pointer-events-none"
          style={{ height: "90px" }}
        >
          <svg
            viewBox="0 0 1440 90"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M0,0 C200,70 500,90 720,60 C960,28 1200,75 1440,30 L1440,0 Z"
              fill="white"
            />
          </svg>
        </div>

        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-center text-white mb-4">
              Why Choose Quitt Diagnostics?
            </h2>
            <p className="text-center text-blue-100 mb-16 text-lg">
              Leading Healthcare Excellence
            </p>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Clock,
                title: "Quick Booking",
                desc: "Schedule appointments in minutes with our online system.",
              },
              {
                icon: Award,
                title: "Expert Team",
                desc: "Certified healthcare professionals with years of experience.",
              },
              {
                icon: Heart,
                title: "Patient Care",
                desc: "Your health is our priority with compassionate care.",
              },
              {
                icon: Star,
                title: "Premium Service",
                desc: "Experience excellence in every interaction.",
              },
            ].map((feature, i) => (
              <div key={i} className="flex gap-4 text-white">
                <feature.icon className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-blue-100">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom wave — curves back up into white Testimonials section */}
        <div
          className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none"
          style={{ height: "90px" }}
        >
          <svg
            viewBox="0 0 1440 90"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M0,90 C180,20 420,80 720,45 C1020,10 1260,70 1440,30 L1440,90 Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-blue-900">
              What Patients Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Ahmed",
                text: "Professional and efficient service. Highly recommended!",
              },
              {
                name: "Mohammed Hassan",
                text: "Best diagnostic experience I&apos;ve had. Very satisfied.",
              },
              {
                name: "Aisha Khan",
                text: "Amazing staff and modern facilities. Five stars!",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="hospital-card p-6 rounded-2xl border-2 border-blue-200 hover:border-blue-400 transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className="w-5 h-5 fill-blue-600 text-blue-600"
                    />
                  ))}
                </div>
                <p className="mb-4 italic text-gray-700">
                  "{testimonial.text}"
                </p>
                <p className="font-semibold text-blue-900">
                  {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto hospital-card p-12 rounded-[2rem] text-center border border-slate-200 bg-white/95 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
          <h2 className="text-4xl font-bold mb-4 text-slate-900">
            Ready to Book Your Appointment?
          </h2>
          <p className="text-xl mb-8 text-slate-700">
            Join thousands of satisfied patients who trust Hospital Care for
            their healthcare needs.
          </p>
          <button
            onClick={handleBookingClick}
            className="px-10 py-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-sky-500/30"
          >
            Start Booking Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-200 bg-slate-950 text-slate-300">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            © 2026 Hospital Care. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-sky-300 transition-colors">
            <button>Privacy</button>
            <button>Terms</button>
            <button>Contact</button>
          </div>
        </div>
      </footer>

      {/* Admin Login Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="hospital-card border border-slate-200 p-8 rounded-[28px] max-w-md w-full bg-white/95 shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Staff Login
            </h2>

            <div className="space-y-4 mb-6">
              <label className="block">
                <input
                  type="radio"
                  checked={adminRole === "admin"}
                  onChange={() => setAdminRole("admin")}
                  className="mr-3"
                />
                <span className="text-sm ml-2 text-blue-900">
                  Manage all appointments and queue
                </span>
              </label>
              <label className="block">
                <input
                  type="radio"
                  checked={adminRole === "doctor"}
                  onChange={() => setAdminRole("doctor")}
                  className="mr-3"
                />
                <span className="text-blue-900 font-semibold">Doctor</span>
                <span className="text-sm ml-2 text-blue-900">
                  Review patient appointments
                </span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAdminModal(false)}
                className="flex-1 px-4 py-2 hospital-button border border-slate-200 text-sky-700 rounded-lg font-semibold hover:bg-sky-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAdminLogin}
                className="flex-1 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold transition-all"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="hospital-card border border-slate-200 p-8 rounded-[28px] max-w-4xl w-full my-8 relative bg-white/95 shadow-2xl">
            <button
              onClick={handleBookingClose}
              className="absolute top-4 right-4 text-blue-600 hover:text-blue-900 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <GlassBookingWizard onClose={handleBookingClose} />
          </div>
        </div>
      )}
    </div>
  );
}
