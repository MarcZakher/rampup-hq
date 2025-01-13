import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import AdminDashboard from "@/pages/admin/Dashboard";
import MeetingDefinitions from "@/pages/admin/MeetingDefinitions";
import CoachingDashboard from "@/pages/coaching/Dashboard";
import DirectorAnalytics from "@/pages/director/Analytics";
import DirectorDashboard from "@/pages/director/Dashboard";
import ManagerDashboard from "@/pages/manager/Dashboard";
import SalesRepAnalytics from "@/pages/sales-rep/Analytics";
import SalesRepDashboard from "@/pages/sales-rep/Dashboard";
import TrainingJourney from "@/pages/sales-rep/TrainingJourney";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/meeting-definitions" element={<MeetingDefinitions />} />
        <Route path="/coaching/dashboard" element={<CoachingDashboard />} />
        <Route path="/director/analytics" element={<DirectorAnalytics />} />
        <Route path="/director/dashboard" element={<DirectorDashboard />} />
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/sales-rep/analytics" element={<SalesRepAnalytics />} />
        <Route path="/sales-rep/dashboard" element={<SalesRepDashboard />} />
        <Route path="/sales-rep/training" element={<TrainingJourney />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;