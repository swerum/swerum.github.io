
//first color is darker, second is lighter
var colors = {
    yellowDropshadow :  ['#c6c600', '#ffff49'],
    smallYellow:  ['#808000', '#ffff22'],
    studioMagenta: ['#9000aa', '#d902ff'],
    lightPurple :['#9551bf', '#cb77ff'],
    blueDropshadow: ['#365898', '#5d95ff'],
    orangeDropshadow: ['#af5d00', '#ff873c'],
    pinkDropshadow: ['#552c36', '#951f3c'],
    greenDropshadow: ['#58a158', '#40eb40'],
    whiteDropshadow: ['#747474', '#cfcfcf'],
    jsYellow :  ['#9f8e10', '#ecd32f'],
    strongerBlue: ['#4166ad', '#87b1ff'],
    grey: ['#747474', '#8b8b8b'],
    darkRed: ['#8e000e', '#951f3c'],
    lightRed: ['#5d0d15'],
}

var figureImages = document.getElementsByTagName("img");
for (var i = 0; i < figureImages.length;i++) {
    var img = figureImages[i];
    addGlow(img);
    var grandParent = img.parentElement.parentElement;
    if (img.parentElement.tagName === "A" || (grandParent && grandParent.tagName === "A")) {
        addHoverGlow(img);
    }
}

function addGlow(img) {
    var classesString = img.parentElement.className;
    var color = getDropshadowColor(classesString);
    addDropshadow(img, color[0]);
}

function addHoverGlow(img) {
    img.addEventListener("mouseover", function(e) {
        var image = e.toElement;
        var color = getDropshadowColor(image.parentElement.className);
        addDropshadow(image, color[1], 20);
    });
    img.addEventListener("mouseleave", function(e) {
        var image = e.target;
        var color = getDropshadowColor(image.parentElement.className);
        addDropshadow(image, color[0]);
    });
}

function addDropshadow(element, color, size=10) {
    var filterArgument = "drop-shadow(0px 0px "+size+"px "+color+")";
    var styleString = "filter: "+filterArgument;
    if (element.width < 120) {
        styleString += " "+filterArgument;
    }
    element.setAttribute("style", styleString+";");
}

function getDropshadowColor(classesString) {
    var defaultColor = [getComputedStyle(document.documentElement).getPropertyValue('--defaultDropshadow')];
    // defaultColor = [defaultColor, defaultColor];
    // console.log(defaultColor);
    if (!classesString) return defaultColor;
    var classes = classesString.split(" ");
    for (var i = 0; i < classes.length; i ++) {
        var className = classes[i];
        var color = colors[className];
        if (color) {
            return color;
        }
    }
    return defaultColor;
}


//-------------- special case: steam icon -------------
addSteamIconGlow();
function addSteamIconGlow() {
    var steamIcon = document.getElementById("steam-icon");
    if (!steamIcon) return; 
    var appIcon = getImageChild(steamIcon.parentElement);
    if (!appIcon) return;
    var colors = getDropshadowColor(steamIcon.parentElement.className);
    steamIcon.addEventListener("mouseover", function(e) {
        addDropshadow(appIcon, colors[1], 20);
    });
    steamIcon.addEventListener("mouseleave", function(e) {
        addDropshadow(appIcon, colors[0]);
    });

    function getImageChild(parent) {
        for (var i = 0; i < parent.childNodes.length; i++) {
            // console.log(parent.childNodes[i]);
            if (parent.childNodes[i].tagName == "IMG") {
                return parent.childNodes[i];
            }        
        }
        return null;
    }
}
