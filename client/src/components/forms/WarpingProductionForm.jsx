"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { saveWarpingData, fetchWarpingDataByDate, fetchWarpingDataByBeam } from "@/api/dyeingApi";
import { toast } from "sonner";
import { FaSearch } from "react-icons/fa";

// === STYLE CONSTANTS ===
const fieldRow = "flex items-center gap-2 w-full";
const labelStyle =
"text-sm font-medium text-slate-800 w-40 text-left bg-gray-200 px-4 py-1.5 rounded-sm";
const inputCompact =
"flex-1 border border-slate-300 bg-slate-50 text-slate-900 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

// FUNC to format date
function formatTodayDate() {
const today = new Date();
const day = today.getDate();
const month = today.toLocaleString("en-US", { month: "short" });
const year = today.getFullYear();

const suffix =
day % 10 === 1 && day !== 11
? "st"
: day % 10 === 2 && day !== 12
? "nd"
: day % 10 === 3 && day !== 13
? "rd"
: "th";

return `${day}${suffix} ${month} ${year}`;
}

export default function WarpingProductionForm() {
const [loading, setLoading] = useState(false);
const [error, setError] = useState(false);
const [beamSearch, setBeamSearch] = useState("");

const [formData, setFormData] = useState({
beamNumber: "",
date: new Date().toISOString().split("T")[0],
machineNumber: "",
beamPosition: "",
meters: "",
article: "",
yarnCount1: "20/2",
yarnCount2: "",
totalEnds: "",
weightYarn1: "",
weightYarn2: "",
beamUnitCounter: "",
});

const [hasExistingRow, setHasExistingRow] = useState(false);

useEffect(() => {
async function loadData() {
setLoading(true);
setError(false);
try {
const data = await fetchWarpingDataByDate(formData.date);
if (data.length > 0) {
const row = data[0];
setHasExistingRow(true);
setFormData({
    beamNumber: row.BeamNumber || "",
    date: formData.date,
    machineNumber: row.MachineNumber?.toString() || "",
    beamPosition: row.BeamPosition || "",
    article: row.Article || "",
    yarnCount1: row.Yarn1 || "",
    yarnCount2: row.Yarn2 || "",
    totalEnds: row.TotalEnds || "",
    meters: row.Meters || "",
    weightYarn1: row.WeightofYarn1 || "",
    weightYarn2: row.WeightofYarn2 || "",
    beamUnitCounter: row.KnottingCounter || "",
    });
} else {
  setHasExistingRow(false);
  handleReset(false);
}
} catch (err) {
  console.error(err);
  setError(true);
} finally {
setLoading(false);
}
}


loadData();


}, [formData.date]);

const handleSubmit = async (e) => {
e.preventDefault();
try {
await saveWarpingData(formData, hasExistingRow);
toast.success(
hasExistingRow
? "Warping data updated successfully!"
: "Warping data inserted successfully!"
);
handleReset(false);
} 
catch (err) {
console.error(err);
let errorMessage = "Failed to save data";
if (err?.message) errorMessage = err.message;
if (err?.response?.data?.message) errorMessage = err.response.data.message;
toast.error(errorMessage);
}
};

async function handleBeamSearch() {
if (!beamSearch.trim()) {
toast.error("Enter a beam number");
return;
}

try {
  setLoading(true);
  const row = await fetchWarpingDataByBeam(beamSearch);
  setHasExistingRow(true);
  setFormData({
    beamNumber: row.BeamNumber || "",
    date: row.Date?.split("T")[0] || "",
    machineNumber: row.MachineNumber?.toString() || "",
    beamPosition: row.BeamPosition || "",
    article: row.Article || "",
    yarnCount1: row.Yarn1 || "",
    yarnCount2: row.Yarn2 || "",
    totalEnds: row.TotalEnds || "",
    meters: row.Meters || "",
    weightYarn1: row.WeightofYarn1 || "",
    weightYarn2: row.WeightofYarn2 || "",
    beamUnitCounter: row.KnottingCounter || "",
  });
  toast.success(`Beam ${beamSearch} data loaded`);
} catch (err) {
  console.error(err);
  toast.error(err.message || "Failed to fetch beam data");
} finally {
  setLoading(false);
}


}

const handleReset = (resetDate = true) => {
      setFormData({
      beamNumber: "",
      date: resetDate ? new Date().toISOString().split("T")[0] : formData.date,
      machineNumber: "",
      beamPosition: "",
      meters: "",
      article: "",
      yarnCount1: "20/2",
      yarnCount2: "",
      totalEnds: "",
      weightYarn1: "",
      weightYarn2: "",
      beamUnitCounter: "",
      });
};

const machineNumbers = ["1", "2", "3", "4"];
const beamPositions = ["Ground", "Pile"];
const articleOptions = [
    '72" Wide Cellular',
    '63" Wide Counter Pane',
    '90" Wide Counter Pane',
    '30" Wide Towel',
    '40" Wide Towel',
    '20" Wide Towel',
    '12" Wide Towel',
    '90" Wide Bed Sheet',
    ];
const yarnCounts1 = ["20/2", "9/4", "6/4", "6/2", "13.5/6", "24/2", "30/2 PC"];
const yarnCounts2 = ["24/2 Dyed", "13.5/6", "9/4", "6/4", "6/2"];

if (loading)
return ( 
<div className="flex flex-col mt-[170px] items-center justify-center bg-white"> 
  
  <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
      <div
          key={i}
          className="w-2 h-6 bg-blue-500 rounded animate-[wave_1.2s_ease-in-out_infinite]"
          style={{ animationDelay: `${i * 0.1}s` }}
          >

      </div>
      ))} 
</div> 
  <p className="mt-6 text-lg font-semibold text-gray-800">
    Loading Warping Production Data.. 
  </p>

 </div>
);

if (error)

return ( 
    <div className="flex flex-col items-center justify-center mt-36 text-center"> 
      <p className="text-gray-700 font-medium mb-2">
    Failed to load Warping Production Data.
    </p>
    <Button onClick={() => window.location.reload()} variant="outline">
    Retry
    </Button> 
    </div>
);

return ( 
<div className="relative max-w-4xl mx-auto py-5 pb-9 px-5 md:px-8 mt-2 shadow-md shadow-slate-300 rounded-lg bg-white">


  <div className="absolute top-3 right-4 text-xs font-medium text-slate-600">
    {formatTodayDate()}
  </div>

  {/* SEARCH BY BEAM NUMBER */}
  <div className="flex items-center gap-2 mb-4 w-fit mx-auto">
    <input
      type="number"
      placeholder="Search By Beam Number..."
      value={beamSearch}
      onChange={(e) => setBeamSearch(e.target.value)}
      className="border border-slate-400 bg-white text-black rounded-md px-3 py-2 text-sm w-48 
                 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
    />
    <button
      className="flex cursor-pointer items-center gap-2 bg-slate-200 text-slate-700 px-5 py-2 rounded-xl hover:bg-slate-300"
      onClick={handleBeamSearch}
    >
      <FaSearch className="text-slate-600" />
      <span>Search</span>
    </button>
  </div>

  <h1 className="text-lg sm:text-xl text-blue-900 text-center my-5">
    Update Warping Production
  </h1>

  <form onSubmit={handleSubmit}>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* LEFT COLUMN */}
      <div className="space-y-3">
        <div className={fieldRow}>
          <label className={labelStyle}>Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className={inputCompact}
          />
        </div>

        <div className={fieldRow}>
          <label className={labelStyle}>Machine No</label>
          <select
            value={formData.machineNumber}
            onChange={(e) => setFormData({ ...formData, machineNumber: e.target.value })}
            className={inputCompact}
          >
            <option value="">Select</option>
            {machineNumbers.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className={fieldRow}>
          <label className={labelStyle}>Beam Pos</label>
          <select
            value={formData.beamPosition}
            onChange={(e) => setFormData({ ...formData, beamPosition: e.target.value })}
            className={inputCompact}
          >
            <option value="">Select</option>
            {beamPositions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className={fieldRow}>
          <label className={labelStyle}>Article</label>
          <select
            value={formData.article}
            onChange={(e) => setFormData({ ...formData, article: e.target.value })}
            className={inputCompact}
          >
            <option value="">Select</option>
            {articleOptions.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div className={fieldRow}>
          <label className={labelStyle}>Beam No</label>
          <input
            type="text"
            value={formData.beamNumber}
            onChange={(e) => setFormData({ ...formData, beamNumber: e.target.value })}
            className={inputCompact}
          />
        </div>

        <div className={fieldRow}>
          <label className={labelStyle}>Meters</label>
          <input
            type="number"
            value={formData.meters}
            onChange={(e) => setFormData({ ...formData, meters: e.target.value })}
            className={inputCompact}
          />
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="space-y-3">
        <div className={fieldRow}>
          <label className={labelStyle}>Yarn Count 1</label>
          <select
            value={formData.yarnCount1}
            onChange={(e) => setFormData({ ...formData, yarnCount1: e.target.value })}
            className={inputCompact}
          >
            {yarnCounts1.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className={fieldRow}>
          <label className={labelStyle}>Yarn Count 2</label>
          <select
            value={formData.yarnCount2}
            onChange={(e) => setFormData({ ...formData, yarnCount2: e.target.value })}
            className={inputCompact}
          >
            <option value="">Select</option>
            {yarnCounts2.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className={fieldRow}>
          <label className={labelStyle}>Total Ends</label>
          <input
            type="number"
            value={formData.totalEnds}
            onChange={(e) => setFormData({ ...formData, totalEnds: e.target.value })}
            className={inputCompact}
          />
        </div>

        <div className={fieldRow}>
          <label className={labelStyle}>Weight Yarn 1</label>
          <input
            type="number"
            value={formData.weightYarn1}
            onChange={(e) => setFormData({ ...formData, weightYarn1: e.target.value })}
            className={inputCompact}
          />
        </div>

        <div className={fieldRow}>
          <label className={labelStyle}>Weight Yarn 2</label>
          <input
            type="number"
            value={formData.weightYarn2}
            onChange={(e) => setFormData({ ...formData, weightYarn2: e.target.value })}
            className={inputCompact}
          />
        </div>

        <div className={fieldRow}>
          <label className={labelStyle}>Beam Unit Counter</label>
          <input
            type="number"
            value={formData.beamUnitCounter}
            onChange={(e) => setFormData({ ...formData, beamUnitCounter: e.target.value })}
            className={inputCompact}
          />
        </div>
      </div>
    </div>

    <div className="flex justify-center gap-4 mt-8">
      <Button type="button" variant="destructive" onClick={() => handleReset(false)}>
        Clear
      </Button>
      <Button type="submit">{hasExistingRow ? "Update" : "Submit"}</Button>
    </div>
  </form>
</div>


);
}
