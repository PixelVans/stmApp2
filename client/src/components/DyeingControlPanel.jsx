import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Colour_Chart } from "../utils/constants";
import useDyeingStore from "../store/zustand";
import { Link, useHref } from "react-router-dom";
import { FiPrinter } from "react-icons/fi";

import { useReactToPrint } from "react-to-print";
import ChemicalTable from "../pages/dyeing";
import DyeingCardCustomPrint from "../pages/dyeingCardCustomPrint";
import { toast } from "sonner";


const FormRow = React.memo(function FormRow({ label, children }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
      <label className="font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
});

 

const DyeingControlPanel = ({ open, setOpen,printRef }) => {

    

 const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef, 
    documentTitle: ".",
    pageStyle: `
      @page {
        size: A4;
        margin: 12mm;
      }
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    `,
  });




 
  const { setField, resetFields } = useDyeingStore.getState();

  
  const initial = useRef(useDyeingStore.getState());

  
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
  const [isExecuting, setIsExecuting] = useState(false);


  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const currentYear = new Date().getFullYear();

  const defaultLiqRatioMap = {
  "Soft Flow": 8,
  "Main Winch": 8,
  "Sample Winch": 10,
  "Paddle Winch": 15,
  "Soft Flow-Minimum": 12,
  "VAT": 12,
};


  const baseInput =
    "border border-gray-300 rounded-lg px-2 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition";
  const baseSelect = baseInput + " bg-white";

const handleCompute = async () => {
  //  Validation first
  if (!lotWeight || Number(lotWeight) <= 0) {
    toast.error("Please enter a valid Lot Weight before executing");
    return;
  }

  try {
    setIsExecuting(true);

    // Optional: simulate delay to show the executing state
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Push local values to Zustand
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

    toast.success("Execution completed successfully ");
  } catch (error) {
    toast.error("Execution failed ");
  } finally {
    setIsExecuting(false);
  }
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
            className="  lg:mr-3 
              p-3 pb-6 border border-gray-200 rounded-xl shadow-md bg-blue-50 mb-4
              lg:fixed top-0 z-100 mt-[8px] lg:mt-[64px] rounded-t-none  lg:px-6 
              text-sm mx-auto 
            "
          >
            {/* Header */}
            <div className="flex-row justify-between items-center mb-4 hidden">
              <div className="text-base font-bold text-gray-900">{today}</div>
              <div className="text-gray-500 text-sm">Lot Year: {currentYear}</div>
            </div>

            {/* Full-width form grid */}
            <div className="grid gap-3 grid-cols-2  lg:grid-cols-4 w-full">
              <FormRow label="Machine">
              <select
                className={baseSelect}
                value={winch}
                onChange={(e) => {
                  const newWinch = e.target.value;
                  setWinch(newWinch);
                  setLiqRatio(defaultLiqRatioMap[newWinch]); // 👈 instantly update ratio
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
                  onChange={(e) => setDyeingSystem(e.target.value)}
                >
                  <option value="Reactive">Reactive</option>
                  <option value="Bleaching">Bleaching</option>
                </select>
              </FormRow>

              <FormRow label="Lot No">
                <input
                  type="text"
                  className={baseInput + " bg-white"}
                  value={lotNo}
                  onChange={(e) => setLotNo(e.target.value)}
                />
              </FormRow>

              <FormRow label="Client">
                <input
                  type="text"
                  className={baseInput + " bg-white"}
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
                className={`${baseInput} bg-white ${!lotWeight ? "border-red-500 border-2" : ""}`}
                value={lotWeight}
                onChange={(e) => setLotWeight(e.target.value)}
              />

            </FormRow>


              <FormRow label="Article">
                <input
                  type="text"
                  className={baseInput + " bg-white"}
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

              <FormRow label="Liquor Ratio">
              <select
                className={baseSelect}
                value={liqRatio}
                onChange={(e) => setLiqRatio(Number(e.target.value))}
              >
                {Array.from({ length: 16 }, (_, i) => i + 5).map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </FormRow>



              <FormRow label="Dye Fix">
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

              {/* <FormRow label="Soaping">
                <select
                  className={baseSelect }
                  value={soaping}
                  onChange={(e) => setSoaping(e.target.value)}
                >
                  <option value=""></option>
                  <option value="Acetic Acid">Acetic Acid</option>
                </select>
              </FormRow> */}
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-4 justify-between">
              <button
                onClick={handleCompute}
                disabled={isExecuting}
                className={`px-4 py-2 rounded-lg text-white transition text-sm ${
                  isExecuting
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-800"
                }`}
              >
                {isExecuting ? "Executing..." : "Execute"}
              </button>

              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
              >
                Reset
              </button>

             <button
                onClick={handlePrint}
                className=" items-center hidden gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition text-sm"
              >
                <FiPrinter className="w-4 h-4" />
                Print Document
              </button>

                <div className="absolute -left-[9999px] top-0">
                <DyeingCardCustomPrint ref={componentRef} />
              </div>


            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DyeingControlPanel;
