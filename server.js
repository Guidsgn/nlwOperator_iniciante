const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Aumentar limite para 10MB
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.post('/get-viral-moment', async (req, res) => {
    const { transcription } = req.body;

    if (!transcription) {
        return res.status(400).json({ error: 'Transcription is required' });
    }

    const geminiModel = 'gemini-2.5-flash';
    const endpointGemini = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent`;

    const prompt = `
        Role: You are a professional video editor specializing in viral content.
        Task: Analyze the transcription below and identify the most engaging, funny, or surprising segment.
        Constraints:
        1. Duration: Minimum 30 seconds, Maximum 60 seconds.
        2. Format: Return ONLY the start and end string for Cloudinary. Format: so_<start_seconds>,eo_<end_seconds>
        3. Examples: "so_10,eo_20" or "so_12.5,eo_45.2"
        4. CRITICAL: Do not use markdown, do not use quotes, do not explain. Return ONLY the raw string.

        Transcription:
        ${transcription}
    `;

    const headers = {
        'x-goog-api-key': process.env.GEMINI_API_KEY,
        'Content-Type': 'application/json'
    };
    const contents = [
        {
            parts: [
                {
                    text: prompt
                }
            ]
        }
    ];

    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            const response = await fetch(endpointGemini, {
                method: 'POST',
                headers,
                body: JSON.stringify({ contents })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            const rawText = data.candidates[0].content.parts[0].text;

            // Retornar o texto da resposta
            const result = rawText.replace(/```/g, '').replace(/json/g, "").trim();
            return res.json({ result });
        } catch (error) {
            attempt++;
            if (attempt >= maxRetries) {
                return res.status(500).json({ error: error.message });
            }
            console.log(`Tentativa ${attempt} falhou: ${error.message}. Tentando novamente em ${attempt} segundos...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});