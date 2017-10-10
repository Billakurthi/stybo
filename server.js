'use strict';

var express = require("express");
var app = express();
var request = require("request");

var path = require("path");
var bodyParser = require('body-parser');

//facebook page access token
var PAGE_ACCESS_TOKEN = "EAACvN2HxY5YBAAeMDy3i6mj14FgPvzyc4YXYM8lUlWhEqrfCIbLRXxJRIS2UC56SjsLmYvbNDP840RSmZCcnSGY4BEa8JMYvZBqDgGpYJIIQAmFPb8Qpmf4pLk4eC66neH8cfQ1glduvIdNas7jAGrI25kRZAMSsV4ubE2lxQZDZD";


const clarifaiService = require('./public/clarifaiService');
const apiaiService = require('./public/apiaiService');


// //user prototype object 
// function styboUser(uid, hasImageUrl, uage) {
//   this.userid = uid;
//   this.imgUrl = hasImageUrl;
//   this.age = uage;
// };
//user prototype object 
var current_users = {};
var costumes = {
  "#Neat Hourglass": {
    "url1": "http://ecx.images-amazon.com/images/I/71%2BQSzV%2B1cL._UL1500_.jpg",
    "url2": "http://ecx.images-amazon.com/images/I/41nqVZKJz3L.jpg",
    "url3": "http://ecx.images-amazon.com/images/I/61w-Hv-tKqL._UL1500_.jpg",
    "url4": "http://ecx.images-amazon.com/images/I/61Jwjn23N9L._UL1500_.jpg",
    "url5": "http://ecx.images-amazon.com/images/I/61kig18c9XL._UL1500_.jpg"
  },
  "#Inverted Triangle": {
    "url1": "http://ecx.images-amazon.com/images/I/71ji0LPifIL._UL1500_.jpg",
    "url2": "http://ecx.images-amazon.com/images/I/61QV3gZrwQL._UL1500_.jpg",
    "url3": "http://ecx.images-amazon.com/images/I/51dKbbwaWnL._UL1500_.jpg",
    "url4": "http://ecx.images-amazon.com/images/I/51itQkdgAeL._UL1500_.jpg",
    "url5": "http://ecx.images-amazon.com/images/I/51Wp-nwOhHL._UL1500_.jpg"
  },
  "#Apple": {
    "url1": "http://ecx.images-amazon.com/images/I/71YQM7ewIfL._UL1500_.jpg",
    "url2": "http://ecx.images-amazon.com/images/I/81ivCFgPyFL._UL1500_.jpg",
    "url3": "http://ecx.images-amazon.com/images/I/913d1hmo5dL._UL1500_.jpg",
    "url4": "http://ecx.images-amazon.com/images/I/61GUm8nCI3L._UL1500_.jpg",
    "url5": "http://ecx.images-amazon.com/images/I/71DsbnF1TdL._UL1500_.jpg"
  },
  "#Rectangle": {
    "url1": "http://ecx.images-amazon.com/images/I/61RDxIghPrL._UL1500_.jpg",
    "url2": "http://ecx.images-amazon.com/images/I/41WkYdsHBjL._AC_UL260_SR200,260_FMwebp_QL70_.jpg",
    "url3": "http://ecx.images-amazon.com/images/I/41dKBRjvpjL._AC_UL260_SR200,260_FMwebp_QL70_.jpg",
    "url4": "http://ecx.images-amazon.com/images/I/418kc0ymF3L._AC_UL260_SR200,260_FMwebp_QL70_.jpg",
    "url5": "http://ecx.images-amazon.com/images/I/31PyhhmkJLL._AC_UL260_SR200,260_FMwebp_QL70_.jpg"
  },
  "#Pear": {
    "url1": "http://ecx.images-amazon.com/images/I/61UoOsYb4RL._UL1500_.jpg",
    "url2": "http://ecx.images-amazon.com/images/I/61Znnokj20L._UL1500_.jpg",
    "url3": "http://ecx.images-amazon.com/images/I/71uiMIEqrVL._UL1500_.jpg",
    "url4": "http://ecx.images-amazon.com/images/I/710HTMM4wNL._UL1500_.jpg",
    "url5": "http://ecx.images-amazon.com/images/I/71FFrmx6msL._UL1500_.jpg"
  },
  "#Full Hourglass": {
    "url1": "http://ecx.images-amazon.com/images/I/814rnf3ZXGL._UL1500_.jpg",
    "url2": "http://ecx.images-amazon.com/images/I/71yim%2BNAOTL._UL1500_.jpg",
    "url3": "http://ecx.images-amazon.com/images/I/91Y26g1VpyL._UL1500_.jpg",
    "url4": "http://ecx.images-amazon.com/images/I/71-ViCtCXcL._UL1500_.jpg",
    "url5": "http://ecx.images-amazon.com/images/I/71DbIpwn2TL._UL1500_.jpg"
  },
  "#Lean Column": {
    "url1": "http://ecx.images-amazon.com/images/I/71RqTZISV5L._UL1500_.jpg",
    "url2": "http://ecx.images-amazon.com/images/I/61hVFej6N8L._UL1500_.jpg",
    "url3": "http://ecx.images-amazon.com/images/I/71Dl0tiqz6L._UL1500_.jpg",
    "url4": "http://ecx.images-amazon.com/images/I/71kJ2vBpeoL._UL1500_.jpg",
    "url5": "http://ecx.images-amazon.com/images/I/71TSo0zPzfL._UL1500_.jpg"
  }
}


//parse text using body parser
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'))
})

//starting a webhook code

app.get('/webhook/', function (req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === 'my-secrete') {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});


app.post('/webhook/', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function (entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function (event) {
        if (event.message) {
          receivedMessage(event);
          console.log(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});


//recieved msg event function

function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:",
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;
  var messageText = message.text;
  var messageAttachments = message.attachments;
  var messageStickers = message.sticker_id;

  //store sender information in local object
  if (!current_users[senderID]) {
    try {
      current_users[senderID] = {
        'imgUrl': 'someImg Url',
        'age': 25
      }
      console.clear();
      console.log("current Users " + JSON.stringify(current_users));
    } catch (ex) {
      console.log("error in pushing the values to the user" + ex);
    }

  }

  //if we get a text message
  if (messageText) {
    try {

      apiaiService.callApiai(messageText, sendTextMessage, senderID);

    } catch (ex) {

      console.log("buildReply Error " + ex);

    }

  } else if (messageAttachments && !messageStickers) {
    console.log("Message Attachment: " + messageAttachments[0].payload.url);



    if (messageAttachments[0].type === "image") {
      try {

        current_users[senderID].imgUrl = messageAttachments[0].payload.url;
        console.log("current Users " + JSON.stringify(current_users));

        //call general search
        clarifaiService.generalModelSearch(messageAttachments[0].payload.url);

        //call prediction for a updated image
        (clarifaiService.predict(messageAttachments[0].payload.url)).then(
          function (reply) {
            apiaiService.callApiai(reply, sendTextMessage, senderID);
            sendTextMessage(senderID, reply);
            if (reply != '#Rejected') { sendGenericMessage(senderID, reply); }
          }
        );

        clarifaiService.create(messageAttachments[0].payload.url)

      } catch (ex) {
        console.log("Exception: " + ex.message);
      }
    } else {
      sendTextMessage(senderID, "Message with attachment received");
    }
  } else {
    sendTextMessage(senderID, "Please upload your image");
  }
}


function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}


// send Play buttons

function sendPlayButtons(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: "[1][2][3]\n[4][5][6]\n[7][8][9]",
      quick_replies: [
        {
          content_type: "text",
          title: "1",
          payload: "1"
        },
        {
          content_type: "text",
          title: "2",
          payload: "2"
        }
      ]
    }
  };
  callSendAPI(messageData);
}


// send generic message

function sendGenericMessage(recipientId, reply) {

  var sr1 = costumes[reply].url1;
  var sr2 = costumes[reply].url2;
  var sr3 = costumes[reply].url3;
  var sr4 = costumes[reply].url4;
  var sr5 = costumes[reply].url5;


  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "Exotic",
            subtitle: "Your best fit is here",
            item_url: sr1,
            image_url: sr1,
            buttons: [{
              type: "postback",
              title: "Buy Now",
              payload: "#buyClicked",
            }],
          }, {
            title: "Vibrant",
            subtitle: "Be ready for party always",
             item_url: sr2,
            image_url: sr2,
            buttons: [{
              type: "postback",
              title: "Buy Now",
              payload: "#buyClicked",
            }]
          }, {
            title: "Versatile",
            subtitle: "Get Trendy",
             item_url: sr3,
            image_url: sr3,
            buttons: [{
              type: "postback",
              title: "Buy Now",
              payload: "#buyClicked",
            }]
          },{
            title: "Dhana Dhan",
            subtitle: "You are princess",
             item_url: sr4,
            image_url: sr4,
            buttons: [{
              type: "postback",
              title: "Buy Now",
              payload: "#buyClicked",
            }]
          },{
            title: "Angel here",
            subtitle: "Rock on Style",
             item_url: sr5,
            image_url: sr5,
            buttons: [{
              type: "postback",
              title: "Buy Now",
              payload: "#buyClicked",
            }]
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}


//function to call callSendAPI
function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });
}


var port = process.env.PORT || 2000; //which you can run both on Azure or local

app.listen(port);

// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!')
// })
