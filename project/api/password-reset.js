let users = [];

export async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  const { email } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  // Simulate sending a reset link (in real world you'd email this)
  console.log(`Password reset link would be sent to: ${email}`);

  res.status(200).json({ success: true, message: 'Password reset email sent (simulated).' });
}