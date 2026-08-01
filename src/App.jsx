import './App.css';
import Header from './Components/Header';
import Home from './Components/Home';
import Register from './Components/Register';
import Login from './Components/Login';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Admin from './Components/Admin';
import User from './Components/User';

// Admin Pages
import AddDonationCenter from './Components/Admin-Pages/AddDonationCenters';
import CenterTimings from './Components/Admin-Pages/CenterTimings';
import ManageCenters from './Components/Admin-Pages/ManageCenters';

// User Pages
import DonationCenters from './Components/UserPages/DonationCenters';

function App() {
  const location = useLocation();

  // Header hide cheyyali admin & user dashboard lo
  const hideHeaderRoutes = ["/admin", "/user"];

  return (
    <>
      {/* Header */}
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}

      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboards */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/user" element={<User />} />

        {/* Admin Functional Pages */}
        <Route path="/addcenters" element={<AddDonationCenter />} />
        <Route path="/centertimings" element={<CenterTimings />} />
        <Route path="/managecenters" element={<ManageCenters />} />

        {/* User Functional Page */}
        <Route path="/donation-centers" element={<DonationCenters />} />

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;