(() => {

    var facebookService = require('./facebookService');

    function sendTextMessagefb(senderId, messageText) {
        facebookService.fbServiceFunctions.sendTextMessage(senderId, messageText);
    };







    var appMiddlewareFunctions = {
        sendTextMessagefb: sendTextMessagefb
    };

    module.exports = {
        appMiddlewareFunctions: appMiddlewareFunctions
    }

})();