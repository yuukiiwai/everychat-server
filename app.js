var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const PORT = process.env.PORT || 7000;
let roomId = '';

app.set("view engine","ejs");

app.get('/',function(req,res){
    roomId = req.query.c;
    data = {code:req.query.c};
    console.log(roomId); //-> undefined or code
    console.log(typeof(data));
    if(data.code === undefined){
        res.sendFile(__dirname + '/index.html');
    }else{
        res.render(__dirname + '/index.ejs',data);
    }
});

http.listen(PORT,function(){
    console.log('server listening. Port:'+PORT);
});

io.on('connection',function(socket){
    if(roomId !== ''){
        socket.join(roomId);
    }
    socket.on('message',function(msg){
        console.log('message:'+msg);
        console.log('id:'+roomId);
        io.to(roomId).emit('message',msg);
    });

    socket.on('join2room',(data) => {
        roomId = data;
        socket.join(roomId);
        console.log('join:'+roomId);
    });
});