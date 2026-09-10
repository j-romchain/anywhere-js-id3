const id3 = require('./ID3.mjs');
const fs = require('fs');
const writer = id3.Id3Editor;
let writ = new writer(fs.readFileSync('./multi_tag_test.mp3'));