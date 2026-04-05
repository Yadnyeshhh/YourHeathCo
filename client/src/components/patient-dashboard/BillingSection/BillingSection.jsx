import React, { useState, useEffect } from "react";
import "./BillingSection.css";

const fmt = (n) =>
  "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

/* ─── Sub-components ──────────────────────────────────────────────────────── */

function SummaryCard({ label, value, variant, onClick }) {
  return (
    <div
      className={`db-billing-summary-card db-billing-summary-card--${variant}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <span className="db-billing-summary-label">{label}</span>
      <span className="db-billing-summary-value">{value}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`db-billing-badge db-billing-badge--${status.toLowerCase()}`}>
      {status === "Paid" ? "✓ Paid" : "● Pending"}
    </span>
  );
}

function FilterBar({ active, onChange }) {
  return (
    <div className="db-billing-filter-bar" role="group" aria-label="Filter bills">
      {["All", "Paid", "Pending"].map((f) => (
        <button
          key={f}
          className={`db-billing-filter-btn ${active === f ? "db-billing-filter-btn--active" : ""}`}
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
      className={`db-billing-bill-row db-billing-bill-row--${bill.status.toLowerCase()} ${isSelected ? "db-billing-bill-row--selected" : ""}`}
      onClick={() => onClick(bill)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick(bill)}
    >
      <div className="db-billing-bill-row-left">
        <span className="db-billing-bill-id">{bill.invoiceId}</span>
        <span className="db-billing-bill-category">{bill.category}</span>
        <span className="db-billing-bill-date">
          {new Date(bill.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
      <div className="db-billing-bill-row-right">
        <span className="db-billing-bill-amount">{fmt(bill.amount)}</span>
        <StatusBadge status={bill.status} />
        <span className="db-billing-bill-arrow">›</span>
      </div>
    </li>
  );
}

function ImageModal({ src, onClose }) {
  if (!src) return null;
  return (
    <div
      className="db-billing-modal-overlay db-billing-sub-modal"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="db-billing-modal-box" onClick={(e) => e.stopPropagation()}>
        <button
          className="db-billing-modal-close"
          onClick={onClose}
          aria-label="Close preview"
        >
          ✕
        </button>
        <img src={src} alt="Bill document preview" className="db-billing-modal-img" />
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
    <div className="db-billing-details-panel">
      <div className="db-billing-details-header">
        <div>
          <span className="db-billing-details-id">{bill.invoiceId}</span>
          <h3 className="db-billing-details-title">{bill.category}</h3>
        </div>
        <button
          className="db-billing-details-close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <div className="db-billing-details-meta">
        <div className="db-billing-meta-item">
          <span className="db-billing-meta-label">Doctor</span>
          <span className="db-billing-meta-value">{bill.doctor}</span>
        </div>
        <div className="db-billing-meta-item">
          <span className="db-billing-meta-label">Hospital</span>
          <span className="db-billing-meta-value">{bill.hospital}</span>
        </div>
        <div className="db-billing-meta-item">
          <span className="db-billing-meta-label">Date</span>
          <span className="db-billing-meta-value">
            {new Date(bill.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="db-billing-meta-item">
          <span className="db-billing-meta-label">Status</span>
          <StatusBadge status={bill.status} />
        </div>
      </div>

      <div className="db-billing-details-section">
        <h4 className="db-billing-details-section-title">Itemised Charges</h4>
        <ul className="db-billing-items-list">
          {bill.items.map((item, i) => (
            <li key={i} className="db-billing-item-row">
              <span>{item.label}</span>
              <span className="db-billing-item-amount">{fmt(item.amount)}</span>
            </li>
          ))}
          <li className="db-billing-item-row db-billing-item-row--total">
            <span>Total</span>
            <span className="db-billing-item-amount">{fmt(bill.amount)}</span>
          </li>
        </ul>
      </div>

      {bill.images.length > 0 && (
        <div className="db-billing-details-section">
          <h4 className="db-billing-details-section-title">Documents &amp; Images</h4>
          <div className="db-billing-doc-grid">
            {bill.images.map((src, i) => (
              <div
                key={i}
                className="db-billing-doc-thumb"
                onClick={() => setModalSrc(src)}
              >
                <img src={src} alt={`Document ${i + 1}`} />
                <div className="db-billing-doc-overlay">🔍</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {bill.status === "Pending" && (
        <div className="db-billing-details-section db-billing-payment-section">
          <h4 className="db-billing-details-section-title">Make Payment</h4>
          {payState === "success" ? (
            <div className="db-billing-pay-success">
              <div className="db-billing-pay-success-icon">✓</div>
              <p className="db-billing-pay-success-title">Payment Successful!</p>
              <p className="db-billing-pay-success-sub">
                {fmt(bill.amount)} paid via {payMethod}
              </p>
            </div>
          ) : (
            <>
              <div className="db-billing-pay-amount-display">
                <span>Amount Due</span>
                <strong>{fmt(bill.amount)}</strong>
              </div>
              <div className="db-billing-pay-methods">
                {[
                  { id: "UPI", icon: "📲", label: "UPI" },
                  { id: "Card", icon: "💳", label: "Credit / Debit Card" },
                  { id: "NetBanking", icon: "🏦", label: "Net Banking" },
                ].map((m) => (
                  <label
                    key={m.id}
                    className={`db-billing-pay-method ${payMethod === m.id ? "db-billing-pay-method--active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="payMethod"
                      value={m.id}
                      checked={payMethod === m.id}
                      onChange={() => setPayMethod(m.id)}
                    />
                    <span className="db-billing-pay-method-icon">{m.icon}</span>
                    <span>{m.label}</span>
                  </label>
                ))}
              </div>
              <button
                className={`db-billing-pay-btn ${payState === "loading" ? "db-billing-pay-btn--loading" : ""}`}
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

  if (loading) return <div className="db-billing-root"><p className="db-billing-page-sub">Loading billing details...</p></div>;
  if (error) return <div className="db-billing-root"><p className="db-billing-page-sub" style={{color: 'red'}}>Error: {error}</p></div>;

  return (
    <div className="db-billing-root">
      <header className="db-billing-page-header">
        <div className="db-billing-header-pill">MY HEALTH WALLET</div>
        <h1 className="db-billing-page-title">Billing & Payments</h1>
        <p className="db-billing-page-sub">Quick summary of your billing status.</p>
      </header>

      {/* ── Summary Cards (Always Visible) ── */}
      <section className="db-billing-summary-row" aria-label="Summary">
        <SummaryCard
          label="TOTAL BILLED"
          value={fmt(totalAmt)}
          variant="blue"
          onClick={openDashboard}
        />
        <SummaryCard
          label="TOTAL PAID"
          value={fmt(paidAmt)}
          variant="green"
          onClick={openDashboard}
        />
        <SummaryCard
          label="REMAINING"
          value={fmt(pendAmt)}
          variant="red"
          onClick={openDashboard}
        />
      </section>

      {/* Action Buttons to match design layout */}
      <section className="db-billing-actions-row">
        <button className="db-billing-btn-solid">Schedule Appointment</button>
        <button className="db-billing-btn-outline">View Medical History</button>
      </section>

      {/* ── Main Dashboard Modal ── */}
      {showModal && (
        <div className="db-billing-dashboard-overlay" onClick={closeDashboard}>
          <div
            className="db-billing-dashboard-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="db-billing-modal-main-close" onClick={closeDashboard}>
              ✕
            </button>

            <div
              className={`db-billing-content ${selected ? "db-billing-content--split" : ""}`}
            >
              {/* Bills List */}
              <section className="db-billing-bills-section db-billing-card">
                <div className="db-billing-bills-header">
                  <h2 className="db-billing-card-title">Bill History</h2>
                  <FilterBar
                    active={filter}
                    onChange={(f) => {
                      setFilter(f);
                      setSelected(null);
                    }}
                  />
                </div>
                {visible.length === 0 ? (
                  <div className="db-billing-empty">No bills found.</div>
                ) : (
                  <ul className="db-billing-bill-list">
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
                <section className="db-billing-detail-wrapper db-billing-card">
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
