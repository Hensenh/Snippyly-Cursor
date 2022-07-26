const emojiSpawnRate = 150; // 150 ms

var socket = io();
var lastMove = 0;
var idToCursorMap = {};
var mouseDownInterval = null;

var mousePositionX = 0;
var mousePositionY = 0;
var mouseEmojiStr = null;
document.addEventListener('mousemove', function(e){
    mousePositionX = e.pageX;
    mousePositionY = e.pageY;
    if(Date.now() - lastMove > 40) {
        // Do stuff
        lastMove = Date.now();
        socket.emit('mouse position', {x: mousePositionX, y: mousePositionY});
    } 
})

document.addEventListener('mousedown', function(e){
    // Every time mouse down is pressed down again randomly select new emoji
    mouseEmojiStr = Emoji.getRandomEmojiString();
    socket.emit('mouse down', mouseEmojiStr);
    mouseDownInterval = setInterval(spawnEmoji, emojiSpawnRate)
})

function spawnEmoji() {
    const newEmoji = new Emoji(mouseEmojiStr ,mousePositionX, mousePositionY);
    newEmoji.createAndStartAnimation();
}

document.addEventListener('mouseup', function(e){
    socket.emit('mouse up');
    clearInterval(mouseDownInterval);
})

socket.on('other mouse position', function(mousePosition) {
    if (!idToCursorMap.hasOwnProperty(mousePosition.id) ) {
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

socket.on('other mouse down', function({id, newEmojiStr}) {
    if (!idToCursorMap.hasOwnProperty(id)) {
        return;
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

class Cursor {
    constructor(mousePositionX, mousePositionY) {
        this.mousePositionX = mousePositionX;
        this.mousePositionY = mousePositionY;
        this.mouseDownInterval = null;
        this.cursorElement = this.createCursorElement();
        this.updateCursorPosition(mousePositionX, mousePositionY)
    }

    createCursorElement() {
        var cursor = document.createElement('img');
        cursor.src = 'cursor.svg';
        cursor.width = 24;
        cursor.height = 24;
        cursor.style.position = 'absolute'
        cursor.style.userSelect = 'none';
        document.body.append(cursor);
        return cursor;
    }

    updateCursorPosition(mousePositionX, mousePositionY) {
        this.cursorElement.style.left = mousePositionX + 'px';
        this.cursorElement.style.top = mousePositionY + 'px';
        this.mousePositionX = mousePositionX;
        this.mousePositionY = mousePositionY;
    }

    setToMouseDown(newEmojiStr) {
        this.emojiStr = newEmojiStr;
        this.mouseDownInterval = setInterval(this.spawnEmoji.bind(this), emojiSpawnRate);
    }

    setToMouseUp() {
        if (this.mouseDownInterval) {
            clearInterval(this.mouseDownInterval);
        }
    }

    spawnEmoji() {
        const newEmoji = new Emoji(this.emojiStr, this.mousePositionX, this.mousePositionY);
        newEmoji.createAndStartAnimation();
    }

    remove() {
        this.cursorElement.remove();
        this.setToMouseUp()
    }
}