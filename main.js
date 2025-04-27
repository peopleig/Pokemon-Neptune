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
let maploop;
let battleloop;
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
