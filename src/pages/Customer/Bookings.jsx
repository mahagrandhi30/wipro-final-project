import React, { useEffect, useState } from 'react';
import * as mock from '../../services/mock.js';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

export default function Bookings() {
  const [tickets, setTickets] = useState([]);
  const [q, setQ] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const run = async () => {
      const data = await mock.listTickets();
      setTickets(data);
      setFiltered(data);
    };
    run();
  }, []);

  useEffect(() => {
    if (!q) return setFiltered(tickets);
    const qq = q.toLowerCase();
    setFiltered(
      tickets.filter(
        (t) =>
          (t.ticketId && t.ticketId.toLowerCase().includes(qq)) ||
          (t.bookingId && String(t.bookingId).includes(qq))
      )
    );
  }, [q, tickets]);

  const downloadPdf = async (t) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('E-Ticket', 20, 20);
    doc.setFontSize(12);
    doc.text(`Ticket ID: ${t.ticketId}`, 20, 40);
    doc.text(`Booking ID: ${t.bookingId}`, 20, 50);
    doc.text(`Trip ID: ${t.tripId}`, 20, 60);
    doc.text(`Seats: ${t.seatNumbers.join(', ')}`, 20, 70);
    doc.text(`Issued: ${new Date(t.issuedAt).toLocaleString()}`, 20, 80);

    // ✅ Generate QR
    const qrDataUrl = await QRCode.toDataURL(`${t.ticketId}-${t.bookingId}`);
    doc.addImage(qrDataUrl, 'PNG', 20, 100, 60, 60);

    doc.save(`ticket-${t.ticketId}.pdf`);
  };

  return (
    <div>
      <h4>Your Bookings</h4>
      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Search by ticket id or booking id"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div>
        {filtered.length === 0 && (
          <div className="text-muted">No bookings yet.</div>
        )}
        {filtered.map((t) => (
          <div key={t.ticketId} className="card mb-2 p-2">
            <div>
              <strong>Ticket:</strong> {t.ticketId}
            </div>
            <div>
              <strong>Trip:</strong> {t.tripId}
            </div>
            <div>
              <strong>Seats:</strong> {t.seatNumbers.join(', ')}
            </div>
            <div className="text-muted small">Issued: {t.issuedAt}</div>
            <button
              className="btn btn-sm btn-outline-primary mt-2"
              onClick={() => downloadPdf(t)}
            >
              Download PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
