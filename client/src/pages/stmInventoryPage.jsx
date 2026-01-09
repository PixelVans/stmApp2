"use client";

import { useState } from "react";
import { FaSort, FaSearch } from "react-icons/fa";

const inventoryData = [
  { id: 1, type: "Cones", description: "Yarn 9/2", quantity: 45, unit: "kg", category: "Warping Stock" },
  { id: 2, type: "Cheese", description: "Gluber Salt", quantity: 120, unit: "kg", category: "Warping Stock" },
  { id: 3, type: "Bag", description: "Indofix Yellow Dyestuff", quantity: 8, unit: "kg", category: "Warping Stock" },
  { id: 4, type: "Powder", description: "Red Dye", quantity: 150, unit: "kg", category: "Dyestuffs" },
  { id: 5, type: "Liquid", description: "Blue Dye", quantity: 75, unit: "L", category: "Dyestuffs" },
  { id: 6, type: "Salt", description: "Sodium Carbonate", quantity: 85, unit: "kg", category: "Chemicals" },
  { id: 7, type: "Agent", description: "Fixing Agent FX-20", quantity: 12, unit: "L", category: "Chemicals" },
];

const StmInventoryPage = () => {
  const [sortField, setSortField] = useState("description");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const categories = ["All", ...new Set(inventoryData.map((item) => item.category))];

  const displayedData = [...inventoryData]
    .filter(item =>
      (filterCategory === "All" || item.category === filterCategory) &&
      (item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.type.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortDirection === "asc") return a[sortField] > b[sortField] ? 1 : -1;
      return a[sortField] < b[sortField] ? 1 : -1;
    });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold text-blue-700 mb-6 text-center">Inventory Overview</h1>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Search */}
        <div className="flex items-center gap-3 flex-1 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 shadow-sm">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by type or description..."
            className="flex-1 bg-transparent text-sm focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters & Sort */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-600">Category:</span>
          <select
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="description">Description</option>
            <option value="type">Type</option>
            <option value="quantity">Quantity</option>
            <option value="category">Category</option>
          </select>

          <button
            onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
            className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            <FaSort className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">#</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Quantity</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Unit</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {displayedData.map((item, idx) => {
              let statusColor = "text-green-700 bg-green-50";
              if (item.quantity < 20) statusColor = "text-red-700 bg-red-50";
              else if (item.quantity < 50) statusColor = "text-yellow-700 bg-yellow-50";

              return (
                <tr key={item.id} className={`hover:bg-blue-50 transition ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                  <td className="px-4 py-2 text-sm text-gray-700">{idx + 1}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{item.category}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{item.type}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{item.description}</td>
                  <td className="px-4 py-2 text-sm text-right">{item.quantity}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{item.unit}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                      {item.quantity < 20 ? "Critical" : item.quantity < 50 ? "Low" : "Safe"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StmInventoryPage;
