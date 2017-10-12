(function () {


    var apiai = require('apiai');
    var apiaiConfig = require('./auth').apiaiConfig;
    var fbService = require('../services/facebookService').fbServiceFunctions;
    // const apiai_app = new ApiAI.ApiAiClient({accessToken: '30f26315bca54670ae2274a18e35bfa8'});
    var app_apiai = apiai(apiaiConfig.clientAccessToken, {
        language: "en",
        requestSource: "fb"
    });

    var bodyTypeService = require('./bodyTypeService').bodyTypeServiceFunctions;

    var bodyParser = require('body-parser');

    // //parse text using body parser
    // app_apiai.use(bodyParser.json());


    // exports.callApiai = function (inputString, callback, senderID) {




    function apiaiTextRequest(inputString, senderID, timeOfMessage) {

        return new Promise(function (resolve, reject) {

            var request = app_apiai.textRequest(inputString, {
                sessionId: senderID//'<unique session id>'
            });

            request.on('response', function (response) {

                console.log("apiaiTextRequest");
                console.log("Full api result : \n" + JSON.stringify(response, null, 2));

                var reply = response.result.fulfillment.speech;
                var action = response.result.action;
                var actionIncomplete = response.result.actionIncomplete;
                var responseParameters = response.result.parameters;

                //console.log("Full api result : \n" + JSON.stringify(response, null, 2));

                if (reply) {

                    if (action && actionIncomplete == false) {

                        switch (action) {
                            case ("body-type.body-type-measurements"):

                                //send parameters to calcuate body type function and get appropriate result
                                var bodyType = bodyTypeService.calculateBodyType(responseParameters.bustSize, responseParameters.waistsize, responseParameters.hipsize);

                                if (bodyType) {

                                    console.log("body-type.body-type-measurements");
                                    console.log("data from body type service =\n" + bodyType);
                                    recallAPIAIService(bodyType, senderID, timeOfMessage);
                                    setTimeout(function () {
                                        resolve(bodyType);
                                    }, 2000);







                                }

                                break;

                            default:

                                resolve(reply);
                                break;


                        }
                    } else {
                        resolve(reply);
                    }



                }
                else {
                    resolve("no entities trained");
                }
            });


            request.on('error', function (error) {
                console.log("Build Error Message: " + error);
                reject(error);
            });

            request.end();

        });

    }


    function recallAPIAIService(bodyType, senderID, timeOfMessage) {
        console.log("recallAPIAIService");
        var bodyParams = apiaiTextRequest(bodyType, senderID, timeOfMessage);

        console.log("body Params\n" + bodyParams);
        bodyParams.then(function (data) {
            console.log(JSON.stringify(data, null, 2));
            try {
                fbService.sendTextMessage(data, senderID);
            } catch (c) {
                console.log(JSON.stringify(c, null, 2));
            }

        }).catch(function (reason) {
            console.log(JSON.stringify(reason, null, 2));
        })

    }


    var apiaiServiceFunctions = {

        apiaiTextRequest: apiaiTextRequest

    };


    module.exports = {
        apiaiServiceFunctions: apiaiServiceFunctions
    };
})();