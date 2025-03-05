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
    private currentStreetPotContr = new Array<number>(6);
    private currentStreet = "preflop";
    private smallBlindPos = -1;
    private bigBlindPos = -1;
    private amountToCall = 0;

    // stats
    private numHands = 0;
    private vpip_this_hand = new Array<boolean>(6);
    private vpip = new Array<number>(6);
    private pfr = new Array<number>(6);


    private hudCleanStart = false;


    constructor(display: Display) {
        // hardcoded for now
        this.numSeats = 6;
        this.bigBlind = 0.05;
        this.smallBlind = 0.02;
        this.display = display;

        this.display.update("I work!")
    }


    public onEvent(event: HUDEvent) {
        switch (event.type) {
            case HUDEventType.HandStarted:
                this.handleHandStarted();
                break;
            case HUDEventType.HandEnded:
                this.handleHandEnded();
                break;
            case HUDEventType.SmallBlind:
                break;
            case HUDEventType.BigBlind:
                break;
            case HUDEventType.Flop:
                this.handleFlop();
                break;
            case HUDEventType.Turn:
            case HUDEventType.River:
            case HUDEventType.PlayerLeft:
            case HUDEventType.PlayerJoined:
            case HUDEventType.PlayerSittingOut:
            case HUDEventType.PlayerBackIn:
                break
            case HUDEventType.Other:
                this.display.update(JSON.stringify(event.data));
                break;
            case HUDEventType.PutInPot:
                const {seat, amount} = event.data as {seat: number, amount: number};
                this.handlePutInPot(seat, amount);
                break;
        }
        this.updateDisplay();
    }

    private handleHandStarted() {
        this.display.update("New hand!");
        for (let i = 0; i < this.numSeats; i++) {
            this.currentStreetPotContr[i] = 0;
            this.vpip_this_hand[i] = false;
        }
        this.currentStreet = "preflop";
        this.smallBlindPos = -1;
        this.bigBlindPos = -1;
        this.amountToCall = this.bigBlind;
    }

    private handleFlop() {
        console.log("Flop!")
        this.currentStreet = "flop";
    }

    private handleHandEnded() {
        if (!this.hudCleanStart) {
            this.trueInitHUD();
        }
        for (let i = 0; i < this.numSeats; i++) {
            if (this.vpip_this_hand[i]) this.vpip[i]! += 1;
        }
        this.numHands += 1;
    }

    private trueInitHUD() {
        this.hudCleanStart = true;
        this.numHands = 0;
        for (let i = 0; i < this.numSeats; i++) {
            this.pfr[i] = 0;
            this.vpip[i] = 0;
        }
    }

    private handlePutInPot(seat: number, amount: number) {
        if (!this.hudCleanStart) return;

        if (Number.isNaN(amount)) return;

        if (amount <= this.currentStreetPotContr[seat]!) return;
        this.currentStreetPotContr[seat] = amount;

        console.log(`Seat ${seat} puts in ${amount}`);

        if (((this.bigBlindPos < 0) || (this.bigBlindPos === seat)) && amount === this.bigBlind) {
            this.bigBlindPos = seat;
        }
        else if (((this.smallBlindPos < 0) || (this.smallBlindPos === seat)) && amount === this.smallBlind) {
            this.smallBlindPos = seat;
        }
        else {
            if (this.currentStreet == "preflop") {
                console.log(`incrementing vpip: ${seat} ${amount}`);
                this.vpip_this_hand[seat] = true;
                if (amount > this.amountToCall) this.pfr[seat]! += 1;
            }
        }

        if (amount > this.amountToCall) this.amountToCall = amount;
    }

    private updateDisplay() {
        if (!this.hudCleanStart) {
            this.display.update("waiting for next hand...")
            return;
        }
        let textToDisplay = "<p>Ishank's HUD:</p><br />";
        for (let i = 0; i < this.numSeats; i++) {
            textToDisplay += `<p>Seat ${i+1}</p>`
            textToDisplay += `<p> - vpip: ${this.vpip[i]!}/${this.numHands}</p>`
        }
        this.display.update(textToDisplay);
    }
}