const configMyWidget = {

    cloudName: 'dydnihvz4',
    uploadPreset: 'upload_nlw'

}

const myWidget = cloudinary.createUploadWidget(configMyWidget, (error, result) => {
    if (!error && result && result.event === "success") {
        console.log('Pronto! Aqui estão as informações da imagem: ', result.info);

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