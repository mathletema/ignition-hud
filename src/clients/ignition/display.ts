import { DOM_FINGERPRINT } from "utils";

export class Display {
    private overlay: HTMLElement;

    constructor() {
        this.overlay = document.createElement("div")
        this.overlay.style.position = "fixed";
        this.overlay.style.top = "0";
        this.overlay.style.left = "0";
        this.overlay.style.width = "240px";
        this.overlay.style.height = "100vh";
        this.overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Translucent black
        this.overlay.style.color = "white";
        this.overlay.style.zIndex = "1000"; // Ensure it appears on top
        this.overlay.className += " " + DOM_FINGERPRINT;
        document.body.appendChild(this.overlay);
    }

    update(text: string) {
        this.overlay.innerHTML = `<p>${text}</p>`;
    }
}