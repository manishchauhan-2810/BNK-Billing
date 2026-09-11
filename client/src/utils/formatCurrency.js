// Use formatCurrency() for anything that comes straight off a Bill document
// (subTotal, discount, totalAmount, paidAmount, dueAmount, chargeItems[].amount)
// — those are stored and returned in PAISE.
export function formatCurrency(paise) {
  if (paise === null || paise === undefined || isNaN(paise)) return '₹0';
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(rupees);
}

// Use formatRupeeAmount() for the Dashboard and Revenue endpoints — those
// already convert to rupees on the backend before sending, so this does NOT
// divide by 100 again.
export function formatRupeeAmount(rupees) {
  if (rupees === null || rupees === undefined || isNaN(rupees)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(rupees);
}

// Compact "₹12.5k" / "₹3.2L" style label for chart axes, given a RUPEE value.
export function formatCompactRupees(rupees) {
  if (rupees === null || rupees === undefined || isNaN(rupees)) return '₹0';
  const abs = Math.abs(rupees);
  if (abs >= 10000000) return `₹${(rupees / 10000000).toFixed(1)}Cr`;
  if (abs >= 100000) return `₹${(rupees / 100000).toFixed(1)}L`;
  if (abs >= 1000) return `₹${(rupees / 1000).toFixed(1)}k`;
  return `₹${rupees}`;
}

export function paiseToRupees(paise) {
  return (paise || 0) / 100;
}

export function rupeesToPaise(rupees) {
  return Math.round((rupees || 0) * 100);
}