chrome.runtime.onInstalled.addListener(()=> {
    chrome.storage.local.set(
        {
            opsg_tags: ["europebet", "europe-bet", "bge", "bog", "tbccreditcard"],
            // opsg_tags: ['i', 'a', 'u', 'o'],
            
        }, () => {
        console.log('default tags setted');
      });

      chrome.storage.local.set(
        {
            runStatus: true,
        }, () => {
        console.log('run status setted');
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

        const sdata = { 'text': request.payload.alert_p + '  ' + request.payload.alert_d, };
        fetch('https://hooks.slack.com/services/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', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(sdata)
        });

        chrome.notifications.create(request.payload.alert_i.toString(), {
            type: 'basic',
            iconUrl: './Images/Icons/notify_icon-512x512.png',
            title: request.payload.alert_p + '  ' + request.payload.alert_t,
            message: request.payload.alert_d,
            priority: 2
        });
        sendResponse({
            status: "success"
        });
    }
    if(request.message == "get_tags_runStatus_token"){
        chrome.storage.local.get(['runStatus', 'opsg_tags'], (result) => {
            if (chrome.runtime.lastError) {
                sendResponse({
                    status: "fail"
                });
                return;
            }
            sendResponse({
                status: "success",
                opsg_tags: result.opsg_tags,
                runStatus: result.runStatus
            });
        });
        return true;
    }
});