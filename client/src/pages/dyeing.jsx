import React, { forwardRef } from "react";
import useChemicalSteps from "../hooks/useChemicalSteps";
import ChemicalStepTable from "../components/ChemicalStepTable";

const ChemicalTable = forwardRef((props, ref) => {
  const steps = useChemicalSteps();

  return (
    <div ref={ref} className="mt-[0px] p-2 sm:p-4 bg-white">
      
      {steps.map((step, sIdx) => (
        <div key={sIdx} className="p-4 sm:p-4 border-b border-gray-200">
          {step.step === "END" && (
            <img
              src="/images/Picture1.png"
              alt="Process illustration"
              className="mb-4 w-auto mx-auto"
            />
          )}
          <h2 className="text-lg font-bold mb-2">{step.step}</h2>

          {step.extraSection && (
            <>
              <h3 className="italic text-sm mb-2 text-blue-600">
                {step.extraSection.title}
              </h3>
              <div className=" mb-4">
                <ChemicalStepTable rows={step.extraSection.rows} />
              </div>
            </>
          )}

          {step.instructions && (
            <p className="italic text-sm mb-2 text-blue-600">
              {step.instructions}
            </p>
          )}

          <div className="">
            <ChemicalStepTable rows={step.rows} />
          </div>
        </div>
      ))}
    </div>
  );
});

export default ChemicalTable;
