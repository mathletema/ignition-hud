import { inLobby } from "./setup";
import { Scraper } from "./scraper";


const ignitionURL = 'https://ignitioncasino.eu';

chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: 'OFF'
    });
});

chrome.action.onClicked.addListener(async (tab) => {
    if (tab.url!.startsWith(ignitionURL)) {
        const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
        const nextState = prevState === 'ON' ? 'OFF' : 'ON';

        await chrome.action.setBadgeText({
            tabId: tab.id,
            text: nextState
        });

        chrome.scripting.executeScript({
            target: { tabId: tab.id! },
            func: () => {
                if (inLobby()) {
                    const scraper = new Scraper();
                    scraper.run();
                }
            }
          });
    }
});