"use client";

import { useState } from "react";
import {
  Heart,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";

const LOCATIONS = [
  {
    name: "Ridge",
    lines: ["Ridge, Kumasi"],
    mapsUrl:
      "https://www.google.com/maps/place/Quitt+Healthcare+Diagnostics+Limited+-+Ridge/@6.6892757,-1.6377171,17z/data=!3m1!4b1!4m6!3m5!1s0xfdb9700712ef2e5:0xc5b12d2a0c3f46a3!8m2!3d6.6892757!4d-1.6351422!16s%2Fg%2F11yv24j_9t",
  },
  {
    name: "Adum",
    lines: [
      "Inside Aseda House, 50 Adum Road",
      "Ground Floor",
      "Directly opposite Main Entrance",
    ],
    mapsUrl:
      "https://www.google.com/maps/place/Aseda+House,+50+Adum+Road,+Kumasi/@6.6883412,-1.6197848,17z/data=!3m1!4b1!4m6!3m5!1s0xfdb96ec8459171f:0xd4b8e4210b7d0692!8m2!3d6.6883412!4d-1.6197848!16s%2Fg%2F11fdwyqvdr",
  },
];

// Main service categories. Categories with a `sub` array get an expandable
// chevron; categories without one just render as a single line.
const SERVICES = [
  { id: "mri", label: "MRI" },
  { id: "ct", label: "CT-Scan and Angiogram Services" },
  {
    id: "lab",
    label: "Laboratory Services",
    sub: [
      "Liver Function Test",
      "Kidney Function Test",
      "Cardiac Profiles",
      "Thyroid Function Test",
      "Complete Blood Count",
      "Lipid Profile",
      "Blood Sugars",
      "Hormonal Assay",
      "G6PD",
      "PSA",
      "Sickling",
      "Semen Analysis",
      "HBS",
      "Pap Smear",
      "Urine RE",
      "Stool RE",
      "Pregnancy Test",
      "Malaria Parasites and more",
    ],
  },
  { id: "xray", label: "X-Ray" },
  { id: "fluoroscopy", label: "Fluoroscopy" },
  {
    id: "ultrasound",
    label: "Ultrasound Scans",
    sub: [
      "Abdominal Ultrasound",
      "Pelvic Ultrasound",
      "Urological Ultrasound",
      "Thyroid Scan",
      "Breast Scan",
      "Doppler Scan for Limbs",
      "Brain Scan for Children",
      "Muscular Skeletal Scan (MSK)",
      "Endo Vaginal Scan",
      "Obstetric Scan",
      "Scrotal Doppler Scan",
      "Penile Scan",
      "Fetal Anomaly Screen Scan",
      "Ankle Brachial Index",
      "Trans Rectal Scan",
      "Saline Instilled Sonohysterography",
    ],
  },
  { id: "ecg", label: "ECG / ECHO Services" },
  {
    id: "reporting",
    label: "Reporting",
    sub: ["Plain X-ray", "Mammogram", "MRI", "CT and more"],
  },
];

export default function Footer() {
  const [openServices, setOpenServices] = useState(new Set());

  const toggleService = (id) => {
    setOpenServices((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-200 bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo and About */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full overflow-hidden bg-white shadow-lg">
                <img
                  src="https://res.cloudinary.com/dtmzgtkw9/image/upload/v1785690409/prescriptions/pvxg3ogtcxirnd1yowq9.jpg"
                  alt="Quitt Diagnostics Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl">
                  Quitt Healthcare
                </h3>
                <p className="text-xs text-sky-400 font-medium">
                  QUALITY EQUIPMENT, TRUSTED REPORTS
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Providing world-class diagnostic services with transparent,
              convenient, and compassionate care.
            </p>

            {/* Social Media Icons */}
            <div className="flex gap-4 mb-8">
              <a
                href="https://www.facebook.com/profile.php?id=61559129903701"
                className="group relative h-10 w-10 rounded-full bg-sky-600/20 flex items-center justify-center transition-all hover:bg-sky-600/30 hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-5 h-5 text-sky-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                className="group relative h-10 w-10 rounded-full bg-sky-600/20 flex items-center justify-center transition-all hover:bg-sky-600/30 hover:scale-110"
              >
                <Twitter className="w-5 h-5 text-sky-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://www.instagram.com/quitthealthdiagnostics/"
                className="group relative h-10 w-10 rounded-full bg-sky-600/20 flex items-center justify-center transition-all hover:bg-sky-600/30 hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-5 h-5 text-sky-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                className="group relative h-10 w-10 rounded-full bg-sky-600/20 flex items-center justify-center transition-all hover:bg-sky-600/30 hover:scale-110"
              >
                <Linkedin className="w-5 h-5 text-sky-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                className="group relative h-10 w-10 rounded-full bg-sky-600/20 flex items-center justify-center transition-all hover:bg-sky-600/30 hover:scale-110"
              >
                <Youtube className="w-5 h-5 text-sky-400 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
              <Heart className="w-5 h-5 text-sky-400" />
              Our Services
            </h3>
            <ul className="space-y-1">
              {SERVICES.map((service) => {
                const hasSub = Boolean(service.sub);
                const isOpen = openServices.has(service.id);
                return (
                  <li key={service.id}>
                    {hasSub ? (
                      <button
                        type="button"
                        onClick={() => toggleService(service.id)}
                        aria-expanded={isOpen}
                        className="w-full flex items-center justify-between gap-2 py-2 text-left text-slate-300 hover:text-sky-400 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span className="h-1 w-1 bg-sky-400 rounded-full flex-shrink-0"></span>
                          <span className="text-sm">{service.label}</span>
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-sky-400 flex-shrink-0 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 py-2">
                        <span className="h-1 w-1 bg-sky-400 rounded-full flex-shrink-0"></span>
                        <span className="text-sm text-slate-300">
                          {service.label}
                        </span>
                      </div>
                    )}

                    {hasSub && (
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isOpen ? "max-h-96" : "max-h-0"
                        }`}
                      >
                        <ul className="pl-5 pb-2 space-y-1.5 border-l border-slate-800 ml-1">
                          {service.sub.map((item) => (
                            <li
                              key={item}
                              className="text-xs text-slate-400 leading-snug"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-sky-400" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                "Home",
                "About Us",
                "Our Services",
                "Book Appointment",
                "Patient Portal",
                "Contact Us",
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-sky-400 transition-colors flex items-center gap-2"
                  >
                    <span className="h-1 w-1 bg-sky-400 rounded-full"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-400" />
              Contact Us
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-sky-600/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <p className="text-slate-400">+233 501259203-6</p>
                  <p className="text-slate-400">info.health@quitthealth.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-sky-600/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <p className="text-slate-400">www.quitthealth.com</p>
                  <p className="text-slate-400">P.O Box KS 15862, Kumasi</p>
                </div>
              </div>

              {/* Our Locations — two branches */}
              <div className="pt-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
                  Our Locations
                </p>
                <div className="space-y-3">
                  {LOCATIONS.map((loc) => (
                    <a
                      key={loc.name}
                      href={loc.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-800/40 p-3 transition-all hover:border-sky-500/40 hover:bg-slate-800/70"
                    >
                      <div className="h-10 w-10 rounded-full bg-sky-600/20 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-600/30 transition-colors">
                        <MapPin className="w-5 h-5 text-sky-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-white font-semibold text-sm">
                            {loc.name}
                          </span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-sky-400 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 transition-all" />
                        </div>
                        {loc.lines.map((line, idx) => (
                          <p
                            key={idx}
                            className="text-slate-400 text-sm leading-snug"
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 pt-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Service Hours */}
            <div className="bg-slate-800/50 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-sky-400" />
                Service Hours
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-700">
                  <span className="text-slate-400">Monday - Friday</span>
                  <span className="text-sky-400 font-medium">8 AM - 5 PM</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700">
                  <span className="text-slate-400">Saturday</span>
                  <span className="text-sky-400 font-medium">9 AM - 2 PM</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700">
                  <span className="text-slate-400">Sunday</span>
                  <span className="text-sky-400 font-medium">Closed</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400">Emergency</span>
                  <span className="text-sky-400 font-medium">24/7</span>
                </div>
              </div>
            </div>
            {/* Affiliations */}

            <div>
              <h3 className="text-white font-semibold mb-4">
                Affiliations & Certifications
              </h3>
              <div className="bg-slate-800/50 rounded-lg p-6">
                <div className="flex justify-center items-center gap-8">
                  <div className="text-center">
                    <img
                      src="/hra.png"
                      alt="Health Regulatory Authority"
                      className="h-16 w-auto object-contain mx-auto mb-2"
                    />
                    <p className="text-xs text-slate-400">
                      Health Regulatory Authority
                    </p>
                  </div>
                  <div className="text-center">
                    <img
                      src="/apex.png"
                      alt="APEX Health Insurance"
                      className="h-16 w-auto object-contain mx-auto mb-2"
                    />
                    <p className="text-xs text-slate-400">
                      APEX Health Insurance
                    </p>
                  </div>
                  <div className="text-center">
                    <img
                      src="/logo.png"
                      alt="Quitt Healthcare Diagnostic Services"
                      className="h-20 w-auto object-contain mx-auto mb-2"
                    />
                    <p className="text-xs text-slate-400">Quitt Healthcare</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">
              © 2026 Quitt Diagnostics. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (policy) => (
                  <a
                    key={policy}
                    href="#"
                    className="text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    {policy}
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
