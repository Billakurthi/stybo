var express = require("express");
// var http = require('http');
var app = express();
var path = require("path");
// var request = require('request');

//app.use('/static', express.static(__dirname + '/public'));


// var bodyParser = require('body-parser');



//parse text using body parser
// app.use(bodyParser.json());



// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname + '/index.html'))
// });

app.get('/', function (req, res) {
  res.send('world!');
});

var port = process.env.PORT||2000; //which you can run both on Azure or local

app.listen(port);

// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!')
// })