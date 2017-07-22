
// The JavaScript client works in both Node.js and the browser.


// Install the client from NPM

//npm install clarifai

// Require the client

const Clarifai = require('clarifai');

// initialize with your api key. This will also work in your browser via http://browserify.org/

const app = new Clarifai.App({
    apiKey: 'd702f3b9983a4a5e9bc9f5bf343bb5c0'
});

// You can also use the SDK by adding this script to your HTML:

//<script type="text/javascript" src="https://sdk.clarifai.com/js/clarifai-latest.js"></script>



app.models.predict("c1eb33d205024fedb6e22d7c026c853a", "https://samples.clarifai.com/metro-north.jpg").then(
    function(response) {
        console.log(response);
    },
    function(err) {
        console.log(err);
    }
);