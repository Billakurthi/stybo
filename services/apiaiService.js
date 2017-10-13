(function () {


    var apiai = require('apiai');
    var apiaiConfig = require('./auth').apiaiConfig;
    // var appMiddlewareService = require('./appMiddlewareService').appMiddlewareFunctions;
    // const apiai_app = new ApiAI.ApiAiClient({accessToken: '30f26315bca54670ae2274a18e35bfa8'});
    var app_apiai = apiai(apiaiConfig.clientAccessToken, {
        language: "en",
        requestSource: "fb"
    });





    // //parse text using body parser
    // app_apiai.use(bodyParser.json());


    // exports.callApiai = function (inputString, callback, senderID) {




    function apiaiTextRequest(inputString, senderID) {



        return new Promise(function (resolve, reject) {

            var request = app_apiai.textRequest(inputString, {
                sessionId: senderID//'<unique session id>'
            });

            request.on('response', function (response) {
                resolve(response);                
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