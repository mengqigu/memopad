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
    console.log(model.idToNote);


    // model.getNote(1).done(function(response){
    //     console.log("getNote: ");
    //     console.log(response);
    // }).fail(function(){
    //     console.log("getNote failed");
    // });

    model.createNote("dfefef  t", "df pin efeefepin", "dfd").done(function(response) {
        console.log(response);
        console.log(model.idToNote);
    });

}).fail(function() {
    console.log(error);
});

// model.loadAllNotes().then(function() {
//     console.log("Getting note 1...");
//     return model.getNote(1, false);
// }).then(function(getNoteResponse) {
//     console.log("Updating note 1...");
//     return model.updateNote(1, "updated", "upda", "uptd");
// }).then(function(updateNoteResponse) {
//     console.log("Updated note!");
//     console.log(updateNoteResponse);
// }).fail(function() {
//     console.log("Error");
// })


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
