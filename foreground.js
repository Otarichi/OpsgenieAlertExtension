if (Notification.permission !== 'granted') {Notification.requestPermission();};

var lastID = 0;
// var audio = new Audio('./audio/alarm.mp3');

setInterval(main_driver, 5000);

function main_driver(){
    alerts = document.getElementsByClassName("og-alert-item");
    chrome.runtime.sendMessage({
        message: "get_tags_runStatus_token",
    }, response => {
        if(response.status = "success"){
            let opsg_tags = response.opsg_tags;
            let runStatus = response.runStatus;
            if (runStatus==true){
                for(let i=alerts.length-1; i>-1; i--){
                    alert_b = alerts[i].getElementsByTagName("b");
                    let alert_id = alert_b[0].innerHTML;
                    let alert_priority = alert_b[2].innerHTML;
                    let alert_title = alert_b[3].innerHTML;
                    let alert_status = alerts[i].getElementsByClassName("og-alert-item__right__status-box__status")[0].getElementsByTagName("p")[0].innerHTML.toLowerCase();
                    alert_title = alert_title.toString()
                    alert_title_low = alert_title.toLowerCase();
                    alert_id = alert_id.substring(1, alert_id.length);
                    alert_id = parseInt(alert_id);
                    let alert_url = alerts[i].getAttribute('href');
                    let alert_full_id = alert_url.split('/')[3];
                    alert_url = 'https://betssongroup.app.eu.opsgenie.com' + alert_url;
                    if (alert_id <= lastID){
                        continue;
                    } else {
                        lastID = alert_id;
                        console.log("checked", alert_id);
                        if (alert_status === "open" || alert_status === "ack'ed"){
                            var incl = false;
                            for(let j=0; j<opsg_tags.length; j++) {
                                if (alert_title_low.includes(opsg_tags[j])){
                                    incl = true;
                                    console.log(opsg_tags[j], alert_id, alert_title);
                                    chrome.runtime.sendMessage({
                                        message: "notify",
                                        payload: {
                                            alert_p: alert_priority,
                                            alert_t: 'Opsgenie Alert Europebet.com/BGE',
                                            alert_d: alert_title,
                                            alert_s: alert_status,
                                            alert_i: alert_id
                                        }
                                    }, response => {
                                        if(response.status === 'success'){
                                            console.log("notification sent");
                                        } else {console.log("notification not sent")}
                                    });
                                    break;
                                }
                            };
                            if (incl == false){
                                console.log("detail checking", alert_id);
                                fetch('https://betssongroup.app.eu.opsgenie.com/webapi/alert/details?alertId=' + alert_full_id + '&flushSubMenu=true')
                                .then(response => {return response;})
                                .then(data => {
                                    data = data.json();
                                    return data;
                                }).then((data_json) => {
                                    let alert_desc_low = data_json.description.toLowerCase();
                                    for(let j=0; j<opsg_tags.length; j++) {
                                        if (alert_desc_low.includes(opsg_tags[j])){
                                            incl = true;
                                            console.log(opsg_tags[j], alert_id, alert_title);
                                            chrome.runtime.sendMessage({
                                                message: "notify",
                                                payload: {
                                                    alert_p: alert_priority,
                                                    alert_t: 'Opsgenie Alert Europebet.com/BGE',
                                                    alert_d: data_json.description,
                                                    alert_s: alert_status,
                                                    alert_i: alert_id
                                                }
                                            }, response => {
                                                if(response.status === 'success'){
                                                    console.log("notification sent");
                                                } else {console.log("notification not sent")}
                                            });
                                            break;
                                        }}
                                });
                            }
                        }
                    }
                }
            }
        }
    });
};