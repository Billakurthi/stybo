// const ApiAI = require("api-ai-javascript");
var apiai = require('apiai');

// const apiai_app = new ApiAI.ApiAiClient({accessToken: '30f26315bca54670ae2274a18e35bfa8'});
var app_apiai = apiai("30f26315bca54670ae2274a18e35bfa8");
//
// var bodyParser = require('body-parser');
// app_apiai.use(bodyParser.json());

exports.callApiai = function (inputString, callback, senderID) {

    var request = app_apiai.textRequest(inputString, {
        sessionId: '<unique session id>'
    });

    request.on('response', function (response) {
        var reply = response.result.fulfillment.speech;
        var replySpeech = '';
        if (response.result.fulfillment.messages.speech) {
            replySpeech = JSON.stringify(response.result.fulfillment.messages.speech);
            console.log(replySpeech);
            callback(senderID, replySpeech);
        };
        console.log("Full: " + reply + 'replySpeech' + replySpeech);

        callback(senderID, reply);


    });

    request.on('error', function (error) {
        console.log("Build Error Message: " + error);
        callback(senderID, "Error");
    });

    request.end();

    // return apiai_app.textRequest(inputString).then(
    //     handleResponse,
    //     handleError
    // );
    //
    // function handleResponse(serverResponse) {
    //     console.log("Response from apiai_app: ");
    //     console.log(serverResponse);
    //     return "Message received";
    // }
    //
    // function handleError(serverError) {
    //     console.log("Error from apiai_app: ");
    //     console.log(serverError);
    //     return "error";
    // }

};
