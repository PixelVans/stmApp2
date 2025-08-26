import { useState } from "react";
import { FiMenu, FiSearch, FiBell, FiUser } from "react-icons/fi";
import { useLocation } from "react-router-dom"; // 👈 import this
import Sidebar from "../components/Sidebar";
import DyeingControlPanel from "../components/DyeingControlPanel";

const MainLayout = ({ children, printRef }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [controlPanelOpen, setControlPanelOpen] = useState(true);

  const location = useLocation();
  const isDyeingPage = location.pathname === "/dyeing"; 

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content area */}
      <div className="flex-1  bg-gray-50 md:ml-64">

        
      {/* Navbar */}
        <header className="fixed  top-0 left-0 right-0 z-20  flex items-center justify-between  h-16 bg-white border-b shadow-sm">
          <div className="flex items-center gap-4">
            <button
              aria-label="Toggle sidebar"
              onClick={() => setSidebarOpen((o) => !o)}
              className="md:hidden ml-3  "
            >
              <FiMenu size={20} />
            </button>
            <div className="text-xl mt-9 font-semibold mb-9"><span className="hidden md:block">STM Management</span> </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Search */}
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

            {/*Only show toggle on /dyeing */}
            {isDyeingPage && (
              <button
                onClick={() => setControlPanelOpen((prev) => !prev)}
                className="shrink-0 ml-4 p-2 rounded-lg bg-blue-400 text-white hover:bg-blue-500 transition"
              >
                {controlPanelOpen ? "Hide Panel" : "Show Panel"}
              </button>
            )}

            <button aria-label="Profile" className="p-2 rounded hover:bg-gray-100 flex items-center gap-2">
              <FiUser size={20} />
              <span className="hidden sm:inline text-sm">Admin</span>
            </button>
          </div>
        </header>



        {/* Spacer */}
        <div className="h-16"></div>

        
        <main className={isDyeingPage && controlPanelOpen ? "mt-[300px]" : "mt-0"}>
         
          {isDyeingPage && (
            <DyeingControlPanel
              open={controlPanelOpen}
              setOpen={setControlPanelOpen}
              printRef={printRef}  
            />
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
