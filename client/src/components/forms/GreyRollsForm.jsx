"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FaSearch } from "react-icons/fa";

export default function GreyRollsForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);

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
    'Cellular',
    'Counterpane',
    'Towel',
    'Bed Sheet',
 ];
  const shifts = ["A", "B"];
  const grades = ["A", "B", "C"];

  const inputStyle ="w-full border border-slate-400 bg-slate-50 text-slate-800 rounded-md px-2 py-1 2xl:py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
  
 const fieldRow = "flex items-center gap-2 w-full";
const labelStyle = "text-sm font-medium text-slate-800 w-28 text-left bg-gray-200 px-4 py-1.5 rounded-sm";
const inputCompact ="flex-1 border border-slate-300 bg-slate-50 text-slate-900 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";


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
  setSaving(true);

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
  } finally {
    setSaving(false); // IMPORTANT
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
    <div className="relative hidden max-w-4xl mx-auto py-5 pb-9 px-5 md:px-8 mt-2 shadow-md shadow-slate-300 rounded-lg bg-white">
      <div className="absolute hidden lg:block top-3 right-4 text-xs font-medium text-slate-600">
        {formatTodayDate()}
      </div>

      
       {/* SEARCH BY BEAM NUMBER */}
            <div className="flex items-center  bg-white mb-2 gap-2 w-fit mx-auto border border-slate-300 rounded-sm">
            
              <input
                type="number"
                placeholder="Search By Roll No..."
                value={searchRollNo}
                onChange={(e) => setSearchRollNo(e.target.value)}
                className="  text-black  px-3 py-1.5 text-sm min-w-48 focus:outline-none focus:ring-1
                 focus:ring-blue-400 focus:border-blue-400  focus:rounded-md"
              />
              
              <button className="bg-slate-200 py-1.5 flex px-2 rounded-md items-center gap-1 cursor-pointer hover:bg-gray-300 " 
              onClick={searchByRollNumber}>
               <FaSearch className=" ml-2 text-slate-500 " /> <span className="mr-1"> Search</span>
              </button>
            </div>

      <h1 className="text-lg sm:text-xl font-bold text-center my-5 text-slate-700">
        Update Grey Roll Production
      </h1>
     

     {/* onSubmit={handleSubmit} */}
    <form 
    >
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

    {/* LEFT */}
    <div className="space-y-4">

      <div className={fieldRow}>
        <label className={labelStyle}>Date</label>
        <input
          type="date"
          value={formData.Date}
          onChange={(e) =>
            setFormData({ ...formData, Date: e.target.value })
          }
          className={inputCompact}
          required
        />
      </div>

      <div className={fieldRow}>
        <label className={labelStyle}>Roll No</label>
        <input
          type="number"
          value={formData.RollNo}
          onChange={(e) =>
            setFormData({ ...formData, RollNo: e.target.value })
          }
          className={inputCompact}
          required
        />
      </div>

      <div className={fieldRow}>
        <label className={labelStyle}>Machine No</label>
        <select
          value={formData.MachineNo}
          onChange={(e) =>
            setFormData({ ...formData, MachineNo: e.target.value })
          }
          className={inputCompact}
          required
        >
          <option value="">Select</option>
          {machineNumbers.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className={fieldRow}>
        <label className={labelStyle}>Article</label>
        <select
          value={formData.Article}
          onChange={(e) =>
            setFormData({ ...formData, Article: e.target.value })
          }
          className={inputCompact}
          required
        >
          <option value="">Select</option>
          {articleOptions.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      <div className={fieldRow}>
        <label className={labelStyle}>Length (m)</label>
        <input
          type="number"
          step="0.0001"
          value={formData.Length}
          onChange={(e) =>
            setFormData({ ...formData, Length: e.target.value })
          }
          className={inputCompact}
          required
        />
      </div>
    </div>

    {/* RIGHT */}
    <div className="space-y-4">

      <div className={fieldRow}>
        <label className={labelStyle}>Weaver</label>
        <input
          type="text"
          value={formData.Weaver}
          onChange={(e) =>
            setFormData({ ...formData, Weaver: e.target.value })
          }
          className={inputCompact}
          required
        />
      </div>

      <div className={fieldRow}>
        <label className={labelStyle}>Shift</label>
        <select
          value={formData.Shift}
          onChange={(e) =>
            setFormData({ ...formData, Shift: e.target.value })
          }
          className={inputCompact}
          required
        >
          {shifts.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className={fieldRow}>
        <label className={labelStyle}>Grade</label>
        <select
          value={formData.Grade}
          onChange={(e) =>
            setFormData({ ...formData, Grade: e.target.value })
          }
          className={inputCompact}
          required
        >
          {grades.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div className={fieldRow}>
        <label className={labelStyle}>Weight (Kg)</label>
        <input
          type="number"
          step="0.0001"
          value={formData.Weight}
          onChange={(e) =>
            setFormData({ ...formData, Weight: e.target.value })
          }
          className={inputCompact}
          required
        />
      </div>

      <div className={fieldRow}>
        <label className={labelStyle}>M/Kg</label>
        <input
          type="number"
          step="0.0001"
          value={
            formData.Weight > 0
              ? (formData.Length / formData.Weight).toFixed(4)
              : ""
          }
          className={inputCompact + " bg-slate-100"}
          disabled
        />
      </div>

    </div>
  </div>

  {/* REMARKS AT BOTTOM CENTER */}
  <div className="mt-6 w-full lg:w-2/3 mx-auto flex flex-col">
    <label className="text-sm font-medium block text-center mb-1 text-slate-900">
      Remarks
    </label>
    <input
      type="text"
      value={formData.Remarks}
      onChange={(e) =>
        setFormData({ ...formData, Remarks: e.target.value })
      }
      className={`${inputCompact} w-72 mx-auto`}
    />
  </div>

  {/* BUTTONS */}
  <div className="flex justify-center gap-4 mt-6">
    <Button type="button" variant="destructive" onClick={() => handleReset(false)}>
      Clear
    </Button>

    <Button type="submit" disabled={saving}>
      {saving ? "Saving..." : hasExistingRow ? "Update" : "Submit"}
    </Button>
  </div>
</form>



     
    </div>
  );
}
