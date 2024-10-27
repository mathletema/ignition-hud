/*******************************************************************************
 * CONSTANTS
 ******************************************************************************/

const MAX_PLAYERS = 6;
const BIG_BLIND = 0.05;
const SMALL_BLIND = 0.02;
document =
  window.parent.document.querySelector(`[title="Table slot"]`).contentWindow
    .document;

/*******************************************************************************
 * DOM Elements
 ******************************************************************************/

let getWindowDOM = () => {
  return document.querySelector('[data-qa="table"]');
};

let getCommunityDOM = () => {
  return document.querySelector(".f34l2e8");
};

let getPlayerDOM = (i) => {
  return document.querySelector(`[data-qa="playerContainer-${i}"]`);
};

/*******************************************************************************
 * Game state scrapers
 ******************************************************************************/

let getPlayerBet = (i) => {
  let betDOM = getPlayerDOM(i).querySelector(".flytr4");
  return betDOM ? betDOM.innerText : null;
};

let getSeatBanner = (i) => {
  bannerDOM = getPlayerDOM(i).querySelector(".ffnz569");
  return bannerDOM ? bannerDOM.innerText : "";
};

let getCurrentStreet = () => {
  let community = getCommunityDOM();
  if (community.style.opacity == "0") return "preflop";
  if (community.children[4].style.visibility == "hidden") return "river";
  if (community.children[3].style.visibility == "hidden") return "table";
  if (community.children[0].style.visibility == "hidden") return "flop";
  console.log("getCurrentStreet: something went wrong");
  return null;
};

let getBTNPosition = () => {
  for (let i = 0; i < MAX_PLAYERS; i++) {
    let playerDOM = getPlayerDOM(i);
    if (
      playerDOM != null &&
      playerDOM.querySelector(".fm87pe9").style.visibility == "visible"
    )
      return i;
  }
  console.log("getBTNPosition: something went wrong");
  return -1;
};

let getHeroPosition = () => {
  for (let i = 0; i < MAX_PLAYERS; i++) {
    if (getPlayerDOM(i).classList.contains("myPlayer")) return i;
  }
};

let getSBPosition = () => {
  for (let i = 0; i < MAX_PLAYERS; i++) {
    if (getPlayerBet(i) == `\$${SMALL_BLIND}`) {
      return i;
    }
  }
  return -1;
};

let getBBPosition = () => {
  for (let i = 0; i < MAX_PLAYERS; i++) {
    if (getPlayerBet(i) == `\$${BIG_BLIND}`) {
      return i;
    }
  }
  return -1;
};

let getActionPosition = () => {
  for (let i = 0; i < MAX_PLAYERS; i++) {
    if (getPlayerDOM(i).querySelector(".fghgvzm") != null) return i;
  }
  return -1;
};

let getSittingOutPlayers = () => {
  let players = [];
  for (let i = 0; i < MAX_PLAYERS; i++) {
    if (getPlayerDOM(i).querySelector(".f1p7lubp").innerText != "SITTING OUT") {
      players.push(i);
    }
  }
  return players;
};

let getEmptySeats = () => {
  let players = [];
  for (let i = 0; i < MAX_PLAYERS; i++) {
    if (
      getPlayerDOM(0).querySelector('[data-qa="player-empty-seat-panel"]') !=
      null
    ) {
      players.push(i);
    }
  }
  return players;
};

/*******************************************************************************
 * Player class
 ******************************************************************************/

class Player {
  constructor() {
    this.id = Math.floor(Math.random() * 1e6);

    this.n = 0;
    this.vpip = 0;
    this.pfir = 0;
  }
}

/*******************************************************************************
 * Hand class
 ******************************************************************************/

class Hand {
  constructor(table_size, dealer_seat, hero_player_id, players) {
    this.table_size = table_size;
    this.dealer_seat = dealer_seat;
    this.hero_player_id = hero_player_id;
    this.players = players;
    this.rounds = [];
  }
}

/*******************************************************************************
 * Game class
 ******************************************************************************/

class Game {
  constructor() {
    this.root = getWindowDOM();

    this.BTNPosition = getBTNPosition();
    console.log("Game object created, btn position", this.BTNPosition);
    this.SBPosition = -1;
    this.BBPosition = -1;
    this.currentActionOn = -1;

    this.banners = [...Array(MAX_PLAYERS).keys()].map((_, seat) =>
      getSeatBanner(seat)
    );

    this.gameStarted = false;
    this.hands = [];
    this.players = [];
    this.currentHand = null;
    this.currentStreet = null;

    this.gameState = "reset";

    this.observer = new MutationObserver((mlist, obs) => {
      this.handleBTNMove();
      if (!this.gameStarted) return;

      this.handleActionMove();
      this.handleBannerChange();
      this.handleNewStreet();
      // this.handlePlayerChange();
    });
  }
}

Game.prototype.startObserver = function () {
  this.observer.observe(root, {
    childList: true,
    subtree: true,
    attributes: true,
  });
};

Game.prototype.stopObserver = function () {
  this.observer.disconnect();
};

Game.prototype.handleHandOver = function () {
  lastHand = this.currentHand;
  this.hands.push(lastHand);
  this.currentHand = new Hand(null, null, null, null);
  console.log("last hand over");

  // this.players.forEach((player) => {
  //   vpip = false;
  //   pfr = false;

  //   preFlopRound = this.currentHand.rounds[0];

  //   for (let i = 0; i < preFlopRound.actions.length; i++) {
  //     action = preFlopRound.actions[i];
  //     if (action.player_id != player.id) return;

  //     if (action.action == "raise") {
  //       vpip = true;
  //       pfr = true;
  //     }

  //     if (action.action == "call") {
  //       vpip = true;
  //     }
  //   }

  //   player.n += 1;
  //   player.vpip += vpip;
  //   player.pfr += pfr;
  // });
};

/*******************************************************************************
 * Event Handlers
 ******************************************************************************/

Game.prototype.handleBTNMove = function () {
  let newBTNPosition = getBTNPosition();
  if (newBTNPosition == this.BTNPosition) return;
  this.BTNPosition = newBTNPosition;
  console.log("BTN moved to", this.BTNPosition);

  if (!this.gameStarted) {
    this.gameStarted = true;
    console.log("First hand!");

    this.banners = [...Array(MAX_PLAYERS).keys()].map((_, seat) =>
      getSeatBanner(seat)
    );
    this.currentHand = new Hand(null, null, null, null);
  } else {
    this.handleHandOver();
  }
};

Game.prototype.handleActionMove = function () {
  let newActionOn = getActionPosition();
  if (newActionOn == this.currentActionOn) return;
  if (newActionOn == -1) return;
  this.currentActionOn = newActionOn;

  console.log("action on", newActionOn);
};

Game.prototype.handleBannerChange = function () {
  for (let i = 0; i < MAX_PLAYERS; i++) {
    let newBanner = getSeatBanner(i);
    if (newBanner == this.banners[i]) continue;
    this.banners[i] = newBanner;
    if (newBanner == "") continue;

    rounds = this.currentHand.rounds;
    curRound = rounds[rounds.length - 1];

    switch (newBanner) {
      case "POST SB":
        console.log(`player ${i} posts sb ${getPlayerBet(i)}`);
        break;
      case "POST BB":
        console.log(`player ${i} posts sb ${getPlayerBet(i)}`);
        break;
      case "FOLD":
        console.log(`player ${i} folds`);
        break;
      case "CHECK":
        console.log(`player ${i} checks`);
        break;
      case "CALL":
        console.log(`player ${i} calls ${getPlayerBet(i)}`);
        break;
      case "BET":
        console.log(`player ${i} bets ${getPlayerBet(i)}`);
        break;
      case "RAISE":
        console.log(`player ${i} raise ${getPlayerBet(i)}`);
        break;
      case "ALL-IN":
        console.log(`player ${i} goes all in`);
      default:
        console.log(`player ${i}, unknown action ${newBanner}`);
        break;
    }
  }
};

Game.prototype.handleNewStreet = function () {
  let newStreet = getCurrentStreet();
  if (newStreet == this.currentStreet) return;
  this.currentStreet = newStreet;
  switch (newStreet) {
    case "preflop":
      console.log("preflop");
      this.currentHand.rounds.push({
        id: 0,
        street: "preflop",
        actions: [],
      });
      break;
    case "flop":
      console.log("flop");
      this.currentHand.rounds.push({
        id: 1,
        street: "flop",
        actions: [],
      });
      break;
    case "turn":
      console.log("turn");
      this.currentHand.rounds.push({
        id: 2,
        street: "turn",
        actions: [],
      });
      break;
    case "river":
      console.log("river");
      this.currentHand.rounds.push({
        id: 3,
        street: "river",
        actions: [],
      });
      break;
    default:
      break;
  }
};
