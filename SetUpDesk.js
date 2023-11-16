
const percentageEmptySpace = 0.5;
const canvasSizePercentage = 0.8; //80% of the page
const maxIterations = 100;

window.onload = initialize;
window.onresize = initialize;

function initialize(){
    //init canvas
    /**@type {HTMLElement} */ var canvas = document.getElementById("desk-canvas");
    var body = canvas.parentElement;
    var margin = Math.min(body.offsetHeight, body.offsetWidth) * (1 - canvasSizePercentage);
    console.log("h: "+canvas.height+", margin: "+margin);
    canvas.width = body.offsetWidth - margin;
    canvas.height = body.offsetHeight - margin;

    //add images
    var imgArray = getImages();
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
        document.body.style.background.transform = "rotate(90deg)";

    }
}


function getImages() {
    var imageInfoArray = [
        { width : 6, height : 6, className : "palette" },
        { width : 4, height : 4, className : "LuckyTower" },
        { width : 4, height : 4, className : "MoonWaltz" },
        { width : 4, height : 4, className : "EscapingHell" },
        { width : 4, height : 4, className : "Phone" },
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
    function getDirections(pos1, pos2) {
        var dir = Math.sign(pos1 - pos2);
        return dir;
    }
    function moveObj(obj, xDirection, yDirection) {
        var newX = obj.x + xDirection * moveAmount;
        if (newX < 0 || newX > canvas.width - obj.width) newX = obj.x;
        var newY = obj.y + yDirection * moveAmount;
        if (newY < 0 || newY > canvas.height - obj.height) newY = obj.y;
        obj.x = newX;
        obj.y = newY;
    }
}