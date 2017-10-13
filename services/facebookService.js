'use strict';


(function () {

    var fbConfig = require('./auth').facebookConfig,
        request = require('request');




    //facebook page access token
    var PAGE_ACCESS_TOKEN = fbConfig.FACEBOOK_PAGE_ACCESS_TOKEN;

   
    //const apiaiService = require('./apiaiService').apiaiServiceFunctions;


    // //user prototype object 
    // function styboUser(uid, hasImageUrl, uage) {
    //   this.userid = uid;
    //   this.imgUrl = hasImageUrl;
    //   this.age = uage;
    // };
    //user prototype object 
    var current_users = {};
    var costumes = {
        "#Neat Hourglass": {
            "url1": "http://ecx.images-amazon.com/images/I/71%2BQSzV%2B1cL._UL1500_.jpg",
            "url2": "http://ecx.images-amazon.com/images/I/41nqVZKJz3L.jpg",
            "url3": "http://ecx.images-amazon.com/images/I/61w-Hv-tKqL._UL1500_.jpg",
            "url4": "http://ecx.images-amazon.com/images/I/61Jwjn23N9L._UL1500_.jpg",
            "url5": "http://ecx.images-amazon.com/images/I/61kig18c9XL._UL1500_.jpg"
        },
        "#Inverted Triangle": {
            "url1": "http://ecx.images-amazon.com/images/I/71ji0LPifIL._UL1500_.jpg",
            "url2": "http://ecx.images-amazon.com/images/I/61QV3gZrwQL._UL1500_.jpg",
            "url3": "http://ecx.images-amazon.com/images/I/51dKbbwaWnL._UL1500_.jpg",
            "url4": "http://ecx.images-amazon.com/images/I/51itQkdgAeL._UL1500_.jpg",
            "url5": "http://ecx.images-amazon.com/images/I/51Wp-nwOhHL._UL1500_.jpg"
        },
        "#Apple": {
            "url1": "http://ecx.images-amazon.com/images/I/71YQM7ewIfL._UL1500_.jpg",
            "url2": "http://ecx.images-amazon.com/images/I/81ivCFgPyFL._UL1500_.jpg",
            "url3": "http://ecx.images-amazon.com/images/I/913d1hmo5dL._UL1500_.jpg",
            "url4": "http://ecx.images-amazon.com/images/I/61GUm8nCI3L._UL1500_.jpg",
            "url5": "http://ecx.images-amazon.com/images/I/71DsbnF1TdL._UL1500_.jpg"
        },
        "#Rectangle": {
            "url1": "http://ecx.images-amazon.com/images/I/61RDxIghPrL._UL1500_.jpg",
            "url2": "http://ecx.images-amazon.com/images/I/41WkYdsHBjL._AC_UL260_SR200,260_FMwebp_QL70_.jpg",
            "url3": "http://ecx.images-amazon.com/images/I/41dKBRjvpjL._AC_UL260_SR200,260_FMwebp_QL70_.jpg",
            "url4": "http://ecx.images-amazon.com/images/I/418kc0ymF3L._AC_UL260_SR200,260_FMwebp_QL70_.jpg",
            "url5": "http://ecx.images-amazon.com/images/I/31PyhhmkJLL._AC_UL260_SR200,260_FMwebp_QL70_.jpg"
        },
        "#Pear": {
            "url1": "http://ecx.images-amazon.com/images/I/61UoOsYb4RL._UL1500_.jpg",
            "url2": "http://ecx.images-amazon.com/images/I/61Znnokj20L._UL1500_.jpg",
            "url3": "http://ecx.images-amazon.com/images/I/71uiMIEqrVL._UL1500_.jpg",
            "url4": "http://ecx.images-amazon.com/images/I/710HTMM4wNL._UL1500_.jpg",
            "url5": "http://ecx.images-amazon.com/images/I/71FFrmx6msL._UL1500_.jpg"
        },
        "#Full Hourglass": {
            "url1": "http://ecx.images-amazon.com/images/I/814rnf3ZXGL._UL1500_.jpg",
            "url2": "http://ecx.images-amazon.com/images/I/71yim%2BNAOTL._UL1500_.jpg",
            "url3": "http://ecx.images-amazon.com/images/I/91Y26g1VpyL._UL1500_.jpg",
            "url4": "http://ecx.images-amazon.com/images/I/71-ViCtCXcL._UL1500_.jpg",
            "url5": "http://ecx.images-amazon.com/images/I/71DbIpwn2TL._UL1500_.jpg"
        },
        "#Lean Column": {
            "url1": "http://ecx.images-amazon.com/images/I/71RqTZISV5L._UL1500_.jpg",
            "url2": "http://ecx.images-amazon.com/images/I/61hVFej6N8L._UL1500_.jpg",
            "url3": "http://ecx.images-amazon.com/images/I/71Dl0tiqz6L._UL1500_.jpg",
            "url4": "http://ecx.images-amazon.com/images/I/71kJ2vBpeoL._UL1500_.jpg",
            "url5": "http://ecx.images-amazon.com/images/I/71TSo0zPzfL._UL1500_.jpg"
        }
    }


   

    function sendTextMessage(recipientId, messageText) {
        console.log("//inside send text message \n" + JSON.stringify(messageText, null, 2));



        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                text: messageText
            }
        };
        callSendAPI(messageData);


    }





    // send generic message

    function sendGenericMessage(recipientId, reply) {

        var sr1 = costumes[reply].url1;
        var sr2 = costumes[reply].url2;
        var sr3 = costumes[reply].url3;
        var sr4 = costumes[reply].url4;
        var sr5 = costumes[reply].url5;


        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "generic",
                        elements: [{
                            title: "Exotic",
                            subtitle: "Your best fit is here",
                            item_url: sr1,
                            image_url: sr1,
                            buttons: [{
                                type: "postback",
                                title: "Buy Now",
                                payload: "#buyClicked",
                            }],
                        }, {
                            title: "Vibrant",
                            subtitle: "Be ready for party always",
                            item_url: sr2,
                            image_url: sr2,
                            buttons: [{
                                type: "postback",
                                title: "Buy Now",
                                payload: "#buyClicked",
                            }]
                        }, {
                            title: "Versatile",
                            subtitle: "Get Trendy",
                            item_url: sr3,
                            image_url: sr3,
                            buttons: [{
                                type: "postback",
                                title: "Buy Now",
                                payload: "#buyClicked",
                            }]
                        }, {
                            title: "Dhana Dhan",
                            subtitle: "You are princess",
                            item_url: sr4,
                            image_url: sr4,
                            buttons: [{
                                type: "postback",
                                title: "Buy Now",
                                payload: "#buyClicked",
                            }]
                        }, {
                            title: "Angel here",
                            subtitle: "Rock on Style",
                            item_url: sr5,
                            image_url: sr5,
                            buttons: [{
                                type: "postback",
                                title: "Buy Now",
                                payload: "#buyClicked",
                            }]
                        }]
                    }
                }
            }
        };

        callSendAPI(messageData);
    }


    //function to call callSendAPI
    function callSendAPI(messageData) {
        request({
            uri: 'https://graph.facebook.com/v2.6/me/messages',
            qs: { access_token: PAGE_ACCESS_TOKEN },
            method: 'POST',
            json: messageData

        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var recipientId = body.recipient_id;
                var messageId = body.message_id;

                console.log("Successfully sent generic message with id %s to recipient %s",
                    messageId, recipientId);
            } else {
                console.error("Unable to send message.");
                console.error(response);
                console.error(error);
            }
        });
    }




    var fbServiceFunctions = {

        //receivedMessage: receivedMessage,
        sendGenericMessage: sendGenericMessage,
        sendTextMessage: sendTextMessage

    }
    module.exports = {
        fbServiceFunctions: fbServiceFunctions
    }


}());