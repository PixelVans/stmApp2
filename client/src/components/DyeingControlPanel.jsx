import React, { useEffect, useRef } from "react";
import { Colour_Chart } from "../utils/constants";
import useDyeingStore from "../store/zustand";

const DyeingControlPanel = () => {





  // Read initial values once (no subscription)
  const initial = useDyeingStore.getState();

  // Refs for all fields (uncontrolled inputs)
  const winchRef = useRef(null);
  const dyeingSystemRef = useRef(null);
  const lotNoRef = useRef(null);
  const clientRef = useRef(null);
  const selectedColourRef = useRef(null);
  const scouringRef = useRef(null);
  const lotWeightRef = useRef(null);
  const articleRef = useRef(null);
  const softenerRef = useRef(null);
  const liqRatioRef = useRef(null);
  const liqRatio8Ref = useRef(null);
  const saltOptionRef = useRef(null);
  const saltPositionRef = useRef(null);

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

  // Push values from refs to Zustand store
  const handleCompute = () => {
    const { setField } = useDyeingStore.getState();
    setField("winch", winchRef.current.value);
    setField("dyeingSystem", dyeingSystemRef.current.value);
    setField("lotNo", lotNoRef.current.value);
    setField("client", clientRef.current.value);
    setField("selectedColour", selectedColourRef.current.value);
    setField("scouring", scouringRef.current.value);
    setField("lotWeight", lotWeightRef.current.value);
    setField("article", articleRef.current.value);
    setField("softener", softenerRef.current.value);
    setField("liqRatio", liqRatioRef.current.value);
    setField("liqRatio8", liqRatio8Ref.current.value);
    setField("saltOption", saltOptionRef.current.value);
    setField("saltPosition", saltPositionRef.current.value);
  };

    useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // prevents accidental form submit
      handleCompute();
    }
  };
  document.addEventListener("keydown", handleKeyDown);
  return () => {
    document.removeEventListener("keydown", handleKeyDown);
  };
}, [handleCompute]);

  // Clear both store and UI values
  const handleReset = () => {
    const { resetFields } = useDyeingStore.getState();
    resetFields();

    const clear = (r) => {
      if (!r?.current) return;
      if (r.current.tagName === "SELECT") {
        r.current.value = "";
      } else {
        r.current.value = "";
      }
    };

    [
      winchRef,
      dyeingSystemRef,
      lotNoRef,
      clientRef,
      selectedColourRef,
      scouringRef,
      lotWeightRef,
      articleRef,
      softenerRef,
      liqRatioRef,
      liqRatio8Ref,
      saltOptionRef,
      saltPositionRef,
    ].forEach(clear);
  };

  return (
    <div
      className="
        p-4 sm:p-6 border border-gray-200 rounded-xl shadow-md bg-blue-50 mb-6 w-full
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
            ref={winchRef}
            defaultValue={initial.winch ?? ""}
          >
            <option value="">-- Select --</option>
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
            ref={dyeingSystemRef}
            defaultValue={initial.dyeingSystem ?? ""}
          >
            <option value="">-- Select --</option>
            <option value="Reactive">Reactive</option>
            <option value="Bleaching">Bleaching</option>
          </select>
        </FormRow>

        <FormRow label="Lot No">
          <input
            type="text"
            className={baseInput}
            ref={lotNoRef}
            defaultValue={initial.lotNo ?? ""}
          />
        </FormRow>

        <FormRow label="Client">
          <input
            type="text"
            className={baseInput}
            ref={clientRef}
            defaultValue={initial.client ?? ""}
          />
        </FormRow>

        <FormRow label="Shade">
          <select
            className={baseSelect}
            ref={selectedColourRef}
            defaultValue={initial.selectedColour ?? ""}
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
            ref={scouringRef}
            defaultValue={initial.scouring ?? ""}
          >
            <option value="">-- Select --</option>
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
            ref={lotWeightRef}
            defaultValue={initial.lotWeight ?? ""}
          />
        </FormRow>

        <FormRow label="Article">
          <input
            type="text"
            className={baseInput}
            ref={articleRef}
            defaultValue={initial.article ?? ""}
          />
        </FormRow>

        <FormRow label="Softener">
          <select
            className={baseSelect}
            ref={softenerRef}
            defaultValue={initial.softener ?? ""}
          >
            <option value="">-- Select --</option>
            <option value="Bubanks">Bubanks</option>
            <option value="Brenntag">Brenntag</option>
          </select>
        </FormRow>

        <FormRow label="Adjusted Liq. Ratio">
          <input
            type="number"
            className={baseInput}
            ref={liqRatioRef}
            defaultValue={initial.liqRatio ?? ""}
          />
        </FormRow>

        <FormRow label="Liq. Ratio:8">
          <select
            className={baseSelect}
            ref={liqRatio8Ref}
            defaultValue={initial.liqRatio8 ?? ""}
          >
            <option value="">-- Select --</option>
            <option value="Dye Fix">Dye Fix</option>
            <option value="No Dye Fix">No Dye Fix</option>
          </select>
        </FormRow>

        <FormRow label="Salt Option">
          <select
            className={baseSelect}
            ref={saltOptionRef}
            defaultValue={initial.saltOption ?? ""}
          >
            <option value="">-- Select --</option>
            <option value="Glauber Salt">Glauber Salt</option>
            <option value="Industrial Salt">Industrial Salt</option>
          </select>
        </FormRow>

        <FormRow label="Salt Position">
          <select
            className={baseSelect}
            ref={saltPositionRef}
            defaultValue={initial.saltPosition ?? ""}
          >
            <option value="">-- Select --</option>
            <option value="After Dyes">After Dyes</option>
            <option value="Before Dyes">Before Dyes</option>
          </select>
        </FormRow>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={handleCompute}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Execute
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default DyeingControlPanel;
