import { Droplets } from "lucide-react";

const WaterReserve = () => {
  const waterLevel = 78; // percentage
  const maxCapacity = 50000; // liters
  const currentLevel = Math.round((waterLevel / 100) * maxCapacity);

  const getStatus = () => {
    if (waterLevel >= 60) return { label: "Safe", color: "bg-green-100 text-green-600" };
    if (waterLevel >= 30) return { label: "Low", color: "bg-yellow-100 text-yellow-500" };
    return { label: "Critical", color: "bg-red-100 text-red-600" };
  };

  const status = getStatus();

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-xl shadow p-5 border border-gray-200 transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Water Reserve
        </h2>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
          {status.label}
        </span>
      </div>

      {/* Tank Visualization */}
      <div className="flex-1 flex items-center justify-center py-4">
        <div className="relative w-32 h-44">
          {/* Tank Container */}
          <div className="absolute inset-0 rounded-2xl border-4 border-blue-200 bg-blue-50 overflow-hidden">
            {/* Water Level */}
            <div
              className="absolute bottom-0 left-0 right-0 bg-blue-400 transition-all duration-1000 rounded-b-xl"
              style={{ height: `${waterLevel}%` }}
            >
              {/* Wave Effect */}
              <div className="absolute top-0 left-0 right-0 h-3 overflow-hidden">
                <div className="animate-wave">
                  <svg viewBox="0 0 100 10" className="w-full h-3">
                    <path
                      d="M0 5 Q 12.5 0, 25 5 T 50 5 T 75 5 T 100 5 V 10 H 0 Z"
                      fill="#93C5FD" // blue-300 for wave
                      opacity="0.5"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Level Lines */}
            {[25, 50, 75].map((line) => (
              <div
                key={line}
                className="absolute left-0 right-0 border-t border-dashed border-blue-200"
                style={{ bottom: `${line}%` }}
              />
            ))}
          </div>

          {/* Level Indicator */}
          <div
            className="absolute -right-8 flex items-center transition-all duration-1000"
            style={{ bottom: `${waterLevel}%`, transform: "translateY(50%)" }}
          >
            <div className="w-2 h-0.5 bg-blue-600" />
            <span className="text-xs font-semibold text-blue-600 ml-1">{waterLevel}%</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-500">
            <Droplets className="w-4 h-4 text-blue-600" />
            <span className="text-sm">Current Level</span>
          </div>
          <span className="font-semibold text-gray-800">
            {currentLevel.toLocaleString()} L
          </span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-gray-500">Capacity</span>
          <span className="text-sm text-gray-500">{maxCapacity.toLocaleString()} L</span>
        </div>
      </div>

      {/* Wave animation */}
      <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-wave {
          animation: wave 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default WaterReserve;
