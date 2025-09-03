import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar.jsx";
import Landing from "./pages/Landing.jsx";
import Bookings from "./pages/Customer/Bookings.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageBuses from "./pages/admin/ManageBuses.jsx";
import SearchTrips from "./pages/customer/SearchTrips.jsx";
import SeatSelection from "./pages/customer/SeatSelection.jsx";
import Checkout from "./pages/customer/Checkout.jsx";
import Ticket from "./pages/customer/Ticket.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import RoleGuard from "./components/RoleGuard.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<h2>Welcome to BusTicket</h2>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Customer routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleGuard allowed={["CUSTOMER"]} />}>
              <Route path="/customer/search" element={<SearchTrips />} />
              <Route path="/customer/trips/:id/seats" element={<SeatSelection />} />
              <Route path="/customer/checkout" element={<Checkout />} />
              <Route path="/customer/ticket/:ticketId" element={<Ticket />} />
            </Route>
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleGuard allowed={["ADMIN"]} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/buses" element={<ManageBuses />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}
