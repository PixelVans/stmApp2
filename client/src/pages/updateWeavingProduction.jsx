"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { saveWeavingProduction } from "@/api/dyeingApi";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";

// helper: get ISO week number
function getISOWeek(date = new Date()) {
  const tempDate = new Date(date.getTime());
  tempDate.setHours(0, 0, 0, 0);
  tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
  const week1 = new Date(tempDate.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((tempDate.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) /
        7
    )
  );
}

// helper: format date like "16th Sept 2025"
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

export default function UpdateWeavingProductionPage() {
  const [formData, setFormData] = useState({
    weekNo: getISOWeek(),
    day: "",
    machineNo: "1", // default machine
    machineReadingShiftA: "",
    machineReadingShiftB: "",
    stopReasonShiftA: "",
    stopReasonShiftB: "",
    counter: "",
    article: "Cellular", // default article
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [machineStatus, setMachineStatus] = useState(null);

  const stopReasons = [
    "",
    "Article - Change",
    "Beam Fall - Pile",
    "Beam Fall - Ground",
    "Denting",
    "Drawing",
    "Electrical",
    "Knotting - Pile",
    "Knotting - Ground",
    "Mechanical",
    "No Shift",
    "No Power",
    "No Weft",
    "Other",
    "Passing Knots",
    "Setting",
    "Stopped",
  ];

  const articleOptions = ["Cellular", "CreamStripe Blue", "Bedsheet", "Towels"];

  const machineArticles = {
    1: "Cellular",
    2: "CreamStripe Blue",
    3: "Bedsheet",
    4: "Towels",
  };

  // set current day automatically
  useEffect(() => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "short" });
    setFormData((prev) => ({ ...prev, day: today }));
  }, []);

  const resetShiftData = (keepMachine = false) => {
    setFormData((prev) => ({
      weekNo: prev.weekNo,
      day: new Date().toLocaleDateString("en-US", { weekday: "short" }),
      machineNo: keepMachine ? prev.machineNo : "1",
      machineReadingShiftA: "",
      machineReadingShiftB: "",
      stopReasonShiftA: "",
      stopReasonShiftB: "",
      counter: "",
      article: keepMachine ? prev.article : "Cellular",
    }));
    if (!keepMachine) setMachineStatus(null);
  };

  const handleMachineChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      machineNo: value,
      article: machineArticles[value] || prev.article,
      machineReadingShiftA: "",
      machineReadingShiftB: "",
      stopReasonShiftA: "",
      stopReasonShiftB: "",
      counter: "",
    }));
    setMachineStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.machineNo) return;

    try {
      setIsSubmitting(true);
      await saveWeavingProduction(formData);

      toast.success(
        `Production data updated for Machine ${formData.machineNo} (Week ${formData.weekNo})`
      );

      setMachineStatus("success");
      resetShiftData(true);
    } catch (err) {
      console.error("Save error:", err);
      toast.error(err.message || "Failed to submit form.");
      setMachineStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    resetShiftData(false);
  };

  const focusRing =
    "focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500";

  return (
    <div className="relative max-w-xl mx-auto py-3 px-3 md:px-6 mt-2 shadow-md shadow-slate-500 rounded-lg">
      {/* Today date top-right */}
      <div className="absolute top-3 right-4 text-sm font-medium text-slate-500">
        {formatTodayDate()}
      </div>

      <h1 className="text-lg sm:text-xl mt-7 font-bold text-center mb-4">
        Update Weaving Production
      </h1>

      {/* Week + Day selector */}
      <div className="mb-4 text-center flex items-center justify-center gap-4">
        {/* Week Selector */}
        <div>
          <label className="text-sm font-medium mr-2">Week:</label>
          <select
            value={formData.weekNo}
            onChange={(e) =>
              setFormData({ ...formData, weekNo: Number(e.target.value) })
            }
            className={`border border-gray-400 rounded-md px-2 py-1 text-sm w-28 ${focusRing}`}
          >
            {Array.from({ length: 52 }, (_, i) => i + 1).map((week) => (
              <option key={week} value={week}>
                Week {week}
              </option>
            ))}
          </select>
        </div>

        {/* Day Selector */}
        <div>
          <label className="text-sm font-medium mr-2">Day:</label>
          <select
            value={formData.day}
            onChange={(e) => setFormData({ ...formData, day: e.target.value })}
            className={`border border-gray-400 rounded-md px-2 py-1 text-sm w-28 ${focusRing}`}
          >
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Machine number with status */}
      {formData.machineNo && (
        <p className="text-lg font-semibold text-center mb-2 flex items-center justify-center gap-2">
          Machine No: {formData.machineNo}
          {machineStatus === "success" && (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
          {machineStatus === "error" && (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
        </p>
      )}

      {/* Form */}
      <form className="space-y-3" onSubmit={handleSubmit}>
        {/* Machine Dropdown */}
        <div>
          <label className="text-sm font-medium">Select Machine:</label>
          <select
            required
            value={formData.machineNo}
            onChange={(e) => handleMachineChange(e.target.value)}
            className={`w-full border border-gray-400 rounded-md px-2 py-1 text-sm ${focusRing}`}
          >
            {[1, 2, 3, 4].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* Article Dropdown */}
        <div className="text-center">
          <label className="text-xs font-medium">Select Article:</label>
          <select
            value={formData.article}
            onChange={(e) =>
              setFormData({ ...formData, article: e.target.value })
            }
            className={`w-56 border border-slate-400 rounded-md px-2 py-1 text-sm mx-auto block ${focusRing}`}
          >
            {articleOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Shifts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
          {/* Shift A */}
          <div className="space-y-2 border rounded-md p-4 sm:p-2">
            <h3 className="text-sm font-semibold text-blue-700 text-center">Shift A</h3>
            <div>
              <label className="text-xs font-medium">Meter Reading</label>
              <input
                type="number"
                value={formData.machineReadingShiftA}
                onChange={(e) =>
                  setFormData({ ...formData, machineReadingShiftA: e.target.value })
                }
                className={`w-full border border-slate-400 rounded-md px-2 py-0.5 text-sm ${focusRing}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium">Stop Reason</label>
              <select
                value={formData.stopReasonShiftA}
                onChange={(e) =>
                  setFormData({ ...formData, stopReasonShiftA: e.target.value })
                }
                className={`w-full border border-slate-400 rounded-md px-2 py-0.5 text-sm ${focusRing}`}
              >
                {stopReasons.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Shift B */}
          <div className="space-y-2 border rounded-md p-4 sm:p-2 bg-blue-50 shadow-md">
            <h3 className="text-sm font-semibold text-blue-700 text-center">Shift B</h3>
            <div>
              <label className="text-xs font-medium">Meter Reading</label>
              <input
                type="number"
                value={formData.machineReadingShiftB}
                onChange={(e) =>
                  setFormData({ ...formData, machineReadingShiftB: e.target.value })
                }
                className={`w-full border border-slate-400 rounded-md px-2 py-0.5 text-sm ${focusRing}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium">Stop Reason</label>
              <select
                value={formData.stopReasonShiftB}
                onChange={(e) =>
                  setFormData({ ...formData, stopReasonShiftB: e.target.value })
                }
                className={`w-full border border-slate-400 rounded-md px-2 py-0.5 text-sm ${focusRing}`}
              >
                {stopReasons.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Counter */}
        <div className="mt-5 text-center">
          <label className="text-sm font-medium block mb-1">Counter</label>
          <input
            type="number"
            value={formData.counter}
            onChange={(e) =>
              setFormData({ ...formData, counter: e.target.value })
            }
            className={`w-56 border border-slate-400 rounded-md px-2 py-1 text-sm ${focusRing}`}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center mb-4 mt-5 md:mt-7 sm:mb-2 gap-4">
          <Button
            type="button"
            variant="destructive"
            onClick={handleCancel}
            size="md"
          >
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting} size="md">
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
}
