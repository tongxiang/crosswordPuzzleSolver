##WORDSEARCHER.JS - a crossword puzzle solver
###Tong Xiang

####RUNNING WORDSEARCHER.JS

I've written this crossword puzzle solver (wordSearcher.js) as a Node.js program which takes three command line arguments: 1) the relative path name of the CSV puzzle file you wish to solve, 2) the relative path of the TXT file of the words you wish to search for, and 3) the name of the file you wish to write your solutions to. (If the filename doesn't already exist in the current directory, the wordSearcher will create the file, if the file does exist, it will overwrite the file.)

If the puzzle file and the word list file are in the same directory as wordSearcher.js, there's no need to specify the relative path--just provide the filenames as arguments. 

To run wordSearcher, first [install Node.js.](http://howtonode.org/how-to-install-nodejs) Then, navigate into the directory wordSearcher.js is in, and in the command line run `node wordSearcher.js puzzleFileName.csv wordList.csv solutionsFile.txt`. (The three argument names are examples, you can provide your own.) Once wordSearcher.js finishes running, your solutions file should be populated with a frequency list of the words it found, or an error message (if any were thrown.)

####FOR FUTURE CONSIDERATION

From a high level, wordSearcher.js generates eight different arrays representing the eight different ways a word may be found in a crossword puzzle (forwards-across, backwards-across, down, up; as well as the four diagonal directions: up-and-to-the-right, down-and-to-the-left, up-and-to-the-left, and down-and-to-the-right.) 

After converting each of these arrays into a string, wordSearcher.js uses regular expressions to search each for matching words on the word list. Finally, it writes the incidence of matches onto a new file. 

**RUNTIME**
There are many different ways to solve this problem, each with different dimensionality of runtimes. But in particular, regular expressions can have runtimes which can be exponential, depending on their implementation in a particular language (for more, see [this source](http://stackoverflow.com/questions/8887724/why-can-regular-expressions-have-an-exponential-running-time) and [another.](http://swtch.com/~rsc/regexp/regexp1.html)). Considering that this program is intended to be run once, I assumed that the runtime of wordSearcher isn't too important and instead prioritized the understandability and readability of the code. To optimize this code in the future, I'd first want to do more research on the runtime of Javascript regular expressions. 

**EDGE CASES**
Because of the string reversal technique I'm using on line 33, wordSearcher.js may fail when searching for special characters (such as letters with umlauts, etc.). In the future, I'd want to account for these edge cases. (More information [here](http://bit.ly/1o4T50M)).

**MEMORY** 
To speed up the program, we could also consider building in some form of memory into our program which can exclude non-productive searches. For instance, if we know from one directional search that the puzzle array doesn't even contain all the requisite letters necessary to spell "NORTHCAROLINA", we can strike that keyword from our search list and not look for it in the future.
