// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import StmHome from "./pages/StmHome";
import ChemicalTable from "./pages/dyeing"; 
import DyeingCardCustomPrint from "./pages/dyeingCardCustomPrint";
import ProductionTable from "./pages/production";

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes that use MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<StmHome />} />
          <Route path="/dyeing" element={<ChemicalTable />} />
          <Route path="/weaving/production" element={<ProductionTable />} />
        </Route>

        {/* Standalone route without layout */}
        <Route path="/dyeing/print" element={<DyeingCardCustomPrint />} />
      </Routes>
    </Router>
  );
}

export default App;
