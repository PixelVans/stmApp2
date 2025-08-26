import { useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import StmHome from "./pages/StmHome";
import ChemicalTable from "./pages/dyeing";
import DyeingControlPanel from "./components/DyeingControlPanel";

function App() {
  const printRef = useRef();

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<StmHome />} />
          <Route
            path="/dyeing"
            element={
              <>
                {/* Pass the ref down 👇 */}
                
                <ChemicalTable ref={printRef} />
              </>
            }
          />
        </Routes>
        
      </MainLayout>
    </Router>
  );
}

export default App;
