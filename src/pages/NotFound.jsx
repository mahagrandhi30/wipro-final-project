import React from "react";
import { Link } from "react-router-dom";

export default function NotFound(){
  return (
    <div className="text-center">
      <h2>404</h2>
      <p className="text-muted">Page not found.</p>
      <Link to="/" className="btn btn-brand">Go Home</Link>
    </div>
  );
}
