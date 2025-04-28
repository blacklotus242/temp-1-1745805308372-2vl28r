export async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  const data = req.body;
  console.log('Webhook received:', data);

  res.status(200).json({ received: true });
}