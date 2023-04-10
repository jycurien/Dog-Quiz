/*
 * Randomize array element order in-place. Using Durstenfeld shuffle algorithm.
 * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
 * @returns {array}
 */
const shuffleArray = (array) => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}

export default shuffleArray
