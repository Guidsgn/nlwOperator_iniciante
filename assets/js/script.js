const element = {
    apiKeyInput: document.getElementById('apiKey'),
    buttonUpload: document.getElementById('uploadWidget'),
    status: document.getElementById('status'),
    video: document.getElementById('video')
}

const app = { // App do Mayk
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
    transcriptionURL: '',
    public_id: '',
    waitForTranscription: async () => {
        const maxAttempts = 30;
        const delay = 2000;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            const url = `https://res.cloudinary.com/${app.cloudName}/raw/upload/v${Date.now()}/${app.public_id}.transcript`;

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
        const transcription = await app.getTranscription();

        const apiUrl = import.meta.env.DEV
            ? 'http://localhost:3001/get-viral-moment'
            : '/api/get-viral-moment';

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ transcription })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.result;
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
//             const url = `https://res.cloudinary.com/${app.cloudName}/raw/upload/v${Date.now()}/${app2.public_id}.transcript`;

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

const myWidget = cloudinary.createUploadWidget(app, async (error, result) => {
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
            const viralMomentURL = `https://res.cloudinary.com/${app.cloudName}/video/upload/${viralMoment}/${app.public_id}.mp4`;
            element.video.setAttribute('src', viralMomentURL)

        } catch (error) {
            console.log({ error })
        }
    }
}
)

element.buttonUpload.addEventListener("click", function () {
    myWidget.open();
}, false);
