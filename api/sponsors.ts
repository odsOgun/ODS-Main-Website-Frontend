// /api/sponsors.ts
import { google } from 'googleapis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, organization, mobile, website, linkedin, twitter } = req.body;

    if (!name || !email || !organization || !mobile) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.SPREADSHEET_ID!;

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sponsors!A:G', // Push into Sponsors tab (A to G covers 7 fields)
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[name, email, organization, mobile, website, linkedin, twitter]]
      }
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error submitting sponsor form:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
