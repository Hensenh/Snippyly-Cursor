const duration = 2; //Seconds
const movementY = 50 //Pixel
const movementX = 20;
const magnitudeX = 5;
const maxRandomStartOffset = 20;

const emojiRange = [128513, 128591];

class Emoji {
    constructor(emojiStr, startX, startY) {
        const randomOffset = this.getRandomStartOffset();
        this.startX = startX  + this.getRandomStartOffset();
        this.startY = startY;
        this.emojiStr = emojiStr;
        this.startTime = null;
    }

    createAndStartAnimation() {
        this.element = document.createElement("p");
        this.element.innerHTML = this.emojiStr;
        this.element.style.position = 'absolute'
        this.element.style.top = this.startY;
        this.element.style.left = this.startX;
        this.element.style.userSelect = 'none';
        document.body.append(this.element);
        requestAnimationFrame(this.step.bind(this))
    }

    step(timestamp) {
        if(this.startTime === null) this.startTime = timestamp;
        const progress = (timestamp - this.startTime) / duration / 1000; // percent
        const x = this.startX + Math.sin(progress * magnitudeX) * movementX;
        const y = this.startY - (progress * movementY);

        this.element.style.left = x + 'px';
        this.element.style.top = y + 'px';
        this.element.style.opacity = 1 - progress;
        if(progress >= 1){
            this.element.remove();
        } else {
            requestAnimationFrame(this.step.bind(this));
        }

    }

    getRandomStartOffset() {
        return Math.floor(Math.random() * maxRandomStartOffset*2) - maxRandomStartOffset;
    }

    static getRandomEmojiString() {
        return "&#" + Math.floor((Math.random() * (128591 - 128513) + 128513)) + ";";
    }

}