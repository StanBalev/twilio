'use strict';

/**
 * Display the returned message.
 * @param {string} data - data returned from the server's ajax call
 * @param {Object} button - button that was clicked for contact us sign-up
 */
var r = new RegExp('^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$');
function matchExact(r, str) {

    var match = str.match(r);
    return match && str === match[0];
}
function displayMessage(data, button) {
    $.spinner().stop();
    var status;
    if (data.success) {
        status = 'alert-success';
    } else {
        status = 'alert-danger';
    }

    if ($('.backInStock').length === 0) {
        $('body').append(
            '<div id="form-phone-error"></div>'
        );
    }
    $('.backInStock')
        .append('<div id="form-phone-error ' + '" role="alert">' + data.phone + '<p class="text-center alert-danger">You entered invalid phone number</p></div>');

    setTimeout(function () {
        $('div#form-phone-error').remove();
        button.removeAttr('disabled');
    }, 7000);
}

module.exports = {
    phoneValidate: function () {
        $('form.backInStock').submit(function (e) {
            var canSubmit = false;
            e.preventDefault();
            var form = $(this);
            var button = $('.backInStockBtn');
            var url = form.attr('action');
            var formData = form.serialize();
            var jsonFromData = JSON.parse('{"' + decodeURI(formData).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');

            if (matchExact(r, jsonFromData.phone)) {
                if ($(this).valid()) {
                    canSubmit = true;
                }
                else {
                    canSubmit = false;
                }
            }
            
            $.spinner().start();
            button.attr('disabled', true);

            if (canSubmit) {
                $.ajax({
                    url: url,
                    type: 'post',
                    data: jsonFromData,

                    success: function (response) {
                        //if request if made successfully then the response represent the data
                        if (response) {
                            $('.backInStock').trigger('reset');
                            $('form.backInStock').submit();
                        }
                    },

                });
            }
        });
    }
};


