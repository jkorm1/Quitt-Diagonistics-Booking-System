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
  const [adminRole, setAdminRole] = useState<"admin" | "frontdesk">("admin");

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

        {/* Navigation Bar */}
        <nav className="absolute top-0 left-0 right-0 z-20 px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full overflow-hidden bg-white shadow-md">
                <img
                  src="/logo.png"
                  alt="Quitt Diagnostics Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-white font-bold text-lg hidden sm:block">
                Quitt Diagnostics
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleBookingClick}
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-950 font-semibold px-4 py-2 rounded-lg text-sm sm:text-base transition-colors"
              >
                Book Appointment
              </button>
              <button
                onClick={() => setShowAdminModal(true)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2 rounded-lg text-sm sm:text-base transition-colors backdrop-blur-sm border border-white/20"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span className="hidden sm:inline">Staff Login</span>
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
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
              title: "Ultrasound Scans",
              tag: "Imaging",
              desc: "Imaging using sound waves to visualize internal organs for accurate diagnosis.",
              items: [
                "Advanced ultrasound technology",
                "Expert radiologists",
                "Same-day reports available",
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
              title: "Fluoroscopy Studies",
              tag: "Real-time Imaging",
              desc: "Real-time X-ray imaging for diagnostic procedures with high precision.",
              items: [
                "State-of-the-art equipment",
                "Radiologist supervision",
                "Quick results",
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
                "https://images.unsplash.com/photo-1631558554770-74e921444006?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YSUyMGJsYWNrJTIwZmx1cm9zY29weXxlbnwwfHwwfHx8MA%3D%3D",
            },
            {
              title: "Mammogram",
              tag: "Breast Imaging",
              desc: "Breast imaging for cancer screening and diagnosis with compassionate care.",
              items: [
                "Female technicians available",
                "Private screening rooms",
                "Quick appointment scheduling",
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
              title: "Laboratory Services",
              tag: "Diagnostic Testing",
              desc: "Comprehensive blood, urine, and other sample testing with accurate results.",
              items: [
                "24-hour turnaround",
                "Expert pathologists",
                "Digital reports",
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
              title: "X-rays of Any Part",
              tag: "Radiographic Imaging",
              desc: "General radiographic imaging for bones and tissues with high-quality results.",
              items: [
                "Digital X-ray technology",
                "Radiologist on-site",
                "Same-day reports",
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
              title: "MRI & CT Scan",
              tag: "Advanced Imaging",
              desc: "Advanced imaging for internal structures and organs with detailed analysis.",
              items: [
                "Latest MRI & CT technology",
                "Expert radiologists",
                "Detailed reports",
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
                "https://plus.unsplash.com/premium_photo-1683134693632-8c72cae46997?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bXJpJTIwJTI2Q1R8ZW58MHx8MHx8fDA%3D",
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
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="flex gap-4 text-white">
                  <feature.icon className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-blue-100">{feature.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
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
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-blue-900">
                What Patients Say
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Stephanie Peprah",
                text: "Professional and efficient service. Highly recommended!",
                image:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
              },
              {
                name: "Joseph Korm",
                text: "Best diagnostic experience I&apos;ve had. Very satisfied.",
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
              },
              {
                name: "Aisha Khan",
                text: "Amazing staff and modern facilities. Five stars!",
                image:
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
              },
            ].map((testimonial, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <div className="hospital-card p-6 rounded-2xl border-2 border-blue-200 hover:border-blue-400 transition-all">
                  <div className="flex justify-center mb-4">
                    <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-blue-100 shadow-md">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className="w-5 h-5 fill-blue-600 text-blue-600"
                      />
                    ))}
                  </div>
                  <p className="mb-4 italic text-gray-700 text-center">
                    "{testimonial.text}"
                  </p>
                  <p className="font-semibold text-blue-900 text-center">
                    {testimonial.name}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
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
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-200 bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo and About */}
            <div className="col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-white shadow-md">
                  <img
                    src="/logo.png"
                    alt="Quitt Diagnostics Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">
                    Quitt Diagnostics
                  </h3>
                  <p className="text-xs text-sky-400">
                    Excellence in Healthcare
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Providing world-class diagnostic services with transparent,
                convenient, and compassionate care.
              </p>
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-sky-600 flex items-center justify-center text-white text-xs">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </div>
                <div className="h-8 w-8 rounded-full bg-sky-600 flex items-center justify-center text-white text-xs">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      ry="5"
                    ></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </div>
                <div className="h-8 w-8 rounded-full bg-sky-600 flex items-center justify-center text-white text-xs">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-sky-400 transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-sky-400 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-sky-400 transition-colors"
                  >
                    Our Services
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-sky-400 transition-colors"
                  >
                    Book Appointment
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-sky-400 transition-colors"
                  >
                    Patient Portal
                  </a>
                </li>
              </ul>
            </div>

            {/* Our Services */}
            <div>
              <h3 className="text-white font-semibold mb-4">Our Services</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-sky-400 transition-colors"
                  >
                    Laboratory Services
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-sky-400 transition-colors"
                  >
                    Radiology & Imaging
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-sky-400 transition-colors"
                  >
                    Cardiology
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-sky-400 transition-colors"
                  >
                    Neurology
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-sky-400 transition-colors"
                  >
                    Orthopedics
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-white font-semibold mb-4">Contact Us</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-sky-600/20 flex items-center justify-center flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-sky-400"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div>
                    <p className="text-slate-400">
                      P.O. Box KS 15662, Kumasi, Ghana
                    </p>
                    <p className="text-slate-400">Ashanti Region</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-sky-600/20 flex items-center justify-center flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-sky-400"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div>
                    <a
                      href="tel:0501259203"
                      className="text-slate-400 hover:text-sky-400 transition-colors"
                    >
                      0501259203
                    </a>
                    <span className="text-slate-500 mx-1">/</span>
                    <a
                      href="tel:0322395333"
                      className="text-slate-400 hover:text-sky-400 transition-colors"
                    >
                      0322395333
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-sky-600/20 flex items-center justify-center flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-sky-400"
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </svg>
                  </div>
                  <a
                    href="mailto:info@quittdiagnostics.com"
                    className="text-slate-400 hover:text-sky-400 transition-colors"
                  >
                    info@quittdiagnostics.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">
              © 2026 Quitt Diagnostics. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-sky-300 transition-colors">
              <button className="hover:text-sky-200 transition-colors">
                Privacy Policy
              </button>
              <button className="hover:text-sky-200 transition-colors">
                Terms of Service
              </button>
              <button className="hover:text-sky-200 transition-colors">
                Cookie Policy
              </button>
            </div>
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
                <span className="text-blue-900 font-semibold">
                  Administrator
                </span>
              </label>
              <label className="block">
                <input
                  type="radio"
                  checked={adminRole === "frontdesk"}
                  onChange={() => setAdminRole("frontdesk")}
                  className="mr-3"
                />
                <span className="text-blue-900 font-semibold">Front Desk</span>
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
