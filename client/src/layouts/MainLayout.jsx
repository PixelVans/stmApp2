import { useState } from "react";
import { FiSearch, FiBell, FiUser, FiMenu } from "react-icons/fi";
import { useLocation, Outlet } from "react-router-dom"; 
import Sidebar from "../components/Sidebar";
import DyeingControlPanel from "../components/DyeingControlPanel";

const MainLayout = ({ printRef }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [controlPanelOpen, setControlPanelOpen] = useState(true);
  
  const location = useLocation();
  const isDyeingPage = location.pathname === "/dyeing";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed flex-1 lg:ml-1/6 inset-0 bg-black/40 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:ml-1/6 transition-all duration-300">
        {/* Navbar */}
        <header className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between h-16 bg-white shadow-md px-2 md:px-6">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p- rounded"
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu className="ml-2" size={20} />
            </button>
            <div className="text-xl hidden font-semibold truncate">
              STM Management
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6 ">
            {/* Search */}
            <div className="hidden sm:flex relative">
              {/* <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-100 text-sm focus:outline-none"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch size={16} />
              </div> */}
            </div>

            <button className="p-2 rounded hover:bg-gray-100">
              {/* <FiBell size={20} /> */}
            </button>

            {isDyeingPage && (
              <button
                onClick={() => setControlPanelOpen((prev) => !prev)}
                className="shrink-0 ml-2 p-2 rounded-lg bg-blue-400 text-white hover:bg-blue-500 transition text-xs sm:text-sm"
              >
                {controlPanelOpen ? "Hide Panel" : "Show Panel"}
              </button>
            )}

            <button className="p-2 rounded hover:bg-gray-100 flex items-center gap-2">
              <FiUser size={20} />
              <span className="hidden sm:inline text-sm">Admin</span>
            </button>
          </div>
        </header>

        {/* Spacer */}
        <div className="h-16"></div>

        {/* Main content */}
        <main
          className={`flex-1 lg:ml-64  px-2 sm:px-6 lg:px-6 max-w-full overflow-x-hidden ${
            isDyeingPage && controlPanelOpen ? "lg:mt-[250px]" : "mt-0"
          }`}
        >
          {isDyeingPage && controlPanelOpen && (
            <DyeingControlPanel
            open={controlPanelOpen}
            setOpen={setControlPanelOpen}
            printRef={printRef} 
          />
          )}
        <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
