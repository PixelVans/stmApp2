
import React from "react";
import DyeingControlPanel from "../components/DyeingControlPanel";
import useChemicalSteps from "../hooks/useChemicalSteps";
import ChemicalStepTable from "../components/ChemicalStepTable";

export default function ChemicalTable() {
  const steps = useChemicalSteps();

  return (
    <div className="mt-[300px]">
      <DyeingControlPanel />
      {steps.map((step, sIdx) => (
        <div key={sIdx} className=" p-4 sm:p-6">
          <h2 className="text-lg font-bold mb-2">{step.step}</h2>

          {step.extraSection && (
            <>
              <h3 className=" italic text-sm mb-2 text-blue-600">
                {step.extraSection.title}
              </h3>
              <div className="overflow-x-auto mb-4">
                <ChemicalStepTable rows={step.extraSection.rows} />
              </div>
            </>
          )}

          {step.instructions && (
            <p className="italic text-sm mb-2 text-blue-600">{step.instructions}</p>
          )}

          <div className="overflow-x-auto">
            <ChemicalStepTable rows={step.rows} />
          </div>
        </div>
      ))}
    </div>
  );
}
