import { FaHome } from "react-icons/fa";

export default function StmHome() {
  return (
    <div
      className="relative min-h-screen w-full mt-[-64px] flex flex-col bg-black bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/stmhome.jpg')",
      }}
    >
      {/* Dark overlay to improve readability */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Main Content */}
      <div className="relative flex-1 mt-[-100px] flex flex-col items-center justify-center text-center space-y-4 py-8">
        <FaHome className="h-12 w-12 sm:h-16 sm:w-16 text-white animate-bounce" />
        <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
          Welcome to STM Home
        </h1>
        <p className="text-sm font-semibold md:text-xl text-gray-200 max-w-md">
          Specialised Towel Manufacturers Limited
        </p>
      </div>

      {/* Footer */}
      <footer className="relative text-center text-sm text-gray-300 py-6 bg-black/60">
        © 2025 STM. All rights reserved.
      </footer>
    </div>
  );
}

