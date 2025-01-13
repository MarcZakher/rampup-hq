import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/admin/Dashboard";
import RampingExpectationsPage from "./pages/admin/RampingExpectations";
import TrainingJourneyPage from "./pages/admin/TrainingJourney";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/ramping-expectations" element={<RampingExpectationsPage />} />
        <Route path="/admin/training-journey" element={<TrainingJourneyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
