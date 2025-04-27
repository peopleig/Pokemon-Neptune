class bndry {
    
    constructor({position}){
        this.position = position;
        this.width = 32;
        this.height =  32;
    }
    draw() {
        ctx.fillStyle = 'rgba(255,0,0,0)';
        ctx.fillRect(this.position.x,this.position.y, this.width, this.height);
    }
}
class sprites {
    constructor({ position, image, frames = { max: 1 }, Sprites }) {
        this.position = position;
        this.image = image;
        this.frames = {...frames, val: 0, between: 0};
        this.width = 0;
        this.imageLoaded = false;
        this.height = this.image.height;

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.imageLoaded = true;
        };
        this.moves = false;
        this.Sprites = Sprites;
    }

    draw() {
        if (!this.imageLoaded) return;

        ctx.drawImage(
            this.image,
            this.frames.val * this.width, 0,                         
            this.width, this.image.height, 
            this.position.x, this.position.y,  
            this.width, this.image.height  
        );
        if(this.moves){
            if (this.frames.max > 1) {
                this.frames.between++;
            }
            if (this.frames.between % 10 === 0){
                if(this.frames.val < this.frames.max-1)
                        this.frames.val++;
                else 
                    this.frames.val = 0;
            }
        }
    }
}
const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
}
function isCollide({box1,box2}){
    return (
        box1.position.x + box1.width >= box2.position.x &&
         box1.position.x <= box2.position.x + box2.width &&
        box1.position.y <= box2.position.y + box2.height &&
        box1.position.y + box1.height >= box2.position.y
    )
}
const Battle = {
    start: false
}
const Water= {
    start: false
}
const welcome = document.getElementById('popup');
welcome.style.display = 'block';
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && welcome.style.display === 'block') {
        welcome.style.display = 'none';
    }
});
const cover = document.getElementById('cover');
const grassBattleBox = document.createElement('div');
Object.assign(grassBattleBox.style, {
    display: 'none',
    position: 'absolute',
    fontFamily: 'Pokemon',
    bottom: '5%',
    left: '10%',
    width: '75%',
    paddingLeft: '5%',
    paddingTop: '1rem',
    paddingBottom: '1rem',
    textAlign: 'left',
    background: '#F1DF93',
    color: 'black',
    border: '2px solid black',
    zIndex: 1005,
});
grassBattleBox.innerHTML = `<h3>This is the Grass Battle Zone</h3><br><h3>Press Space to Start Battle</h3>`;
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && grassBattleBox.style.display === 'block') {
        grassBattleBox.style.display = 'none';
        Battle.start = true;
    }
})
cover.appendChild(grassBattleBox);

const waterBattleBox = document.createElement('div');
Object.assign(waterBattleBox.style, {
    display: 'none',
    position: 'absolute',
    fontFamily: 'Pokemon',
    bottom: '5%',
    left: '10%',
    width: '75%',
    paddingLeft: '5%',
    paddingTop: '1rem',
    paddingBottom: '1rem',
    textAlign: 'left',
    background: '#F1DF93',
    color: 'black',
    border: '2px solid black',
    zIndex: 1005,
});
waterBattleBox.innerHTML = `<h3>This is the Water Battle Zone</h3><br><h3>Press Space to Start Battle</h3>`;
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && waterBattleBox.style.display === 'block') {
        waterBattleBox.style.display = 'none';
        Battle.start = true;
    }
})
cover.appendChild(waterBattleBox);
const fireBattleBox = document.createElement('div');
Object.assign(fireBattleBox.style, {
    display: 'none',
    position: 'absolute',
    fontFamily: 'Pokemon',
    bottom: '5%',
    left: '10%',
    width: '75%',
    paddingLeft: '5%',
    paddingTop: '1rem',
    paddingBottom: '1rem',
    textAlign: 'left',
    background: '#F1DF93',
    color: 'black',
    border: '2px solid black',
    zIndex: 1005,
});
fireBattleBox.innerHTML = `<h3>This is the Fire Battle Zone</h3><br><h3>Press Space to Start Battle</h3>`;
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && fireBattleBox.style.display === 'block') {
        fireBattleBox.style.display = 'none';
        Battle.start = true;
    }
})
cover.appendChild(fireBattleBox);
const ghostBattleBox = document.createElement('div');
Object.assign(ghostBattleBox.style, {
    display: 'none',
    position: 'absolute',
    fontFamily: 'Pokemon',
    bottom: '5%',
    left: '10%',
    width: '75%',
    paddingLeft: '5%',
    paddingTop: '1rem',
    paddingBottom: '1rem',
    textAlign: 'left',
    background: '#F1DF93',
    color: 'black',
    border: '2px solid black',
    zIndex: 1005,
});
ghostBattleBox.innerHTML = `<h3>This is the Ghost Battle Zone</h3><br><h3>Press Space to Start Battle</h3>`;
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && ghostBattleBox.style.display === 'block') {
        ghostBattleBox.style.display = 'none';
        Battle.start = true;
    }
})
cover.appendChild(ghostBattleBox);
const spinBattleBox = document.createElement('div');
Object.assign(spinBattleBox.style, {
    display: 'none',
    position: 'absolute',
    fontFamily: 'Pokemon',
    bottom: '5%',
    left: '10%',
    width: '75%',
    paddingLeft: '5%',
    paddingTop: '1rem',
    paddingBottom: '1rem',
    textAlign: 'center',
    background: '#F1DF93',
    color: 'black',
    border: '2px solid black',
    zIndex: 1005,
});
spinBattleBox.innerHTML = `<h3>This is the Spinning Wheel of Fortune</h3><br><h3>Press Space to Continue</h3>`;
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && spinBattleBox.style.display === 'block') {
        spinBattleBox.style.display = 'none';
        Battle.start = true;
    }
})
cover.appendChild(spinBattleBox);
const hospiBattleBox = document.createElement('div');
Object.assign(hospiBattleBox.style, {
    display: 'none',
    position: 'absolute',
    fontFamily: 'Pokemon',
    bottom: '5%',
    left: '10%',
    width: '75%',
    paddingLeft: '5%',
    paddingTop: '1rem',
    paddingBottom: '1rem',
    textAlign: 'left',
    background: '#F1DF93',
    color: 'black',
    border: '2px solid black',
    zIndex: 1005,
});
hospiBattleBox.innerHTML = `<h3>This is the Ghost Battle Zone</h3><br><h3>Press Space to Start Battle</h3>`;
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && hospiBattleBox.style.display === 'block') {
        hospiBattleBox.style.display = 'none';
        Battle.start = true;
    }
})
cover.appendChild(hospiBattleBox);
let prevKey = '';
window.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'w' : 
            keys.w.pressed = true;
            prevKey = 'w';
            last
            break;
        case 'ArrowUp' : 
            keys.w.pressed = true;
            prevKey = 'w';
            break;
        case 'a' : 
            keys.a.pressed = true;
            prevKey = 'a';
            break;
        case 'ArrowLeft' : 
            keys.a.pressed = true;
            prevKey = 'a';
            break;
        case 's' : 
            keys.s.pressed = true;
            prevKey = 's';
            break;
        case 'ArrowDown' : 
            keys.s.pressed = true;
            prevKey = 's';
            break;
        case 'd' : 
            keys.d.pressed = true;
            prevKey = 'd';
            break;
        case 'ArrowRight' : 
            keys.d.pressed  = true;
            prevKey = 'd';
            break;

    }
})

window.addEventListener('keyup', (e) => {

    switch(e.key) {
        case 'w' : 
            keys.w.pressed = false;
            break;
        case 'ArrowUp' : 
            keys.w.pressed = false;
            break;
        case 'a' : 
            keys.a.pressed = false;
            break;
        case 'ArrowLeft' : 
            keys.a.pressed = false;
            break;
        case 's' : 
            keys.s.pressed = false;
            break;
        case 'ArrowDown' : 
            keys.s.pressed = false;
            break;
        case 'd' : 
            keys.d.pressed = false;
            break;
        case 'ArrowRight' : 
            keys.d.pressed = false;
            break;

    }
})