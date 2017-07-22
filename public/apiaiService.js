const apiai = new ApiAi.ApiAiClient({accessToken: '30f26315bca54670ae2274a18e35bfa8'});

exports.callApiai = function (inputString) {

    return client.textRequest(inputString).then(
        handleResponse,
        handleError
    );

    function handleResponse(serverResponse) {
        console.log("Response from apiai: ");
        console.log(serverResponse);
        return "Message received";
    }

    function handleError(serverError) {
        console.log("Error from apiai: ");
        console.log(serverError);
        return "error";
    }

};
