export default function StmHome() {
  return (
    <div className="lg:ml-64 mt-[-50px] px-6 py-4 flex flex-col min-h-screen">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">STM Home</h1>
        <p className="text-lg text-gray-600">Specialised Towel Manufacturers Limited</p>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-4 border-t border-gray-200">
        © 2025 STM. All rights reserved.
      </footer>
    </div>
  );
}
