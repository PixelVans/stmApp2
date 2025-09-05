import { FaHome } from "react-icons/fa";

export default function StmHome() {
  return (
    <div className="lg:ml-64 mt-[-50px] px-6 py-8 flex flex-col min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
        <FaHome className="h-16 w-16 text-blue-500 animate-bounce" />
        <h1 className="text-4xl font-bold text-gray-800">Welcome to STM Home</h1>
        <p className="text-lg text-gray-600 max-w-md">
          Specialised Towel Manufacturers Limited
        </p>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-6 border-t border-gray-200">
        © 2025 STM. All rights reserved.
      </footer>
    </div>
  );
}
