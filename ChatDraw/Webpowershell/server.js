const express = require('express');
const socket = require('socket.io');
const formatmessage=require('./utils/messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers}=require('./utils/users');

const Port=4000||process.env.PORT;
// App setup
const app = express();


const server = app.listen(Port, function(){
    console.log(`listening for requests on port ${Port}`);
});
// Static files
app.use(express.static('public'));

const userbot='UserBot';
// Socket setup & pass server
const io = socket(server);
io.on('connection', (socket) => {

//Join the  Room
socket.on('joinRoom',({username,room})=>{
  
    const user=userJoin(socket.id,username,room)
    //By using socket method to join
    socket.join(user.room);
    
  

    //welcome user 
     socket.emit('message',formatmessage(userbot,`We Welcome You to ChatBox ${user.username}`));
    
    //Handle when user joined
    //emit to specfic room users 
    socket.broadcast
    .to(user.room)
    .emit('message',formatmessage(userbot,`${username} has joined the Chat Room`));
    
    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
});
   
       console.log('made socket connection', socket.id);
    //Listen Events
    socket.on('chatMessage',(msg)=>{
       
        const user=getCurrentUser(socket.id);
        
       io.emit('message',formatmessage(user.username,msg));
      
    })
    //Handle disconnect of user
    socket.on('disconnect',()=>{
        const user=userLeave(socket.id);
        if(user){
        io.to(user.room).emit('message',formatmessage(userbot,`A ${user.username} has left the Chat Room`));
        
            // Send users and room info
        io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
        });
        
     }
  })
  
     //socket.on('mouse',(data)=>{
   //      console.log(data);
    //     socket.broadcast.emit('mouse',data);
    // });

    
   
});

//////////////////////////////////////////////////////////////////
io.sockets.on('connection',newConnection);

function newConnection(socket){
    console.log("we have anew client"+socket.id);
    socket.on('mouse',mouseMsg);

    function mouseMsg(data){
        console.log(data);
        socket.broadcast.emit('mouse',data);
        
    }
}





