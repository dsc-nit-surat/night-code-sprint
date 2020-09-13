window.rt = chrome;
console.log(chrome);
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.msg === "something_completed") {
            //  To do something
            console.log(request.data.subject)
            console.log(request.data.content)
        }
    }
);

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.msg === "FORMS_DETECTED") {
        
        let Current_Test_Name = document.getElementById('Current_Test_Name');
        Current_Test_Name.style.display = "block";
        let Title = document.getElementById("Form_Name");
        Title.innerText = req.data.Questions.QuestionPaperName;
        console.log("Google Forms Detected")
        console.log(req)
        let Old_Results= document.getElementById('Old_Results');
        Old_Results.innerHTML = ""
        let Storage = JSON.parse(req.data.Storage);
        // Storage.
        console.log(Storage)
        if(Storage){
            Storage.forEach((element,index) => {
                Old_Results.innerHTML = Old_Results.innerHTML + `<tr>
                    <td>`+(index+1)+`</td> <td>`+element.QuestionPaperName+`</td>
                    <td>`+ element.Organisation +`</td><td>
                        <button class='button is-info'>&#10003;</button><button class='button is-danger'>&times;</button>
                    </td>
                </tr>`
            });
        }
    }
})
console.log(chrome)


// --------------------------------------------------------------------------------------------------------------

// // js for buttons and input
// var startButton = document.createElement("button");
// var inputMinutes = document.createElement("input");
// startButton.appendChild(document.createTextNode("startCountdown"));
// document.body.appendChild(startButton);
// document.body.appendChild(inputMinutes);
// startButton.style.position = "absolute"
// startButton.style.borderRadius = "15px"
// startButton.style.color = "white"
// startButton.style.fontSize = "25px"
// startButton.style.backgroundColor = "green"
// startButton.style.padding = "15px"
// inputMinutes.style.position = "absolute"
// inputMinutes.style.top = "23px"
// inputMinutes.style.padding = "15px"
// inputMinutes.style.fontSize = "25px"
// inputMinutes.style.borderRadius = "15px"
// inputMinutes.style.width = "150px"
// inputMinutes.style.right = "230px"
// startButton.style.top = "23px"
// startButton.style.right = "15px"
// startButton.setAttribute("value", "Start Countdown");
// inputMinutes.setAttribute("type", "text");
// inputMinutes.setAttribute("id","minutes"); 
// var a= document.createElement("div")
// a.innerHTML = "<div id='container'><div id='inputArea'></div><h1 id='time'>0:00</h1></div>"
// document.body.appendChild(a)
// a.style.position = "absolute"
// a.style.top = "90px"
// a.style.right = "144px"
// a.style.fontSize = "34px"



// // code for just testing purpose
// let button = document.querySelector("button");
// button.addEventListener("click", () => {
//     console.log("Button clicked.");
//     var z = document.createElement('p'); // is a node
//     z.style.position = "absolute";
//     z.style.top = "56px";
//     z.innerHTML = 'coming here now';
//     document.body.appendChild(z);
// console.log(localStorage.getItem("LOCAL_STORE"))
function popup() {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "GET_TESTS"});
   });
}

document.addEventListener("DOMContentLoaded", function() {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "GET_TESTS"});
       });
  document.getElementById("button1").addEventListener("click", popup);
  document.getElementById("button2").addEventListener("click",()=>{
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "STORE_THIS_STATE"});
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {"message": "GET_TESTS"});
           });
       });
  })
});


// // functions are here
// var secondsRemaining;
// var intervalHandle;
// function resetPage() {
//     document.getElementById("inputArea").style.display = "block";
// }
// function tick() {
//     // grab the h1
//     var timeDisplay = document.getElementById("time");

//     // turn the seconds into mm:ss
//     var min = Math.floor(secondsRemaining / 60);
//     var sec = secondsRemaining - (min * 60);

//     //add a leading zero (as a string value) if seconds less than 10
//     if (sec < 10) {
//         sec = "0" + sec;
//     }

//     // concatenate with colon
//     var message = min.toString() + ":" + sec;

//     // now change the display
//     timeDisplay.innerHTML = message;

//     // stop is down to zero
//     if (secondsRemaining === 0) {
//         alert("Done!");
//         clearInterval(intervalHandle);
//         resetPage();
//     }

//     //subtract from seconds remaining
//     secondsRemaining--;

// }
// function startCountdown() {

//     function resetPage() {
//         document.getElementById("inputArea").style.display = "block";
//     }

//     // get countents of the "minutes" text box
//     var minutes = document.getElementById("minutes").value;

//     // check if not a number
//     if (isNaN(minutes)) {
//         alert("Please enter a number");
//         return; // stops function if true
//     }

//     // how many seconds
//     secondsRemaining = minutes * 60;

//     //every second, call the "tick" function
//     // have to make it into a variable so that you can stop the interval later!!!
//     intervalHandle = setInterval(tick, 1000);

//     // hide the form
//     document.getElementById("inputArea").style.display = "none";


// }
// let button = document.querySelector("button");
// button.addEventListener("click", () => {
//     console.log("Button clicked.");
//      startCountdown();
// });

