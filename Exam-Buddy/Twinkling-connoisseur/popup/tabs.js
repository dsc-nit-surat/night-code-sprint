var tabs_listening = document.getElementById("tabs_listening");
// console.log(tabs_listening)
var tabs_main_content = document.getElementById("tabs_main_content");

var home_display = document.getElementById("home_display");
var controls_display = document.getElementById("controls_display");
var settings_display = document.getElementById("settings_display");

home_display.style.display = "flex";
controls_display.style.display = "none";
settings_display.style.display = "none";

function setTab(num) {
    switch (num) {
        case 1:
            home_display.style.display = "flex";
            controls_display.style.display = "none";
            settings_display.style.display = "none";
            break;
        case 2:
            home_display.style.display = "none";
            controls_display.style.display = "block";
            settings_display.style.display = "none";
            break;
        case 3:
            home_display.style.display = "none";
            controls_display.style.display = "none";
            settings_display.style.display = "block";
            break;

    }
}
tabs_listening.addEventListener("click", (event) => {
    switch (event.path[2].getAttribute("value")) {
        case "home":
            setTab(1);
            console.log("Home");
            break;
        case "controls":
            setTab(2);
            console.log("Controls");
            break;
        case "settings":
            setTab(3);
            console.log("Settings");
            break;
        default:
            console.log("Default Value");
            break;
    }
})