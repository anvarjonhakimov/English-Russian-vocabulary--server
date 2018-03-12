let api = require('express').Router();
let vocabularyController = require('../controllers/vocabulary.controller');

api.get('/words-list', vocabularyController.getAllWords);
api.post('/add', vocabularyController.addWord);
api.put('/edit', vocabularyController.editWord);
api.delete('/delete/:id', vocabularyController.deleteWord);

module.exports = api;