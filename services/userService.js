'use strict';
(function () {

    var request = require('request');
    var facebookConfig = require('./auth').facebookConfig;
    //var config = require('./auth');

    module.exports = function (callback, userId) {
        request({
            uri: 'https://graph.facebook.com/v2.7/' + userId,
            qs: {
                access_token: facebookConfig.FACEBOOK_PAGE_ACCESS_TOKEN
            }

        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {

                var user = JSON.parse(body);

                console.log("Get Started \n" + JSON.stringify(user, null, 2));

                if (user.first_name) {
                    console.log("FB user: %s %s, %s",
                        user.first_name, user.last_name, user.gender);
                    callback(user);

                } else {
                    console.log("Cannot get data for fb user with id",
                        userId);
                }
            } else {
                console.error(response.error);
            }

        });
    }
}());