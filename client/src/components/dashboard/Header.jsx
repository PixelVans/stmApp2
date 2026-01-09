import { Calendar } from "lucide-react";

const Header = () => {
  return (
    <header className="flex items-center justify-between py-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
          STM <span className="text-blue-600">Production Overview</span>
        </h1>
        
      </div>

      {/* Period Selector */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Calendar className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            defaultValue="7days"
            className="pl-8 pr-3 py-2 w-44 bg-gray-50 border border-gray-200 rounded shadow-sm text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;
