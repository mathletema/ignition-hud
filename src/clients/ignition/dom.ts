export function getTableIframe () : Document {
    const iframe: HTMLIFrameElement = document.querySelector('iframe[data-multitableslot="0"]')!
    return iframe.contentWindow!.document;
}

export function getWindowDOM () : HTMLElement | null {
    return getTableIframe().querySelector('[data-qa="table"]')!;
};

export function getTotalPot () : number {
    const span: HTMLSpanElement = getTableIframe().querySelector('span[data-qa="totalPot"]')!; 
    return Number.parseFloat(span.innerText.split('$')[1]!);
}

// let getCommunityDOM = () => {
//     return document.querySelector(".f34l2e8");
// };

// let getPlayerDOM = (i: number) => {
//     return document.querySelector(`[data-qa="playerContainer-${i}"]`);
// };

// function getTotalPotDOM () {
//     return document.querySelector('span[data-qa="totalPot"]');
// }


// let getPlayerBet = (i: number) => {
//   let betDOM = getPlayerDOM(i)!.querySelector(".flytr4");
//   return betDOM ? betDOM.innerText : null;
// };

// let getSeatBanner = (i) => {
//   bannerDOM = getPlayerDOM(i).querySelector(".ffnz569");
//   return bannerDOM ? bannerDOM.innerText : "";
// };

// let getCurrentStreet = () => {
//   let community = getCommunityDOM();
//   if (community.style.opacity == "0") return "preflop";
//   if (community.children[4].style.visibility == "hidden") return "river";
//   if (community.children[3].style.visibility == "hidden") return "table";
//   if (community.children[0].style.visibility == "hidden") return "flop";
//   console.log("getCurrentStreet: something went wrong");
//   return null;
// };

// let getBTNPosition = () => {
//   for (let i = 0; i < MAX_PLAYERS; i++) {
//     let playerDOM = getPlayerDOM(i);
//     if (
//       playerDOM != null &&
//       playerDOM.querySelector(".fm87pe9").style.visibility == "visible"
//     )
//       return i;
//   }
//   console.log("getBTNPosition: something went wrong");
//   return -1;
// };

// let getHeroPosition = () => {
//   for (let i = 0; i < MAX_PLAYERS; i++) {
//     if (getPlayerDOM(i).classList.contains("myPlayer")) return i;
//   }
// };

// let getSBPosition = () => {
//   for (let i = 0; i < MAX_PLAYERS; i++) {
//     if (getPlayerBet(i) == `\$${SMALL_BLIND}`) {
//       return i;
//     }
//   }
//   return -1;
// };

// let getBBPosition = () => {
//   for (let i = 0; i < MAX_PLAYERS; i++) {
//     if (getPlayerBet(i) == `\$${BIG_BLIND}`) {
//       return i;
//     }
//   }
//   return -1;
// };

// let getActionPosition = () => {
//   for (let i = 0; i < MAX_PLAYERS; i++) {
//     if (getPlayerDOM(i).querySelector(".fghgvzm") != null) return i;
//   }
//   return -1;
// };

// let getSittingOutPlayers = () => {
//   let players = [];
//   for (let i = 0; i < MAX_PLAYERS; i++) {
//     if (getPlayerDOM(i).querySelector(".f1p7lubp").innerText != "SITTING OUT") {
//       players.push(i);
//     }
//   }
//   return players;
// };

// let getEmptySeats = () => {
//   let players = [];
//   for (let i = 0; i < MAX_PLAYERS; i++) {
//     if (
//       getPlayerDOM(0).querySelector('[data-qa="player-empty-seat-panel"]') !=
//       null
//     ) {
//       players.push(i);
//     }
//   }
//   return players;
// };