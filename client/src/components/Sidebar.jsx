import { useState } from "react";
import {
  FiHome,
  FiUsers,
  FiBarChart,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiGrid,
  FiDroplet,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Specialised Systems", icon: <FiGrid size={18} />, href: "#" },
    { name: "Dyeing", icon: <FiDroplet size={18} className="text-yellow-300" />, href: "/dyeing" },
  ];

  return (
    <div className="flex">
      {/* Mobile toggle */}
      <button
        aria-label="Toggle sidebar"
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-transparent text-slate-500 shadow-none"
        onClick={() => setIsOpen((o) => !o)}
      >
        {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-slate-800 text-white 
          p-6 flex flex-col justify-between transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 shadow-lg`}
      >
        <div>
          {/* Logo / Brand */}
          <div className="mb-10 flex items-center justify-center">
            <div className="text-2xl mt-12 md:mt-0 font-extrabold tracking-wide">
              STM <span className="text-blue-400">Management</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition"
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom action */}
        <div className="mt-6">
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition bg-gray-800"
          >
            <FiLogOut size={18} />
            <span className="font-medium">Logout</span>
          </a>
        </div>
      </aside>

      {/* Overlay for mobile when open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
