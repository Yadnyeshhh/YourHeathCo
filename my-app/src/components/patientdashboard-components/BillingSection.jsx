// src/components/BillingSection.js

import React from 'react';
import LucideIcon from './LucideIcon.jsx'; // Import the new LucideIcon component

const BillingSection = () => {
  return (
    <div className="billing-section">
      <div>
        <h2 className="billing-section-title">Billing</h2>
        <div className="billing-total-amount-wrapper">
          <LucideIcon name="DollarSign" size={32} className="billing-total-icon" />
          <div className="billing-total-info">
            <div className="billing-total-label">Total Amount Billed</div>
            <div className="billing-total-value">$54,873</div>
          </div>
        </div>
      </div>
      <div className="billing-average-section">
        <div className="billing-average-label">Avg. Last 30 Days Billed</div>
        <div className="billing-average-chart">
          {[100, 200, 150, 250, 180].map((amount, index) => (
            <div key={index} className="billing-average-item">
              <div className="billing-average-circle">
                ${amount}
              </div>
              <div className="billing-average-day">Day {index + 1}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BillingSection;