const bigBox = document.getElementById('BigBox');
const RedNum = document.getElementById('RedNum');
const BlueNum = document.getElementById('BlueNum');
const topText = document.getElementById('choosetexttext');
const RedPotion = document.getElementById('Red Potion');
const BluePotion = document.getElementById('Blue Potion');
const WinNum = document.getElementById('winnumber');
const LossNum = document.getElementById('losenumber');
const Money = document.getElementById('Money');
const MoneyNum = document.getElementById('moneynumber');
const instructions = document.getElementById('Instructions');
let myMONEY = 500;
let winCount = 0;
let loseCount = 0;
MoneyNum.innerText = `${myMONEY}`;
class Product {
    constructor({name,image,cost,num,originalDiv}){
        this.name = name;
        this.image = image;
        this.cost = cost;
        this.num = num;
        this.originalDiv = originalDiv;
    }
    createCard(){
        const SHOPCARD = document.createElement('div');
        Object.assign(SHOPCARD.style, {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '30%',
            height: '90%',
            background: 'rgba(255, 255, 255, 0.39)',
            cursor: 'pointer',
            justifyContent: 'space-evenly',
            borderWidth: '0.2rem',
            borderColor: '#0A285F',
            borderStyle: 'solid',
            borderRadius: '1rem'
        });
        SHOPCARD.innerHTML = `<img src ="${this.image}" style="width:8rem;">${this.name}<br>$${this.cost}`;
        return SHOPCARD;
    }
}
const allProducts=[];
allProducts[0] = new Product({
    name: 'Blue Potion',
    image: './images/Blue Potion.webp',
    cost: 2000,
    num: 2,
    originalDiv: BlueNum
});
allProducts[1] = new Product({
    name: 'Red Potion',
    image: './images/RedPotion.webp',
    cost: 5000,
    num: 1,
    originalDiv: RedNum
});
for(let i = 0;i<allProducts.length;i++){
    allProducts[i].originalDiv.innerText = `${allProducts[i].num}`;
}
BluePotion.addEventListener('click', ()=>{
    if(welcome.style.display !== 'none'){
        return;
    }
    else if(Battle.start && battleStart.myHealth === 100){
        const alreadyFullPopUp = document.createElement('div');
        Object.assign(alreadyFullPopUp.style, {
            display: 'flex',
            width: '40%',
            height: '20%',
            top: '40%',
            background: 'rgba(241,223,147)',
            position: 'absolute',
            color: '#0A285F',
            borderColor: '#D5A100',
            borderStyle: 'solid',
            borderWidth: '0.5rem',
            fontSize: '1.5rem',
            fontFamily: 'Pokemon',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
        })
        alreadyFullPopUp.innerHTML = '<p>Health is already Full!<p>';
        cover.appendChild(alreadyFullPopUp);
        cancelAnimationFrame(battleloop);
        setTimeout(() => {
            alreadyFullPopUp.remove();
            animateBattle();
        }, 3000);
    }
    else if(Battle.start && allProducts[0].num>0){
        battleStart.myHealth = 100;
        allProducts[0].num--;
        BlueNum.innerText = `${allProducts[0].num}`;
        myhealthTop.style.width = `${battleStart.myHealth}%`;
        myhealthText.innerText = `Health : ${battleStart.myHealth}%`;
    }
    else if(!Battle.start){
        const notInGamePopUp = document.createElement('div');
        Object.assign(notInGamePopUp.style, {
            display: 'flex',
            width: '40%',
            height: '20%',
            top: '40%',
            background: 'rgba(241,223,147)',
            position: 'absolute',
            color: '#0A285F',
            borderColor: '#D5A100',
            borderStyle: 'solid',
            borderWidth: '0.5rem',
            fontSize: '1.5rem',
            fontFamily: 'Pokemon',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
        })
        notInGamePopUp.innerHTML = '<p>Can only be used during Battle<p>';
        cover.appendChild(notInGamePopUp);
        cancelAnimationFrame(maploop);
        setTimeout(() => {
            notInGamePopUp.remove();
            animate1();
        }, 3000);
    }
});
let opencount = 0;
const POPUP = document.createElement('div');
Object.assign(POPUP.style, {
    display: 'none',
    position: 'absolute',
    fontFamily: 'Pokemon',
    top: '10%',
    left: '20%',
    width: '60%',
    textAlign: 'center',
    background: '#FFCC00',
    color: 'black',
    padding: '20px',
    border: '2px solid black',
    borderRadius: '12px',
    zIndex: 10000,
});
POPUP.innerHTML = `<h3>Select a Pokémon to evolve</h3><ul id="evolveList" style="list-style-type: none;"></ul>`;
cover.appendChild(POPUP);

async function getNextEvolution(pokeName) {
    const speciesData = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokeName}`).then(res => res.json());
    const evoData = await fetch(speciesData.evolution_chain.url).then(res => res.json());
    let current = evoData.chain;
    while (current) {
        if (current.species.name === pokeName) {
            if (current.evolves_to.length > 0) {
                return current.evolves_to[0].species.name;
            } else {
                return null;
            }
        }
        current = current.evolves_to[0];
    }
    return null;
}
async function renderPokeList() {
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
            console.log(pokeName)
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
                choosebox.style.display = 'none';
                enterBattle();
            });

            row.appendChild(card);
        }

        choosebox.appendChild(row);
    }
}

RedPotion.addEventListener('click', async () => {
    const list = document.getElementById('evolveList');
    list.innerHTML = '';
    if(Battle.start){
        const cannotInGamePopUp = document.createElement('div');
        Object.assign(cannotInGamePopUp.style, {
            display: 'flex',
            width: '40%',
            height: '20%',
            top: '40%',
            background: 'rgba(241,223,147)',
            position: 'absolute',
            color: '#0A285F',
            borderColor: '#D5A100',
            borderStyle: 'solid',
            borderWidth: '0.5rem',
            fontSize: '1.5rem',
            fontFamily: 'Pokemon',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
        })
        cannotInGamePopUp.innerHTML = '<p>Cannot be used during Battle<p>';
        cover.appendChild(cannotInGamePopUp);
        cancelAnimationFrame(battleloop);
        setTimeout(() => {
            cannotInGamePopUp.remove();
            animateBattle();
        }, 3000);
    }
    else if(!Battle.start &&  welcome.style.display !== 'none'){
        return;
    }
    else if(!Battle.start){
        if(allProducts[1].num > 0){
            if(opencount === 0){
                POPUP.style.display = 'block';
                opencount++;
            }
            else if (opencount === 1){
                POPUP.style.display = 'none';
                opencount--;
            }

            for (let i = 0;i<myPoke.length;i++) {
                const toEvolveto = await getNextEvolution(myPoke[i]);
                if (toEvolveto) {
                    const item = document.createElement('li');
                    item.innerText = `${myPoke[i]} -> ${toEvolveto}`;
                    item.style.cursor = 'pointer';
                    item.style.margin = '10px 0';
                    item.addEventListener('click', () => {
                        const INDEX = myPoke.indexOf(myPoke[i]);
                        allProducts[1].num--;
                        RedNum.innerText = `${allProducts[1].num}`;
                        if (INDEX !== -1) {
                            myPoke[INDEX] = toEvolveto;
                        }
                        for(let i = 0;i<myPoke.length;i++){
                            if(i!==INDEX && myPoke[i] === toEvolveto){
                                myPoke.splice(i,1);
                                break;
                            }
                        }
                        POPUP.style.display = 'none';
                        renderPokeList();
                    });
                    list.appendChild(item);
                }
            }
        }
    }
});

const SHOP = document.createElement('div');
Object.assign(SHOP.style, {
    display: 'none',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'absolute',
    fontFamily: 'Pokemon',
    top: '10%',
    left: '20%',
    width: '60%',
    textAlign: 'center',
    background: '#FFCC00',
    color: 'black',
    padding: '20px',
    border: '2px solid black',
    borderRadius: '12px',
    zIndex: 10000,
});
function createSHOPROW(){
    const SHOPROW = document.createElement('div');
    Object.assign(SHOPROW.style, {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        fontFamily: 'Pokemon',
        width: '90%',
        height: '14rem',
        marginTop: '2rem'
    });
    return SHOPROW;
}
SHOP.innerHTML = `<h2>SHOP</h2><ul id="shopList"></ul>`;
async function createShop() {
    for (let i = 0; i < allProducts.length; i += 2) {
        const row = createSHOPROW();
        const group = allProducts.slice(i, i + 2);
        for (let j = 0 ;j<2;j++) {
            const card = allProducts[j+i].createCard();
            card.addEventListener('click', ()=> {
                if(myMONEY >= allProducts[j+i].cost){
                    myMONEY-= allProducts[j+i].cost;
                    MoneyNum.innerText = `${myMONEY}`;  
                    allProducts[j+i].num++;
                    allProducts[i+j].originalDiv.innerText = `${allProducts[i+j].num}`;
                }
            });
            row.appendChild(card);
        }
        SHOP.appendChild(row);
    }
}
createShop();
cover.appendChild(SHOP);
Money.addEventListener('click',() => {
    if(welcome.style.display !== 'none')
        return
    if(opencount === 0){
        SHOP.style.display = 'flex';
        opencount++;
    }
    else if (opencount === 1){
        SHOP.style.display = 'none';
        opencount--;
    }
});
instructions.addEventListener('click', () => {
    if(welcome.style.display === 'block')
        welcome.style.display = 'none';
    else if(welcome.style.display === 'none')
        welcome.style.display = 'block';
})
