import { Layers } from "lucide-react";
import { Link } from "react-router-dom";

const GreyRolls = () => {
  const totalRolls = 150;
  const gradeA = { rolls: 100, percentage: 66.7 };
  const gradeB = { rolls: 50, percentage: 33.3 };

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-xl shadow p-5 border border-gray-200 transition-all duration-200">
      {/* Header */}
       <Link
      to="/grey-rolls"
      className="dashboard-card flex items-center justify-between p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md 
      hover:bg-blue-100 transition"
    >
      {/* Left side: title */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Grey Rolls
        </h2>
        <span className="text-sm font-bold text-gray-800">150 Rolls</span>
      </div>

      {/* Right side: icon */}
      <Layers className="w-4 h-4 text-gray-500" />
    </Link>

      {/* Donut Chart */}
      <div className="flex-1 flex items-center justify-center py-4">
        <div className="relative w-36 h-36">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#E5E7EB" // gray-200
              strokeWidth="12"
            />
            {/* Grade A Arc */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#2563EB" // blue-600
              strokeWidth="12"
              strokeDasharray={`${gradeA.percentage * 2.51} ${100 * 2.51}`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
            {/* Grade B Arc */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#93C5FD" // blue-300
              strokeWidth="12"
              strokeDasharray={`${gradeB.percentage * 2.51} ${100 * 2.51}`}
              strokeDashoffset={`${-gradeA.percentage * 2.51}`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-800">{totalRolls}</span>
            <span className="text-xs text-gray-500">Total Rolls</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
        {/* Grade A */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600" />
            <span className="text-sm text-gray-800">Grade A</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-semibold text-gray-800">
              {gradeA.rolls} rolls
            </span>
            <span className="text-xs text-gray-500 ml-2">{gradeA.percentage}%</span>
          </div>
        </div>

        {/* Grade B */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-300" />
            <span className="text-sm text-gray-800">Grade B</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-semibold text-gray-800">
              {gradeB.rolls} rolls
            </span>
            <span className="text-xs text-gray-500 ml-2">{gradeB.percentage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GreyRolls;
