const app = {
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
    },
}

// const app2 = {
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
    cloudName: 'dydnihvz4',
    uploadPreset: 'upload_nlw'
}

const myWidget = cloudinary.createUploadWidget(configMyWidget, async (error, result) => {
    if (!error && result && result.event === "success") {
        console.log('Pronto! Aqui estão as informações da imagem: ', result.info);
        app2.public_id = result.info.public_id
        app2.version = result.info.version
        const isReady = await app.waitForTranscription()
    }
}
)

document.getElementById("upload_widget").addEventListener("click", function () {
    myWidget.open();
}, false);
