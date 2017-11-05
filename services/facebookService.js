'use strict';


(function () {

    var fbConfig = require('./auth').facebookConfig,
        request = require('request');




    //facebook page access token
    var PAGE_ACCESS_TOKEN = fbConfig.FACEBOOK_PAGE_ACCESS_TOKEN;


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

        try {
            callSendAPI(messageData);
        } catch (error) {
            console.log(JSON.stringify(error, null, 2));
        }

    }

    /** Send a message with Quick Reply buttons.
     * 
     * Text: Should be a question string ,
     * 
     * replies: Should be an array of reply objects
     * 
     * **/

    function sendQuickReply(recipientId, text, replies, metadata) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                text: text,
                metadata: isDefined(metadata) ? metadata : '',
                quick_replies: replies
            }
        };

        callSendAPI(messageData);
    }


    //region send list Items

    function sendListMessage(recipientId, top_element_style, elements, buttons) {
        var listTemplate = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "list",
                        top_element_style: top_element_style || "compact",
                        elements: elements,
                        buttons: [
                            buttons
                        ]
                    }
                }
            }
        };



        //if buttons are not passed as parameter then delete button property

        if (buttons == undefined || buttons == null) {
            delete listTemplate.message.attachment.payload.buttons;
        };

        callSendAPI(listTemplate);
    };

/**
 * creating new generic button item object
 * @param {string} type 
 * @param {sting} title 
 * @param {Name of the function} functionName 
 * @param {Unique Identifier of item} payload 
 */


    function BUTTON_TEMPLATE(type, title, functionName, payload) {
        this.type = type;
        this.title = title;
        this.payload = functionName + ',' + payload;
    };

    //Creating new Generic Element object in Generic Template
    /**
     * 
     * @param {string} title 
     * @param {string} subtitle 
     * @param {url} item_url 
     * @param {Image url} image_url 
     * @param {[]} buttons 
     */

    function ELEMENT_TEMPLATE(title, subtitle, item_url, image_url, buttons) {
        this.title = title,
            this.subtitle = subtitle,
            this.item_url = item_url,
            this.image_url = image_url,
            this.buttons = buttons
    }


    // send generic message
    function sendTrendingGenericMessage(recipientId, reply) {
        var reply = reply || "#Apple";
        //var buttons = [];
        var generic_elements = [];

        for (var key in costumes[reply]) {

            var BUY_BUTTON = new BUTTON_TEMPLATE("postback", "Buy Now", "BUY_NOW_POSTBACK", (costumes[reply])[key]);

            var ADD_TO_CART = new BUTTON_TEMPLATE("postback", "Add To cart", "ADD_TO_CART_POSTBACK", (costumes[reply])[key]);

            var buttons = [];

            buttons.push(ADD_TO_CART, BUY_BUTTON);

            var newElement = new ELEMENT_TEMPLATE("title", "Subtitle", (costumes[reply])[key], (costumes[reply])[key], buttons);

            generic_elements.push(newElement);
        }


        sendGenericMessage(recipientId, generic_elements);

        // var messageData = {

        //     recipient: {

        //         id: recipientId

        //     },

        //     message: {
        //         attachment: {

        //             type: "template",

        //             payload: {

        //                 template_type: "generic",

        //                 elements: generic_elements
        //             }
        //         }
        //     }
        // };

        console.log(JSON.stringify(messageData, null, 2));

        callSendAPI(messageData);
    };



    //send Generic Message

    function sendGenericMessage(recipientId, generic_elements) {

        var messageData = {

            recipient: {

                id: recipientId

            },

            message: {
                attachment: {

                    type: "template",

                    payload: {

                        template_type: "generic",

                        elements: generic_elements
                    }
                }
            }
        };

        console.log(JSON.stringify(messageData, null, 2));

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
                console.error("response \n " + JSON.stringify(response, null, 3));
                console.error("error \n " + JSON.stringify(error, null, 3));

            }
        });
    }

    //send Video
    function sendVideo(recipientId, videoPath) {

        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "video",
                    payload: {
                        url: videoPath
                    }
                }
            }
        }

        callSendAPI(messageData);

    }



    //region check if obj is defined or not
    function isDefined(obj) {
        if (typeof obj == 'undefined') {
            return false;
        }

        if (!obj) {
            return false;
        }

        return obj != null;
    }

    //endregion check if obj is defined or not

    var fbServiceFunctions = {

        //receivedMessage: receivedMessage,
        sendTrendingGenericMessage: sendTrendingGenericMessage,
        sendTextMessage: sendTextMessage,
        sendQuickReply: sendQuickReply,
        sendVideo: sendVideo,
        sendListMessage: sendListMessage,
        sendTrendingGenericMessage: sendGenericMessage

    }
    module.exports = {
        fbServiceFunctions: fbServiceFunctions
    }


}());