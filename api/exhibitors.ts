import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, organization, mobile } = req.body;

    if (!name || !email || !organization || !mobile) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      undefined,
      (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({ version: 'v4', auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Exhibitors!A:D', // 👈 Tab name "Exhibitors"
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[name, email, organization, mobile]]
      }
    });

    return res.status(200).json({ success: true, message: 'Form submitted!' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Google Sheets API Error:', error);
    return res.status(500).json({ error: 'Failed to submit form' });
  }
}
