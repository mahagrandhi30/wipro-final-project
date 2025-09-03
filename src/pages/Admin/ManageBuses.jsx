
import React, { useEffect, useState } from "react";
import * as mock from "../../services/mock.js";

export default function ManageBuses(){
  const [buses, setBuses] = useState([]);
  const [form, setForm] = useState({ busNumber:"", busType:"AC", totalSeats:32, operatorName:"" });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const run = async () => {
      const data = await mock.listBuses();
      setBuses(data);
      setLoading(false);
    };
    run();
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try{
      if(editingId){
        await mock.updateBus(editingId, form);
        setMsg("Updated successfully");
        setEditingId(null);
      } else {
        await mock.addBus(form);
        setMsg("Added successfully");
      }
      const data = await mock.listBuses();
      setBuses(data);
      setForm({ busNumber:"", busType:"AC", totalSeats:32, operatorName:"" });
    }catch(err){
      setMsg(err.message || "Failed");
    }
  };

  const onEdit = (b) => {
    setEditingId(b.id);
    setForm({ busNumber: b.busNumber, busType: b.busType, totalSeats: b.totalSeats, operatorName: b.operatorName });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <h4>Manage Buses</h4>
      {msg && <div className="alert alert-info">{msg}</div>}
      <div className="card p-3 mb-3">
        <form onSubmit={onSubmit} className="row g-2">
          <div className="col-md-6">
            <label className="form-label">Bus Number</label>
            <input className="form-control" name="busNumber" value={form.busNumber} onChange={onChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Type</label>
            <select className="form-select" name="busType" value={form.busType} onChange={onChange}>
              <option>AC</option>
              <option>Non-AC</option>
              <option>Sleeper</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Total Seats</label>
            <input type="number" className="form-control" name="totalSeats" value={form.totalSeats} onChange={onChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Operator</label>
            <input className="form-control" name="operatorName" value={form.operatorName} onChange={onChange} required />
          </div>
          <div className="col-12">
            <button className="btn btn-brand">{editingId ? "Update" : "Add"}</button>
          </div>
        </form>
      </div>

      <div>
        <h5>Existing Buses</h5>
        <div className="list-group">
          {buses.map(b => (
            <div key={b.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{b.busNumber}</strong> - {b.busType} - {b.operatorName} ({b.totalSeats} seats)
              </div>
              <div>
                <button className="btn btn-sm btn-outline-primary me-2" onClick={()=>onEdit(b)}>Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
