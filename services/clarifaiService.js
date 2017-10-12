'use strict';
(function () {



    // Require the client
    const Clarifai = require('clarifai'),

        clarifyConfig = require('./auth').clarifyConfig;


    // initialize with your api key. This will also work in your browser via http://browserify.org/
    const appClarifai = new Clarifai.App({
        apiKey: clarifyConfig.CLARIFY_API_KEY
    });

    // Predict function to predict image
    exports.predict = function (url) {
        //console.log("URLS:");
        //console.log(url);
        url = encodeURI(url);
        //console.log(url);
        return appClarifai.models.predict("Stybo", url).then(
            function (response) {
                var reply = response.outputs[0].data.concepts[0].name;
                // +                " with confidence " + response.outputs[0].data.concepts[0].value;
                console.log("Response:" + reply);
                // sendTextMessage(senderID, reply);
                return '#' + reply;
            },
            function (err) {
                console.log("Error:");
                console.log(err);
                // sendTextMessage(senderID, "I am unable to get any result from your input");
                // return "I am unable to get any result from your input";
            }
        );
    };

    exports.create = function (url) {
        appClarifai.inputs.create({
            url: url,
            concepts: [
                {
                    id: "Stybo",
                    value: true
                }
            ]
        });
    };


    exports.generalModelSearch = function (searchUrl) {

        console.log("inside searchUrl" + searchUrl);

        appClarifai.models.predict(Clarifai.GENERAL_MODEL, searchUrl).then(
            function (response) {
                
                console.log("General Model response =" + JSON.stringify(response,null,2));
                // do something with response
            },
            function (err) {
                console.log("General Model error =" + JSON.stringify(error,null,2));

                // there was an error
            }
        );
    };

}());