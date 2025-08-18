import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/Mainlayout";
import StmHome from "./pages/StmHome";

import ColourCalculatorB29 from "./pages/dyeing";

// other pages like Employees, Reports...

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<StmHome />} />
         <Route path="/dyeing" element={<ColourCalculatorB29 />} />
          {/* <Route path="/reports" element={<Reports />} /> */}
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
