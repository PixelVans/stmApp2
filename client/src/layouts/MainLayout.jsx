import { useState } from "react";
import { FiMenu, FiSearch, FiBell, FiUser } from "react-icons/fi";
import Sidebar from "../components/Sidebar";

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content area */}
      <div className="flex-1 min-h-screen bg-gray-50 md:ml-64">
        {/* Fixed top navbar */}
        <header className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-6 h-16 bg-white border-b shadow-sm">
          {/* Mobile menu toggle */}
          <div className="flex items-center gap-4">
            <button
              aria-label="Toggle sidebar"
              onClick={() => setSidebarOpen((o) => !o)}
              className="md:hidden p-2 rounded bg-gray-100"
            >
              <FiMenu size={20} />
            </button>
            <div className="text-xl font-semibold">STM Management</div>
          </div>

          {/* Search / actions */}
          <div className="flex items-center gap-6">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-100 text-sm focus:outline-none"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch size={16} />
              </div>
            </div>
            <button aria-label="Notifications" className="p-2 rounded hover:bg-gray-100">
              <FiBell size={20} />
            </button>
            <button aria-label="Profile" className="p-2 rounded hover:bg-gray-100 flex items-center gap-2">
              <FiUser size={20} />
              <span className="hidden sm:inline text-sm">Admin</span>
            </button>
          </div>
        </header>

        {/* Spacer to account for fixed header */}
        <div className="h-16"></div>

        {/* Page content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
