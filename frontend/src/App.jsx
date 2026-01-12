import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import CitizenLogin from "./pages/CitizenLogin";
import CitizenSignup from "./pages/CitizenSignup";
import CitizenDashboard from "./pages/CitizenDashboard";

import ContractorLogin from "./pages/ContractorLogin";
import ContractorSignup from "./pages/ContractorSignup";
import ContractorDashboard from "./pages/ContractorDashboard";
import AddProject from "./pages/AddProject";
import UploadProgress from "./pages/UploadProgress";
import ProjectImages from "./pages/ProjectImages";
import EditProject from "./pages/EditProject";

import AuthorityLogin from "./pages/AuthorityLogin";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LANDING */}
        <Route path="/" element={<Landing />} />

        {/* CITIZEN */}
        <Route path="/citizen/login" element={<CitizenLogin />} />
        <Route path="/citizen/signup" element={<CitizenSignup />} />
        <Route path="/citizen/dashboard" element={<CitizenDashboard />} />

        {/* CONTRACTOR */}
        <Route path="/contractor/login" element={<ContractorLogin />} />
        <Route path="/contractor/signup" element={<ContractorSignup />} />
        <Route path="/contractor/dashboard" element={<ContractorDashboard />} />
        <Route path="/contractor/add-project" element={<AddProject />} />

        <Route
          path="/contractor/project/:projectId/upload"
          element={<UploadProgress />}
        />
        <Route
          path="/contractor/project/:projectId/images"
          element={<ProjectImages />}
        />
        <Route
          path="/contractor/project/:projectId/edit"
          element={<EditProject />}
        />

        {/* AUTHORITY */}
        <Route path="/admin" element={<AuthorityLogin />} />
        <Route path="/admin1" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
