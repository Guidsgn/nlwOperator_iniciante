const configMyWidget = {

    cloudName: 'dydnihvz4',
    uploadPreset: 'upload_nlw'

}

const myWidget = cloudinary.createUploadWidget(configMyWidget, (error, result) => {
    if (!error && result && result.event === "success") {
        console.log('Pronto! Aqui estão as informações da imagem: ', result.info);
    }
}
)

document.getElementById("upload_widget").addEventListener("click", function () {
    myWidget.open();
}, false);