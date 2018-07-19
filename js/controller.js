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
 * Implement the controller logic for the WYSIWYG editor.
 * @return {void}
 */
Controller.prototype.registerEditorControl = function() {
    var self = this;

    // The one and only active cell in the current active notebook. Is of type jQuery element.
    // NOTE: we need to maintain the invariant that every notebook/ new notebook has >= 1 cell.
    // TODO: make sure that we can never remove the only cell left <-> we always have >=1 cell
    var activeCell = $($(".cell")[0]);
    activeCell.addClass("cell-active");

    // TODO: also set the cell-active class? Or is this class only for debugg?

    // Handle generated cell divs when new cell is created or cell is removed (via backspace).
    // When backsapce up to the previous cell, we need to
    // - Handle the new merged cell
    // - Remove the generated <span> and its style
    // NOTE: MutationObserver only takes DOM element. Convert jQuery element <-> DOM element:
    // jelem = $(htmlElem); htmlElem = jelem[0];
    var mutationObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutationRecord) {
            console.log(mutationRecord);
            // TODO: observe childlist mutation for #not-content-editor's subtrees
            // I.E., when we remove <b> or <i> tags, we will have adjacent text nodes
            // However, to many events were fired for one such operation. We need to find a better way
            if ((mutationRecord.type === "childList")
                && (mutationRecord.target === $("#note-content-editor")[0])) {

                // TODO: handle case when we have >1 nodes in the list
                if (mutationRecord.addedNodes.length === 0) {
                    // A cell is deleted via back space and content is merged with previous cell
                    var newCell = $(mutationRecord.previousSibling);
                } else {
                    // A new cell is added via pressing enter
                    var addedDomNode = mutationRecord.addedNodes[0];
                    var newCell = $(addedDomNode);
                }

                // HTML cleaning algorithm for backspace removing cell. Leave it here so that is
                // also executed for new cells, unless we observe bugs during new cell creation.

                // Step 1: remove all regular span tags (not .cell-hilite) spans in the new cell
                // TODO: BUG! when a cell with only hilite span was backspace delted, the new span
                // in the previous cell doesn't have .cell-hilite anymore. This code removes hilite
                // when a cell is completely hilited and backspace deleted into the previous cell
                newCell.find("span").not(".cell-hilite").contents().unwrap();

                // Step 1.1: unwrap empty spans, with or without .cell.hilite, to clear hilite
                // TODO: this fails when the new span contains only <br> and won't clear hilite
                newCell.find("span").filter(function() {
                    return $(this).text() === "";
                }).contents().unwrap();

                // Step 1.2: uwrap spans with style attribute background-color: white
                newCell.find("span").filter(function() {
                    // Filter to select all spans that have background color set to white
                    return $(this).css("backgroundColor") === "white";
                }).contents().unwrap();

                // Step 2: normalize text that are unwrapped from the span children
                // https://developer.mozilla.org/en-US/docs/Web/API/Node/normalize
                newCell[0].normalize();

                // Step 3: remove style attr, except bkg-color, for the new cell and descendents
                // Invariant: all cell-hilite and only the cell-hilite span has style attribute
                // NOTE: we remove all style attr first and add the bkg-color back for cell-hilite
                // NOTE: cell-hilite spans with white background color already unwrapped in step 1.2
                // TODO: Need to preserve the hilite span's cell
                // NOTE: test this by back space deleting a bold cell
                newCell.removeAttr("style");
                newCell.find('*').removeAttr('style');
                newCell.find(".cell-hilite").css("backgroundColor", "red");

                // Debugging new cell update
                activeCell.removeClass("cell-active");

                // TODO: handle new cell creation, reset style to default when creating a new
                // cell from a cell with header styles (i.e., .cell-header)
                if (activeCell.hasClass("cell-header1")) {
                    newCell.removeClass("cell-header1");
                }

                if (activeCell.hasClass("cell-header2")) {
                    newCell.removeClass("cell-header2");
                }

                activeCell = newCell;
            }
        });

        activeCell.addClass("cell-active");
    });

    // We observe only children for #note-content-editor for now
    // TODO: Disable this when debugging cellHiliteObserver
    mutationObserver.observe($("#note-content-editor")[0], {
        attributes: false,
        characterData: false,
        childList: true,
        subtree: false,
        attributeOldValue: false,
        characterDataOldValue: false
    });

    // Update the active cell to whichever cell the user clicks on
    // TODO: this only works when clicking inside the editor div.
    // However, clicking in the left/right margin can also change the caret position.
    // We need to either handle this and update the active cell, or disable clicking outside (like Paper)
    $("#app-content").on("click", ".cell", function(event) {
        // For debuggin active cell update
        activeCell.removeClass("cell-active");
        activeCell = $(this);
        activeCell.addClass("cell-active");
        console.log(activeCell.html());
    });

    // Handles the toolbar buttons
    $("#app-content").on("click", "#note-toolbar-h1", function(event) {
        // For debuggin active cell update
        event.preventDefault();
        var headerClass = "cell-header1";

        // Toggle header class
        if (activeCell.hasClass(headerClass)) {
            activeCell.removeClass(headerClass);
        } else {
            activeCell.addClass(headerClass);
        }

        // Make sure the cell doesn't have any other header classes
        if (activeCell.hasClass("cell-header2")) {
            activeCell.removeClass("cell-header2");
        }
    });

    $("#app-content").on("click", "#note-toolbar-h2", function(event) {
        // For debuggin active cell update
        event.preventDefault();
        var headerClass = "cell-header2";

        // Toggle header class
        if (activeCell.hasClass(headerClass)) {
            activeCell.removeClass(headerClass);
        } else {
            activeCell.addClass(headerClass);
        }

        // Make sure the cell doesn't have any other header classes
        if (activeCell.hasClass("cell-header1")) {
            activeCell.removeClass("cell-header1");
        }
    });

    // Highlight the selected text in the current active cell. Algorithm:
    // - Observe the mutations for the active cell. Mark newly added span with class .span-hilite
    // - When new cell/backspace delte cell, do NOT purge non-empty span with class .span-hilite
    // - When backspace delete cell, remove all style for .span-hilite other than background-color
    // TODO: now, if we new line after a hilite, the hilite is canceled. We need to decide if we
    // want to keep the hilite when we are typing right after the hilite span in the same cell
    $("#app-content").on("click", "#note-toolbar-hilite", function(event) {
        event.preventDefault();

        // TODO: does this work? If this function is invoked twice before first returned, will
        // hiliteCell be overwritten?

        // Listen for new children span created in the new cell. Add cell-hilite claass for them
        var cellHiliteObserver = new MutationObserver(function() {
            // Use IIFE to return the callback function in order to seal current value of activeCell
            // NOTE: current means when the button is clicked and the MutationObserver is created.
            var hiliteCell = activeCell;

            // Turns out MutationObserver passes itself to the callback
            // https://stackoverflow.com/questions/41323897/disconnect-mutation-observer-from-callback-function
            return function(mutations, thisObserver) {
                // In this callback, hiliteCell will always have the initial value of activeCell
                // NOTE: this callback is async. Initial means when the MutationObserver is created.
                mutations.forEach(function(mutationRecord) {
                    // It seems that when a hilite is added, a span is created, then removed, then
                    // another span is created. We probably don't need to distinguish between these
                    // 2 spans when adding our highlight class to the span.
                    if (mutationRecord.addedNodes.length === 1) {
                        var addedNode = $(mutationRecord.addedNodes[0]);
                        if (addedNode.is("span")) {
                            addedNode.addClass("cell-hilite");
                        }
                    }
                });

                // For each hilite command on each cell, we just need to set the span class once.
                thisObserver.disconnect();
            }
        }());

        // When we are highting, we are always highliting the active cell
        cellHiliteObserver.observe(activeCell[0], {
            attributes: false,
            characterData: false,
            childList: true,
            subtree: false,
            attributeOldValue: false,
            characterDataOldValue: false
        });

        // TODO: this doesn't clear the hilite color when set twice
        document.execCommand("hiliteColor", false, "red");
    });
}

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
        // TODO: close the mutation observer
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
    controller.registerEditorControl();
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
