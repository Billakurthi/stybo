// Require the client
const Clarifai = require('clarifai');

// initialize with your api key. This will also work in your browser via http://browserify.org/
const appClarifai = new Clarifai.App({
    apiKey: 'bd626861f2f24192945ce59e035f0d02'
});

// Predict function to predict image
exports.predict = function (url) {
    //console.log("URLS:");
    //console.log(url);
    url = encodeURI(url);
    //console.log(url);
    return appClarifai.models.predict("Stybo", url).then(
        function (response) {
            var reply = response.outputs[0].data.concepts[0].name +
                " with confidence " + response.outputs[0].data.concepts[0].value;
            console.log("Response:" + reply);
            // sendTextMessage(senderID, reply);
            return reply;
        },
        function (err) {
            console.log("Error:");
            console.log(err);
            // sendTextMessage(senderID, "I am unable to get any result from your input");
            // return "I am unable to get any result from your input";
        }
    );
};

exports.create = function (url) {
    appClarifai.inputs.create({
        url: url,
        concepts: [
            {
                id: "Stybo",
                value: true
            }
        ]
    });
};