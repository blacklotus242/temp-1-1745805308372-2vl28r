let users = [];

export async function handler(req, res) {
  if (req.method === 'GET') {
    const { userId } = req.query;
    const user = users.find((u) => u.id == userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ preferences: user.preferences });
  }

  if (req.method === 'POST') {
    const { userId, preferences } = req.body;
    const user = users.find((u) => u.id == userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.preferences = preferences;
    return res.status(200).json({ success: true, preferences });
  }

  res.status(405).send({ message: 'Only GET or POST requests allowed' });
}