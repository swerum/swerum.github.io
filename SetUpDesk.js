
const percentageEmptySpace = 0.5;
const canvasSizePercentage = 0.9; //80% of the page
const maxIterations = 300;

window.onload = initialize;
window.onresize = initialize;

var imgArray;
var ctx;

var links = {
    "palette"       : "HTML/Portfolio.html",
    "Seufz"         : "HTML/Seufz.html",
    "EscapingHell"  : "HTML/EscapingHell.html",
    "Phone"         : "HTML/Snapchat.html",       
    "Blender"       : "https://www.blender.org/",
    "C#"            : "https://learn.microsoft.com/en-us/dotnet/csharp/",
    "Figma"         : "https://www.figma.com/",
    "GameMaker"     : "https://gamemaker.io/en",
    "Github"        : "https://github.com/",
    "Java"          : "https://www.java.com/en/",
    "JS"            : "https://www.javascript.com/",
    "LensStudio"    : "https://ar.snap.com/lens-studio",
    "Phaser"        : "https://phaser.io/",
    "Photoshop"     : "https://www.adobe.com/products/photoshop.html",
    "Steam"         : "https://partner.steamgames.com/doc/sdk",
    "Unity"         : "https://unity.com/",
};

function initialize(){
    //init canvas
    /**@type {HTMLElement} */ var canvas = document.getElementById("desk-canvas");
    var body = canvas.parentElement;
    var margin = Math.min(body.offsetHeight, body.offsetWidth) * (1 - canvasSizePercentage);
    // console.log("h: "+canvas.height+", margin: "+margin);
    canvas.width = body.offsetWidth - margin;
    canvas.height = body.offsetHeight - margin;

    //add images
    imgArray = getImages();
    imgArray = setSizes(imgArray);
    simulateDistribution(imgArray);
    setBackgroundImage(canvas);
};

function setBackgroundImage(canvas) {
    document.body.style.backgroundImage = "url('Images/Desk\ Visuals/desk.png')";
    if (canvas.width > canvas.height) {
        //wide or landscape
    } else {
        //tall or portrait mode
        // document.body.style.background-size = ""+canvas.height+"px "+canvas.width+"px";
        console.log("portrait");
        // document.body.style.backgroundImage.
        document.body.style.background.transform = "rotate(90deg)";

    }
}


function getImages() {
    var imageInfoArray = [
        { width : 6, height : 6, className : "palette" },
        { width : 6, height : 4, className : "Seufz" },
        { width : 3, height : 4, className : "EscapingHell" },
        { width : 4, height : 6, className : "Phone" },
    ];
    //using img tag, get all images and store them in images array
    var imgArray = [];
    var imagesOnDocument = document.getElementsByTagName ("img");
    for (let j = 0; j < imagesOnDocument.length; j++) {
        const image = imagesOnDocument[j];
        var obj = { img : image, width : 1, height: 1, link : links[image.className]};
        for (let i = 0; i < imageInfoArray.length; i++) {
            const imageInfo = imageInfoArray[i];
            if (image.className === imageInfo.className) {
                obj.width = imageInfo.width;
                obj.height = imageInfo.height;
                console.log(obj.img.src);
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
    // console.log(canvas);
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
        obj.x = Math.random() * (canvas.width - obj.width)
        obj.y = Math.random() * (canvas.height - obj.height);
     });
    return imgArray;
}

function simulateDistribution(imgArray) {
    const canvas = document.getElementById("desk-canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const moveAmount = 5;
    // console.log("simulate distribution");
    //check for overlap of the images (assuming square bounding box) 
    // while there is overlap, move the images away from each other like a fluid simulation
    // var hasMoved = true;
    for (let i = 0; i < maxIterations; i++) {
        var hasMoved = false;
        for (let i = 0; i < imgArray.length; i++) {
            for (let j = 0; j < imgArray.length; j++) {
                if (i === j) continue;
                const obj1 = imgArray[i];
                const obj2 = imgArray[j];
                if (overlap(obj1, obj2)) {
                    hasMoved = true;
                    // console.log("overlap");
                    var xDirection = getDirections(obj1.x , obj2.x);
                    var yDirection = getDirections(obj1.y , obj2.y);
                    moveObj(obj1, xDirection, yDirection);
                    moveObj(obj2, -xDirection, -yDirection);
                }
            }
        }
        if (!hasMoved) break;
    }

    //redraw the items to their new positions
    drawDeskItems(ctx);
    

    function overlap(obj1, obj2) {
        var overlapX = overlap_oneDimenal(obj1.x, obj1.width, obj2.x, obj2.width);
        var overlapY = overlap_oneDimenal(obj1.y, obj1.height, obj2.y, obj2.height);
        return overlapX && overlapY;

        //positions are at the top left corner of the image
        function overlap_oneDimenal(pos1, size1, pos2, size2) {
            var margin = 5;
            if (pos1 > pos2-margin && pos1 < pos2 + size2 + margin) return true;
            if (pos2 > pos1-margin && pos2 < pos1 + size1 + margin) return true;
            return false;
        }
    }
    function getDirections(pos1, pos2) {
        var dir = Math.sign(pos1 - pos2);
        return dir;
    }
    function moveObj(obj, xDirection, yDirection) {
        var margins = 35;
        var newX = obj.x + xDirection * moveAmount;
        if (newX < margins || newX > canvas.width - obj.width - margins) newX = obj.x;
        var newY = obj.y + yDirection * moveAmount;
        if (newY < margins || newY > canvas.height - obj.height-margins) newY = obj.y;
        obj.x = newX;
        obj.y = newY;
    }
}

function drawDeskItems(ctx, selectedImage) {
    imgArray.forEach(obj => {
        /**@type {HTMLImageElement} */ var img = obj.img;
        var sizeIncrease = (obj === selectedImage) ? 6 : 0;
        ctx.drawImage(img, obj.x-sizeIncrease/2, obj.y-sizeIncrease/2, obj.width+sizeIncrease, obj.height+sizeIncrease); //not really needed here yet
    });
}

function drawImageOutline(ctx, canvas, obj) {
    var dArr = [
        [ -1,-1, ],
        [ 0,-1, ],
        [ 1,-1, ],
        [ -1,0, ],
        [ 1,0, ],
        [ -1,1, ],
        [ 0,1, ],
        [ 1,1]
    ]; // offset array
    var outlineStrength = 7;  // thickness scale
    
    // draw images at offsets from the array scaled by s
    for(var i = 0; i < dArr.length; i ++) {
        var x = obj.x + dArr[i][0]*outlineStrength;
        var y = obj.y + dArr[i][1]*outlineStrength;
        ctx.drawImage(obj.img, x, y, obj.width, obj.height);
    }
    // fill with color
    ctx.globalCompositeOperation = "source-in";
    ctx.fillStyle = "#5d4a4092";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    
    // draw original image in normal mode
    ctx.globalCompositeOperation = "source-over";
}