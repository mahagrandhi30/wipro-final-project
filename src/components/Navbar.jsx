import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { FiLogOut, FiUser } from "react-icons/fi";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg app-navbar">
      <div className="container">
        <Link className="navbar-brand fw-semibold" to="/">
          🚌 BusTicket
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {user?.role !== "ADMIN" && (
              <li className="nav-item">
                <NavLink className="nav-link nav-search" to="/customer/search">
                  Search
                </NavLink>
              </li>
            )}

            {user?.role === "CUSTOMER" && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/customer/bookings">
                  My Bookings
                </NavLink>
              </li>
            )}

            {user?.role === "ADMIN" && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin">
                    Admin
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/buses">
                    Buses
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav ms-auto">
            {!user && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">
                    Register
                  </NavLink>
                </li>
              </>
            )}
            {user && (
              <li className="nav-item d-flex align-items-center gap-2">
                <span className="nav-link d-flex align-items-center gap-2">
                  <FiUser /> {user.name}{" "}
                  <span className="badge bg-light text-dark">{user.role}</span>
                </span>
                <button className="btn btn-sm btn-light" onClick={onLogout}>
                  <FiLogOut /> Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
