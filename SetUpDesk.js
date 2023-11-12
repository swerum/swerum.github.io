
const percentageEmptySpace = 0.6;

window.onload = function(){
    //init canvas
    /**@type {HTMLElement} */ var canvas = document.getElementById("desk-canvas");
    var body = canvas.parentElement;
    // console.log(body.width());
    canvas.width = body.offsetWidth;
    canvas.height = body.offsetHeight;

    //add images
    var imgArray = getImages();
    imgArray = setSizes(imgArray);
    // simulateDistribution(imgArray);
    updateFrame();

    function updateFrame() {
        // console.log("update frame");
        requestAnimationFrame(updateFrame);
        simulateDistribution(imgArray);
    }
};

//
console.log("TESTING ----------------------------");
testPressure(10, 0);
testPressure(10, 2);
testPressure(10, 9);
testPressure(10, 20);
function testPressure(radius, dist) {
    var pressure =  pressureFunction(radius, dist);
    console.log("for radius "+radius+" and dist "+dist+" , the pressure is "+pressure);
}


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
    imgArray.forEach(obj => {
        /**@type {HTMLImageElement} */ var img = obj.img;
        ctx.drawImage(img, obj.x, obj.y, obj.width, obj.height); //not really needed here yet
    });
    //move
    for (let i = 0; i < imgArray.length; i++) {
        const target = imgArray[i];
        //add a vector for each img
        var vec = calculatePressureVector(target, imgArray);
        if (target.x + vec.x > 0 && target.x + vec.x + target.width < canvas.width) {
            target.x += vec.x;
        }
        // if (target.y + vec.y > 0 && target.y + vec.y + target.height < canvas.height) {
        //     target.y += vec.y;
        // }
    }

    //redraw the items to their new positions
    // imgArray.forEach(obj => {
    //     /**@type {HTMLImageElement} */ var img = obj.img;
    //     ctx.drawImage(img, obj.x, obj.y, obj.width, obj.height); //not really needed here yet
    // });

    function calculatePressureVector(target, imgArray) {
        var vec = { x: 0, y : 0};
        //add up pressure from each other image on screen
        for (let j = 0; j < imgArray.length; j++) {
            const source = imgArray[j];
            if (target == source) continue;
            var dir = getPressureFromImg(target, source);
            // getPressureFromImg(target, source);
            vec.x += dir.x;
            vec.y += dir.y;
        }
        vec.x = vec.x * moveAmount;
        vec.y = vec.y * moveAmount;
        // console.log(target.img.alt+" should move in direction "+vec.x+", "+vec.y);
        // const threshhold = 0.2;
        // if (vec.x < threshhold) { vec.x = 0; }
        // if (vec.y < threshhold) { vec.y = 0; }
        if (vec.x) { console.log(target.img.alt+": "+vec.x); }
        return vec;
    }

    function getPressureFromImg(target, source) { //source enacts pressure on target
        var distance = {
            x : (target.x + target.width/2) - (source.x + source.width / 2),
            y : (target.y + target.height/2) - (source.y + source.height / 2)
        };
        var pressure = {
            x : Math.sign(distance.x) * pressureFunction(source.width, Math.abs(distance.x)),
            y : Math.sign(distance.y) * pressureFunction(source.height, Math.abs(distance.y)),
        };
        return pressure;
    }
}

function pressureFunction(radius, dist) {
    return Math.max(0, 1.0 - dist*dist/(radius*radius));
}