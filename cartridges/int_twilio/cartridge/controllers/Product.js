// extended Product.js

'use strict';

function matchExact(str) {
    var r = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
    var match = str.match(r);
    return match && str === match[0];
}

var server = require('server');
var Transaction = require('dw/system/Transaction');
var page = module.superModule;
server.extend(page);


var CustomObjectMgr = require('dw/object/CustomObjectMgr');

server.append('Show', function (req, res, next) {
    //get and clear the form
    var backInStockForm = server.forms.getForm('backInStockForm');
    backInStockForm.clear();
    var ProductMgr = require('dw/catalog/ProductMgr');
    var pid = req.httpParameterMap.get("pid");
    var product = ProductMgr.getProduct(pid);
    var isInStock = product.getAvailabilityModel().isInStock();
    var viewData = res.getViewData();
    viewData.product.isInStock = isInStock;
    res.setViewData(viewData);
    
    next();
});

 server.append('Variation', function (req, res, next) {
    var productHelper = require('*/cartridge/scripts/helpers/productHelpers');
    var priceHelper = require('*/cartridge/scripts/helpers/pricing');
    var ProductFactory = require('*/cartridge/scripts/factories/product');
    var renderTemplateHelper = require('*/cartridge/scripts/renderTemplateHelper');
    var ProductMgr = require('dw/catalog/ProductMgr');
    var params = req.querystring;
    var product = ProductFactory.get(params);

    var context = { 
        price: product.price
    };
  
    product.price.html = priceHelper.renderHtml(priceHelper.getHtmlContext(context));

    var url = product.selectedProductUrl;
    var pid = req.httpParameterMap.get('pid');
    var prod = ProductMgr.getProduct(pid);

    product.isInStock = prod.getAvailabilityModel().isInStock();
    product.url = url;

    var attributeContext = { product: { attributes: product.attributes } };
    var attributeTemplate = 'product/components/attributesPre';
    product.attributesHtml = renderTemplateHelper.getRenderedHtml(
        attributeContext,
        attributeTemplate
    );

    var promotionsContext = { product: { promotions: product.promotions } };
    var promotionsTemplate = 'product/components/promotions';

    product.promotionsHtml = renderTemplateHelper.getRenderedHtml(
        promotionsContext,
        promotionsTemplate
    );

    var optionsContext = { product: { options: product.options } };
    var optionsTemplate = 'product/components/options';

    product.optionsHtml = renderTemplateHelper.getRenderedHtml(
        optionsContext,
        optionsTemplate
    );

    res.json({
        product: product,
        resources: productHelper.getResources()
    });
    next();
}); 

server.post('Twilio', function (req, res, next) {
    var msg = '';
    var type = 'notifyWhenInStock';
    var form = req.form;
    var notifyWhenInStock;
    var result = false;
    var error = false;
    var pid = req.httpParameterMap.get("pid");
    if (matchExact(form.phone)) {
        //valid phone check if existing on our side
        var isPhoneExisting = CustomObjectMgr.getCustomObject(type, form.phone);
        //if is not exist we will store it
        if (!isPhoneExisting) {
            try {
                // create new custom object type of notifyWhenInStock and store data on it
                Transaction.wrap(function () {
                    notifyWhenInStock = CustomObjectMgr.createCustomObject(type, form.phone);
                    notifyWhenInStock.custom.phone = form.phone;
                    notifyWhenInStock.custom.pids = form.pid;
                });
                result = true;
            }
            catch (e) {
                error = true;
            }
        }
        else {
            // if the phone exist add more wished products on this number
            Transaction.wrap(function () {
                notifyWhenInStock = CustomObjectMgr.getCustomObject(type, form.phone);
                notifyWhenInStock.custom.pids += (',' + form.pids);
            });
        }
        // render notification
        msg = 'You will be notified when this product is back in stock';
        res.render('subscribed');
    }
    else {
        msg = 'There are an error!';
        res.render('errorSubscribing', { pid: pid });
    }
    next();
});
module.exports = server.exports();