var express = require("express");
var app = express();

var path = require("path");
var bodyParser = require('body-parser');



//parse text using body parser
 app.use(bodyParser.json());

 app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'))
})

//starting a webhook code
app.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === 'my-secrete') {
    res.send(req.query['hub.challenge']);
  }
  // res.send('Error, wrong validation token');
  res.sendFile(path.join(__dirname + '/webhook.html'))

})

var port = process.env.PORT||2000; //which you can run both on Azure or local

app.listen(port);

// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!')
// })