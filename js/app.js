const deck = document.querySelector(".deck");
const newGame = document.querySelector(".restart");
let moves = document.querySelector(".moves");
let clickCounter = 0;
let openCards = document.getElementsByClassName("open");
let openArray = [];
let matches = document.getElementsByClassName("match");
let stars = document.querySelector(".stars");
let starRating;
let modal = document.getElementById("end-modal");
let modalText = document.getElementById("end-text");
const newGameBtn = document.getElementById("newGame");
const endGameBtn = document.getElementById("closeGame");
let timer = document.querySelector(".timer");
let seconds = 0;
let running;
let timerClicked = false;

let cards = ["fa-diamond", "fa-diamond",
  "fa-paper-plane-o", "fa-paper-plane-o",
  "fa-anchor", "fa-anchor",
  "fa-bolt", "fa-bolt",
  "fa-cube", "fa-cube",
  "fa-leaf", "fa-leaf",
  "fa-bicycle", "fa-bicycle",
  "fa-bomb", "fa-bomb"
];

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

// Starts the game. Delete old game and stats
function startNewGame() {
  seconds = 0;
  clearInterval(running);
  deck.innerHTML = "";
  starRating = 3;
  createDeck();
  clickCounter = 0;
  moves.innerText = "0 Moves";
  timer.innerText = "0 Seconds";
  console.log("New Deck created");
  openArray = [];
  stars.innerHTML = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>'
}

// Counts the seconds
function stopwatch() {
  running = setInterval(function() {
    seconds++;
    timer.innerText = seconds + " Seconds";
  }, 1000)
}

// Flips cards over by removing open and show classes
function flip() {
  openArray[0].classList.remove("open", "show");
  openArray[1].classList.remove("open", "show");
  openArray = [];
}

//  Removes open and show. Sets match classes
function match() {
  openArray[0].classList.add("match");
  openArray[0].classList.remove("open", "show");
  openArray[1].classList.add("match");
  openArray[1].classList.remove("open", "show");
  openArray = [];
}

// Compares open cards
function compare() {
  if (openArray[0].innerHTML == openArray[1].innerHTML) {
    match();
  } else {
    setTimeout(function() {
      flip();
    }, 1000);
    // Give user time to memorize cards before flipping them over
  }
}

// Number of stars change depending on the number of clicks
function starCounter() {
  if (clickCounter <= 10) {
    starRating = 3;
    stars.innerHTML = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>'
  } else if (clickCounter > 10 && clickCounter <= 13) {
    starRating = 2;
    stars.innerHTML = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>'
  } else {
    starRating = 1;
    stars.innerHTML = '<li><i class="fa fa-star"></i>'
  }
}

// When all matches found a box opens up and timer stops
function gameOver() {
  if (matches.length === cards.length) {
    clearInterval(running);
    modal.style.display = "block";
    if (starRating >= 2) {
      modalText.innerText = `Congratulations! You finished the game in ${clickCounter} moves in ${seconds} seconds. You've earned ${starRating} stars! What would you like to do next?`;
    } else {
      modalText.innerText = `Congratulations! You finished the game in ${clickCounter} moves in ${seconds} seconds. You've earned ${starRating} star! What would you like to do next?`;
    }
  }
}

// Counts each pair of cards clicked
function count() {
  clickCounter += 0.5;
  console.log("clicks: " + clickCounter);
  if (clickCounter === 0 || clickCounter === 0.5) {
    moves.innerText = "0 Moves";
  } else if (clickCounter === 1 || clickCounter === 1.5) {
    moves.innerText = Math.floor(clickCounter) + " Move";
  } else {
    moves.innerText = Math.floor(clickCounter) + " Moves";
  }
}

function createDeck() {
  cards = shuffle(cards);
  console.log(cards);
  timerClicked = false;
  for (i = 0; i < cards.length; i++) {
    const newCard = document.createElement("li");
    newCard.classList.add("card");
    deck.appendChild(newCard);
    const icon = document.createElement("i");
    icon.classList.add("fa", cards[i]);
    newCard.appendChild(icon);
  }
}
createDeck();

// When the restart button is clicked
newGame.addEventListener("click", function() {
  startNewGame();
})

// Flips card and shows on click
deck.addEventListener("click", function(event) {
  if (event.target.nodeName == "LI" && openCards.length < 2 && !event.target.classList.contains("match") && !event.target.classList.contains ("open")){
    //Event will not fire when - UL is clicked instead of LI - AND when 2 cards are already open - AND when
    //the target element already has class match

    // -- need add to click event above that card clicked does not contain class "open"

    if (timerClicked == false) {
      stopwatch();
    }
    timerClicked = true;
    event.target.classList.add("open", "show");
    openArray.push(event.target);
    count();
    if (openArray.length === 2) {
      compare();
      starCounter();
    }
    gameOver();
  }
})

endGameBtn.addEventListener("click", function() {
  modal.style.display = "none";
})

newGameBtn.addEventListener("click", function() {
  modal.style.display = "none";
  startNewGame();
})
