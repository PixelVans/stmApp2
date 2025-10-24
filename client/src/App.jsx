import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner"; 
import MainLayout from "./layouts/MainLayout";
import StmHome from "./pages/StmHome";
import ChemicalTable from "./pages/dyeing"; 
import DyeingCardCustomPrint from "./pages/dyeingCardCustomPrint";
import WeavingProductionTable from "./pages/weavingProduction";
import WeavingProductionPrintout from "./customPrintouts/weavingProductionPrintout";
import UpdateWeavingProductionPage from "./pages/updateWeavingProduction";
import UpdateWarpingData from "./pages/updateWarpingData";
import Countdown from "./pages/err";
import UpdateStockPage from "./pages/stocksUpdatePage";
import ChemicalsStockPrintoutPage from "./customPrintouts/chemicalsStockPrintout";
import DyestuffsStockPrintoutPage from "./customPrintouts/dyestuffsStockPrintout";
import UpdateMusterRoll from "./pages/updateMusterRoll";
import PrintingMusterRollReport from "./components/PrintoutTables/PrintingMusterRollReport";

function App() {
  return (
    <Router>
      {/* global toaster */}
      <Toaster richColors position="top-right" />

      <Routes>
        {/* Routes that use MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<StmHome />} />
          <Route path="/dyeing" element={<ChemicalTable />} />
          <Route path="/weaving-production" element={<WeavingProductionTable />} />
          <Route path="/update-weaving-production" element={<UpdateWeavingProductionPage />} />
          <Route path="/update-warping-data" element={<UpdateWarpingData />} />
          <Route path="/htg" element={<Countdown />} />
          <Route path="/update-stock" element={<UpdateStockPage />} />
          <Route path="/update-muster-roll" element={<UpdateMusterRoll />} />
          <Route path="/muster-roll-reports" element={<PrintingMusterRollReport />} />
        </Route>

        {/* Standalone routes without layout */}
        <Route path="/dyeing/print" element={<DyeingCardCustomPrint />} />
        <Route path="/weaving-production/print" element={<WeavingProductionPrintout />} />
        
        <Route path="/prc" element={<ChemicalsStockPrintoutPage />} />
        <Route path="/prd" element={<DyestuffsStockPrintoutPage />} />
      </Routes>
    </Router>
  );
}

export default App;
