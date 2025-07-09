window.onload = function(){

  let hand_no = 1
  let handnorth = []
  let handeast = []
  let handsouth = []
  let handwest = []
  let playingHand = []

  let sortOrder = ['A','K','Q','J','T','9','8','7','6','5','4','3','2']

  weightedCards = ['2&clubsuit;','3&clubsuit;','4&clubsuit;','5&clubsuit;','6&clubsuit;','7&clubsuit;','8&clubsuit;',
                 '9&clubsuit;','10&clubsuit;','J&clubsuit;','Q&clubsuit;','K&clubsuit;','A&clubsuit;',
                 '2&diamondsuit;','3&diamondsuit;','4&diamondsuit;','5&diamondsuit;','6&diamondsuit;','7&diamondsuit;','8&diamondsuit;',
                 '9&diamondsuit;','10&diamondsuit;','J&diamondsuit;','Q&diamondsuit;','K&diamondsuit;','A&diamondsuit;',
                 '2&heartsuit;','3&heartsuit;','4&heartsuit;','5&heartsuit;','6&heartsuit;','7&heartsuit;','8&heartsuit;',
                 '9&heartsuit;','10&heartsuit;','J&heartsuit;','Q&heartsuit;','K&heartsuit;','A&heartsuit;',
                 '2&spadesuit;','3&spadesuit;','4&spadesuit;','5&spadesuit;','6&spadesuit;','7&spadesuit;','8&spadesuit;',
                 '9&spadesuit;','10&spadesuit;','J&spadesuit;','Q&spadesuit;','K&spadesuit;','A&spadesuit;'
                ]

  // Functions
  function fisherYatesShuffle(array){
    for(let i = array.length -1; i >= 0; i--){
      const newPosition = Math.floor((i + 1) * Math.random());
      const temp = array[newPosition];
      array[newPosition] = array[i];
      array[i] = temp;
    }
    return array;
  }

  function getWinningCard(hand,trumps) {
    let myHandWeighted = []
    for(let [i,card] of myHand.entries()) {
      if(card.includes(trumps)) {
        myHandWeighted[i] = weightedCards.indexOf(card) + 100
      }
      else{
        myHandWeighted[i] = weightedCards.indexOf(card)
      }
    }
    let winningCardIndex = myHandWeighted.indexOf(Math.max(...myHandWeighted));
    return hand[winningCardIndex]
  }

  const replaceSuitSymbols = card => 
  {
    if(card.includes('s')){card = card.replace('s','&spadesuit;');}
    else if(card.includes('h')){card = card.replace('h','&heartsuit;');}
    else if(card.includes('c')){card = card.replace('c','&clubsuit;');}
    else if(card.includes('d')){card = card.replace('d','&diamondsuit;');}
    return card;
  }

  function placeCard(cardinal,suit,position,value,facedown) {
    let cardinalDir = document.getElementById(cardinal)
    let cardinalDirText = cardinalDir.id
    let card = document.createElement('div')
    let list = card.classList
    list.add('card')
    list.add(suit)
    list.add(cardinalDirText + suit + '-card-' + position)
    card.id = `${cardinalDirText}${suit}-card-${position}`

    if(facedown===false){
      // console.log(cardinalDir)
      card.innerHTML = value
      card.draggable = true
      if(value.includes('heart') || value.includes('diamond')){
        card.classList.add('suit-symbol-red')
      }
      cardinalDir.appendChild(card)
      // console.log(card)
    }
    else{
      cardinalDir.appendChild(card)
      // console.log(card)
      card.innerHTML = value
      card.style.textIndent = '9999px' 
      card.classList.add('cardfacedown')
    }
  }

  function clearCardDisplayArray(cardinal, suit /*, arrayToClear*/) {
  //  if(arrayToClear.length < 1 || array == undefined){return}; // Array is already empty
    for (let i=1;i<14;i++){
      let id = cardinal + suit + '-card-' + (i)
      el = document.getElementById(id)
      if(el != null){el.remove()}
    }
    // arrayToClear = []
    // return arrayToClear
  }
  // console.log('northHandSpades is: ' + northHandSpades)
  // clearCardDisplayArray('north', 'spades')
  // northHandSpades = []
  // console.log('northHandSpades is: ' + northHandSpades)

  /** Sort array of objects based on another array */
  function mapOrder (array, order) {
    array.sort( function (a, b) {
      var A = a[0], B = b[0];
      if (order.indexOf(A) > order.indexOf(B)) {
        return 1;
      } else {
        return -1;
      }
    });
    return array;
  };

  function placeHandAtCardinal(cardinalPos, handSpades, handHearts, handDiamonds, handClubs) {
    for (card of handSpades){
      let value = card[0]
      if(value === 'T') {value = 10}
      placeCard(cardinalPos,'spades',handSpades.indexOf(card)+1,value + card.slice(1),false)
    }
    for (card of handHearts){
      let value = card[0]
      if(value === 'T') {value = 10}
      placeCard(cardinalPos,'hearts',handHearts.indexOf(card)+1,value + card.slice(1),false)
    }
    for (card of handDiamonds){
      let value = card[0]
      if(value === 'T') {value = 10}
      placeCard(cardinalPos,'diamonds',handDiamonds.indexOf(card)+1,value + card.slice(1),false)
    }
    for (card of handClubs){
      let value = card[0]
      if(value === 'T') {value = 10}
      placeCard(cardinalPos,'clubs',handClubs.indexOf(card)+1,value + card.slice(1),false)
    }
  }

  function nRevealClick(handnorth,cardinal){
    if(cardinal=="north"){
      console.log('nReveal clicked!')
      document.getElementById('nReveal').disabled="true";
      clearCardDisplayArray('north', 'spades')
      let points = 0
      let northHandSpades = mapOrder(handnorth.filter(item => item[2] == 's'),sortOrder)
      console.log('northHandSpades: ' + northHandSpades)
      points = calcPoints(northHandSpades)
      let northHandHearts = mapOrder(handnorth.filter(item => item[2] == 'h'),sortOrder)
      points = points + calcPoints(northHandHearts)
      let northHandDiamonds = mapOrder(handnorth.filter(item => item[2] == 'd'),sortOrder)
      points = points + calcPoints(northHandDiamonds)
      let northHandClubs = mapOrder(handnorth.filter(item => item[2] == 'c'),sortOrder)
      points = points + calcPoints(northHandClubs)
      console.log('Total Points: ' + points)
      document.getElementById('nPoints').innerText = points
      placeHandAtCardinal("north", northHandSpades ,northHandHearts, northHandDiamonds, northHandClubs)
    }
    if(cardinal=="east"){
      console.log('eReveal clicked!')
      document.getElementById('eReveal').disabled="true";
      clearCardDisplayArray('east', 'spades')
      let eastHandSpades = mapOrder(handeast.filter(item => item[2] == 's'),sortOrder)
      points = calcPoints(eastHandSpades)
      let eastHandHearts = mapOrder(handeast.filter(item => item[2] == 'h'),sortOrder)
      points = points + calcPoints(eastHandHearts)
      let eastHandDiamonds = mapOrder(handeast.filter(item => item[2] == 'd'),sortOrder)
      points = points + calcPoints(eastHandDiamonds)
      let eastHandClubs = mapOrder(handeast.filter(item => item[2] == 'c'),sortOrder)
      points = points + calcPoints(eastHandClubs)
      document.getElementById('ePoints').innerText = points
      placeHandAtCardinal("east", eastHandSpades, eastHandHearts, eastHandDiamonds, eastHandClubs)
    }
    if(cardinal=="south"){
      console.log('sReveal clicked!')
      document.getElementById('sReveal').disabled="true";
      clearCardDisplayArray('south', 'spades')
      let southHandSpades = mapOrder(handsouth.filter(item => item[2] == 's'),sortOrder)
      points = calcPoints(southHandSpades)
      let southHandHearts = mapOrder(handsouth.filter(item => item[2] == 'h'),sortOrder)
      points = points + calcPoints(southHandHearts)
      let southHandDiamonds = mapOrder(handsouth.filter(item => item[2] == 'd'),sortOrder)
      points = points + calcPoints(southHandDiamonds)
      let southHandClubs = mapOrder(handsouth.filter(item => item[2] == 'c'),sortOrder)
      points = points + calcPoints(southHandClubs)
      document.getElementById('sPoints').innerText = points
      placeHandAtCardinal("south", southHandSpades, southHandHearts, southHandDiamonds, southHandClubs)
    }
    if(cardinal=="west"){
      console.log('wReveal clicked!')
      document.getElementById('wReveal').disabled="true";
      clearCardDisplayArray('west', 'spades')
      let westHandSpades = mapOrder(handwest.filter(item => item[2] == 's'),sortOrder)
      points = calcPoints(westHandSpades)
      let westHandHearts = mapOrder(handwest.filter(item => item[2] == 'h'),sortOrder)
      points = points + calcPoints(westHandHearts)
      let westHandDiamonds = mapOrder(handwest.filter(item => item[2] == 'd'),sortOrder)
      points = points + calcPoints(westHandDiamonds)
      let westHandClubs = mapOrder(handwest.filter(item => item[2] == 'c'),sortOrder)
      points = points + calcPoints(westHandClubs)
      document.getElementById('wPoints').innerText = points
      placeHandAtCardinal("west", westHandSpades, westHandHearts, westHandDiamonds, westHandClubs)
    }

    let cards = document.getElementsByClassName('card')
    let dest = document.getElementById("north-playarea")
    let leftBox= document.getElementById("northspades-card-1")
    let rightBox = document.getElementById("north-playarea")

    document.getElementById('table_board_progress').rows[hand_no].cells[0].innerText = hand_no

    for(card of cards){
      card.addEventListener('dragstart', function(e){
        let selected = e.target;
        console.log(e.target.id)
        console.log(e.target.innerHTML)
        let dest, col
        if(e.target.id.includes('north')){
          dest = document.getElementById('north-playarea')
          col = 1
        }
        else if(e.target.id.includes('east')){
          dest = document.getElementById('east-playarea')
          col = 2
        }
        else if(e.target.id.includes('south')){
          dest = document.getElementById('south-playarea')
          col = 3
        }
        else if(e.target.id.includes('west')){
          dest = document.getElementById('west-playarea')
          col = 4
        }
        dest.addEventListener("dragover", function(e){
          e.preventDefault();
          // console.log(e.target)
        })
        dest.addEventListener("drop", function(e){
          dest.appendChild(selected);
//          document.getElementById('table_board_progress').rows[1].cells[col].innerText = e.target.innerText
//          playingHand[col-1] = e.target.innerText
          playingHand.push(e.target.innerText)
          console.log('Playing hand: ' + playingHand)
          let winningCard = getWinningCard(playingHand,'heart')
          console.log('Winning card: ' + winningCard)
          // card.style.width='100px'
          selected = null;
        })
      })
    }

/*    leftBox.addEventListener("dragstart", function(e){
        let selected = e.target;
        console.log(e.target.id)

        rightBox.addEventListener("dragover", function(e){
          e.preventDefault();
        })
        rightBox.addEventListener("drop", function(e){
          rightBox.appendChild(selected);
          selected = null;
        })
    }) */

  }

  function newBoardClick(deck){
    console.log('newBoard clicked!')
    document.getElementById('nReveal').disabled=false;
    document.getElementById('eReveal').disabled=false;
    document.getElementById('sReveal').disabled=false;
    document.getElementById('wReveal').disabled=false;

    document.getElementById('nPoints').innerHTML = ''

    // handnorth = []
    // handeast = []
    // handsouth = []
    // handwest = []

    deck = fisherYatesShuffle(deck)
    // Step 4 - Split deck into cardinals (north, east, west, south)
    handnorth = deck.slice(0,13)
    handeast = deck.slice(13,26)
    handsouth = deck.slice(26,39)
    handwest = deck.slice(39,52)

    // Step 4 - Display 13 cards facedown at each cardinal
    clearCardDisplayArray('north','spades')
    clearCardDisplayArray('north','hearts')
    clearCardDisplayArray('north','diamonds')
    clearCardDisplayArray('north','clubs')

    clearCardDisplayArray('east','spades')
    clearCardDisplayArray('east','hearts')
    clearCardDisplayArray('east','diamonds')
    clearCardDisplayArray('east','clubs')

    clearCardDisplayArray('south','spades')
    clearCardDisplayArray('south','hearts')
    clearCardDisplayArray('south','diamonds')
    clearCardDisplayArray('south','clubs')

    clearCardDisplayArray('west','spades')
    clearCardDisplayArray('west','hearts')
    clearCardDisplayArray('west','diamonds')
    clearCardDisplayArray('west','clubs')


    for (card of handnorth){
      let value = card[0]
      if(value === 'T') {value = 10}
      placeCard('north','spades',handnorth.indexOf(card)+1,value + card.slice(1),true)
    }
    clearCardDisplayArray('east','spades')
    for (card of handeast){
      let value = card[0]
      if(value === 'T') {value = 10}
      placeCard('east','spades',handeast.indexOf(card)+1,value + card.slice(1),true)
    }
    clearCardDisplayArray('south','spades')
    for (card of handsouth){
      let value = card[0]
      if(value === 'T') {value = 10}
      placeCard('south','spades',handsouth.indexOf(card)+1,value + card.slice(1),true)
    }
    clearCardDisplayArray('west','spades')
    for (card of handwest){
      let value = card[0]
      if(value === 'T') {value = 10}
      placeCard('west','spades',handwest.indexOf(card)+1,value + card.slice(1),true)
    }
  }

  function calcPoints(hand) {
    let total = 0
    for(card of hand) {
      [value, index] = card
      switch(value[0]){
        case 'A':
            total += 4
            break
        case 'K':
            total += 3
            break
        case 'Q':
            total += 2
            break
        case 'J':
            total += 1
            break
      }
    }
    if(hand.length > 4){
      total = total + (hand.length - 4)
    }
    return total
  }

  // let hand = ['A&spadesuit;','K&spadesuit;','7&spadesuit;','6&spadesuit;','5&spadesuit;','3&spadesuit;']
  // let handPoints = calcPoints(hand)
  // console.log(handPoints)



  // Step 1 - Create deck of cards

  let deck = ['As','Ks','Qs','Js','Ts','9s','8s','7s','6s','5s','4s','3s','2s',
              'Ah','Kh','Qh','Jh','Th','9h','8h','7h','6h','5h','4h','3h','2h',
              'Ad','Kd','Qd','Jd','Td','9d','8d','7d','6d','5d','4d','3d','2d',
              'Ac','Kc','Qc','Jc','Tc','9c','8c','7c','6c','5c','4c','3c','2c'
            ]


  // Step 2 - Shuffel deck
  // deck = fisherYatesShuffle(deck)
  let newBoard = document.getElementById('newBoard')
  newBoard.addEventListener('click',(evt) => newBoardClick(deck))
  //console.log(evt)


  // Step 3 - Replace symbols
  deck = deck.map(replaceSuitSymbols)




  // Step 5 - At North cardinal, click Reveal to sort cards into suits (spades, hearts, diamonds, clubs)

  nReveal = document.getElementById('nReveal')
  nReveal.addEventListener('click',(evt) => nRevealClick(handnorth,"north"))

  eReveal = document.getElementById('eReveal')
  eReveal.addEventListener('click',(evt) => nRevealClick(handeast,"east"))

  sReveal = document.getElementById('sReveal')
  sReveal.addEventListener('click',(evt) => nRevealClick(handsouth,"south"))

  wReveal = document.getElementById('wReveal')
  wReveal.addEventListener('click',(evt) => nRevealClick(handwest,"west"))



/*
let myCards = ['A','K','Q','J','10','9','8','7','6','5','4','3','2']

for (let [i,card] of myCards.entries()) {
  console.log(i)
  placeCard('east','hearts',i+1,card + '&hearts;')
  placeCard('north','spades',i+1,card + '&spades;')
}*/

/*placeCard('east','spades',1,'A&spadesuit;')

let myCard = document.getElementById('eastspades-card-1')
console.log(myCard.innerText)

placeCard('east','hearts',6,'K&heartsuit;')

myCard = document.getElementById('easthearts-card-6')
console.log(myCard.innerText)*/


/*
let hand2 = hand1.map(function(item) {
  if(item.includes('s')){item = item.replace('s','&spadesuit;'); return item}
  else if(item.includes('d')){item = item.replace('d','&diamondsuit;'); return item}
})
*/




// Split hand into cardinals (north, east, south, west) arrays





// console.log(fisherYatesShuffle(hand52));

/*
function SortCards(cardsToSort) {
  for (let [i,card] of cardsToSort.entries()) {
    if (card.includes('A')){ card.replace('A','14')}
    else if (card.includes('K')){ card.replace('K','13')}
    else if (card.includes('Q')){ card.replace('Q','12')}
    else if (card.includes('J')){ card.replace('J','11')}
    else if (card.includes('T')){ card.replace('T','10')}
  }
  cardsToSort.sort().reverse()
  return cardsToSort
}*/






//let northHandSpades = handnorth.filter(item => item[2] == 's') 
/*let northHandSpades = mapOrder(handnorth.filter(item => item[2] == 's'),sortOrder)
let northHandHearts = mapOrder(handnorth.filter(item => item[2] == 'h'),sortOrder)
let northHandDiamonds = mapOrder(handnorth.filter(item => item[2] == 'd'),sortOrder)
let northHandClubs = mapOrder(handnorth.filter(item => item[2] == 'c'),sortOrder)

let eastHandSpades = mapOrder(handeast.filter(item => item[2] == 's'),sortOrder)
let eastHandHearts = mapOrder(handeast.filter(item => item[2] == 'h'),sortOrder)
let eastHandDiamonds = mapOrder(handeast.filter(item => item[2] == 'd'),sortOrder)
let eastHandClubs = mapOrder(handeast.filter(item => item[2] == 'c'),sortOrder)

let southHandSpades = mapOrder(handsouth.filter(item => item[2] == 's'),sortOrder)
let southHandHearts = mapOrder(handsouth.filter(item => item[2] == 'h'),sortOrder)
let southHandDiamonds = mapOrder(handsouth.filter(item => item[2] == 'd'),sortOrder)
let southHandClubs = mapOrder(handsouth.filter(item => item[2] == 'c'),sortOrder)

let westHandSpades = mapOrder(handwest.filter(item => item[2] == 's'),sortOrder)
let westHandHearts = mapOrder(handwest.filter(item => item[2] == 'h'),sortOrder)
let westHandDiamonds = mapOrder(handwest.filter(item => item[2] == 'd'),sortOrder)
let westHandClubs = mapOrder(handwest.filter(item => item[2] == 'c'),sortOrder)

console.log('northHandSpades is: ' + northHandSpades)
console.log('northHandHearts is: ' + northHandHearts)
console.log('northHandDiamonds is: ' + northHandDiamonds)
console.log('northHandClubs is: ' + northHandClubs)*/

// Sort array in high-card order

// Render a card array to a cardinal position (north, east, south, west)




// let order = ['A','K','Q','J','T','9','8','7','6','5','4','3','2']
// let sortTest = ['9&heartsuit;','J&heartsuit;','6&heartsuit;','4&heartsuit;']

// SortCards(sortTest)
// console.log(sortTest)

/*
let northHand = [...northHandSpades,...northHandHearts,...northHandDiamonds,...northHandClubs]
console.log("northHand is:" + northHand)

for (card of northHand){
  let value = card[0]
  if(value === 'T') {value = 10}
  console.log(value + card.slice(1))
  placeCard('north','spades',northHand.indexOf(card)+1,value + card.slice(1),true)
} 

function nRevealClick(){
  console.log('nReveal clicked!')
}

nReveal = document.getElementById('nReveal')
nReveal.addEventListener('click',nRevealClick)
*/

/*elem = document.querySelector(".js-sh-value1")
elem.innerHTML = `<img margin-left: -35px; width=25rem src="8H.svg" draggable="true" ondragstart="dragstartHandler(event)">`
elem = document.querySelector(".js-sh-value2")
elem.innerHTML = `<img margin-left: -35px; width=25rem src="5H.svg" draggable="true" ondragstart="dragstartHandler(event)">`
elem = document.querySelector(".js-ns-value2")
elem.innerHTML = 'K'
elem = document.querySelector(".js-ns-value3")
elem.innerHTML = 'Q'
elem = document.querySelector(".js-ns-value4")
elem.innerHTML = 'J'
elem = document.querySelector(".js-ns-value5")
elem.innerHTML = 'T'
*/



/*
rightBox.addEventListener("dragstart", function(e){
    let selected = e.target;

    leftBox.addEventListener("dragover", function(e){
      e.preventDefault();
    })
    leftBox.addEventListener("drop", function(e){
      leftBox.appendChild(selected);
      selected = null;
    })
}) */

    /*
let north = document.getElementById("north")
console.log(north)

// Now create and append to iDiv
var innerDiv = document.createElement('div');
innerDiv.className = 'card spades ns-card-1';
innerDiv.id = 'ns-card-1'
innerDiv.innerHTML = 'A&spadesuit;'
north.appendChild(innerDiv); */

let myHand = ['4&spadesuit;','J&spadesuit;','K&spadesuit;','9&spadesuit;']
//for(myCard of myHand) {
//  if (myCard.includes('J')) {console.log('Yes;'); console.log(myCard[0]); myCard[0].replace('J','11')}
//}

// Replace A, K, Q, J with 14, 13, 12, 11 to allow comparisons
let modHand = []
for (let [i,card] of myHand.entries()) {
  if (card.includes('A')){ card.replace('A','14')}
  else if (card.includes('K')){ modHand[i] = card.replace('K','13')}
  else if (card.includes('Q')){ modHand[i] = card.replace('Q','12')}
  else if (card.includes('J')){ modHand[i] = card.replace('J','11')}
  else if (card.includes('T')){ modHand[i] = card.replace('T','10')}
  else modHand[i] = card
}
console.log(modHand)

// Extract the numbers only
let modHand2 = []
for(let [i,num] of modHand.entries()) {
  modHand2[i] = parseInt(num.match(/\d*/)[0], 10)
  console.log(modHand2[i])
  console.log(typeof(modHand2[i]))
}
console.log(modHand2)

// parseInt("1000", 10)

console.log(Math.max(...modHand2))

let i = modHand2.indexOf(Math.max(...modHand2));
console.log(i)


// If diamonds are trumps add 100 to the index

//let trump = 100
//console.log(weightedCards.indexOf('2&diamondsuit;'))
//console.log(weightedCards.indexOf('2&diamondsuit;') + trump > weightedCards.indexOf('A&spadesuit'))

//myHand = ['2&heartsuit;','J&diamondsuit;','K&spadesuit;','2&diamondsuit;']
myHand = ['J&diamondsuit;','J&diamondsuit;','J&diamondsuit;','K&spadesuit;','2&diamondsuit;']
console.log(myHand)
let trumps = 'heart'
let winningCard = getWinningCard(myHand,trumps)
console.log('Winning Card: ' + winningCard)

}






