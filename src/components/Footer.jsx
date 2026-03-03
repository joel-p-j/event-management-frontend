import logo from "../assets/eventx-logo.png";

export default function Footer() {
  return (
    <footer className="bg-[#1c1c1c] text-gray-300 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-14 flex flex-col md:flex-row 
        items-start md:items-center justify-between gap-10">

        <div className="flex flex-col gap-3">
          <img
            src={logo}
            alt="EventX"
            className="h-20 w-fit"
          />
          <p className="text-sm text-gray-400 max-w-xs">
            Discover, book, and experience events around you with EventX.
          </p>
        </div>

        <div className="flex flex-wrap gap-8 text-sm font-medium">
          <a href="#" className="hover:text-white transition">
            Terms & Conditions
          </a>
          <a href="#" className="hover:text-white transition">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition">
            Contact Us
          </a>
        </div>
      </div>

      <div className="border-t border-gray-700"></div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row 
        items-center justify-between gap-6">

        <p className="text-xs text-gray-400 text-center md:text-left leading-relaxed">
          By accessing this page, you confirm that you have read, understood, and
          agreed to our Terms of Service, Cookie Policy, Privacy Policy, and
          Content Guidelines. © {new Date().getFullYear()} EventX. All rights reserved.
        </p>

        <div className="flex items-center gap-5 text-lg">
          <a href="#" className="hover:text-white transition">Facebook</a>
          <a href="#" className="hover:text-white transition">Instagram</a>
          <a href="#" className="hover:text-white transition">X</a>
          <a href="#" className="hover:text-white transition">YouTube</a>
        </div>
      </div>
    </footer>
  );
}
