var fs = require('fs');
var puzzleFile = process.argv[2];
var targetWords = process.argv[3];
var outputFileName = process.argv[4];

var searchStringForWords = function(wordList, puzzleString, solutionsObject){ //helper function which checks puzzleString for matches of all the words in wordList by generating regular expressions
  for (var i = 0; i < wordList.length; i ++){
    var wordRegExp = new RegExp(wordList[i], 'g');
    var matchNumber = (puzzleString.match(wordRegExp) || 0).length;
    if (matchNumber){
      if (solutionsObject[wordList[i]]){
        solutionsObject[wordList[i]] += matchNumber;
      } else {
        solutionsObject[wordList[i]] = matchNumber;
      }
    }
  }
};

var splitOnNewLineToArray = function(stringToCheck){ //accounts for inconsistent textual newline protocols (http://en.wikipedia.org/wiki/Newline)
  var returnArray = [];
  if (stringToCheck.search('\r\n') > 0){
    returnArray = stringToCheck.split('\r\n');
  } else {
    returnArray = stringToCheck.split('\n');
  }
  return returnArray;
};

var generateReverseArray = function(arrayToReverse){
  var returnArray = [];
  for (var i = 0; i < arrayToReverse.length; i ++){
    returnArray[i] = arrayToReverse[i].split('').reverse().join(''); //cautions on this string reversal technique here: http://bit.ly/1o4T50M
  }
  return returnArray;
};

var generateDiagonalArray = function(arrayToDiagonalize){
  var numberOfRows = arrayToDiagonalize.length;
  var numberOfColumns = arrayToDiagonalize[0].length;
  var numberOfDiagonalRows = numberOfRows + numberOfColumns - 1;
  var returnArray = [];
  for (var i = 0; i < numberOfDiagonalRows; i ++){
    returnArray.push([]);
  }
  //upper-left half
  for (var k = 0; k < numberOfRows; k ++){
      for (var j = 0, i = k; j <= k; j ++, i--){
          returnArray[k].push(arrayToDiagonalize[i][j]);
      }
  }
  //bottom-right half
  for (var l = numberOfRows; l < numberOfDiagonalRows; l ++){
      for (var m = numberOfRows - 1, n = l - numberOfRows + 1; n < numberOfColumns; m --, n ++){
          returnArray[l].push(arrayToDiagonalize[m][n]);
      }
  }
  for (var i = 0; i < returnArray.length; i ++){
    returnArray[i] = returnArray[i].join('');
  }
  return returnArray;
}

var wordSearcher = function(puzzleFile, wordList, outputFileName){
  var solutions = {};

  var wordListString = fs.readFileSync(targetWords, 'utf8');
  var wordListArray = splitOnNewLineToArray(wordListString);

  var puzzleCharString = fs.readFileSync(puzzleFile, 'utf8').toString().replace(/,/g, "");
  if (!puzzleCharString){ //if puzzle file is empty
    fs.writeFileSync(outputFileName, 'The puzzle you\'re trying to solve has no characters; it\'s empty!');
    return 'The puzzle you\'re trying to solve has no characters; it\'s empty!';
  }
  var puzzleCharRowArray = splitOnNewLineToArray(puzzleCharString);

  var numberOfPuzzleRows = puzzleCharRowArray.length;
  var numberOfPuzzleColumns = puzzleCharRowArray[0].length;
  var numberOfDiagonalRows = numberOfPuzzleRows + numberOfPuzzleColumns - 1;

  // FORWARDS-ACROSS
  searchStringForWords(wordListArray, puzzleCharRowArray.join('&'), solutions);

  // BACKWARDS-ACROSS
  var backwardsAcrossArray = generateReverseArray(puzzleCharRowArray);
  searchStringForWords(wordListArray, backwardsAcrossArray.join('&'), solutions);

  // DOWN - we're generating and searching a symmetric matrix (downArray) of puzzleCharRowArray (http://en.wikipedia.org/wiki/Symmetric_matrix)
  var downArray = [];
  for (var i = 0; i < numberOfPuzzleColumns; i ++){
    downArray.push([]);
  }
  for (var j = 0; j < numberOfPuzzleRows; j ++){
    for (var k = 0; k < puzzleCharRowArray[j].length; k ++){
      downArray[k][j] = puzzleCharRowArray[j][k];
    }
  }
  for (var i = 0; i < downArray.length; i ++){
    downArray[i] = downArray[i].join('');
  }
  searchStringForWords(wordListArray, downArray.join('&'), solutions);

  // UP - we're generating and searching the reversed 'down' array
  searchStringForWords(wordListArray, generateReverseArray(downArray).join('&'), solutions);

  // UP AND RIGHT
  var upAndRightArray = generateDiagonalArray(puzzleCharRowArray);
  searchStringForWords(wordListArray, upAndRightArray.join('&'), solutions);

  // DOWN AND LEFT - the UP AND RIGHT array, reversed and searched
  searchStringForWords(wordListArray, generateReverseArray(upAndRightArray).join('&'), solutions);

  // UP AND LEFT - we'll be searching the array created by the generateDiagonalArray algorithm used on the BACKWARDS-ACROSS puzzle array 
  var upAndLeftArray = generateDiagonalArray(backwardsAcrossArray);
  searchStringForWords(wordListArray, upAndLeftArray.join('&'), solutions);

  // DOWN AND RIGHT - will be the REVERSED 'UP AND LEFT' array 
  searchStringForWords(wordListArray, generateReverseArray(upAndLeftArray).join('&'), solutions);

  // FILE-WRITING
  var solutionString = '';
  if (Object.keys(solutions).length){
    for (key in solutions){
      solutionString += (key + ' (' + solutions[key] + ')' + '\r\n');
    }
  } else {
    solutionString += 'None of the words on your list were present in the puzzle!'
  }

  fs.writeFileSync(outputFileName, solutionString);

};

wordSearcher(puzzleFile, targetWords, outputFileName);
