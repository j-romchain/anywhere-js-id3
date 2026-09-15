// @ts-check
// made with:
// alot of sweat and grease,
// a bit of inspiration,
// a base from https://www.npmjs.com/package/browser-id3-writer,
// some suggestions and debugging with Gemini & Copilot - both with free limits - suggestions usually manually applied
// the id3v2 references in https://github.com/taglib/taglib/blob/master/taglib/mpeg/id3v2/
// which containing repository has the library I used instead,
//  which handles more tags and still works in both browser and node.js in its webassembly version.
//  I still got this to a stable, functional state before switching, just for you.

// BEWARE: the spread (...) operator causes stack overflows with big arguments, 
// so a 50000 item cover image ArrayBuffer or Uint8Array will crash with no error if you use it.
/** @typedef {{ name: string, value: string, size: number }} stringFrame */
/** @typedef {{ name: string, value: number, size: number }} integerFrame */
/** 
 * @typedef {Object} ID3FrameMap
 * @property {{desc:"song artists",arg:{type:"TPE1",                                     data:string[]},      frame:{name:"TPE1",value:string,size:number}}} TPE1
 * @property {{desc:"song composers",arg:{type:"TCOM",                                   data:string[]},      frame:{name:"TCOM",value:string,size:number}}} TCOM
 * @property {{desc:"song genres",arg:{type:"TCON",                                      data:string[]},      frame:{name:"TCON",value:string,size:number}}} TCON
 * @property {{desc:"language",arg:{type:"TLAN",                                         data:string},        frame:{name:"TLAN",value:string,size:number}}} TLAN
 * @property {{desc:"content group description",arg:{type:"TIT1",                        data:string},        frame:{name:"TIT1",value:string,size:number}}} TIT1
 * @property {{desc:"song title",arg:{type:"TIT2",                                       data:string},        frame:{name:"TIT2",value:string,size:number}}} TIT2
 * @property {{desc:"song subtitle",arg:{type:"TIT3",                                    data:string},        frame:{name:"TIT3",value:string,size:number}}} TIT3
 * @property {{desc:"album title",arg:{type:"TALB",                                      data:string},        frame:{name:"TALB",value:string,size:number}}} TALB
 * @property {{desc:"Encoder Company",arg:{type:"TENC",                                  data:string},        frame:{name:"TENC",value:string,size:number}}} TENC
 * @property {{desc:"recording time",arg:{type:"TDRC",                                   data:string},        frame:{name:"TDRC",value:string,size:number}}} TDRC
 * @property {{desc:"album artist",arg:{type:"TPE2",                                     data:string},        frame:{name:"TPE2",value:string,size:number}}} TPE2
 * @property {{desc:"conductor/performer refinement",arg:{type:"TPE3",                   data:string},        frame:{name:"TPE3",value:string,size:number}}} TPE3
 * @property {{desc:"interpreted, remixed, or otherwise modified by",arg:{type:"TPE4",   data:string},        frame:{name:"TPE4",value:string,size:number}}} TPE4
 * @property {{desc:"song number in album",arg:{type:"TRCK",                             data:string},        frame:{name:"TRCK",value:string,size:number}}} TRCK
 * @property {{desc:"album disc number",arg:{type:"TPOS",                                data:string},        frame:{name:"TPOS",value:string,size:number}}} TPOS
 * @property {{desc:"label name",arg:{type:"TPUB",                                       data:string},        frame:{name:"TPUB",value:string,size:number}}} TPUB
 * @property {{desc:"initial key",arg:{type:"TKEY",                                      data:string},        frame:{name:"TKEY",value:string,size:number}}} TKEY
 * @property {{desc:"media type",arg:{type:"TMED",                                       data:string},        frame:{name:"TMED",value:string,size:number}}} TMED
 * @property {{desc:"album release date expressed as 'DDMM'",arg:{type:"TDAT",           data:string},        frame:{name:"TDAT",value:string,size:number}}} TDAT
 * @property {{desc:"isrc - international standard recording code",arg:{type:"TSRC",     data:string},        frame:{name:"TSRC",value:string,size:number}}} TSRC
 * @property {{desc:"software/hardware and settings used for encoding",arg:{type:"TSSE", data:string},        frame:{name:"TSSE",value:string,size:number}}} TSSE
 * @property {{desc:"copyright message",arg:{type:"TCOP",                                data:string},        frame:{name:"TCOP",value:string,size:number}}} TCOP
 * @property {{desc:"iTunes compilation flag",arg:{type:"TCMP",                          data:string},        frame:{name:"TCMP",value:string,size:number}}} TCMP
 * @property {{desc:"lyricist / text writer",arg:{type:"TEXT",                           data:string},        frame:{name:"TEXT",value:string,size:number}}} TEXT
 * @property {{desc:"commercial information",arg:{type:"WCOM",                           data:string},        frame:{name:"WCOM",value:string,size:number}}} WCOM
 * @property {{desc:"copyright/Legal information",arg:{type:"WCOP",                      data:string},        frame:{name:"WCOP",value:string,size:number}}} WCOP
 * @property {{desc:"official audio file webpage",arg:{type:"WOAF",                      data:string},        frame:{name:"WOAF",value:string,size:number}}} WOAF
 * @property {{desc:"official artist/performer webpage",arg:{type:"WOAR",                data:string},        frame:{name:"WOAR",value:string,size:number}}} WOAR
 * @property {{desc:"official audio source webpage",arg:{type:"WOAS",                    data:string},        frame:{name:"WOAS",value:string,size:number}}} WOAS
 * @property {{desc:"official internet radio station homepage",arg:{type:"WORS",         data:string},        frame:{name:"WORS",value:string,size:number}}} WORS
 * @property {{desc:"payment",arg:{type:"WPAY",                                          data:string},        frame:{name:"WPAY",value:string,size:number}}} WPAY
 * @property {{desc:"publishers official webpage",arg:{type:"WPUB",                      data:string},        frame:{name:"WPUB",value:string,size:number}}} WPUB
 * @property {{desc:"song duration in milliseconds",arg:{type:"TLEN",                    data:number},        frame:{name:"TLEN",value:number,size:number}}} TLEN
 * @property {{desc:"album release year",arg:{type:"TYER",                               data:number},        frame:{name:"TYER",value:number,size:number}}} TYER
 * @property {{desc:"beats per minute",arg:{type:"TBPM",                                 data:number},        frame:{name:"TBPM",value:number,size:number}}} TBPM
 * @property {{desc:"play counter",arg:{type:"PCNT",                                     data:number},        frame:{name:"PCNT",value:number,size:number}}} PCNT
 * @property {{desc:"recommended buffer size",arg:{type:"RBUF",                          data:{bufferSize:number,embeddedInfoFlag:boolean,offsetToNextTag:number}},                              frame:{name:"RBUF",size:number,bufferSize:number,embeddedInfoFlag:boolean,offsetToNextTag:number}}} RBUF
 * @property {{desc:"equalisation",arg:{type:"EQUA",                                     data:Array<{adjustment:number,frequency:number}>},                                                      frame:{name:"EQUA",value:Array<{adjustment:number,frequency:number}>,size:number}}} EQUA
 * @property {{desc:"event timing codes",arg:{type:"ETCO",                               data:Array<{type:number,timestamp:number}>},                                                            frame:{name:"ETCO",value:Array<{type:number,timestamp:number}>,size:number}}} ETCO
 * @property {{desc:"general encapsulated object",arg:{type:"GEOB",                      data:{mimeType:string,filename:string,description:string,data:Uint8Array|ArrayLike<number>}},           frame:{name:"GEOB",mimeType:string,filename:string,description:string,value:Uint8Array|ArrayLike<number>,size:number}}} GEOB
 * @property {{desc:"music cd identifier",arg:{type:"MCDI",                              data:Uint8Array|ArrayLike<number>},                                                                     frame:{name:"MCDI",value:Uint8Array|ArrayLike<number>,size:number}}} MCDI
 * @property {{desc:"synced tempo codes",arg:{type:"STCO",                               data:Array<{tempo:number,timestamp:number}>},                                                           frame:{name:"STCO",value:Array<{tempo:number,timestamp:number}>,size:number}}} STCO
 * @property {{desc:"unique file identifier",arg:{type:"UFID",                           data:{id:string,identifier:Uint8Array|ArrayLike<number>}},                                              frame:{name:"UFID",id:string,value:Uint8Array|ArrayLike<number>,size:number}}} UFID
 * @property {{desc:"user defined url link frame",arg:{type:"WXXX",                      data:{description:string,url:string}},                                                                  frame:{name:"WXXX",description:string,value:string,size:number}}} WXXX
 * @property {{desc:"comments",arg:{type:"COMM",                                         data:{description?:string,text:string,language?:string}},                                               frame:{name:"COMM",value: string, language: number[], description: string, size: number}}} COMM
 * @property {{desc:"unsychronised lyrics",arg:{type:"USLT",                             data:{description?:string,lyrics:string,language?:string}},                                             frame:{name:"USLT",value: string, language: number[], description: string, size: number }}} USLT
 * @property {{desc:"involved people list",arg:{type:"IPLS",                             data:[string, number][]},                                                                               frame:{name:"IPLS",value: [string, number][], size:number}}} IPLS
 * @property {{desc:"synchronised lyrics",arg:{type:"SYLT",                              data:{type:number,text:[string,number][],timestampFormat:number,language?:string,description?:string}}, frame:{name:"SYLT",value: [string, number][]; language: number[]; description: string; type: number; timestampFormat: number; size: number; }}} SYLT
 * @property {{desc:"user defined text",arg:{type:"TXXX",                                data:{description?:string,value:string}},                                                               frame:{name:"TXXX",description: string, value: string, size: number}}} TXXX
 * @property {{desc:"private frame",arg:{type:"PRIV",                                    data:{id:string,data:Uint8Array | ArrayLike<number>}},                                                  frame:{name:"PRIV",value: Uint8Array | ArrayLike<number>, id: string, size: number}}} PRIV
 * @property {{desc:"attached picture",arg:{type:"APIC",                                 data:{cropMode:number,data:Uint8Array,description?:string,useUnicodeEncoding?:boolean}},                frame:{name:"APIC",value: Uint8Array | ArrayLike<number>, cropMode: number, mimeType: string, useUnicodeEncoding?: boolean, description: string, size: number}}} APIC
 * @property {{desc:"mpeg location lookup table",arg:{type:"MLLT",                       data:{framesBetweenReference:number,bytesBetweenReference:number,millisecondsBetweenReference:number,devianceBits:number,deviations:number[]}},         frame:{name:"MLLT",framesBetweenReference:number,bytesBetweenReference:number,millisecondsBetweenReference:number,devianceBits:number,deviations:number[],size:number}}} MLLT
 * @property {{desc:"relative volume adjustment",arg:{type:"RVAD",                       data:{increment:boolean, bitsUsed:number, channels: Array<{channel: number, volumeChange: number, peakVolume?: Uint8Array | ArrayLike<number>}>}},      frame:{name:"RVAD", value: {increment:boolean, bitsUsed:number, channels: Array<{channel: number, volumeChange: number, peakVolume?: Uint8Array | ArrayLike<number>}>}, size:number}}} RVAD
 */
/** @typedef {keyof ID3FrameMap} ID3FrameType */
/** @typedef {{ [K in ID3FrameType]: ID3FrameMap[K]['desc']; }} ID3FrameDescriptions */
/** @typedef {ID3FrameMap[ID3FrameType]['frame']} ID3Frame */
/** @typedef {{ [K in ID3FrameType]: ID3FrameMap[K]['frame']; }} ID3Frames */
/** @typedef {ID3FrameMap[ID3FrameType]['arg']} ID3FrameArg */
/** @typedef {{ [K in ID3FrameType]: ID3FrameMap[K]['arg']; }} ID3FrameArgs */

/** 
 *  @interface ID3FrameBase
 *  @property {string} name
 *  @property {number} size
 */
/** 
 *  @interface ID3StringFrame
 *  @extends ID3FrameBase
 *  @property {string} value
 */
/** 
 *  @interface ID3IntegerFrame
 *  @extends ID3FrameBase
 *  @property {number} value
 */
/** 
 *  @interface ID3LanguageTextFrame
 *  @extends ID3FrameBase
 *  @property {string} value
 *  @property {number[]} language
 *  @property {string} description
 */
/** 
 *  @interface ID3PrivateFrame
 *  @extends ID3FrameBase
 *  @property {string} id
 *  @property {Uint8Array | ArrayLike<number>} value
 */
/** 
 *  @interface ID3PictureFrame
 *  @extends ID3FrameBase
 *  @property {Uint8Array | ArrayLike<number>} value
 *  @property {number} pictureType
 *  @property {"image/jpeg" | "image/png" | "image/gif" | "image/webp" | "image/tiff" | "image/bmp" | "image/x-icon"} mimeType
 *  @property {boolean} [useUnicodeEncoding]
 *  @property {string} [description]
 */
/** @typedef {[string, number]} ID3PairedTextEntry */
/** 
 *  @interface ID3PairedTextFrame
 *  @extends ID3FrameBase
 *  @property {ID3PairedTextEntry[]} value
 */
/** 
 *  @interface ID3SynchronisedLyricsFrame
 *  @extends ID3FrameBase
 *  @property {[string, number][]} value
 *  @property {number[]} language
 *  @property {string} description
 *  @property {number} type
 *  @property {number} timestampFormat
 */
/**
 * @typedef {Object} Uint8ArrayScanner
 * @property {Uint8Array} Uint
 * @property {number} scanned
 * @property {(set: ArrayLike<number>, depth?: number) => boolean} verify
 * @property {(n: number) => void} setpos
 * @property {(length: number, depth?: number) => Uint8Array} extract
 * @property {(n: number) => void} increment
 * @property {() => void} reset
 * @property {(n: number) => void} backtrack
 * @property {() => Uint8Array} remaining
 */
/**
 * @typedef {Object} Uint8ArrayBuilder
 * @property {number[]} building
 * @property {number} cursorPos
 * @property {()=>number} built
 * @property {(set: number[]) => void} write
 * @property {(set: number[]) => void} overWrite
 * @property {(n: number) => void} write0s
 * @property {(n: number) => void} setWritePos
 * @property {() => number} toStart
 * @property {() => number} toEnd
 * @property {(n: any) => number} jumpAhead
 * @property {(n: any) => number} jumpBack
 * @property {() => Uint8Array} result
 */
/**
 * @param {string} e
 */
function charCodes(e) {
    return String(e).split("").map(e => e.charCodeAt(0))
}

/**
 * @param {string} t
 * @param {number} [e]
 * @returns {number[]}
 */
function strToBytes(t,e=0) {
    switch (e) {
        case 0:
            return t.split("").map(c=>c.charCodeAt(0) & 0xFF).concat([0]);
        case 1:
            return [0xFF, 0xFE].concat(t.split("").flatMap(c=>[c.charCodeAt(0) & 0xFF,(c.charCodeAt(0) >> 8) & 0xFF])).concat([0,0]);
        case 2:
            return [0xFE, 0xFF].concat(t.split("").flatMap(c=>[(c.charCodeAt(0) >> 8) & 0xFF,c.charCodeAt(0) & 0xFF])).concat([0,0]);
        case 3:
            return Array.from(new TextEncoder().encode(t+"\0"));
        default:
            throw Error("Encoding Bit Not Valid:'" + e + "'");
    }
}
/**
 * @param {Uint8Array} t
 * @param {number} [e] encoding
 * @param {boolean} [noNull] indicate if there is no null terminator
 * @returns {[number,string]}
 */
function extractStr(t,e=3,noNull) {
    const is16Bit = e>0 && e<3;
    let len = noNull?t.byteLength:t.findIndex((v,i,r)=>is16Bit?(v===0 && r[i+1]===0 && i%2===0):v===0);
    if (len<0) { console.warn("Missing Null Terminator, interpreting all as string."); len = t.byteLength;}
    return [len, bytesToStr(t.slice(0,len),e)];
}
/**
 * @param {Uint8Array} t
 * @param {number} [e]
 * @returns {string}
 */
function bytesToStr(t,e=0) {
    switch (e) {
        case 0:
            return new TextDecoder('iso-8859-1').decode(t);
        case 1:
            if (t.length < 2) return "";
            const BOM = t.slice(0,2);
            t = t.slice(2);
            if (BOM[0] === 0xFF && BOM[1] === 0xFE) {
                return new TextDecoder('utf-16le').decode(t);
            } else if (BOM[0] !== 0xFE || BOM[1] !== 0xFF) {
                throw Error("UTFBOM '" + BOM + "' is not valid.");
            }
        case 2: // FALL THROUGH FROM ABOVE IF be
            return new TextDecoder('utf-16be').decode(t);
        case 3:
            return new TextDecoder('utf-8').decode(t);
        default:
            throw Error("Encoding Bit Not Valid:'" + e + "'");
    }
}
/**
 * @param {number} e
 */
function intToBytes(e) {
    const t = 255;
    return [e >>> 24 & t, e >>> 16 & t, e >>> 8 & t, e & t]
}
/**
 * @param {number} e
 */
function plusTextHeader(e) {
    return 11 + e
}
/**
 * @param {number} e
 * @param {number} t
 * @param {number} a
 * @param {boolean} r
 */
function pictureFrameSize(e, t, a, r) {
    return 11 + t + 1 + 1 + (r ? 2 + 2 * (a + 1) : a + 1) + e
}
/**
 * @param {[string, number][]} e
 */
function pairedTextFrameSize(e) {
    let t = 0;
    return e.forEach(e => {
        t += 2 + 2 * e[0].length + 2 + 2 + 2 * (e[1]+"".length) + 2
    }
    ), 11 + t
}
/**
 * @param {[string, number][]} e
 * @param {number} t
 */
function syncLyricsFrameSize(e, t) {
    const a = 2 * t;
    let r = 0;
    return e.forEach(e => {
        r += 2 + 2 * e[0].length + 2 + 4
    }
    ), 18 + a + 2 + r
}
/**
 * @param {Uint8Array} uint8
 * @returns {Uint8ArrayScanner}
 */
function newScanner(uint8) {
    /** @type {Uint8ArrayScanner} */
    const scanner = {
        Uint: uint8,
        scanned: 0,
        verify: (set, depth) => scanner.Uint.subarray(depth ?? scanner.scanned, (depth ?? scanner.scanned) + set.length).every((e, i) => e === set[i]),
        extract: (length, depth) => scanner.Uint.subarray(depth ?? scanner.scanned, (depth ?? scanner.scanned) + length),
        increment: (n) => { scanner.scanned += n; },
        reset: () => { scanner.scanned = 0; },
        setpos: (n) => { scanner.scanned = n; },
        backtrack: (n) => { scanner.scanned -= n; },
        remaining: () => scanner.Uint.subarray(scanner.scanned)
    };
    return scanner;
}
/**
 * @returns {Uint8ArrayBuilder}
 */
function newBuilder() {
    /** @type {Uint8ArrayBuilder} */
    const builder = {
        building: [],
        cursorPos: 0,
        built: ()=>builder.building.length,
        write: (set) => {
            if (builder.cursorPos===builder.building.length){
                set.forEach(v=>builder.building.push(v));
                builder.cursorPos+=set.length;
                return true;
            }
            builder.building=builder.building.slice(0,builder.cursorPos).concat(set).concat(builder.building.slice(builder.cursorPos));
            builder.cursorPos+=set.length;
            return true;
        },
        overWrite: (set) => {
                builder.building=builder.building.slice(0,builder.cursorPos).concat(set).concat(builder.building.slice(builder.cursorPos+set.length));
                builder.cursorPos+=set.length;
                return true;
            },
        write0s: (n) => builder.overWrite(new Array(n).fill(0)),
        setWritePos: (n) => builder.cursorPos = n,
        toStart: () => builder.cursorPos = 0,
        toEnd: () => builder.cursorPos = builder.built.length,
        jumpAhead: (n) => builder.cursorPos = Math.min(builder.cursorPos+n,builder.built.length),
        jumpBack: (n) => builder.cursorPos = Math.max(builder.cursorPos-n,0),
        result: () => new Uint8Array(builder.building)
    };
    return builder;
}
/**
 * 
 * @param {Uint8Array} uint8
 * @returns {{ frames:ID3Frame[], remaining:Uint8Array }}
 */
function readTag(uint8) {
    const start = _readID3v2(uint8);
    const oldEnd = _readID3v1(uint8);
    const newEnd = _readID3v2point4(uint8);
    const allFrames = (start?.frames ?? []).concat(oldEnd.frames).concat(newEnd.frames);
    //dedupe, prioritizing the first occurrence of each frame name
    const deDupedFrames = allFrames.filter((frame, index, self) => index === self.findIndex((f) => f.name === frame.name));
    const remaining = removeTags(uint8); 
    return { frames: deDupedFrames, remaining: remaining};
}
/** @typedef {{name:ID3Frame["name"], size:number, uInt8:Uint8Array}} RawFrame */
/**
 * @param {Uint8Array} uint8 
 * @returns {{header:ID3EndPart, extHeader:ID3ExtHeader | null, frames:ID3Frame[], padding:number, footer:ID3EndPart | null, remaining:Uint8Array} | null};
 */
function _readID3v2(uint8) {
    let c = 0;
    function ext(/** @type {number} */ln) {
        c+=ln;
        return uint8.slice(c-ln,c);
    }
    if (uint8.byteLength<10) return null;
    const header = _parseID3v2Header(ext(10));
    if (!header) return null;
    const extSize = header.flags.isExtended?((rs)=>(rs[0] << 21) + (rs[1] << 14) + (rs[2] << 7) + rs[3])(uint8.slice(c,c+4)):0;
    const extHeader = (!header.flags.isExtended)?null:_parseID3v2ExtHeader(ext(extSize));
    const framesNPadding = uint8.slice(c,c+header.size-extSize);
    const framesSize = framesNPadding.findLastIndex(v=>v!==0);
    const frames = _parseID3v2Frames(ext(framesSize),header.version);
    if (!frames) return null;
    const padding = framesNPadding.byteLength-framesSize;
    const footer = header.flags.hasFooter ? _parseID3v2Footer(ext(10)):null;
    const remaining = uint8.slice(c);
    return { header, extHeader, frames, padding, footer, remaining };
}
/**
 * @typedef {{
 *     magic: string;
 *     version: number;
 *     revision: number;
 *     flags: {
 *         rawFlags: number;
 *         isUnsync: boolean;
 *         isExtended: boolean;
 *         isExpirimental: boolean;
 *         hasFooter: boolean;
 *         unknownFlag: number;
 *     };
 *     size: number;
 * }} ID3EndPart
 */
/**
 * @typedef {{
 *     magic?: string;
 *     version?: number;
 *     revision?: number;
 *     flags?: number | {
 *         isUnsync: boolean;
 *         isExtended: boolean;
 *         isExpirimental: boolean;
 *         hasFooter: boolean;
 *         unknownFlag: number;
 *     };
 *     size: number;
 * }} ID3EndPartArgs
 */
/**
 * @typedef {{
 *     size: number;
 *     flagCount: number;
 *     flags: [Uint8Array]; // Todo
 * }} ID3ExtHeader
 */
/**
 * @typedef {{
 *     size: number;
 *     flagCount: number;
 *     flags: [Uint8Array]; // Todo
 * }} ID3ExtHeaderArgs
 */
/**
 * @param {Uint8Array} uint8
 * @returns {null | ID3EndPart}
 */
function _parseID3v2EndPart(uint8) {
    const scanner = newScanner(uint8);
    if (!scanner.verify(charCodes("ID3"))&&!scanner.verify(charCodes("3DI"))) {
        // No ID3v2 Header Or Footer found
        return null;
    }
    const magic = bytesToStr(scanner.extract(3),0);
    scanner.increment(3);
    const [version, revision, rawFlags] = scanner.extract(3);
    scanner.increment(3);
    const [isUnsync, isExtended, isExpirimental, hasFooter, unknownFlag] = [
        Boolean(rawFlags & 0x80), // Bit 7: Unsynchronisation
        Boolean(rawFlags & 0x40), // Bit 6: Extended header
        Boolean(rawFlags & 0x20), // Bit 5: Experimental
        Boolean(rawFlags & 0x10), // Bit 4: Footer present
        rawFlags & 0x0F           // Bits 3-0: Reserved/Unknown
    ];
    const rawSize = scanner.extract(4);
    scanner.increment(4);
    const size = (rawSize[0] << 21) + (rawSize[1] << 14) + (rawSize[2] << 7) + rawSize[3];
    return {
        magic,
        version,
        revision,
        flags: {
            rawFlags,
            isUnsync,
            isExtended,
            isExpirimental,
            hasFooter,
            unknownFlag
        },
        size
    };
}
/**
 * @param {ID3EndPartArgs} header
 * @param {boolean} [isFooter]
 * @returns {Uint8Array}
 */
function _buildID3v2EndPart(header,isFooter) {
    const builder = newBuilder();
    builder.write(charCodes(header.magic ?? isFooter ? "3DI":"ID3"));
    builder.write([header.version ?? 4, header.revision ?? 0]);
    const flagByte = (typeof header.flags === "number") ? header.flags : (
        (header.flags?.isUnsync ? 0x80 : 0) |       // Bit 7: Unsynchronisation
        (header.flags?.isExtended ? 0x40 : 0) |     // Bit 6: Extended header
        (header.flags?.isExpirimental ? 0x20 : 0) | // Bit 5: Experimental
        (header.flags?.hasFooter ? 0x10 : 0) |      // Bit 4: Footer present
        ((header.flags?.unknownFlag ?? 0) & 0x0F)   // Bits 3-0: Reserved/Unknown
    );
    builder.write([flagByte]);
    builder.write([header.size >>> 21 & 127, header.size >>> 14 & 127, header.size >>> 7 & 127, header.size & 127]);
    return builder.result();
}
/**
 * @param {Uint8Array} uint8
 * @returns {null | ID3EndPart}
 */
function _parseID3v2Header(uint8) {
    return _parseID3v2EndPart(uint8);
}
/**
 * @param {ID3EndPartArgs} header
 * @returns {Uint8Array}
 */
function _buildID3v2Header(header) {
    return _buildID3v2EndPart(header);
}
/**
 * @param {Uint8Array} uint8
 * @returns {null | ID3EndPart}
 */
function _parseID3v2Footer(uint8) {
    return _parseID3v2EndPart(uint8);
}
/**
 * @param {ID3EndPartArgs} footer
 * @returns {Uint8Array}
 */
function _buildID3v2Footer(footer) {
    return _buildID3v2EndPart(footer, true);
}
/**
 * @param {Uint8Array} uint8
 * @returns {null | ID3ExtHeader}
 */
function _parseID3v2ExtHeader(uint8) {
    const scanner = newScanner(uint8);
    const rawSize = scanner.extract(4);
    scanner.increment(4);
    const size = (rawSize[0] << 21) + (rawSize[1] << 14) + (rawSize[2] << 7) + rawSize[3];
    const flagCount = scanner.extract(1)[0];
    console.warn("Extended Headers are not yet fully supported.");
    return {
        size,
        flagCount,
        flags: [scanner.remaining()]
    };
}
/**
 * @param {ID3ExtHeaderArgs} extHeader
 * @returns {Uint8Array}
 */
function _buildID3v2ExtHeader(extHeader) {
    const builder = newBuilder();
    builder.write([extHeader.size >>> 21 & 127, extHeader.size >>> 14 & 127, extHeader.size >>> 7 & 127, extHeader.size & 127]);
    builder.write([extHeader.flagCount]);
    console.warn("Extended Headers are not yet fully supported.");
    builder.write(Array.from(extHeader.flags[0]));
    return builder.result();
}
/**
 * @param {Uint8Array} uint8 
 * @returns {{frames:ID3Frame[], remaining:Uint8Array}}
 */
function _readID3v1(uint8) {
    const scanner = newScanner(uint8);
    scanner.setpos(scanner.Uint.length-128);
    if (!scanner.verify(charCodes("TAG"),scanner.Uint.length-128)) {
        // no ID3v1 tag found, don't error, just return no frames.
        return { frames: [], remaining: uint8 };
    }
    scanner.increment(3);//"TAG"
    const title = bytesToStr(scanner.extract(30)).replace(/\0/g, "");
    scanner.increment(30);
    const artist = bytesToStr(scanner.extract(30)).replace(/\0/g, "");
    scanner.increment(30);
    const album = bytesToStr(scanner.extract(30)).replace(/\0/g, "");
    scanner.increment(30);
    const year = bytesToStr(scanner.extract(4)).replace(/\0/g, "");
    scanner.increment(4);
    const hasTrack = scanner.extract(1,scanner.scanned+28)[0] === 0; //ID3v1.1 has '28 comment, 1 test, 1 track', ID3v1 has '30 comment'
    const comment = bytesToStr(scanner.extract(28+(hasTrack?0:2))).replace(/\0/g, "");
    scanner.increment(28+(hasTrack?0:2));
    const track = hasTrack ? scanner.extract(2)[1] : 0; // ID3v1.0 has no track number, ID3v1.1 has 0,trck as last 2 bytes of comment
    if (hasTrack) scanner.increment(2); //all 0 byte delim and track byte, if applicable
    const genre = scanner.extract(1)[0];
    scanner.increment(1);
    const frames = [];
    title && frames.push(_genStringFrame("TIT2", title));
    artist && frames.push(_genStringFrame("TPE1", artist));
    album && frames.push(_genStringFrame("TALB", album));
    year && frames.push(_genIntegerFrame("TYER", year));
    /** @type {ID3FrameArgs["COMM"]} */
    comment && frames.push(genFrame({type:"COMM", data:{text:comment, description: "", language: "eng"}}));
    track && frames.push(_genStringFrame("TRCK", track + ""));
    const genremap = ["Blues", "Classic Rock", "Country", "Dance", "Disco", "Funk", "Grunge", "Hip-Hop", "Jazz", "Metal", "New Age", "Oldies", "Other", "Pop", "R&B", "Rap", "Reggae", "Rock", "Techno", "Industrial", "Alternative", "Ska", "Death Metal", "Pranks", "Soundtrack", "Euro-Techno", "Ambient", "Trip-Hop", "Vocal", "Jazz+Funk", "Fusion", "Trance", "Classical", "Instrumental", "Acid", "House", "Game", "Sound Clip", "Gospel", "Noise", "Alternative Rock", "Bass", "Soul", "Punk", "Space", "Meditative", "Instrumental Pop", "Instrumental Rock", "Ethnic", "Gothic", "Darkwave", "Techno-Industrial", "Electronic", "Pop-Folk", "Eurodance", "Dream", "Southern Rock", "Comedy", "Cult", "Gangsta Rap", "Top 40", "Christian Rap", "Pop/Funk", "Jungle", "Native American", "Cabaret", "New Wave", "Psychedelic", "Rave", "Showtunes", "Trailer", "Lo-Fi", "Tribal", "Acid Punk", "Acid Jazz", "Polka", "Retro", "Musical", "Rock & Roll", "Hard Rock", "Folk", "Folk-Rock", "National Folk", "Swing", "Fast Fusion", "Bebob", "Latin", "Revival", "Celtic", "Bluegrass", "Avantgarde", "Gothic Rock", "Progressive Rock", "Psychedelic Rock", "Symphonic Rock", "Slow Rock", "Big Band", "Chorus", "Easy Listening", "Acoustic", "Humour", "Speech", "Chanson", "Opera", "Chamber Music", "Sonata", "Symphony", "Booty Bass", "Primus", "Porn Groove", "Satire", "Slow Jam", "Club", "Tango", "Samba", "Folklore", "Ballad", "Power Ballad", "Rhythmic Soul", "Freestyle", "Duet", "Punk Rock", "Drum Solo", "A Cappella", "Euro-House", "Dance Hall", "Goa", "Drum & Bass", "Club-House", "Hardcore", "Terror", "Indie", "BritPop", "Negerpunk", "Polsk Punk", "Beat", "Christian Gangsta Rap", "Heavy Metal", "Black Metal", "Crossover", "Contemporary Christian", "Christian Rock", "Merengue", "Salsa", "Thrash Metal", "Anime", "JPop", "Synthpop", "Abstract", "Art Rock", "Baroque", "Bhangra", "Big Beat", "Breakbeat", "Chillout", "Downtempo", "Dub", "EBM", "Eclectic", "Electro", "Electroclash", "Emo", "Experimental", "Garage", "Global", "IDM", "Illbient", "Industro-Goth", "Jam Band", "Krautrock", "Leftfield", "Lounge", "Math Rock", "New Romantic", "Nu-Breakz", "Post-Punk", "Post-Rock", "Psytrance", "Shoegaze", "Space Rock", "Trop Rock", "World Music", "Neoclassical", "Audiobook", "Audio Theatre", "Neue Deutsche Welle", "Podcast", "Indie Rock", "G-Funk", "Dubstep", "Garage Rock", "Psybient"];
    genre && frames.push(_genStringFrame("TCON", genremap[genre] ?? ("Other, ID" + genre)));
    return { frames: frames, remaining: uint8.slice(0, scanner.Uint.length-128) };
}
/**
 * @param {Uint8Array} uint8 
 * @returns {{frames:ID3Frame[], remaining:Uint8Array}}
 */
function _readID3v2point4(uint8) {
    const scanner = newScanner(uint8);
    const isOldEnd = scanner.verify(charCodes("TAG"),scanner.Uint.length-128);
    scanner.setpos(scanner.Uint.length-(isOldEnd?138:10));
    if (!scanner.verify(charCodes("3DI"))) {
        // no ID3v2.4 trailing tag found, don't error, just return no frames.
        return { frames: [], remaining: uint8 };
    }
    scanner.increment(3);//"3DI"
    const [version,subversion,flags] = scanner.extract(3);
    scanner.increment(3);//Version,subversion,flags
    const encodedLength = scanner.extract(4);
    const decodedLength = (encodedLength[0] << 21) + (encodedLength[1] << 14) + (encodedLength[2] << 7) + encodedLength[3];
    scanner.increment(4);
    scanner.backtrack(10);//backtrack to the start of the header
    scanner.backtrack(decodedLength);//backtrack to the start of the frames
    const frames = _parseID3v2Frames(uint8.slice(scanner.scanned, scanner.scanned + decodedLength), version);
    const remaining = uint8.slice(0, scanner.scanned);
    return { frames, remaining };
}
/**
 * @param {Uint8Array} uint8 JUST THE FRAMES, NO HEADER, NO END DATA
 * @param {number} [version] required to handle v2.2 or v2.1, just the 2 or 1
 * @returns {ID3Frame[]}
 */
function _parseID3v2Frames(uint8, version = 3) {
    const allframesScanner = newScanner(uint8);
    const pre3 = version < 3;
    /** @type {RawFrame[]} */
    const rawFrames = [];
    while (allframesScanner.scanned < allframesScanner.Uint.length) {
        let nm = bytesToStr(allframesScanner.extract(pre3 ? 3:4));
        if (!nm || nm === "\0\0\0\0" || nm === "\0\0\0") break;
        if (!nm.match(new RegExp("^[A-Z0-9]{"+(pre3?3:4)+"}$"))) throw new Error("Invalid frame name " + nm);
        if (pre3) {
            /** @type {Record<String,ID3Frame["name"]>} */
            const pre3Frames = { /* TEXT FRAMES */ /* Title */ "TT2": "TIT2", /* Artist */ "TP1": "TPE1", /* Album */ "TAL": "TALB", /* Track number */ "TRK": "TRCK", /* Year */ "TYE": "TYER", /* Genre */ "TCO": "TCON", /* Album Artist / Band */ "TP2": "TPE2", /* Composer */ "TCM": "TCOM", /* Lyricist */ "TXT": "TEXT", /* Initial key */ "TKE": "TKEY", /* Language */ "TLA": "TLAN", /* Length */ "TLE": "TLEN", /* Publisher */ "TPB": "TPUB", /* ISRC */ "TRC": "TSRC", /* Part of set */ "TPA": "TPOS", /* Content group */ "TT1": "TIT1", /* Subtitle */ "TT3": "TIT3", /* Media type */ "TMT": "TMED", /* Encoded by */ "TEN": "TENC", /* COMMENTS & LYRICS */ /* Comments */ "COM": "COMM", /* Synchronized lyrics */ "SLT": "SYLT", /* URL FRAMES */ "WCM": "WCOM", "WCP": "WCOP", "WAF": "WOAF", "WAR": "WOAR", "WAS": "WOAS", "WPB": "WPUB", /* SPECIAL / COMPLEX FRAMES */ /* Involved people list */ "IPL": "IPLS", /* Attached picture */ "PIC": "APIC", /* Buffer size*/ "BUF": "RBUF", /* Play counter*/ "CNT": "PCNT", /* Equalization */ "EQU": "EQUA", /* Event Timing */ "ETC": "ETCO", /* File In Tag */ "GEO": "GEOB", /* CD ID*/ "MCI": "MCDI", /* MPEG Lookup Table */ "MLL": "MLLT", /* Relative Volume */ "RVA": "RVAD", /* TempoSync */ "STC": "STCO", /* Unsynced lyrics */ "ULT": "USLT", /* File UID */ "UFI": "UFID", /* Custom URL */ "WXX": "WXXX" };
            nm = pre3Frames[nm] ?? (nm + " ");
        }
        /** @type {ID3Frame["name"]} */
        // @ts-ignore
        const name = nm;
        allframesScanner.increment(pre3?3:4);
        const encodedFSize = (pre3?[0]:[]).concat(Array.from(allframesScanner.extract(pre3?3:4)));
        const size = (encodedFSize[0] << 24) + (encodedFSize[1] << 16) + (encodedFSize[2] << 8) + encodedFSize[3];
        if (size > allframesScanner.Uint.length - allframesScanner.scanned) throw new Error("Invalid frame size " + size);
        allframesScanner.increment(pre3?3:4);
        const uint8 = allframesScanner.extract(size + (pre3?0:2));
        allframesScanner.increment(size + (pre3?0:2));
        /** @type {RawFrame} */
        let f = {
            name,
            size,
            uInt8: uint8
        };
        rawFrames.push(f);
    }
    /** @type {ID3Frame[]} */
    return rawFrames.map(rf=>parseFrame(rf,pre3)).filter(v=>v!==null);
}
/**
 * @param {ID3Frame} frame
 * @returns {Uint8Array}
 */
function buildFrame(frame) {
    const builder = newBuilder();
    builder.write(strToBytes(frame.name));//frame name, encoded
    builder.write(intToBytes(frame.size - 10));//frame size, encoded
    builder.write([0,0]);//FrameFlags (0's)
    switch (frame.name) {
        case "TPE1": case "TDAT": case "TCOM": case "TCON": case "TLAN": case "TIT1": case "TIT2": case "TIT3": case "TALB": case "TPE2": case "TPE3": case "TPE4": case "TRCK": case "TPOS": case "TKEY": case "TMED": case "TPUB": case "TCOP": case "TEXT": case "TSSE": case "TSRC": case "TDRC": case "TENC": case "TCMP":
            builder.write([1]);
            builder.write(strToBytes(frame.value, 2));
            return builder.result();
        case "WCOM": case "WCOP": case "WOAF": case "WOAR": case "WOAS": case "WORS": case "WPAY": case "WPUB":
            builder.write(strToBytes(frame.value));
            return builder.result();
        case "TXXX":  case "WXXX": case "USLT": case "COMM":
            builder.write([1]);
            if (frame.name === "USLT" || frame.name === "COMM") {
                builder.write(frame.language);
            }
            builder.write(strToBytes(frame.description,1));
            builder.write(strToBytes(frame.value,(frame.name === "WXXX") ? 3:1));
            return builder.result();
        case "TBPM": case "TLEN": case "TYER": case "PCNT":
            builder.write([0]);
            builder.write(strToBytes(frame.value+""));
            return builder.result();
        case "PRIV": case "UFID":
            builder.write(strToBytes(frame.id));
            builder.write([0].concat(Array.from(frame.value)));
            return builder.result();
        case "APIC":
            builder.write([frame.useUnicodeEncoding ? 1 : 0]);
            builder.write(strToBytes(frame.mimeType));
            builder.write([0, frame.cropMode]);
            if (frame.useUnicodeEncoding) {
                builder.write(strToBytes(frame.description,1));
            } else {
                builder.write(strToBytes(frame.description,0));
            }            
            builder.write(Array.from(frame.value));
            return builder.result();
        case "IPLS":
            builder.write([1])
            frame.value.forEach((t) => {
                builder.write(strToBytes(t[0].toString(),1));
                builder.write(strToBytes(t[1].toString(),1));
            });
            return builder.result();
        case "SYLT": 
            builder.write([1].concat(frame.language).concat(frame.timestampFormat).concat(frame.type));
            builder.write(strToBytes(frame.description,1));
            frame.value.forEach((t) => {
                builder.write(strToBytes(t[0].toString(),1));
                builder.write(intToBytes(t[1]));
            });
            return builder.result();
        case "RBUF":
            // bufferSize is 3 bytes, offsetToNextTag is 4 bytes, embeddedInfoFlag is 1 byte (bit 1)
            builder.write([
                (frame.bufferSize >>> 16) & 255,
                (frame.bufferSize >>> 8) & 255,
                frame.bufferSize & 255
            ]);
            builder.write([frame.embeddedInfoFlag ? 0x02 : 0]);
            builder.write([
                (frame.offsetToNextTag >>> 24) & 255,
                (frame.offsetToNextTag >>> 16) & 255,
                (frame.offsetToNextTag >>> 8) & 255,
                frame.offsetToNextTag & 255
            ]);
            return builder.result();
        case "EQUA": {
            builder.write([16]); // Defaulting to 16-bit adjustment resolution
            frame.value.forEach(eq => {
                const inc = eq.adjustment >= 0;
                const adj = Math.abs(eq.adjustment);
                // Frequency is 15 bits, high bit indicates increment/decrement flag
                const freqHigh = ((eq.frequency >> 8) & 0x7F) | (inc ? 0x80 : 0x00);
                const freqLow = eq.frequency & 0xFF;
                builder.write([freqHigh, freqLow]);
                // Writing 16-bit (2 bytes) adjustment
                builder.write([(adj >> 8) & 0xFF, adj & 0xFF]);
            });
            return builder.result();
        }
        case "ETCO": {
            builder.write([1]); // Time stamp format (1 = absolute time using milliseconds)
            frame.value.forEach(item => {
                builder.write([item.type]);
                builder.write(intToBytes(item.timestamp));
            });
            return builder.result();
        }
        case "GEOB": {
            builder.write([1]); // Text encoding (Unicode/UTF-8)
            builder.write(strToBytes(frame.mimeType, 0)); // MIME type is Latin-1 encoded
            builder.write(strToBytes(frame.filename, 1));
            builder.write(strToBytes(frame.description, 1));
            builder.write(Array.from(frame.value));
            return builder.result();
        }
        case "MCDI": {
            builder.write(Array.from(frame.value));
            return builder.result();
        }
        case "STCO": {
            builder.write([1]); // Time stamp format
            frame.value.forEach(item => {
                builder.write([item.tempo]);
                builder.write(intToBytes(item.timestamp));
            });
            return builder.result();
        }
        case "MLLT": {
            builder.write([
                (frame.framesBetweenReference >> 8) & 0xFF,
                frame.framesBetweenReference & 0xFF
            ]);
            builder.write([
                (frame.bytesBetweenReference >> 16) & 0xFF,
                (frame.bytesBetweenReference >> 8) & 0xFF,
                frame.bytesBetweenReference & 0xFF
            ]);
            builder.write([
                (frame.millisecondsBetweenReference >> 16) & 0xFF,
                (frame.millisecondsBetweenReference >> 8) & 0xFF,
                frame.millisecondsBetweenReference & 0xFF
            ]);
            builder.write([frame.devianceBits]);
            builder.write([0, 0]); // placeholder skip for bitsForBytes & bitsForMillis
            frame.deviations.forEach(dev => {
                // Packing deviations based on devianceBits logic if needed, or writing raw
                builder.write(intToBytes(dev));
            });
            return builder.result();
        }
        case "RVAD": {
            const flags = (frame.value.increment ? 0x01 : 0) | ((frame.value.bitsUsed & 0x07) << 1);
            builder.write([flags]);
            // If channels are populated, serialize them out per spec requirements
            frame.value.channels.forEach(ch => {
                builder.write([ch.channel]);
                builder.write([
                    (ch.volumeChange >> 8) & 0xFF,
                    ch.volumeChange & 0xFF
                ]);
                if (ch.peakVolume) {
                    builder.write(Array.from(ch.peakVolume));
                }
            });
            return builder.result();
        }
        default:
            throw new Error(`Unsupported frame ${JSON.stringify(frame)}`)
    }
}
/** 
 * @param {RawFrame} rawFrame
 * @param {boolean} pre3
 * @returns {ID3Frame | null};
 */
function parseFrame(rawFrame, pre3) {
    const fscn = newScanner(rawFrame.uInt8);
    const frameFlags = pre3?[0,0]:fscn.extract(2);
    pre3 || fscn.increment(2);//FrameFlags not in pre-v2.3
    switch (rawFrame.name) {
        case "TPE1": case "TDAT": case "TCOM": case "TCON": case "TLAN": case "TIT1": case "TIT2": case "TIT3": case "TALB": case "TPE2": case "TPE3": case "TPE4": case "TRCK": case "TPOS": case "TKEY": case "TMED": case "TPUB": case "TCOP": case "TEXT": case "TSSE": case "TSRC": case "TDRC": case "TENC": case "TCMP":{
                const e = fscn.extract(1)[0];
                fscn.increment(1);
                const [l, value] = extractStr(fscn.remaining(), e, true);
                fscn.increment(l);
                return { name:rawFrame.name, size:rawFrame.size, value };
            }
        case "WCOM": case "WCOP": case "WOAF": case "WOAR": case "WOAS": case "WORS": case "WPAY": case "WPUB": {
                const [l, value] = extractStr(fscn.remaining(),0,true);
                fscn.increment(l);
                return { name:rawFrame.name, size:rawFrame.size, value };
            }
        case "TXXX": case "WXXX": case "USLT": case "COMM": {
                const e = fscn.extract(1)[0];
                fscn.increment(1);
                const language = (rawFrame.name === "USLT" || rawFrame.name === "COMM") ? // TXXX and WXXX don't have lang code;
                    Array.from(fscn.extract(3)):[];
                language.length===0 || fscn.increment(3);
                const [dl, description] = extractStr(fscn.remaining(),e);
                fscn.increment(dl);
                const [vl, value] = extractStr(fscn.remaining(),(rawFrame.name === "WXXX") ? 3:e); //URL of WXXX is not encoded.
                fscn.increment(vl);
                return (rawFrame.name === "USLT" || rawFrame.name === "COMM") ?
                { name:rawFrame.name, size:rawFrame.size, value, description, language }:
                { name:rawFrame.name, size:rawFrame.size, value, description };
            }
        case "TBPM": case "TLEN": case "TYER": case "PCNT": {
                const e = fscn.extract(1)[0];
                fscn.increment(1);
                const [vl, valueStr] = extractStr(fscn.remaining(),e,true);
                const value = parseInt(valueStr, 10);
                fscn.increment(vl);
                return { name:rawFrame.name, size:rawFrame.size, value };
            }
        case "PRIV": case "UFID": {
                const [il, id] = extractStr(fscn.remaining(),0);
                fscn.increment(il);
                const value = fscn.remaining();
                fscn.increment(value.byteLength);
                return { name:rawFrame.name, size:rawFrame.size, value, id };
            }
        case "APIC": {
                const e = fscn.extract(1)[0];
                fscn.increment(1);
                const [ml,mimeType] = extractStr(fscn.remaining(),e);
                fscn.increment(ml);
                const pictureType = fscn.extract(1)[0];
                fscn.increment(1);
                const [dl,description] = extractStr(fscn.remaining(), e);
                fscn.increment(dl);
                const value = fscn.remaining();
                fscn.increment(value.byteLength);
                return { name:rawFrame.name, size:rawFrame.size, value, description, cropMode: pictureType, mimeType };
            }
        case "IPLS": {
                const e = fscn.extract(1)[0];
                fscn.increment(1);
                /** @type {[string, number][]} */
                const value = [];
                while (fscn.scanned<fscn.Uint.byteLength) {
                    const [sl,str] = extractStr(fscn.remaining(), e);
                    fscn.increment(sl);
                    const [nl,ns] = extractStr(fscn.remaining(), e);
                    const num = parseInt(ns, 10);
                    fscn.increment(nl);
                    value.push([str, num]);
                }
                return { name:rawFrame.name, size:rawFrame.size, value };
            }
        case "SYLT": {
                const e = fscn.extract(1)[0];
                fscn.increment(1);
                const language = Array.from(fscn.extract(3));
                fscn.increment(3);
                const timestampFormat = fscn.extract(1)[0];
                fscn.increment(1);
                const type = fscn.extract(1)[0];
                fscn.increment(1);
                const [dl, description] = extractStr(fscn.remaining(), e);
                fscn.increment(dl);
                /** @type {[string, number][]} */
                const value = [];
                while (fscn.scanned<fscn.Uint.byteLength) {
                    const [sl,str] = extractStr(fscn.remaining(), e);
                    fscn.increment(sl);
                    const num = (fscn.extract(4)[0] << 24) + (fscn.extract(4)[1] << 16) + (fscn.extract(4)[2] << 8) + fscn.extract(4)[3];
                    fscn.increment(4);
                    value.push([str, num]);
                }
                return { name:rawFrame.name, size:rawFrame.size, value, language, timestampFormat, type, description };
            }
        case "STCO": {
                const timeStampFormat = fscn.extract(1)[0];
                fscn.increment(1);
                /** @type {{ tempo: number, timestamp: number }[]} */
                const value = [];
                while (fscn.scanned < fscn.Uint.byteLength) {
                    const tempo = fscn.extract(1)[0];
                    fscn.increment(1);
                    const timestamp = (fscn.extract(4)[0] << 24) | (fscn.extract(4)[1] << 16) | (fscn.extract(4)[2] << 8) | fscn.extract(4)[3];
                    fscn.increment(4);
                    value.push({ tempo, timestamp });
                }
                return { name: rawFrame.name, size: rawFrame.size, value };
            }
        case "MLLT": {
                const fBRBytes = fscn.extract(2); fscn.increment(2);
                const framesBetweenReference = (fBRBytes[0] << 8) | fBRBytes[1];
                const bBRBytes = fscn.extract(3); fscn.increment(3);
                const bytesBetweenReference = (bBRBytes[0] << 16) | (bBRBytes[1] << 8) | bBRBytes[2];
                const mBRBytes = fscn.extract(3); fscn.increment(3);
                const millisecondsBetweenReference = (mBRBytes[0] << 16) | (mBRBytes[1] << 8) | mBRBytes[2];
                const devianceBits = fscn.extract(1)[0]; fscn.increment(1);
                fscn.increment(2); // skip bitsForBytes & bitsForMillis
                /** @type {number[]} */
                const deviations = [];
                const rem = fscn.remaining();
                fscn.increment(rem.byteLength);
                return { name: rawFrame.name, size: rawFrame.size, framesBetweenReference, bytesBetweenReference, millisecondsBetweenReference, devianceBits, deviations };
            }
        case "RVAD": {
                const flags = fscn.extract(1)[0];
                fscn.increment(1);
                const increment = (flags & 0x01) !== 0;
                const bitsUsed = (flags >> 1) & 0x07;
                /** @type {Array<{ channel: number, volumeChange: number, peakVolume?: Uint8Array | ArrayLike<number> }>} */
                const channels = [];
                const value = { increment, bitsUsed, channels };
                const rem = fscn.remaining();
                fscn.increment(rem.byteLength);
                return { name: rawFrame.name, size: rawFrame.size, value };
            }
        case "RBUF": {
                const bBytes = fscn.extract(3);
                fscn.increment(3);
                const bufferSize = (bBytes[0] << 16) | (bBytes[1] << 8) | bBytes[2];
                const flagBytes = fscn.extract(1)[0];
                fscn.increment(1);
                const embeddedInfoFlag = (flagBytes & 0x02) !== 0;
                const oBytes = fscn.extract(4);
                fscn.increment(4);
                const offsetToNextTag = (oBytes[0] << 24) | (oBytes[1] << 16) | (oBytes[2] << 8) | oBytes[3];
                return { name: rawFrame.name, size: rawFrame.size, bufferSize, embeddedInfoFlag, offsetToNextTag };
            }
        case "EQUA": {
                const adjustmentBits = fscn.extract(1)[0];
                fscn.increment(1);
                /** @type {{ adjustment: number, frequency: number }[]} */
                const value = [];
                while (fscn.scanned < fscn.Uint.byteLength) {
                    const freqBytes = fscn.extract(2);
                    fscn.increment(2);
                    const frequency = ((freqBytes[0] & 0x7F) << 8) | freqBytes[1];
                    const inc = (freqBytes[0] & 0x80) !== 0;
                    const adjBytesLen = Math.ceil(adjustmentBits / 8);
                    const adjBytes = fscn.extract(adjBytesLen);
                    fscn.increment(adjBytesLen);
                    let adjustment = 0;
                    for (let i = 0; i < adjBytesLen; i++) {
                        adjustment = (adjustment << 8) | adjBytes[i];
                    }
                    if (!inc) adjustment = -adjustment;
                    value.push({ adjustment, frequency });
                }
                return { name: rawFrame.name, size: rawFrame.size, value };
            }
        case "ETCO": {
                const timeStampFormat = fscn.extract(1)[0];
                fscn.increment(1);
                /** @type {{ type: number, timestamp: number }[]} */
                const value = [];
                while (fscn.scanned < fscn.Uint.byteLength) {
                    const type = fscn.extract(1)[0];
                    fscn.increment(1);
                    const timestamp = (fscn.extract(4)[0] << 24) | (fscn.extract(4)[1] << 16) | (fscn.extract(4)[2] << 8) | fscn.extract(4)[3];
                    fscn.increment(4);
                    value.push({ type, timestamp });
                }
                return { name: rawFrame.name, size: rawFrame.size, value };
            }
        case "GEOB": {
                const e = fscn.extract(1)[0];
                fscn.increment(1);
                const [ml, mimeType] = extractStr(fscn.remaining(), 0);
                fscn.increment(ml);
                const [fl, filename] = extractStr(fscn.remaining(), e);
                fscn.increment(fl);
                const [dl, description] = extractStr(fscn.remaining(), e);
                fscn.increment(dl);
                const value = fscn.remaining();
                fscn.increment(value.byteLength);
                return { name: rawFrame.name, size: rawFrame.size, value, mimeType, filename, description };
            }
        case "MCDI": {
                const value = fscn.remaining();
                fscn.increment(value.byteLength);
                return { name: rawFrame.name, size: rawFrame.size, value };
            }
        default:
            /** @type {undefined} */
            const u = rawFrame.name;
            console.warn(`Unsupported frame ${u}.`);
            return null;
    }
}
/**
 * @param {Uint8Array} uint8
 */
function removeTags(uint8) {
    const scanner = newScanner(uint8);
    const isStart = scanner.verify(charCodes("ID3"));
    const isOldEnd = scanner.verify(charCodes("TAG"),scanner.Uint.length-128);
    const isNewEnd = scanner.verify(charCodes("3DI"),scanner.Uint.length-(isOldEnd?138:10));
    if ((isStart || isOldEnd || isNewEnd) && (uint8.byteLength < 10)) {
        throw new Error("Corrupted ID3 tag, file too small.");
    }
    let [newStart, newEnd] = [0, uint8.byteLength];
    if (isStart) {
        if (uint8.byteLength < 10) throw new Error("Invalid ID3v2 tag");
        const sizeBits = scanner.extract(4, 6),
        size = (sizeBits[0] << 21) + (sizeBits[1] << 14) + (sizeBits[2] << 7) + sizeBits[3] + 10;
        newStart = size;
    }
    if (isOldEnd) {
        if (uint8.byteLength < 128) throw new Error("Invalid ID3v1 tag");
        newEnd -= 128;
    }
    if (isNewEnd) {
        if (uint8.byteLength < 10) throw new Error("Invalid ID3v2 tag");
        const sizeBits = scanner.extract(4, newEnd - 6),
        size = (sizeBits[0] << 21) + (sizeBits[1] << 14) + (sizeBits[2] << 7) + sizeBits[3] + 10;
        newEnd -= size;
    }
    if (newStart >= newEnd) throw new Error("Corrupted ID3 tag, file too small for detected tags.");
    return uint8.slice(newStart, newEnd);
}
/**
 * @template {ID3FrameType} K
 * @param {ID3FrameArg} dummyFrame 
 * @returns {ID3Frame}
 */
function genFrame(dummyFrame) {
    switch (dummyFrame.type) {
        case "TPE1": case "TCOM": case "TCON": {
            if (!Array.isArray(dummyFrame.data)) throw new Error(`${dummyFrame.type} frame value should be an array of strings`);
            return _genStringFrame(dummyFrame.type, dummyFrame.data.join("TCON" === dummyFrame.type ? ";" : " / "));
        }
        case "TLAN": case "TIT1": case "TIT2": case "TIT3": case "TALB": case "TPE2": case "TPE3": case "TPE4": case "TRCK": case "TPOS": case "TMED": case "TPUB": case "TCOP": case "TKEY": case "TEXT": case "TDAT": case "TCMP": case "TSSE": case "TSRC":
            return _genStringFrame(dummyFrame.type, dummyFrame.data);
        case "TBPM": case "TLEN": case "TYER":
            return _genIntegerFrame(dummyFrame.type, dummyFrame.data);
        case "USLT": 
            if (dummyFrame.data.language = dummyFrame.data.language || "eng", "object" != typeof dummyFrame.data || !("description" in dummyFrame.data) || !("lyrics" in dummyFrame.data)) throw new Error("USLT frame value should be an object with keys description and lyrics");
            if (dummyFrame.data.language && !dummyFrame.data.language.match(/[a-z]{3}/i)) throw new Error("Language must be coded following the ISO 639-2 standards");
            return _genLyricsFrame(dummyFrame.data.language, dummyFrame.data.description || "", dummyFrame.data.lyrics);
        case "APIC":
            if ("object" != typeof dummyFrame.data || !("cropMode" in dummyFrame.data) || !("data" in dummyFrame.data) || !("description" in dummyFrame.data)) throw new Error("APIC frame value should be an object with keys type, data and description");
            if (dummyFrame.data.cropMode < 0 || dummyFrame.data.cropMode > 20) throw new Error("Incorrect APIC frame picture type");
            return _genPictureFrame(dummyFrame.data.cropMode, dummyFrame.data.data, dummyFrame.data.description || "", !!dummyFrame.data.useUnicodeEncoding);
        case "TXXX": 
            if ("object" != typeof dummyFrame.data || !("description" in dummyFrame.data) || !("value" in dummyFrame.data)) throw new Error("TXXX frame value should be an object with keys description and value");
            return _genUserStringFrame(dummyFrame.data.description || "", dummyFrame.data.value);
        case "WCOM": case "WCOP": case "WOAF": case "WOAR": case "WOAS": case "WORS": case "WPAY": case "WPUB": 
            return _genUrlLinkFrame(dummyFrame.type, dummyFrame.data);
        case "COMM": 
            if (dummyFrame.data.language = dummyFrame.data.language || "eng", "object" != typeof dummyFrame.data || !("description" in dummyFrame.data) || !("text" in dummyFrame.data)) throw new Error("COMM frame value should be an object with keys description and text");
            if (dummyFrame.data.language && !dummyFrame.data.language.match(/[a-z]{3}/i)) throw new Error("Language must be coded following the ISO 639-2 standards");
            return _genCommentFrame(dummyFrame.data.language, dummyFrame.data.description || "", dummyFrame.data.text);
        case "PRIV": 
            if ("object" != typeof dummyFrame.data || !("id" in dummyFrame.data) || !("data" in dummyFrame.data)) throw new Error("PRIV frame value should be an object with keys id and data");
            return _genPrivateFrame(dummyFrame.data.id, dummyFrame.data.data);
        case "IPLS": 
            if (!Array.isArray(dummyFrame.data) || !Array.isArray(dummyFrame.data[0])) throw new Error("IPLS frame value should be an array of pairs");
            return _genPairedTextFrame(dummyFrame.type, dummyFrame.data);
        case "SYLT": 
            if ("object" != typeof dummyFrame.data || !("type" in dummyFrame.data) || !("text" in dummyFrame.data) || !("timestampFormat" in dummyFrame.data)) throw new Error("SYLT frame value should be an object with keys type, text and timestampFormat");
            if (!Array.isArray(dummyFrame.data.text) || !Array.isArray(dummyFrame.data.text[0])) throw new Error("SYLT frame text value should be an array of pairs");
            if (dummyFrame.data.type < 0 || dummyFrame.data.type > 6) throw new Error("Incorrect SYLT frame content type");
            if (dummyFrame.data.timestampFormat < 1 || dummyFrame.data.timestampFormat > 2) throw new Error("Incorrect SYLT frame time stamp format");
            return _genSynchronisedLyricsFrame(dummyFrame.data.type, dummyFrame.data.text, dummyFrame.data.timestampFormat, dummyFrame.data.language || "eng", dummyFrame.data.description || "");
        // @ts-ignore
        default: throw new Error(`Unsupported frame ${dummyFrame.type}`)
    }
}
/**
 * @template {ID3FrameType} K
 * @param {K} frameType
 * @param {string | number} value
 * @returns {{name:K}&integerFrame}
 */
function _genIntegerFrame(frameType, value) {
    const a=parseInt(value + "",10);
    return { name: frameType, value: a, size: plusTextHeader(a.toString().length) };
}
/**
 * @template {ID3FrameType} T
 * @param {T} frameType
 * @param {string} value
 * @returns {{name:T}&stringFrame}
 */
function _genStringFrame(frameType, value) {
    const a = value.toString();
    return { name: frameType, value: a, size: (frameType === "TDAT") ? 13+2*a.length : plusTextHeader(a.length)};
}
/**
 * @param {number} cropMode
 * @param {string} description
 * @param {Uint8Array | ArrayLike<number>} data
 * @param {boolean} useUnicode
 * @returns {ID3Frames["APIC"]}
 */
function _genPictureFrame(cropMode, data, description, useUnicode) {
    if (!data || !data.length) throw new Error("No Picture Data in APIC frame.");
    description = description.toString();
    const mimes = [ { mime:"image/webp",   offset:8, magic:[87, 69, 66, 80]},
                    { mime:"image/jpeg",   offset:0, magic:[255, 216, 255]},
                    { mime:"image/png",    offset:0, magic:[137, 80, 78, 71]},
                    { mime:"image/gif",    offset:0, magic:[71, 73, 70]},
                    { mime:"image/tiff",   offset:0, magic:[73, 73, 42, 0]},
                    { mime:"image/tiff",   offset:0, magic:[77, 77, 0, 42]},
                    { mime:"image/x-icon", offset:0, magic:[0, 0, 1, 0]},
                    { mime:"image/bmp",    offset:0, magic:[66, 77]}];
    const mimeType = mimes.find(mime=>mime.magic.every((v,i)=>data[i+mime.offset]===v))?.mime;
    if (!mimeType) {throw new Error("Unknown picture MIME type");}
    description || (useUnicode = !1);
    if (!("byteLength" in data)) throw new Error("Picture frame data must be an Uint8Array or ArrayLike<number>");
    return { name: "APIC", value: data, cropMode, mimeType, useUnicodeEncoding: useUnicode, description, size: pictureFrameSize(data.byteLength, mimeType.length, description.length, useUnicode) };
}
/**
 * @param {string} e
 * @param {string} t
 * @param {string} a
 * @returns {ID3Frames["USLT"]}
 */
function _genLyricsFrame(e, t, a) {
    const r = e.split("").map(e => e.charCodeAt(0)), n = t.toString(), s = a.toString();
    var i, c;
    return { name: "USLT", value: s, language: r, description: n, size: (i = n.length, c = s.length, 16 + 2 * i + 2 + 2 + 2 * c) };
}
/**
 * @param {string} e
 * @param {string} t
 * @param {string} a
 * @returns {ID3Frames["COMM"]}
 */
function _genCommentFrame(e, t, a) {
    const r = e.split("").map(e => e.charCodeAt(0)), n = t.toString(), s = a.toString();
    var i, c;
    return { name: "COMM", value: s, language: r, description: n, size: (i = n.length, c = s.length, 16 + 2 * i + 2 + 2 + 2 * c) }
}
/**
 * @param {string} e
 * @param {Uint8Array | ArrayLike<number>} t
 * @returns {ID3Frames["PRIV"]}
 */
function _genPrivateFrame(e, t) {
    const a = e.toString();
    if (!('byteLength' in t)) throw new Error("Private frame data must be an Uint8Array or ArrayLike<number>");
    return { name: "PRIV", value: t, id: a, size: 10 + a.length + 1 + t.byteLength }
}
/**
 * @param {string} e
 * @param {string} t
 * @returns {ID3Frames["TXXX"]}
 */
function _genUserStringFrame(e, t) {
    const a = e.toString(), r = t.toString();
    var n, s;
    return { name: "TXXX", description: a, value: r, size: (n = a.length, s = r.length, 13 + 2 * n + 2 + 2 + 2 * s) }
}
/**
 * @template {ID3FrameType} V
 * @param {V} e
 * @param {string} t
 * @returns {{name:V}&stringFrame}
 */
function _genUrlLinkFrame(e, t) {
    const a = t.toString();
    return { name: e, value: a, size: 10 + a.length }
}
/**
 * @param {"IPLS"} e
 * @param {[string, number][]} t
 */
function _genPairedTextFrame(e, t) {
    return { name: e, value: t, size: pairedTextFrameSize(t) }
}
/**
 * @param {number} e
 * @param {[string, number][]} t
 * @param {number} a
 * @param {string} r
 * @param {string} n
 * @returns {ID3Frames["SYLT"]}
 */
function _genSynchronisedLyricsFrame(e, t, a, r, n) {
    const s = n.toString(), i = r.split("").map(e => e.charCodeAt(0));
    return { name: "SYLT", value: t, language: i, description: s, type: e, timestampFormat: a, size: syncLyricsFrameSize(t, s.length) }
}
class Id3Editor {
    /** @type {Uint8Array} */
    uint8;
    /** @type {number} */
    padding = 4096;
    /** @type {ID3Frame[]} */
    frames = [];
    /** @type {string} */
    url = "";
    /**
     * @param {ArrayBuffer|Uint8Array} data
     */
    constructor(data) {
        if (!data || "object" != typeof data || !("byteLength" in data)) throw new Error("First argument should be an instance of ArrayBuffer or Uint8Array");
        this.uint8 = new Uint8Array(data);
        this.frames = readTag(this.uint8).frames;
    }
    clearFrames() {
        this.frames = [];
    }
    // /**
    //  * Set a frame in the ID3 tag.
    //  * @template {ID3FrameType} K
    //  * @param {K} key 
    //  * @param {ID3FrameMap[K]['arg']} value
    //  * @returns {Id3Editor}
    //  */
    /**
     * Set a frame in the ID3 tag.
     * @param {ID3FrameArg} dummyFrame 
     * @returns {Id3Editor}
     */
    setFrame(dummyFrame) {
        this.frames.push(genFrame(dummyFrame));
        return this
    }
    addTag() {
        this.uint8 = removeTags(this.uint8);
        const totalTagLength = 10 + this.frames.reduce((sum, frame) => sum + frame.size, 0) + this.padding;
        /** @type {(number[]|Uint8Array)[]} */
        const newUintParts = [];
        let c = 0; 
        function write (/** @type {number[]|Uint8Array} */set) {
            newUintParts.push(set);
        }
        write(charCodes("ID3\x04"));//Header
        write([0,0]);//FrameFlags (0's)
        write(((bodyLength) => {
            const t = 127;return [bodyLength >>> 21 & t, bodyLength >>> 14 & t, bodyLength >>> 7 & t, bodyLength & t];
        })(totalTagLength - 10));//length, encoded        
        const frames = this.frames.map(buildFrame);
        frames.forEach(f=>write(f));
        frames.forEach(f=>c+=f.byteLength);
        write(new Array(this.padding).fill(0));
        write(this.uint8);
        const newUintPartsAllUint = newUintParts.map(v=>new Uint8Array(v));
        const len = newUintPartsAllUint.reduce((p,c)=>p+c.byteLength,0);
        this.uint8 = newUintPartsAllUint.reduce((p,c)=>{p.uInt.set(c,p.c);p.c+=c.byteLength;return p;},{uInt:new Uint8Array(len),c:0}).uInt;
        return this.uint8;
    }
    
    getBlob() {
        return new Blob([this.uint8.slice().buffer], {
            type: "audio/mpeg"
        }
        )
    }
    getArrayBuffer() {
        return this.uint8.slice().buffer;
    }
    getURL() {
        return this.url || (this.url = URL.createObjectURL(this.getBlob())), this.url
    }
    revokeURL() {
        URL.revokeObjectURL(this.url)
    }

}
export {
    Id3Editor as Id3Editor,
    charCodes,
    strToBytes,
    extractStr,
    bytesToStr,
    intToBytes,
    plusTextHeader,
    pictureFrameSize,
    pairedTextFrameSize,
    syncLyricsFrameSize,
    newScanner,
    readTag,
    _readID3v2,
    _readID3v1,
    _readID3v2point4,
    _parseID3v2Frames,
    parseFrame,
    removeTags,
    buildFrame as genFrame,
    _genIntegerFrame,
    _genStringFrame,
    _genPictureFrame,
    _genLyricsFrame,
    _genCommentFrame,
    _genPrivateFrame,
    _genUserStringFrame,
    _genUrlLinkFrame,
    _genPairedTextFrame,
    _genSynchronisedLyricsFrame
};
