export default function Pagi({ page, totalPages, onPrev, onNext, className = "" }) {
  return (
    <div className={`d-flex align-items-center gap-2 ${className}`}>
      <button
        type="button"
        className="btn btn-sm btn-outline-secondary"
        disabled={page <= 1}
        onClick={onPrev}
      >
        Prev
      </button>
      <span className="small text-muted">Page {page} of {totalPages || 1}</span>
      <button
        type="button"
        className="btn btn-sm btn-outline-secondary"
        disabled={page >= totalPages}
        onClick={onNext}
      >
        Next
      </button>
    </div>
  );
}
