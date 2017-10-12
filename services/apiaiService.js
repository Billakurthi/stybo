(function () {


    var apiai = require('apiai');
    var apiaiConfig = require('./auth').apiaiConfig;
    var fbService = require('./facebookService');
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
                sessionId: '<unique session id>'
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




                                    var bodyTypeDescription = apiaiTextRequest(bodyType, senderID, timeOfMessage);

                                    //get body type description from api.ai
                                    bodyTypeDescription
                                        .then(function (reply) {

                                            console.log("//get body type description from api.ai \n" + JSON.stringify(reply, null, 2));
                                            try {
                                                console.log("sender ID "+ senderID);
                                                facebookService.sendTextMessage(senderID, reply);
                                                resolve("data from body type service " + bodyType);
                                
                                            } catch (message) {
                                                console.log("message of error" + message);
                                            }


                                        })
                                        .catch(function (reason) {
                                            console.log(JSON.stringify(reason, null, 2));

                                            // facebookService.sendTextMessage(senderID, JSON.stringify(reason));

                                        });
                                    // if bodytype is not rejected then send a generic message with types of dresses

                                    if (bodyType == '#Rejected') {
                                        fbService.fbServiceFunctions.sendGenericMessage(senderID, "#Apple");
                                    }

                                    



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


    var apiaiServiceFunctions = {

        apiaiTextRequest: apiaiTextRequest

    }

    module.exports = {
        apiaiServiceFunctions: apiaiServiceFunctions
    };
})();