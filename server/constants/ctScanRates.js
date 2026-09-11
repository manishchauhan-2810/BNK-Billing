// Reference rate list transcribed from the BNK Diagnostic Centre rate card.
// NOTE: Please double check these against your printed rate card — a couple of
// rows (e.g. "CT FPCE", the unlabeled last row) were hard to read from the photo
// and may need correcting.
//
// This list is only used to power a "pick a procedure" dropdown on the frontend
// so amounts don't have to be typed by hand. It is NOT enforced server-side —
// receptionists can still add custom line items / override the rate, since real
// bills sometimes discount or combine procedures.

module.exports = [
  { procedure: 'NCCT HEAD', rate: 2200 },
  { procedure: 'CECT HEAD', rate: 3000 },
  { procedure: 'C SPINE', rate: 5000 },
  { procedure: 'DORSAL SPINE', rate: 5000 },
  { procedure: 'LS SPINE', rate: 5000 },
  { procedure: 'CT FACE', rate: 5000 },
  { procedure: 'PNS', rate: 5000 },
  { procedure: 'ORBIT', rate: 4500 },
  { procedure: 'CT NECK', rate: 4500 },
  { procedure: 'CECT NECK', rate: 4500 },
  { procedure: 'NCCT THORAX', rate: 5500 },
  { procedure: 'CECT THORAX', rate: 4500 },
  { procedure: 'HRCT THORAX', rate: 5500 },
  { procedure: 'NCCT WHOLE ABDOMEN', rate: 4500 },
  { procedure: 'CE. WHOLE ABDOMEN', rate: 5500 },
  { procedure: 'KUB PLAIN', rate: 6500 },
  { procedure: 'KUB CONTRAST', rate: 5500 },
  { procedure: 'HIP JOINT', rate: 6500 },
  { procedure: 'SI JOINT', rate: 5000 },
  { procedure: 'PELVIS 3D', rate: 5000 },
  { procedure: 'TEMPORAL', rate: 5000 },
  { procedure: 'LOWER ABDOMEN', rate: 5000 },
  { procedure: 'LOWER ABDOMEN CONTRAST', rate: 5000 },
  { procedure: 'EXTREMITIES', rate: 6000 }
];