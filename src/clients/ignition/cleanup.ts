import { DOM_FINGERPRINT } from "utils";

Array.from(document.getElementsByClassName(DOM_FINGERPRINT)).forEach((el) => el.remove());