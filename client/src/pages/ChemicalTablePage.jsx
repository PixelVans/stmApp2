import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import ChemicalTable from "./dyeing"; // adjust path if needed
// C:\Users\HP\Desktop\stmApp2-main\client\src\pages\ChemicalTablePage.jsx


const ChemicalTablePage = () => {
  // NEW API: pass ref directly to useReactToPrint
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef, // ✅ use new API
    documentTitle: "Dyeing Report",
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    `,
  });

  return (
    <div className="p-4 mt-4 bg-gray-50 min-h-screen">
      <button
        onClick={handlePrint}
        className="px-4 py-2 lg:ml-64 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700"
      >
        Download/Print PDF
      </button>

      {/* Attach ref directly */}
      <div className="mt-4">
        <ChemicalTable ref={componentRef} />
      </div>
    </div>
  );
};

export default ChemicalTablePage;
