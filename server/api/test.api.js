let api = require('express').Router();
let vocabularyTestController = require('../controllers/test.controller');

api.get('/words-for-test', vocabularyTestController.wordsForTest);
api.post('/test-result', vocabularyTestController.testResult);

module.exports = api;