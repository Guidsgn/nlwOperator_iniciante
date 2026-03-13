const app = {
    transcriptionURL: '',
    public_id: '',
    version: null,
    waitForTranscription: async ({ maxAttempts = 30, intervalMs = 2000, timeoutMs = 8000 } = {}) => {
        const cloudName = configMyWidget.cloudName
        const publicId = app.public_id
        const version = app.version ?? Date.now()

        if (!cloudName) throw new Error('cloudName não configurado')
        if (!publicId) throw new Error('public_id não definido')

        const transcriptionURL = `https://res.cloudinary.com/${cloudName}/raw/upload/v${version}/${publicId}.transcript`
        app.transcriptionURL = transcriptionURL

        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const controller = new AbortController()
                const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

                const response = await fetch(transcriptionURL, {
                    method: 'HEAD',
                    cache: 'no-store',
                    signal: controller.signal
                })

                clearTimeout(timeoutId)

                if (response.ok) return transcriptionURL
            } catch (_) {}

            await sleep(intervalMs)
        }

        throw new Error('Transcrição ainda não ficou pronta')
    },
    getTranscription: () => {},
    getViralMoment: () => {}
}

const configMyWidget = {
    cloudName: 'dydnihvz4',
    uploadPreset: 'upload_nlw'
}

const myWidget = cloudinary.createUploadWidget(configMyWidget, (error, result) => {
    if (!error && result && result.event === "success") {
        console.log('Pronto! Aqui estão as informações da imagem: ', result.info);
        app.public_id = result.info.public_id
        app.version = result.info.version

        Toastify({
            text: "Vídeo processado com sucesso!",
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)"
            }
          }).showToast();
    }
}
)

document.getElementById("upload_widget").addEventListener("click", function () {
    myWidget.open();
}, false);
