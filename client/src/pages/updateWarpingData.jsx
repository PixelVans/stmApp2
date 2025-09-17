
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { saveWarpingData } from "@/api/dyeingApi";
import { toast } from "sonner"; 

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

export default function UpdateWarpingData() {
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

 
  const machineNumbers = ["1", "2", "3", "4"];
  const beamPositions = ["Ground", "Pile",];
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

  const yarnCounts1 = ["20/2", "9/4", "6/4", "6/2", "13.5/6", "30/2 PC",]; 
  const yarnCounts2 = ["24/2 Dyed", "13.5/6",  "9/4", "6/4","6/2",]; 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await saveWarpingData(formData);
      toast.success("Warping data saved successfully!"); 
      handleReset();
    } catch (error) {
      console.error("Error saving warping data:", error);
      toast.error(error.message);
    }
  };

  const handleReset = () => {
    setFormData({
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
  };

  const inputStyle =
    "w-full border border-slate-400 bg-slate-50 text-slate-800 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <div className="relative flex sm:block max-w-4xl mx-auto py-5 px-5 md:px-8 mt-5 shadow-md shadow-slate-500 rounded-lg bg-white">
      {/* Today date top-right */}
      <div className="absolute top-3 right-4 text-xs font-medium text-slate-600">
        {formatTodayDate()}
      </div>

      {/* Title */}
      <h1 className="text-lg sm:text-xl mt-7 font-bold text-center md:mb-7">
        Update Warping Data for: <span className="text-blue-600 font-bold hidden md:inline"> 
           Machine No: {formData.machineNumber}</span>
      </h1>

      {/* Mobile-only machine number below title */}
      <p className="text-xl text-center text-blue-600 font-bold mb-6 md:hidden">
        Machine No: {formData.machineNumber}
      </p>

      <form onSubmit={''}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-2 sm:space-y-4">

            <div>
              <label className="text-sm font-medium">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className={inputStyle}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Machine Number</label>
              <select
                value={formData.machineNumber}
                onChange={(e) =>
                  setFormData({ ...formData, machineNumber: e.target.value })
                }
                className={inputStyle}
              ><option value="">Select</option>
                {machineNumbers.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

              <div>
              <label className="text-sm font-medium">Beam Position</label>
              <select
                value={formData.beamPosition}
                onChange={(e) =>
                  setFormData({ ...formData, beamPosition: e.target.value })
                }
                className={inputStyle}
              >
                <option value="">Select</option>
                {beamPositions.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </div>
            

              <div>
              <label className="text-sm font-medium">Article</label>
              <select
                value={formData.article}
                onChange={(e) =>
                  setFormData({ ...formData, article: e.target.value })
                }
                className={inputStyle}
              >
                <option value="">Select</option>
                {articleOptions.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Beam Number</label>
              <input
                type="text"
                value={formData.beamNumber}
                onChange={(e) =>
                  setFormData({ ...formData, beamNumber: e.target.value })
                }
                className={inputStyle}
              />
            </div>

       

            <div>
              <label className="text-sm font-medium">Meters</label>
              <input
                type="number"
                value={formData.meters}
                onChange={(e) =>
                  setFormData({ ...formData, meters: e.target.value })
                }
                className={inputStyle}
              />
            </div>

          
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Yarn Count 1</label>
              <select
                value={formData.yarnCount1}
                onChange={(e) =>
                  setFormData({ ...formData, yarnCount1: e.target.value })
                }
                className={inputStyle}
              >
                <option value="">Select</option>
                {yarnCounts1.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Yarn Count 2</label>
              <select
                value={formData.yarnCount2}
                onChange={(e) =>
                  setFormData({ ...formData, yarnCount2: e.target.value })
                }
                className={inputStyle}
              >
                <option value="">Select</option>
                {yarnCounts2.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Total Ends</label>
              <input
                type="number"
                value={formData.totalEnds}
                onChange={(e) =>
                  setFormData({ ...formData, totalEnds: e.target.value })
                }
                className={inputStyle}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Weight of Yarn 1 (Kg)</label>
              <input
                type="number"
                value={formData.weightYarn1}
                onChange={(e) =>
                  setFormData({ ...formData, weightYarn1: e.target.value })
                }
                className={inputStyle}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Weight of Yarn 2 (Kg)</label>
              <input
                type="number"
                value={formData.weightYarn2}
                onChange={(e) =>
                  setFormData({ ...formData, weightYarn2: e.target.value })
                }
                className={inputStyle}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Beam Unit Counter</label>
              <input
                type="number"
                value={formData.beamUnitCounter}
                onChange={(e) =>
                  setFormData({ ...formData, beamUnitCounter: e.target.value })
                }
                className={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button className="" type="button" variant="destructive" size="md" onClick={handleReset}>
            Clear
          </Button>
          <Button className="" type="submit" size="md">Submit</Button>
        </div>

      </form>
    </div>
  );
}
