"use client";

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
} from "lucide-react";

export default function Footer() {
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
                  src="/logonew.png"
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
                href="#"
                className="group relative h-10 w-10 rounded-full bg-sky-600/20 flex items-center justify-center transition-all hover:bg-sky-600/30 hover:scale-110"
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
                href="#"
                className="group relative h-10 w-10 rounded-full bg-sky-600/20 flex items-center justify-center transition-all hover:bg-sky-600/30 hover:scale-110"
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
            <div className="space-y-4">
              <div className="group">
                <h4 className="text-sky-400 font-medium mb-2 group-hover:text-sky-300 transition-colors">
                  CT SCAN SERVICES
                </h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>• Advanced imaging technology</li>
                  <li>• 3D reconstruction</li>
                  <li>• Low-dose options</li>
                </ul>
              </div>
              <div className="group">
                <h4 className="text-sky-400 font-medium mb-2 group-hover:text-sky-300 transition-colors">
                  MAMMOGRAM SERVICES
                </h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>• Digital mammography</li>
                  <li>• 3D tomosynthesis</li>
                  <li>• Breast ultrasound</li>
                </ul>
              </div>
              <div className="group">
                <h4 className="text-sky-400 font-medium mb-2 group-hover:text-sky-300 transition-colors">
                  ULTRASOUND SERVICES
                </h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>• Abdominal ultrasound</li>
                  <li>• Obstetrics scan</li>
                  <li>• Doppler scan</li>
                </ul>
              </div>
            </div>
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
                  <p className="text-slate-400">info.health@quithealth.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-sky-600/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <p className="text-slate-400">www.quithealth.com</p>
                  <p className="text-slate-400">P.O Box KS 15862, Kumasi</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-sky-600/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <p className="text-slate-400">Inside Aseda House</p>
                  <p className="text-slate-400">Ground Floor</p>
                  <p className="text-slate-400">
                    Directly opposite Main Entrance
                  </p>
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
