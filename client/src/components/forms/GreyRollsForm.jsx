"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function GreyRollsForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // NEW: Search box value
  const [searchRollNo, setSearchRollNo] = useState("");

  const [formData, setFormData] = useState({
    RollNo: "",
    Date: new Date().toISOString().split("T")[0],
    MachineNo: "",
    Article: "",
    Length: "",
    Weight: "",
    Weaver: "",
    Shift: "A",
    Grade: "A",
    Remarks: "",
  });

  const [hasExistingRow, setHasExistingRow] = useState(false);

  const machineNumbers = ["1", "2", "3", "4"];
  const articleOptions = [
    '30" Wide Towel',
    '40" Wide Towel',
    '20" Wide Towel',
    '90" Wide Bed Sheet',
  ];
  const shifts = ["A", "B"];
  const grades = ["A", "B", "C"];

  const inputStyle =
    "w-full border border-slate-400 bg-slate-50 text-slate-800 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

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

  // Fetch by DATE (unchanged)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);

      try {
        const res = await fetch(
          `/api/grey-rolls-production/by-date/${formData.Date}`
        );

        if (!res.ok) {
          if (res.status === 404) {
            setHasExistingRow(false);
            handleReset(false);
          } else {
            throw new Error("Failed to fetch Grey Roll data");
          }
          return;
        }

        const data = await res.json();
        if (data.length > 0) {
          const row = data[0];
          setHasExistingRow(true);
          setFormData({
            RollNo: row.RollNo,
            Date: row.Date.split("T")[0],
            MachineNo: row.MachineNo.toString(),
            Article: row.Article,
            Length: row.Length,
            Weight: row.Weight,
            Weaver: row.Weaver,
            Shift: row.Shift,
            Grade: row.Grade,
            Remarks: row.Remarks || "",
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
    };

    fetchData();
  }, [formData.Date]);

  // NEW: Fetch existing row by ROLL NUMBER
  const searchByRollNumber = async () => {
    if (!searchRollNo) return toast.error("Enter a roll number first");

    setLoading(true);

    try {
      const res = await fetch(
        `/api/grey-rolls-production/by-roll/${searchRollNo}`
      );

      if (!res.ok) {
        if (res.status === 404) {
          toast.error("Roll number not found");
          return;
        }
        throw new Error("Failed to fetch by roll number");
      }

      const row = await res.json();

      setHasExistingRow(true);
      setFormData({
        RollNo: row.RollNo,
        Date: row.Date.split("T")[0],
        MachineNo: row.MachineNo.toString(),
        Article: row.Article,
        Length: row.Length,
        Weight: row.Weight,
        Weaver: row.Weaver,
        Shift: row.Shift,
        Grade: row.Grade,
        Remarks: row.Remarks || "",
      });

      toast.success("Roll loaded!");
    } catch (err) {
      console.error(err);
      toast.error("Error searching roll number");
    } finally {
      setLoading(false);
    }
  };

  // Submit form (save/update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/grey-rolls-production/update-grey-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save Grey Roll data");

      toast.success(
        hasExistingRow ? "Grey Roll data updated!" : "Grey Roll data inserted!"
      );
      handleReset(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save Grey Roll data");
    }
  };

  const handleReset = (resetDate = true) => {
    setFormData({
      RollNo: "",
      Date: resetDate ? new Date().toISOString().split("T")[0] : formData.Date,
      MachineNo: "",
      Article: "",
      Length: "",
      Weight: "",
      Weaver: "",
      Shift: "A",
      Grade: "A",
      Remarks: "",
    });
    setHasExistingRow(false);
  };

  // Loading screen
  if (loading) {
    return (
      <div className="flex flex-col mt-[170px] items-center justify-center bg-white">
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-6 bg-blue-500 rounded animate-[wave_1.2s_ease-in-out_infinite]"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>

        <p className="mt-6 text-lg font-semibold text-gray-800">
          Loading Grey Rolls Data..
        </p>

        <style>{`
          @keyframes wave {
            0%, 40%, 100% { transform: scaleY(0.4); } 
            20% { transform: scaleY(1.0); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center mt-36 text-center">
        <p className="text-red-500 font-medium mb-2">
          Failed to load Grey Roll Data.
        </p>
        <Button onClick={() => setFormData({ ...formData })} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="relative max-w-4xl mx-auto py-5 px-5 md:px-8 mt-2 shadow-md shadow-slate-500 rounded-lg bg-white">
      <div className="absolute top-3 right-4 text-xs font-medium text-slate-600">
        {formatTodayDate()}
      </div>

      <h1 className="text-lg sm:text-xl font-bold text-center mb-4">
        Update Grey Roll Production
      </h1>

      {/*  SEARCH BY ROLL NUMBER */}
      <div className="flex gap-3 mb-6 w-fit mx-auto">
        <input
          type="number"
          placeholder="Search By Roll No..."
          value={searchRollNo}
          onChange={(e) => setSearchRollNo(e.target.value)}
          className={inputStyle + " w-40"}
        />
        <Button type="button" onClick={searchByRollNumber}>
          Search
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Date</label>
              <input
                type="date"
                value={formData.Date}
                onChange={(e) =>
                  setFormData({ ...formData, Date: e.target.value })
                }
                className={inputStyle}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Roll Number</label>
              <input
                type="number"
                value={formData.RollNo}
                onChange={(e) =>
                  setFormData({ ...formData, RollNo: e.target.value })
                }
                className={inputStyle}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Machine Number</label>
              <select
                value={formData.MachineNo}
                onChange={(e) =>
                  setFormData({ ...formData, MachineNo: e.target.value })
                }
                className={inputStyle}
                required
              >
                <option value="">Select</option>
                {machineNumbers.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Article</label>
              <select
                value={formData.Article}
                onChange={(e) =>
                  setFormData({ ...formData, Article: e.target.value })
                }
                className={inputStyle}
                required
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
              <label className="text-sm font-medium">Length (m)</label>
              <input
                type="number"
                step="0.0001"
                value={formData.Length}
                onChange={(e) =>
                  setFormData({ ...formData, Length: e.target.value })
                }
                className={inputStyle}
                required
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Weaver</label>
              <input
                type="text"
                value={formData.Weaver}
                onChange={(e) =>
                  setFormData({ ...formData, Weaver: e.target.value })
                }
                className={inputStyle}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Shift</label>
              <select
                value={formData.Shift}
                onChange={(e) =>
                  setFormData({ ...formData, Shift: e.target.value })
                }
                className={inputStyle}
                required
              >
                {shifts.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Grade</label>
              <select
                value={formData.Grade}
                onChange={(e) =>
                  setFormData({ ...formData, Grade: e.target.value })
                }
                className={inputStyle}
                required
              >
                {grades.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Remarks</label>
              <input
                type="text"
                value={formData.Remarks}
                onChange={(e) =>
                  setFormData({ ...formData, Remarks: e.target.value })
                }
                className={inputStyle}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Meters per Kg</label>
              <input
                type="number"
                step="0.0001"
                value={
                  formData.Weight > 0
                    ? (formData.Length / formData.Weight).toFixed(4)
                    : ""
                }
                className={inputStyle + " bg-slate-100"}
                disabled
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Button
            type="button"
            variant="destructive"
            onClick={() => handleReset(false)}
          >
            Clear
          </Button>

          <Button type="submit">
            {hasExistingRow ? "Update" : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
}
