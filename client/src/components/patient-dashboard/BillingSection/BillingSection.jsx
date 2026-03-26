import React, { useState, useEffect } from "react";
import "./BillingSection.css";

const fmt = (n) =>
  "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

/* ─── Sub-components ──────────────────────────────────────────────────────── */

function SummaryCard({ icon, label, value, variant, onClick }) {
  return (
    <div
      className={`pb-summary-card pb-summary-card--${variant} pb-clickable`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className="pb-summary-icon">{icon}</div>
      <div className="pb-summary-body">
        <span className="pb-summary-label">{label}</span>
        <span className="pb-summary-value">{value}</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`pb-badge pb-badge--${status.toLowerCase()}`}>
      {status === "Paid" ? "✓ Paid" : "● Pending"}
    </span>
  );
}

function FilterBar({ active, onChange }) {
  return (
    <div className="pb-filter-bar" role="group" aria-label="Filter bills">
      {["All", "Paid", "Pending"].map((f) => (
        <button
          key={f}
          className={`pb-filter-btn ${active === f ? "pb-filter-btn--active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onChange(f);
          }}
        >
          {f}
        </button>
      ))}
    </div>
  );
}

function BillRow({ bill, isSelected, onClick }) {
  return (
    <li
      className={`pb-bill-row pb-bill-row--${bill.status.toLowerCase()} ${isSelected ? "pb-bill-row--selected" : ""}`}
      onClick={() => onClick(bill)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick(bill)}
    >
      <div className="pb-bill-row-left">
        <span className="pb-bill-id">{bill.invoiceId}</span>
        <span className="pb-bill-category">{bill.category}</span>
        <span className="pb-bill-date">
          {new Date(bill.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
      <div className="pb-bill-row-right">
        <span className="pb-bill-amount">{fmt(bill.amount)}</span>
        <StatusBadge status={bill.status} />
        <span className="pb-bill-arrow">›</span>
      </div>
    </li>
  );
}

function ImageModal({ src, onClose }) {
  if (!src) return null;
  return (
    <div
      className="pb-modal-overlay pb-sub-modal"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="pb-modal-box" onClick={(e) => e.stopPropagation()}>
        <button
          className="pb-modal-close"
          onClick={onClose}
          aria-label="Close preview"
        >
          ✕
        </button>
        <img src={src} alt="Bill document preview" className="pb-modal-img" />
      </div>
    </div>
  );
}

function BillDetails({ bill, onClose }) {
  const [payMethod, setPayMethod] = useState("UPI");
  const [payState, setPayState] = useState("idle");
  const [modalSrc, setModalSrc] = useState(null);

  const handlePay = () => {
    setPayState("loading");
    setTimeout(() => setPayState("success"), 1600);
  };

  return (
    <div className="pb-details-panel">
      <div className="pb-details-header">
        <div>
          <span className="pb-details-id">{bill.invoiceId}</span>
          <h3 className="pb-details-title">{bill.category}</h3>
        </div>
        <button
          className="pb-details-close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <div className="pb-details-meta">
        <div className="pb-meta-item">
          <span className="pb-meta-label">Doctor</span>
          <span className="pb-meta-value">{bill.doctor}</span>
        </div>
        <div className="pb-meta-item">
          <span className="pb-meta-label">Hospital</span>
          <span className="pb-meta-value">{bill.hospital}</span>
        </div>
        <div className="pb-meta-item">
          <span className="pb-meta-label">Date</span>
          <span className="pb-meta-value">
            {new Date(bill.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="pb-meta-item">
          <span className="pb-meta-label">Status</span>
          <StatusBadge status={bill.status} />
        </div>
      </div>

      <div className="pb-details-section">
        <h4 className="pb-details-section-title">Itemised Charges</h4>
        <ul className="pb-items-list">
          {bill.items.map((item, i) => (
            <li key={i} className="pb-item-row">
              <span>{item.label}</span>
              <span className="pb-item-amount">{fmt(item.amount)}</span>
            </li>
          ))}
          <li className="pb-item-row pb-item-row--total">
            <span>Total</span>
            <span className="pb-item-amount">{fmt(bill.amount)}</span>
          </li>
        </ul>
      </div>

      {bill.images.length > 0 && (
        <div className="pb-details-section">
          <h4 className="pb-details-section-title">Documents &amp; Images</h4>
          <div className="pb-doc-grid">
            {bill.images.map((src, i) => (
              <div
                key={i}
                className="pb-doc-thumb"
                onClick={() => setModalSrc(src)}
              >
                <img src={src} alt={`Document ${i + 1}`} />
                <div className="pb-doc-overlay">🔍</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {bill.status === "Pending" && (
        <div className="pb-details-section pb-payment-section">
          <h4 className="pb-details-section-title">Make Payment</h4>
          {payState === "success" ? (
            <div className="pb-pay-success">
              <div className="pb-pay-success-icon">✓</div>
              <p className="pb-pay-success-title">Payment Successful!</p>
              <p className="pb-pay-success-sub">
                {fmt(bill.amount)} paid via {payMethod}
              </p>
            </div>
          ) : (
            <>
              <div className="pb-pay-amount-display">
                <span>Amount Due</span>
                <strong>{fmt(bill.amount)}</strong>
              </div>
              <div className="pb-pay-methods">
                {[
                  { id: "UPI", icon: "📲", label: "UPI" },
                  { id: "Card", icon: "💳", label: "Credit / Debit Card" },
                  { id: "NetBanking", icon: "🏦", label: "Net Banking" },
                ].map((m) => (
                  <label
                    key={m.id}
                    className={`pb-pay-method ${payMethod === m.id ? "pb-pay-method--active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="payMethod"
                      value={m.id}
                      checked={payMethod === m.id}
                      onChange={() => setPayMethod(m.id)}
                    />
                    <span className="pb-pay-method-icon">{m.icon}</span>
                    <span>{m.label}</span>
                  </label>
                ))}
              </div>
              <button
                className={`pb-pay-btn ${payState === "loading" ? "pb-pay-btn--loading" : ""}`}
                onClick={handlePay}
                disabled={payState === "loading"}
              >
                {payState === "loading"
                  ? "Processing…"
                  : `Pay ${fmt(bill.amount)}`}
              </button>
            </>
          )}
        </div>
      )}

      <ImageModal src={modalSrc} onClose={() => setModalSrc(null)} />
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────────────────────── */
export default function PatientBilling({ profile }) {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchBills = async () => {
      if (!profile || !profile._id) return;
      try {
        const token = localStorage.getItem("token");
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const res = await fetch(`${apiUrl}/api/billing/user/${profile._id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Failed to fetch bills");
        const data = await res.json();
        setBills(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, [profile]);

  const totalAmt = bills.reduce((s, b) => s + b.amount, 0);
  const paidAmt = bills.filter((b) => b.status === "Paid").reduce(
    (s, b) => s + b.amount,
    0,
  );
  const pendAmt = totalAmt - paidAmt;

  const visible =
    filter === "All" ? bills : bills.filter((b) => b.status === filter);

  const handleSelect = (bill) => {
    setSelected((prev) => (prev?.invoiceId === bill.invoiceId ? null : bill));
  };

  const openDashboard = () => setShowModal(true);
  const closeDashboard = () => {
    setShowModal(false);
    setSelected(null);
  };

  if (loading) return <div className="pb-root"><p className="pb-page-sub">Loading billing details...</p></div>;
  if (error) return <div className="pb-root"><p className="pb-page-sub" style={{color: 'red'}}>Error: {error}</p></div>;

  return (
    <div className="pb-root">
      <header className="pb-page-header">
        <div className="pb-header-pill">My Health Wallet</div>
        <h1 className="pb-page-title">Billing &amp; Payments</h1>
        <p className="pb-page-sub">Quick summary of your billing status.</p>
      </header>

      {/* ── Summary Cards (Always Visible) ── */}
      <section className="pb-summary-row" aria-label="Summary">
        <SummaryCard
          icon=""
          label="Total Billed"
          value={fmt(totalAmt)}
          variant="blue"
          onClick={openDashboard}
        />
        <SummaryCard
          icon=""
          label="Total Paid"
          value={fmt(paidAmt)}
          variant="green"
          onClick={openDashboard}
        />
        <SummaryCard
          icon=""
          label="Remaining"
          value={fmt(pendAmt)}
          variant="red"
          onClick={openDashboard}
        />
      </section>

      {/* ── Main Dashboard Modal ── */}
      {showModal && (
        <div className="pb-dashboard-overlay" onClick={closeDashboard}>
          <div
            className="pb-dashboard-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="pb-modal-main-close" onClick={closeDashboard}>
              ✕
            </button>

            <div
              className={`pb-content ${selected ? "pb-content--split" : ""}`}
            >
              {/* Bills List */}
              <section className="pb-bills-section pb-card">
                <div className="pb-bills-header">
                  <h2 className="pb-card-title">Bill History</h2>
                  <FilterBar
                    active={filter}
                    onChange={(f) => {
                      setFilter(f);
                      setSelected(null);
                    }}
                  />
                </div>
                {visible.length === 0 ? (
                  <div className="pb-empty">No bills found.</div>
                ) : (
                  <ul className="pb-bill-list">
                    {visible.map((bill) => (
                      <BillRow
                        key={bill.invoiceId || bill._id}
                        bill={bill}
                        isSelected={selected?.invoiceId === bill.invoiceId}
                        onClick={handleSelect}
                      />
                    ))}
                  </ul>
                )}
              </section>

              {/* Details Panel */}
              {selected && (
                <section className="pb-detail-wrapper pb-card">
                  <BillDetails
                    bill={selected}
                    onClose={() => setSelected(null)}
                  />
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
