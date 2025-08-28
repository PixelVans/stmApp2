
import { FiGrid, FiDroplet, FiLogOut, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navItems = [
    { name: "Specialised Systems", icon: <FiGrid size={18} />, href: "#" },
    { name: "Dyeing", icon: <FiDroplet size={18} className="text-yellow-300" />, href: "/dyeing" },
  ];

  return (
    <>
      {/* Sidebar */}
     <aside
  className={`
    fixed top-0 left-0 h-full z-40 bg-slate-800 text-white p-4 md:p-6 
    flex flex-col justify-between
    lg:w-1/6 lg:max-w-none transition-transform duration-300
    ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
  `}
>
  <div>
    {/* Close button for mobile + md */}
    <div className="flex justify-end lg:hidden mb-4">
      <button
        onClick={() => setIsOpen(false)}
        aria-label="Close sidebar"
        className="p-2 rounded hover:bg-gray-700"
      >
        <FiX size={22} />
      </button>
    </div>

    {/* Logo */}
    <div className="mb-10 flex items-center justify-center">
      <div className="text-2xl mt-12 font-extrabold tracking-wide text-center">
        STM <span className="text-blue-400">Management</span>
      </div>
    </div>

    {/* Navigation */}
    <nav className="flex flex-col gap-2">
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          onClick={() => setIsOpen(false)} // close sidebar on click
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition"
        >
          {item.icon}
          <span className="font-medium">{item.name}</span>
        </Link>
      ))}
    </nav>
  </div>

  {/* Logout */}
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

{/* Overlay (mobile + md only) */}
{isOpen && (
  <div
    className="fixed inset-0 bg-black/40 lg:hidden"
    onClick={() => setIsOpen(false)}
  ></div>
)}

    </>
  );
};

export default Sidebar;
