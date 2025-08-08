import React, { useState } from "react";

const Dyeing = () => {
  const [form, setForm] = useState({
    client: "",
    article: "",
    lotWeight: "",
    winch: "",
    shade: "",
    scouring: "",
    softener: "",
    liqRatio: "",
    saltOption: "",
    saltPosition: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const dropdownOptions = {
    winch: ["Soft Flow", "Jet", "Overflow"],
    shade: ["Green - Rain", "Cream - Pale", "Deep Red"],
    scouring: ["Enzymatic", "Caustic", "No Scouring"],
    softener: ["Bubanks", "Softener Sarex", "None"],
    liqRatio: ["6", "8", "10", "12"],
    saltOption: ["No Dye Fix", "Half Salt", "Full Salt"],
    saltPosition: ["Beginning", "Middle", "End"]
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans text-sm space-y-6">
      <h2 className="text-xl font-bold">Dyeing Process Setup</h2>

      {/* === INPUTS & DROPDOWNS === */}
      <div className="grid grid-cols-3 gap-4 bg-gray-100 p-4 rounded shadow-sm">
        {/* Inputs */}
        {["client", "article", "lotWeight"].map((field) => (
          <div key={field} className="flex flex-col">
            <label className="text-sm capitalize font-medium">{field}</label>
            <input
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="border px-3 py-1 rounded"
              placeholder={`Enter ${field}`}
            />
          </div>
        ))}

        {/* Dropdowns */}
        {Object.keys(dropdownOptions).map((field) => (
          <div key={field} className="flex flex-col">
            <label className="text-sm capitalize font-medium">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <select
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="border px-3 py-1 rounded"
            >
              <option value="">Select {field}</option>
              {dropdownOptions[field].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* === PLACEHOLDER FOR STEPS (WILL BE DYNAMIC) === */}
      <div className="border p-4 rounded shadow bg-white">
        <h3 className="font-bold text-lg mb-2">Step 1: Scouring</h3>
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Chemical</th>
              <th className="border px-2 py-1">Grams/Ltr</th>
              <th className="border px-2 py-1">Amount</th>
              <th className="border px-2 py-1">Adjustments</th>
              <th className="border px-2 py-1">Temp</th>
              <th className="border px-2 py-1">Time</th>
              <th className="border px-2 py-1">pH</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-2 py-1">Ketoprep L.A</td>
              <td className="border px-2 py-1">0.5</td>
              <td className="border px-2 py-1">2.4 Kgs</td>
              <td className="border px-2 py-1">-</td>
              <td className="border px-2 py-1">60°C</td>
              <td className="border px-2 py-1">30 mins</td>
              <td className="border px-2 py-1">9 - 10</td>
            </tr>
            {/* More static rows */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dyeing;
