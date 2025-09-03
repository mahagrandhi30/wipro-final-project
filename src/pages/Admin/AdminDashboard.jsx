import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard(){
  return (
    <div className="row g-3">
      <div className="col-md-4">
        <div className="card card-elev p-3">
          <div className="fw-semibold">Buses</div>
          <div className="text-muted small mb-2">Add and manage buses</div>
          <Link to="/admin/buses" className="btn btn-brand btn-sm">Manage</Link>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card card-elev p-3">
          <div className="fw-semibold">Reports</div>
          <div className="text-muted small mb-2">Sales & Occupancy (coming soon)</div>
          <button className="btn btn-secondary btn-sm" disabled>Open</button>
        </div>
      </div>
    </div>
  );
}
