import { useState } from "react";
import Dyeing from "../components/systems/Dyeing";
import Weaving from "../components/systems/Weaving";
import Warping from "../components/systems/Warping";
import Knotting from "../components/systems/Knotting";
import Finishing from "../components/systems/Finishing";
import Beaming from "../components/systems/Beaming";

import {
  FiDroplet,
  FiLayout,
  FiRepeat,
  FiLink,
  FiCheckCircle,
  FiArchive,
} from "react-icons/fi";

const sections = [
  { name: "Dyeing", key: "dyeing", icon: <FiDroplet size={18} /> },
  { name: "Weaving", key: "weaving", icon: <FiLayout size={18} /> },
  { name: "Warping", key: "warping", icon: <FiRepeat size={18} /> },
  { name: "Knotting", key: "knotting", icon: <FiLink size={18} /> },
  { name: "Finishing", key: "finishing", icon: <FiCheckCircle size={18} /> },
  { name: "Beaming", key: "beaming", icon: <FiArchive size={18} /> },
];

const SpecialSystemsPage = () => {
  const [active, setActive] = useState("dyeing");

  const renderActive = () => {
    switch (active) {
      case "dyeing":
        return <Dyeing />;
      case "weaving":
        return <Weaving />;
      case "warping":
        return <Warping />;
      case "knotting":
        return <Knotting />;
      case "finishing":
        return <Finishing />;
      case "beaming":
        return <Beaming />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Specialised Systems</h2>
          <p className="text-sm text-gray-500">
            Drill into departmental workflows (Dyeing, Weaving, etc.).
          </p>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="overflow-x-auto">
        <nav className="flex gap-4 border-b">
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              className={`flex items-center gap-2 px-4 py-2 -mb-px border-b-2 transition ${
                active === s.key
                  ? "border-indigo-500 font-semibold text-indigo-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              {s.icon}
              <span>{s.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Active section content */}
      <div className="bg-white p-6 rounded-2xl shadow">{renderActive()}</div>
    </div>
  );
};

export default SpecialSystemsPage;
