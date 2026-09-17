// @ts-check
const id3 = require('./ID3.mjs').default;
const fs = require('fs');
const mp3 = fs.readFileSync('./program/multi_tag_test.mp3');
const writer = id3.Id3Editor;
let writ = new writer(mp3);
console.log(writ.uncomposedFrames);
console.log(writ.composedFrames);
debugger;