import request from "request"



let SetUpMessengerPlateform = (PAGE_ACCESS_TOKEN) => {
    return new Promise((resolve, reject) => {
        try{
            // Send the HTTP request to the Messenger Platform
            let data = {
                "get_started":{
                    "payload":"GET_STARTED"
                },
                "persistent_menu": [
                    {
                        "locale": "default",
                        "composer_input_disabled": false,
                        "call_to_actions": [
                            {
                                "type": "postback",
                                "title": "Talk to an agent",
                                "payload": "CARE_HELP"
                            },
                            {
                                "type": "postback",
                                "title": "Outfit suggestions",
                                "payload": "CURATION"
                            },
                            {
                                "type": "web_url",
                                "title": "Shop now",
                                "url": "https://www.originalcoastclothing.com/",
                                "webview_height_ratio": "full"
                            }
                        ]
                    }
                ],
                "whitelisted_domains":[
                    "https://chatbot-project-loktal.herokuapp.com/" 
                ]

            };
            //"https://graph.facebook.com/v7.0/me/nlp_configs?nlp_enabled=$NLP_ENABLED"


            request({
                "uri": "https://graph.facebook.com/v6.0/me/messenger_profile/nlp_configs?nlp_enabled=$NLP_ENABLED",
                "qs": { "access_token": PAGE_ACCESS_TOKEN},
                "method": "POST",
                "json": data
            }, (err, res, body) => {
                if (!err) {
                    resolve("setup done");
                    
                } else {
                    reject(err);
                    
                }
            }); 

        }catch(e){
            reject(e);
        }
    });


};



module.exports = {
    SetUpMessengerPlateform: SetUpMessengerPlateform,
};