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
    this.model = model;
    this.view = view;
};

/**
 * Add user interaction handlers for widgets in the app.
 * Use #app-navigation and #app-content as parents for event delegation.
 * @return {void}
 */
Controller.prototype.registerNavigationControl = function() {
    var self = this;

    // Implement autosave:
    // - When user stops typing for 750 milliseconds
    // - When user closes/refreshes the page or leaves the current app (to vist another app/url)
    // - When user leaves the current note and opens another note
    // NOTE: this handler must be called while the note to be saved is still active/displayed!
    var savingHandler = function() {
        var newContent = $('#editor .cell-content').val();
        var newTitle = $("#editor .cell-title").val();
        var newFolder = "default";

        var id = self.view.getActiveNoteId();

        // Compare what exactly is changed in this edit
        var isAnythingChanged = false;
        var isTitleChanged = false;

        self.model.getNote(id, false).then(function(response) {
            if (response.title !== newTitle) {
                isTitleChanged = true;
                isAnythingChanged = true;
            } else {
                isAnythingChanged =
                    (response.content !== newContent) || (response.folder !== newFolder);
            }

            // Return a synchronous value to chain the next promise handler
            return response;
        }).then(function(response) {
            if (!isAnythingChanged) {
                return response;
            } else {
                return self.model.updateNote(id, newTitle, newContent, newFolder);
            }
        }).then(function(updateResponse) {
            if (isTitleChanged) {
                self.view.renderNavigation(self.model);
            }

            // TODO: this is probably not necessary
            // self.view.renderContent(self.model, id);
        }).fail(function() {
            console.log("Saving failed");
        })
    };

    var autosaveTimerId;
    $("#app-content").on("keypress", ".autosave-textarea", function(event) {
        if (autosaveTimerId !== undefined) {
            clearTimeout(autosaveTimerId);
        }
        autosaveTimerId = setTimeout(function(){
            savingHandler();
        }, 750);
    });

    // Before refreshing, closing window, or switching to another app
    window.onbeforeunload = function(){
       savingHandler();
    }

    // Switching between notes
    $("#app-navigation").on("click", ".note-nav-link", function(event) {
        event.preventDefault();
        savingHandler();
        var newNoteId = $(this).parent().data("note-id");
        self.view.renderContent(self.model, parseInt(newNoteId, 10));
    });

    // Delegate the delete notebook preventDefault
    $("#app-navigation").on("click", ".icon-delete", function(event) {
        var id = parseInt($(this).data("note-id"), 10);
        self.model.deleteNote(id).then(function(response) {
            self.view.renderNavigation(self.model);

            // TODO: when a note is delete, display first note if the deleted note's in editor view.
            // Else, maintain the editor view
            self.view.renderContent(self.model, self.model.getFirstId());
        }).fail(function(){
            console.log("Deleting a note fails");
        })
    });

    // Delegate the new notebook creation event
    $("#app-navigation").on("click", ".note-nav-new", function(event) {
        self.model.createNote("New Note", "", "default").then(function(response) {
            console.log(response);
            var id = response.id;
            self.view.renderContent(self.model, id);
            self.view.renderNavigation(self.model);
        }).fail(function() {
            console.log("Creating new note failed");
        });
    });
}

var model = new Model();
var view = new View();
var controller = new Controller(model, view);

model.loadAllNotes().then(function() {
    view.renderNavigation(model);
    view.renderContent(model, 2);

    controller.registerNavigationControl();
}).fail(function() {
    console.log(error);
});

// var idUnderTest = 11;
// model.loadAllNotes().then(function() {
//     console.log("Creating a new Note...");
//     return model.createNote("created", "for", "this test");
// }).then(function(response) {
//     console.log("Getting newly created note...");
//     console.log(response);
//     return model.getNote(idUnderTest);
// }).then(function(getNoteResponse) {
//     console.log("Updating note 1...");
//     return model.updateNote(idUnderTest, "updated", "upda", "uptd");
// }).then(function(updateNoteResponse) {
//     console.log("Updated note!");
//     console.log(updateNoteResponse);
//     return model.deleteNote(idUnderTest);
// }).then(function(deleteNoteResponse) {
//     console.log("DELETE succeeded!");
//     console.log(deleteNoteResponse);
//     return model.loadAllNotes();
// }).then(function() {
//     console.log(model.idToNote);
// }).fail(function() {
//     console.log("Error");
// })

// view.render(model);
// view.renderDebug(model);

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

})(OC, window, jQuery);
