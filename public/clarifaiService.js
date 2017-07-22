
// The JavaScript client works in both Node.js and the browser.


// Require the client

const Clarifai = require('clarifai');

// initialize with your api key. This will also work in your browser via http://browserify.org/

const app_clarifai = new Clarifai.App({
    apiKey: 'd702f3b9983a4a5e9bc9f5bf343bb5c0'
});

// You can also use the SDK by adding this script to your HTML:

exports.hello = function(url) {
    app_clarifai.models.predict("Stybo", url).then(
        function(response) {
            console.log("Response:");
            console.log(response.outputs[0].data);
            return (JSON.stringify(response.outputs[0].data));
        },
        function(err) {
            console.log("Error:");
            console.log(err);
            return (JSON.stringify(err));
        }
    );
};


