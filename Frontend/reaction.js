const emojiSpawnRate = 100; // 150 ms

var socket = io();
var lastMove = 0;
var idToCursorMap = {};
var mouseDownInterval = null;

var mousePositionX = 0;
var mousePositionY = 0;
var mouseEmojiStr = null;

// DOM Event Listeners
document.addEventListener('mousemove', function(e){
    mousePositionX = e.pageX;
    mousePositionY = e.pageY;
    // Only update position every 40 ms
    if(Date.now() - lastMove > 40) {
        lastMove = Date.now();
        socket.emit('mouse position', {x: mousePositionX, y: mousePositionY});
    } 
})

document.addEventListener('mousedown', function(e){
    mousePositionX = e.pageX;
    mousePositionY = e.pageY;

    // Every time mouse down is pressed down again randomly select new emoji
    mouseEmojiStr = Emoji.getRandomEmojiString();
    socket.emit('mouse down', {x: mousePositionX, y: mousePositionY, mouseEmojiStr: mouseEmojiStr});
    // Prevent multiple being fired at once
    if (mouseDownInterval === null) {
        mouseDownInterval = setInterval(spawnEmoji, emojiSpawnRate);
    }
})

document.addEventListener('mouseup', function(e){
    mousePositionX = e.pageX;
    mousePositionY = e.pageY;

    socket.emit('mouse up');
    // Prevent call on null
    if (mouseDownInterval !== null) {
        clearInterval(mouseDownInterval);
        mouseDownInterval = null;
    }
})

// Socket Listener
socket.on('other mouse position', function(mousePosition) {
    if (!idToCursorMap.hasOwnProperty(mousePosition.id)) {
        idToCursorMap[mousePosition.id] = new Cursor(mousePosition.x, mousePosition.y);
    } else {
        idToCursorMap[mousePosition.id].updateCursorPosition(mousePosition.x, mousePosition.y);
    }
});

socket.on('other mouse up', function(id) {
    if (!idToCursorMap.hasOwnProperty(id)) {
        return;
    }

    idToCursorMap[id].setToMouseUp();
});

socket.on('other mouse down', function({id, x, y, newEmojiStr}) {
    if (!idToCursorMap.hasOwnProperty(id)) {
        idToCursorMap[id] = new Cursor(x, y);
    }

    idToCursorMap[id].setToMouseDown(newEmojiStr);
});

socket.on('user disconnected', function(id) {
    if (idToCursorMap.hasOwnProperty(id)) {
        const cursor = idToCursorMap[id];
        cursor.remove();
        delete idToCursorMap[id];
    }
});

function spawnEmoji() {
    const newEmoji = new Emoji(mouseEmojiStr ,mousePositionX, mousePositionY);
    newEmoji.createAndStartAnimation();
}