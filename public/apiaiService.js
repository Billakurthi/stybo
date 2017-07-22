var apiai = require('apiai');

var app = apiai("30f26315bca54670ae2274a18e35bfa8");

exports.callApiai = function (inputString) {

    var request = app.textRequest(inputString, {
        sessionId: '<unique session id>'
    });

    var responseData = request.on('response', function (response) {
        console.log(response);
        return response;
    });

    request.on('error', function (error) {
        console.log(error);
        console.log("error from api service" + error);
    });

    request.end();
    return responseData;

};
