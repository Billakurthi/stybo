(() => {

	var facebookService = require('./facebookService').fbServiceFunctions;
	var apiaiService = require('./apiaiService').apiaiServiceFunctions;
	const clarifaiService = require('./clarifaiService');
	var uuid = require("uuid");
	var bodyTypeService = require('./bodyTypeService').bodyTypeServiceFunctions;
	let userData = require('./userService');

	var sessionIds = new Map();
	var usersMap = new Map();
	var userCart = {};

	//region setSessionAndUser
	//TODO:  setSessionAndUser should be global
	function setSessionAndUser(senderID) {
		if (!sessionIds.has(senderID)) {
			sessionIds.set(senderID, uuid.v1());
		}

		if (!usersMap.has(senderID)) {
			userData(function (user) {
				usersMap.set(senderID, user);
			}, senderID);

			console.log("User Map Data \n" + JSON.stringify(usersMap, null, 2));
			console.log("SessionID's Data \n" + JSON.stringify(sessionIds, null, 2));

		}
	};
	//endregion setSessionAndUser

	//region postRequestRecievedFromFb
	function postRequestRecievedFromFb(data) {

		// Iterate over each entry - there may be multiple if batched
		data.entry.forEach(function (entry) {
			var pageID = entry.id;
			var timeOfEvent = entry.time;

			// Iterate over each messaging event
			entry.messaging.forEach(function (event) {

				try {

					if (event.message) {

						receivedMessage(event);

						//console.log(event);

					} else if (event.postback) {

						receivedPostback(event);

					} else {

						console.log("Webhook received unknown event: ", event);
					}


				} catch (error) {

					console.log("entry.messaging.forEach(function (event) { \n" + error);

				}

			});
		});
	};
	//endregion postRequestRecievedFromFb

	/*
		* Postback Event
		*
		* This event is called when a postback is tapped on a Structured Message.
		* https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
		*
		*/
	function receivedPostback(event) {

		var senderID = event.sender.id;
		var recipientID = event.recipient.id;
		var timeOfPostback = event.timestamp;

		setSessionAndUser(senderID);

		// The 'payload' param is a developer-defined field which is set in a postback
		// button for Structured Messages.
		var payload = event.postback.payload;
		//check if payload has comma seperated parameters
		//first parameter should be function name
		//remaining parameters should be function parameters
		var hasParams = payload.includes(",");

		if (hasParams) {

			var postbackAndParams = payload.split(",");

			switch (postbackAndParams[0]) {
				case 'ADD_TO_CART_POSTBACK':
					if (!(userCart.hasOwnProperty(senderID))) {
						userCart[senderID] = [];
					};
					userCart[senderID].push(postbackAndParams[1]);

					console.log("added to cart" + JSON.stringify(userCart[senderID], null, 2));

					facebookService.sendTextMessage(senderID, "added " + postbackAndParams[1] + " to cart");
					break;
				default:
					//unindentified payload					
					//facebookService.sendVideo(senderID);
					facebookService.sendTextMessage(senderID, "I'm not sure what you want. Can you be more specific?");
					break;
			}
		} else {

			switch (payload) {
				case 'GET_STARTED':
					greetUserText(senderID);
					break;
				case 'TRENDING_PAYLOAD':
					//get top trending dresses
					facebookService.sendGenericMessage(senderID);
					//sendToApiAi(senderID, "job openings");
					break;
				case 'MY_CART'://send all user cart items



					function getCartItems(senderID) {

						if (!(userCart.hasOwnProperty(senderID)) && (userCart[senderID]) === undefined) {

							facebookService.sendTextMessage(senderID, "No Items available in your cart");

							return;

						} else {

							let cartItems = userCart[senderID];

							cartItems.forEach(function (item) {

								facebookService.sendTextMessage(senderID, item);

							}, this);

							facebookService.sendListMessage(senderID);
						}

					};

					getCartItems(senderID);

					break;
				default:
					//unindentified payload
					console.log("unidentified payload " + this);
					//facebookService.sendVideo(senderID);
					facebookService.sendTextMessage(senderID, "I'm not sure what you want. Can you be more specific?");
					break;

			}
		}
		console.log("payload" + payload);

		console.log("Received postback for user %d and page %d with payload '%s' " +
			"at %d", senderID, recipientID, payload, timeOfPostback);

	};


	function greetUserText(userId) {

		let user = usersMap.get(userId);
		while (user !== undefined) {
			facebookService.sendTextMessage(userId, "Welcome " + user.first_name + '! ' +
				'I can answer frequently asked questions for you ' +
				'and I perform job interviews. What can I help you with?');

			return;
		}


	}



	function sendTextMessage(senderID, messageText) {

		facebookService.sendTextMessage(senderID, messageText);

	};


	//received msg event function
	function receivedMessage(event) {

		//#region user message variables
		var senderID = event.sender.id,
			recipientID = event.recipient.id,
			timeOfMessage = event.timestamp,
			message = event.message;
		//#endregion user message variables

		//#region user message variables
		var messageID = message.mid,
			messageText = message.text,
			messageAttachments = message.attachments,
			messageStickerID = message.sticker_id,
			quickReply = message.quick_reply || null;
		//#endregion user message variables


		setSessionAndUser(senderID);

		console.log("Received message for user %d and page %d at %d with message:",
			senderID, recipientID, timeOfMessage);
		console.log(JSON.stringify(message, null, 2));

		if (quickReply && messageText) {
			console.log("quickRepl \n" + JSON.stringify(quickReply, null, 2));
			handleQuickReply(senderID, quickReply, messageID);
		} else
			if (messageText) {//region if we get a text message
				console.log("Text Message \n" + messageText);
				try {

					// apiaiService.callApiai(messageText, sendTextMessage, senderID);
					console.log("//send user message to apiai");  //send user message to apiai
					var apiaiReply = apiaiService.apiaiTextRequest(messageText, senderID);

					apiaiReply
						.then(function (response) {

							console.log("handleApiAiResponse(senderID, response)");
							handleApiAiResponse(senderID, response);

						})
						.catch(function (reason) {

							facebookService.sendTextMessage(senderID, JSON.stringify(reason));

						});
					//analyse and do all the operations here to make all other api calls

				} catch (ex) {

					console.log("buildReply Error " + ex);

				}
			} else if (messageAttachments && !messageStickerID) {

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
								var apiaiReply = apiaiService.apiaiTextRequest(reply, senderID);

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
			} else if (messageStickerID) {
				//send sticker back to user
				facebookService.sendTextMessage(senderID, messageAttachments[0].payload.url);

			}
			else {
				facebookService.sendTextMessage(senderID, "Please upload your image");
			}
		//endregion if we get a text message
	};



	//region handleQuickReply
	function handleQuickReply(senderID, quickReply, messageId) {

		var quickReplyPayload = quickReply.payload;

		console.log("Quick reply for message %s with payload %s", messageId, quickReplyPayload);

		//send payload to api.ai
		var apiaiReply = apiaiService.apiaiTextRequest(quickReplyPayload, senderID);

		apiaiReply
			.then(function (response) {
				handleApiAiResponse(senderID, response);
				// facebookService.sendTextMessage(senderID, response);

			})
			.catch(function (reason) {
				console.log("handleQuickReply catch reason" + reason);
				facebookService.sendTextMessage(senderID, JSON.stringify(reason));

			});
	};
	//endregion handleQuickReply


	//region handleApiAiAction
	function handleApiAiAction(senderID, action, responseText, contexts, responseParameters, fulfillment) {
		console.log("handleApiAiAction action" + action);
		switch (action) {

			case ("body-type.body-type-measurements"):

				//send parameters to calcuate body type function and get appropriate result
				//let finalResult = "";
				var bodyType = bodyTypeService.calculateBodyType(responseParameters.bustsize, responseParameters.waistsize, responseParameters.hipsize);

				bodyType
					.then((reply) => {


						if (reply) {

							console.log("body-type.body-type-measurements");
							console.log("data from body type service =\n" + reply);

							//appMiddlewareService.sendTextMessagefb(senderID, reply);

							//resolve(reply);

							//send body type from calculator service
							facebookService.sendTextMessage(senderID, reply);
							//finalResult += reply + "\n";

							//send generic message
							facebookService.sendGenericMessage(senderID, reply);

							var bodyParams = apiaiService.apiaiTextRequest(reply, senderID);


							bodyParams.then(function (data) {
								console.log(JSON.stringify(data, null, 2));
								//finalResult += data + "\n";

								handleApiAiResponse(senderID, data);
								// console.log("finalResult +=" + finalResult);
								//facebookService.sendTextMessage(senderID, finalResult);


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

				console.log(' in handleApiAiAction body-type-enquiry');
				try {
					var messages = fulfillment.messages;
					console.log("fulfillment.messages;" + messages);
					console.log(typeof (messages));

					// var quickReplyTitle = messages[0].speech,
					//     quickReplyOptions = messages[1].payload.quick_replies;

					messages.forEach(function (message) {

						console.log(JSON.stringify(message, null, 2));
						if (message.type == 0) {

							quickReplyTitle = message.speech;

						}
						if (message.type == 4) {

							quickReplyOptions = message.payload.quick_replies;

						}

					}, this);


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
				facebookService.sendTextMessage(senderID, responseText);

				break;


		}

	}
	//endregion handleApiAiAction


	function handleApiAiResponse(senderID, response) {


		let action = response.result.action;
		let contexts = response.result.contexts;
		let responseParameters = response.result.parameters;
		let actionIncomplete = response.result.actionIncomplete;

		let fulfillment = response.result.fulfillment;
		let responseText = fulfillment.speech;
		let responseData = fulfillment.data;
		let messages = fulfillment.messages;





		console.log("Full api result : \n" + JSON.stringify(response, null, 2));

		if (responseText) {

			if (action && actionIncomplete == false) {
				console.log("if (action && actionIncomplete == false)");
				try {
					handleApiAiAction(senderID, action, responseText, contexts, responseParameters, fulfillment);
				} catch (error) {
					console.log(error);
				}


			} else {
				facebookService.sendTextMessage(senderID, responseText);
			}



		}
		else {
			facebookService.sendTextMessage(senderID, "no entities trained");
		}


	};


	//check if object is defined or not
	function isDefined(obj) {
		if (typeof obj == 'undefined') {
			return false;
		}

		if (!obj) {
			return false;
		}

		return obj != null;
	}


	var appMiddlewareFunctions = {
		sendTextMessage: sendTextMessage,
		receivedMessage: receivedMessage,
		postRequestRecievedFromFb: postRequestRecievedFromFb
	};

	module.exports = {
		appMiddlewareFunctions: appMiddlewareFunctions
	}

})();