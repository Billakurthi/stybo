'use strict';
(function () {

    // Require the client
    const Clarifai = require('clarifai'),

        clarifyConfig = require('./auth').clarifyConfig;


    // initialize with your api key. This will also work in your browser via http://browserify.org/
    const appClarifaiBodyType = new Clarifai.App({
        apiKey: clarifyConfig.CLARIFY_BODY_TYPE_API_KEY
    });

    // Predict function to predict image
    var predict = function (url) {
        //console.log("URLS:");
        //console.log(url);
        url = encodeURI(url);
        //console.log(url);
        return appClarifaiBodyType.models.predict("Stybo", url).then(
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

    var create = function (url) {
        appClarifaiBodyType.inputs.create({
            url: url,
            concepts: [
                {
                    id: "Stybo",
                    value: true
                }
            ]
        });
    };


    var generalModelSearch = function (searchUrl) {

        console.log("inside searchUrl" + searchUrl);

        appClarifaiBodyType.models.predict(Clarifai.GENERAL_MODEL, searchUrl).then(
            function (response) {

                console.log("General Model response =" + JSON.stringify(response, null, 2));
                // do something with response
            },
            function (err) {
                console.log("General Model error =" + JSON.stringify(error, null, 2));

                // there was an error
            }
        );
    };




    const appClarifaiImageSearch = new Clarifai.App({
        apiKey: clarifyConfig.CLARIFY_IMAGE_SEARCH_API_KEY
    });
    
    function getSimilarDress(imageURL) {

        var imageResults = [];

        return appClarifaiImageSearch.inputs.search(
            {
                input: { url: imageURL }
            }).then(
            function (response) {
                // do something with response
                //console.log(JSON.stringify(response,null,2));
                response.hits.forEach(function (element) {
                    // fs.writeFile("test.txt",JSON.stringify(response,null,2) , function(err) {
                    //     if(err) {
                    //         return console.log(err);
                    //     }
                    // });

                    if (imageResults.length == 5) {
                        return;
                    };

                    imageResults.push(element.input.data.image.url);
                    
                }, this);

                return imageResults;

            },
            function (err) {
                //                console.log(err);
                console.log(JSON.stringify(err, null, 2));

                // there was an error
            }
            );

    }


    module.exports = {

        predict: predict,
        generalModelSearch: generalModelSearch,
        create: create,
        getSimilarDress: getSimilarDress
    }

}());