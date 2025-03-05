import { Display } from "./display";
import { getWindowDOM } from "./dom";
import { HUDEvent, HUDEventType } from "./types";

export class HUD {
    private numSeats: number;
    private bigBlind: number;
    private smallBlind: number;
    private eventQueue = new Array<Object>();
    private display: Display;

    private handCurrentlyPlaying: boolean = false;

    constructor(display: Display) {
        // hardcoded for now
        this.numSeats = 6;
        this.bigBlind = 0.10;
        this.smallBlind = 0.05;
        this.display = display;

        this.display.update("I work!")
    }


    public onEvent(event: HUDEvent) {
        switch (event.type) {
            case HUDEventType.HandStarted:
                this.display.update("Hand started!");
                break;
            case HUDEventType.HandEnded:
                this.display.update("Hand ended!");
                break;
            case HUDEventType.SmallBlind:
            case HUDEventType.BigBlind:
            case HUDEventType.Flop:
            case HUDEventType.Turn:
            case HUDEventType.River:
            case HUDEventType.PlayerLeft:
            case HUDEventType.PlayerJoined:
            case HUDEventType.PlayerSittingOut:
            case HUDEventType.PlayerBackIn:
                break
            case HUDEventType.Other:
                this.display.update(JSON.stringify(event.data));
        }
    }
}