import { NextResponse } from 'next/server';

// Server-side PDF generator using Puppeteer if available
export async function POST(request) {
  try {
    const { title, entries } = await request.json();

    // Minimal HTML wrapper for printing
    const html = `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>${title || 'Daily Summary'}</title>
        <style>
          body { font-family: Arial, Helvetica, sans-serif; padding: 20px; color: #222 }
          .card { border-radius: 8px; padding: 16px; margin-bottom: 12px; color: white }
          .food { background: #DC965A }
          .mood { background: #00CFC1 }
          .meds { background: #773344 }
          .bowel { background: #3C493F }
          .time { font-size: 13px; opacity: 0.9 }
          h1 { margin-bottom: 12px }
        </style>
      </head>
      <body>
        <h1>${title || 'Daily Summary'}</h1>
        ${entries && entries.length ? entries.map(e => `
          <div class="card ${e.topic}">
            <div class="time">${e.createdAt}</div>
            <h2>${e.title || ''}</h2>
            <p>${e.notes || ''}</p>
          </div>
        `).join('') : '<p>No entries</p>'}
      </body>
    </html>`;

    // Try to use puppeteer to render PDF if available
    let puppeteer;
    try {
      puppeteer = await import('puppeteer');
    } catch (err) {
      puppeteer = null;
    }

    if (puppeteer && typeof puppeteer.launch === 'function') {
      const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' } });
        await browser.close();
        return new NextResponse(pdfBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="daily-summary.pdf"'
          }
        });
      } catch (err) {
        console.error('Puppeteer PDF generation failed', err);
        try { await browser.close(); } catch (e) {}
        // fallthrough to HTML response
      }
    }

    // Fallback: return HTML snapshot for manual save-as-PDF in browser
    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (err) {
    console.error('PDF snapshot error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
