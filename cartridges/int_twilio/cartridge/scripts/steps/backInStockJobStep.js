var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var ProductMgr = require('dw/catalog/ProductMgr');
var Transaction = require('dw/system/Transaction');
var availabilityModel = require('dw/catalog/ProductAvailabilityModel');
var backInStockService = require('int_twilio/cartridge/scripts/backInStockService.js');

module.exports.execute = function () {
    //get all custom objects - notifyWhenInStock
    var backInStockIterator = CustomObjectMgr.getAllCustomObjects('notifyWhenInStock');

    while (backInStockIterator.hasNext()) {
        try {
            var backInStockNotification = backInStockIterator.next();
            var splitPids = backInStockNotification.custom.pids.split(',');
            var availableProducts = [];
            //loop trought all pids assigned to this phone number and check availability
            for (let index = 0; index < splitPids.length; index++) {
                //get the product by id
                var product = ProductMgr.getProduct(splitPids[index]);
                if (product != null && product.available) {
                    availableProducts.push(product);
                }
            }
            
            // yes, this product is back in stock!
            if (availableProducts.length) {
                //build the body msg
                var bodyMsg = 'Hi your products are back in stock: ';
                for (let i = 0; i < availableProducts.length; i++) {
                    bodyMsg += availableProducts[i].name + ',';
                }
                // call the twilio service pass phone and msg with product names
                var result = backInStockService.callTwilioService(backInStockNotification.custom.phone, bodyMsg);
                
                if (result) {
                Transaction.wrap(function () {
                    //remove the custom object after service is executed
                    CustomObjectMgr.remove(backInStockNotification);
                });
                bodyMsg = '';
            }
            }

        }
        catch (e) {
            Logger.error(e);
        }
    }
}