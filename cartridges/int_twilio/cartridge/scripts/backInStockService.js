'use strict';
var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');

function callTwilioService(toPhoneNumber, bodyMsg){
    var body = 'To='+toPhoneNumber+'&Body='+bodyMsg+'&From=+13135138314';
    var callTwilioPost = LocalServiceRegistry.createService("twilio.service", {
        createRequest: function(svc, args) {
            if (args) {
                svc.addHeader("Content-Type", "application/x-www-form-urlencoded");
                return args;
            } else {
                return null;
            }
        },
        parseResponse: function(svc, client) {
            return client.text;
        }
    });
    callTwilioPost.call(body);
}
module.exports = {
    callTwilioService: callTwilioService
};