import { getTotalPot, playerBanner, playerPutsIn, seenFlop } from "./dom";
import { HUD } from "./hud";
import { HUDEventType } from "./types";

export class Observer {
    private domObserver: MutationObserver;
    private hud: HUD;

    private currentlyPlaying = false;
    private flopSeen = false;
    private banners = new Array<number>(6);

    constructor(hud: HUD, target: HTMLElement) {
        this.domObserver = new MutationObserver((() => {this.observe();}).bind(this)); 
        this.hud = hud;
        this.domObserver.observe(target, {
            childList: true,
            subtree: true,
            attributes: true
        });
    }

    observe() {
        this.checkNewHand();
        this.checkFlop();
        for (let i = 0; i < 6; i++) this.checkBanner(i);
    }

    checkNewHand() {
        const pot = getTotalPot();
        const isCurrentlyPlaying = (pot > 0);
        if (this.currentlyPlaying === isCurrentlyPlaying) return;
        this.currentlyPlaying = isCurrentlyPlaying;
        
        if (this.currentlyPlaying) {
            this.hud.onEvent({type: HUDEventType.HandStarted, data: {}});
        } else {
            this.hud.onEvent({type: HUDEventType.HandEnded, data: {}});
        }
    }

    checkFlop() {
        const flop = seenFlop();
        if (this.flopSeen === flop) return;
        this.flopSeen = flop;

        if (flop == true) this.hud.onEvent({type: HUDEventType.Flop, data: {}});
    }

    checkBanner(seat: number) {
        const newBanner = playerPutsIn(seat);
        if (this.banners[seat] === newBanner) return;
        this.banners[seat] = newBanner;
        if (newBanner !== 0) this.hud.onEvent({type: HUDEventType.PutInPot, data: {seat: seat, amount: newBanner}});
    }

    destroy() {
        this.domObserver.disconnect();
    }
}