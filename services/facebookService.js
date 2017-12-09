'use strict';


(function () {

    var fbConfig = require('./auth').facebookConfig,
        request = require('request');




    //facebook page access token
    var PAGE_ACCESS_TOKEN = fbConfig.FACEBOOK_PAGE_ACCESS_TOKEN;


    var costumes = {
        "#Neat Hourglass": {
            "url1": "http://blog.theluxurycloset.com/wp-content/uploads/2014/05/5fd1d2c56572b740c55079c7487fcc6c.jpg",
            "url2": "https://i.pinimg.com/236x/63/23/aa/6323aaab74bf0f80953c9fa57894cc34--hourglass-figure-outfits-hourglass-style.jpg",
            "url3": "https://passionalboutique.files.wordpress.com/2014/10/1927-supreme-bodycon-hourglass-dress-front.jpg",
            "url4": "https://d5yjppyekae0b.cloudfront.net/large/2017/5/12/Faviana-S7999_Bordeaux_1.jpg",
            "url5": "https://i.pinimg.com/736x/75/c9/25/75c925396c7adeb522bb8695838c019f--hourglass-body-hourglass-figure.jpg"
        },
        "#Inverted Triangle": {
            "url1": "https://i.pinimg.com/originals/e4/fd/7d/e4fd7dad9be1f9d8a5c1e7c3bb7f0c72.jpg",
            "url2": "http://lookandfashion-static.hola.com/atrendylife/files/2015/01/hola-fashion-look-shorts-vaqueros-en-invierno-3.jpg",
            "url3": "https://i.pinimg.com/236x/9a/b5/d7/9ab5d7d8d91cabecbb7a331c3bad9bc8--clear-winter-deep-winter.jpg",
            "url4": "https://i.pinimg.com/736x/b0/48/cc/b048cc0878a48e05d2c19e71a0953d72--alicia-moore-inverted-triangle.jpg",
            "url5": "http://s3cdn-test-lookbooknu.netdna-ssl.com/files/looks/medium/2012/09/05/2488245_lookbook-hapatime.jpg?1346838557"
        },
        "#Apple": {
            "url1": "http://nafdress.com/assests/images/city-chic-marrakech-beach-dress-womens-plus-size-fashion-5016822.jpg",
            "url2": "http://www.kzdress.com/wp-content/uploads/2016/06/Plus-Size-Summer-Dresses-For-Women-1466260861-2016.jpg",
            "url3": "http://all-womens-dresses.com/wp-content/uploads/parser/cute-plus-size-party-dresses-1.jpg",
            "url4": "http://www.kzdress.com/wp-content/uploads/2016/06/Evening-Dresses-For-Plus-Size-Women-1466262409-2016.jpg",
            "url5": "https://i.pinimg.com/736x/84/d6/77/84d6773fea1b6bcb003ac9afe6da4c87--semi-formal-dresses-formal-wear.jpg"
        },
        "#Rectangle": {
            "url1": "http://stylishcurves.com/wp-content/uploads/2015/04/1321090_009_1.jpg",
            "url2": "https://media.ezibuy.com/sys-master/images/hbb/h4e/9122242920478/17AA-apple-work.jpg",
            "url3": "https://i.pinimg.com/236x/b0/60/05/b060054da841f2d0dc55d09458d30e44--curvy-style-maya.jpg",
            "url4": "https://i.pinimg.com/736x/08/6e/4b/086e4bef20d8123dedf8dc819f3a81d9--rectangle-body-shapes-cargo-pants.jpg",
            "url5": "https://i.pinimg.com/736x/04/c7/c7/04c7c75e9a1fbd436489bfafd610ab6f--rectangle-body-shapes-rectangle-shape.jpg"
        },
        "#Pear": {
            "url1": "http://www.teluguone.com/tonecmsuserfiles/HOW%20TO%20DRESS%20A%20PEAR-SHAPED%20BODY-03.png",
            "url2": "http://www.styled247.com/wp-content/uploads/2014/02/How-to-get-rid-of-pear-shaped-body-as-a-woman.jpg",
            "url3": "https://lipglossandcrayons.com/wp-content/uploads/2017/08/best-jeans-for-a-pear-shape-body-paige-denim-1000x1500.jpg",
            "url4": "https://qph.ec.quoracdn.net/main-qimg-4618f28be003979d6a88ab87e9c36fc5-c",
            "url5": "https://s3.amazonaws.com/com.stitchfix.blog/wp-content/uploads/2016/05/12144935/12_06_W_NY17_Email_12W3_Demand-This-Could-Be-Your-Fix_New-Years-Resolutions_v1_0108.jpg"
        },
        "#Full Hourglass": {
            "url1": "https://cdn3.blovcdn.com/bloglovin/aHR0cCUzQSUyRiUyRnN0eWxlcGFudHJ5LmNvbSUyRndwLWNvbnRlbnQlMkZ1cGxvYWRzJTJGMjAxNiUyRjAxJTJGUzAwMjAtMi5qcGc=?checksum=22a4ad9da5290b1395f877fa78ac4fd0b3f4db2c&format=j",
            "url2": "http://fustany.com/images/en/photo/large_fustany-fashion-weddings-the_perfect_wedding_dress_for_every_body_shape-empire_wedding_dress.PNG",
            "url3": "https://unique-vintage.akamaized.net/media/catalog/product//U/n/Unique_Vintage_1950s_Style_Jingle_Bells_Evergreen_High_Waist_Swing_Skirt.jpg",
            "url4": "https://scstylecaster.files.wordpress.com/2013/10/slimming-clothing-8.jpg?w=670&h=447",
            "url5": "https://i.pinimg.com/736x/d2/b2/2d/d2b22d165cf2d233889fefcce18156b5--black-noir-faux-wrap-dress.jpg"
        },
        "#Lean Column": {
            "url1": "https://i.pinimg.com/736x/17/3c/a3/173ca3fc90564bf7c00f40399d913481--ombre-bob-jessica-alba-outfit.jpg",
            "url2": "https://i.pinimg.com/736x/8d/aa/3a/8daa3a68dcfc9df22d68247a433120e9--women-sleeve-work-dresses.jpg",
            "url3": "https://i.pinimg.com/736x/ef/72/e6/ef72e6e2ee3facb6ea1095eab5460973--outfits-for-spring-professional-outfits-women-spring.jpg",
            "url4": "http://www.womensok.com/wp-content/uploads/2016/11/Wear-layered-dresses-and-tops.jpg",
            "url5": "https://www.hebeos.com/media/catalog/product/cache/1/image/600x800/9df78eab33525d08d6e5fb8d27136e95/6/0/60203-01.jpg"
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

        console.log("SendTrendingGenericMessage");
        var reply = reply || "#Apple";
        //var buttons = [];
        var generic_elements = [];

        for (var key in costumes[reply]) {

            var BUY_BUTTON = new BUTTON_TEMPLATE("postback", "Buy Now", "BUY_NOW_POSTBACK", (costumes[reply])[key]);

            var ADD_TO_CART = new BUTTON_TEMPLATE("postback", "Add To cart", "ADD_TO_CART_POSTBACK", (costumes[reply])[key]);

            var GET_SIMILAR_DRESSES_BUTTON = new BUTTON_TEMPLATE("postback", "Show more Like This", "GET_SIMILAR_DRESSES_POSTBACK", (costumes[reply])[key]);

            var buttons = [];

            buttons.push(ADD_TO_CART, BUY_BUTTON, GET_SIMILAR_DRESSES_BUTTON);

            var newElement = new ELEMENT_TEMPLATE("title", "Subtitle \n Price: $22.20", (costumes[reply])[key], (costumes[reply])[key], buttons);

            generic_elements.push(newElement);
        }

        console.log(" generic_elements" + generic_elements);

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
        sendGenericMessage: sendGenericMessage

    }
    module.exports = {
        fbServiceFunctions: fbServiceFunctions
    }


}());