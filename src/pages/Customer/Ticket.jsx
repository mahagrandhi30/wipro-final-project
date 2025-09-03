import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import * as mock from "../../services/mock.js";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";

export default function Ticket() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const t = await mock.getTicket(ticketId);
        setTicket(t);
        const url = await QRCode.toDataURL(`${t.ticketId}-${t.bookingId}`);
        setQrUrl(url);
      } catch (e) {
        setError(e.message || "Unable to load ticket");
      }
    };
    run();
  }, [ticketId]);

  const downloadPdf = async () => {
    if (!ticket) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("E-Ticket", 20, 20);
    doc.setFontSize(12);
    doc.text(`Ticket ID: ${ticket.ticketId}`, 20, 40);
    doc.text(`Trip ID: ${ticket.tripId}`, 20, 50);
    doc.text(`Seats: ${ticket.seatNumbers.join(", ")}`, 20, 60);
    doc.text(`Issued: ${new Date(ticket.issuedAt).toLocaleString()}`, 20, 70);
    if (qrUrl) {
      doc.addImage(qrUrl, "PNG", 20, 90, 60, 60);
    }
    doc.save(`ticket-${ticket.ticketId}.pdf`);
  };

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!ticket) return <div className="card card-elev p-3">Loading ticket...</div>;

  return (
    <div className="card card-elev p-3">
      <h4 className="mb-2">E-Ticket</h4>
      <div className="text-muted">
        Ticket ID: <strong>#{ticket.ticketId}</strong>
      </div>
      <hr />
      <div className="mb-2">Trip ID: {ticket.tripId}</div>
      <div className="mb-2">Seats: {ticket.seatNumbers.join(", ")}</div>
      <div className="mb-2">
        Issued: {new Date(ticket.issuedAt).toLocaleString()}
      </div>
      {qrUrl && (
        <div className="mb-3">
          <img src={qrUrl} alt="QR Code" />
        </div>
      )}
      <div className="mt-3">
        <button className="btn btn-primary me-2" onClick={downloadPdf}>
          Download PDF
        </button>
        <Link className="btn btn-outline-secondary" to="/customer/search">
          Book another
        </Link>
      </div>
    </div>
  );
}
