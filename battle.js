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
                const addMoney = 300 - howManyTimesNewPokemon*100 +battleStart.myHealth;
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
        myName.textContent = '...';
        oppName.textContent = '...';
        for(let i = 0;i<4;i++){
            BTNS[i].textContent = '...';
        }
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
    myName.textContent = '...';
    oppName.textContent = '...';
    for(let i = 0;i<4;i++){
        BTNS[i].textContent = '...';
    }
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
    myName.textContent = '...';
    oppName.textContent = '...';
    for(let i = 0;i<4;i++){
        BTNS[i].textContent = '...';
    }
    battleLog.innerText = '';
    loadScreen(false).then(() => {
        animate1();
    });
}