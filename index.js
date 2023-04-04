// import rita
const rita = require('rita');

// write an example of using the rita library to find rhymes
// and print them to the console
// let r = rita.rhymes("cat");
// console.log(r);

// analyze a sentence
// let rs = rita.analyze("The cat sat on the mat");
// // print all the data from rs
// console.log(rs);

//and print all the parts of speech
// console.log(rs.pos);

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

// find all adjectives with four syllables in the text
// let rs = rita.analyze(text);
// console.log(text.split(" ")[0]);
// console.log(rita.isAdjective(text.split(" ")[0]));



let adj = text.split(" ").filter(w =>  rita.isAdjective(w));
console.log(adj);

xibaikw,kif


// create a haiku object
let haiku = {
  
    start: "$5line.ucf() % $7plus5",
    '5line': "the $nnnn | $nnnnn | $vp4 again",
    '7plus5': "(I wake and look for water % $vp5) | ($12sen $tree)",
    
    aaaa: "isolated | suffocated",
    aaa: "exciting | beautiful | adorable",
    rrr: "silently | secretly | painfully | happily | violently | together",
    vvv: "fantasize | remember",
  
    nn: "people | (the | a) man | women | (the | a) boy | (the | a) girls | children | rabbit | (the | a) dog | racoon | river | mountain | buddha | city | ocean",
    vv: "whisper | blossom | recite | swing | speak | twist | appear | forgive | forget | believe | betray | adore | follow | question",
    aa: "sadly | calmly | coldly",
  
    n: "kids | clouds | trees | leaves | rain | birds | snow | grass | smoke",
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






