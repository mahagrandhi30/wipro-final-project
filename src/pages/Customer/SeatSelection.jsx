import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SeatGrid from "../../components/SeatGrid.jsx";
import * as mock from "../../services/mock.js";

export default function SeatSelection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meta, setMeta] = useState(null);
  const [booked, setBooked] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hold, setHold] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const data = await mock.getTripSeats(Number(id));
        setMeta({ total: data.total });
        setBooked(data.booked);
      } catch (e) {
        setError(e.message || "Failed to load seats");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  const toggleSeat = (n) => {
    setSelected((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]
    );
  };

  const onHold = async () => {
    setError("");
    if (!selected.length) return setError("Please select at least one seat.");
    try {
      const h = await mock.holdSeats(Number(id), selected);
      setHold(h);
    } catch (e) {
      setError(e.message || "Failed to hold seats");
    }
  };

  const onProceed = () => {
    if (!hold) return setError("Please hold seats before checkout.");
    navigate("/customer/checkout", {
      state: { tripId: Number(id), seatNumbers: selected, hold },
    });
  };

  if (loading) return <div className="card card-elev p-4">Loading seats...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="row g-3">
      <div className="col-lg-8">
        <div className="card card-elev p-3">
          <h5 className="mb-3">Select your seats</h5>
          <SeatGrid
            total={meta.total}
            booked={booked}
            selected={selected}
            onToggle={toggleSeat}
          />
        </div>
      </div>
      <div className="col-lg-4">
        <div className="card card-elev p-3">
          <h6 className="mb-2">Summary</h6>
          <div className="mb-2">
            Trip ID: <strong>{id}</strong>
          </div>
          <div className="mb-2">
            Selected Seats:{" "}
            {selected.length ? selected.join(", ") : "—"}
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setSelected([])}
            >
              Clear
            </button>
            <button className="btn btn-warning" onClick={onHold}>
              Hold
            </button>
            <button className="btn btn-brand" onClick={onProceed}>
              Proceed
            </button>
          </div>
          {hold && (
            <div className="text-success small mt-2">
              Hold ID: {hold.holdId} (expires in {hold.expiresInSec}s)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
