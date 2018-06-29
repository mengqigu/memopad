(function (OC, window, $, undefined) {
'use strict';

/**
 * Constructor for class Model, which represents the data model.
 * A Model object can read and modify the actual data stored in the backend.
 * In JS environment, all note data are stored in memory. Each note data is an object. E.g.,:
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
    // /**
    //  * A list of Note objects.
    //  * @type {Array}
    //  */
    // this.notes = [];

    /**
     * Map a note's id to the Note object.
     * @type {Map}
     */
    this.idToNote = new Map();

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
        // Response is a list of Note objects.
        // self.notes = response;

        response.forEach(function(note) {
            self.idToNote.set(note.id, note);
        });

        def.resolve();
    }).fail(function() {
        def.reject();
    });

    return def.promise();
}

/**
 * Obtain the data for Note object with id from data stored in the backend or the JS environment.
 * NOTE: no network requests to the backend.
 * Even a async network request may not be needed, the retrun value is wrapped in a jQuery Promise
 * to maintain consistency of the interface of the class's methods.
 * @param  {int} id id of the Note
 * @param  {boolean} doesQueryBackend if set to true, query the note from backend
 * @return {promise} returns a jQuery Promise returning the Note object data.
 */
Model.prototype.getNote = function(id, doesQueryBackend = false) {
    var def = $.Deferred();

    if (doesQueryBackend) {
        var self = this;
        $.ajax({
               url: this.baseUrl + '/' + id,
               method: 'GET',
        }).done(function(response) {
            // The response is a single Note object
            var note = response;
            self.idToNote.set(note.id, note);
            def.resolve(response);
        }).fail(function() {
            def.reject();
        });
    } else {
        if (this.idToNote.has(id)) {
            var result = this.idToNote.get(id);
            def.resolve(result);
        } else {
            def.reject();
        }
    }

    return def.promise();
}

/**
 * Create a note, store the note in the backend using the backend endpoint.
 * If the creation is successful, also store the newly created Note object in JS environment.
 * @param  {string} title   title of the notebook
 * @param  {string} content notebook content
 * @param  {string} folder  folder of the notebook
 * @return {promise} returns a jQuery Promise
 */
Model.prototype.createNote = function(title, content, folder) {
    var body = {
        "title": title,
        "content": content,
        "folder": folder
    }

    var def = $.Deferred();
    var self = this;
    $.ajax({
           url: this.baseUrl,
           method: 'POST',
           contentType: 'application/json',
           data: JSON.stringify(body)
    }).done(function(response) {
        // The response is a single Note object
        var note = response;
        self.idToNote.set(note.id, note);
        def.resolve(response);
    }).fail(function() {
        def.reject();
    });

    return def.promise();
}

/**
 * Update a note. Update the backend info first through API endpoint.
 * If successful, update the id to Note map in the JS environment.
 * @param  {int} id      id of the note to update
 * @param  {string} title   new title
 * @param  {string} content new content
 * @param  {string} folder  new folder name
 * @return {Promise} returns a promise that will be resolved/rejected if update succeeded/failed
 */
Model.prototype.updateNote = function(id, title, content, folder) {
    var body = {
        "title": title,
        "content": content,
        "folder": folder
    }

    var def = $.Deferred();
    var self = this;

    $.ajax({
           url: this.baseUrl + "/" + id,
           method: 'PUT',
           contentType: 'application/json',
           data: JSON.stringify(body)
    }).done(function(response) {
        // The response is a single Note object
        var note = response;
        self.idToNote.set(note.id, note);
        def.resolve(response);
    }).fail(function() {
        console.log("Error in Model updateNote()");
        def.reject();
    });

    return def.promise();
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
