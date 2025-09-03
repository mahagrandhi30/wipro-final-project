import React, { useState } from "react";
import * as mock from "../../services/mock.js";
import TripCard from "../../components/TripCard.jsx";
import Loader from "../../components/Loader.jsx";

export default function SearchTrips() {
  const [form, setForm] = useState({ source: "", destination: "", date: "" });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Validation: source & destination only letters
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(form.source) || !nameRegex.test(form.destination)) {
      setError("Source and Destination should only contain letters.");
      return;
    }

    setLoading(true);
    try {
      const data = await mock.searchTrips(form);
      setResults(data);
    } catch (err) {
      setError(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card card-elev p-3 mb-3">
        <form className="row g-3" onSubmit={onSubmit}>
          <div className="col-md-4">
            <label className="form-label">Source</label>
            <input
              className="form-control"
              name="source"
              value={form.source}
              onChange={onChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Destination</label>
            <input
              className="form-control"
              name="destination"
              value={form.destination}
              onChange={onChange}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Date</label>
            <input
              className="form-control"
              type="date"
              name="date"
              value={form.date}
              onChange={onChange}
            />
          </div>
          <div className="col-md-1 d-flex align-items-end">
            <button className="btn btn-danger search-btn" type="submit">
              Search
            </button>
          </div>
        </form>
      </div>

      {loading && <Loader text="Searching trips..." />}
      {error && <div className="alert alert-danger">{error}</div>}

      {results &&
        (results.length ? (
          results.map((trip) => <TripCard key={trip.id} trip={trip} />)
        ) : (
          <div className="alert alert-warning">No trips found.</div>
        ))}
    </div>
  );
}
