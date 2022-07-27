const duration = 2; //Seconds
const movementY = 50 //Pixel
const movementX = 20;
const magnitudeX = 5;
const maxRandomStartOffsetX = 20;
const emojiInitialOffsetY = 15;

class Emoji {
    constructor(emojiStr, startX, startY) {
        // Use random generator to make spawn point differ slightly
        this.startX = startX  + this.getRandomStartOffset();
        this.startY = startY - emojiInitialOffsetY;
        this.emojiStr = emojiStr;
        this.startTime = null;
    }

    // Create's emoji animation and starts animation
    createAndStartAnimation() {
        this.element = document.createElement("p");
        this.element.innerHTML = this.emojiStr;
        this.element.style.userSelect = 'none';
        this.element.style.position = 'absolute'
        this.element.style.top = this.startY;
        this.element.style.left = this.startX;
        document.body.append(this.element);
        requestAnimationFrame(this.step.bind(this))
    }

    // Updates position of animation based on time since start
    step(timestamp) {
        if(this.startTime === null) this.startTime = timestamp;
        const progress = (timestamp - this.startTime) / duration / 1000; // percent
        const x = this.startX + Math.sin(progress * magnitudeX) * movementX;
        const y = this.startY - (progress * movementY);

        this.element.style.left = x + 'px';
        this.element.style.top = y + 'px';
        this.element.style.opacity = 1 - progress;
        if (progress >= 1) {
            this.element.remove();
        } else {
            requestAnimationFrame(this.step.bind(this));
        }
    }

    getRandomStartOffset() {
        return Math.floor(Math.random() * maxRandomStartOffsetX*2) - maxRandomStartOffsetX;
    }

    static getRandomEmojiString() {
        return "&#" + Math.floor((Math.random() * (128591 - 128513) + 128513)) + ";";
    }

}