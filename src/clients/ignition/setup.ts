const TABLE_IFRAME_SELECTOR = 'iframe[title="Table slot"]';

export function inLobby():boolean {
    console.log("checking if in lobby");
    return window!.top!.document.querySelectorAll('iframe[title="Table slot"]').length > 0;
}