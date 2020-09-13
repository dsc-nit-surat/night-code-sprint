/* LOCAL STORAGE KEYS 
    paperSet - 
    
*/
class Paper {
    constructor(QuestionPaperName, QuestionPaperDescription, Organisation, URL) {
        this.QuestionPaperName = QuestionPaperName;
        this.QuestionPaperDescription = QuestionPaperDescription;
        this.Organisation = Organisation;
        this.URL = URL;
        this.time = new Date().getTime();   
    }
    QuestionsPaper = new Array();
    addQuestion = function(questionId, questionText, questionOptions) {
        this.QuestionsPaper.push({
            questionId,
            questionText,
            questionOptions,
            selectedOption:null
        })
    }

    storeToLocalStorage = function(updatedAnswer = null,position=null) {
        
        let Storage = localStorage.getItem("LOCAL_STORE");
        console.log(JSON.parse(Storage))
        // console.log(Storage,!Storage)
        if (!Storage) {
            Storage = "[]";
            console.log("ER")
        }
        if (Storage) {
            console.log("ER")
            Storage = JSON.parse(Storage);
            let isAlready = false;
            Storage.forEach((eachPaper,index)=>{
                if(eachPaper.QuestionPaperName == this.QuestionPaperName){
                    isAlready = true;
                    let lastSize = index+1;
                    Storage[lastSize-1].QuestionsPaper[position].selectedOption = updatedAnswer;
                    localStorage.setItem("LOCAL_STORE", JSON.stringify(Storage));
                    console.log("AFTER ALL RESULT ",Storage);
                }
            })
            if(!isAlready){
            let lastSize = Storage.push(this)
            Storage[lastSize-1].QuestionsPaper[position].selectedOption = updatedAnswer;
            localStorage.setItem("LOCAL_STORE", JSON.stringify(Storage));
            console.log("AFTER ALL RESULT ",Storage);
            }
        }
    }

    getFromLocalStorage = ()=>{
        let Storage = localStorage.getItem("LOCAL_STORE");
        return Storage;
    }

    selectOption = (questionWholeText,answerWholeText,imageWholeText = undefined)=>{
        let GotQuestion = false;
        console.log("ANSWER_WHOLE = "+answerWholeText)
        console.log(this.QuestionsPaper);
        this.QuestionsPaper.forEach((eachQuestion,index)=>{
            if(eachQuestion.questionText == questionWholeText){
                GotQuestion = true;
               console.log("Got the Question"+index) 
               // index - question No.
                this.QuestionsPaper[index].selectedOption = answerWholeText;
                // console.log()

                console.log(this,"%c Answer Saved"+answerWholeText,"{background:'teal',color:'white',fontSize:'32px'}")
                this.storeToLocalStorage(answerWholeText,index)
            }
        })

        
    }


}


// Below REGEX is to find on which URL to Execute internally, whether its MS Forms or Google Forms
/******************************************************************************************* */
var regexExpression = /(\/)/g;
var QuestionPaper = null;
var MakeQuestionPaper = () => {
    // console.log(window.document.body);


    eval(document.querySelectorAll("script")[3].innerHTML.toString());
    // console.log(document.querySelectorAll("script")[3].innerHTML.toString())
    // console.log();

    QuestionPaper = new Paper(FB_PUBLIC_LOAD_DATA_[1][8], FB_PUBLIC_LOAD_DATA_[1][0], FB_PUBLIC_LOAD_DATA_[12], window.location.href)

    FB_PUBLIC_LOAD_DATA_[1][1].forEach((question) => {
        // console.log(question)
        // let Temporary_Options = new Array()
        QuestionPaper.addQuestion(question[0], question[1], question[4]);
    })
    console.log("ENGLISH")
    let Storage = localStorage.getItem("LOCAL_STORE");
    chrome.runtime.sendMessage({
        msg: "FORMS_DETECTED",
        data: {
            formName: "Google Forms",
            Questions: QuestionPaper,
            Storage
        }
    });

}

var setQuestionsFromStorage = ()=>{
    let Storage = localStorage.getItem("LOCAL_STORE");
    if(!!Storage){
        Storage = JSON.parse(Storage);
        console.log(Storage)
        let QuestionsPaper = Storage[0].QuestionsPaper;
        QuestionsPaper.forEach((eachQuestion,index)=>{
            let isGot = false;
          if(eachQuestion.selectedOption){
            //   console.log(eachQuestion.selectedOption)
            // This is the filled answers

                document.querySelectorAll(".freebirdFormviewerViewNumberedItemContainer").forEach((eachEle,index)=>{
                    if(!isGot){
                        eachEle.querySelectorAll(".docssharedWizToggleLabeledLabelText").forEach((eachOption,optionIndex)=>{
                            // console.log(eachOption.innerText)
                            if(eachQuestion.selectedOption == eachOption.innerText){
                                isGot = true;
                                console.log("GOT THIS ONE")
                                eachOption.click();
                            }
                        })
                    }

                })

          }
        })
        
    }   
}

var nowExecuteMain = () => {


        MakeQuestionPaper();
        console.log(QuestionPaper)
        setQuestionsFromStorage();


    }
    /************************************************************************************************* */
if (window.location.href.split(regexExpression)[6] == "forms") {
    // Means it is Google Forms


    setTimeout(nowExecuteMain, 500)
}
document.body.addEventListener('click', () => {
    chrome.runtime.sendMessage({
        msg: "something_completed",
        data: {
            subject: "Loading",
            content: "Just completed!"
        }
    });
})


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.msg === "Popu") {
            //  To do something
            console.log(request.data.subject)
            console.log(request.data.content)
        }
    }
);


//// CONTENT REQUESTS
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "STORE_REQUEST" ) {
          QuestionPaper.storeToLocalStorage();
       start();
           }
    }
  );

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "GET_TESTS" ) {
          console.log("RECIEVED GET REQUEST")
        //   QuestionPaper.storeToLocalStorage();
      
            let Storage = localStorage.getItem("LOCAL_STORE");
            chrome.runtime.sendMessage({
            msg: "FORMS_DETECTED",
            data: {
               formName: "Google Forms",
               Questions: QuestionPaper,
               Storage:Storage
           }
       });
       ;
           }
    }
  );
  chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if( request.message === "STORE_THIS_STATE" ) {
            QuestionPaper.storeToLocalStorage();
            chrome.runtime.sendMessage({
                msg: "something_completed",
                data: {
                    subject: "Loading",
                    content: "Just completed!"
                }
            });
             }
      }
    );

  function start(){
      alert("started");
  }

// ------------------------------------------------------------------------------------------------------------------------------
// code for console is starting from here.

document.querySelectorAll(".freebirdFormviewerViewNumberedItemContainer").forEach(eachContainer=>{
    eachContainer.addEventListener("click",(event)=>{
            // console.log()
                // console.log(event.path)
            if(event.path[0].innerText != "")
            {
                let QuestionEle = eachContainer.querySelector(".freebirdFormviewerComponentsQuestionBaseTitle");
            
                let QuestionText = (QuestionEle.childNodes[0].wholeText);
                console.log("Option Value = ",event.path[0].innerText);
                let OptionText = event.path[0].innerText;


                QuestionPaper.selectOption(QuestionText,OptionText);

            }
       
    })
})

let autoSubmit = ()=>{

    alert("Going to Submit Now")
    let submitButton = document.querySelector(".appsMaterialWizButtonPaperbuttonLabel");
    submitButton.click();
}

// functions are here
var secondsRemaining;
var intervalHandle;
function resetPage() {
    document.getElementById("inputArea").style.display = "block";
}

let isEnd = false;
function tick() {
    // grab the h1
    var timeDisplay = document.getElementById("time");

    // turn the seconds into mm:ss
    var min = Math.floor(secondsRemaining / 60);
    var sec = secondsRemaining - (min * 60);

    //add a leading zero (as a string value) if seconds less than 10
    if (sec < 10) {
        sec = "0" + sec;
    }

    // concatenate with colon
    var message = min.toString() + ":" + sec;

    // now change the display
    timeDisplay.innerHTML = message;

    // stop is down to zero
    if (secondsRemaining === 0) {
        alert("Done!");
        clearInterval(intervalHandle);
        resetPage();
    }


    if((secondsRemaining <= 20) && (isEnd == false)){
        isEnd = true;
        autoSubmit()
    }

    //subtract from seconds remaining
    secondsRemaining--;

}
function startCountdown() {

    function resetPage() {
        document.getElementById("inputArea").style.display = "block";
    }

    // get countents of the "minutes" text box
    var minutes = document.getElementById("minutes").value;

    // check if not a number
    if (isNaN(minutes)) {
        alert("Please enter a number");
        return; // stops function if true
    }

    // how many seconds
    secondsRemaining = minutes * 60;

    //every second, call the "tick" function
    // have to make it into a variable so that you can stop the interval later!!!
    intervalHandle = setInterval(tick, 1000);

    // hide the form
    document.getElementById("inputArea").style.display = "none";


}


// js for buttons and input
var startButton = document.createElement("button");
startButton.id = "StartButton"
startButton.addEventListener("click", () => {
    console.log("Button clicked.");
     startCountdown();
});
var inputMinutes = document.createElement("input");
startButton.appendChild(document.createTextNode("startCountdown"));
document.body.appendChild(startButton);
document.body.appendChild(inputMinutes);
startButton.style.position = "absolute"
startButton.style.borderRadius = "15px"
startButton.style.color = "white"
startButton.style.fontSize = "25px"
startButton.style.backgroundColor = "green"
startButton.style.padding = "15px"
inputMinutes.style.position = "absolute"
inputMinutes.style.top = "23px"
inputMinutes.style.padding = "15px"
inputMinutes.style.fontSize = "25px"
inputMinutes.style.borderRadius = "15px"
inputMinutes.style.width = "150px"
inputMinutes.style.right = "230px"
startButton.style.top = "23px"
startButton.style.right = "15px"
startButton.setAttribute("value", "Start Countdown");
inputMinutes.setAttribute("type", "text");
inputMinutes.setAttribute("id","minutes"); 
var a= document.createElement("div")
a.innerHTML = "<div id='container'><div id='inputArea'></div><h1 id='time'>0:00</h1></div>"
document.body.appendChild(a)
a.style.position = "absolute"
a.style.top = "90px"
a.style.right = "144px"
a.style.fontSize = "34px"

