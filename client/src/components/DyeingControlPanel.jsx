import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Colour_Chart } from "../utils/constants";
import useDyeingStore from "../store/zustand";
import { useHref } from "react-router-dom";

import { useReactToPrint } from "react-to-print";

// Keep FormRow OUTSIDE to avoid remounts that kill focus
const FormRow = React.memo(function FormRow({ label, children }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
      <label className="font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
});

 

const DyeingControlPanel = ({ open, setOpen,printRef }) => {

    

const handlePrint = useReactToPrint({
  content: () => {
    if (!printRef.current) {
      console.warn("Nothing to print yet!");
      return document.createElement("div"); // empty fallback
    }
    return printRef.current;
  },
  documentTitle: "Dyeing_Report",
  pageStyle: `
    @page { size: A4; margin: 20mm; }
    body { -webkit-print-color-adjust: exact; }
  `,
});


  // Read actions once; do NOT subscribe component to store changes while typing
  const { setField, resetFields } = useDyeingStore.getState();

  // Snapshot defaults once
  const initial = useRef(useDyeingStore.getState());

  // Local-only state for ALL fields (inputs + selects)
  const [winch, setWinch] = useState(initial.current.winch || "Soft Flow");
  const [dyeingSystem, setDyeingSystem] = useState(initial.current.dyeingSystem || "Reactive");
  const [lotNo, setLotNo] = useState(initial.current.lotNo || "");
  const [client, setClient] = useState(initial.current.client || "");
  const [selectedColour, setSelectedColour] = useState(
    initial.current.selectedColour || (Colour_Chart && Colour_Chart[0]) || ""
  );
  const [scouring, setScouring] = useState(initial.current.scouring || "Reactive");
  const [lotWeight, setLotWeight] = useState(initial.current.lotWeight || "");
  const [article, setArticle] = useState(initial.current.article || "");
  const [softener, setSoftener] = useState(initial.current.softener || "Bubanks");
  const [liqRatio, setLiqRatio] = useState(initial.current.liqRatio || "");
  const [liqRatio8, setLiqRatio8] = useState(initial.current.liqRatio8 || "Dye Fix");
  const [saltOption, setSaltOption] = useState(initial.current.saltOption || "Glauber Salt");
  const [saltPosition, setSaltPosition] = useState(initial.current.saltPosition || "After Dyes");
  const [soaping, setSoaping] = useState(initial.current.soaping || "");

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const currentYear = new Date().getFullYear();

  const baseInput =
    "border border-gray-300 rounded-lg px-2 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition";
  const baseSelect = baseInput + " bg-white";

  const handleCompute = () => {
    // Only now push local values to Zustand
    setField("winch", winch);
    setField("dyeingSystem", dyeingSystem);
    setField("lotNo", lotNo);
    setField("client", client);
    setField("selectedColour", selectedColour);
    setField("scouring", scouring);
    setField("lotWeight", lotWeight);
    setField("article", article);
    setField("softener", softener);
    setField("liqRatio", liqRatio);
    setField("liqRatio8", liqRatio8);
    setField("saltOption", saltOption);
    setField("saltPosition", saltPosition);
    setField("soaping", soaping);
  };

  const handleReset = () => {
    resetFields();
    const defaults = useDyeingStore.getState();
    setWinch(defaults.winch || "Soft Flow");
    setDyeingSystem(defaults.dyeingSystem || "Reactive");
    setLotNo(defaults.lotNo || "");
    setClient(defaults.client || "");
    setSelectedColour(defaults.selectedColour || (Colour_Chart && Colour_Chart[0]) || "");
    setScouring(defaults.scouring || "Reactive");
    setLotWeight(defaults.lotWeight || "");
    setArticle(defaults.article || "");
    setSoftener(defaults.softener || "Bubanks");
    setLiqRatio(defaults.liqRatio || "");
    setLiqRatio8(defaults.liqRatio8 || "Dye Fix");
    setSaltOption(defaults.saltOption || "Glauber Salt");
    setSaltPosition(defaults.saltPosition || "After Dyes");
    setSoaping(defaults.soaping || ""); // fixed
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          {/* Collapsible content */}
          <div
            className="
              p-3 pb-6 border border-gray-200 rounded-xl shadow-md bg-blue-50 mb-4
              fixed top-0 z-30 mt-[64px] rounded-t-none  lg:px-6 
              text-sm w-full 
            "
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
              <div className="text-base font-bold text-gray-900">{today}</div>
              <div className="text-gray-500 text-sm">Lot Year: {currentYear}</div>
            </div>

            {/* Full-width form grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 w-full">
              <FormRow label="Winch">
                <select className={baseSelect} value={winch} onChange={(e) => setWinch(e.target.value)}>
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
                  onChange={(e) => setDyeingSystem(e.target.value)}
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
                  onChange={(e) => setSelectedColour(e.target.value)}
                >
                  {(Colour_Chart || []).map((color, idx) => (
                    <option key={idx} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </FormRow>

              <FormRow label="Scouring">
                <select
                  className={baseSelect}
                  value={scouring}
                  onChange={(e) => setScouring(e.target.value)}
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
                  onChange={(e) => setSoftener(e.target.value)}
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
                  onChange={(e) => setLiqRatio8(e.target.value)}
                >
                  <option value="Dye Fix">Dye Fix</option>
                  <option value="No Dye Fix">No Dye Fix</option>
                </select>
              </FormRow>

              <FormRow label="Salt Option">
                <select
                  className={baseSelect}
                  value={saltOption}
                  onChange={(e) => setSaltOption(e.target.value)}
                >
                  <option value="Glauber Salt">Glauber Salt</option>
                  <option value="Industrial Salt">Industrial Salt</option>
                </select>
              </FormRow>

              <FormRow label="Salt Position">
                <select
                  className={baseSelect}
                  value={saltPosition}
                  onChange={(e) => setSaltPosition(e.target.value)}
                >
                  <option value=""></option>
                  <option value="After Dyes">After Dyes</option>
                  <option value="Before Dyes">Before Dyes</option>
                </select>
              </FormRow>

              <FormRow label="Soaping">
                <select
                  className={baseSelect}
                  value={soaping}
                  onChange={(e) => setSoaping(e.target.value)}
                >
                  <option value=""></option>
                  <option value="Acetic Acid">Acetic Acid</option>
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

               <button
          onClick={handlePrint}
          className="px-3 hidden py-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition text-sm"
        >
          Download PDF
        </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DyeingControlPanel;
