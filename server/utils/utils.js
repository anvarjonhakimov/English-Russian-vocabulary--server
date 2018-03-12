/**
 * Shuffles array
 *
 * @param array
 * @returns {*}
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        const itemAtIndex = array[randomIndex];

        array[randomIndex] = array[i];
        array[i] = itemAtIndex;
    }

    return array;
}

/**
 * Checks option for not repeating in array
 *
 * @param array
 * @param option
 * @returns {boolean}
 */
function checkArrayForUniqueValue(array, option) {
    if (array.length > 0) {
        for (let value of array) {
            if (value === option) {
                return false;
            }
        }

        return true;
    }
}

/**
 * Returns array with unique options including right answer for test word
 *
 * @param index
 * @param options
 * @param shuffledWords
 * @returns {*}
 */
function setOptions(index, options, shuffledWords) {
    const wordsForTest = shuffledWords.slice(0, 20),
        wordsForOptions = shuffledWords.slice(20, shuffledWords.length),
        rightAnswer = wordsForTest[index].translation;

    let i = 0;

    options.push(rightAnswer);

    while (i < 5) {
        let randomIndex = Math.floor(Math.random() * wordsForOptions.length);
        let randomOption = wordsForOptions[randomIndex].translation;
        let isUniqueOption = this.checkArrayForUniqueValue(options, randomOption);

        if (isUniqueOption) {
            options.push(randomOption);
            i++;
        }
    }

    options = this.shuffleArray(options);

    return options;
}

module.exports = {
    shuffleArray: shuffleArray,
    checkArrayForUniqueValue: checkArrayForUniqueValue,
    setOptions: setOptions
};