// src/components/KpiCard.jsx
export default function KpiCard({ title, value, hint }) {
  return (
    <div className="col-sm-6 col-lg-4">
      <div className="card p-3 h-100">
        <div className="text-muted">{title}</div>
        <div className="fs-3 fw-semibold">{value}</div>
        {hint ? <div className="small text-muted mt-1">{hint}</div> : null}
      </div>
    </div>
  );
}
