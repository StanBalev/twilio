'use strict';
var Template = require('dw/util/Template');
var HashMap = require('dw/util/HashMap');
var PageRenderHelper = require('*/cartridge/experience/utilities/PageRenderHelper.js');
/**
 * Render logic for the page.
 */
module.exports.render = function (context) {
   var model = new HashMap();
   var page = context.page;
   model.page = page;
   model.content = context.content;

   // automatically register configured regions
   //model.regions = PageRenderHelper.getRegionModelRegistry(page);

   model.CurrentPageMetaData = PageRenderHelper.getPageMetaData(page);
   // add parameters to model as required for rendering based on the given context (dw.experience.PageScriptContext):
   // * context.page (dw.experience.Page)
   // * context.renderParameters (String)
   // * context.content (dw.util.Map)
 return new Template('experience/pages/myCustomPage').render(model).text;
};
