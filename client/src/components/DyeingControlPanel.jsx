import React from "react";
import { Colour_Chart } from "../utils/constants";
import useDyeingStore from "../store/zustand";

const DyeingControlPanel = () => {
  const {
    selectedColour,
    winch,
    dyeingSystem,
    scouring,
    softener,
    saltOption,
    saltPosition,
    liqRatio,
    lotWeight,
    client,
    article,
    lotNo,
    dyeFix,
    setField,
  } = useDyeingStore();

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const currentYear = new Date().getFullYear();

  const baseInput =
    "border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition";
  const baseSelect = baseInput + " bg-white";

  const FormRow = ({ label, children }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
      <label className="font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );

  return (
  //   <div
  //   className="
  //     p-4 sm:p-4 border border-gray-200 rounded-xl shadow-md bg-white mb-6 w-full
  //     sticky top-[80px] z-30
  //   "
    // >
    <div
    className="
      p-4 sm:p-4 border border-gray-200 rounded-xl shadow-md bg-white mb-6 w-full
      sticky top-[80px] z-30
    "
  >
  
  
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <div className="text-lg font-semibold text-gray-700">{today}</div>
        <div className="text-gray-500 text-sm">Lot Year: {currentYear}</div>
      </div>

      {/* Full-width form grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
        <FormRow label="Winch">
          <select
            className={baseSelect}
            value={winch}
            onChange={(e) => setField("winch", e.target.value)}
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
            onChange={(e) => setField("dyeingSystem", e.target.value)}
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
            onChange={(e) => setField("lotNo", e.target.value)}
          />
        </FormRow>

        <FormRow label="Client">
          <input
            type="text"
            className={baseInput}
            value={client}
            onChange={(e) => setField("client", e.target.value)}
          />
        </FormRow>

        <FormRow label="Shade">
          <select
            className={baseSelect}
            value={selectedColour}
            onChange={(e) => setField("selectedColour", e.target.value)}
          >
            <option value="">-- Select --</option>
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
            onChange={(e) => setField("scouring", e.target.value)}
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
            onChange={(e) => setField("lotWeight", e.target.value)}
          />
        </FormRow>

        <FormRow label="Article">
          <input
            type="text"
            className={baseInput}
            value={article}
            onChange={(e) => setField("article", e.target.value)}
          />
        </FormRow>

        <FormRow label="Softener">
          <select
            className={baseSelect}
            value={softener}
            onChange={(e) => setField("softener", e.target.value)}
          >
            <option value="">-- Select --</option>
            <option value="Bubanks">Bubanks</option>
            <option value="Brenntag">Brenntag</option>
          </select>
        </FormRow>

        <FormRow label="Liq. Ratio">
          <input
            type="text"
            className={baseInput}
            value={liqRatio}
            onChange={(e) => setField("liqRatio", e.target.value)}
          />
        </FormRow>

        <FormRow label="Dye Fix">
          <select
            className={baseSelect}
            value={dyeFix}
            onChange={(e) => setField("dyeFix", e.target.value)}
          >
            <option value="">-- Select --</option>
            <option value="Dye Fix">Dye Fix</option>
            <option value="No Dye Fix">No Dye Fix</option>
          </select>
        </FormRow>

        <FormRow label="Salt Option">
          <select
            className={baseSelect}
            value={saltOption}
            onChange={(e) => setField("saltOption", e.target.value)}
          >
            <option value="">-- Select --</option>
            <option value="Glauber Salt">Glauber Salt</option>
            <option value="Common Salt">Common Salt</option>
          </select>
        </FormRow>

        <FormRow label="Salt Position">
          <select
            className={baseSelect}
            value={saltPosition}
            onChange={(e) => setField("saltPosition", e.target.value)}
          >
            <option value="">-- Select --</option>
            <option value="After Dyes">After Dyes</option>
            <option value="Before Dyes">Before Dyes</option>
          </select>
        </FormRow>
      </div>
    </div>
  );
};

export default DyeingControlPanel;
