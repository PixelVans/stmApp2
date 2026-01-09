import { Cpu } from "lucide-react";

const machines = [
  { id: 1, unitsProduced: 12450, status: "best" },
  { id: 2, unitsProduced: 9820, status: "good" },
  { id: 3, unitsProduced: 7340, status: "low" },
  { id: 4, unitsProduced: 4120, status: "critical" },
];

const getStatusStyles = (status) => {
  switch (status) {
    case "best":
      return "border-blue-600/30 bg-blue-50";
    case "good":
      return "border-green-500/30 bg-green-50";
    case "low":
      return "border-yellow-500/30 bg-yellow-50";
    case "critical":
      return "border-red-500/30 bg-red-50";
    default:
      return "";
  }
};

const getIconColor = (status) => {
  switch (status) {
    case "best":
      return "text-blue-600";
    case "good":
      return "text-green-500";
    case "low":
      return "text-yellow-500";
    case "critical":
      return "text-red-500 animate-pulse";
    default:
      return "";
  }
};

const MachineAlerts = () => {
  return (
    <section className="mb-6">
      <h2 className="text-md font-semibold text-gray-800 mb-3">
        Machine Output This Week
      </h2>

      <div className="grid grid-cols-4 gap-3">
        {machines.map((machine) => (
          <div
            key={machine.id}
            className={`border rounded-lg p-3 shadow-sm ${getStatusStyles(
              machine.status
            )}`}
          >
            {/* Header with Icon */}
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`p-1.5 rounded bg-gray-50 ${getIconColor(
                  machine.status
                )}`}
              >
                <Cpu className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-gray-800">
                Machine {machine.id}
              </span>
            </div>

            {/* Units */}
            <div className="text-xl font-semibold text-gray-800">
              {machine.unitsProduced.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">units produced</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MachineAlerts;
