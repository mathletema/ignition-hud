const MAX_PLAYERS = 6;
const BIG_BLIND = 0.05;
const SMALL_BLIND = 0.02;

let getWindowDOM = () => {
  return document.querySelector('[data-qa="table"]');
};

let getCommunityDOM = () => {
  return document.querySelector(".f34l2e8");
};

let getPlayerDOM = (i) => {
  return document.querySelector(`[data-qa="playerContainer-${i}"]`);
};

let getPlayerBet = (i) => {
  betDOM = getPlayerDOM(i).querySelector(".flytr4");
  return betDOM ? betDOM.innerText : null;
};

let getCurrentStreet = () => {
  community = getCommunityDOM();
  if (community.style.opacity == "0") return "preflop";
  if (community.children[4].style.visibility == "hidden") return "river";
  if (community.children[3].style.visibility == "hidden") return "table";
  if (community.children[0].style.visibility == "hidden") return "flop";
  console.log("getCurrentStreet: something went wrong");
  return null;
};

let getBTNPosition = () => {
  for (let i = 0; i < MAX_PLAYERS; i++) {
    if (getPlayerDOM(i).querySelector(".fm87pe9").style.visibility == "visible")
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
  if (SBPosition != -1) return SBPosition;
  for (let i = 0; i < MAX_PLAYERS; i++) {
    if (getPlayerBet(i) == `\$${SMALL_BLIND}`) {
      SBPosition = i;
      return i;
    }
  }
  return -1;
};

let getBBPosition = () => {
  if (SBPosition != -1) return SBPosition;
  for (let i = 0; i < MAX_PLAYERS; i++) {
    if (getPlayerBet(i) == `\$${BIG_BLIND}`) {
      SBPosition = i;
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
    if (getPlayerDOM(i).querySelector('.f1p7lubp').innerText != "SITTING OUT") {
      players.push(i);
    }
  }
  return players;
}

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

let BTNPosition = getBTNPosition();
let SBPosition = -1;
let BBPosition = -1;
let currentStreet = "preflop";
let currentActionOn = -1;

const observer = new MutationObserver((mlist, obs) => {
  if (getBTNPosition() != BTNPosition) {
    BTNPosition = getBTNPosition();
    SBPosition = -1;
    BBPosition = -1;
    console.log("BTN just moved to", BTNPosition);
  }

  if (getCurrentStreet() != currentStreet) {
    currentStreet = getCurrentStreet();
    console.log("New street:", currentStreet);
  }

  if (currentStreet == "preflop" && getSBPosition() != SBPosition) {
    SBPosition == getSBPosition();
    console.log("SB Position:", SBPosition);
  }

  if (currentStreet == "preflop" && getBBPosition() != SBPosition) {
    BBPosition == getBBPosition();
    console.log("BB Position:", BBPosition);
  }

  if (getActionPosition() != currentActionOn) {
    let lastActionOn = currentActionOn;
    currentActionOn = getActionPosition();

    console.log("Action on", currentActionOn);
    console.log("Last player bet", getPlayerBet(lastActionOn));
  }
});

let startObserver = () => {
  let root = getWindowDOM();
  observer.observe(root, {
    childList: true,
    subtree: true,
    attributes: true,
  });
};

let stopObersver = () => {
  observer.disconnect();
};
