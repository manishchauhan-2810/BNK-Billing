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
  --green: #408827;
  --gold: #c79a3b;
  --light-blue: #eaf3fb;
  --border: #173e64;
}

/* ============================================================
   INVOICE PAGE
   ============================================================ */

.invoice-container {
  position: relative;

  width: 210mm;
  height: 297mm;
  min-height: 297mm;
  max-height: 297mm;

  margin: 0;
  padding: 0 0 20mm 0;

  background: #fff;

  overflow: hidden;

  display: flex;
  flex-direction: column;
}

/* ============================================================
   TOP BORDER
   ============================================================ */

.invoice-container::before {
  content: "";

  position: absolute;

  top: 0;
  left: 0;
  right: 0;

  height: 5px;

  background: var(--navy);

  z-index: 100;
}

/* ============================================================
   HEADER
   ============================================================ */

.header-wrapper {
  width: 100%;

  flex-shrink: 0;

  background: #fff;
}

.header-main {
  width: 100%;
  height: 43mm;

  display: flex;
  align-items: center;

  /*
    Reduced left/right padding.
    This gives the header more usable width.
  */

  padding: 3mm 4mm 2mm 4mm;

  border-bottom: 1px solid var(--gold);
}

.header-logo {
  width: 38mm;
  height: 38mm;

  object-fit: contain;

  flex: 0 0 38mm;
}

.header-content {
  flex: 1;

  min-width: 0;

  text-align: center;

  padding-left: 2mm;
}

.group-name {
  line-height: 1;

  white-space: nowrap;
}

.group-name .g-bnk {
  color: var(--navy);

  font-family: Arial, Helvetica, sans-serif;

  font-size: 38px;

  font-weight: 900;

  letter-spacing: -1px;
}

.group-name .g-rest {
  color: var(--navy);

  font-family: Arial, Helvetica, sans-serif;

  font-size: 31px;

  font-weight: 800;
}

/* ============================================================
   GROUP
   ============================================================ */

.group-sub-line {
  display: flex;

  align-items: center;

  justify-content: center;

  margin-top: 1mm;
}

.group-sub-line .g-line {
  width: 22mm;

  height: 1px;

  background: var(--gold);
}

.group-sub-line .g-group {
  color: var(--gold);

  font-size: 21px;

  font-weight: 800;

  letter-spacing: 1.5px;

  padding: 0 5px;
}

/* ============================================================
   TAGLINE
   ============================================================ */

.clinic-tagline-row {
  width: 100%;

  display: flex;

  align-items: center;

  margin-top: 3mm;
}

.clinic-tagline-row .tag-line {
  flex: 1;

  height: 1px;

  background: var(--gold);
}

.clinic-tagline-row .tag-text {
  color: var(--navy);

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 0.3px;

  text-transform: uppercase;

  padding: 0 5px;

  white-space: nowrap;
}

.clinic-subtagline {
  color: var(--navy);

  font-family: Georgia, serif;

  font-size: 13px;

  font-style: italic;

  margin-top: 2mm;
}

/* ============================================================
   CONTACT BAR
   ============================================================ */

.contact-bar {
  width: 100%;

  border-bottom: 2px solid var(--navy);

  padding: 2mm 3mm;
}

.contact-bar table {
  width: 100%;

  table-layout: fixed;

  border-collapse: collapse;
}

.contact-bar td {
  color: var(--navy);

  font-size: 7.8px;

  font-weight: 700;

  padding: 0 2.5mm;

  vertical-align: middle;

  border-right: 1px solid var(--gold);
}

.contact-bar td:last-child {
  border-right: none;
}

.cb-item {
  display: flex;

  align-items: center;

  gap: 4px;

  min-width: 0;
}

.cb-item span {
  overflow-wrap: anywhere;

  word-break: break-word;
}

.cb-icon {
  width: 13px;
  height: 13px;

  flex: 0 0 13px;

  fill: var(--navy);
}

/* ============================================================
   BILL BANNER
   ============================================================ */

.bill-banner-container {
  width: 100%;

  display: flex;

  justify-content: center;

  margin: 2.5mm 0;

  flex-shrink: 0;
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

/*
  IMPORTANT:
  Previously:
      width: calc(100% - 12mm)
      margin: 0 6mm

  Now:
      width: calc(100% - 6mm)
      margin: 0 3mm

  This removes roughly 6mm of empty space from each side.
*/

.patient-info-table {
  width: calc(100% - 6mm);

  margin: 0 3mm 2.5mm 3mm;

  border-collapse: collapse;

  table-layout: fixed;

  flex-shrink: 0;
}

.patient-info-table td {
  vertical-align: top;
}

.patient-info-table .col-left {
  width: 50%;

  padding-right: 4mm;

  border-right: 1.5px solid var(--navy);
}

.patient-info-table .col-right {
  width: 50%;

  padding-left: 4mm;
}

/* ============================================================
   PATIENT INNER TABLE
   ============================================================ */

.info-grid {
  width: 100%;

  border-collapse: collapse;

  table-layout: fixed;
}

.info-grid td {
  padding: 1.15mm 0;

  font-size: 10.5px;

  line-height: 1.25;

  vertical-align: top;
}

.info-grid .info-label {
  width: 36mm;

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
  width: calc(100% - 6mm);

  margin: 0 3mm 2mm 3mm;

  border-collapse: collapse;

  table-layout: fixed;

  border: 1.5px solid var(--navy);

  flex-shrink: 0;
}

/*
  Better proportions for the three-column layout.
*/

.main-table col.col-1 {
  width: 31%;
}

.main-table col.col-2 {
  width: 39%;
}

.main-table col.col-3 {
  width: 30%;
}

/* ============================================================
   MAIN TABLE HEADER
   ============================================================ */

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

/* ============================================================
   MAIN TABLE BODY
   ============================================================ */

.main-table tbody tr {
  min-height: 48mm;
}

.main-table td {
  padding: 3mm;

  font-size: 10.5px;

  line-height: 1.4;

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

  padding: 1.6mm 0 !important;

  font-size: 10.5px;

  line-height: 1.35;

  vertical-align: top;
}

/* ============================================================
   TREATMENT TABLE
   ============================================================ */

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

/* ============================================================
   CHARGE TABLE
   ============================================================ */

.charge-table td {
  text-align: center;

  padding: 2mm 1mm !important;

  border-bottom: 1px solid #aaa !important;
}

.charge-table tr:last-child td {
  border-bottom: none !important;
}

.package-desc {
  font-size: 10.5px;

  font-weight: 600;

  line-height: 1.35;

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

  line-height: 1.5;
}

.diagnosis-item {
  padding-bottom: 2mm;

  margin-bottom: 2mm;

  border-bottom: 1px solid #aaa;
}

.diagnosis-item:last-child {
  padding-bottom: 0;

  margin-bottom: 0;

  border-bottom: none;
}

/* ============================================================
   CT SCAN DIAGNOSIS
   ============================================================ */

.diagnosis-note {
  width: calc(100% - 6mm);

  margin: 0 3mm 2mm 3mm;

  padding: 2.5mm 3mm;

  font-size: 10px;

  line-height: 1.4;

  background: #f6f9fc;

  border: 1px solid #cbd8e5;

  border-left: 3px solid var(--navy);
}

/* ============================================================
   CT SCAN TABLE
   ============================================================ */

.lineitem-table {
  width: calc(100% - 6mm);

  margin: 0 3mm 2mm 3mm;

  border-collapse: collapse;

  table-layout: fixed;

  border: 1.5px solid var(--navy);
}

/* S.No */

.lineitem-table col:nth-child(1) {
  width: 10%;
}

/* Procedure */

.lineitem-table col:nth-child(2) {
  width: 60%;
}

/* Rate */

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
  width: calc(100% - 6mm);

  margin: 0 3mm 1mm 3mm;

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
  padding: 1.3mm 2.5mm;

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

/* ============================================================
   NET PAYABLE
   ============================================================ */

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
  width: calc(100% - 6mm);

  margin: 0 3mm 3mm 3mm;

  padding: 1mm 0 2mm 0;

  font-size: 10px;

  line-height: 1.3;

  border-bottom: 1px dashed #777;

  flex-shrink: 0;
}

/* ============================================================
   SPACER
   ============================================================ */

.content-spacer {
  flex: 1 1 auto;

  min-height: 3mm;
}

/* ============================================================
   FOOTER
   ============================================================ */

.footer-container {
  width: calc(100% - 6mm);

  margin: 0 3mm;

  display: flex;

  justify-content: space-between;

  align-items: flex-end;

  flex-shrink: 0;
}

.footer-left {
  display: flex;

  align-items: center;

  min-width: 0;
}

.heart-icon-container {
  width: 11mm;

  margin-right: 3mm;

  flex: 0 0 11mm;
}

.heart-icon-container svg {
  display: block;

  width: 9mm;

  height: 9mm;
}

.footer-text {
  font-size: 9.5px;

  color: var(--navy);

  line-height: 1.35;
}

.footer-right {
  width: 55mm;

  flex: 0 0 55mm;

  text-align: center;
}

.signature-line {
  border-top: 1.5px solid #000;

  padding-top: 1mm;

  font-size: 10px;

  font-weight: 700;

  color: #111;
}

/* ============================================================
   BOTTOM BRAND BAND
   ============================================================ */

.brand-band {
  position: absolute;

  bottom: 0;
  left: 0;
  right: 0;

  height: 20mm;

  background: var(--navy);

  color: #fff;

  text-align: center;

  border-bottom: 2px solid var(--gold);

  padding: 2mm 4mm 1.5mm;
}

.band-title-row {
  display: flex;

  align-items: center;

  justify-content: center;

  margin-bottom: 1mm;
}

.band-line {
  width: 18mm;

  height: 1px;

  background: var(--gold);
}

.band-title {
  color: var(--gold);

  font-size: 14px;

  font-weight: 800;

  letter-spacing: 1px;

  padding: 0 7px;
}

.band-services {
  font-size: 7.5px;

  line-height: 1.45;

  font-weight: 700;

  margin-bottom: 1.5mm;

  color: #fff;
}

.band-contact {
  display: flex;

  justify-content: center;

  align-items: center;

  gap: 12px;

  font-size: 7.5px;
}

.band-contact-item {
  display: flex;

  align-items: center;

  white-space: nowrap;
}

.bc-icon {
  width: 11px;
  height: 11px;

  margin-right: 4px;

  fill: var(--gold);
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
}
`;