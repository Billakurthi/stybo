'use strict';

var express = require("express");
var app = express();
var request = require("request");

var path = require("path");
var bodyParser = require('body-parser');
//var fbService = require('./services/facebookService');
var appMiddlewareService = require('./services/appMiddlewareService').appMiddlewareFunctions;


//parse text using body parser
app.use(bodyParser.json());

app.use(express.static('public'))

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

		appMiddlewareService.postRequestRecievedFromFb(data);
		// Assume all went well.
		//
		// You must send back a 200, within 20 seconds, to let us know
		// you've successfully received the callback. Otherwise, the request
		// will time out and we will keep trying to resend.
		res.sendStatus(200);
	}
});



var port = process.env.PORT || 2000; //which you can run both on Azure or local

app.listen(port);

// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!')
// })
