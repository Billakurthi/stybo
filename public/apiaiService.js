const ApiAi = require("api-ai-javascript");

const apiai_app = new ApiAI.ApiAiClient({accessToken: '30f26315bca54670ae2274a18e35bfa8'});

exports.callApiai = function (inputString) {

    return apiai_app.textRequest(inputString).then(
        handleResponse,
        handleError
    );

    function handleResponse(serverResponse) {
        console.log("Response from apiai_app: ");
        console.log(serverResponse);
        return "Message received";
    }

    function handleError(serverError) {
        console.log("Error from apiai_app: ");
        console.log(serverError);
        return "error";
    }

};
