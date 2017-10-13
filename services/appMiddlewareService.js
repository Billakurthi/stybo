(() => {

    var facebookService = require('./facebookService').fbServiceFunctions;
    var apiaiService = require('./apiaiService').apiaiServiceFunctions;

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
        //console.log(JSON.stringify(message));

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
                    .then(function (reply) {

                        console.log(senderID + "\n" + reply);


                        facebookService.sendTextMessage(senderID, reply);

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