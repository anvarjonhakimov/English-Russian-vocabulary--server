let User = require('../models/user');
let Vocabulary = require('../models/vocabulary');
let utils = require('../utils/utils');

/**
 * Shuffled words for test with options
 *
 * @param req
 * @param res
 */
function wordsForTest(req, res) {
    Vocabulary.find({}, function (err, allWords) {
        if (err) {
            res.status(500).json({
                status: 'An error occurred in getting words.',
                data: err
            });
        } else {
            const shuffledWords = utils.shuffleArray(allWords),
                wordsForTest = shuffledWords.slice(0, 20);

            let testData = [],
                options = [];

            for (let i = 0; i < wordsForTest.length; i++) {
                const data = {
                    englishWord: wordsForTest[i].englishWord,
                    options: utils.setOptions(i, options, shuffledWords),
                    rightAnswer: wordsForTest[i].translation
                };

                testData.push(data);
                options = [];
            }

            res.status(200).json({
                status: 'OK',
                data: testData
            });
        }
    });
}

/**
 * Update current user test score
 *
 * @param req
 * @param res
 */
function testResult(req, res) {
    const decodedUser = req.decoded.user,
        testScore = req.body.testScore,
        query = {
            _id: decodedUser._id
        },
        update = {
            $set: {
                testScore: testScore
            }
        },
        options = {
            new: true
        };

    User.findOneAndUpdate(query, update, options, function (err, updatedUser) {
        if (err) {
            res.status(500).json({
                status: 'An error occurred in updating test score.',
                data: err
            });
        } else if (updatedUser) {
            res.status(200).json({
                status: 'OK'
            });
        } else {
            res.status(404).json({
                status: 'User with the given ID: ' + decodedUser._id + ' does not exist.'
            });
        }
    });
}

module.exports = {
    wordsForTest: wordsForTest,
    testResult: testResult
};