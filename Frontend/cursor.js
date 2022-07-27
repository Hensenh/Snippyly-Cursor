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
        if (this.mouseDownInterval === null) {
            this.mouseDownInterval = setInterval(this.spawnEmoji.bind(this), emojiSpawnRate);
        }
    }

    setToMouseUp() {
        if (this.mouseDownInterval !== null) {
            clearInterval(this.mouseDownInterval);
            this.mouseDownInterval = null;
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