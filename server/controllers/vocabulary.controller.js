let Vocabulary = require('../models/vocabulary');

/**
 * Gets all words with translations
 *
 * @param req
 * @param res
 */
function getAllWords(req, res) {
    Vocabulary.find({}, function (err, allWords) {
        if (err) {
            res.status(500).json({
                status: 'An error occurred in getting vocabulary.',
                date: err
            });
        } else {
            res.status(200).json({
                status: 'OK',
                data: allWords
            });
        }
    });
}

/**
 * Adds new word to vocabulary list
 *
 * @param req
 * @param res
 */
function addWord(req, res) {
    const data = req.body;

    if (!data || !data.englishWord || !data.translation) {
        res.status(400).send('Bad request.');
        return;
    }

    Vocabulary.create(data, function (err, newWord) {
        if (err) {
            res.status(500).json({
                status: 'An error occurred in adding new word.',
                data: err
            });
        } else {
            res.status(201).json({
                status: 'OK',
                data: newWord
            });
        }
    });
}

/**
 * Edits word
 *
 * @param req
 * @param res
 */
function editWord(req, res) {
    const data = req.body,
        query = {
            _id: data._id
        },
        options = {
            new: true
        };

    if (!data || !data._id || !data.englishWord || !data.translation) {
        res.status(400).send('Bad request.');
        return;
    }

    Vocabulary.findOneAndUpdate(query, data, options, function (err, editedWord) {
        if (err) {
            res.status(500).json({
                status: 'An error occurred in editing word.',
                data: err
            });
        } else {
            res.status(200).json({
                status: 'OK',
                data: editedWord
            });
        }
    });
}

/**
 * Deletes word
 *
 * @param req
 * @param res
 */
function deleteWord(req, res) {
    const wordId = req.params.id;

    if (!wordId) {
        res.status(400).send('Bad request.');
        return;
    }

    Vocabulary.findByIdAndRemove(wordId, function (err) {
        if (err) {
            res.status(500).json({
                status: 'An error occurred in deleting word.',
                data: err
            });
        } else {
            res.status(200).json({
                status: 'OK'
            });
        }
    });
}

module.exports = {
    getAllWords: getAllWords,
    addWord: addWord,
    editWord: editWord,
    deleteWord: deleteWord
};
