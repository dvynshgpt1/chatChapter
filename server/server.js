const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
    const publicPath = path.join(__dirname, '../public');
    app.use(express.static(publicPath));
}

const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// Heroku won't actually allow us to use WebSockets
// so we have to setup polling instead.
// https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
 
 
 

var users = {}; 
io.on('connection', socket => {     
    socket.on('new-user-joined', nname => {
        users[socket.id] = nname;  
        socket.broadcast.emit('user-joined', nname);
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, nname: users[socket.id] });
    });

    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });

});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});