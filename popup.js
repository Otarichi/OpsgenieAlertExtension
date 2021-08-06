const switchRunStatus = () => {
    chrome.runtime.sendMessage(
        {
            message: "changeRunStatus"
        }, response => {
            if(response.status == success){
                console.log("run status changed");
            }
        },
    );
}