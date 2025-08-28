export default function StatsCard({ label, children }) {
    return (
        <div className="card p-3 h-100">
            <div className="text-muted">{label}</div>
            <div className="fs-5 fw-semibold">{children}</div>
        </div>
    );
}
