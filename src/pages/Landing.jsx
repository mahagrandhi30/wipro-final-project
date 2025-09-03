
import React from 'react';
import { Link } from 'react-router-dom';
export default function Landing(){
  return (
    <div className="d-flex align-items-center justify-content-center" style={{minHeight:'60vh'}}>
      <div className="text-center">
        <h1>Welcome to QuickBus</h1>
        <p className="lead">Fast, reliable bus ticket booking — real time seats, secure payments, and e-tickets.</p>
        <div className="mt-3">
          <Link to="/login" className="btn btn-brand me-2">Login</Link>
          <Link to="/register" className="btn btn-outline-brand">Register</Link>
        </div>
      </div>
    </div>
  );
}
