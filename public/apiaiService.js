// const ApiAI = require("api-ai-javascript");
var apiai = require('apiai');

// const apiai_app = new ApiAI.ApiAiClient({accessToken: '30f26315bca54670ae2274a18e35bfa8'});
var app = apiai("30f26315bca54670ae2274a18e35bfa8");

exports.callApiai = function (inputString, callback, senderID) {

    var request = app.textRequest(inputString, {
        sessionId: '<unique session id>'
    });

    request.on('response', function (response) {
        console.log(response);

        console.log("Build Reply Message: " + response);
        callback(senderID, "Reply");
    });

    request.on('error', function (error) {
        console.log(error);

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
