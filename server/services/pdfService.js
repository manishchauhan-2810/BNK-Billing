const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');
const invoiceTemplate = require('../templates/invoiceTemplate');

let browserPromise = null;

const getBrowser = async () => {
  if (!browserPromise) {
    browserPromise = (async () => {
      console.log('Starting Chromium...');

      // IMPORTANT:
      // executablePath() is async, so we MUST await it.
      const executablePath = await chromium.executablePath();

      console.log('Chromium executable path:', executablePath);

      if (!executablePath) {
        throw new Error('Chromium executable path is empty');
      }

      const browser = await puppeteer.launch({
        args: [
          ...chromium.args,
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu'
        ],
        defaultViewport: chromium.defaultViewport,
        executablePath: executablePath,
        headless: chromium.headless
      });

      console.log('Puppeteer browser started successfully');

      return browser;
    })().catch((error) => {
      console.error('Puppeteer launch failed:', error);

      // Allow another request to try launching again
      browserPromise = null;

      throw error;
    });
  }

  return browserPromise;
};

exports.generatePdf = async (bill) => {
  console.log('Starting PDF generation');
  console.log('Invoice:', bill.invoiceNumber);

  try {
    const html = invoiceTemplate(bill);

    console.log('Invoice HTML generated');
    console.log('HTML length:', html.length);

    const browser = await getBrowser();

    let page;

    try {
      page = await browser.newPage();

      console.log('New Puppeteer page created');

      await page.setContent(html, {
        waitUntil: 'load',
        timeout: 30000
      });

      console.log('HTML loaded into Puppeteer');

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px'
        }
      });

      console.log('PDF generated successfully');
      console.log('PDF size:', pdfBuffer.length);

      return pdfBuffer;

    } finally {
      if (page) {
        await page.close().catch((error) => {
          console.error('Failed to close Puppeteer page:', error);
        });
      }
    }

  } catch (error) {
    console.error('PDF generation failed:', error);
    throw error;
  }
};