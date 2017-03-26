var express = require("express");
var app = express();
var path = require("path");


var bodyParser = require('body-parser');

var request = require('request');

//parse text using body parser
app.use(bodyParser.json());


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'))
})


app.get('/hello', function (req, res) {

  res.send('world!');

})

app.get('/ytube', function (req, res) {
  res.sendFile(path.join(__dirname + '/ytube.html'))
})

app.get('/yjs.js', function (req, res) {
  res.sendFile(path.join(__dirname + '/yjs.js'))
})

app.get('/auth.js', function (req, res) {
  res.sendFile(path.join(__dirname + '/auth.js'))
})
//////////////////////////////////////////////////////////////////////////////
///////////////Code to post youtube results//////////////////////////////////
////////////////////////////////////////////////////////////////////////////
function postYtubeResults(youThumbSrc, youTitle, youtubeUrlSrc, sender) {

  messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{

          "title": youTitle,
          "image_url": youThumbSrc,
          "buttons": [{
            "type": "web_url",
            "url": youtubeUrlSrc,
            "title": "View Video"
          }]

        }]
      }
    }
  };
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: token },
    method: 'POST',
    json: {
      recipient: { id: sender },
      message: messageData,
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

function getYtubeResults(ytubeSearchResults, sender) {
  //resultsstr = JSON.stringify(ytubeSearchResults.body);
  results = JSON.parse(ytubeSearchResults);
  console.log('giving the value of results');
  console.log(results);
  // $.each(results.items, function (index, item) {
  //   console.log(item.snippet.title);
  //   var youtubeUrlSrc = "http://www.youtube.com/watch?v=" + item.id.videoId;
  //   var youThumbSrc = (item.snippet.thumbnails.high.url);
  //   console.log("src" + youtubeUrlSrc + "--thumbsSource" + youThumbSrc);
  // });
  //uncomment the data
  var itemindex = 0;
  var resultslen = results.items.length;
  console.log(resultslen);
  console.log(JSON.stringify(results.items));
  var youThumbSrc, youTitle, youtubeUrlSrc
  for (itemindex; itemindex < resultslen; itemindex++) {
    //    console.log(singleItem.snippet.title);
    console.log(results.items[itemindex].id);
    youThumbSrc = (results.items[itemindex].snippet.thumbnails.high.url);
    youTitle = (results.items[itemindex].snippet.title);
    youtubeUrlSrc = "http://www.youtube.com/watch?v=" + results.items[itemindex].id.videoId;
    // console.log("src is" + youtubeUrlSrc + "--thumbsSource" + youThumbSrc);
    postYtubeResults(youThumbSrc, youTitle, youtubeUrlSrc, sender);
  //uncomment the data.
  }
  
}

var token = "CAADq5dD7AbMBAF3tfBHmTtAdaTcUmYFo45wgSHA0UoUZBjC7Vt0cvLXpDZCRfnT8DM2LOZBkzywjKSDL7QS4swAw0m7DRlKfN5n32pqoPae03WMLiq4NUKYeQTmmsMZC4LZBUuKvFM4ikXWsV0AZCzyKrktlqqlYmCBej5B6K9tt2b2O0dZAOZB5ZCT0lVZBON7ZCgZD";

var youtubeToken = "AIzaSyAYyszp8457wRdb6fYvjjjMiuWYXwZqY_c";

//send youtubeGet request
function runGetYoutubeQuery(text, sender) {
  var searchQuery = text,
    part = "snippet",
    type = "video",
    maxResults = 3;

  //GET https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=cat&type=video&key={YOUR_API_KEY}
  var youtubeUrlBuilder = 'https://www.googleapis.com/youtube/v3/search?part=' + part + '&maxResults=' + maxResults + '&q=' + searchQuery + '&type=' + type + '&key=' + youtubeToken;

  console.log('inside youtube search');

  console.log(youtubeUrlBuilder);


  request({
    url: youtubeUrlBuilder,
    method: 'GET'
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    } else if (!error && response.statusCode == 200) {
      // console.log(body);
      // Print the google web page.
      ytubeSearchResults = body;
      getYtubeResults(ytubeSearchResults, sender);
    }
  })


  // https://www.googleapis.com/youtube/v3/search?part=snippet&q=cat&type=video&key=AIzaSyCB512ahQA-cSNdxgYObRXV71FRZ0DcW6M

}





//sends a text message
function sendTextMessage(sender, text) {
  messageData = {
    text: text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: token },
    method: 'POST',
    json: {
      recipient: { id: sender },
      message: messageData,
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

//sends a generic message with template provided by facebook
function sendGenericMessage(sender) {
  messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "First card",
          "subtitle": "Element #1 of an hscroll",
          "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
          "buttons": [{
            "type": "web_url",
            "url": "https://www.messenger.com/",
            "title": "Web url"
          }, {
              "type": "postback",
              "title": "Postback",
              "payload": "Payload for first element in a generic bubble",
            }],
        }, {
            "title": "Second card",
            "subtitle": "Element #2 of an hscroll",
            "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
            "buttons": [{
              "type": "postback",
              "title": "Postback",
              "payload": "Payload for second element in a generic bubble",
            }],
          }, {

            "title": "Question 1",
            "subtitle": "Description about the question",
            "buttons": [{
              "type": "web_url",
              "url": "https://www.youtube.com/embed/QH2-TGUlwu4a",
              "title": "this is a google button"
            }]

          }]
      }
    }
  };
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: token },
    method: 'POST',
    json: {
      recipient: { id: sender },
      message: messageData,
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}


//generic message template ends..
//starting a webhook code
app.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === 'my-secrete') {
    res.send(req.query['hub.challenge']);
  }
  // res.send('Error, wrong validation token');
  res.sendFile(path.join(__dirname + '/webhook.html'))

})

//lets do whate ever we want


app.post('/webhook/', function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200));
      if (text === 'Generic') {
        //call generic message from sender , call "sendGenericMessage" function with sender ID as a parameter
        sendGenericMessage(sender);
        continue;
      }
      //       else if (text === 'cat') {
      //   //search youtube videos if two types of if statements failed
      //   // ytubeSearchResults = 
      //   runGetYoutubeQuery(text);
      //   //post results to sender
      // } else
      else if (text === 'hi') {
        console.log('Message from if Loop');
        sendTextMessage(sender, 'Hi Welcome to the awesome chatbot, what would you like to get me from youtube');
      } else {
        //handle text message from sender
        console.log("message from else loop" + text.substring(0, 200));
        sendTextMessage(sender, 'Here are your top three youtube search results');
        runGetYoutubeQuery(text.substring(0, 200), sender)

      }
    }
    if (event.postback) {
      console.log("Entered in the postback event");
      text = JSON.stringify(event.postback);
      sendTextMessage(sender, "Postback received: :) " + text.substring(0, 200), token);
      sendTextMessage(sender, "Image url: https://www.youtube.com/watch?v=QH2-TGUlwu4a");
      var youtubeQuery = runGetYoutubeQuery();
      continue;
    }
  }
  res.sendStatus(200);
});
//calling webhook code ends
//
//this is just a port on which our app runs on ..

var port = 8080;
app.listen(port);
console.log('Express server started on port %s', port);