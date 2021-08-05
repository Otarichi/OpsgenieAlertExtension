chrome.runtime.onInstalled.addListener(()=> {
    chrome.storage.local.set({opsg_tags: [
        "europebet", "europe-bet", "bge", "bog", "tbccreditcard", "bde"
    ]}, ()=> {
        console.log('default tags setted');
      });
});


var tabIDGlobal = undefined;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["./foreground.js"]
        }).then(() => {
            console.log("injected foreground")
        }).catch((err) => {
            console.log(err);
        })
    }
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.message === "notify"){
        console.log("sadsa");
        chrome.notifications.create(request.payload.alert_i.toString(), {
            type: 'basic',
            iconUrl: 'back_row.png',
            title: request.payload.alert_t,
            message: request.payload.alert_t,
            priority: 2
        });
        sendResponse({
            status: "success"
        });
    }
    if(request.message == "get_tags"){
        chrome.storage.local.get(['opsg_tags'], (result) => {
            if (chrome.runtime.lastError) {
                sendResponse({
                    status: "fail"
                });
                return;
            }

            sendResponse({
                status: "success",
                opsg_tags: result.opsg_tags
            });
        });
        return true;
    }
});