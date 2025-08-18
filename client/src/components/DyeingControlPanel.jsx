// import React, { useEffect, useRef, useState } from "react";
// import { Colour_Chart } from "../utils/constants";
// import useDyeingStore from "../store/zustand";

// const DyeingControlPanel = () => {
//   const store = useDyeingStore();
//   const { setField, resetFields } = useDyeingStore.getState();

//   // Snapshot defaults once
//   const initial = useRef(useDyeingStore.getState());

//   // Local-only state for inputs (to prevent focus loss)
//   const [lotNo, setLotNo] = useState(initial.current.lotNo || "");
//   const [client, setClient] = useState(initial.current.client || "");
//   const [lotWeight, setLotWeight] = useState(initial.current.lotWeight || "");
//   const [article, setArticle] = useState(initial.current.article || "");
//   const [liqRatio, setLiqRatio] = useState(initial.current.liqRatio || "");

//   const today = new Date().toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });
//   const currentYear = new Date().getFullYear();

//   const baseInput =
//     "border border-gray-300 rounded-lg px-2 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition";
//   const baseSelect = baseInput + " bg-white";

//   const FormRow = ({ label, children }) => (
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
//       <label className="font-medium text-gray-700">{label}</label>
//       {children}
//     </div>
//   );

//   const handleCompute = () => {
//     // Push local input state to Zustand
//     setField("lotNo", lotNo);
//     setField("client", client);
//     setField("lotWeight", lotWeight);
//     setField("article", article);
//     setField("liqRatio", liqRatio);

//     // Keep local state synced with Zustand values
//     const current = useDyeingStore.getState();
//     setLotNo(current.lotNo);
//     setClient(current.client);
//     setLotWeight(current.lotWeight);
//     setArticle(current.article);
//     setLiqRatio(current.liqRatio);
//   };

//   const handleReset = () => {
//     resetFields();
//     const defaults = useDyeingStore.getState();
//     setLotNo(defaults.lotNo || "");
//     setClient(defaults.client || "");
//     setLotWeight(defaults.lotWeight || "");
//     setArticle(defaults.article || "");
//     setLiqRatio(defaults.liqRatio || "");
//   };

//   // Allow pressing Enter to execute
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === "Enter") {
//         e.preventDefault();
//         handleCompute();
//       }
//     };
//     document.addEventListener("keydown", handleKeyDown);
//     return () => document.removeEventListener("keydown", handleKeyDown);
//   }, []);

//   return (
//     <div
//       className="
//         p-3 sm:p-4 border border-gray-200 rounded-xl shadow-md bg-blue-50 mb-4
//         fixed top-0 z-30 mt-[64px] rounded-t-none max-h-[360px] lg:px-6
//         text-sm
//       "
//     >
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
//         <div className="text-base font-bold text-gray-900">{today}</div>
//         <div className="text-gray-500 text-sm">Lot Year: {currentYear}</div>
//       </div>

//       {/* Full-width form grid */}
//       <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 w-full">
//         <FormRow label="Winch">
//           <select
//             className={baseSelect}
//             value={store.winch}
//             onChange={(e) => setField("winch", e.target.value)}
//           >
//             <option value="Soft Flow">Soft Flow</option>
//             <option value="Main Winch">Main Winch</option>
//             <option value="Sample Winch">Sample Winch</option>
//             <option value="Paddle Winch">Paddle Winch</option>
//             <option value="Soft Flow-Minimum">Soft Flow-Minimum</option>
//             <option value="VAT">VAT</option>
//           </select>
//         </FormRow>

//         <FormRow label="Dyeing System">
//           <select
//             className={baseSelect}
//             value={store.dyeingSystem}
//             onChange={(e) => setField("dyeingSystem", e.target.value)}
//           >
//             <option value="Reactive">Reactive</option>
//             <option value="Bleaching">Bleaching</option>
//           </select>
//         </FormRow>

//         <FormRow label="Lot No">
//           <input
//             type="text"
//             className={baseInput}
//             value={lotNo}
//             onChange={(e) => setLotNo(e.target.value)}
//           />
//         </FormRow>

//         <FormRow label="Client">
//           <input
//             type="text"
//             className={baseInput}
//             value={client}
//             onChange={(e) => setClient(e.target.value)}
//           />
//         </FormRow>

//         <FormRow label="Shade">
//           <select
//             className={baseSelect}
//             value={store.selectedColour}
//             onChange={(e) => setField("selectedColour", e.target.value)}
//           >
//             {Colour_Chart.map((color, i) => (
//               <option key={i} value={color}>
//                 {color}
//               </option>
//             ))}
//           </select>
//         </FormRow>

//         <FormRow label="Scouring">
//           <select
//             className={baseSelect}
//             value={store.scouring}
//             onChange={(e) => setField("scouring", e.target.value)}
//           >
//             <option value="Reactive">Reactive</option>
//             <option value="Enzymatic">Enzymatic</option>
//             <option value="CreamStripe">CreamStripe</option>
//             <option value="Chlorine">Chlorine</option>
//           </select>
//         </FormRow>

//         <FormRow label="Lot Weight">
//           <input
//             type="number"
//             className={baseInput}
//             value={lotWeight}
//             onChange={(e) => setLotWeight(e.target.value)}
//           />
//         </FormRow>

//         <FormRow label="Article">
//           <input
//             type="text"
//             className={baseInput}
//             value={article}
//             onChange={(e) => setArticle(e.target.value)}
//           />
//         </FormRow>

//         <FormRow label="Softener">
//           <select
//             className={baseSelect}
//             value={store.softener}
//             onChange={(e) => setField("softener", e.target.value)}
//           >
//             <option value="Bubanks">Bubanks</option>
//             <option value="Brenntag">Brenntag</option>
//           </select>
//         </FormRow>

//         <FormRow label="Adjusted Liq. Ratio">
//           <input
//             type="number"
//             className={baseInput}
//             value={liqRatio}
//             onChange={(e) => setLiqRatio(e.target.value)}
//           />
//         </FormRow>

//         <FormRow label="Liq. Ratio:8">
//           <select
//             className={baseSelect}
//             value={store.liqRatio8}
//             onChange={(e) => setField("liqRatio8", e.target.value)}
//           >
//             <option value="Dye Fix">Dye Fix</option>
//             <option value="No Dye Fix">No Dye Fix</option>
//           </select>
//         </FormRow>

//         <FormRow label="Salt Option">
//           <select
//             className={baseSelect}
//             value={store.saltOption}
//             onChange={(e) => setField("saltOption", e.target.value)}
//           >
//             <option value="Glauber Salt">Glauber Salt</option>
//             <option value="Industrial Salt">Industrial Salt</option>
//           </select>
//         </FormRow>

//         <FormRow label="Salt Position">
//           <select
//             className={baseSelect}
//             value={store.saltPosition}
//             onChange={(e) => setField("saltPosition", e.target.value)}
//           >
//             <option value="After Dyes">After Dyes</option>
//             <option value="Before Dyes">Before Dyes</option>
//           </select>
//         </FormRow>
//       </div>

//       {/* Action Buttons */}
//       <div className="mt-4 flex gap-3">
//         <button
//           onClick={handleCompute}
//           className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm"
//         >
//           Execute
//         </button>
//         <button
//           onClick={handleReset}
//           className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
//         >
//           Reset
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DyeingControlPanel;

import React, { useEffect, useRef, useState } from "react";
import { Colour_Chart } from "../utils/constants";
import useDyeingStore from "../store/zustand";

const DyeingControlPanel = () => {
  // ---- Access non-reactive store methods once (no subscriptions) ----
  const { setField, resetFields } = useDyeingStore.getState();

  // ---- Snapshot initial store values once for mounting ----
  const init = useRef(useDyeingStore.getState());

  // ---- Local UI state ONLY (no store subscriptions) ----
  // Inputs (text/number)
  const [lotNo, setLotNo] = useState(init.current.lotNo || "");
  const [client, setClient] = useState(init.current.client || "");
  const [lotWeight, setLotWeight] = useState(init.current.lotWeight || "");
  const [article, setArticle] = useState(init.current.article || "");
  const [liqRatio, setLiqRatio] = useState(init.current.liqRatio || "");

  // Selects (UI controlled locally, but write-through to store on change)
  const [winch, setWinch] = useState(init.current.winch || "Soft Flow");
  const [dyeingSystem, setDyeingSystem] = useState(init.current.dyeingSystem || "Reactive");
  const [selectedColour, setSelectedColour] = useState(init.current.selectedColour || "Biege");
  const [scouring, setScouring] = useState(init.current.scouring || "Enzymatic");
  const [softener, setSoftener] = useState(init.current.softener || "Brenntag");
  const [liqRatio8, setLiqRatio8] = useState(init.current.liqRatio8 || "No Dye Fix");
  const [saltOption, setSaltOption] = useState(init.current.saltOption || "Industrial Salt");
  const [saltPosition, setSaltPosition] = useState(init.current.saltPosition || "");

  // ---- Helpers ----
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const currentYear = new Date().getFullYear();

  const baseInput =
    "border border-gray-300 rounded-lg px-2 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition";
  const baseSelect = baseInput + " bg-white";

  const FormRow = ({ label, children }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
      <label className="font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );

  // ---- Event handlers ----
  const handleCompute = () => {
    // Push inputs only (selects already sync on change)
    setField("lotNo", lotNo);
    setField("client", client);
    setField("lotWeight", lotWeight);
    setField("article", article);
    setField("liqRatio", liqRatio);
  };

  const handleReset = () => {
    // Reset store to its defaults
    resetFields();

    // Read fresh defaults and reflect in local UI state
    const fresh = useDyeingStore.getState();

    // Inputs
    setLotNo(fresh.lotNo || "");
    setClient(fresh.client || "");
    setLotWeight(fresh.lotWeight || "");
    setArticle(fresh.article || "");
    setLiqRatio(fresh.liqRatio || "");

    // Selects
    setWinch(fresh.winch || "Soft Flow");
    setDyeingSystem(fresh.dyeingSystem || "Reactive");
    setSelectedColour(fresh.selectedColour || "Biege");
    setScouring(fresh.scouring || "Enzymatic");
    setSoftener(fresh.softener || "Brenntag");
    setLiqRatio8(fresh.liqRatio8 || "No Dye Fix");
    setSaltOption(fresh.saltOption || "Industrial Salt");
    setSaltPosition(fresh.saltPosition || "");
  };

  // Enter triggers Execute (stable, single listener)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleCompute();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []); // no deps → no rebind on every keystroke

  // ---- UI ----
  return (
    <div
      className="
        p-3 sm:p-4 border border-gray-200 rounded-xl shadow-md bg-blue-50 mb-4
        fixed top-0 z-30 mt-[64px] rounded-t-none max-h-[360px] lg:px-6
        text-sm
      "
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <div className="text-base font-bold text-gray-900">{today}</div>
        <div className="text-gray-500 text-sm">Lot Year: {currentYear}</div>
      </div>

      {/* Form grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 w-full">
        <FormRow label="Winch">
          <select
            className={baseSelect}
            value={winch}
            onChange={(e) => {
              const v = e.target.value;
              setWinch(v);
              setField("winch", v);
            }}
          >
            <option value="Soft Flow">Soft Flow</option>
            <option value="Main Winch">Main Winch</option>
            <option value="Sample Winch">Sample Winch</option>
            <option value="Paddle Winch">Paddle Winch</option>
            <option value="Soft Flow-Minimum">Soft Flow-Minimum</option>
            <option value="VAT">VAT</option>
          </select>
        </FormRow>

        <FormRow label="Dyeing System">
          <select
            className={baseSelect}
            value={dyeingSystem}
            onChange={(e) => {
              const v = e.target.value;
              setDyeingSystem(v);
              setField("dyeingSystem", v);
            }}
          >
            <option value="Reactive">Reactive</option>
            <option value="Bleaching">Bleaching</option>
          </select>
        </FormRow>

        <FormRow label="Lot No">
          <input
            type="text"
            className={baseInput}
            value={lotNo}
            onChange={(e) => setLotNo(e.target.value)}
          />
        </FormRow>

        <FormRow label="Client">
          <input
            type="text"
            className={baseInput}
            value={client}
            onChange={(e) => setClient(e.target.value)}
          />
        </FormRow>

        <FormRow label="Shade">
          <select
            className={baseSelect}
            value={selectedColour}
            onChange={(e) => {
              const v = e.target.value;
              setSelectedColour(v);
              setField("selectedColour", v);
            }}
          >
            {Colour_Chart.map((color, i) => (
              <option key={i} value={color}>
                {color}
              </option>
            ))}
          </select>
        </FormRow>

        <FormRow label="Scouring">
          <select
            className={baseSelect}
            value={scouring}
            onChange={(e) => {
              const v = e.target.value;
              setScouring(v);
              setField("scouring", v);
            }}
          >
            <option value="Reactive">Reactive</option>
            <option value="Enzymatic">Enzymatic</option>
            <option value="CreamStripe">CreamStripe</option>
            <option value="Chlorine">Chlorine</option>
          </select>
        </FormRow>

        <FormRow label="Lot Weight">
          <input
            type="number"
            className={baseInput}
            value={lotWeight}
            onChange={(e) => setLotWeight(e.target.value)}
          />
        </FormRow>

        <FormRow label="Article">
          <input
            type="text"
            className={baseInput}
            value={article}
            onChange={(e) => setArticle(e.target.value)}
          />
        </FormRow>

        <FormRow label="Softener">
          <select
            className={baseSelect}
            value={softener}
            onChange={(e) => {
              const v = e.target.value;
              setSoftener(v);
              setField("softener", v);
            }}
          >
            <option value="Bubanks">Bubanks</option>
            <option value="Brenntag">Brenntag</option>
          </select>
        </FormRow>

        <FormRow label="Adjusted Liq. Ratio">
          <input
            type="number"
            className={baseInput}
            value={liqRatio}
            onChange={(e) => setLiqRatio(e.target.value)}
          />
        </FormRow>

        <FormRow label="Liq. Ratio:8">
          <select
            className={baseSelect}
            value={liqRatio8}
            onChange={(e) => {
              const v = e.target.value;
              setLiqRatio8(v);
              setField("liqRatio8", v);
            }}
          >
            <option value="Dye Fix">Dye Fix</option>
            <option value="No Dye Fix">No Dye Fix</option>
          </select>
        </FormRow>

        <FormRow label="Salt Option">
          <select
            className={baseSelect}
            value={saltOption}
            onChange={(e) => {
              const v = e.target.value;
              setSaltOption(v);
              setField("saltOption", v);
            }}
          >
            <option value="Glauber Salt">Glauber Salt</option>
            <option value="Industrial Salt">Industrial Salt</option>
          </select>
        </FormRow>

        <FormRow label="Salt Position">
          <select
            className={baseSelect}
            value={saltPosition}
            onChange={(e) => {
              const v = e.target.value;
              setSaltPosition(v);
              setField("saltPosition", v);
            }}
          >
            <option value=""></option>
            <option value="After Dyes">After Dyes</option>
            <option value="Before Dyes">Before Dyes</option>
          </select>
        </FormRow>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-3">
        <button
          onClick={handleCompute}
          className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm"
        >
          Execute
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default DyeingControlPanel;
