export async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }
  
  const { email, password } = req.body;
  // Here you'd normally check credentials against a database
  if (email === 'test@example.com' && password === 'password') {
    res.status(200).json({ success: true, token: "fake-jwt-token" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
}