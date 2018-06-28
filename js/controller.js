(function (OC, window, $, undefined) {
'use strict';

var Model = require("./model");
var View = require("./view");

/**
 * Constructor for Controller.
 * Controller manipulates the model and renders the view.
 * Controller also attaches callbacks to buttons.
 * @param  {Model} model the data model
 * @param  {view} view  the view
 */
var Controller = function(model, view) {
    this._model = model;
    this._view = view;
};

var model = new Model();
var view = new View();

model.loadAllNotes().done(function(){
    console.log(model.notes);
}).fail(function() {
    console.log(error);
})

// view.render(model);
view.renderDebug(model);

$("#debug").click(function() {
    console.log("clicked2");
    $.ajax({
        type: 'GET',
        url: OC.generateUrl("/apps/memopad/notes"),
    }).done(function(response) {
        console.log(response);
    }).fail(function() {
        console.log("Error");
    });
});

console.log(model.getContent());

})(OC, window, jQuery);
