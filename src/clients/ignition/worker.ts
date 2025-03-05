import { DOM_FINGERPRINT } from "utils";
import { Observer } from "./observer";

const ignitionURL = 'https://www.ignitioncasino.eu';

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

        if (nextState == 'ON') {
            chrome.scripting.executeScript({
                target : {tabId : tab.id!, allFrames: true},
                files : [ "script.js" ],
            });
        } else {
            chrome.scripting.executeScript({
                target : {tabId : tab.id!},
                files : [ "cleanup.js" ],
            })
        }
    }
});