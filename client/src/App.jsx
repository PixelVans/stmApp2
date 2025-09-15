import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner"; 
import MainLayout from "./layouts/MainLayout";
import StmHome from "./pages/StmHome";
import ChemicalTable from "./pages/dyeing"; 
import DyeingCardCustomPrint from "./pages/dyeingCardCustomPrint";
import WeavingProductionTable from "./pages/weavingProduction";
import WeavingProductionPrintout from "./customPrintouts/weavingProductionPrintout";
import UpdateWeavingProductionPage from "./pages/updateWeavingProduction";

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
        </Route>

        {/* Standalone routes without layout */}
        <Route path="/dyeing/print" element={<DyeingCardCustomPrint />} />
        <Route path="/weaving-production/print" element={<WeavingProductionPrintout />} />
      </Routes>
    </Router>
  );
}

export default App;
