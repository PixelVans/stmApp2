import { AlertTriangle, Package } from "lucide-react";
import { Link } from "react-router-dom";

const inventoryItems = [
  { name: "Yarn 9/2", quantity: 45, unit: "kg", status: "critical" },
  { name: "Gluber Salt", quantity: 120, unit: "kg", status: "low" },
  { name: "Indofix Yellow Dyestuff", quantity: 8, unit: "kg", status: "critical" },
  { name: "Sodium Carbonate", quantity: 85, unit: "kg", status: "low" },
  { name: "Fixing Agent FX-20", quantity: 12, unit: "L", status: "critical" },
];

const CriticalInventory = () => {
  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-xl shadow p-5 border border-gray-200 transition-all duration-200">
      {/* Header */}
     <Link
          to="/stm-stocks"
          className="dashboard-card flex items-center mb-4 justify-between p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md 
          hover:bg-blue-100 transition"
        >
          {/* Left side: title and count */}
          <div>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Critical Inventory
            </h2>
            <span className="text-sm font-bold text-gray-800">
              {inventoryItems.filter((i) => i.status === "critical").length} critical
            </span>
          </div>

          {/* Right side: icon */}
          <AlertTriangle className="w-4 h-4 text-red-600" />
        </Link>

      {/* Inventory List */}
      <div className="flex-1 space-y-3">
        {inventoryItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-100"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  item.status === "critical"
                    ? "bg-red-600 animate-pulse"
                    : "bg-yellow-500"
                }`}
              />
              <span className="text-sm font-medium text-gray-800">
                {item.name}
              </span>
            </div>
            <div className="text-right">
              <span
                className={`text-sm font-semibold ${
                  item.status === "critical"
                    ? "text-red-600"
                    : "text-yellow-500"
                }`}
              >
                {item.quantity} {item.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-gray-500" />
          <span>Top 5 Risk Items</span>
        </div>
      </div>
    </div>
  );
};

export default CriticalInventory;
