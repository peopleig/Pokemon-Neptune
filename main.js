const canvas = document.getElementById('box');
const ctx = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;
const map = new Image();

const player = new Image();
player.src = './images/playerDown.png';
const player1 = new Image();
player1.src = './images/playerUp.png';
const player2 = new Image();
player2.src = './images/playerLeft.png';
const player3 = new Image();
player3.src = './images/playerRight.png';
map.src = './images/CompleteMap.png';
const fore = new Image();
fore.src = './images/Foreground.png';
const colMap = []
for (let i = 0; i<collisions.length;i+=120) {
    colMap.push(collisions.slice(i,i+120));
}
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
const boundaries = [];
const offset = {
    x: -320,
    y: -400
}
colMap.forEach((row, i) => {
    row.forEach((sign, j) => {
        if(sign === 15014){
            boundaries.push(new bndry({
                position: {
                    x: j*32 + offset.x,
                    y: i*32 + offset.y
                }  
            }))
        }
    })
})

const battleMap = []
for (let i =0; i<battlezones.length;i+=120){
    battleMap.push(battlezones.slice(i,i+120));
}
const battleAreas = [];
battleMap.forEach((row, i) => {
    row.forEach((sign, j) => {
        if(sign === 18021){
            battleAreas.push(new bndry({
                position: {
                    x: j*32 + offset.x,
                    y: i*32 + offset.y
                }  
            }))
        }
    })
})
const waterMap = [];
for (let i =0; i<waterarea.length;i+=120){
    waterMap.push(waterarea.slice(i,i+120));
}
const waterAreas = [];
waterMap.forEach((row, i) => {
    row.forEach((sign, j) => {
        if(sign === 18021){
            waterAreas.push(new bndry({
                position: {
                    x: j*32 + offset.x,
                    y: i*32 + offset.y
                }  
            }))
        }
    })
})
const fireMap = [];
for (let i =0; i<firearea.length;i+=120){
    fireMap.push(firearea.slice(i,i+120));
}
const fireAreas = [];
fireMap.forEach((row, i) => {
    row.forEach((sign, j) => {
        if(sign === 18021){
            fireAreas.push(new bndry({
                position: {
                    x: j*32 + offset.x,
                    y: i*32 + offset.y
                }  
            }))
        }
    })
})
const ghostMap = [];
for (let i =0; i<ghostarea.length;i+=120){
    ghostMap.push(ghostarea.slice(i,i+120));
}
const ghostAreas = [];
ghostMap.forEach((row, i) => {
    row.forEach((sign, j) => {
        if(sign === 18021){
            ghostAreas.push(new bndry({
                position: {
                    x: j*32 + offset.x,
                    y: i*32 + offset.y
                }  
            }))
        }
    })
})
const newMap = [];
for (let i =0; i<newarea.length;i+=120){
    newMap.push(newarea.slice(i,i+120));
}
const spinAreas = [];
const hospiAreas = [];
newMap.forEach((row, i) => {
    row.forEach((sign, j) => {
        if(sign === 16043){
            spinAreas.push(new bndry({
                position: {
                    x: j*32 + offset.x,
                    y: i*32 + offset.y
                }  
            }))
        }
        else if(sign === 16174){
            hospiAreas.push(new bndry({
                position: {
                    x: j*32 + offset.x,
                    y: i*32 + offset.y
                }  
            }))
        }
    })
})



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
const Player = new sprites({
    position: {
        x: canvas.width / 3,
        y: canvas.height / 2 + player.height/2
    },
    image: player,
    frames: {
        max: 4
    },
    Sprites: {
        up: player1,
        down: player,
        left: player2,
        right: player3
    }
});

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

const background = new sprites ({
    position: {
        x : offset.x,
        y : offset.y 
    },
    image: map 
})
const foreground = new sprites ({
    position: {
        x: offset.x,
        y : offset.y
    },
    image: fore
})
 
const movables = [background, ...boundaries, foreground, ...battleAreas, ...waterAreas,...fireAreas,...ghostAreas,...spinAreas,...hospiAreas];

function isCollide({box1,box2}){
    return (
        box1.position.x + box1.width >= box2.position.x &&
         box1.position.x <= box2.position.x + box2.width &&
        box1.position.y <= box2.position.y + box2.height &&
        box1.position.y + box1.height >= box2.position.y
    )
}

let maploop;
let battleloop;
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

function animate1 () {
    maploop = window.requestAnimationFrame(animate1);
    background.draw();
    waterAreas.forEach(bndry => {
        bndry.draw();
    })
    battleAreas.forEach(bndry => {
        bndry.draw();
    })
    fireAreas.forEach(bndry => {
        bndry.draw();
    })
    ghostAreas.forEach(bndry => {
        bndry.draw();
    })
    Player.draw();
    boundaries.forEach(bndry => {
        bndry.draw();
    })
    foreground.draw();
    if(Battle.start){
        cancelAnimationFrame(maploop);
        choosemyPokemon();
        return;
    }
    let isinBattleZone = false;
    if(keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed){
        isinBattleZone = false;
        for(let i = 0; i<battleAreas.length;i++){
            const BATTLEZONE = battleAreas[i];
            if((isCollide({box1: Player, box2: BATTLEZONE}))){
                isinBattleZone = true;
                battleStart.map = 0;
                break;
            }
        }
        if(isinBattleZone)
            grassBattleBox.style.display = 'block';
        else    
            grassBattleBox.style.display = 'none';
    }
    if(keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed){
        isinBattleZone = false;
        for(let i = 0; i<waterAreas.length;i++){
            const WATERZONE = waterAreas[i];
            if (isCollide({ box1: Player, box2: WATERZONE })) {
                isinBattleZone = true;
                battleStart.map = 1;
                break;
            }
        }
        if(isinBattleZone){
            waterBattleBox.style.display = 'block';
        }
        else    
            waterBattleBox.style.display = 'none';
    }
    if(keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed){
        isinBattleZone = false;
        for(let i = 0; i<fireAreas.length;i++){
            const FIREZONE = fireAreas[i];
            if (isCollide({ box1: Player, box2: FIREZONE })) {
                isinBattleZone = true;
                battleStart.map = 3;
                break;
            }
        }
        if(isinBattleZone){
            fireBattleBox.style.display = 'block';
        }
        else    
            fireBattleBox.style.display = 'none';
    }
    if(keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed){
        isinBattleZone = false;
        for(let i = 0; i<ghostAreas.length;i++){
            const GHOSTZONE = ghostAreas[i];
            if (isCollide({ box1: Player, box2: GHOSTZONE })) {
                isinBattleZone = true;
                battleStart.map = 2;
                break;
            }
        }
        if(isinBattleZone){
            ghostBattleBox.style.display = 'block';
        }
        else    
            ghostBattleBox.style.display = 'none';
    }
    if(keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed){
        isinBattleZone = false;
        for(let i = 0; i<spinAreas.length;i++){
            const SPINZONE = spinAreas[i];
            if (isCollide({ box1: Player, box2: SPINZONE })) {
                isinBattleZone = true;
                battleStart.map = 2;
                break;
            }
        }
        if(isinBattleZone){
            spinBattleBox.style.display = 'block';
        }
        else    
            spinBattleBox.style.display = 'none';
    }
    let moving =  true;
    Player.moves = false;
    if(keys.w.pressed && prevKey === 'w'){
        Player.moves = true;
        Player.image = Player.Sprites.up;
        for(let i = 0; i<boundaries.length;i++){
            const BOUNDARY = boundaries[i]; 
            if(isCollide({box1: Player, box2: {...BOUNDARY, position:{
                x: BOUNDARY.position.x,
                y: BOUNDARY.position.y + 3
            }}}) ){
                moving = false;
                break;
            }
        }
        if(moving){
            movables.forEach((movable) => {
                movable.position.y +=3;
            })
        } 
    }
    else if(keys.a.pressed && prevKey === 'a'){
        Player.moves = true;
        Player.image = Player.Sprites.left;
        for(let i = 0; i<boundaries.length;i++){
            const BOUNDARY = boundaries[i]; 
            if(isCollide({box1: Player, box2: {...BOUNDARY, position:{
                x: BOUNDARY.position.x + 3,
                y: BOUNDARY.position.y  
            }}}) ){
                moving = false;
                break;
            }
        }
        if(moving){
            movables.forEach((movable) => {
                movable.position.x +=3;
            })
        }
    }
    else if(keys.s.pressed && prevKey === 's'){
        Player.moves = true;
        Player.image = Player.Sprites.down;
        for(let i = 0; i<boundaries.length;i++){
            const BOUNDARY = boundaries[i]; 
            if(isCollide({box1: Player, box2: {...BOUNDARY, position:{
                x: BOUNDARY.position.x,
                y: BOUNDARY.position.y - 3
            }}}) ){
                moving = false;
                break;
            }
        }
        if(moving){
            movables.forEach((movable) => {
                movable.position.y -=3;
            })
        }
    }
    else if(keys.d.pressed && prevKey === 'd'){
        Player.moves = true;
        Player.image = Player.Sprites.right;
        for(let i = 0; i<boundaries.length;i++){
            const BOUNDARY = boundaries[i]; 
            if(isCollide({box1: Player, box2: {...BOUNDARY, position:{
                x: BOUNDARY.position.x - 3,
                y: BOUNDARY.position.y 
            }}}) ){
                moving = false;
                break;
            }
        }
        if(moving){
            movables.forEach((movable) => {
                movable.position.x -=3;
            })
        }
    }
    
}
animate1();
const UI = document.getElementById('UI');
async function enterBattle() {
    await loadScreen( 1===1);
    if(!requestNewPokemon)
        UI.style.display = 'block'; 
    else{
        console.log(battleStart.myPokeNames);
        myName.textContent = `${battleStart.myPokeNames}`;
        for(let i = 0;i<4;i++){
            BTNS[i].textContent = battleStart.myMoves[i];
        }
        UI.style.display = 'block';
    }
    startBattle();
}
async function loadScreen(goORnogo) {

    const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${chosenPoke}`)
        .then(res => res.json());
    const pikachu1 = new Image();
    const pikachu2 = new Image();
    pikachu1.src = data.sprites.front_default;
    pikachu2.src = data.sprites.front_shiny;
    await Promise.all([
        new Promise(resolve => pikachu1.onload = resolve),
        new Promise(resolve => pikachu2.onload = resolve)
    ]);
    return new Promise(resolve => {
        let show2 = false;
        let count = 0;
        const interval = setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if(count%4 === 0){
                ctx.fillStyle = '#D5A100';
            }
            else if(count%4 === 1){
                ctx.fillStyle = '#FFCC00';
            }
            else if(count%4 === 2){
                ctx.fillStyle = '#0075BE'
            }
            else{
                ctx.fillStyle = '#0A285F';
            }
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            let IMAGE;
            if(show2)
                IMAGE = pikachu2;
            else
                IMAGE = pikachu1;
            
            ctx.drawImage(
                IMAGE,
                (canvas.width - IMAGE.width*5) / 2,(canvas.height - IMAGE.height*5) / 2, 
                IMAGE.width*5, IMAGE.height*5
            );

            show2 = !show2;
            count++;

            if (count >= 10) { 
                clearInterval(interval);
                resolve();
            }
        }, 500);
    });
}

const battlebg = new Image();
battlebg.src = './images/GrassBG.webp';
const beachbattlebg = new Image();
beachbattlebg.src = './images/beachbattlebg.jpg';
const ghostbg = new Image();
ghostbg.src = './images/ghostbg.jpg';
const firebg = new Image();
firebg.src = './images/Firebg.png';

const myPoke = ['charmander','bulbasaur','pikachu','squirtle'];
const nonArsenal = [];
let chosenPoke;
const choosebox = document.getElementById('choose');
const backbutton = document.getElementById('backbutton');
let hasChosenPoke = 0;
async function choosemyPokemon() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    choosebox.style.display = 'block';

    const oldCards = choosebox.querySelectorAll('.cards');
    oldCards.forEach(row => row.remove());
    for (let i = 0; i < myPoke.length; i += 3) {
        const row = document.createElement('div');
        row.classList.add('cards');

        const group = myPoke.slice(i, i + 3);
        for (const pokeName of group) {
            const card = document.createElement('div');
            card.classList.add('pokecard');

            const imgDiv = document.createElement('div');
            imgDiv.classList.add('pokeimg');

            const textDiv = document.createElement('div');
            textDiv.classList.add('poketext');
            textDiv.innerText = pokeName;
            const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`).then(res => res.json());
            const img = new Image();
            img.src = data.sprites.front_default;
            img.style.width = '100%';
            img.style.height = '100%';
            imgDiv.appendChild(img);
            card.appendChild(imgDiv);
            card.appendChild(textDiv);
            card.addEventListener('click', () => {
                chosenPoke = pokeName;
                battleStart.myPokeNames = pokeName;
                choosebox.style.display = 'none';
                enterBattle();
            });

            row.appendChild(card);
        }

        choosebox.appendChild(row);
    }
}
backbutton.addEventListener('click', () => {
    choosebox.style.display = 'none';
    Battle.start = false;
    animate1();
});

const battleStart = {
    myPokeImage: null,
    myPokeImageShiny: null,
    oppPokeImage: null,
    oppPokeImageShiny: null,
    myPokeNames: '',
    oppPokeNames: '',
    myMoves:{},
    myMovePowers:{},
    oppMoves:{},
    oppMovePowers:{},
    myStatss: {},
    oppStatss: {},
    myHealth: 100,
    oppHealth: 100,
    map: null,
    drawNow: false
}
class Pokemon {
    constructor({name,my,image_default, image_shiny, level}){
        if(my){
            this.myPokeImage = image_default;
            this.myPokeImageShiny = image_shiny;
            this.level = level;
            this.myPokeNames = name;
        }
        if(!my){
            this.oppPokeImage = image_default;
            this.oppPokeImageShiny = image_shiny;
            this.level = level;
            this.oppPokeNames = name;
        }
    }
}
const myhealthBox = document.getElementById('myhealth');
const opphealthBox = document.getElementById('opphealth');
const myName = myhealthBox.querySelector('h1');
const myLevel = myhealthBox.querySelector('h3');
const oppName = opphealthBox.querySelector('h1');
const oppLevel = opphealthBox.querySelector('h3');
const MOVES = document.getElementById('actions');
const BTNS = {};
for(let i = 0;i<4;i++){
    BTNS[i] = document.getElementById(`btn${i+1}`);
    BTNS[i].addEventListener('click',() =>{
        if(!isOppDamaging)
            mydealDamage(battleStart.myStatss['attack'],battleStart.oppStatss['defense'],battleStart.myMovePowers[i],battleStart.oppStatss['hp'],battleStart.myMoves[i]);
    })
}
const myhealthText = document.getElementById('myhealthbartext');
const opphealthText = document.getElementById('opphealthbartext');
const myhealthTop = document.getElementById('myhealthbartop');
const opphealthTop = document.getElementById('opphealthbartop');
const battleLog = document.getElementById('datainbattlelog');
async function startBattle() {
    const chosen = chosenPoke;
    if(!requestNewPokemon)
        await loadPoke(chosen); 
    else 
        await loadAnotherPoke(chosen);
    animateBattle(); 
}
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && document.getElementById('EOB').style.display === 'flex') {
        document.getElementById('EOB').style.display = 'none';
        endGame();
    }
});
let damageFrameCount = 0;
let isMyDamaging = false;
let isOppDamaging = false;
const maxDamageFrames = 30;
let bobbingAmplitude = 5;  
let bobbingSpeed = 0.07;    
let bobbingOffset = 0;
let bobbingFrameCount = 0;
let whenSomeoneDies = 0;
let continuousWinCount = 0;
let requestNewPokemon = false;
let howManyTimesNewPokemon = 0;
async function animateBattle() {
    battleloop = window.requestAnimationFrame(animateBattle);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if(battleStart.map === 0)
        ctx.drawImage(battlebg,0,0,canvas.width,canvas.height);
    else if(battleStart.map === 1 )
        ctx.drawImage(beachbattlebg, 0,0,canvas.width,canvas.height);
    else if(battleStart.map === 2){
        ctx.drawImage(ghostbg,0,0,canvas.width,canvas.height);
    }
    else if(battleStart.map === 3)
        ctx.drawImage(firebg,0,0,canvas.width,canvas.height);
    if(battleStart.drawNow){
        bobbingFrameCount++;
        let myImg = battleStart.myPokeImage;
        let oppImg = battleStart.oppPokeImage;
        if (isMyDamaging && damageFrameCount % 5 === 1) {
            myImg = battleStart.myPokeImageShiny;
        }
        if (isOppDamaging && damageFrameCount % 5 === 1) {
            oppImg = battleStart.oppPokeImageShiny;
        }
        bobbingOffset = Math.sin(bobbingSpeed * bobbingFrameCount) * bobbingAmplitude;
        if(battleStart.myHealth > 0 && battleStart.oppHealth > 0){
            ctx.drawImage(oppImg, 500, 100, 350, 350 - bobbingOffset); 
            ctx.drawImage(myImg, 170, 230 , 350, 350 - bobbingOffset);
        }
        else if(battleStart.myHealth <= 0){
            whenSomeoneDies++;
            if(whenSomeoneDies === 1){
                howManyTimesNewPokemon++;
                continuousWinCount = 0;
                console.log(myPoke,nonArsenal);
                // for(let i = 0;i<nonArsenal.length;i++){
                //     myPoke[myPoke.length] = nonArsenal[i];
                // }
                // nonArsenal.length = 0;
                const index = myPoke.indexOf(`${battleStart.myPokeNames}`);
                myPoke.splice(index,1);
                nonArsenal.push(`${battleStart.myPokeNames}`);
                if(howManyTimesNewPokemon <3)
                    requestNewPokemon = true;
                else{
                    if(nonArsenal.length > 3){
                        let x = nonArsenal;
                        for(let i =0;i<x.length - 3;i++){
                            myPoke[myPoke.length] = x[i];
                        }
                        nonArsenal.length = 0;;
                    }
                    requestNewPokemon = false;
                }
                myDied(requestNewPokemon);
            }
            if(whenSomeoneDies < 50){
                ctx.drawImage(oppImg, 500, 100, 350, 350 - bobbingOffset); 
                ctx.drawImage(myImg, 170, 230 , 350, 350);
            }
            else if (whenSomeoneDies <100)
                ctx.drawImage(oppImg, 500, 100, 350, 350 - bobbingOffset);
        }
        else if(battleStart.oppHealth <= 0){
            whenSomeoneDies++;
            if(whenSomeoneDies === 1){
                winCount++;
                continuousWinCount++;
                const addMoney = battleStart.myHealth*3;
                myMONEY+=addMoney;
                MoneyNum.innerText = `${myMONEY}`;
                WinNum.innerText = `${winCount}`;
                if(continuousWinCount%5===0){
                    allProducts[0].num++;
                    BlueNum.innerText = `${allProducts[0].num++}`;
                }
                if(continuousWinCount%10===0){
                    allProducts[1].num++;
                    RedNum.innerText = `${allProducts[1].num}`;
                }
                myPoke.push(...nonArsenal);
                nonArsenal.length = 0;
                let isThere = false
                for(let i = 0;i<myPoke.length;i++){
                    if(myPoke[i] === battleStart.oppPokeNames){
                        isThere = true;
                    }
                }
                if(!isThere){
                    myPoke[myPoke.length] = battleStart.oppPokeNames;
                }
                oppDied(addMoney);
            }
            if(whenSomeoneDies < 50){
                ctx.drawImage(oppImg, 500, 100, 350, 350); 
                ctx.drawImage(myImg, 170, 230 , 350, 350 - bobbingOffset);
            }
            else if(whenSomeoneDies < 100)
                ctx.drawImage(myImg, 170, 230 , 350, 350 - bobbingOffset);
        }
        drawBattle(myImg,oppImg,
             battleStart.myPokeNames, battleStart.oppPokeNames, 
             battleStart.myMoves, battleStart.oppMoves);
        if (isMyDamaging || isOppDamaging) {
            damageFrameCount++;
            if (damageFrameCount > maxDamageFrames && isOppDamaging) {
                if(battleStart.oppHealth !== 0){
                    let j = Math.floor(Math.random()*(4));
                    oppdealDamage(battleStart.oppStatss['attack'],battleStart.myStatss['defense'],battleStart.oppMovePowers[j],battleStart.myStatss['hp'],battleStart.oppMoves[j]);
                }
                isOppDamaging = false;
            }
            if(damageFrameCount > maxDamageFrames && isMyDamaging){
                isMyDamaging = false;
            }
        }
    }
}

async function loadPoke(myPokeName) {
    let oppPoke;
    if(battleStart.map === 0 && winCount <= 5)
        oppPoke = ['snivy','treecko','ivysaur','gloom','paras','chikorita','exeggcute'];
    else if(battleStart.map === 0 && winCount>5 && winCount<=15 )
        oppPoke = ['leafeon','meganium','meowscarada','chikorita','exeggutor','venusaur','vileplume'];
    else if(battleStart.map === 0 && winCount > 15)
        oppPoke = ['leafeon','meowscarada','raichu-alola','virizion','sceptile','zarude'];
    else if(battleStart.map === 1 && winCount <=5)
        oppPoke = ['squirtle','psyduck','poliwag','magikarp','slowbro','horsea','wartortle','suicune'];
    else if(battleStart.map === 1 && winCount>5 && winCount<=15)
        oppPoke = ['tentacruel','dewgong','lapras','seadra','blastoise','kingler','kabutops'];
    else if(battleStart.map === 1 && winCount>15)
        oppPoke = ['tentacruel','gyarados','greninja','blastoise','lapras','volcanion'];
    else if(battleStart.map === 2 && winCount<=5)
        oppPoke = ['sableye','drifloon','gastly','lampent','golett','phantump','decidueye'];
    else if(battleStart.map === 2 && winCount>5 && winCount<15)
        oppPoke = ['gengar','mismagius','giratina','chandelure','hoopa'];
    else if(battleStart.map === 2 && winCount>15)
        oppPoke = ['giratina','runerigus','decidueye','aegislash','golurk'];
    else if(battleStart.map === 3 && winCount<=5)
        oppPoke = ['charmeleon','vulpix','ninetales','houndour','flareon','ponyta','raboot','cyndaquil'];
    else if(battleStart.map === 3 && winCount>5 && winCount<=15)
        oppPoke = ['charizard','magmar','rapidash','typhlosion','heatran'];
    else if(battleStart.map === 3 && winCount>15)
        oppPoke = ['ninetales','magmortar','volcarona','reshiram','volcanion'];
    const oppPokeName = oppPoke[Math.floor(Math.random() * oppPoke.length)];
    const [myData, oppData] = await Promise.all ([
        fetch(`https://pokeapi.co/api/v2/pokemon/${myPokeName}`)
        .then(res => res.json()),
        fetch(`https://pokeapi.co/api/v2/pokemon/${oppPokeName}`)
        .then (res => res.json())
    ]);
    const myPokeImg = new Image();
    const oppPokeImg = new Image();
    const myPokeImgShiny = new Image();
    const oppPokeImgShiny = new Image();
    myPokeImgShiny.src = myData.sprites.back_shiny;
    myPokeImg.src = myData.sprites.back_default;
    oppPokeImgShiny.src = oppData.sprites.front_shiny;
    oppPokeImg.src = oppData.sprites.front_default;
    const myStats = {};
    const oppStats = {};
    const whatIwant = ['hp','attack','defense'];
    myData.stats.forEach(STAT => {
        if(whatIwant.includes(STAT.stat.name)){
            myStats[STAT.stat.name] = STAT.base_stat;
        }
    });
    oppData.stats.forEach(STAT => {
        if(whatIwant.includes(STAT.stat.name)){
            oppStats[STAT.stat.name] = STAT.base_stat;
        }
    });
    await Promise.all([
        new Promise(res => myPokeImg.onload = res),
        new Promise(res => oppPokeImg.onload = res)
    ]);
    const myMoves = {};
    const myMovePower = {};
    const one = myData.moves;
    for (let i = 0; i < 4; i++) {
        const MOVE = one[i];
        myMoves[i] = MOVE.move.name;
        const MOVEDATA = await (
            fetch(`${MOVE.move.url}`).then(res =>res.json())
        );
        myMovePower[i] = MOVEDATA.power;
    }
    const oppMoves = {};
    const oppMovePower = {};
    const two = oppData.moves;
    for (let i = 0; i < 4; i++) {
        const MOVE = two[i];
        oppMoves[i] = MOVE.move.name;
        const MOVEDATA = await (
            fetch(`${MOVE.move.url}`).then(res =>res.json())
        );
        oppMovePower[i] = MOVEDATA.power;
    }
    battleStart.myPokeImage = myPokeImg;
    battleStart.oppPokeImage = oppPokeImg;
    battleStart.myPokeNames = myPokeName;
    battleStart.oppPokeNames = oppPokeName;
    battleStart.oppPokeImageShiny = oppPokeImgShiny;
    battleStart.myPokeImageShiny =  myPokeImgShiny;
    battleStart.myMoves = myMoves;
    battleStart.myMovePowers = myMovePower;
    battleStart.oppMoves = oppMoves;
    battleStart.oppMovePowers = oppMovePower
    battleStart.myStatss = myStats;
    battleStart.oppStatss = oppStats;
    battleStart.drawNow = true;
}

function drawBattle(myPokeImg, oppPokeImg, myPokeName, oppPokeName, MYMOVES, OPPMOVES) {
    myName.textContent = `${myPokeName}`;
    oppName.textContent = `${oppPokeName}`;

    for(let i = 0;i<4;i++){
        BTNS[i].textContent = MYMOVES[i];
    }
}
async function mydealDamage(attackerAtk, defenderDef, movePower, defenderHp, moveName) {
    const damage = (((5* movePower * (attackerAtk / defenderDef)) / 50 + 2));
    const percentDamage = Math.floor((damage / defenderHp) * 100);
    const finalDamage = Math.min(percentDamage,100);
    battleStart.oppHealth -= finalDamage;
    if(battleStart.oppHealth < 0)
        battleStart.oppHealth = 0;
    opphealthTop.style.width = `${battleStart.oppHealth}%`;
    opphealthText.innerText = `Health : ${battleStart.oppHealth}%`;
    let newData = document.createTextNode(`${battleStart.myPokeNames} used a ${moveName}`);
    // newData.style.color = '#D5A100';
    battleLog.appendChild(newData);
    battleLog.appendChild(document.createElement('br'));
    damageFrameCount = 0;
    isOppDamaging = true;
}
function oppdealDamage (attackerAtk, defenderDef, movePower, defenderHp,moveName){
    const damage = (((5* movePower * (attackerAtk / defenderDef)) / 50 + 2));
    const percentDamage = Math.floor((damage / defenderHp) * 100);
    const finalDamage = Math.min(percentDamage,100);
    battleStart.myHealth -= finalDamage;
    if(battleStart.myHealth < 0)
        battleStart.myHealth = 0;
    myhealthTop.style.width = `${battleStart.myHealth}%`;
    myhealthText.innerText = `Health : ${battleStart.myHealth}%`;
    let newData = document.createTextNode(`${battleStart.oppPokeNames} used a ${moveName}`);
    battleLog.appendChild(newData);
    battleLog.appendChild(document.createElement('br'));
    isMyDamaging = true;
    damageFrameCount = 0;
}

// function chooseAnotherPokemon(){
    
// }
async function loadAnotherPoke(myPokeName){
    const myData = await fetch(`https://pokeapi.co/api/v2/pokemon/${myPokeName}`)
        .then(res => res.json());
    const myPokeImg = new Image();
    const myPokeImgShiny = new Image();
    myPokeImgShiny.src = myData.sprites.back_shiny;
    myPokeImg.src = myData.sprites.back_default;
    const myStats = {};
    const whatIwant = ['hp','attack','defense'];
    myData.stats.forEach(STAT => {
        if(whatIwant.includes(STAT.stat.name)){
            myStats[STAT.stat.name] = STAT.base_stat;
        }
    });
    await Promise.all([
        new Promise(res => myPokeImg.onload = res)
    ]);
    const myMoves = {};
    const myMovePower = {};
    const one = myData.moves;
    for (let i = 0; i < 4; i++) {
        const MOVE = one[i];
        myMoves[i] = MOVE.move.name;
        const MOVEDATA = await (
            fetch(`${MOVE.move.url}`).then(res =>res.json())
        );
        myMovePower[i] = MOVEDATA.power;
    }
    battleStart.myPokeImage = myPokeImg;
    battleStart.myPokeImageShiny =  myPokeImgShiny;
    battleStart.myMoves = myMoves;
    battleStart.myMovePowers = myMovePower;
    battleStart.myStatss = myStats;
    battleStart.drawNow = true;
}
async function myDied(requestNewPokemon) {
    if(requestNewPokemon === true){ 
        whenSomeoneDies = 0;
        damageFrameCount = 0;
        UI.style.display = 'none';
        battleStart.myHealth=100;
        myhealthTop.style.width = `${battleStart.myHealth}%`;
        myhealthText.innerText = `Health : ${battleStart.myHealth}%`;
        cancelAnimationFrame(battleloop);
        choosemyPokemon();
    }
    else{
        howManyTimesNewPokemon = 0;
        const loseMoney = battleStart.oppHealth;
        myMONEY-=loseMoney;
        loseCount++;
        MoneyNum.innerText = `${myMONEY}`;
        WinNum.innerText = `${winCount}`;
        LossNum.innerText = `${loseCount}`;
        let newData = document.createTextNode(`${battleStart.myPokeNames} has fainted`);
        battleLog.appendChild(newData);
        battleLog.appendChild(document.createElement('br'));
        newData = document.createTextNode('YOU LOST');
        battleLog.appendChild(newData);
        document.getElementById('YOU').innerText = 'YOU LOST!';
        document.getElementById('info').innerHTML = `You cannot use ${battleStart.myPokeNames} for the next Battle<br>$${loseMoney} was removed from your account`;
        document.getElementById('EOB').style.display = 'flex';
    }
}

function oppDied(money) {
    let newData = document.createTextNode(`${battleStart.oppPokeNames} has fainted`);
    battleLog.appendChild(newData);
    howManyTimesNewPokemon = 0;
    battleLog.appendChild(document.createElement('br'));
    newData = document.createTextNode('YOU WON');
    battleLog.appendChild(newData);
    document.getElementById('YOU').innerText = 'YOU WON!';
    document.getElementById('info').innerHTML = `${battleStart.oppPokeNames} will be added to your arsenal<br>$${money} was added to your account`;
    document.getElementById('EOB').style.display = 'flex';
}

function endGame(){
    cancelAnimationFrame(battleloop);
    UI.style.display = 'none';
    Battle.start = false;
    battleStart.drawNow = false;
    battleStart.myHealth = 100;
    battleStart.oppHealth = 100;
    isMyDamaging = false;
    isOppDamaging = false;
    whenSomeoneDies = 0;
    damageFrameCount = 0;
    requestNewPokemon = false;
    myhealthTop.style.width = `${battleStart.myHealth}%`;
    myhealthText.innerText = `Health : ${battleStart.myHealth}%`;
    opphealthTop.style.width = `${battleStart.oppHealth}%`;
    opphealthText.innerText = `Health : ${battleStart.oppHealth}%`;
    battleLog.innerText = '';
    loadScreen(false).then(() => {
        animate1();
    });
}
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
