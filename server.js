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
  if (senderID) {
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

        //call general search
        clarifaiService.generalModelSearch(messageAttachments[0].payload.url);

        //call prediction for a updated image
        (clarifaiService.predict(messageAttachments[0].payload.url)).then(
          function (reply) {
            apiaiService.callApiai(reply, sendTextMessage, senderID);
            sendTextMessage(senderID, reply);

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

function sendGenericMessage(recipientId) {
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
            title: "rift",
            subtitle: "Next-generation virtual reality",
            item_url: "https://www.oculus.com/en-us/rift/",
            image_url: "http://messengerdemo.parseapp.com/img/rift.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/rift/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for first bubble",
            }],
          }, {
            title: "touch",
            subtitle: "Your Hands, Now in VR",
            item_url: "https://www.oculus.com/en-us/touch/",
            image_url: "http://messengerdemo.parseapp.com/img/touch.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/touch/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for second bubble",
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
