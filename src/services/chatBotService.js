 
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
                                "title": "Menu",
                                "payload": "LUNCH_MENU",
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
                        "subtitle": ` Monday - Saturday  11:00 AM - 12:00 PM`,
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


let sendLunchMenu = (sender_psid) => {

    return new Promise( async (resolve, reject) => {
        
        let response = {
            "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": "Starters",
                        "subtitle": "Here is our starters.",
                        "image_url": "https://www.atelierdeschefs.com/media/recette-e15183-salade-grecque.jpg",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Show the starters",
                                "payload": "SHOW_STARTERS",
                            }
                        ],
                    },
                    {
                        "title": "Main Courses",
                        "subtitle": 'Our dishes are the best!',
                        "image_url": "https://blog.finarome.com/wp-content/uploads/2019/06/le-plat-du-jour-au-restaurant.jpg",
                        "buttons": [ 
                            {
                                "type": "postback",
                                "title": "Show the main courses",
                                "payload": "SHOW_MAIN_COURSE",
                            }
                        ],
                    },
                    {
                        "title": "Desserts",
                        "subtitle": 'You will be amazed by our deserts (try the enigma).',
                        "image_url": "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/dessert-main-image-molten-cake-0fbd4f2.jpg?quality=90&resize=768,574",
                        "buttons": [ 
                            {
                                "type": "postback",
                                "title": "Show the desserts",
                                "payload": "SHOW_DESSERT",
                            }
                        ],
                    }
                ]
            }
        }};


        await sendMessage(sender_psid, response);

    }); 
    
};



let sendPubMenu = (sender_psid) => {

    return new Promise( async (resolve, reject) => {
        
        let response = {
            "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": "Merlot",
                        "subtitle": "Fruity, spicy. Very soft, less tannic than Cabernet sauvignon.",
                        "image_url": "https://digitalcontent.api.tesco.com/v2/media/ghs/97f0fcc4-fbb9-405b-8cc7-3831dc79995f/snapshotimagehandler_1868991701.jpeg?h=540&w=540",
                    },
                    {
                        "title": "Pinot noir",
                        "subtitle": "Delicate and fresh, very soft tannins with fruity aromas",
                        "image_url": "https://cdn.aldi-digital.co.uk//French-Pinot-Noir--A.jpg?o=Kv8gtxNg5W3N6lZ2T8Pv7QpmfWEj&V=FPsu",
                        
                    },
                    {
                        "title": "Beer",
                        "subtitle": "German helles' beer is maltier than a traditional pilsner and features a bright gold color.",
                        "image_url": "https://imgix.lifehacker.com.au/content/uploads/sites/4/2020/01/beer.jpg?ar=16%3A9&auto=format&fit=crop&q=80&w=1280&nr=20",
                        
                    },
                    {
                        "title": "Vodka shots",
                        "subtitle": "Perfect for an hangover.",
                        "image_url": "https://img1.thelist.com/img/gallery/when-you-drink-vodka-every-night-this-is-what-happens-to-your-body/intro-1580240935.jpg",
                        
                    },
                    {
                        "title": "Jäger Bombe",
                        "subtitle": "My favorite to be knocked down.",
                        "image_url": "https://cdn.rex.domains/tipsy/uploads/2020/01/jager-bomb-ice-sphere.jpg",
                        
                    }
                    
                ]
            }
        }};
        await sendMessage(sender_psid, response);
        let response2 = {
            
            "attachment":{
                "type":"template",
                "payload":{
                  "template_type":"button",
                  "text":"What do you want to do next?",
                  "buttons":[
                    {
                        "type": "postback",
                        "title": "Reserve a table",
                        "payload": "RESERVE_A_TABLE"
                    },
                    {
                        "type": "postback",
                        "title": "Main Menu",
                        "payload": "MAIN_MENU"
                    }
                    
                  ]
                }
              }
        
        };

        
        await sendMessage(sender_psid, response2);

    }); 
    
};


let sendStarter = (sender_psid) => {

    return new Promise( async (resolve, reject) => {
        
        let response = {
            "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": "Salade Niçoise",
                        "subtitle": "A tasty salade with tuna and eggs, perfect to have the impression to be at the sea.",
                        "image_url": "https://assets.epicurious.com/photos/579fa0dbc9298e5449591827/2:1/w_1260%2Ch_630/salade-nicoise.jpg",
                    },
                    {
                        "title": "snails",
                        "subtitle": "It is French haute cuisine because we are fancy af.",
                        "image_url": "https://www.thefishsociety.co.uk/media/image/9c/d6/c3/SNails-for-web-2_600x600.jpg",
                        
                    },
                    {
                        "title": "Salade vigneronne",
                        "subtitle": "It is the best salade ever, it come from alsace.",
                        "image_url": "https://p1.storage.canalblog.com/24/20/792082/78438576_o.jpg",
                        
                    },
                    {
                        "title": "avocado toasts",
                        "subtitle": "Perfect if you are a little parisian who want to spend 5€ for nothing.",
                        "image_url": "https://imagesvc.meredithcorp.io/v3/mm/image?q=85&c=sc&poi=face&url=https%3A%2F%2Fimg1.cookinglight.timeinc.net%2Fsites%2Fdefault%2Ffiles%2Fstyles%2F4_3_horizontal_-_1200x900%2Fpublic%2Fimage%2F2018%2F07%2Fmain%2F1807w-avocado-toast-recipe.jpg%3Fitok%3DiTXSfI1Z",
                        
                    }
                    
                ]
            }
        }};


        await sendMessage(sender_psid, response);

        let response2 = {
            
            "attachment":{
                "type":"template",
                "payload":{
                  "template_type":"button",
                  "text":"What do you want to do next?",
                  "buttons":[
                    {
                        "type": "postback",
                        "title": "Reserve a table",
                        "payload": "RESERVE_A_TABLE"
                    },
                    {
                        "type": "postback",
                        "title": "Main Menu",
                        "payload": "MAIN_MENU"
                    }
                    
                  ]
                }
              }
        
        };

        


        await sendMessage(sender_psid, response2);

    }); 
    
};

let sendMainCourse = (sender_psid) => {

    return new Promise( async (resolve, reject) => {
        
        let response = {
            "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": "Pork tenderloin with strawberry sauce.",
                        "subtitle": "With roasted potatoes and green beans.",
                        "image_url": "https://spicysouthernkitchen.com/wp-content/uploads/pork-with-strawberries-17.jpg",
                    },
                    {
                        "title": "Bo Bun with stir-fried beef",
                        "subtitle": "With cucumber, carrots and peanuts",
                        "image_url": "https://iamafoodblog.b-cdn.net/wp-content/uploads/2020/06/bun-bo-xa-ot-recipe-3990.jpg",
                        
                    },
                    {
                        "title": "Lap khmer",
                        "subtitle": "Cambodian beef salad served with a wok of vegetables, gomasio and pandan rice.",
                        "image_url": "https://pbs.twimg.com/media/CVXQ-JdWwAAvr3d.png",
                        
                    },
                    {
                        "title": "Chicken tenders, mushrooms and cream.",
                        "subtitle": "with fusilli and broccoli florets",
                        "image_url": "https://food-images.files.bbci.co.uk/food/recipes/chicken_in_a_creamy_84614_16x9.jpg",
                        
                    }
                    
                ]
            }
        }};

        await sendMessage(sender_psid, response);

        let response2 = {
            
            "attachment":{
                "type":"template",
                "payload":{
                  "template_type":"button",
                  "text":"What do you want to do next?",
                  "buttons":[
                    {
                        "type": "postback",
                        "title": "Reserve a table",
                        "payload": "RESERVE_A_TABLE"
                    },
                    {
                        "type": "postback",
                        "title": "Main Menu",
                        "payload": "MAIN_MENU"
                    }
                    
                  ]
                }
              }
        
        };

        

        await sendMessage(sender_psid, response2);

    }); 
    
};


let sendDessert = (sender_psid) => {

    return new Promise( async (resolve, reject) => {
        
        let response = {
            "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": "Strawberry cake",
                       
                        "image_url": "https://i8b2m3d9.stackpathcdn.com/wp-content/uploads/2020/08/Strawberry_Shortcake_5140sq-500x500.jpg",
                    },
                    {
                        "title": "Chocolate fudge",
                        
                        "image_url": "https://i-reg.unimedias.fr/sites/art-de-vivre/files/styles/recipe/public/Import/coulant-fondant-chocolat_ss.jpg?auto=compress%2Cformat&crop=faces%2Cedges&cs=srgb&fit=crop&h=500&w=393",
                        
                    },
                    {
                        "title": "Banana split",
                        
                        "image_url": "https://www.thekitchenmagpie.com/wp-content/uploads/images/2020/08/oldfashionedbananasplits.jpg",
                        
                    },
                    {
                        "title": "Enigma",
                        "subtitle": "No one know what it is. Some say's it is 'La réponse D' ",
                        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/200px-Question_mark_%28black%29.svg.png",
                        
                    }
                    
                ]
            }
        }};

        await sendMessage(sender_psid, response);


        let response2 = {
            
            "attachment":{
                "type":"template",
                "payload":{
                  "template_type":"button",
                  "text":"What do you want to do next?",
                  "buttons":[
                    {
                        "type": "postback",
                        "title": "Reserve a table",
                        "payload": "RESERVE_A_TABLE"
                    },
                    {
                        "type": "postback",
                        "title": "Main Menu",
                        "payload": "MAIN_MENU"
                    }
                    
                  ]
                }
              }
        
        };

        


        await sendMessage(sender_psid, response2);

    }); 
    
};



let handleReserveTable = (sender_psid) => {
    return new Promise( async (resolve, reject) => {
        try {
            let username = await getFacebookUsername(sender_psid);
            let response = {text: `Great! Thank you ${username}. When do you want to bring ecstasy to your taste buds ?`};
            await sendMessage(sender_psid, response);
        }catch(e){
            reject(e);
        }
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

let SendMessageAskingQuantity = (sender_psid) => {
    let request_body = {
        "recipient":{
            "id":sender_psid
          },
          "messaging_type": "RESPONSE",
          "message":{
            "text": "what is your party size ?",
            "quick_replies":[
              {
                "content_type":"text",
                "title":"1 or 2",
                "payload":"SMALL",
                
              },{
                "content_type":"text",
                "title":"2 or 5",
                "payload":"MEDIUM",
                
              },
              {
                "content_type":"text",
                "title":"> 5",
                "payload":"LARGE",
                
              }
            ]
          }
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


SendMessageAskingPhoneNumber

let SendMessageAskingPhoneNumber = (sender_psid) => {
    let request_body = {
        "recipient":{
            "id":sender_psid
          },
          "messaging_type": "RESPONSE",
          "message":{
            "text": "Thank you but what is your phone number if we need to reach you",
            "quick_replies":[
                {
                    "content_type":"user_phone_number"
                }
            ]
          }
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


let SendMessageDoneReserveTable = async (sender_psid,datereservation,phone_number,tablesize) =>{

    let response1 = {
        "attachment":{
            "type":"image",
            "payload":{
                "url": "http://gph.is/1a7RlDR"
            }
        }
    };
    await sendMessage(sender_psid, response1);

    let response2 = { "text": `Thank you! We have registered your reservation for a ${tablesize} table for ${datereservation} with the phone number: ${phone_number}` };

    await sendMessage(sender_psid, response2);
};






module.exports = {
    getFacebookUsername: getFacebookUsername,
    sendResponseWelcomeNewCustomer: sendResponseWelcomeNewCustomer,
    sendMainMenu: sendMainMenu,
    sendLunchMenu: sendLunchMenu,
    sendPubMenu: sendPubMenu,
    sendStarter: sendStarter,
    sendMainCourse: sendMainCourse,
    sendDessert: sendDessert,
    handleReserveTable: handleReserveTable,
    SendMessageAskingQuantity: SendMessageAskingQuantity,
    SendMessageAskingPhoneNumber: SendMessageAskingPhoneNumber,

};