import { inLobby } from "./setup";
import { Scraper } from "./scraper";

if (inLobby()) {
    const scraper = new Scraper();
    scraper.run();
}