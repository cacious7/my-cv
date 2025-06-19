const express = require('express');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core'); // Changed from 'puppeteer'
const chrome = require('chrome-aws-lambda'); // Added for Netlify

const app = express();
// const port = process.env.PORT || 3000; // Port will be handled by serverless or local startup
// const host = '0.0.0.0'; // Host will be handled by serverless or local startup

// Serve static files from the 'public' directory
// For Netlify, ensure paths are relative or correctly handled by the function's context
app.use(express.static(path.join(__dirname, 'public')));

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Global variable to hold CV data
let cvData = null;

// Read and parse cv_data.json at server start (or module load)
// This will run when the serverless function initializes or when server.js is run directly.
try {
  const data = fs.readFileSync(path.join(__dirname, 'cv_data.json'), 'utf8');
  cvData = JSON.parse(data);
  console.log('CV data loaded and parsed successfully.');
} catch (err) {
  console.error('Failed to read or parse CV data on init:', err);
  // Depending on how critical this is, you might throw an error or set cvData to a default/error state
}


// Route for the homepage
app.get('/', (req, res) => {
  if (!cvData) {
    return res.status(500).send('CV data is not loaded yet. Please try again shortly or check server logs.');
  }

  fs.readFile(path.join(__dirname, 'views', 'index.html'), 'utf8', (err, htmlData) => {
    if (err) {
      console.error('Error reading index.html:', err);
      return res.status(500).send('Error serving the page.');
    }
    // Ensure placeholder matches exactly what's in index.html
    const modifiedHtml = htmlData.replace('{{CV_DATA_PLACEHOLDER}}', JSON.stringify(cvData));
    res.send(modifiedHtml);
  });
});

// Route to serve cv_data.json (optional, for debugging)
app.get('/cvdata', (req, res) => {
  if (!cvData) {
    return res.status(500).send('CV data is not loaded yet.');
  }
  res.setHeader('Content-Type', 'application/json');
  res.json(cvData);
});

// PDF Download Route
app.get('/download-pdf', async (req, res) => {
  if (!cvData) {
    return res.status(500).send('CV data is not loaded, PDF cannot be generated.');
  }

  let browser;
  try {
    console.log('Launching Puppeteer browser with chrome-aws-lambda...');
    const executablePath = await chrome.executablePath || process.env.CHROME_EXECUTABLE_PATH;

    if (!executablePath) {
        console.error('Chromium executable path not found. Ensure chrome-aws-lambda is correctly installed or CHROME_EXECUTABLE_PATH is set.');
        return res.status(500).send('Error generating PDF: Chromium path not found.');
    }

    browser = await puppeteer.launch({
      args: chrome.args,
      executablePath: executablePath,
      headless: chrome.headless, // Use chrome-aws-lambda's headless mode setting
    });

    const page = await browser.newPage();
    console.log('Navigating to the CV page for PDF generation...');

    // Determine the base URL. For Netlify, functions are typically served from the same domain.
    // req.headers.host should give the domain. req.protocol for http/https.
    // For local testing, this will be localhost:PORT.
    // When deployed on Netlify, this needs to point to the function's own URL.
    // A simple approach is to use a relative path if the function serves itself,
    // or construct it carefully.
    // Using the current host from headers is more robust for deployed environments.
    const currentPort = process.env.PORT || 3000; // Fallback for local
    const baseUrl = process.env.NETLIFY_URL || `http://${req.headers.host || `localhost:${currentPort}`}`;
    const pageUrl = `${baseUrl}/`;

    console.log(`Attempting to navigate to: ${pageUrl}`);

    await page.goto(pageUrl, { waitUntil: 'networkidle0', timeout: 15000 }); // Added timeout

    console.log('Generating PDF...');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    console.log('PDF generated successfully.');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Cacious_Siamunyanga_CV.pdf"');
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send(`Error generating PDF: ${error.message}. Check server logs.`);
  } finally {
    if (browser) {
      console.log('Closing Puppeteer browser...');
      await browser.close();
    }
  }
});

// Export the app for serverless function
// module.exports = app; // This will be at the end

// Start the server only if not in a serverless environment (e.g., for local development)
// The `require.main === module` check ensures this runs only when server.js is executed directly.
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  const HOST = '0.0.0.0';
  app.listen(PORT, HOST, () => {
    console.log(`Server is running locally on http://${HOST}:${PORT}`);
  });
}

module.exports = app; // Ensure app is exported for serverless-http in functions/api.js
