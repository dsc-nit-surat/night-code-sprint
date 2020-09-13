var socket;
var current;
var colornew='magenta';
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
  
    var crap = createCanvas(400,400);
    crap.position(0,60);
    background(51);
    //server connected
    socket=io.connect('http://localhost:3000')
    socket.on('mouse',newDrawing);
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

  