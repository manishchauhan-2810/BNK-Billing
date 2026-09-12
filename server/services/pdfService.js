const puppeteer = require('puppeteer');
const invoiceTemplate = require('../templates/invoiceTemplate');

let browserPromise = null;

const getBrowser = () => {
  if (!browserPromise) {
    console.log('Starting Puppeteer...');

    browserPromise = puppeteer
      .launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu'
        ]
      })
      .then((browser) => {
        console.log('Puppeteer browser started successfully');
        return browser;
      })
      .catch((error) => {
        console.error('Puppeteer launch failed:', error);
        browserPromise = null;
        throw error;
      });
  }

  return browserPromise;
};

exports.generatePdf = async (bill) => {
  console.log('Starting PDF generation');
  console.log('Invoice:', bill.invoiceNumber);

  const html = invoiceTemplate(bill);

  console.log('Invoice HTML generated');
  console.log('HTML length:', html.length);

  const browser = await getBrowser();

  let page;

  try {
    page = await browser.newPage();

    console.log('New Puppeteer page created');

    await page.setContent(html, {
      waitUntil: 'networkidle0'
    });

    console.log(' HTML loaded into Puppeteer');

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
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw error;
  } finally {
    if (page) {
      await page.close().catch((err) => {
        console.error('Failed to close Puppeteer page:', err);
      });
    }
  }
};