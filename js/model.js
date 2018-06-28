(function (OC, window, $, undefined) {
'use strict';

/**
 * Constructor for class Model, which represents the data model.
 * A Model object can read and modify the actual data stored in the backend.
 * In JS environment, all note data are stored in memory. Each data is an object with structure:
 * {
 *      id: 1,
 *      title: "Note Title",
 *      content: "Note content",
 *      folder: "Folder of the note
 * }
 *
 * All methods in this class's interface are async. Therefore they all return a jQuery deferred.
 * @constructor
 */
function Model() {
    /**
     * A list of Note objects.
     * @type {Array}
     */
    this.notes = [];

    /**
     * The base url for the app: http://localhost/nextcloud/index.php/apps/memopad/notes.
     * @type {String}
     */
    this.baseUrl = OC.generateUrl("/apps/memopad/notes");
}

/**
 * Load all the notes in the backend to the JS environment.
 * Endpoint used: GET /notes
 * @return {Promise} returns a jQuery Promise that will be resolved/rejected when success/failure
 */
Model.prototype.loadAllNotes = function() {
    var def = $.Deferred();
    var self = this;

    $.ajax({
        type: 'GET',
        url: this.baseUrl,
    }).done(function(response) {
        self.notes = response;
        def.resolve();
    }).fail(function() {
        def.reject();
    });

    return def.promise();
}


Model.prototype.getNotes = function(noteId) {

}

Model.prototype.getContent = function() {
    var context2 = {
        people: [
            "Yehuda Katz",
            "dd Don't",
            "Charles Jolley"
        ]
    };

    return context2;
}

module.exports = Model;

})(OC, window, jQuery);
