import { Display } from "./display";
import { HUD } from "./hud";
import { Observer } from "./observer";

export enum HUDEventType {
    HandStarted,
    HandEnded,
    SmallBlind,
    BigBlind,
    Flop,
    Turn,
    River,
    PlayerLeft,
    PlayerJoined,
    PlayerSittingOut,
    PlayerBackIn,
    Other,
    PutInPot,
}

export type HUDEvent = {
    type: HUDEventType,
    data: object,
};

declare global {
  interface GlobalThis {
    display?: Display;
    observer?: Observer;
    hud?: HUD;
  }
}