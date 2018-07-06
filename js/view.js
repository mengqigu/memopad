(function (OC, window, $, undefined) {
'use strict';

/**
 * Constructor for the view object.
 * View should never remove the DOM element app-navigation and app-content.
 * These DOM elements are used for delegating events since their descendent changes dynamically.
 * NOTE: use function expression so that the function is in local scope
 */
var View = function(model) {
}

/**
 * Return the id of the current active note.
 * Note that we store the note id in data field data-note-id in our front-end elements.
 * Therefore, we implement the method to obtain this id in View class.
 * @return {int} the id of the current active note
 */
View.prototype.getActiveNoteId = function() {
    return parseInt($(".note-title").data("note-id"), 10);
}

View.prototype.renderContent = function(model, noteId) {
    var template = require("../templates/content/content.hbs");

    model.getNote(noteId, false).done(function(noteResponse) {
        $('#editor').html(template(noteResponse));
    }).fail(function() {
        console.log("Failed to load note");
    })
}

View.prototype.renderNavigation = function(model) {
    var template = require("../templates/navigation/navigation.hbs");

    var context2 = {
        notes: model.getNoteList()
    }
    var html = template(context2);

    $("#app-navigation ul").html(html);
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
