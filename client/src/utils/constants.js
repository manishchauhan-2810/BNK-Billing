export const TREATMENTS = [
  'Hot Fermentation', 'Matrix Therapy', 'Class 4 Laser Therapy',
  'TECAR Therapy', 'IFT', 'TENS', 'Dry Needling', 'Exercise Therapy',
  'Ultrasound Therapy', 'Manual Therapy', 'Shockwave Therapy',
  'Neuro Rehabilitation', 'Sports Rehabilitation', 'Joint Rehabilitation','EM Field Pro Therapy',
  'Combination Therapy','Normal Physio','Cryo Therapy','Decomposion Therapy','UI Chair Therapy'
];

export const PAYMENT_METHODS = [
  { value: 'CASH', label: 'Cash' },
  { value: 'UPI', label: 'UPI' },
  { value: 'CARD', label: 'Card' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' }
];

export const STATUS_OPTIONS = [
  { value: 'PAID', label: 'Paid', color: 'green' },
  { value: 'PARTIAL', label: 'Partial', color: 'orange' },
  { value: 'PENDING', label: 'Pending', color: 'red' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'gray' }
];

// Replace with your actual doctors whenever you're ready — these are
// placeholders so the "Referred By" dropdown has real options to pick from.
export const DOCTORS = [
  'Dr. Karan Mehta',
  'Dr. Ayesha Khan',
  'Dr. Rohan Verma',
  'Dr. Priya Sharma',
  'Dr. Vikram Singh'
];

export const BILL_TYPES = [
  { value: 'PHYSIO', label: 'Physiotherapy Bill' },
  { value: 'CTSCAN', label: 'CT Scan Bill' }
];