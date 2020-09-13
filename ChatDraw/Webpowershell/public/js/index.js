// 
// 
// 
var socket;
var current;
var colornew='magenta';
var crap;

$(document).ready(function () {
    $('.nav-link').on('click', function(e) {
         current=e.currentTarget.innerHTML.split(' ')[0];
         console.log(current);
    });
 }); 
 
    $('.dropdown-item').on('click', function(e) {
       colornew=e.target.innerHTML;
    });
 

function setup() {
  
    crap = createCanvas(770,550);
    crap.position(0,60);
    background(51);
    //server connected
    //socket=io.connect('http://localhost:3000')
    socket.on('mouse',newDrawing);
  }
  
function pdf(){
  var pdf = document.getElementById("zap");
  var zap2 = prompt("enter path");
  pdfjsLib.getDocument(zap2).promise.then((doc)=>{
    console.log(doc._pdfInfo.numPages);
    doc.getPage(1).then(page=>{
      
      var context = pdf.getContext("2d");
      var viewport = page.getViewport({scale:1}) 
      pdf.height = viewport.height;
      pdf.width = viewport.width;
     
      page.render({
        canvasContext : context,
        viewport : viewport
      })
    })
  })
}
    
  
  function newDrawing(data){
    let d=color(data.color);
    fill(d);

      if(data.current=="ELLIPSE")
      {
          noStroke();
        ellipse(data.x,data.y,36,36);
      }
      else if(data.current=="CLEAR")
      {
        erase();
        background(51);
      }
      else if(data.current=="LINE")
      {
        strokeWeight(5);
        stroke(d);
        line(data.x,data.y,data.p,data.q);
      }
      else if(data.current=="CIRCLE")
      {
        noStroke();
        circle(data.x,data.y,30);
      }
      else if(data.current=="RECTANGLE")
      {
        noStroke();
        rect(data.x,data.y,data.p,data.q);
      }
      
  
  }
  function mouseDragged()
  {
      c=color(colornew);
      fill(c);
      console.log('Sending'+mouseX+','+mouseY);
            var data1={
          x:mouseX,
          y:mouseY,
          p:pmouseX,
          q:pmouseY,
          current:current,
          color:colornew
      }
      var data2={
        x:mouseX,
        y:mouseY,
        current:current,
        color:colornew
      }
      var clear={
        current:current,
        color:colornew
      }
    
      if(current=="CLEAR")
      {
        socket.emit('mouse',clear);
          erase();
          background(51);
        }
      
   else if(current=="LINE")
   {
       stroke(c);
       strokeWeight(5);
       line(mouseX, mouseY, pmouseX, pmouseY);
       socket.emit('mouse',data1);
   }
   else if(current=="ELLIPSE")
   {
       noStroke();
    ellipse(mouseX,mouseY,36,36);
    socket.emit('mouse',data2);
   }
   else if(current=="CIRCLE")
   {
       noStroke();
       circle(mouseX,mouseY,30)
       socket.emit('mouse',data1);
   }
   else if(current=="RECTANGLE")
   {
       noStroke();
       rect(mouseX,mouseY,pmouseX,pmouseY)
       socket.emit('mouse',data1);
   }
   
  }

  


// Make connection
//to local an dmake it process.env.PORT to deploy
    var socket = io.connect('http://localhost:4000');
    
    
// Query DOM
const chatForm = document.getElementById('chat-form');
const chatMessages= document.querySelector('.chat-messages');
const date= document.getElementById('date');
const day= document.getElementById('day');
const roomName = document.getElementById('room-name');
const userList= document.getElementById('users');


//Getting username and room from URL
const {username,room}=Qs.parse(location.search,{
    //FROM URL
    ignoreQueryPrefix:true
});
console.log(username,room);
//Join Room
socket.emit('joinRoom',{username,room});

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

//Message From server
socket.on('message',message =>{
    console.log(message);
    outputMessage(message);

    //ScrollDown
    chatMessages.scrollTop=chatMessages.scrollHeight;
});
//message submit or emit events
chatForm.addEventListener('submit', e =>{
    e.preventDefault();
    //Get text 
    const msg=e.target.elements.msg.value;
    //Emit the msg to server
    socket.emit('chatMessage',msg);
    
    //clear input
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
});

//Output message to dom
function outputMessage(message) {
    //Create a Div
    const div=document.createElement('div');
    //Add class to it
     var d = new Date();
     var time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
     var date= d.toLocaleDateString('en-GB');
      date.innerText=date;
       var weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

     var day = weekday[d.getDay()];
     day.innerText=day;
       
    div.classList.add('message');
    div.innerHTML=`<h6>${day}</h6><p class="meta">${message.username} <span>${message.time}</span></p>
                <p class="text">
                  ${message.text}
                </p>`;
                //we append the div to the existsing div
                document.querySelector('.chat-messages').appendChild(div);

}
// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}