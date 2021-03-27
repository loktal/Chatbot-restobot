require("dotenv").config();
import { name } from "ejs";
import request from "request";
import chatBotService from "../services/chatBotService";
//const XRegExp = require ('xregexp') ;

const MY_VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN; 

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let postWebhook = (req,res) =>{
    // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

        // Gets the body of the webhook event 
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);


        // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        console.log('Sender PSID: ' + sender_psid);

        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhook_event.message) {
            handleMessage(sender_psid, webhook_event.message);        
        } else if (webhook_event.postback) {
            handlePostback(sender_psid, webhook_event.postback);
        }
      
    });

    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
};

let getWebhook = (req,res) =>{
    // Your verify token. Should be a random string.
  let VERIFY_TOKEN = MY_VERIFY_TOKEN;
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
};

let datereservation ;
let tablesize ;
let phone_number ;

// Handles messages events
function handleMessage(sender_psid, received_message) {
  /*console.log("-----------");
  console.log("-----------");
  console.log(received_message.nlp);
  console.log("-----------");
  console.log("-----------");
  console.log(received_message.nlp.entities);
  console.log("-----------");
  console.log("-----------");
  console.log(received_message.nlp.entities['wit$datetime:datetime']);
  console.log("-----------");
  console.log("-----------");
  //console.log(received_message.nlp.entities['wit$datetime:datetime'][0].confidence);
  console.log("-----------");
  console.log("-----------");
  console.log(received_message.nlp.traits);
  console.log("-----------");
  console.log("-----------");*/


  // handle quick reply.
  if(received_message && received_message.quick_reply && received_message.quick_reply.payload){
    if (received_message.quick_reply.payload === "SMALL"){
      tablesize = "small";
      chatBotService.SendMessageAskingPhoneNumber(sender_psid);
      return;
    } else if (received_message.quick_reply.payload === "MEDIUM"){
      tablesize = "medium";
      chatBotService.SendMessageAskingPhoneNumber(sender_psid);
      return;
    }else if (received_message.quick_reply.payload === "LARGE"){
      tablesize = "large";
      chatBotService.SendMessageAskingPhoneNumber(sender_psid);
      return;
    }

    if(received_message.quick_reply.payload !== " "){
      phone_number = received_message.quick_reply.payload;
      chatBotService.SendMessageDoneReserveTable(sender_psid,datereservation,phone_number,tablesize);
    }

    return;
  }


  

  // handle text message with style
  let entitie = handleMessageWithEntities(received_message);



  if(received_message.text){
    const regex = new RegExp('^[1-9][0-9]?$|^100$');
    const found = received_message.text.match(regex);
    if (found){
      if (parseInt(found[0], 10) <= 2){
        tablesize="small";
        chatBotService.SendMessageAskingPhoneNumber(sender_psid);
      }else if(parseInt(found[0], 10) <= 5){
        tablesize="medium";
        chatBotService.SendMessageAskingPhoneNumber(sender_psid);
      }else{
        tablesize="large";
        chatBotService.SendMessageAskingPhoneNumber(sender_psid);
      }
    }

    const regex2 = /(menu)/igm;
    const found2 = received_message.text.match(regex2);
    if (found2){
      let response = {
        "text":`Here we go ! Take a look at our best dishies!`
      }
      callSendAPI(sender_psid, response);
      chatBotService.sendMainMenu(sender_psid);
    }

    const regex3 = /(reserve)/igm;
    const found3 = received_message.text.match(regex3);
    if (found3){
      let response = {
        "text":`Here we go ! We you are making the right choice!`
      }
      callSendAPI(sender_psid, response);
      chatBotService.handleReserveTable(sender_psid);
    }


  }
  
  
  if(entitie) {
    if (entitie.role  === 'datetime'){
      //console.log(" c'est bon on vas pouvoir se mettre bien en datetime");
      datereservation = entitie.body;
      chatBotService.SendMessageAskingQuantity(sender_psid);
  
    }else if(entitie.role  === 'phone_number'){
      //console.log(" c'est bon on vas pouvoir se mettre bien en téléphone");
      phone_number = entitie.value;
      chatBotService.SendMessageDoneReserveTable(sender_psid,datereservation,phone_number,tablesize);
      
    }

  }
  












    /*let response;

    // Check if the message contains text
    if (received_message.text) {    
  
      // Create the payload for a basic text message
      response = {
        "text": `You sent the message: "${received_message.text}". Now send me an image!`
      }
    } else if (received_message.attachments) {
  
        // Gets the URL of the message attachment
        let attachment_url = received_message.attachments[0].payload.url;
        response = {
            "attachment": {
              "type": "template",
              "payload": {
                "template_type": "generic",
                "elements": [{
                  "title": "Is this the right picture?",
                  "subtitle": "Tap a button to answer.",
                  "image_url": attachment_url,
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "Yes!",
                      "payload": "yes",
                    },
                    {
                      "type": "postback",
                      "title": "No!",
                      "payload": "no",
                    }
                  ],
                }]
              }
            }
        }
    }  
    
    // Sends the response message
    callSendAPI(sender_psid, response);*/
}


function handleMessageWithEntities(message) {
  // check greeting is here and is confident
  
  if (message.nlp)
  {
  if (message.nlp.entities['wit$datetime:datetime']){
    console.log("on a une datetime");
    if (message.nlp.entities['wit$datetime:datetime'][0].confidence > 0.9){
      console.log("en plus elle est valable");
      console.log(message.nlp.entities['wit$datetime:datetime'][0].confidence);
      return message.nlp.entities['wit$datetime:datetime'][0]
    } else {
      console.log("pas valable");
    }
  } else if(message.nlp.entities['wit$phone_number:phone_number']) {
    console.log("on a un numéro de téléphone");
    if (message.nlp.entities['wit$phone_number:phone_number'][0].confidence > 0.9){
      console.log("en plus elle est valable");
      return message.nlp.entities['wit$phone_number:phone_number'][0]
    } else {
      console.log("pas valable");
    }
  } else {
    return "on a rien trouvé";
  }
}

  /*
  const greeting = firstTrait(message.nlp, 'wit$datetime:datetime');
  if (greeting && greeting.confidence > 0.8) {
    console.log('this is a datetime');
    
  } else { 
    // default logic
  }*/
}

/*
function firstTrait(nlp, name) {
  return nlp && nlp.entities && nlp.traits[name] && nlp.traits[name][0];
}*/


/*
let handleMessageWithEntities = (message) => {
    let entitiesArr = [ "datetime", "phone_number"];
    let entityChosen = "";

    entitiesArr.forEach((name) => {
        let entity = firstTrait(message.nlp, name);
        console.log(entity);
        if (entity && entity.confidence > 0.8) {
            entityChosen = name;
        }
    });

    console.log("-----------");
    console.log(entityChosen);
    console.log("-----------");




};



function firstEntity(npl, name) {
    return nlp && nlp.entities && nlp.entities[name] && npl.entities[name][0];
};

function firstTrait(nlp, name) {
  return nlp && nlp.entities && nlp.traits[name] && nlp.traits[name][0];
}
*/




// Handles messaging_postbacks events
let handlePostback = async (sender_psid, received_postback) => {
    let response;
  
    // Get the payload for the postback
    let payload = received_postback.payload;
  
    // Set the response based on the postback payload
    switch (payload) {
        case "GET_STARTED":
            //get username
            
            let username = await chatBotService.getFacebookUsername(sender_psid);
            await chatBotService.sendResponseWelcomeNewCustomer(username, sender_psid);
            break;
        
        case "MAIN_MENU":
            //send main menu
            await chatBotService.sendMainMenu(sender_psid);

            break;
        
        case "LUNCH_MENU":
            await chatBotService.sendLunchMenu(sender_psid);

            break;
        
        case "PUB_MENU":
            await chatBotService.sendPubMenu(sender_psid);
            

            break;
        
        case "SHOW_STARTERS":
            await chatBotService.sendStarter(sender_psid);
            

            break;
            
        case "SHOW_MAIN_COURSE":
            await chatBotService.sendMainCourse(sender_psid);
            

            break;        

        
        case "SHOW_DESSERT":
            await chatBotService.sendDessert(sender_psid);
            

            break; 
        
        case "RESERVE_A_TABLE":
            await chatBotService.handleReserveTable(sender_psid);

            break;

        default:
            console.log("Something wrong with switch case payload");
            
    }

    // Send the message to acknowledge the postback
    //callSendAPI(sender_psid, response);
};

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
          "id": sender_psid
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
}



module.exports = {
postWebhook: postWebhook,
getWebhook: getWebhook
}