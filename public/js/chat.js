// var socket = io('http://localhost:3000/');
var socket = io('https://chatchap.herokuapp.com/');
var form = document.getElementById('send-container');
var messageInput = document.getElementById('messageInp');
var messageContainer = document.querySelector('.container');

var audio = new Audio('smstone.mp3');

var append = (message , position) =>{
var messageElement = document.createElement('div');
messageElement.innerHTML = message;
messageElement.classList.add('message');
messageElement.classList.add(position);
messageContainer.append(messageElement);
if(position == 'left'){
    audio.play();

}
}

var nname = prompt("enter your name  to join");
socket.emit('new-user-joined'  , nname);

socket.on('user-joined' , nname =>{
    append(`${nname} joined the chat` , 'left')
})

socket.on('receive' ,data =>{
    append(`${data.nname} : ${data.message}` ,'left');
});

socket.on('left' ,nname  =>{
    append(`${nname} left the chat` ,'left');
});


form.addEventListener('submit' , (e)=>{
e.preventDefault();
var message  = messageInput.value;
append(`You : ${message}` , 'right');
socket.emit('send'  ,message);
messageInput.value = '';
});
