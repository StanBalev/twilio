var server = require('server');
var cache = require('*/cartridge/scripts/middleware/cache');


server.get('Show', cache.applyDefaultCache, function (req, res, next) {
     
    
    //LocalServiceRegistry.createService creates an instance of MyFTPService
 
    var service = dw.svc.LocalServiceRegistry.createService('twilio.service', {
    // Callback handler to construct request
    createRequest: function(svc, params) {
        svc.setRequestMethod('GET');
        return params;
    },
    
    // Callback handler to parse response
    parseResponse : function(svc, params) {
        var response = JSON.parse(params.text)
        return response.fact;
    },


});
    
var response = service.call().object; 
res.render('telerik/catFacts',{
    fact: response
    }); 

    next();
});

module.exports = server.exports();


