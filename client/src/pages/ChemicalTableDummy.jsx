import React, { forwardRef } from "react";

const ChemicalTableDummy = forwardRef((props, ref) => {
  const dummySteps = [
    { step: "Step 1", instructions: "Mix chemicals A and B" },
    { step: "Step 2", instructions: "Heat mixture to 80°C" },
    { step: "END", instructions: "Process complete" },
  ];

  return (
    <div ref={ref} className="p-4 bg-white">
      {dummySteps.map((step, idx) => (
        <div key={idx} className="p-4 border-b">
          <h2 className="font-bold">{step.step}</h2>
          <p>{step.instructions}</p>
        </div>
      ))}
    </div>
  );
});

export default ChemicalTableDummy;
