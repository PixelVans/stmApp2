
"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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

// helper: get date from ISO week + weekday
function getDateFromWeekAndDay(year, week, dayShort) {
  const dayMap = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 7,
  };

  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay();
  const ISOweekStart =
    dow <= 4
      ? new Date(simple.setDate(simple.getDate() - simple.getDay() + 1))
      : new Date(simple.setDate(simple.getDate() + 8 - simple.getDay()));

  const result = new Date(ISOweekStart);
  result.setDate(ISOweekStart.getDate() + (dayMap[dayShort] - 1));
  return result;
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

export default function WeavingProductionPage2026() {
        const [formData, setFormData] = useState({
            weekNo: getISOWeek(),
            day: new Date().toLocaleDateString("en-US", { weekday: "short" }),
            year: new Date().getFullYear(),
            machineNo: "1",
            article: "Cellular",
            counter: "",
            machineReadingShiftA: "",
            machineReadingShiftB: "",
            beamUsedShiftA: "",
            beamUsedShiftB: "",
            stopReasonShiftA: "",
            stopReasonShiftB: "",
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
          "Pulling",
          "Let-Off",
        ];

  const articleOptions = [
          "Cellular",
          "Plain CounterPane",
          "CreamStripe Blue",
          "Bed Sheet",
          "Towels",
        ];

  const machineArticles = {
        1: "Cellular",
        2: "CreamStripe Blue",
        3: "Bed Sheet",
        4: "Towels",
      };

  // Initialize day
  useEffect(() => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "short" });
    setFormData((prev) => ({ ...prev, day: today }));
  }, []);

  const resetShiftData = (keepMachine = false) => {
        setFormData((prev) => ({
          weekNo: prev.weekNo,
          day: prev.day,
          year: prev.year, 
          machineNo: keepMachine ? prev.machineNo : "1",
          article: keepMachine ? prev.article : "Cellular",
          counter: "",
          machineReadingShiftA: "",
          machineReadingShiftB: "",
          stopReasonShiftA: "",
          stopReasonShiftB: "",
          beamUsedShiftA: "",
          beamUsedShiftB: "",
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

      const correctedDay = formData.day === "Thu" ? "Thur" : formData.day;

      const selectedDate = getDateFromWeekAndDay(
          formData.year,
          formData.weekNo,
          formData.day
        );


      const month = selectedDate.getMonth() + 1;
      const dateISO = selectedDate.toISOString().split("T")[0];
      const year = selectedDate.getFullYear();

const rowsToSubmit = [
        {
          MachineNo: Number(formData.machineNo),
          Shift: "A",
          UnitsProduced: Number(formData.machineReadingShiftA),
          BeamUsed: formData.beamUsedShiftA,
          Notes: formData.stopReasonShiftA || "",
          Counter: Number(formData.counter),
          Article: formData.article,
          Day: correctedDay,
          WeekNo: Number(formData.weekNo),
          Month: selectedDate.getMonth() + 1,
          Date: selectedDate.toISOString().split("T")[0],
          Year: formData.year,
        },
        {
          MachineNo: Number(formData.machineNo),
          Shift: "B",
          UnitsProduced: Number(formData.machineReadingShiftB),
          BeamUsed: formData.beamUsedShiftB,
          Notes: formData.stopReasonShiftB || "",
          Counter: Number(formData.counter),
          Article: formData.article,
          Day: correctedDay,
          WeekNo: Number(formData.weekNo),
          Month: selectedDate.getMonth() + 1,
          Date: selectedDate.toISOString().split("T")[0],
          Year: formData.year,
        },
      ];




      const response = await fetch("/api/weaving-production26/update-weaving-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rowsToSubmit),
      });

      if (!response.ok) throw new Error("Failed to save production data");

      toast.success(
        `Production data updated for Machine ${formData.machineNo} (Week ${formData.weekNo})`
      );

      setMachineStatus("success");
      resetShiftData(true);
    } catch (err) {
     // console.error(err);
      toast.error("Failed to submit form.");
      setMachineStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => resetShiftData(false);

  const focusRing =
    "focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500";

  return (
    <div className="  lg:relative max-w-[650px] mx-auto pb-3 px-3 md:px-6 lg:px-9 shadow-md shadow-slate-300 rounded-lg">
      <div className="absolute top-3 right-4 text-xs font-medium text-slate-500">
        {formatTodayDate()}
      </div>

       <h1 className="text-lg 2xl:text-xl text-blue-900  text-center mb-4">
         Update Weaving Production
      </h1>
        {/* Week + Day selector */}
      <div className="mb-4 text-center flex items-center justify-center gap-4">
        <div className="">
          <label className="text-sm  font-medium mr-2 text-slate-800">Year:</label>
          <select
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
            className={`border border-slate-300 bg-slate-50 rounded-md px-2 py-1 text-sm w-28 ${focusRing}`}
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium mr-2 text-slate-800">Week:</label>
          <select
            value={formData.weekNo}
            onChange={(e) => setFormData({ ...formData, weekNo: Number(e.target.value) })}
            className={`border border-slate-300 bg-slate-50 rounded-md px-2 py-1 text-sm w-28 ${focusRing}`}
          >
            {Array.from({ length: 52 }, (_, i) => i + 1).map((week) => (
              <option key={week} value={week}>
                Week {week}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium mr-2 text-slate-800">Day:</label>
          <select
            value={formData.day}
            onChange={(e) => setFormData({ ...formData, day: e.target.value })}
            className={`border border-slate-300 bg-slate-50 rounded-md px-2 py-1 text-sm w-28 ${focusRing}`}
          >
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Machine number */}
      {formData.machineNo && (
        <p className="text-md xl:text-lg text-center my-5 flex items-center justify-center gap-2">
          Machine No: {formData.machineNo}
          {machineStatus === "success" && <CheckCircle className="w-5 h-5 text-green-700" />}
          {machineStatus === "error" && <XCircle className="w-5 h-5 text-red-500" />}
        </p>
      )}

      {/* Form */}
      <form className="space-y-1 2xl:space-y-2" onSubmit={handleSubmit}>
        {/* Machine Dropdown */}
        <div className="items-center text-center flex gap-4 mx-auto justify-center">
          <label className="text-sm font-semibold text-slate-800 bg-blue-100 p-2 px-4 w-48 rounded-md rounded-r-full">
            Select Machine:
          </label>
          <select
            required
            value={formData.machineNo}
            onChange={(e) => handleMachineChange(e.target.value)}
            className={`w-40 border border-slate-300 bg-slate-50 rounded-md px-2 py-1 text-sm ${focusRing}`}
          >
            {[1, 2, 3, 4].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* Article Dropdown */}
        <div className="items-center text-center flex gap-4 mx-auto justify-center">
          <label className="text-sm font-medium text-slate-800 bg-blue-100 p-2 px-4 w-48 rounded-md rounded-r-full">
            Select Article:
          </label>
          <select
            value={formData.article}
            onChange={(e) => setFormData({ ...formData, article: e.target.value })}
            className={`w-40 border border-slate-300 bg-slate-50 rounded-md px-2 py-1 text-sm ${focusRing}`}
          >
            {articleOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Shifts */}
        {/* Shifts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {["A", "B"].map((shift) => (
          <div
            key={shift}
            className={`space-y-1 border rounded-md p-4 sm:p-4 ${
              shift === "A" ? "bg-yellow-50" : "bg-slate-300"
            } shadow-md`}
          >
            <h3 className="text-sm font-semibold text-blue-700 text-center">
              Shift {shift}
            </h3>

            {/* Meter Reading + Beam Used */}
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-sm font-medium text-slate-800">
                  Meter Reading
                </label>
                <input
                  required
                  type="number"
                  value={formData[`machineReadingShift${shift}`]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [`machineReadingShift${shift}`]: e.target.value,
                    })
                  }
                  className={`w-full border border-slate-300 bg-slate-50 rounded-md px-2 py-1 text-sm ${focusRing}`}
                />
              </div>

              <div className="flex-1">
                <label className="text-xs font-medium text-slate-800">
                  Beam No (If Knotted)
                </label>
                <input
                  type="text"
                  placeholder="Beam - No"
                  value={formData[`beamUsedShift${shift}`]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [`beamUsedShift${shift}`]: e.target.value,
                    })
                  }
                  className={`w-full border border-slate-300 bg-slate-50 rounded-md px-2 py-1 text-sm ${focusRing}`}
                />
              </div>
            </div>

            {/* Stop Reason stays untouched */}
            <div>
              <label className="text-sm font-medium text-slate-800">
                Stop Reason
              </label>
              <select
                value={formData[`stopReasonShift${shift}`]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [`stopReasonShift${shift}`]: e.target.value,
                  })
                }
                className={`w-full border border-slate-300 bg-slate-50 rounded-md px-2 py-1 text-sm ${focusRing}`}
              >
                {stopReasons.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>


        {/* Counter */}
        <div className="mt-3 2xl:mt-5 text-center">
          <label className="text-sm font-medium block mb-1 text-slate-800">Machine Counter</label>
          <input
            required
            type="number"
            value={formData.counter}
            onChange={(e) => setFormData({ ...formData, counter: e.target.value })}
            className={`w-56 border border-slate-300 bg-slate-50 rounded-md px-2 py-1 text-sm ${focusRing}`}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center mb-2 mt-5 lg:mt-4 sm:mb-5 gap-4">
          <Button type="button" variant="destructive" onClick={handleCancel} size="md">
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

       

      