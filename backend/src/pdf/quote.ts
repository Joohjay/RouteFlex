export function generateQuoteHTML(data: {
  referenceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: string;
  pickupLocation: string;
  deliveryLocation: string;
  distance: number;
  weight: number;
  baseRate: number;
  totalPrice: number;
  currency: string;
  validUntil: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Quote ${data.referenceNumber}</title>
  <style>
    @page { margin: 20mm 15mm; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1B1B1D; font-size: 12px; line-height: 1.6; }
    .header { border-bottom: 3px solid #163A5F; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
    .header h1 { color: #163A5F; font-size: 24px; margin: 0; }
    .header .ref { color: #5E646B; font-size: 14px; }
    .details { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; margin-bottom: 24px; }
    .details .label { color: #5E646B; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
    .details .value { font-weight: 600; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    th { background: #163A5F; color: white; padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
    td { padding: 10px 12px; border-bottom: 1px solid #E4E7EB; }
    .total-row td { border-bottom: 2px solid #C29A4A; font-weight: 700; font-size: 16px; color: #163A5F; }
    .footer { border-top: 1px solid #E4E7EB; padding-top: 16px; text-align: center; color: #5E646B; font-size: 11px; }
    .validity { background: #FFF4E5; padding: 12px 16px; border-radius: 8px; font-size: 12px; color: #B8863A; text-align: center; margin-bottom: 24px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>Transport Quote</h1>
      <p class="ref">Reference: ${data.referenceNumber}</p>
    </div>
    <div style="text-align:right;">
      <strong>JJ Transport</strong><br />
      Dar es Salaam, Tanzania
    </div>
  </div>

  <div class="validity">Valid until ${data.validUntil}</div>

  <div class="details">
    <div><div class="label">Customer</div><div class="value">${data.customerName}</div></div>
    <div><div class="label">Service</div><div class="value">${data.service}</div></div>
    <div><div class="label">Email</div><div class="value">${data.customerEmail}</div></div>
    <div><div class="label">Pickup</div><div class="value">${data.pickupLocation}</div></div>
    <div><div class="label">Phone</div><div class="value">${data.customerPhone}</div></div>
    <div><div class="label">Delivery</div><div class="value">${data.deliveryLocation}</div></div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th style="text-align:right;">Amount (${data.currency})</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Base Rate (${data.distance} km @ ${data.currency} ${data.baseRate}/km)</td><td style="text-align:right;">${(data.baseRate * data.distance).toFixed(2)}</td></tr>
      <tr><td>Weight Surcharge (${data.weight} kg)</td><td style="text-align:right;">${(data.weight * 0.05).toFixed(2)}</td></tr>
      <tr><td>Insurance (2.5% of total)</td><td style="text-align:right;">${(data.totalPrice * 0.025).toFixed(2)}</td></tr>
      <tr class="total-row"><td>Total Estimated Price</td><td style="text-align:right;">${data.currency} ${data.totalPrice.toFixed(2)}</td></tr>
    </tbody>
  </table>

  <div class="footer">
    <p>JJ Transport &bull; Dar es Salaam, Tanzania &bull; +255 685 959 574</p>
    <p>Thank you for choosing JJ Transport.</p>
  </div>
</body>
</html>`;
}
