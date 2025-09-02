// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import StmHome from "./pages/StmHome";
import ChemicalTablePage from "./pages/ChemicalTablePage"; // print-only page
import ChemicalTable from "./pages/dyeing"; // normal page with layout
import DyeingControlPanel from "./components/DyeingControlPanel";
import DyeingCardCustomPrint from "./pages/dyeingCardCustomPrint";

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes that use MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<StmHome />} />
          <Route path="/dyeing" element={<ChemicalTable />} />
        </Route>

        {/* Standalone route without layout */}
        <Route path="/dyeing/print" element={<DyeingCardCustomPrint />} />
      </Routes>
    </Router>
  );
}

export default App;
