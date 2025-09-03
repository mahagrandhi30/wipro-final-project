import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as mock from "../../services/mock.js";

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!state) {
    return (
      <div className="alert alert-warning">
        No checkout data. Go back to seat selection.
      </div>
    );
  }
  const { tripId, seatNumbers, hold } = state;
  const [remaining, setRemaining] = useState(null);

  React.useEffect(() => {
    if (!hold) return;
    let rem = hold.expiresInSec || hold.expiresResInSec || 180;
    setRemaining(rem);
    const iv = setInterval(() => {
      rem = rem - 1;
      setRemaining(rem);
      if (rem <= 0) clearInterval(iv);
    }, 1000);
    return () => clearInterval(iv);
  }, [hold]);

  const onPay = async () => {
    setError("");
    setLoading(true);
    try {
      const { ticketId } = await mock.checkout({
        tripId,
        seatNumbers,
        holdId: hold.holdId,
      });
      navigate(`/customer/ticket/${ticketId}`, { replace: true });
    } catch (e) {
      setError(e.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card card-elev p-3">
      <h5 className="mb-3">Checkout</h5>
      <div className="mb-2">
        Trip ID: <strong>{tripId}</strong>
      </div>
      <div className="mb-2">
        Seats: <strong>{seatNumbers.join(", ")}</strong>
      </div>
      <div className="mb-3 text-muted small">
        Hold: {hold?.holdId}{" "}
        {remaining != null && <span> (expires in {remaining}s)</span>}
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <button disabled={loading} className="btn btn-brand" onClick={onPay}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}
