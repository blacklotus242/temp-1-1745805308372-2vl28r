let users = [];

export async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  const { email, password } = req.body;
  const existingUser = users.find((u) => u.email === email);

  if (existingUser) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }

  const newUser = { id: Date.now(), email, password, preferences: {} };
  users.push(newUser);

  res.status(201).json({ success: true, userId: newUser.id });
}