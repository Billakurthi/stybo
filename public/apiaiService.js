
var apiai = require('apiai');
// const apiai_app = new ApiAI.ApiAiClient({accessToken: '30f26315bca54670ae2274a18e35bfa8'});
var app_apiai = apiai("30f26315bca54670ae2274a18e35bfa8");


exports.callApiai = function (inputString, callback, senderID) {

    var request = app_apiai.textRequest(inputString, {
        sessionId: '<unique session id>'
    });

    request.on('response', function (response) {
        var reply = response.result.fulfillment.speech;

        console.log("Full: " + reply);

        callback(senderID, reply);


    });

    request.on('error', function (error) {
        console.log("Build Error Message: " + error);
        callback(senderID, "Error");
    });

    request.end();
};

exports.generalModelSearch = function(searchUrl){

    app_apiai.models.predict(Clarifai.GENERAL_MODEL, searchUrl, { language: 'en' }).then(
        function (response) {
            console.log("General Model response =" + JSON.stringify(response));
            // do something with response
        },
        function (err) {
            console.log("General Model error =" + JSON.stringify(error));

            // there was an error
        }
    );
};