// import rita
const rita = require('rita');

// write an example of using the rita library to find rhymes
// and print them to the console
// let r = rita.rhymes("cat");
// console.log(r);

// analyze a sentence
let rs = rita.analyze("Glory! Glory! Graze the glade!");
rs = rita.analyze("Roll her hips like stones");
// print all the data from rs
//console.log(rs);

//and print all the parts of speech
console.log(rs.pos);

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
go sailin' hallelujah tarry,
de iron boron chief among others,
psychokinetic canary carrie,
to de talles' tree fractal i text,
vinter o john saw some smack and the next.
`;

// create a function that lists all the words in the text and their parts of speech

function getPOS(splittext) {
    // create an empty array to store the parts of speech
    let pos = [];
    // loop through the splittext array
    for (let i = 0; i < splittext.length; i++) {
        // get the part of speech for each word
        let rs = rita.analyze(splittext[i]);
        // add the part of speech to the array
        pos.push(`${splittext[i]} - ${rs.pos}`);
    }
    // return the array
    return pos;
}

function getWordsByPennTagPOS(splittext, pos, syllableCount=2) {
    // create an empty array to store the words
    let words = splittext.filter(w => rita.pos(w)[0] == pos && rita.syllables(w).split('/').length == syllableCount);

    // if there are no words in the array, use the lexicon to find words with the same part of speech
    if (words.length == 0) {
        for (let index = 0; index < 4; index++) {
             // get the words from the lexicon
            words.push(rita.randomWord({ pos: pos, numSyllables: syllableCount}));
        }       
    }
    
    // return the array
    return words.join(" | ");

}

function getNSyllablePOS(splittext, numSyllables, pos) {

    // create switch case for pos
    switch (pos) {
        case 'adjective':

            return splittext.filter(w => rita.isAdjective(w) && rita.syllables(w).split('/').length == numSyllables).join(" | ");
            break;

        case 'adverb':

            return splittext.filter(w => rita.isAdverb(w) && rita.syllables(w).split('/').length == numSyllables).join(" | ");
            break;

        case 'noun':

            return splittext.filter(w => rita.isNoun(w) && rita.syllables(w).split('/').length == numSyllables).join(" | ");
            break;

        case 'verb':

            return splittext.filter(w => rita.isVerb(w) && rita.syllables(w).split('/').length == numSyllables).join(" | ");
            break;

        default:
            return []
            break;
    }

}


// create a function that builds a sentence with five syllables.
// the sentence should start with an adjective, then have a noun, then a verb, then, optionally, another noun
function buildSentence(splittext) {
    // create an empty array to store the words
    let words = [];

    // create a variable to store the number of syllables
    let numSyllables = 0;

    let adjectives = splittext.filter(w => rita.isAdjective(w) && rita.syllables(w).split('/').length >= 2);
    let nouns = splittext.filter(w => rita.isNoun(w));
    let verbs = splittext.filter(w => rita.isVerb(w));

    // create a while loop that runs until the number of syllables is 5
    while (numSyllables < 5) {

        // create a variable that stores all adjective with 2 or more syllables      
        let adjective = adjectives[Math.floor(Math.random() * adjectives.length)];

        // get the number of syllables in the adjective
        let numSyllablesInAdjective = rita.syllables(adjective).split('/').length;

        // if the number of syllables in the adjective plus the number of syllables in the sentence is less than or equal to 5
        if (numSyllablesInAdjective + numSyllables <= 5) {
            // add the adjective to the array
            words.push(adjective);
            // add the number of syllables in the adjective to the number of syllables
            numSyllables += numSyllablesInAdjective;

        }

        // create a variable that stores a random noun
        let noun = nouns[Math.floor(Math.random() * nouns.length)];
        // get the number of syllables in the noun
        let numSyllablesInNoun = rita.syllables(noun).split('/').length;
        // if the number of syllables in the noun plus the number of syllables in the sentence is less than or equal to 5
        if (numSyllablesInNoun + numSyllables <= 5) {
            // add the noun to the array
            words.push(noun);
            // add the number of syllables in the noun to the number of syllables
            numSyllables += numSyllablesInNoun;
        }


        // create a variable that stores a random verb
        let verb = verbs[Math.floor(Math.random() * verbs.length)];
        // get the number of syllables in the verb
        let numSyllablesInVerb = rita.syllables(verb).split('/').length;
        // if the number of syllables in the verb plus the number of syllables in the sentence is less than or equal to 5
        if (numSyllablesInVerb + numSyllables <= 5) {
            // add the verb to the array
            words.push(verb);
            // add the number of syllables in the verb to the number of syllables
            numSyllables += numSyllablesInVerb;
        }
    }

    // join the words in the array with a space and return the sentence
    return words.join(" ");

}

// create a function that builds a sentence with five syllables.
// the sentence should use the parts of speech specified in the parameters as a single string
function buildSentenceWithGrammar(splittext, sentenceGrammar, syllableCount=5) {
    // create an empty array to store the words
    let words = [];

    // create a variable to store the number of syllables
    let numSyllables = 0;

    // create a variable to store the parts of speech
    let pos = sentenceGrammar.split(" ");

    // create a while loop that runs until the number of syllables is 5
    while (numSyllables < syllableCount) {

        //loop through the parts of speech
        for (let i = 0; i < pos.length; i++) {
            // find all words that match the part of speech and has random number of syllables between 1 and 5            
            let wordsWithPOS = splittext.filter(w => rita.pos(w)[0] == pos[i] && rita.syllables(w).split('/').length == Math.floor(Math.random() * syllableCount));
            
            // if there are no words with the specified part of speech, find a random word with the specified part of speech
            if (wordsWithPOS.length == 0) {
                // create three random words with the specified part of speech
                let tempWords = [];
                for (let index = 0; index < 3; index++) {
                    tempWords.push(rita.randomWord({ pos: pos[i]}));
                    
                }
                wordsWithPOS = tempWords;
                
            }


            // create a variable that stores a random word of the specified part of speech 
            let word = wordsWithPOS[Math.floor(Math.random() * wordsWithPOS.length)];

            while (word == undefined) {
                word = splittext.filter(w => rita.pos(w)[0] == pos[i] && rita.syllables(w).split('/').length == Math.floor(Math.random() * syllableCount));
            }

            // get the number of syllables in the word
            let numSyllablesInWord = rita.syllables(word).split('/').length;

            // if the number of syllables in the word plus the number of syllables in the sentence is less than or equal to 5
            if (numSyllablesInWord + numSyllables <= syllableCount) {
                // add the word to the array
                words.push(word.trim());
                // add the number of syllables in the word to the number of syllables
                numSyllables += numSyllablesInWord;
            }

        }

    }

    // join the words in the array with a space and return the sentence
    return words.join(" ");

}

let lines = text.split("\n");
let splitpoem = [];
for (let i = 0; i < lines.length; i++) {
    let words = lines[i].split(" ");
    for (let j = 0; j < words.length; j++) {
        splitpoem.push(words[j]);
    }    
}
    
// console.log(splitpoem);
// console.log(getPOS(splitpoem));
// console.log(rita.syllables('fractal').split('/').length);

// build a sentence with five syllables and log it to the console
//console.log(buildSentenceWithGrammar(splitpoem, 'jj nn vb rb', 7) + "\n");



// find all adjectives with two syllables in the text
let adjWithTwoSyllables = getNSyllablePOS(splitpoem, 2, 'adjective');
// console.log(adjWithTwoSyllables);

//find all nouns with two syllables in the text, then join them with a pipe
let nounsWithTwoSyllables = getNSyllablePOS(splitpoem, 2, 'noun');
// console.log(nounsWithTwoSyllables);

// find all nouns with one syllable in the text, then join them with a pipe
let nounsWithOneSyllable = getNSyllablePOS(splitpoem, 1, 'noun');
// console.log(nounsWithOneSyllable);

// find all verbs with two syllables in the text, then join them with a pipe
let verbsWithTwoSyllables = getNSyllablePOS(splitpoem, 2, 'verb');
// console.log(verbsWithTwoSyllables);

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




//expand haikugrammar object
let h = new rita.grammar(haikugrammar).expand();
console.log(h.replace(/%/g, "\n")+"\n####################\n");




// create a haiku object
let haiku = {

    start: "$5line.ucf() % $7plus5",
    '5line': "the $nnnn | $nnnnn | $vp4 again | $aa $a $n",
    '7plus5': "(I wake and look for water % $vp5) | ($12sen $tree)",

    aaaa: "isolated | suffocated",
    aaa: "exciting | beautiful | adorable",
    rrr: "silently | secretly | painfully | happily | violently | together",
    vvv: "fantasize | remember",

    nn: "people | (the | a) man | women | (the | a) boy | (the | a) girls | children | rabbit | (the | a) dog | racoon | river | mountain | buddha | city | ocean |" + nounsWithTwoSyllables,
    vv: "whisper | blossom | recite | swing | speak | twist | appear | forgive | forget | believe | betray | adore | follow | question",
    aa: "sadly | calmly | coldly |" + adjWithTwoSyllables,

    n: "kids | clouds | trees | leaves | rain | birds | snow | grass | smoke |" + nounsWithOneSyllable,
    a: "sad | tall | hot | drunk | plain | grey",
    v: "sing | cry | bow | rise | bloom | dance | drink | fall",

    '12sen': "(((beetle|termite) eats | ant burrows).art() (silently | placidly) % into the) | ((spider | inchworm).art() dangles % from the)",
    tree: "(chestnut | cedar | old (gum | tea)) tree",

    nnn: "a black rose | white daisies | sakura | rosemary | a yellow cat | oranges | cool moonlight | dark forest | huge mountain",
    nnnn: "(mountain | silent) village | (evening | morning) sun | (winter | summer) flower | (star | sky) above",
    nnnnn: "the (autumn | summer) moonlight",

    vp4: "singing like birds | drifting like snow | falling like (rain | leaves)",
    vp5: "crying like a child | singing like a bird | drifting like the snow | falling like (the rain | a leaf)"
};

//console.log(text.split("\n"));

// get the lines of the text, then find the anlysis of each line
// let lines = text.split("\n");
// for (let i = 0; i < lines.length; i++) {
//     let rs = rita.analyze(lines[i]);
//     console.log(rs);
// }

let c = rita.grammar(haiku).expand();

console.log(c.replace(/%/g, "\n"));
// console.log(splitpoem);
console.log(getWordsByPennTagPOS(splitpoem, 'vbp'));
//console.log(splitpoem.filter(w => rita.pos(w)[0] == "nn" && rita.syllables(w).split('/').length == 2));






