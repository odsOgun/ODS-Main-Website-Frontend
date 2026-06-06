import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'a7x1hmck',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow only POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, comment, postId } = req.body;

  // Basic validation
  if (!name || !comment || !postId) {
    return res.status(400).json({ message: 'Name, comment and postId are required.' });
  }

  if (comment.length > 1000) {
    return res.status(400).json({ message: 'Comment is too long (max 1000 characters).' });
  }

  try {
    await client.create({
      _type: 'comment',
      post: { _type: 'reference', _ref: postId },
      name: name.trim(),
      email: email?.trim() || '',
      comment: comment.trim(),
      approved: false,
      createdAt: new Date().toISOString()
    });

    return res.status(201).json({ message: 'Comment submitted and awaiting approval.' });
  } catch (err) {
    console.error('Failed to save comment:', err);
    return res.status(500).json({ message: 'Failed to submit comment. Please try again.' });
  }
}
