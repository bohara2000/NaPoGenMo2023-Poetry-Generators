// import rita
import rita from 'rita';
 
 
// write an example of using the rita library to find rhymes
// and print them to the console
// let r = rita.rhymes("cat");
// console.log(r);

// analyze a sentence
let rs = rita.analyze("Some soul tell me how to bask in the shade.");

// // print all the data from rs
// console.log(rs);

// console.log(rita.randomWord({ pos: 'to', numSyllables: 1, minLength: 2, maxLength: 2 }));

// //pick random words that match the stress pattern of a sentence
// let r = rita.randomWord({  stresses: '1 0 0 1', numSyllables: 4});
// console.log(r);

// let x = rita.rhymes('glade', { numSyllables: 3, limit: 20 });
// console.log(x);

//and print all the parts of speech
// //console.log(rs.pos);

// take the stress patterns from one sentence and create a new sentence with the same stress patterns
// create a variable to store the stress pattern
// let stressPattern = rs.stresses;
// // create a variable to store the number of syllables
// let numSyllables = rs.syllables.length;
// // create a variable to store the new sentence
// let newSentence = "";
// // create a variable to store the words from the sentence
// let words = rs.tokens;
// // loop through the words
// for (let i = 0; i < words.length; i++) {
//     // get the stress pattern for each word
//     let wordStressPattern = rita.getStresses(words[i]);
//     // if the stress pattern for the word is the same as the stress pattern for the sentence
//     if (wordStressPattern == stressPattern) {
//         // add the word to the new sentence
//         newSentence += words[i] + " ";
//     }
// }
// // print the new sentence
// console.log(newSentence);



// rita.pos("I am hungry", { simple: true });

// create a variable whose text spans multiple lines
let text = `More no hard luck dice roll stones in her hips,
can take it anywhere it's taking,
got wet with ai sampled video clips,
trouble of the solar system making,
ready now beat back the the lagrange points,
couri par en haut vous couri par en haut,
kingdom to go i want to jesus my joints,
saw de dead nowadays just god who brought,
de christian dey call de west o brothers,
go sailing hallelujah tarry,
de iron boron chief among others,
psychokinetic canary carrie,
to de tallest tree fractal i text,
vinter o John saw some smack and the next.
`;

// create a function that takes a string of text and returns an array of parts of speech
function getWordsByPennTagPOS(splittext, pos, syllableCount = 2) {
   // create an empty array to store the words

   let words = splittext.filter(w => rita.pos(w)[0] == pos && rita.syllables(w).split('/').length == syllableCount);

   // if there is less than one words in the array, use the lexicon to find words with the same part of speech
   if (words.length <= 1) {
       for (let index = 0; index < 4; index++) {
           // get the words from the lexicon
           words.push(rita.randomWord({ pos: pos, numSyllables: syllableCount }));
       }
   }

   // return the array
   return words.join(" | ");

}

let lines = text.split("\n");
let splitpoem = [];
for (let i = 0; i < lines.length; i++) {
   let words = lines[i].split(" ");
   for (let j = 0; j < words.length; j++) {
       // remove punctuation from the word
       words[j] = words[j].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
       splitpoem.push(words[j]);
   }
}


// build a grammar object in rita that creates three lines of haiku.
// the first line has 5 syllables, the second line has 7 syllables, and the third line has 5 syllables
// the first line starts with an adjective, then has a noun, then a verb, then a noun
// the second line starts with a noun, then has a verb, then an adverb, then a verb, then a noun
// the third line starts with a noun, then has a verb, then a noun
// use the pipe character to separate the different words
// use the % character to separate the lines
// create grammar as json object
let haikugrammar = {
   start: "$5line1.ucf() % $7line % $5line2",
   '5line1': "$rb, $nn.art() $vb  | $jj $nn | $jj $nn $vb",
   '5line2': "$nn $prp $nn.pluralize() $vbp ($nn.pluralize() | $rb)",
   '7line': "$nn ! $uh ! $vbp $nn.art() !",
}

// add grammar rules to haikugrammar object
haikugrammar['rb'] = "silently | secretly | painfully | happily | violently | together";
haikugrammar['jj'] = "exciting | beautiful | adorable";
haikugrammar['nn'] = getWordsByPennTagPOS(splitpoem, 'nn');
haikugrammar['vb'] = getWordsByPennTagPOS(splitpoem, 'vb');
haikugrammar['nnp'] = getWordsByPennTagPOS(splitpoem, 'nnp');
haikugrammar['vbp'] = getWordsByPennTagPOS(splitpoem, 'vbp');
haikugrammar['prp'] = getWordsByPennTagPOS(splitpoem, 'prp');
haikugrammar['uh'] = getWordsByPennTagPOS(splitpoem, 'uh');

// const dynamicGrammar = (ritaAnalysisObject, textarray) => {
//     let grammarObj = {
//         start: ritaAnalysisObject.pos.replace(/([a-z]+)/g, "$$$1").replace(/\$\s+/, ' ')
//     }

//     // add a rule for every part of speech matched in ritaAnalysisObject.pos
//     ritaAnalysisObject.pos.match(/[a-z]+/g).forEach(pos => {
//         // remove 's' from the end of the part of speech
//         //pos = pos.replace(/$$$/, '');
//         grammarObj[pos.replace(/\$/, '')] = getWordsByPennTagPOS(textarray, pos);
//     });

//     return grammarObj;
// }

const buildRulesForGrammar = (grammarObj, textarray) => {
   // add a rule for every part of speech matched in grammarObj.start
   grammarObj.start.match(/\$[a-z]+/g).forEach(pos => {
       // remove '$' from the part of speech
       pos = pos.replace(/\$/, '');
       grammarObj[pos] = getWordsByPennTagPOS(textarray, pos);
   });

   // change nn to nn$1.norepeat()
   grammarObj.start = grammarObj.start.replace(/nn([sp]*)/g, 'nn$1.norepeat()');
   // change vb to vb$1.norepeat()
   grammarObj.start = grammarObj.start.replace(/vb([sp]*)/g, 'vb$1.norepeat()');
   // change rb to rb$1.norepeat()
   grammarObj.start = grammarObj.start.replace(/rb([sp]*)/g, 'rb$1.norepeat()');



}


const addSentencePosToGrammar = (grammarObj, sentence) => {
   let sentencegrammar = rita.analyze(sentence).pos;
   grammarObj['start'] += `${sentencegrammar.trim().replace(/([a-z]+)/g, "$$$1").replace(/\$\s+/, ' ').replace('$to', 'to')} % `;
}


const makeEndRhymes = (lines) => {
   let rhymingWords = [];
   let lastWordOfThisLine = '';
   let lastWordOfPreviousLine = '';
   return lines.split(' % ').map((line, i, arr) => {
       // replace last word in line with a word that rhymes with shad
       // if this is the first line, return it
       if (line.length == 0) {
           return line;
       }

       if (i == 0) {
           lastWordOfThisLine = line.split(' ').filter(word => !rita.isPunct(word)).pop();

           // get the rhyming words for the last word of the previous line
           rhymingWords = rita.rhymes(lastWordOfThisLine, { pos: rita.pos(lastWordOfThisLine) });
           //console.log(`rhyming words for ${lastWordOfThisLine}: ${rhymingWords}`)
           // if there are no rhyming words, replace the last word with a random word
           if (rhymingWords.length == 0 || rhymingWords == undefined || rhymingWords == null) {
               // while rhymingWords is empty, keep replacing the last word with a random word
               let newlastWordOfThisLine = '';
               while (rhymingWords.length == 0 || rhymingWords == undefined || rhymingWords == null) {
                   newlastWordOfThisLine = rita.randomWord(rita.pos(lastWordOfThisLine));
                   rhymingWords = rita.rhymes(newlastWordOfThisLine);
               }
               line = line.replaceAll(lastWordOfThisLine, newlastWordOfThisLine);
               lastWordOfThisLine = newlastWordOfThisLine;
           }

           // console.log('current: ' + lastWordOfThisLine);

           return line;
       }

       // get the last word of the previous line that is not a punctuation mark
       lastWordOfPreviousLine = lastWordOfThisLine;
       // remove the punctuation from the last word of the previous line
       lastWordOfPreviousLine = lastWordOfPreviousLine.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
       // console.log('previous: ' + lastWordOfPreviousLine);
       // get the last word of this line
       lastWordOfThisLine = line.split(' ').filter(word => !rita.isPunct(word)).pop();
       // console.log('current: ' + lastWordOfThisLine);

       // get the rhyming words for the last word of the previous line
       // rhymingWords = rita.rhymes(lastWordOfPreviousLine);
       // console.log(rhymingWords);

       // if the last word of this line is not in the rhyming words for the last word of the previous line, replace it with a random rhyming word
       if (!rhymingWords.includes(lastWordOfThisLine)) {
           // get a random rhyming word
           // console.log('no match on ' + lastWordOfThisLine + ' for ' + lastWordOfPreviousLine + ' so replacing it');
           let randomRhymingWord = rhymingWords[Math.floor(Math.random() * rhymingWords.length)];
           // console.log("using this word:" + randomRhymingWord);
           // replace the last word of this line with the random rhyming word
           let newline = line.replaceAll(lastWordOfThisLine, randomRhymingWord);
           lastWordOfThisLine = randomRhymingWord;

           // console.log(newline);
           return newline;
       } else {

           // return the line
           return line;
       }
   }).join(' % ');

}

let poemgrammar = {
   start: '',
};

addSentencePosToGrammar(poemgrammar, "Glory ! Glory ! Graze the glade merrily !");
addSentencePosToGrammar(poemgrammar, "Roll her hips like stones - ");
addSentencePosToGrammar(poemgrammar, "Some soul tell me how to bask in the shade.");

buildRulesForGrammar(poemgrammar, splitpoem);

poemgrammar['rb'] = "silently | secretly | painfully | happily | violently | together";

console.log(poemgrammar);

let u = new rita.grammar(poemgrammar).expand();

// create ten poems
for (let i = 0; i < 10; i++) {
   // split the poem by the % character, then make the end of each line rhyme with the end of the previous line
   let poem = makeEndRhymes(u);

   console.log("\n++++++++++++++++\n" + poem.replace(/%/g, "\n") + "\n++++++++++++++++\n");

}







