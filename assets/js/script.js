const app = { // App do Mayk
    transcriptionURL: '',
    public_id: '',
    waitForTranscription: async () => {
        const maxAttempts = 30;
        const delay = 2000;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            const url = `https://res.cloudinary.com/${configMyWidget.cloudName}/raw/upload/v${Date.now()}/${app.public_id}.transcript`;

            try {
                console.log(`Tentativa ${attempt}/${maxAttempts}: Verificando transcrição...`);
                const response = await fetch(url);

                if (response.ok) {
                    app.transcriptionURL = url;
                    console.log('Transcrição encontrada!', url);
                    return true
                }
            } catch (error) {
                console.log(`Tentativa ${attempt} falhou:`, error.message);
            }

            // Aguarda antes da próxima tentativa (exceto a última)
            if (attempt < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        console.log('Transcrição não encontrada após todas as tentativas.');
        return false
    },
    getTranscription: async () => {
        const response = await fetch(app.transcriptionURL);
        return response.text()
    },
    getViralMoment: async () => {
        const transcription = await app.getTranscription()

        const geminiModel = 'gemini-3-flash-preview'
        const endpointGemini = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent`

        const prompt = `
            Role: You are an expert viral content editor specialized in identifying high-retention moments for short-form platforms like TikTok, Reels, and YouTube Shorts.

            Task: Analyze the transcription below and detect the single most viral-worthy segment. Focus on moments that contain strong hooks, unexpected reactions, humor, controversy, emotional impact, surprising information, or storytelling peaks that would make viewers stop scrolling.

            Selection Criteria:
            - Prioritize segments with a clear beginning hook and satisfying payoff.
            - Prefer moments with strong emotion, humor, shock, or curiosity.
            - Avoid slow introductions, filler speech, or context-heavy parts that require long setup.
            - The clip should make sense even when isolated from the full video.

            Constraints:
            1. Duration: Minimum 30 seconds, Maximum 60 seconds.
            2. Select ONLY one segment.
            3. Format: Return ONLY the start and end string for Cloudinary.
            4. Format pattern: so_<start_seconds>,eo_<end_seconds>
            5. Example outputs: "so_12,eo_45"  OR  "so_8.5,eo_52.3"
            6. CRITICAL: Do not explain your reasoning.
            7. CRITICAL: Do not use quotes, markdown, or extra text.
            8. Return ONLY the raw string.

            Transcription:
            ${transcription}
        `

        const headers = {
            'x-goog-api-key': import.meta.env.VITE_GEMINI_API_KEY,
            'Content-Type': 'application/json'
        }
        const contents = [
            {
                parts: [
                    {
                        text: prompt
                    }
                ]
            }
        ]

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
                const rawText = data.candidates[0].content.parts[0].text

                // Retornar o texto da resposta
                return rawText.replace(/```/g, '').replace(/json/g, "").trim
            } catch (error) {
                attempt++;
                if (attempt >= maxRetries) {
                    throw error;
                }
                console.log(`Tentativa ${attempt} falhou: ${error.message}. Tentando novamente em ${attempt} segundos...`);
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }
    },
}

// const app2 = { // Meu app
//     transcriptionURL: '',
//     public_id: '',
//     version: null,
//     waitForTranscription: async () => {
//         const maxAttempts = 30;
//         const delay = 2000;

//         for (let attempt = 1; attempt <= maxAttempts; attempt++) {
//             const url = `https://res.cloudinary.com/${configMyWidget.cloudName}/raw/upload/v${Date.now()}/${app2.public_id}.transcript`;

//             try {
//                 console.log(`Tentativa ${attempt}/${maxAttempts}: Verificando transcrição...`);
//                 const response = await fetch(url);

//                 if (response.ok) {
//                     app2.transcriptionURL = url;
//                     console.log('Transcrição encontrada!', url);
//                     return true
//                 }
//             } catch (error) {
//                 console.log(`Tentativa ${attempt} falhou:`, error.message); 
//             }

//             // Aguarda antes da próxima tentativa (exceto a última)
//             if (attempt < maxAttempts) {
//                 await new Promise(resolve => setTimeout(resolve, delay));
//             }
//         }

//         console.log('Transcrição não encontrada após todas as tentativas.');
//         return false
//     },
//     getTranscription: async () => {
//         const response = await fetch(app2.transcriptionURL);
//         return response.text()
//     },
//     getViralMoment: async () => {
//         const transcription = await app2.getTranscription()
//     },
// }

const configMyWidget = {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,  // Agora pega da caixa secreta do Vercel
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
}

const myWidget = cloudinary.createUploadWidget(configMyWidget, async (error, result) => {
    if (!error && result && result.event === "success") {
        console.log('Pronto! Aqui estão as informações da imagem: ', result.info);
        app.public_id = result.info.public_id
        app.version = result.info.version

        try {
            const isReady = await app.waitForTranscription()
            if (!isReady) {
                throw new Error('Erro ao buscar transcrição!')
            }

            const viralMoment = await app.getViralMoment()
            const viralMomentURL = `https://res.cloudinary.com/${configMyWidget.cloudName}/video/upload/${viralMoment}/${app.public_id}.mp4`

        } catch (error) {
            console.log({ error })
        }
    }
}
)

document.getElementById("upload_widget").addEventListener("click", function () {
    myWidget.open();
}, false);
