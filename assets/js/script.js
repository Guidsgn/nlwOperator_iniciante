const app = {
    transcriptionURL: '',
    public_id: '',
    waitForTranscription: () => {
        // Preciso de um polling para saber se a transcrição está pronta
        // Tente 30 vezes
        // A URL de exemplo é essa
        // https://res.cloudinary.com/dydnihvz4/raw/upload/v1773420414/rcjplsku77s9w6vbjjxy.transcript
        // dydnihvz4 essa é a configMyWidget.cloudName
        // v1773420414 esse é v${Date.now()}
        // rcjplsku77s9w6vbjjxy esse é o app.public_id
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