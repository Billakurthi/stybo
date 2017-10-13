(function () {


    var apiai = require('apiai');
    var apiaiConfig = require('./auth').apiaiConfig;
    // var appMiddlewareService = require('./appMiddlewareService').appMiddlewareFunctions;
    // const apiai_app = new ApiAI.ApiAiClient({accessToken: '30f26315bca54670ae2274a18e35bfa8'});
    var app_apiai = apiai(apiaiConfig.clientAccessToken, {
        language: "en",
        requestSource: "fb"
    });

    var bodyTypeService = require('./bodyTypeService').bodyTypeServiceFunctions;



    // //parse text using body parser
    // app_apiai.use(bodyParser.json());


    // exports.callApiai = function (inputString, callback, senderID) {




    function apiaiTextRequest(inputString, senderID, timeOfMessage) {



        return new Promise(function (resolve, reject) {

            var request = app_apiai.textRequest(inputString, {
                sessionId: senderID//'<unique session id>'
            });

            request.on('response', function (response) {

                // console.log("apiaiTextRequest");
                // console.log("Full api result : \n" + JSON.stringify(response, null, 2));

                var reply = response.result.fulfillment.speech;
                var action = response.result.action;
                var actionIncomplete = response.result.actionIncomplete;
                var responseParameters = response.result.parameters;
                var finalResult = "";

                //console.log("Full api result : \n" + JSON.stringify(response, null, 2));

                if (reply) {

                    if (action && actionIncomplete == false) {

                        switch (action) {
                            case ("body-type.body-type-measurements"):

                                //send parameters to calcuate body type function and get appropriate result
                                var bodyType = bodyTypeService.calculateBodyType(responseParameters.bustSize, responseParameters.waistsize, responseParameters.hipsize);

                                bodyType
                                    .then((reply) => {


                                        if (reply) {

                                            console.log("body-type.body-type-measurements");
                                            console.log("data from body type service =\n" + reply);

                                            //appMiddlewareService.sendTextMessagefb(senderID, reply);

                                            //resolve(reply);
                                            finalResult += reply + "\n";


                                            var bodyParams = apiaiTextRequest(reply, senderID, timeOfMessage);


                                            bodyParams.then(function (data) {
                                                console.log(JSON.stringify(data, null, 2));
                                                finalResult += data + "\n";
                                                resolve(data);


                                            }).catch(function (reason) {
                                                console.log("catch(function (reason) {" + JSON.stringify(reason, null, 2));
                                            })



                                        }
                                    })
                                    .catch((reason) => {
                                        console.log("body-type.body-type-measurements" + reason);
                                    });







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


    // function recallAPIAIService(bodyType, senderID, timeOfMessage) {
    //     console.log("recallAPIAIService");
    //     var bodyParams = apiaiTextRequest(bodyType, senderID, timeOfMessage);

    //     console.log("body Params\n" + bodyParams);
    //     bodyParams.then(function (data) {
    //         console.log(JSON.stringify(data, null, 2));
    //         // try {
    //         fbService.sendTextMessage(data, senderID);
    //         // var fbresponse = 
    //         // fbresponse.then((data) => {
    //         //     console.log(data + "  fbresponse.then((data)");
    //         // })
    //         // } catch (c) {
    //         //     console.log("JSON.stringify(c,"+JSON.stringify(c, null, 2));
    //         // }

    //     }).catch(function (reason) {
    //         console.log("catch(function (reason) {" + JSON.stringify(reason, null, 2));
    //     })

    // }


    var apiaiServiceFunctions = {

        apiaiTextRequest: apiaiTextRequest

    };


    module.exports = {
        apiaiServiceFunctions: apiaiServiceFunctions
    };
})();