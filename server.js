'use strict';

var express = require("express");
var app = express();
var request = require("request");

var path = require("path");
var bodyParser = require('body-parser');

//facebook page access token
var PAGE_ACCESS_TOKEN = "EAACvN2HxY5YBAAeMDy3i6mj14FgPvzyc4YXYM8lUlWhEqrfCIbLRXxJRIS2UC56SjsLmYvbNDP840RSmZCcnSGY4BEa8JMYvZBqDgGpYJIIQAmFPb8Qpmf4pLk4eC66neH8cfQ1glduvIdNas7jAGrI25kRZAMSsV4ubE2lxQZDZD";

//clarifai api token
const Clarifai = require('clarifai');
const appClarifai = new Clarifai.App({
  apiKey: 'd702f3b9983a4a5e9bc9f5bf343bb5c0'
});

const clarifaiService = require('./public/clarifaiService');
const apiaiService = require('./public/apiaiService');


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

  if (messageText) {

    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    sendTextMessage(senderID, 'koncham busy kanna Love you tarvatha matladatha');
    // try {
    //   (apiaiService.callApiai(messageText)).then(
    //     function (buildReply) {
    //       console.log("Build Reply Message: " + buildReply);
    //       sendTextMessage(senderID, buildReply);
    //     }
    //   );
    // } catch (ex) {
    //   console.log("buildReply Error " + ex);
    // }

    // switch (messageText) {


    // case 'generic':
    //   sendGenericMessage(senderID);
    //   break;
    // case 'Hi':
    //   sendTextMessage(senderID, 'Hi Bangaram, em cehstunnav');
    //   break;
    // case 'hi':
    //   sendTextMessage(senderID, 'Hi Bangaram, miss you ra');
    //   break;
    // case 'Bye':
    //   sendTextMessage(senderID, 'Bye Pandu, miss you soo much');
    //   break;
    // case 'bye':
    //   sendTextMessage(senderID, '[ ][ ][ ]\n[ ][ ][ ]\n[ ][ ][ ]');
    //   break;
    // case 'play':
    //   sendPlayButtons(senderID);
    //   break;
    // default:
    //   sendTextMessage(senderID, 'koncham busy kanna Love you tarvatha matladatha');


    //}
  } else if (messageAttachments) {
    console.log("Message Attachment: "+messageAttachments[0].payload.url);
    if (messageAttachments[0].type === "image") {
      try {
        (clarifaiService.predict(senderID, messageAttachments[0].payload.url)).then(
          function (reply) {
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
        },
        {
          content_type: "text",
          title: "3",
          payload: "4"
        },
        {
          content_type: "text",
          title: "4",
          payload: "8"
        },
        {
          content_type: "text",
          title: "5",
          payload: "16"
        },
        {
          content_type: "text",
          title: "6",
          payload: "32"
        },
        {
          content_type: "text",
          title: "7",
          payload: "64"
        },
        {
          content_type: "text",
          title: "8",
          payload: "128"
        },
        {
          content_type: "text",
          title: "9",
          payload: "256"
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
