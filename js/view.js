(function (OC, window, $, undefined) {
'use strict';

/**
 * Constructor for the view object.
 * NOTE: use function expression so that the function is in local scope
 */
var View = function(model) {
}

View.prototype.renderContent = function(model) {
    var template = require("../templates/content/content.hbs");
    // var context2 = {
    //     people: [
    //         "Yehuda Katz",
    //         "12345 Johnson",
    //         "Charles Jolley"
    //     ]
    // }

    $('#editor').html(template(model.getContent()));
}

View.prototype.renderNavigation = function(model) {
    var html = "";

    $("app-navigation ul").html(html);
}

View.prototype.render = function(model) {
    this.renderContent(model);
    this.renderNavigation(model);
}

View.prototype.renderDebug = function() {
    var template = require("../templates/content/content-test.hbs");
    $('#editor').html(template());
}

module.exports = View;

// var model = new Model();
// var view = new View(model);
// view.renderContent(model);
})(OC, window, jQuery);
