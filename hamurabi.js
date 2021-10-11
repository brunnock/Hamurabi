var d = document;
var DOM={
  main:0,

  yearSpan:0,
  starvedSpan:0,
  plagueP:0,
  plagueSpan:0,
  joinedSpan:0,
  harvestedSpan:0,
  ratsSpan:0,

  kingAdjectiveSpan:0,
  reignAdjectiveSpan:0,
  empireAdjectiveSpan:0,
  plagueAdjectiveSpan:0,
  ratAdjectiveSpan:0,

  bushels2give:0,
  acres2plant:0,
  acres2buyOrSell:0,
  acrePrice:0,
  remainingSpan:0,
  BuyButton:0,
  SellButton:0,
  continueButton:0,

  popTD:0,
  bushTD:0,
  acresTD:0,
  plagueS:0,
  fieldset:0,

  bushelShortageP:0,
  landShortageP:0,
  popShortageP:0,
  endH3:0,
  rebelH3:0
}

// initialize DOM
for (var element in DOM) {
  DOM[element] = d.getElementById(element);
}


var population=100;
var acres=1000;
var bushels=3000;

var year=1;
var starved=0;
var plagued=0;
var joined=100;
var harvested=3000;
var ate=0;

var buySell='';
var acrePrice = returnAcrePrice();
function returnAcrePrice() {
    return (~~(Math.random()*10) + 15);
}

DOM.bushels2give.addEventListener('input', calculateRemaingBushels);
DOM.acres2buyOrSell.addEventListener('input', calculateRemaingBushels);
DOM.acres2plant.addEventListener('input', calculateRemaingBushels);

function calculateRemaingBushels () {
    var remainingBushels = bushels -DOM.bushels2give.value -DOM.acres2plant.value;
    if (buySell === 'Buy') {
	remainingBushels -= Number(DOM.acres2buyOrSell.value) * acrePrice;
    } else if (buySell === 'Sell') {
	remainingBushels += Number(DOM.acres2buyOrSell.value) * acrePrice;
    }
    DOM.remainingSpan.innerHTML = remainingBushels;
}

var kingAdjectives = ['mighty', 'stupendous', 'great', 'supreme', 'noble', 'imperious', 'illustrious'];

var empireAdjectives = ['exalted', 'magnificent', 'renowned', 'majestic', 'glorious'];

var plagueAdjectives = ['dreadful', 'hideous', 'horrendous', 'horrific', 'grievous', 'terrifying', 'dire'];

var ratAdjectives = ['Filthy', 'Vile', 'Despicable', 'Loathsome', 'Repulsive', 'Revolting',
'Repugnant', 'Detestable', 'Nauseating', 'Abhorrent', 'Verminous', 'Appalling', 'Disgusting'];


function updateScreen() {
  DOM.yearSpan.innerHTML = year;
  DOM.starvedSpan.innerHTML = starved;

  if (plagued>0) {
    DOM.plagueP.style.display = 'block';
    DOM.plagueSpan.innerHTML = plagued;
  } else {
    DOM.plagueP.style.display = 'none';
  }

  DOM.joinedSpan.innerHTML = joined;
  DOM.harvestedSpan.innerHTML = harvested;
  DOM.ratsSpan.innerHTML = ate;
  DOM.empireAdjectiveSpan.innerHTML = empireAdjectives[~~(Math.random() * empireAdjectives.length)];
  DOM.reignAdjectiveSpan.innerHTML = empireAdjectives[~~(Math.random() * empireAdjectives.length)];
  DOM.kingAdjectiveSpan.innerHTML = kingAdjectives[~~(Math.random() * kingAdjectives.length)];
  DOM.plagueAdjectiveSpan.innerHTML = plagueAdjectives[~~(Math.random() * plagueAdjectives.length)];
  DOM.ratAdjectiveSpan.innerHTML = ratAdjectives[~~(Math.random() * ratAdjectives.length)];
  DOM.popTD.innerHTML = population;
  DOM.bushTD.innerHTML = bushels;
  DOM.remainingSpan.innerHTML = bushels;
  DOM.acresTD.innerHTML = acres;
  DOM.bushels2give.value=0;
  DOM.acres2plant.value=0;
  DOM.acres2buyOrSell.value=0;
  DOM.acrePrice.innerHTML = acrePrice;

  DOM.BuyButton.style.color='#000';
  DOM.SellButton.style.color='#000';
  DOM.BuyButton.style.borderStyle='outset';
  DOM.SellButton.style.borderStyle='outset';
  buySell='';

    if (starved>population) {
	DOM.fieldset.style.display='none';
	DOM.rebelH3.style.display='block';
    } else if (population<1) {
	DOM.fieldset.style.display='none';
	DOM.endH3.style.display='block';
    }
}


DOM.continueButton.addEventListener('click', checkInput);
function checkInput() {
  // clear error messages
  DOM.bushelShortageP.style.display = 'none';
  DOM.landShortageP.style.display = 'none';
  DOM.popShortageP.style.display = 'none';

  // bushels2 and acres2 are unoriginal temp vars
  var bushels2=bushels;
  var acres2=acres;
  var acres3 = Number(DOM.acres2buyOrSell.value);
  var acres2plant = Number(DOM.acres2plant.value);

  if (buySell === 'Buy') {
    bushels2 -= acres3 * acrePrice;
    acres2 += acres3;
  } else if (buySell === 'Sell') {
    bushels2 += acres3 * acrePrice;
    acres2 -= acres3;
  }

  // check for land, bushels, people
  if (acres2plant > acres2) {
    DOM.landShortageP.style.display='block';
  } else if ((Number(DOM.bushels2give.value) + acres2plant) > bushels2) {
    DOM.bushelShortageP.style.display='block';
  } else if ((population*10) < acres2plant) {
    DOM.popShortageP.style.display='block';
  } else {
    bushels = bushels2;
    acres = acres2;
    incYear();
  }
}


DOM.BuyButton.addEventListener('click', toggleBuySell);
DOM.SellButton.addEventListener('click', toggleBuySell);
function toggleBuySell() {
  var otherButton = DOM[(this.innerHTML==='Buy') ? 'SellButton' : 'BuyButton'];
  this.style.borderStyle='inset';
  otherButton.style.borderStyle='outset';
  this.style.color='#ff0';
  otherButton.style.color='#000';
  buySell = this.innerHTML;
  calculateRemaingBushels();
}


function incYear() {
    ++year;
    starved=0;

    var fed = ~~(DOM.bushels2give.value/20);
    if (fed < population) {
      starved = population-fed;
      population -= starved;
    }

    // plague strikes 10% of the time and afflicts up tp 50% of population
    plagued = (~~(Math.random()*10)===9) ? ~~(Math.random() * population/2) : 0;
    population -= plagued;

    joined = Math.ceil(Math.random() * population/10);
    population += joined;

    bushels -= DOM.bushels2give.value;
    bushels -= DOM.acres2plant.value;
    harvested = ~~(((Math.random()*2)+2)*DOM.acres2plant.value);
    bushels += harvested;
    ate = ~~(Math.random() * bushels / 10);
    bushels -= ate;
    acrePrice = returnAcrePrice();

    updateScreen();
}

updateScreen();
