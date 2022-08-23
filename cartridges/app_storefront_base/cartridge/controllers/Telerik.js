'use strict';
//
/**
 * @namespace Home
 */

var server = require('server');
var cache = require('*/cartridge/scripts/middleware/cache');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
var pageMetaData = require('*/cartridge/scripts/middleware/pageMetaData');

/**
 * Any customization on this endpoint2, also requires update for Default-Start endpoint
 */
/**
 * Home-Show : This endpoint is called when a shopper navigates to the home page
 * @name Base/Home-Show
 * @function
 * @memberof Home
 * @param {middleware} - consentTracking.consent
 * @param {middleware} - cache.applyDefaultCache
 * @param {category} - non-sensitive
 * @param {renders} - isml
 * @param {serverfunction} - get
 */
server.get('Show', consentTracking.consent, cache.applyDefaultCache, function (req, res, next) {
    res.render('telerik/home', {welcomeMSG :'saobshtenie'});
    
    next();
}, pageMetaData.computedPageMetaData);


// include template pass paramter
server.get('Include', server.middleware.include, function (req, res, next) {
    res.render('telerik/include',  {welcomeMSG :'saobshtenie'});
    next();
}, pageMetaData.computedPageMetaData);


// list products on search results page with parameters query, format
server.get('List', function (req, res, next) {
    //get the product search model
    var ProductSearchModel = require('dw/catalog/ProductSearchModel');
    //results are instance of ProductSearchModel
    var results = new ProductSearchModel();
    //get query param from url
    var query =  req.httpParameterMap.get("query");
    //set search phrase and search 
    results.setSearchPhrase(query);
    results.search();
    //render
    res.render('telerik/searchResults',  {
        searchResults : results,
        query:query,
        format: req.httpParameterMap.format  });
    
    next();
}, pageMetaData.computedPageMetaData);
// show content asset in template
server.get('ShowContent', function (req, res, next) {
    //get contentmgr
    var ContentMgr = require('dw/content/ContentMgr');
    //get content id from url
    var cid = req.httpParameterMap.cid;
    // pass cid to content mrg to retrieve the content
    var content =  ContentMgr.getContent(cid);
    //render 
    res.render('telerik/contentAsset',  {
        content : content,
        cid : cid
  });
    
    next();
}, pageMetaData.computedPageMetaData);

//export(register) all end-points to server
module.exports = server.exports();
