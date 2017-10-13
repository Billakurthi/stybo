(() => {

    var facebookService = require('./facebookService').fbServiceFunctions;
    var apiaiService = require('./apiaiService').apiaiServiceFunctions;
    const clarifaiService = require('./clarifaiService');
    var bodyTypeService = require('./bodyTypeService').bodyTypeServiceFunctions;


    function sendTextMessagefb(senderId, messageText) {

        facebookService.sendTextMessage(senderId, messageText);

    };


    function receivedMessagefb(event) {

        //recieved msg event function from messenger



        var senderID = event.sender.id;
        var recipientID = event.recipient.id;
        var timeOfMessage = event.timestamp;
        var message = event.message;

        console.log("Received message for user %d and page %d at %d with message:",
            senderID, recipientID, timeOfMessage);
        console.log(JSON.stringify(message));

        var messageId = message.mid;
        var messageText = message.text;
        var messageAttachments = message.attachments;
        var messageStickers = message.sticker_id;

        //if we get a text message
        if (messageText) {
            try {

                // apiaiService.callApiai(messageText, sendTextMessage, senderID);


                console.log("//send user message to apiai");  //send user message to apiai
                var apiaiReply = apiaiService.apiaiTextRequest(messageText, senderID, timeOfMessage);

                apiaiReply
                    .then(function (response) {

                        // console.log("apiaiTextRequest");
                        // console.log("Full api result : \n" + JSON.stringify(response, null, 2));

                        var reply = response.result.fulfillment.speech;
                        var action = response.result.action;
                        var actionIncomplete = response.result.actionIncomplete;
                        var responseParameters = response.result.parameters;
                        var finalResult = "";

                        console.log("Full api result : \n" + JSON.stringify(response, null, 2));

                        if (reply) {

                            if (action && actionIncomplete == false) {

                                switch (action) {
                                    case ("body-type.body-type-measurements"):

                                        //send parameters to calcuate body type function and get appropriate result
                                        // console.log(responseParameters.bustsize);
                                        // console.log(responseParameters.waistsize); 
                                        // console.log(responseParameters.hipsize);

                                        var bodyType = bodyTypeService.calculateBodyType(responseParameters.bustsize, responseParameters.waistsize, responseParameters.hipsize);

                                        bodyType
                                            .then((reply) => {


                                                if (reply) {

                                                    console.log("body-type.body-type-measurements");
                                                    console.log("data from body type service =\n" + reply);

                                                    //appMiddlewareService.sendTextMessagefb(senderID, reply);

                                                    //resolve(reply);
                                                    finalResult += reply + "\n";


                                                    var bodyParams = apiaiService.apiaiTextRequest(reply, senderID, timeOfMessage);


                                                    bodyParams.then(function (data) {
                                                        console.log(JSON.stringify(data, null, 2));
                                                        finalResult += data + "\n";
                                                        console.log("finalResult +=" + finalResult);
                                                        facebookService.sendTextMessage(senderID, finalResult);


                                                    }).catch(function (reason) {
                                                        console.log("catch(function (reason) {" + JSON.stringify(reason, null, 2));
                                                    })
                                                }
                                            })
                                            .catch((reason) => {
                                                console.log("body-type.body-type-measurements" + reason);
                                            });







                                        break;



                                    case ("body-type-enquiry"):

                                        console.log('body-type-enquiry');
                                        try {
                                            var messages = response.result.fulfillment.messages;
                                            console.log(messages);
                                            console.log(typeof(messages));

                                            var quickReplyTitle = messages[0].speech,
                                                quickReplyOptions = messages[1].payload.quick_replies;

                                            // messages.foreach(function(message){

                                            //     console.log(JSON.stringify(message, null, 2));
                                            //     if (message.type == 0) {

                                            //         quickReplyTitle = message.speech;

                                            //     }
                                            //     if (message.type == 4) {

                                            //         quickReplyOptions = message.payload.quick_replies;

                                            //     }

                                            // });


                                            console.log(
                                                "quickReplyOptions: " + quickReplyOptions + "\n" +
                                                "quickReplyTitle: " + quickReplyTitle

                                            );


                                            facebookService.sendQuickReply(senderID, quickReplyTitle, quickReplyOptions, "");

                                        } catch (error) {

                                            console.log(JSON.stringify(error, null, 2));

                                        }
                                        break;

                                    default:
                                        console.log("default action switch block");
                                        facebookService.sendTextMessage(senderID, reply);

                                        break;


                                }
                            } else {
                                facebookService.sendTextMessage(senderID, reply);
                            }



                        }
                        else {
                            facebookService.sendTextMessage(senderID, "no entities trained");
                        }

                        //console.log(senderID + "\n" + response);


                        //facebookService.sendTextMessage(senderID, response);

                        // var bodyTypeDescription = apiaiService.apiaiTextRequest(reply, senderID, timeOfMessage);

                        // //get body type description from api.ai
                        // bodyTypeDescription
                        //     .then(function (reply) {

                        //         console.log("//get body type description from api.ai \n" + JSON.stringify(reply, null, 2));
                        //         try {
                        //             console.log("sender ID " + senderID);
                        //             facebookService.sendTextMessage(senderID, reply);


                        //         } catch (message) {
                        //             console.log("message of error" + message);
                        //         }


                        //     })
                        //     .catch(function (reason) {
                        //         console.log(JSON.stringify(reason, null, 2));

                        //        facebookService.sendTextMessage(senderID, JSON.stringify(reason));

                        //     });
                        // // if bodytype is not rejected then send a generic message with types of dresses

                        // if (reply == '#Rejected') {
                        //     console.log("sendGenericMessage(senderID,"+ "#Apple");
                        //     sendGenericMessage(senderID, "#Apple");
                        // }

                    })
                    .catch(function (reason) {

                        facebookService.sendTextMessage(senderID, JSON.stringify(reason));

                    });
                //analyse and do all the operations here to make all other api calls

            } catch (ex) {

                console.log("buildReply Error " + ex);

            }
        } else if (messageAttachments && !messageStickers) {

            console.log("Message Attachment: " + messageAttachments[0].payload.url);



            if (messageAttachments[0].type === "image") {
                try {

                    //current_users[senderID].imgUrl = messageAttachments[0].payload.url;
                    //console.log("current Users " + JSON.stringify(current_users));

                    //call general search
                    clarifaiService.generalModelSearch(messageAttachments[0].payload.url);

                    //call prediction for a updated image
                    (clarifaiService.predict(messageAttachments[0].payload.url)).then(
                        function (reply) {
                            facebookService.sendTextMessage(senderID, reply);
                            var apiaiReply = apiaiService.apiaiTextRequest(reply, senderID, timeOfMessage);

                            apiaiReply
                                .then(function (reply) {

                                    facebookService.sendTextMessage(senderID, reply);

                                })
                                .catch(function (reason) {

                                    facebookService.sendTextMessage(senderID, JSON.stringify(reason));

                                });

                            if (reply != '#Rejected') {
                                facebookService.sendGenericMessage(senderID, reply);
                            }
                        }
                    );

                    clarifaiService.create(messageAttachments[0].payload.url)

                } catch (ex) {
                    console.log("Exception: " + ex.message);
                }
            } else {
                facebookService.sendTextMessage(senderID, "Message with attachment received");
            }
        } else {
            facebookService.sendTextMessage(senderID, "Please upload your image");
        }
    };





    function apiaiTextRequest(params) {

        try {

            // apiaiService.callApiai(messageText, facebookService.sendTextMessage, senderID);


            console.log("//send user message to apiai");  //send user message to apiai
            var apiaiReply = apiaiService.apiaiTextRequest(messageText, senderID, timeOfMessage);

            apiaiReply
                .then(function (reply) {

                    console.log(senderID + "\n" + reply);


                    facebookService.facebookService.sendTextMessage(senderID, reply);

                    // var bodyTypeDescription = apiaiService.apiaiTextRequest(reply, senderID, timeOfMessage);

                    // //get body type description from api.ai
                    // bodyTypeDescription
                    //     .then(function (reply) {

                    //         console.log("//get body type description from api.ai \n" + JSON.stringify(reply, null, 2));
                    //         try {
                    //             console.log("sender ID " + senderID);
                    //             facebookService.sendTextMessage(senderID, reply);


                    //         } catch (message) {
                    //             console.log("message of error" + message);
                    //         }


                    //     })
                    //     .catch(function (reason) {
                    //         console.log(JSON.stringify(reason, null, 2));

                    //        facebookService.sendTextMessage(senderID, JSON.stringify(reason));

                    //     });
                    // // if bodytype is not rejected then send a generic message with types of dresses

                    // if (reply == '#Rejected') {
                    //     console.log("sendGenericMessage(senderID,"+ "#Apple");
                    //     sendGenericMessage(senderID, "#Apple");
                    // }

                })
                .catch(function (reason) {

                    facebookService.sendTextMessage(senderID, JSON.stringify(reason));

                });
            //analyse and do all the operations here to make all other api calls

        } catch (ex) {

            console.log("buildReply Error " + ex);

        }

    }

    var appMiddlewareFunctions = {
        sendTextMessagefb: sendTextMessagefb,
        receivedMessagefb: receivedMessagefb,
        apiaiTextRequest: apiaiTextRequest
    };

    module.exports = {
        appMiddlewareFunctions: appMiddlewareFunctions
    }

})();