//Chat GPT code: 

document.addEventListener("DOMContentLoaded", function () {
    // Get the canvas element
    var canvas = document.getElementById("desk-canvas");
    var ctx = canvas.getContext("2d");

    // Load images onto the canvas
    function reloadImages(outlinedImage) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (outlinedImage) {
            drawImageOutline(ctx, canvas, outlinedImage);
        }
        drawDeskItems(ctx, outlinedImage);
    }

    // Add mouse event listeners
    canvas.addEventListener("click", function (event) {
        var x = event.clientX - canvas.getBoundingClientRect().left;
        var y = event.clientY - canvas.getBoundingClientRect().top;

        // Check which image was clicked
        for (var obj of imgArray) {
        if (
            x >= obj.x &&
            x <= obj.x + obj.width &&
            y >= obj.y &&
            y <= obj.y + obj.height
        ) {
            // Redirect to the corresponding link
            window.location.href = obj.link;
        }
        };
    });

    canvas.addEventListener("mousemove", function (event) {
        var x = event.clientX - canvas.getBoundingClientRect().left;
        var y = event.clientY - canvas.getBoundingClientRect().top;

        // Check which image is being hovered over
        var isImageSelected = false;
        for (var obj of imgArray) {
            if (
                x >= obj.x &&
                x <= obj.x + obj.width &&
                y >= obj.y &&
                y <= obj.y + obj.height
            ) {
                // Highlight the image with an outline
                canvas.style.cursor = "pointer";
                reloadImages(obj);
                isImageSelected = true;
            }
        };
        if (!isImageSelected) reloadImages();
    });

    canvas.addEventListener("mouseout", function () {
        // Clear the canvas and load images without outlines
        canvas.style.cursor = "default";
        reloadImages();
    });
});