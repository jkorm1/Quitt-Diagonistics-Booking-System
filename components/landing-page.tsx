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
  MapPin,
  Navigation,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  AnimatedSection,
  CarAnimation,
  ServicesShowcase,
} from "@/components/animations";
import GlassBookingWizard from "@/components/glass-booking-wizard";
import Login from "@/components/login";
import Footer from "@/components/footer";

const LOCATIONS = [
  {
    name: "Ridge",
    address: "Ridge, Kumasi",
    mapsUrl:
      "https://www.google.com/maps/place/Quitt+Healthcare+Diagnostics+Limited+-+Ridge/@6.6892757,-1.6377171,17z/data=!3m1!4b1!4m6!3m5!1s0xfdb9700712ef2e5:0xc5b12d2a0c3f46a3!8m2!3d6.6892757!4d-1.6351422!16s%2Fg%2F11yv24j_9t",
    accent: "#f59e0b",
  },
  {
    name: "Adum",
    address: "Aseda House, 50 Adum Road, Kumasi",
    mapsUrl:
      "https://www.google.com/maps/place/Aseda+House,+50+Adum+Road,+Kumasi/@6.6883412,-1.6197848,17z/data=!3m1!4b1!4m6!3m5!1s0xfdb96ec8459171f:0xd4b8e4210b7d0692!8m2!3d6.6883412!4d-1.6197848!16s%2Fg%2F11fdwyqvdr",
    accent: "#38bdf8",
  },
];

function getQrCodeUrl(mapsUrl: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(
    mapsUrl,
  )}`;
}

export default function LandingPage() {
  const { login } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleBookingClick = async () => {
    setShowBookingModal(true);
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
              <div className="h-15 w-15 rounded-full overflow-hidden bg-white shadow-md">
                <img
                  src="/logonew.png"
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
                onClick={() => setShowLoginModal(true)}
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
                  onClick={() => setShowLoginModal(true)}
                  className="bg-white text-blue-950 hover:bg-blue-100 font-bold text-lg px-8 py-6 rounded-lg border border-blue-200"
                >
                  Staff Login
                </button>
              </div>
              <div className="space-y-3 text-blue-100">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <span className="font-semibold">Quality Care Guaranteed</span>
                  <span>24/7 Online Booking</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative w-full h-96 mb-6">
                <CarAnimation>
                  <Image
                    src="https://res.cloudinary.com/dtmzgtkw9/image/upload/v1785681434/prescriptions/nvqagbokwwphwzdwuuhc.png"
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
                src="https://res.cloudinary.com/dtmzgtkw9/image/upload/v1785690409/prescriptions/pvxg3ogtcxirnd1yowq9.jpg"
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
            <div className="space-y-8">
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
                      <h3 className="text-xl font-bold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-blue-100">{feature.desc}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            {/* Visit Our Locations — dual QR code cards */}
            <div className="flex flex-col justify-center gap-5">
              <AnimatedSection>
                <p className="text-yellow-400 font-semibold tracking-wide uppercase text-sm mb-1 text-center md:text-left">
                  Visit Us
                </p>
                <h3 className="text-white font-bold text-2xl mb-5 text-center md:text-left">
                  Scan for Directions
                </h3>
              </AnimatedSection>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {LOCATIONS.map((loc, i) => (
                  <AnimatedSection key={loc.name} delay={i * 0.15}>
                    <a
                      href={loc.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block h-full overflow-hidden rounded-2xl p-[2px] transition-transform duration-300 hover:-translate-y-1"
                      style={{
                        background: `linear-gradient(145deg, ${loc.accent}, rgba(255,255,255,0.15))`,
                      }}
                    >
                      <div className="relative h-full rounded-[14px] bg-white/95 backdrop-blur-sm px-5 pt-6 pb-5 flex flex-col items-center text-center overflow-hidden">
                        {/* soft glow accent */}
                        <div
                          className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-20 blur-2xl"
                          style={{ backgroundColor: loc.accent }}
                        ></div>

                        <div
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4 text-white shadow-sm"
                          style={{ backgroundColor: loc.accent }}
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          {loc.name}
                        </div>

                        <div className="relative rounded-xl p-2.5 bg-white shadow-md ring-1 ring-black/5 group-hover:scale-[1.03] transition-transform duration-300">
                          <img
                            src={getQrCodeUrl(loc.mapsUrl)}
                            alt={`QR code for directions to ${loc.name}`}
                            width={140}
                            height={140}
                            className="w-[140px] h-[140px] rounded-md"
                          />
                          <div
                            className="absolute -bottom-2 -right-2 rounded-full p-1.5 shadow-md text-white"
                            style={{ backgroundColor: loc.accent }}
                          >
                            <Navigation className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        <p className="text-blue-950 font-semibold text-sm mt-4 leading-snug">
                          {loc.address}
                        </p>
                        <span
                          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold"
                          style={{ color: loc.accent }}
                        >
                          Get Directions
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </a>
                  </AnimatedSection>
                ))}
              </div>
            </div>
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

      <Footer />

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <Login />
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
