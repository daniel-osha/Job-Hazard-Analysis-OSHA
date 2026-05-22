import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  try {
    const { datos } = req.body;
    
    // Aquí puedes incluir tus instrucciones para el modelo
    const prompt = Analiza los siguientes datos y genera el reporte: ${datos};

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620', // O el modelo que prefieras
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });

    res.status(200).json({ resultado: response.content[0].text });
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
}
