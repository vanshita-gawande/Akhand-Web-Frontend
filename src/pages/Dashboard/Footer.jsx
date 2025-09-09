// import {
//   FaFacebookF,
//   FaTwitter,
//   FaInstagram,
//   FaLinkedinIn,
// } from "react-icons/fa";

// export default function Footer() {
//   return (
//     <footer className="relative bg-gray-900 text-gray-200 py-8 mt-0 overflow-hidden">
//       {/* Subtle background blur circles */}
//       <div className="absolute top-0 left-0 w-36 h-36 bg-white/5 rounded-full blur-3xl" />
//       <div className="absolute bottom-0 right-0 w-52 h-52 bg-white/5 rounded-full blur-3xl" />

//       <div className="max-w-[1100px] mx-auto px-6 flex flex-col md:flex-row justify-between gap-8">
//         {/* About */}
//         <div className="flex-1 space-y-3">
//           <h3 className="text-lg font-bold text-gray-100">Akhand Sports</h3>
//           <p className="text-gray-300 text-sm leading-relaxed">
//             Empowering athletes, coaches, and sports enthusiasts with innovative
//             tools for seamless event management, analytics, and community
//             engagement.
//           </p>
//           <div className="flex gap-4 mt-1">
//             <a href="#" className="hover:text-gray-100 transition">
//               <FaFacebookF />
//             </a>
//             <a href="#" className="hover:text-gray-100 transition">
//               <FaTwitter />
//             </a>
//             <a href="#" className="hover:text-gray-100 transition">
//               <FaInstagram />
//             </a>
//             <a href="#" className="hover:text-gray-100 transition">
//               <FaLinkedinIn />
//             </a>
//           </div>
//         </div>

//         {/* Links */}
//         <div className="flex-1 flex flex-col md:items-start space-y-2">
//           <h4 className="font-semibold text-gray-100">Quick Links</h4>
//           <a href="#" className="hover:text-white transition">
//             Home
//           </a>
//           <a href="#" className="hover:text-white transition">
//             About Us
//           </a>
//           <a href="#" className="hover:text-white transition">
//             Services
//           </a>
//           <a href="#" className="hover:text-white transition">
//             Contact
//           </a>
//         </div>

//         {/* Legal */}
//         <div className="flex-1 flex flex-col md:items-start space-y-2">
//           <h4 className="font-semibold text-gray-100">Legal</h4>
//           <a href="#" className="hover:text-white transition">
//             Privacy Policy
//           </a>
//           <a href="#" className="hover:text-white transition">
//             Terms of Service
//           </a>
//           <a href="#" className="hover:text-white transition">
//             Support
//           </a>
//         </div>
//       </div>

//       <div className="mt-6 text-center text-gray-400 text-sm">
//         &copy; {new Date().getFullYear()} Akhand Sports. All rights reserved.
//       </div>
//     </footer>
//   );
// }
// src/pages/Dashboard/Footer.jsx
import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer({
  companyName = "Akhand Sports",
  description = "Empowering athletes, coaches, and sports enthusiasts with innovative tools for seamless event management, analytics, and community engagement.",
  quickLinks = ["Home", "About Us", "Services", "Contact"],
  legalLinks = ["Privacy Policy", "Terms of Service", "Support"],
  socialLinks = [
    { icon: <FaFacebookF />, url: "#" },
    { icon: <FaTwitter />, url: "#" },
    { icon: <FaInstagram />, url: "#" },
    { icon: <FaLinkedinIn />, url: "#" },
  ],
}) {
  return (
    <footer className="relative bg-gray-900 text-gray-200 py-8 mt-0 overflow-hidden">
      {/* Subtle background blur circles */}
      <div className="absolute top-0 left-0 w-36 h-36 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-52 h-52 bg-white/5 rounded-full blur-3xl" />

      <div className="max-w-[1100px] mx-auto px-6 flex flex-col md:flex-row justify-between gap-8">
        {/* About */}
        <div className="flex-1 space-y-3">
          <h3 className="text-lg font-bold text-gray-100">{companyName}</h3>
          <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
          <div className="flex gap-4 mt-1">
            {socialLinks.map((social, i) => (
              <a key={i} href={social.url} className="hover:text-gray-100 transition">
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex-1 flex flex-col md:items-start space-y-2">
          <h4 className="font-semibold text-gray-100">Quick Links</h4>
          {quickLinks.map((link, i) => (
            <a key={i} href="#" className="hover:text-white transition">
              {link}
            </a>
          ))}
        </div>

        {/* Legal Links */}
        <div className="flex-1 flex flex-col md:items-start space-y-2">
          <h4 className="font-semibold text-gray-100">Legal</h4>
          {legalLinks.map((link, i) => (
            <a key={i} href="#" className="hover:text-white transition">
              {link}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
      </div>
    </footer>
  );
}
