const amountToWords = require('../utils/amountToWords');
const styles = require('./invoiceStyles');
const logoBase64 = require('../assets/logoBase64');

/* ============================================================
   HELPERS
   ============================================================ */

const escapeHtml = (value) => {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};


/* ============================================================
   DATE FORMAT
   ============================================================ */

const formatDate = (dateInput) => {

  if (!dateInput) {
    return '-';
  }

  const d = new Date(dateInput);

  if (Number.isNaN(d.getTime())) {
    return '-';
  }

  const day = String(d.getDate()).padStart(2, '0');

  const month = String(
    d.getMonth() + 1
  ).padStart(2, '0');

  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};


/* ============================================================
   RUPEE FORMAT
   ============================================================ */

const formatRupees = (paise) => {

  const rupees =
    Number(paise || 0) / 100;

  return rupees.toLocaleString(
    'en-IN',
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  );
};


/* ============================================================
   MULTILINE TEXT
   ============================================================ */

const renderMultiline = (value) => {

  const text = String(
    value ?? ''
  ).trim();

  if (!text) {
    return '-';
  }

  return text
    .split(/\r?\n/)
    .map(line =>
      escapeHtml(line.trim())
    )
    .filter(Boolean)
    .join('<br>');
};


/* ============================================================
   ICONS
   ============================================================ */

const ICON_PIN = `
<svg
  class="cb-icon"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
>
  <path
    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
  />
</svg>
`;


const ICON_PHONE = `
<svg
  class="cb-icon"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
>
  <path
    d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.39 21 3 13.61 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
  />
</svg>
`;


const ICON_MAIL = `
<svg
  class="cb-icon"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
>
  <path
    d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"
  />
</svg>
`;


const ICON_WEB = `
<svg
  class="cb-icon"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
>
  <path
    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.92 6h-3.04c-.31-1.25-.78-2.45-1.38-3.56A8.03 8.03 0 0 1 18.92 8zM12 4.04A15.7 15.7 0 0 1 13.91 8h-3.82A15.7 15.7 0 0 1 12 4.04zM4.26 14A8.03 8.03 0 0 1 4 12c0-.7.09-1.37.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A8.03 8.03 0 0 1 5.08 16zM8.03 8H5.08a8.03 8.03 0 0 1 4.33-3.56A15.7 15.7 0 0 0 8.03 8zM12 19.96A15.7 15.7 0 0 1 10.09 16h3.82A15.7 15.7 0 0 1 12 19.96zM14.36 14H9.64c-.09-.65-.14-1.31-.14-2s.05-1.34.14-2h4.72c.09.66.14 1.32.14 2s-.05 1.34-.14 2zm.14 5.56c.6-1.11 1.07-2.31 1.38-3.56A8.03 8.03 0 0 1 14.5 19.56zM16.36 14c.08-.66.14-1.32-.14-2s-.06-1.34-.14-2h3.38c.17.63.26 1.3.26 2s-.09 1.37-.26 2h-3.38z"
  />
</svg>
`;


/* ============================================================
   CLINIC DATA
   ============================================================ */

const CLINICS = {

  PHYSIO: {

    groupName:
      'BNK HEALTH CARE GROUP',

    tagline:
      'INNOVATIVE REHABILITATION & HEALTHCARE SOLUTIONS',

    subTagline:
      'Healing Hands, Restoring Lives',

    phone:
      '+91 9458703187',

    addressLine1:
      'Harikala Complex, Near Jagdamba Mandir Ke Samne',

    addressLine2:
      'Jagdamba Nagar, Haldwani, Uttarakhand - 263139',

    email:
      'info@bnkhealthcare.in',

    website:
      'www.bnkhealthcare.in',

    defaultGst:
      '05ABGFB8162R1ZV',

    footerClinicName:
      'Physiotherapy And Rehabilitation Center.'
  },


  CTSCAN: {

    groupName:
      'BNK HEALTH CARE GROUP',

    tagline:
      'INNOVATIVE REHABILITATION & HEALTHCARE SOLUTIONS',

    subTagline:
      'Ranikhet',

    phone:
      '8057673679 / 7042450105',

    addressLine1:
      'Near Roadways, Zaroori Bazar',

    addressLine2:
      'Ranikhet, Uttarakhand - 263645',

    email:
      'info@bnkhealthcare.in',

    website:
      'www.bnkhealthcare.com',

    defaultGst:
      '05ABGFB8162R1ZV',

    footerClinicName:
      'BNK Diagnostic Centre.'
  }
};


/* ============================================================
   HEADER
   ============================================================ */

const renderHeader = (clinic) => {

  return `
    <div class="header-wrapper">

      <div class="header-main">

        <img
          class="header-logo"
          src="${logoBase64}"
          alt="BNK Health Care Group"
        />

        <div class="header-content">

          <div class="group-name">

            <span class="g-bnk">
              BNK
            </span>

            <span class="g-rest">
              HEALTH CARE
            </span>

          </div>


          <div class="group-sub-line">

            <span class="g-line"></span>

            <span class="g-group">
              GROUP
            </span>

            <span class="g-line"></span>

          </div>


          <div class="clinic-tagline-row">

            <div class="tag-line"></div>

            <div class="tag-text">
              ${escapeHtml(clinic.tagline)}
            </div>

            <div class="tag-line"></div>

          </div>


          <div class="clinic-subtagline">

            ${escapeHtml(clinic.subTagline)}

          </div>

        </div>

      </div>


      <!-- CONTACT BAR -->

      <div class="contact-bar">

        <table>

          <tbody>

            <tr>

              <td style="width:41%;">

                <div class="cb-item">

                  ${ICON_PIN}

                  <span>
                    ${escapeHtml(clinic.addressLine1)},
                    ${escapeHtml(clinic.addressLine2)}
                  </span>

                </div>

              </td>


              <td style="width:17%;">

                <div class="cb-item">

                  ${ICON_PHONE}

                  <span>
                    ${escapeHtml(clinic.phone)}
                  </span>

                </div>

              </td>


              <td style="width:22%;">

                <div class="cb-item">

                  ${ICON_MAIL}

                  <span>
                    ${escapeHtml(clinic.email)}
                  </span>

                </div>

              </td>


              <td style="width:20%;">

                <div class="cb-item">

                  ${ICON_WEB}

                  <span>
                    ${escapeHtml(clinic.website)}
                  </span>

                </div>

              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>


    <!-- BILL -->

    <div class="bill-banner-container">

      <div class="bill-banner">
        BILL
      </div>

    </div>
  `;
};


/* ============================================================
   PATIENT INFO ROW
   ============================================================ */

const renderInfoRow = (
  label,
  value
) => {

  return `
    <tr>

      <td class="info-label">
        ${escapeHtml(label)}
      </td>

      <td class="info-separator">
        :
      </td>

      <td class="info-value">
        ${value || '-'}
      </td>

    </tr>
  `;
};


/* ============================================================
   PATIENT INFO TABLE
   ============================================================ */

const renderPatientInfo = (
  bill,
  clinic,
  regDateStr,
  billDateStr
) => {

  const gender =
    bill.patient?.gender === 'Male'
      ? 'M'
      : bill.patient?.gender === 'Female'
        ? 'F'
        : escapeHtml(
            bill.patient?.gender || '-'
          );


  const ageGender =
    bill.patient?.age
      ? `${escapeHtml(
          bill.patient.age
        )} yr / ${gender}`
      : `- / ${gender}`;


  return `
    <table class="patient-info-table">

      <tbody>

        <tr>

          <!-- LEFT -->

          <td class="col-left">

            <table class="info-grid">

              <tbody>

                ${renderInfoRow(
                  'Name',
                  escapeHtml(
                    bill.patient?.name || '-'
                  )
                )}

                ${renderInfoRow(
                  'Bill No.',
                  escapeHtml(
                    bill.invoiceNumber || '-'
                  )
                )}

                ${renderInfoRow(
                  'No. of Days',
                  escapeHtml(
                    bill.numberOfDays || '0'
                  )
                )}

                ${renderInfoRow(
                  'Address',
                  escapeHtml(
                    bill.patient?.address || '-'
                  )
                )}

                ${renderInfoRow(
                  'Registration Date',
                  escapeHtml(regDateStr)
                )}

              </tbody>

            </table>

          </td>


          <!-- RIGHT -->

          <td class="col-right">

            <table class="info-grid">

              <tbody>

                ${renderInfoRow(
                  'Age / Gender',
                  ageGender
                )}

                ${renderInfoRow(
                  'Patient Code',
                  escapeHtml(
                    bill.patient?.patientCode || '-'
                  )
                )}

                ${renderInfoRow(
                  'Referred By',
                  escapeHtml(
                    bill.referredBy || '-'
                  )
                )}

                ${renderInfoRow(
                  'GST No.',
                  escapeHtml(
                    bill.gstNumber ||
                    clinic.defaultGst ||
                    '-'
                  )
                )}

                ${renderInfoRow(
                  'Bill Date',
                  escapeHtml(billDateStr)
                )}

              </tbody>

            </table>

          </td>

        </tr>

      </tbody>

    </table>
  `;
};


/* ============================================================
   PHYSIOTHERAPY BODY
   ============================================================ */

const renderPhysioBody = (bill) => {

  /* -------------------------
     DIAGNOSIS
     ------------------------- */

  const diagnoses =
    String(
      bill.diagnosis || ''
    )
      .split(/\r?\n/)
      .map(item =>
        item.trim()
      )
      .filter(Boolean);


  /* -------------------------
     TREATMENTS
     ------------------------- */

  const treatments =
    (bill.treatments || [])
      .map(item =>
        String(item).trim()
      )
      .filter(Boolean);


  /* -------------------------
     CHARGE ITEMS
     ------------------------- */

  const charges =
    (bill.chargeItems || [])
      .filter(Boolean)
      .map(item => ({

        particular:
          item.particular || '-',

        amount:
          item.amount || 0

      }));


  /* ============================================================
     DIAGNOSIS HTML
     ============================================================ */

  const diagnosisHtml =
    diagnoses.length

      ? diagnoses
          .map(item => {

            return `
              <div class="diagnosis-item">
                ${escapeHtml(item)}
              </div>
            `;

          })
          .join('')

      : '-';


  /* ============================================================
     TREATMENT HTML
     ============================================================ */

  const treatmentHtml =
    treatments.length

      ? `
        <table class="inner-table treatment-table">

          <tbody>

            ${treatments
              .map(item => {

                return `
                  <tr>

                    <td class="bullet">
                      •
                    </td>

                    <td>
                      ${escapeHtml(item)}
                    </td>

                  </tr>
                `;

              })
              .join('')}

          </tbody>

        </table>
      `

      : '-';


  /* ============================================================
     CHARGES HTML
     ============================================================ */

  const chargeHtml =
    charges.length

      ? `
        <table class="inner-table charge-table">

          <tbody>

            ${charges
              .map(item => {

                return `
                  <tr>

                    <td>

                      <div class="package-desc">
                        ${escapeHtml(
                          item.particular
                        )}
                      </div>

                      <div class="amount-display">
                        ₹ ${formatRupees(
                          item.amount
                        )}
                      </div>

                    </td>

                  </tr>
                `;

              })
              .join('')}

          </tbody>

        </table>
      `

      : '-';


  /* ============================================================
     MAIN TABLE
     ============================================================ */

  return `

    <table class="main-table">

      <colgroup>

        <col class="col-1" />

        <col class="col-2" />

        <col class="col-3" />

      </colgroup>


      <thead>

        <tr>

          <th>
            DIAGNOSIS
          </th>

          <th>
            TREATMENT
          </th>

          <th>
            AMOUNT (₹) / PACKAGE
          </th>

        </tr>

      </thead>


      <tbody>

        <tr>

          <!-- DIAGNOSIS -->

          <td class="col-diagnosis">

            <div class="diagnosis-text">

              ${diagnosisHtml}

            </div>

          </td>


          <!-- TREATMENT -->

          <td class="col-treatment">

            ${treatmentHtml}

          </td>


          <!-- AMOUNT -->

          <td class="col-amount">

            ${chargeHtml}

          </td>

        </tr>

      </tbody>

    </table>

  `;
};


/* ============================================================
   CT SCAN BODY
   ============================================================ */

const renderCtScanBody = (bill) => {

  const rows =
    (bill.chargeItems || [])
      .filter(Boolean)
      .map(
        (item, index) => {

          return `
            <tr>

              <td class="col-sno">
                ${index + 1}
              </td>

              <td class="col-procedure">
                ${escapeHtml(
                  item.particular || '-'
                )}
              </td>

              <td class="col-rate">
                ₹ ${formatRupees(
                  item.amount
                )}
              </td>

            </tr>
          `;

        }
      )
      .join('');


  return `

    ${
      bill.diagnosis

        ? `

          <div class="diagnosis-note">

            <strong>
              Clinical Notes / Diagnosis:
            </strong>

            ${renderMultiline(
              bill.diagnosis
            )}

          </div>

        `

        : ''
    }


    <table class="lineitem-table">

      <colgroup>

        <col style="width:8%;" />

        <col style="width:62%;" />

        <col style="width:30%;" />

      </colgroup>


      <thead>

        <tr>

          <th>
            S.No.
          </th>

          <th>
            Procedure
          </th>

          <th>
            Rate (₹)
          </th>

        </tr>

      </thead>


      <tbody>

        ${
          rows ||

          `
            <tr>

              <td
                colspan="3"
                style="text-align:center;"
              >
                -
              </td>

            </tr>
          `
        }

      </tbody>

    </table>

  `;
};


/* ============================================================
   TOTALS
   ============================================================ */

const renderTotals = (bill) => {

  const amountWords = amountToWords(
    bill.totalAmount || 0
  );

  return `
    <div class="totals-container">

      <table class="totals-table">

        <tbody>

          <tr>

            <td class="label">
              Grand Total
            </td>

            <td class="val">
              ₹ ${formatRupees(
                bill.subTotal
              )}
            </td>

          </tr>


          <tr>

            <td class="label">
              Discount Amount
            </td>

            <td class="val">
              ₹ ${formatRupees(
                bill.discount
              )}
            </td>

          </tr>


          <tr class="payable-row">

            <td class="label">
              Net Amount Payable
            </td>

            <td class="val">
              ₹ ${formatRupees(
                bill.totalAmount
              )}
            </td>

          </tr>

        </tbody>

      </table>

    </div>


    <div class="amount-words-container">

      Amount in words:

      <strong>
        ${escapeHtml(amountWords)}
      </strong>

    </div>
  `;
};


/* ============================================================
   FOOTER
   ============================================================ */

const renderFooter = (clinic) => {

  return `

    <div class="footer-container">


      <!-- LEFT -->

      <div class="footer-left">

        <div class="heart-icon-container">

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
          >

            <path
              d="M32 50.16l-3.32-3.03C16.84 36.43 9 29.31 9 20.5
              9 13.31 14.31 8 21.5 8c4.07 0 7.97 1.89 10.5 4.88
              C34.53 9.89 38.43 8 42.5 8 49.69 8 55 13.31 55 20.5
              c0 8.81-7.84 15.93-19.68 26.65L32 50.16z"
              fill="#0a2647"
              opacity=".12"
            />


            <path
              d="M47.78 40.56a2 2 0 0 1-2.73.74L32 33.3V24a2 2 0 0 1 4 0v6.7l11.04 6.13a2 2 0 0 1 .74 2.73z"
              fill="none"
              stroke="#0a2647"
              stroke-width="3"
              stroke-linecap="round"
            />


            <path
              d="M16 28a2 2 0 0 1 2-2h6a2 2 0 0 1 0 4h-6a2 2 0 0 1-2-2z"
              fill="#0a2647"
            />


            <path
              d="M12 20.5C12 15.25 16.25 11 21.5 11c3.27 0 6.27 1.66
              8.04 4.44a2 2 0 0 0 3.42 0C34.73 12.66 37.73 11
              41.5 11 46.75 11 51 15.25 51 20.5c0 6.6-5.83 12.51
              -16.73 22.42L32 44.97l-2.27-2.05C18.83 33.01 12 27.1 12 20.5z"
              fill="none"
              stroke="#0a2647"
              stroke-width="3"
              stroke-linejoin="round"
            />

          </svg>

        </div>


        <div class="footer-text">

          Thank you for choosing<br/>

          <strong>
            ${escapeHtml(
              clinic.footerClinicName
            )}
          </strong>

          <br/>

          We wish you a speedy recovery
          and good health.

        </div>

      </div>


      <!-- SIGNATURE -->

      <div class="footer-right">

        <div class="signature-line">

          Authorised Signature

        </div>

      </div>

    </div>


    <!-- ========================================================
         BRAND FOOTER
         ======================================================== -->

    <div class="brand-band">


      <div class="band-title-row">

        <span class="band-line"></span>

        <span class="band-title">
          BNK HEALTH CARE GROUP
        </span>

        <span class="band-line"></span>

      </div>


      <div class="band-services">

        Neuro Rehabilitation
        &nbsp;|&nbsp;

        Physiotherapy &amp; Pain Management
        &nbsp;|&nbsp;

        Sports Rehab
        &nbsp;|&nbsp;

        Pediatric Rehabilitation
        &nbsp;|&nbsp;

        Home Care Services
        &nbsp;|&nbsp;

        Healthcare Products &amp; Manufacturing

      </div>


      <div class="band-contact">


        <span class="band-contact-item">

          ${ICON_PIN.replace(
            'cb-icon',
            'bc-icon'
          )}

          Haldwani, Uttarakhand - 263139

        </span>


        <span class="band-contact-item">

          ${ICON_PHONE.replace(
            'cb-icon',
            'bc-icon'
          )}

          9458703187

        </span>


        <span class="band-contact-item">

          ${ICON_MAIL.replace(
            'cb-icon',
            'bc-icon'
          )}

          info@bnkhealthcare.in

        </span>


        <span class="band-contact-item">

          ${ICON_WEB.replace(
            'cb-icon',
            'bc-icon'
          )}

          www.bnkhealthcare.in

        </span>


      </div>

    </div>

  `;
};


/* ============================================================
   MAIN EXPORT
   ============================================================ */

module.exports = (bill) => {

  const billType =
    bill.billType === 'CTSCAN'
      ? 'CTSCAN'
      : 'PHYSIO';


  const clinic =
    CLINICS[billType];


  const billDateStr =
    formatDate(
      bill.billDate
    );


  const regDateStr =
    formatDate(
      bill.registrationDate
    );


  const bodyHtml =
    billType === 'CTSCAN'

      ? renderCtScanBody(bill)

      : renderPhysioBody(bill);


  return `

<!DOCTYPE html>

<html lang="en">

<head>

  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>
    Invoice -
    ${escapeHtml(
      bill.invoiceNumber || ''
    )}
  </title>


  <style>

    ${styles}


    @page {

      size: A4;

      margin: 0;

    }

  </style>

</head>


<body>


  <div class="invoice-container">


    <!-- HEADER -->

    ${renderHeader(clinic)}


    <!-- PATIENT DETAILS -->

    ${renderPatientInfo(
      bill,
      clinic,
      regDateStr,
      billDateStr
    )}


    <!-- BODY -->

    ${bodyHtml}


    <!-- TOTALS -->

    ${renderTotals(bill)}


    <!-- PUSH FOOTER TO BOTTOM -->

    <div class="content-spacer"></div>


    <!-- FOOTER -->

    ${renderFooter(clinic)}


  </div>


</body>

</html>

`;
};