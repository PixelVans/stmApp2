
import {  FiDroplet, FiLogOut, FiX, FiHome, FiTrendingUp, FiEdit3, FiBox,  } from "react-icons/fi";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, setIsOpen }) => {
const navItems = [
  { name: "Home", icon: <FiHome size={18} className="text-white" />, href: "/" },
  { name: "Dyeing", icon: <FiDroplet size={18} className="text-yellow-300" />, href: "/dyeing" },
  { name: "Production Data", icon: <FiTrendingUp size={18} className="text-green-400" />, href: "/weaving-production" },
  { 
    name: "Update Production Data", 
    icon: <FiEdit3 size={18} className="text-blue-400" />, 
    href: "/update-weaving-production" 
  },
  { 
    name: "Update Warping Data", 
    icon: <FiEdit3 size={18} className="text-purple-400" />, 
    href: "/update-warping-data" 
  },
  { 
    name: "Update Stock", 
    icon: <FiBox size={18} className="text-green-400" />, 
    href: "/update-stock" 
  },
];


  return (
    <>
  {/* Sidebar */}
     <aside
  className={`
    fixed top-0 left-0 h-full z-40 bg-slate-800 text-white p-4 md:p-6 
    flex flex-col justify-between
    w-2/3 sm:w-1/3 lg:w-1/6 lg:max-w-none transition-transform duration-300
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

    {/* */}
  <div className="mb-5 flex items-center justify-center">
  <div className="text-lg md:text-xl lg:text-[20px] font-bold tracking-wide text-center">
    Specialised <span className="text-blue-400">Systems</span>
    <div className="mt-3 mx-auto w-full border-b border-gray-600"></div>
  </div>
</div>



    {/*  */}
    <nav className="flex flex-col gap-2 ">
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          onClick={() => setIsOpen(false)} 
          className="flex items-center gap-3 px-2 py-3 rounded-lg hover:bg-gray-700 transition"
        >
          {item.icon}
          <span className="font-medium text-sm">{item.name}</span>
        </Link>
      ))}
    </nav>
  </div>

  {/*  */}
  <div className="mt-6">
    <a
      href="#"
      className="hidden items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition bg-gray-800"
    >
      <FiLogOut size={18} />
      <span className="font-medium">Logout</span>
    </a>
  </div>
</aside>

{/**/}
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
