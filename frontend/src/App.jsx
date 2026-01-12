import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Home */
import Home from ".pages/Home";

/* Citizen */
import CitizenLogin from "./CitizenLogin";
import CitizenSignup from "./CitizenSignup";
import CitizenDashboard from "./CitizenDashboard";

/* Contractor */
import ContractorLogin from "./ContractorLogin";
import ContractorSignup from "./ContractorSignup";
import ContractorDashboard from "./ContractorDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* CITIZEN */}
        <Route path="/citizen/login" element={<CitizenLogin />} />
        <Route path="/citizen/signup" element={<CitizenSignup />} />
        <Route path="/citizen/dashboard" element={<CitizenDashboard />} />

        {/* CONTRACTOR */}
        <Route path="/contractor/login" element={<ContractorLogin />} />
        <Route path="/contractor/signup" element={<ContractorSignup />} />
        <Route path="/contractor/dashboard" element={<ContractorDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
