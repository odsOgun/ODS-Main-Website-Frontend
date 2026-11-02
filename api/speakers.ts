// /api/speakers.ts
import { google } from 'googleapis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      companyName,
      role,
      website,
      country,
      industry,
      contentTrack,
      topicProposal
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !companyName ||
      !role ||
      !website ||
      !country ||
      !industry ||
      !contentTrack ||
      !topicProposal
    ) {
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
      range: 'Speakers!A:L', // Push into Speakers tab (A to L covers 11 fields)
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            firstName,
            lastName,
            email,
            phoneNumber,
            companyName,
            role,
            website,
            country,
            industry,
            contentTrack,
            topicProposal
          ]
        ]
      }
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error submitting speaker form:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
