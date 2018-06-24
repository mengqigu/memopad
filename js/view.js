(function (OC, window, $, undefined) {
'use strict';

console.log("View is entry point!");
var template = require("../templates/content/content.hbs");
var context2 = {
  people: [
    "Yehuda Katz",
    "Alan Johnson",
    "Charles Jolley"
  ]
}

$('#editor').html(template(context2));


})(OC, window, jQuery);
