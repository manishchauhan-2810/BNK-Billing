const puppeteer = require('puppeteer');
const invoiceTemplate = require('../templates/invoiceTemplate');

let browserPromise = null;

const getBrowser = () => {
  if (!browserPromise) {
    browserPromise = puppeteer
      .launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage'
        ]
      })
      .catch((error) => {
        browserPromise = null;
        throw error;
      });
  }

  return browserPromise;
};

exports.generatePdf = async (bill) => {
  const html = invoiceTemplate(bill);
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
    });
    return pdfBuffer;
  } finally {
    await page.close(); // close the page, not the whole browser — reuse it across requests
  }
};