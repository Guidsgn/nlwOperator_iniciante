const app = {
    transcriptionURL: '',
    public_id: '',
    waitForTranscription: async () => {
        const maxAttempts = 30;
        const delay = 2000;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            const url = `https://res.cloudinary.com/${config.cloudName}/raw/upload/v${Date.now()}/${app.public_id}.transcript`;
            
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
    getTranscription: () => {},
    getViralMoment: () => {}
}

const configMyWidget = {
    cloudName: 'dydnihvz4',
    uploadPreset: 'upload_nlw'
}

const myWidget = cloudinary.createUploadWidget(configMyWidget, async(error, result) => {
    if (!error && result && result.event === "success") {
        console.log('Pronto! Aqui estão as informações da imagem: ', result.info);
        app.public_id = result.info.public_id
        app.version = result.info.version
        const isReady = await app.waitForTranscription()
    }
}
)

document.getElementById("upload_widget").addEventListener("click", function () {
    myWidget.open();
}, false);
