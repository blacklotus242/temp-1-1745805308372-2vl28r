export async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }
  
  const { prompt } = req.body;
  // You would integrate OpenAI API call here
  res.status(200).json({ message: "Pretend OpenAI responded to: " + prompt });
}