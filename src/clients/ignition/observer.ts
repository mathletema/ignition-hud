import { getTotalPot } from "./dom";
import { HUD } from "./hud";
import { HUDEventType } from "./types";

export class Observer {
    private domObserver: MutationObserver;
    private hud: HUD;

    private currentlyPlaying = false;

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

    destroy() {
        this.domObserver.disconnect();
    }
}