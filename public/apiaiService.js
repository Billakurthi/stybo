const apiai = require('apiai');

var apiAiapp = apiai("30f26315bca54670ae2274a18e35bfa8");

exports.callApiai = function (inputString) {


    function responseData(response) {
        console.log(response);
        return response.result.fulfillment.speech;
    };

    function errorData(error) {
        console.log(error);
        console.log("error from api service" + error);
    };

    //request.end();
    return apiAiapp.textRequest(inputString, {
        sessionId: '<unique session id>'
    }).then(responseData, errorData);

};
