let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let vocabularySchema = new Schema({
    englishWord: {
        type: String,
        required: true
    },
    translation: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Vocabulary', vocabularySchema);