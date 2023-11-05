
const percentageEmptySpace = 0.4;

//ISSUE: Canvas resizes via css so if it's rectangular, it will squinch all the images in it. 
// a 10x10 imge in a 20x10 canvas will be rectangular! --> thanks, i hate it.
$(document).ready(function() {
    /**@type {HTMLElement} */ var canvas = document.getElementById("desk-canvas");
    var body = canvas.parentElement;
    // console.log(body.width());
    canvas.width = body.offsetWidth;
    canvas.height = body.offsetHeight;
});

window.onload = function(){
    var imgArray = getImages();
    imgArray = setSizes(imgArray);
    simulateDistribution(imgArray);
};


function getImages() {
    var imageInfoArray = [
        { width : 3, height : 3, className : "palette" },
        { width : 2, height : 2, className : "LuckyTower" },
        { width : 2, height : 2, className : "MoonWaltz" },
        { width : 2, height : 2, className : "EscapingHell" },
        { width : 2, height : 3, className : "Phone" },
    ];
    //using img tag, get all images and store them in images array
    var imgArray = [];
    var imagesOnDocument = document.getElementsByTagName ("img");
    for (let j = 0; j < imagesOnDocument.length; j++) {
        const image = imagesOnDocument[j];
        var obj = { img : image, width : 1, height: 1};
        for (let i = 0; i < imageInfoArray.length; i++) {
            const imageInfo = imageInfoArray[i];
            if (image.className === imageInfo.className) {
                obj.width = imageInfo.width;
                obj.height = imageInfo.height;
                imageInfoArray.splice(i, 1);
                break;
            }
        };
        imgArray.push(obj);
    };
    return imgArray;
}
function setSizes(imgArray) {
    // and set their width and height using imageInfo. default ratio is 1:1
    //get desk ratio
    var canvas = document.getElementById("desk-canvas");
    console.log(canvas);
    var deskArea = canvas.width * canvas.height;

    //add up sum of desk items
    var sum = 0;
    imgArray.forEach(obj => {
        var area = obj.height * obj.width;
        sum += area;
    });
    //add empty space to sum
    sum = sum/(1-percentageEmptySpace);
    var gridSize = Math.sqrt(deskArea / sum);

    //dray to screen
    /**@type {CanvasRenderingContext2DSettings} */ const ctx = canvas.getContext("2d");
    imgArray.forEach(obj => {
        /**@type {HTMLImageElement} */ var img = obj.img;
        var ratio = img.width /img.height;
        obj.height = obj.height * gridSize;
        obj.width = obj.height  * ratio;
        // console.log(Math.random)
        obj.x = Math.random() * (canvas.width - obj.width)
        obj.y = Math.random() * (canvas.height - obj.height);
        console.log(obj.img.alt+": "+obj.x+", "+obj.y);
        // ctx.drawImage(img, obj.x, obj.y, obj.width, obj.height); //not really needed here yet
    });
    return imgArray;
}

function simulateDistribution(imgArray) {
    const canvas = document.getElementById("desk-canvas");
    const ctx = canvas.getContext("2d");
    const moveAmount = 5;
    console.log("simulate distribution");
    //check for overlap of the images (assuming square bounding box) 
    // while there is overlap, move the images away from each other like a fluid simulation
    var counter = 0;
    while (true) {
        var hasMoved = false;
        for (let i = 0; i < imgArray.length; i++) {
            for (let j = 0; j < imgArray.length; j++) {
                if (i === j) continue;
                const obj1 = imgArray[i];
                const obj2 = imgArray[j];
                if (overlap(obj1, obj2)) {
                    // console.log("overlap");
                    obj1.x = getNewPos(obj1.x, canvas.width);
                    obj1.y = getNewPos(obj1.y, canvas.height);
                    hasMoved = true;
                }
            }
        }
        counter ++;
        if (counter > 9) break;
    }

    //redraw the items to their new positions
    imgArray.forEach(obj => {
        /**@type {HTMLImageElement} */ var img = obj.img;
        ctx.drawImage(img, obj.x, obj.y, obj.width, obj.height); //not really needed here yet
    });
    

    function overlap(obj1, obj2) {
        var overlapX = overlap_oneDimenal(obj1.x, obj1.width, obj2.x, obj2.width);
        var overlapY = overlap_oneDimenal(obj1.y, obj1.height, obj2.y, obj2.height);
        return overlapX && overlapY;

        //positions are at the top left corner of the image
        function overlap_oneDimenal(pos1, size1, pos2, size2) {
            if (pos1 > pos2 && pos1 < pos2 + size2) return true;
            if (pos2 > pos1 && pos2 < pos1 + size1) return true;
            return false;
        }
    }

    function getNewPos(coord, canvasSize) {
        var direction;
        if (coord < moveAmount) { direction = 1; }
        else if (coord > canvasSize - moveAmount) { direction = -1; }
        else { direction = Math.ceil(Math.random() -0.5); }
        return coord +direction *moveAmount;
    }
}