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
let myMONEY = 200;
MoneyNum.innerText = `${myMONEY}`;
let winCount = 0;
let loseCount = 0;
let numofRed = 1;
let numofBlue = 2;
BluePotion.addEventListener('click', ()=>{
    if(Battle.start && battleStart.myHealth === 100){
        alert("Health is already full!");
    }
    else if(Battle.start && numofBlue>0){
        battleStart.myHealth = 100;
        numofBlue--;
        BlueNum.innerText = `${numofBlue}`;
        myhealthTop.style.width = `${battleStart.myHealth}%`;
        myhealthText.innerText = `Health : ${battleStart.myHealth}%`;
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
POPUP.innerHTML = `<h3>Select a Pokémon to evolve</h3><ul id="evolveList"></ul>`;
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
RedPotion.addEventListener('click', async () => {
    const list = document.getElementById('evolveList');
    list.innerHTML = '';
    if(numofRed > 0){
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
                    numofRed--;
                    RedNum.innerText = `${numofRed}`;
                    if (INDEX !== -1) {
                        myPoke[INDEX] = toEvolveto;
                    }
                    POPUP.style.display = 'none';
                });
                list.appendChild(item);
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
function createSHOPCARD(link,name,cost){
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
    SHOPCARD.innerHTML = `<img src ="${link}" style="width:8rem;">${name}<br>$${cost}`;
    return SHOPCARD;
}
SHOP.innerHTML = `<h2>SHOP</h2><ul id="shopList"></ul>`;
const a = createSHOPROW();
const b = createSHOPCARD('./images/Blue Potion.png','Blue Potion',500);
const c = createSHOPCARD('./images/RedPotion.png','Red Potion',1000);
const mySHOPCARDS = [b,c];
const moneySHOPCARDS = [500,1000];
const valSHOPCARDS = [numofBlue,numofRed];
const divSHOPCARDS = [BlueNum,RedNum];
a.appendChild(b);
a.appendChild(c);
SHOP.appendChild(a);
cover.appendChild(SHOP);
Money.addEventListener('click',() => {
    if(opencount === 0){
        SHOP.style.display = 'flex';
        opencount++;
    }
    else if (opencount === 1){
        SHOP.style.display = 'none';
        opencount--;
    }
});
for(let i = 0;i<mySHOPCARDS.length;i++){
    mySHOPCARDS[i].addEventListener('click', ()=> {
        if(myMONEY >= moneySHOPCARDS[i]){
            myMONEY-=moneySHOPCARDS[i];
            MoneyNum.innerText = `${myMONEY}`;  
            valSHOPCARDS[i]++;
            divSHOPCARDS[i].innerText = `${valSHOPCARDS[i]}`;
        }
    })
}

instructions.addEventListener('click', () => {
    if(welcome.style.display === 'block')
        welcome.style.display = 'none';
    else if(welcome.style.display === 'none')
        welcome.style.display = 'block';
})
