
var apiai = require('apiai');
// const apiai_app = new ApiAI.ApiAiClient({accessToken: '30f26315bca54670ae2274a18e35bfa8'});
var app_apiai = apiai("30f26315bca54670ae2274a18e35bfa8");


exports.callApiai = function (inputString, callback, senderID) {

    var request = app_apiai.textRequest(inputString, {
        sessionId: '<unique session id>'
    });

    request.on('response', function (response) {
        var reply = response.result.fulfillment.speech;
        if (reply) {
            console.log("Full api result: " + JSON.parse(response.result.fulfillment,null,2));
            callback(senderID, reply);
        } else {
            callback(senderID, "no entities trained");
        }
    });

    request.on('error', function (error) {
        console.log("Build Error Message: " + error);
        callback(senderID, "Error");
    });

    request.end();
};