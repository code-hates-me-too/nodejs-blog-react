export function getCroppedImageBlob(imageSrc, croppedAreaPixels, outputSize = 512, quality = 0.85) {
    return new Promise((resolve, reject) => {

        const image = new Image();
        image.crossOrigin = "anonymous";
        image.src = imageSrc;

        image.onload = () => {

            const canvas = document.createElement("canvas");
            canvas.width = outputSize;
            canvas.height = outputSize;

            const ctx = canvas.getContext("2d");

            ctx.drawImage(
                image,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                outputSize,
                outputSize
            );

            canvas.toBlob(
                blob => {
                    if (!blob) return reject(new Error("Resim işlenemedi."));
                    resolve(blob);
                },
                "image/jpeg",
                quality
            );
        };

        image.onerror = () => reject(new Error("Resim yüklenemedi."));
    });
}