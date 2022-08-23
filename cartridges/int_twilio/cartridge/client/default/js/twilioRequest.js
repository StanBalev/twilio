'use strict';

var processInclude = require('./util');

$(document).ready(function () {
    processInclude(require('./twilioRequest/twilioFormValidation'));
});