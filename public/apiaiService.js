const apiai = require('apiai');

const apiAiapp = apiai("30f26315bca54670ae2274a18e35bfa8");

exports.callApiai = function (inputString) {


    // function responseData(response) {
    //     console.log(response);
    //     return response.result.fulfillment.speech;
    // };

    // function errorData(error) {
    //     console.log(error);
    //     console.log("error from api service" + error);
    // };

    // //request.end();
    // return apiAiapp.textRequest(inputString, {
    //     sessionId: '<unique session id>'
    // }).then(responseData, errorData);



    return request = apiAiapp.textRequest(inputString, {
        sessionId: '<unique session id>'
    });

    request.on('response', function (response) {
        console.log(response);
        return response.result.fulfillment.speech;
    });

    request.on('error', function (error) {
        console.log(error);
    });

    request.end();



};
