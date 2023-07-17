var light = document.getElementById('light');
var lightSize = light.style.getPropertyValue("width");
document.documentElement.addEventListener("mousemove", handleMouseMove);
document.documentElement.addEventListener("mouseover", handleMouseMove);

function handleMouseMove(event) {
    light.style.setProperty('--light-position-y', (event.pageY - 20) + 'px');
    light.style.setProperty('--light-position-x', (event.pageX - 20) + 'px');
};