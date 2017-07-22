
// The JavaScript client works in both Node.js and the browser.
exports.hello = function() {
    return "Hello";
}

// Install the client from NPM

//npm install clarifai

// Require the client

const Clarifai = require('clarifai');

// initialize with your api key. This will also work in your browser via http://browserify.org/

const app_clarifai = new Clarifai.App({
    apiKey: 'd702f3b9983a4a5e9bc9f5bf343bb5c0'
});

// You can also use the SDK by adding this script to your HTML:




app_clarifai.models.predict("Stybo", "https://scontent.xx.fbcdn.net/v/t34.0-12/20217391_1468434239916375_316052595_n.jpg?_nc_ad=z-m&oh=ae3bc3d326733e132d6135580d69578e&oe=5975D13A").then(
    function(response) {
        console.log("Response:");
        console.log(response.outputs[0].data);
    },
    function(err) {
        console.log("Error:");
        console.log(err);
    }
);