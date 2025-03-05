import { Display } from "./display";
import { getWindowDOM } from "./dom";
import { HUD } from "./hud";
import { Observer } from "./observer";

function main ():void {
    // don't run on children iframes
    if (window.self! !== window.top) return;
    if (document.querySelectorAll('iframe[title="Table slot"][data-multitableslot]').length == 0) return;
    const display = new Display();
    const hud = new HUD(display);
    const observer = new Observer(hud, getWindowDOM()!);
    observer.observe();
}

main();
