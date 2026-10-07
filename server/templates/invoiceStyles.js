module.exports = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  width: 210mm;
  height: 297mm;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  color: #111;
  background: #fff;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

:root {
  --navy: #062b52;
  --gold: #c79a3b;
  --light-blue: #eaf3fb;
  --border: #173e64;
}

/* ============================================================
   A4 PAGE
   ============================================================ */

.invoice-container {
  position: relative;
  width: 210mm;
  height: 297mm;
  min-height: 297mm;
  max-height: 297mm;
  margin: 0;
  padding: 0;
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ============================================================
   IMAGE HEADER
   ============================================================ */

.header-image-wrapper {
  width: 210mm;
  height: 70mm;
  flex: 0 0 70mm;
  overflow: hidden;
  line-height: 0;
}

.header-image {
  display: block;
  width: 210mm;
  height: 70mm;
  object-fit: fill;
}

/* ============================================================
   BILL TITLE
   ============================================================ */

.bill-banner-container {
  width: 100%;
  height: 12mm;
  flex: 0 0 12mm;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2mm 0 1.5mm;
}

.bill-banner {
  width: 46mm;
  height: 8mm;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--navy);
  color: #fff;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: 3px;
  border-top: 2px solid var(--gold);
  border-bottom: 2px solid var(--gold);
}

/* ============================================================
   PATIENT INFORMATION
   ============================================================ */

.patient-info-table {
  width: calc(100% - 10mm);
  margin: 0 5mm 2.5mm;
  border-collapse: collapse;
  table-layout: fixed;
  flex-shrink: 0;
}

.patient-info-table td {
  vertical-align: top;
}

.patient-info-table .col-left {
  width: 50%;
  padding-right: 5mm;
  border-right: 1.5px solid var(--navy);
}

.patient-info-table .col-right {
  width: 50%;
  padding-left: 5mm;
}

.info-grid {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.info-grid td {
  padding: 1.05mm 0;
  font-size: 10.5px;
  line-height: 1.22;
  vertical-align: top;
}

.info-grid .info-label {
  width: 35mm;
  color: #000;
  font-weight: 800;
  white-space: nowrap;
}

.info-grid .info-separator {
  width: 4mm;
  text-align: center;
  font-weight: 600;
}

.info-grid .info-value {
  color: #111;
  font-weight: 500;
  overflow-wrap: anywhere;
  word-break: break-word;
}

/* ============================================================
   MAIN PHYSIO TABLE
   ============================================================ */

.main-table {
  width: calc(100% - 10mm);
  margin: 0 5mm 2mm;
  border-collapse: collapse;
  table-layout: fixed;
  border: 1.5px solid var(--navy);
  flex-shrink: 0;
}

.main-table col.col-1 {
  width: 31%;
}

.main-table col.col-2 {
  width: 39%;
}

.main-table col.col-3 {
  width: 30%;
}

.main-table th {
  height: 8.5mm;
  padding: 2mm;
  background: var(--navy);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  text-align: center;
  vertical-align: middle;
  border: 1px solid #fff;
  white-space: nowrap;
}

.main-table tbody tr {
  min-height: 43mm;
}

.main-table td {
  padding: 3mm;
  font-size: 10.5px;
  line-height: 1.35;
  vertical-align: top;
  border-right: 1.5px solid var(--navy);
  border-top: 1px solid var(--navy);
  overflow-wrap: anywhere;
  word-break: break-word;
}

.main-table td:last-child {
  border-right: none;
}

.col-diagnosis {
  text-align: left;
}

.col-treatment {
  text-align: left;
}

.col-amount {
  text-align: center;
}

/* ============================================================
   INNER TABLES
   ============================================================ */

.inner-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.inner-table td {
  border: 0 !important;
  padding: 1.35mm 0 !important;
  font-size: 10.5px;
  line-height: 1.3;
  vertical-align: top;
}

.treatment-table .bullet {
  width: 5mm;
  text-align: center;
  font-weight: 800;
}

.treatment-table td {
  border-bottom: 1px solid #e5e5e5 !important;
}

.treatment-table tr:last-child td {
  border-bottom: none !important;
}

.charge-table td {
  text-align: center;
  padding: 1.8mm 1mm !important;
  border-bottom: 1px solid #aaa !important;
}

.charge-table tr:last-child td {
  border-bottom: none !important;
}

.package-desc {
  font-size: 10.5px;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 1mm;
}

.amount-display {
  font-size: 13px;
  font-weight: 800;
  line-height: 1.25;
}

/* ============================================================
   DIAGNOSIS
   ============================================================ */

.diagnosis-text {
  font-weight: 500;
  line-height: 1.45;
}

.diagnosis-item {
  padding-bottom: 1.5mm;
  margin-bottom: 1.5mm;
  border-bottom: 1px solid #aaa;
}

.diagnosis-item:last-child {
  padding-bottom: 0;
  margin-bottom: 0;
  border-bottom: none;
}

/* ============================================================
   CT SCAN
   ============================================================ */

.diagnosis-note {
  width: calc(100% - 10mm);
  margin: 0 5mm 2mm;
  padding: 2.5mm 3mm;
  font-size: 10px;
  line-height: 1.4;
  background: #f6f9fc;
  border: 1px solid #cbd8e5;
  border-left: 3px solid var(--navy);
}

.lineitem-table {
  width: calc(100% - 10mm);
  margin: 0 5mm 2mm;
  border-collapse: collapse;
  table-layout: fixed;
  border: 1.5px solid var(--navy);
}

.lineitem-table col:nth-child(1) {
  width: 10%;
}

.lineitem-table col:nth-child(2) {
  width: 60%;
}

.lineitem-table col:nth-child(3) {
  width: 30%;
}

.lineitem-table th {
  height: 8mm;
  padding: 2mm;
  background: var(--navy);
  color: #fff;
  font-size: 10.5px;
  font-weight: 800;
  text-align: center;
  vertical-align: middle;
  border: 1px solid #fff;
}

.lineitem-table td {
  height: 8mm;
  padding: 2mm 3mm;
  font-size: 10.5px;
  border: 1px solid var(--navy);
  vertical-align: middle;
  overflow-wrap: anywhere;
}

.lineitem-table .col-sno {
  text-align: center;
  font-weight: 600;
}

.lineitem-table .col-procedure {
  text-align: left;
  font-weight: 500;
}

.lineitem-table .col-rate {
  text-align: right;
  font-weight: 700;
  white-space: nowrap;
}

/* ============================================================
   TOTALS
   ============================================================ */

.totals-container {
  width: calc(100% - 10mm);
  margin: 0 5mm 1mm;
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
}

.totals-table {
  width: 78mm;
  border-collapse: collapse;
  table-layout: fixed;
}

.totals-table td {
  padding: 1.2mm 2.5mm;
  font-size: 10.5px;
  vertical-align: middle;
}

.totals-table td.label {
  text-align: right;
  font-weight: 600;
  color: #222;
}

.totals-table td.val {
  width: 30mm;
  text-align: right;
  font-weight: 800;
  white-space: nowrap;
}

.totals-table .payable-row {
  background: var(--light-blue);
  border-top: 1px solid var(--navy);
  border-bottom: 2px solid var(--navy);
}

.totals-table .payable-row td {
  color: var(--navy);
  font-size: 12px;
  font-weight: 800;
  padding: 2mm 2.5mm;
}

/* ============================================================
   AMOUNT IN WORDS
   ============================================================ */

.amount-words-container {
  width: calc(100% - 10mm);
  margin: 0 5mm 2mm;
  padding: 1mm 0 2mm;
  font-size: 10px;
  line-height: 1.3;
  border-bottom: 1px dashed #777;
  flex-shrink: 0;
}

/* ============================================================
   FLEX SPACER
   ============================================================ */

.content-spacer {
  flex: 1 1 auto;
  min-height: 2mm;
}

/* ============================================================
   FOOTER / SIGNATURE
   ============================================================ */

.footer-area {
  width: 100%;
  height: 58mm;
  flex: 0 0 58mm;
  position: relative;
  overflow: hidden;
}

/*
  IMPORTANT:
  The footer image is 40mm high.
  The signature section is positioned ABOVE it.
*/

.signature-row {
  position: absolute;
  left: 5mm;
  right: 5mm;
  bottom: 43mm;
  height: 12mm;

  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  z-index: 2;
}

.footer-thanks {
  display: flex;
  align-items: center;
  min-width: 0;
}

.heart-mark {
  width: 9mm;
  flex: 0 0 9mm;
  margin-right: 3mm;

  color: var(--navy);
  font-size: 25px;
  line-height: 1;
  text-align: center;
}

.footer-text {
  font-size: 8.5px;
  color: var(--navy);
  line-height: 1.3;
}

.footer-right {
  width: 55mm;
  flex: 0 0 55mm;
  text-align: center;
}

.signature-line {
  border-top: 1.5px solid #000;
  padding-top: 1mm;

  font-size: 9.5px;
  font-weight: 700;
  color: #111;
}

/*
  FOOTER IMAGE
  This occupies only the bottom 40mm.
*/

.footer-image {
  position: absolute;

  left: 0;
  right: 0;
  bottom: 0;

  display: block;

  width: 210mm;
  height: 40mm;

  object-fit: fill;

  z-index: 1;
}

/* ============================================================
   PRINT
   ============================================================ */

@media print {
  html,
  body {
    width: 210mm;
    height: 297mm;
  }

  .invoice-container {
    page-break-after: avoid;
    page-break-inside: avoid;
  }

  table,
  tr,
  td,
  th {
    page-break-inside: avoid;
  }

  img {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
`;