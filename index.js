let cardData = [];
let deckId = "";
let isOn = false;
let cardValues = [];
let balance = 1000;
const betVolume = [100, 200, 500, 1000];

const pointText = $(".point-text");
const bankerPointText = $("#banker-point-text");
const playerPointText = $("#player-point-text");
const startBtn = $("#start");
const restartBtn = $("#restart");
const bankerCard = $("#banker-card");
const playerCard = $("#player-card");
const result = $("#result");

function sendHttpReq(method, url, data) {
  return axios.get(url);
}

function fetchCardsProperties() {
  sendHttpReq(
    "GET",
    "https://www.deckofcardsapi.com/api/deck/new/draw/?count=2"
  )
    .then(({ data }) => {
      cardData = data.cards;
      deckId = data.deck_id;
    })
    .catch((err) => console.error(`Error Msg: ${err}`));
}

startBtn.click(() => {
  bankerData();
  setTimeout(() => {
    playerData();
  }, 1000);
  setTimeout(() => {
    ranking(cardValues[0], cardValues[1]);
  }, 2000);
  isOn = true;
  newGameBtn();
});

function newGameBtn() {
  if (isOn) {
    startBtn.css("display", "none");
    restartBtn.css("display", "block");
    pointText.css("display", "inline");
  }
  if (!isOn) {
    startBtn.css("display", "block");
    restartBtn.css("display", "none");
    pointText.css("display", "hidden");
  }
}

function getRndNum(min, max) {
  return Math.random() * (max - min) + min;
}

function bankerData() {
  cardNumberConverter(cardData[0].value);
  bankerCard.append(
    `<img id="banker-card-image" src="${cardData[0].image}" alt="">`
  );
  gsap.from("#banker-card-image", {
    x: getRndNum(0, 800),
    y: -500,
    duration: 0.2,
  });
  bankerPointText.text(cardValues[0]);
}

function playerData() {
  cardNumberConverter(cardData[1].value);
  playerCard.append(
    `<img id="player-card-image" src="${cardData[1].image}" alt="">`
  );
  gsap.from("#player-card-image", {
    x: getRndNum(0, -800),
    y: 500,
    duration: 0.2,
  });

  playerPointText.text(cardValues[1]);
}

function cardNumberConverter(card) {
  if (typeof card === "string") {
    cardValues.push(card);
  } else if (card === "ACE") {
    cardValues.push(14);
  } else if (card === "JACK") {
    cardValues.push(11);
  } else if (card === "QUEEN") {
    cardValues.push(12);
  } else if (card === "KING") {
    cardValues.push(13);
  }
}

function ranking(banker, player) {
  if (banker === player) {
    result.html("<h4>TIE!</h4>");
  } else if (banker > player) {
    result.html("<h4>YOU LOSE!</h4>");
  } else if (banker < player) {
    result.html("<h4>YOU WIN!</h4>");
  }
}

restartBtn.click(() => {
  isOn = false;
  newGameBtn();
  playerCard.empty();
  bankerCard.empty();
  result.empty();
  bankerPointText.text("");
  playerPointText.text("");
  fetchCardsProperties();
  cardValues = [];
});

window.addEventListener("load", fetchCardsProperties);
