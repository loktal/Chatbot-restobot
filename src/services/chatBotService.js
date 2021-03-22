
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
                        "title": "Main menu",
                        "payload": "MENU",
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
};