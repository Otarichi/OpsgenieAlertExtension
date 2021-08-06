chrome.runtime.onInstalled.addListener(()=> {
    chrome.storage.local.set(
        {
            all_data_opsg: 
            {
                tags: ["europebet", "europe-bet", "bge", "bog", "tbccreditcard", "bde"],
                run: true,
            }
        }, () => {
        console.log('default tags and run status setted');
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
        chrome.notifications.create(request.payload.alert_i.toString(), {
            type: 'basic',
            iconUrl: './Images/Icons/notify_icon-512x512.png',
            title: request.payload.alert_t,
            message: request.payload.alert_t,
            priority: 2
        });
        sendResponse({
            status: "success"
        });
    }
    if(request.message == "get_tags_runStatus"){
        chrome.storage.local.get(['all_data_opsg'], (result) => {
            if (chrome.runtime.lastError) {
                sendResponse({
                    status: "fail"
                });
                return;
            }

            sendResponse({
                status: "success",
                opsg_tags: result.all_data_opsg.tags,
                runStatus: result.all_data_opsg.run
            });
        });
        return true;
    }
});