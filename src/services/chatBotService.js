
require("dotenv").config();
import request from "request";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let getFacebookUsername = (sender_psid) => {
    return new Promise((resolve, reject) => {
        try {
            // Send the HTTP request to the Messenger Platform
            let url = `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name&access_token=${PAGE_ACCESS_TOKEN}`;
            request({
                "uri": url,
                "method": "GET",
            }, (err, res, body) => {
                if (!err) {
                    //convert string to json object
                    body = JSON.parse(body);
                    let username = `${body.first_name} ${body.last_name}`;
                    resolve(username);
                } else {
                    reject("Unable to send message:" + err);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};

let sendResponseWelcomeNewCustomer = (username,sender_psid) => {
    return new Promise( async (resolve, reject) => {
        let response_first = { "text": `Welcome ${username} to Restobot restaurant` };
        let response_second = {
                "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                    "title": "Here is the Restobot !",
                    "image_url": "https://www.lecoindesrestaurants.com/media/cache/advice_cover/sites/restaurant/img/uploads/advices/prix-de-vente-des-plats-d-un-restaurant.jpg",
                    "buttons": [
                        {
                        "type": "postback",
                        "title": "Show Main Menu",
                        "payload": "MAIN_MENU",
                        }
                    ],
                    }]
                }
            }
        };

        // welcome message 
        await sendMessage(sender_psid, response_first);

        // presentation du resto
        await sendMessage(sender_psid, response_second);
    
    });
};

let sendMainMenu = (sender_psid) => {

    return new Promise( async (resolve, reject) => {
        let response = {
            "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": "Our menus",
                        "subtitle": "We are pleased to offer you a wide-range of menu for lunch or dinner :)",
                        "image_url": "https://media-cdn.tripadvisor.com/media/photo-m/1280/15/21/ef/a4/farandole-de-plats-au.jpg",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Lunch menu",
                                "payload": "LUNCH_MENU",
                            },
                            {
                                "type": "postback",
                                "title": "Dinner menu",
                                "payload": "DINNER_MENU",
                            },
                            {
                                "type": "postback",
                                "title": "Pub menu",
                                "payload": "PUB_MENU",
                            }
                        ],
                    },
                    {
                        "title": "Hours !",
                        "subtitle": ` Monday - Friday
                            11:00 AM - 12:00 PM
                        Saturday - Sunday
                            12:00 AM - 2:00 AM
                        `,
                        "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-WmD7YAGavUrd71E5KRFKV3cdWrtX8OQ5mg&usqp=CAU",
                        "buttons": [ 
                            {
                                "type": "postback",
                                "title": "Reserve a table",
                                "payload": "RESERVE_A_TABLE",
                            }
                        ],
                    }
                ]
            }
        }};
        await sendMessage(sender_psid, response);

    }); 
    
};


let sendMessage = (sender_id,response)  => {
    // Construct the message body
    let request_body = {
        "recipient": {
        "id": sender_id
        },
        "message": response
    };
    
    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v6.0/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN},
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
        console.log('message sent!')
        } else {
        console.error("Unable to send message:" + err);
        }
    });

};



module.exports = {
    getFacebookUsername: getFacebookUsername,
    sendResponseWelcomeNewCustomer: sendResponseWelcomeNewCustomer,
    sendMainMenu: sendMainMenu,
};