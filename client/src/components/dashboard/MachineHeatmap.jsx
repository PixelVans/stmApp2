"use client";

import { useState, useMemo } from "react";
import { Activity } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Dummy machines & production data
const machines = [1, 2, 3, 4];
const dummyData = Array.from({ length: 90 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - i);
  return {
    MachineNo: machines[(i % 4)],
    Date: date.toISOString().split("T")[0],
    UnitsProduced: Math.floor(Math.random() * 50 + 50),
    Shift: i % 2 === 0 ? "A" : "B",
    WeekNo: Math.ceil((i + 1) / 7),
    Article: ["Towel", "Cellular", "Bed Sheet", "CreamStripe Blue"][i % 4],
  }; 
});

const MachineHeatmap = () => {
  const [timeFilter, setTimeFilter] = useState("7days");
  const [shiftFilter, setShiftFilter] = useState("");
  const [machineFilter, setMachineFilter] = useState("");

  // Compute filtered data dynamically
  const filteredData = useMemo(() => {
    const now = new Date();
    return dummyData.filter((d) => {
      const dDate = new Date(d.Date);

      // Filter by time
      if (timeFilter === "7days") {
        if ((now - dDate) / (1000 * 60 * 60 * 24) > 7) return false;
      } else if (timeFilter === "30days") {
        if ((now - dDate) / (1000 * 60 * 60 * 24) > 30) return false;
      } else if (timeFilter === "year") {
        if (dDate.getFullYear() !== now.getFullYear()) return false;
      }

      // Filter by shift
      if (shiftFilter && d.Shift !== shiftFilter) return false;

      // Filter by machine
      if (machineFilter && d.MachineNo !== parseInt(machineFilter)) return false;

      return true;
    });
  }, [timeFilter, shiftFilter, machineFilter]);

  // Aggregate units produced per machine
  const chartData = machines.map((m) => {
    const machineData = filteredData.filter((d) => d.MachineNo === m);
    const avg =
      machineData.reduce((sum, d) => sum + d.UnitsProduced, 0) /
      (machineData.length || 1);
    return { machine: `M${m}`, performance: Math.round(avg) };
  });

  return (
    <div className="dashboard-card p-4 mt-20">
      {/* Header + Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <h2 className="section-title text-lg font-semibold">
            Machine Performance
          </h2>
          <Activity className="w-5 h-5 text-muted-foreground" />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {/* Time Selector */}
          <select
            className="border border-gray-300 rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>

          {/* Shift Filter */}
          <select
            className="border border-gray-300 rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={shiftFilter}
            onChange={(e) => setShiftFilter(e.target.value)}
          >
            <option value="">All Shifts</option>
            <option value="A">Shift A</option>
            <option value="B">Shift B</option>
          </select>

          {/* Machine Filter */}
          <select
            className="border border-gray-300 rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={machineFilter}
            onChange={(e) => setMachineFilter(e.target.value)}
          >
            <option value="">All Machines</option>
            {machines.map((m) => (
              <option key={m} value={m}>{`Machine ${m}`}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart */}
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="machine" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="performance"
              fill="#1e40af"
              barSize={50}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-border/50 flex justify-between text-xs text-muted-foreground px-2">
        <span>Low Performance</span>
        <span>High Performance</span>
      </div>
    </div>
  );
};

export default MachineHeatmap;
