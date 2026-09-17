// @ts-check
// (re)written by ChainSword20000
// made with:
// alot of thought and hours and typing,
// a bit of inspiration,
// a base from https://www.npmjs.com/package/browser-id3-writer, completely refactored and rewritten if you couldn't tell,
// some suggestions and debugging with Gemini & Copilot - both with free limits - suggestions usually manually applied
// the id3v2 references in https://github.com/taglib/taglib/blob/master/taglib/mpeg/id3v2/
// which containing repository has the library I used instead,
// which handles more tags and still works in both browser and node.js in its webassembly version.
// I still got this to a stable, functional state before switching, just for you, future user.
// unless something has happened, this should be available at https://github.com/j-romchain/anywhere-js-id3
// I, ChainSword20000, grant my non-revokable permission to do whatever you like with this.
// My, (ChainSword20000's) permission does not supersede any other permissions which may be required.
// I, ChainSword20000, do not garauntee, at all, in any way, this.
// This code is as-is, use expressly at your own risk.

// BEWARE: the spread (...) operator causes stack overflows with big arguments, 
// so a 50000 item cover image ArrayBuffer or Uint8Array will crash with no error if you use it.
/** 
 * @typedef {Object} ID3FrameMap
 * @property {{desc:"song artists",arg:{type:"TPE1",                                     data:string[]}      }} TPE1
 * @property {{desc:"song composers",arg:{type:"TCOM",                                   data:string[]}      }} TCOM
 * @property {{desc:"song genres",arg:{type:"TCON",                                      data:string[]}      }} TCON
 * @property {{desc:"language",arg:{type:"TLAN",                                         data:string}        }} TLAN
 * @property {{desc:"content group description",arg:{type:"TIT1",                        data:string}        }} TIT1
 * @property {{desc:"song title",arg:{type:"TIT2",                                       data:string}        }} TIT2
 * @property {{desc:"song subtitle",arg:{type:"TIT3",                                    data:string}        }} TIT3
 * @property {{desc:"album title",arg:{type:"TALB",                                      data:string}        }} TALB
 * @property {{desc:"Encoder Company",arg:{type:"TENC",                                  data:string}        }} TENC
 * @property {{desc:"recording time",arg:{type:"TDRC",                                   data:string}        }} TDRC
 * @property {{desc:"album artist",arg:{type:"TPE2",                                     data:string}        }} TPE2
 * @property {{desc:"conductor/performer refinement",arg:{type:"TPE3",                   data:string}        }} TPE3
 * @property {{desc:"interpreted, remixed, or otherwise modified by",arg:{type:"TPE4",   data:string}        }} TPE4
 * @property {{desc:"song number in album",arg:{type:"TRCK",                             data:string}        }} TRCK
 * @property {{desc:"album disc number",arg:{type:"TPOS",                                data:string}        }} TPOS
 * @property {{desc:"label name",arg:{type:"TPUB",                                       data:string}        }} TPUB
 * @property {{desc:"initial key",arg:{type:"TKEY",                                      data:string}        }} TKEY
 * @property {{desc:"media type",arg:{type:"TMED",                                       data:string}        }} TMED
 * @property {{desc:"album release date expressed as 'DDMM'",arg:{type:"TDAT",           data:string}        }} TDAT
 * @property {{desc:"isrc - international standard recording code",arg:{type:"TSRC",     data:string}        }} TSRC
 * @property {{desc:"software/hardware and settings used for encoding",arg:{type:"TSSE", data:string}        }} TSSE
 * @property {{desc:"copyright message",arg:{type:"TCOP",                                data:string}        }} TCOP
 * @property {{desc:"iTunes compilation flag",arg:{type:"TCMP",                          data:string}        }} TCMP
 * @property {{desc:"lyricist / text writer",arg:{type:"TEXT",                           data:string}        }} TEXT
 * @property {{desc:"commercial information",arg:{type:"WCOM",                           data:string}        }} WCOM
 * @property {{desc:"copyright/Legal information",arg:{type:"WCOP",                      data:string}        }} WCOP
 * @property {{desc:"official audio file webpage",arg:{type:"WOAF",                      data:string}        }} WOAF
 * @property {{desc:"official artist/performer webpage",arg:{type:"WOAR",                data:string}        }} WOAR
 * @property {{desc:"official audio source webpage",arg:{type:"WOAS",                    data:string}        }} WOAS
 * @property {{desc:"official internet radio station homepage",arg:{type:"WORS",         data:string}        }} WORS
 * @property {{desc:"payment",arg:{type:"WPAY",                                          data:string}        }} WPAY
 * @property {{desc:"publishers official webpage",arg:{type:"WPUB",                      data:string}        }} WPUB
 * @property {{desc:"song duration in milliseconds",arg:{type:"TLEN",                    data:number}        }} TLEN
 * @property {{desc:"album release year",arg:{type:"TYER",                               data:number}        }} TYER
 * @property {{desc:"beats per minute",arg:{type:"TBPM",                                 data:number}        }} TBPM
 * @property {{desc:"play counter",arg:{type:"PCNT",                                     data:number}        }} PCNT
 * @property {{desc:"recommended buffer size",arg:{type:"RBUF",                          data:{bufferSize:number,embeddedInfoFlag:boolean,offsetToNextTag:number}}                                 }} RBUF
 * @property {{desc:"equalisation",arg:{type:"EQUA",                                     data:Array<{adjustment:number,frequency:number}>}                                                         }} EQUA
 * @property {{desc:"event timing codes",arg:{type:"ETCO",                               data:Array<{type:number,timestamp:number}>}                                                               }} ETCO
 * @property {{desc:"general encapsulated object",arg:{type:"GEOB",                      data:{mimeType:string,filename:string,description:string,data:Uint8Array|ArrayLike<number>}}              }} GEOB
 * @property {{desc:"music cd identifier",arg:{type:"MCDI",                              data:Uint8Array|ArrayLike<number>}                                                                        }} MCDI
 * @property {{desc:"synced tempo codes",arg:{type:"STCO",                               data:Array<{tempo:number,timestamp:number}>}                                                              }} STCO
 * @property {{desc:"unique file identifier",arg:{type:"UFID",                           data:{id:string,identifier:Uint8Array|ArrayLike<number>}}                                                 }} UFID
 * @property {{desc:"user defined url link frame",arg:{type:"WXXX",                      data:{description:string,url:string}}                                                                     }} WXXX
 * @property {{desc:"comments",arg:{type:"COMM",                                         data:{description?:string,text:string,language?:string}}                                                  }} COMM
 * @property {{desc:"unsychronised lyrics",arg:{type:"USLT",                             data:{description?:string,lyrics:string,language?:string}}                                                }} USLT
 * @property {{desc:"involved people list",arg:{type:"IPLS",                             data:[string, number][]}                                                                                  }} IPLS
 * @property {{desc:"synchronised lyrics",arg:{type:"SYLT",                              data:{type:number,text:[string,number][],timestampFormat:number,language?:string,description?:string}}    }} SYLT
 * @property {{desc:"user defined text",arg:{type:"TXXX",                                data:{description?:string,text:string}}                                                                   }} TXXX
 * @property {{desc:"private frame",arg:{type:"PRIV",                                    data:{id:string,data:Uint8Array | ArrayLike<number>}}                                                     }} PRIV
 * @property {{desc:"attached picture",arg:{type:"APIC",                                 data:{cropMode:number,data:Uint8Array,description?:string,useUnicodeEncoding?:boolean,mimeType:string}}   }} APIC
 * @property {{desc:"mpeg location lookup table",arg:{type:"MLLT",                       data:{framesBetweenReference:number,bytesBetweenReference:number,millisecondsBetweenReference:number,devianceBits:number,deviations:number[]}}         }} MLLT
 * @property {{desc:"relative volume adjustment",arg:{type:"RVAD",                       data:{increment:boolean, bitsUsed:number, channels: Array<{channel: number, volumeChange: number, peakVolume?: Uint8Array | ArrayLike<number>}>}}      }} RVAD
 */
/** @typedef {keyof ID3FrameMap} ID3FrameType */
/** @typedef {ID3FrameMap[ID3FrameType]['arg']} ID3FrameArg */
/** @typedef {{ [K in ID3FrameType]: ID3FrameMap[K]['arg']; }} ID3FrameArgs */
/** @typedef {{ [K in ID3FrameType]: ID3FrameMap[K]['desc']; }} ID3FrameDescriptions */

/** @typedef {{ type: ID3FrameType, raw: Uint8Array }} ComposedFrame */
/** @typedef {ID3FrameArg} UnComposedFrame */
/** @typedef {UnComposedFrame} DecomposedFrame */

/**
 * Takes a wide object type and distributes its string-union `type` into a true discriminated union.
 * @template T
 * @typedef {T extends { type: infer U, data: infer D } ? (U extends any ? { type: U, data: D } : never) : never} DistributeFrame
 */
const compose = {
    /**
     * @typedef {Object} shortComposer
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
     * @returns {shortComposer}
     */
    newShortComposer() {
        /** @type {shortComposer} */
        const composer = {
            building: [],
            cursorPos: 0,
            built: ()=>composer.building.length,
            write: (set) => {
                if (composer.cursorPos===composer.building.length){
                    set.forEach(v=>composer.building.push(v));
                    composer.cursorPos+=set.length;
                    return true;
                }
                composer.building=composer.building.slice(0,composer.cursorPos).concat(set).concat(composer.building.slice(composer.cursorPos));
                composer.cursorPos+=set.length;
                return true;
            },
            overWrite: (set) => {
                    composer.building=composer.building.slice(0,composer.cursorPos).concat(set).concat(composer.building.slice(composer.cursorPos+set.length));
                    composer.cursorPos+=set.length;
                    return true;
                },
            write0s: (n) => composer.overWrite(new Array(n).fill(0)),
            setWritePos: (n) => composer.cursorPos = n,
            toStart: () => composer.cursorPos = 0,
            toEnd: () => composer.cursorPos = composer.built.length,
            jumpAhead: (n) => composer.cursorPos = Math.min(composer.cursorPos+n,composer.built.length),
            jumpBack: (n) => composer.cursorPos = Math.max(composer.cursorPos-n,0),
            result: () => new Uint8Array(composer.building)
        };
        return composer;
    },    
    /**
     * @typedef {Object} longComposer
     * @property {Uint8Array[]} parts
     * @property {(set: Uint8Array) => void} prepend
     * @property {(set: Uint8Array) => void} append
     * @property {(set: Uint8Array) => void} write
     * @property {() => number} length
     * @property {() => Uint8Array} result
     * @returns {longComposer}
     */
    newLongComposer() {
        /** @type {longComposer} */
        const composer = {
            parts: [],
            prepend: (set) => {
                composer.parts.unshift(set);
            },
            append: (set) => {
                composer.parts.push(set);
            },
            write: (set)=>composer.append(set),
            length: ()=> composer.parts.reduce((sum,item)=>sum+item.byteLength,0),
            result: () => composer.parts.reduce((sum,item)=>{sum.uInt.set(item,sum.offset);sum.offset+=item.byteLength;return sum;},{uInt:new Uint8Array(composer.length()),offset:0}).uInt
        };
        return composer;
    },
    /**
     * @typedef {{misc?: {header?:EndPartArgs, extHeader?: ExtHeaderArgs, padding?:number, footer?:EndPartArgs},  frames?:(UnComposedFrame | ComposedFrame)[]}} TaggingArgs
     * @param {TaggingArgs} data
     * @param {Uint8Array} [mp3]
     * @returns {Uint8Array}
     */
    Id3Tag(data, mp3) {
        const noHeaderComposer = compose.newLongComposer();
        noHeaderComposer.write(data.misc?.extHeader ? compose.tagParts.composeExtHeader(data.misc?.extHeader):new Uint8Array());
        /** @type {ComposedFrame[]} */
        const composedFramesList = data.frames?.map(v=>"raw" in v ? v:compose.tagParts.composeFrame(v)) ?? [];
        composedFramesList.forEach(v=>noHeaderComposer.write(v.raw));
        const paddingSize = data.misc?.padding ?? 2048;
        noHeaderComposer.write(new Uint8Array(paddingSize));
        const noHeader = noHeaderComposer.result();
        const fullComposer = compose.newLongComposer();
        fullComposer.write(compose.tagParts.composeHeader({...(data.misc?.header ? data.misc.header:{}), size:noHeader.byteLength}));
        fullComposer.write(noHeader);
        data.misc?.footer && fullComposer.write(compose.tagParts.composeFooter({...(data.misc?.footer ? data.misc.footer:{}), size:noHeader.byteLength}));
        fullComposer.write(mp3 ?? new Uint8Array());
        return fullComposer.result();
    },
    tagParts: {
        basics: {
            primative: {
                /**
                 * @param {string} t
                 * @param {number} [e] encoding
                 * @param {boolean} [eof] append the end byte(s)
                 * @returns {number[]}
                 */
                strToBytes(t,e=0,eof=true) {
                    switch (e) {
                        case 0:
                            return t.split("").map(c=>c.charCodeAt(0) & 0xFF).concat(eof?[0]:[]);
                        case 1:
                            return [0xFF, 0xFE].concat(t.split("").flatMap(c=>[c.charCodeAt(0) & 0xFF,(c.charCodeAt(0) >> 8) & 0xFF])).concat(eof?[0,0]:[]);
                        case 2:
                            return [0xFE, 0xFF].concat(t.split("").flatMap(c=>[(c.charCodeAt(0) >> 8) & 0xFF,c.charCodeAt(0) & 0xFF])).concat(eof?[0,0]:[]);
                        case 3:
                            return Array.from(new TextEncoder().encode(t+(eof?"\0":"")));
                        default:
                            throw Error("Encoding Bit Not Valid:'" + e + "'");
                    }
                },
                /**
                 * @param {number} e
                 */
                intToBytes(e) {
                    const t = 255;
                    return [e >>> 24 & t, e >>> 16 & t, e >>> 8 & t, e & t]
                }
            },
            /**
             * @typedef EndPartFlagsArg
             * @property {boolean} isUnsync
             * @property {boolean} isExtended
             * @property {boolean} isExpirimental
             * @property {boolean} hasFooter
             * @property {number} unknownFlag
             * @typedef EndPartArgs
             * @property {string} [magic]
             * @property {number} [version]
             * @property {number} [revision]
             * @property {number | EndPartFlagsArg} [flags]
             * @property {number} size
             */
            /**
             * @param {EndPartArgs} header
             * @param {boolean} [isFooter]
             * @returns {Uint8Array}
             */
            composeEndPart(header,isFooter) {
                const composer = compose.newShortComposer();
                composer.write(this.primative.strToBytes(header.magic ?? isFooter ? "3DI":"ID3",0,false));
                composer.write([header.version ?? 4, header.revision ?? 0]);
                const flagByte = (typeof header.flags === "number") ? header.flags : (
                    (header.flags?.isUnsync ? 0x80 : 0) |       // Bit 7: Unsynchronisation
                    (header.flags?.isExtended ? 0x40 : 0) |     // Bit 6: Extended header
                    (header.flags?.isExpirimental ? 0x20 : 0) | // Bit 5: Experimental
                    (header.flags?.hasFooter ? 0x10 : 0) |      // Bit 4: Footer present
                    ((header.flags?.unknownFlag ?? 0) & 0x0F)   // Bits 3-0: Reserved/Unknown
                );
                composer.write([flagByte]);
                composer.write([header.size >>> 21 & 127, header.size >>> 14 & 127, header.size >>> 7 & 127, header.size & 127]);
                return composer.result();
            }

        },
        /**
         * @param {EndPartArgs} header
         * @returns {Uint8Array}
         */
        composeHeader(header) {
            return this.basics.composeEndPart(header);
        },
        /**
         * @typedef ExtHeaderArgs
         * @property {number} size
         * @property {number} flagCount
         * @property {[Uint8Array]} flags // Todo
         */
        /**
         * @param {ExtHeaderArgs} extHeader
         * @returns {Uint8Array}
         */
        composeExtHeader(extHeader) {
            const composer = compose.newShortComposer();
            composer.write([extHeader.size >>> 21 & 127, extHeader.size >>> 14 & 127, extHeader.size >>> 7 & 127, extHeader.size & 127]);
            composer.write([extHeader.flagCount]);
            console.warn("Extended Headers are not yet fully supported.");
            composer.write(Array.from(extHeader.flags[0]));
            return composer.result();
        },
        /**
         * @param {UnComposedFrame} frame
         * @returns {ComposedFrame}
         */
        composeFrame(frame) {
            const composer = compose.newShortComposer();
            //see at bottom for header insertion
            composer.write([0,0]);//FrameFlags (0's)
            switch (frame.type) {
                case "TPE1": case "TDAT": case "TCOM": case "TCON": case "TLAN": case "TIT1": case "TIT2": case "TIT3": case "TALB": case "TPE2": case "TPE3": case "TPE4": case "TRCK": case "TPOS": case "TKEY": case "TMED": case "TPUB": case "TCOP": case "TEXT": case "TSSE": case "TSRC": case "TDRC": case "TENC": case "TCMP":
                    composer.write([1]);
                    const data = (frame.type === "TPE1") || (frame.type === "TCOM") || (frame.type === "TCON") ? 
                    frame.data.join("TCON" === frame.type ? ";" : " / "):
                    frame.data;
                    composer.write(this.basics.primative.strToBytes(data, 2));
                    break;
                case "WCOM": case "WCOP": case "WOAF": case "WOAR": case "WOAS": case "WORS": case "WPAY": case "WPUB":
                    composer.write(this.basics.primative.strToBytes(frame.data));
                    break;
                case "TXXX":  case "WXXX": case "USLT": case "COMM":
                    composer.write([1]);
                    if (frame.type === "USLT" || frame.type === "COMM") {
                        composer.write(this.basics.primative.strToBytes(frame.data.language??"eng",0,false));
                    }
                    composer.write(this.basics.primative.strToBytes(frame.data.description??"",1));
                    const text = frame.type==="WXXX"?frame.data.url:(frame.type==="USLT"?frame.data.lyrics:frame.data.text);
                    composer.write(this.basics.primative.strToBytes(text,(frame.type === "WXXX") ? 3:1));
                    break;
                case "TBPM": case "TLEN": case "TYER": case "PCNT":
                    composer.write([0]);
                    composer.write(this.basics.primative.strToBytes(frame.data+""));
                    break;
                case "PRIV": case "UFID":
                    composer.write(this.basics.primative.strToBytes(frame.data.id));
                    composer.write([0].concat(Array.from(frame.type==="PRIV"?frame.data.data:frame.data.identifier)));
                    break;
                case "APIC":
                    composer.write([frame.data.useUnicodeEncoding ? 1 : 0]);
                    composer.write(this.basics.primative.strToBytes(frame.data.mimeType));
                    composer.write([0, frame.data.cropMode]);
                    composer.write(this.basics.primative.strToBytes(frame.data.description ?? "",frame.data.useUnicodeEncoding?1:0));
                    composer.write(Array.from(frame.data.data));
                    break;
                case "IPLS":
                    composer.write([1])
                    frame.data.forEach((t) => {
                        composer.write(this.basics.primative.strToBytes(t[0].toString(),1));
                        composer.write(this.basics.primative.strToBytes(t[1].toString(),1));
                    });
                    break;
                case "SYLT": 
                    composer.write([1].concat(this.basics.primative.strToBytes(frame.data.language??"eng",0,false)).concat(frame.data.timestampFormat).concat(frame.data.type));
                    composer.write(this.basics.primative.strToBytes(frame.data.description+"",1));
                    frame.data.text.forEach((t) => {
                        composer.write(this.basics.primative.strToBytes(t[0].toString(),1));
                        composer.write(this.basics.primative.intToBytes(t[1]));
                    });
                    break;
                case "RBUF":
                    // bufferSize is 3 bytes, offsetToNextTag is 4 bytes, embeddedInfoFlag is 1 byte (bit 1)
                    composer.write([
                        (frame.data.bufferSize >>> 16) & 255,
                        (frame.data.bufferSize >>> 8) & 255,
                        frame.data.bufferSize & 255
                    ]);
                    composer.write([frame.data.embeddedInfoFlag ? 0x02 : 0]);
                    composer.write([
                        (frame.data.offsetToNextTag >>> 24) & 255,
                        (frame.data.offsetToNextTag >>> 16) & 255,
                        (frame.data.offsetToNextTag >>> 8) & 255,
                        frame.data.offsetToNextTag & 255
                    ]);
                    break;
                case "EQUA": {
                    composer.write([16]); // Defaulting to 16-bit adjustment resolution
                    frame.data.forEach(eq => {
                        const inc = eq.adjustment >= 0;
                        const adj = Math.abs(eq.adjustment);
                        // Frequency is 15 bits, high bit indicates increment/decrement flag
                        const freqHigh = ((eq.frequency >> 8) & 0x7F) | (inc ? 0x80 : 0x00);
                        const freqLow = eq.frequency & 0xFF;
                        composer.write([freqHigh, freqLow]);
                        // Writing 16-bit (2 bytes) adjustment
                        composer.write([(adj >> 8) & 0xFF, adj & 0xFF]);
                    });
                    break;
                }
                case "ETCO": {
                    composer.write([1]); // Time stamp format (1 = absolute time using milliseconds)
                    frame.data.forEach(item => {
                        composer.write([item.type]);
                        composer.write(this.basics.primative.intToBytes(item.timestamp));
                    });
                    break;
                }
                case "GEOB": {
                    composer.write([1]); // Text encoding (Unicode/UTF-8)
                    composer.write(this.basics.primative.strToBytes(frame.data.mimeType, 0)); // MIME type is Latin-1 encoded
                    composer.write(this.basics.primative.strToBytes(frame.data.filename, 1));
                    composer.write(this.basics.primative.strToBytes(frame.data.description, 1));
                    composer.write(Array.from(frame.data.data));
                    break;
                }
                case "MCDI": {
                    composer.write(Array.from(frame.data));
                    break;
                }
                case "STCO": {
                    composer.write([1]); // Time stamp format
                    frame.data.forEach(item => {
                        composer.write([item.tempo]);
                        composer.write(this.basics.primative.intToBytes(item.timestamp));
                    });
                    break;
                }
                case "MLLT": {
                    composer.write([
                        (frame.data.framesBetweenReference >> 8) & 0xFF,
                        frame.data.framesBetweenReference & 0xFF
                    ]);
                    composer.write([
                        (frame.data.bytesBetweenReference >> 16) & 0xFF,
                        (frame.data.bytesBetweenReference >> 8) & 0xFF,
                        frame.data.bytesBetweenReference & 0xFF
                    ]);
                    composer.write([
                        (frame.data.millisecondsBetweenReference >> 16) & 0xFF,
                        (frame.data.millisecondsBetweenReference >> 8) & 0xFF,
                        frame.data.millisecondsBetweenReference & 0xFF
                    ]);
                    composer.write([frame.data.devianceBits]);
                    composer.write([0, 0]); // placeholder skip for bitsForBytes & bitsForMillis
                    frame.data.deviations.forEach(dev => {
                        // Packing deviations based on devianceBits logic if needed, or writing raw
                        composer.write(this.basics.primative.intToBytes(dev));
                    });
                    break;
                }
                case "RVAD": {
                    const flags = (frame.data.increment ? 0x01 : 0) | ((frame.data.bitsUsed & 0x07) << 1);
                    composer.write([flags]);
                    // If channels are populated, serialize them out per spec requirements
                    frame.data.channels.forEach(ch => {
                        composer.write([ch.channel]);
                        composer.write([
                            (ch.volumeChange >> 8) & 0xFF,
                            ch.volumeChange & 0xFF
                        ]);
                        if (ch.peakVolume) {
                            composer.write(Array.from(ch.peakVolume));
                        }
                    });
                    break;
                }
                default:
                    throw new Error(`Unsupported frame ${JSON.stringify(frame)}`)
            }
            const size = composer.cursorPos;
            composer.toStart();
            composer.write(this.basics.primative.strToBytes(frame.type));//frame name, encoded
            composer.write([size-10 >>> 21 & 127, size-10 >>> 14 & 127, size-10 >>> 7 & 127, size-10 & 127]);//frame size, encoded
            // builder.write(this.basics.primative.intToBytes(frame.size - 10));
            return { type:frame.type, raw:composer.result() };
        },
        /**
         * @param {EndPartArgs} footer
         * @returns {Uint8Array}
         */
        composeFooter(footer) {
            return this.basics.composeEndPart(footer, true);
        }
        
    }
}
const decompose = {
    /**
     * @typedef {Object} decomposer
     * @property {Uint8Array} Uint
     * @property {number} scanned
     * @property {(set: ArrayLike<number>, depth?: number) => boolean} verify
     * @property {(n: number) => void} setpos
     * @property {(length: number, depth?: number) => Uint8Array} extract
     * @property {(length: number) => Uint8Array} extractrement
     * @property {(n: number) => void} increment
     * @property {() => void} reset
     * @property {(n: number) => void} backtrack
     * @property {() => Uint8Array} remaining
     * @param {Uint8Array} uint8
     * @returns {decomposer}
     */
    newDecomposer(uint8) {
        /** @type {decomposer} */
        const decomposer = {
            Uint: uint8,
            scanned: 0,
            verify: (set, depth) => decomposer.Uint.subarray(depth ?? decomposer.scanned, (depth ?? decomposer.scanned) + set.length).every((e, i) => e === set[i]),
            extract: (length, depth) => decomposer.Uint.subarray(depth ?? decomposer.scanned, (depth ?? decomposer.scanned) + length),
            extractrement: (length) => {decomposer.increment(length);return decomposer.Uint.subarray(decomposer.scanned - length,decomposer.scanned)},
            increment: (n) => { decomposer.scanned += n; },
            reset: () => { decomposer.scanned = 0; },
            setpos: (n) => { decomposer.scanned = n; },
            backtrack: (n) => { decomposer.scanned -= n; },
            remaining: () => decomposer.Uint.subarray(decomposer.scanned)
        };
        return decomposer;
    },
    /**
     * 
     * @param {Uint8Array} uint8
     * @returns {{ uncomposedFrames:UnComposedFrame[], composedFrames:ComposedFrame[], padding: number | undefined, remaining:Uint8Array }}
     */
    Id3Tag(uint8) {
        const start = this.tagTypes.ID3v2(uint8);
        const oldEnd = this.tagTypes.ID3v1(start?.remaining ?? uint8);
        const newEnd = this.tagTypes.ID3v2point4(oldEnd?.remaining ?? start?.remaining ?? uint8);
        const remaining = newEnd?.remaining ?? oldEnd?.remaining ?? start?.remaining ?? uint8;
        const uncomposedFrames = (start?.ucFrames ?? []).concat(oldEnd?.ucFrames ?? []).concat(newEnd?.ucFrames ?? []);
        const composedFrames = (start?.cFrames ?? []).concat(oldEnd?.cFrames ?? []).concat(newEnd?.cFrames ?? []);
        const padding = start?.misc.padding ?? newEnd?.misc.padding;
        return { uncomposedFrames, composedFrames, remaining, padding};
    },
    tagTypes: {
        /**
         * @param {Uint8Array} uint8 
         * @returns {{misc: {header:EndPart, extHeader:ExtHeader | null, padding:number, footer:EndPart | null},  ucFrames:UnComposedFrame[], cFrames:ComposedFrame[], remaining:Uint8Array} | null};
         */
        ID3v2(uint8) {
            if (uint8.byteLength<10) return null;
            const decomposer = decompose.newDecomposer(uint8);
            const header = decompose.tagParts.decomposeHeader(decomposer.extractrement(10));
            if (!header) return null;
            const extSize = header.flags.isExtended?((rs)=>(rs[0] << 21) + (rs[1] << 14) + (rs[2] << 7) + rs[3])(decomposer.extract(4)):0;
            const extHeader = (!header.flags.isExtended)?null:decompose.tagParts.decomposeExtHeader(decomposer.extractrement(extSize));
            const framesNPadding = decomposer.extract(header.size-extSize);
            const framesSize = Math.min(framesNPadding.findLastIndex(v=>v!==0)+2,framesNPadding.length);
            const rawFrames = decompose.tagParts.splitFrames(decomposer.extractrement(framesSize),header.version);
            const tryDecompose = rawFrames.map(v=>decompose.tagParts.decomposeFrame(v,header.version));
            const ucFrames = tryDecompose.filter(v=>"data" in v);
            const cFrames = tryDecompose.filter(v=>"raw" in v);
            const padding = framesNPadding.byteLength-framesSize;
            decomposer.increment(padding);
            const footer = header.flags.hasFooter ? decompose.tagParts.decomposeFooter(decomposer.extractrement(10)):null;
            const remaining = decomposer.remaining();
            return { misc:{header, extHeader, padding, footer}, cFrames, ucFrames, remaining };
        },
        /**
         * @param {Uint8Array} uint8 
         * @returns {{misc: {header:EndPart, extHeader:ExtHeader | null, padding:number, footer:EndPart | null},  ucFrames:UnComposedFrame[], cFrames:ComposedFrame[], remaining:Uint8Array} | null};
         */
        ID3v2point4(uint8) {
            if (uint8.byteLength<10) return null;
            const decomposer = decompose.newDecomposer(uint8);
            const isOldEnd = uint8.byteLength<128 ? false:decomposer.verify(compose.tagParts.basics.primative.strToBytes("TAG",0,false),uint8.byteLength-128);
            if (isOldEnd && uint8.byteLength<138) return null;
            decomposer.setpos(uint8.length-(isOldEnd?138:10));
            const footer = decompose.tagParts.decomposeFooter(decomposer.extractrement(10));
            if (!footer) return null;
            const startPos = decomposer.scanned-footer.size-20;
            if (startPos<0) return null;
            decomposer.setpos(startPos);
            const header = decompose.tagParts.decomposeHeader(decomposer.extractrement(10));
            if (!header) return null;
            const extSize = header.flags.isExtended?((rs)=>(rs[0] << 21) + (rs[1] << 14) + (rs[2] << 7) + rs[3])(decomposer.extract(4)):0;
            const extHeader = (!header.flags.isExtended)?null:decompose.tagParts.decomposeExtHeader(decomposer.extractrement(extSize));
            const framesNPadding = decomposer.extract(header.size-extSize);
            const framesSize = Math.min(framesNPadding.findLastIndex(v=>v!==0)+2,framesNPadding.length);
            const rawFrames = decompose.tagParts.splitFrames(decomposer.extractrement(framesSize),header.version);
            const tryDecompose = rawFrames.map(v=>decompose.tagParts.decomposeFrame(v,header.version));
            const ucFrames = tryDecompose.filter(v=>"data" in v);
            const cFrames = tryDecompose.filter(v=>"raw" in v);
            const padding = framesNPadding.byteLength-framesSize;
            decomposer.increment(padding);
            const remaining = uint8.slice(0, startPos);
            return { misc:{header, extHeader, padding, footer}, cFrames, ucFrames, remaining };
        },
        /**
         * @param {Uint8Array} uint8 
         * @returns {{ucFrames:UnComposedFrame[], cFrames:ComposedFrame[], remaining:Uint8Array} | null}
         */
        ID3v1(uint8) {
            if (uint8.byteLength<128) {return null;}
            const decomposer = decompose.newDecomposer(uint8);
            decomposer.setpos(uint8.length-128);
            if (!decomposer.verify(compose.tagParts.basics.primative.strToBytes("TAG",0,false),uint8.length-128)) {return null;}
            decomposer.increment(3);//"TAG"
            const title = decompose.tagParts.basics.primative.bytesToStr(decomposer.extract(30)).replace(/\0/g, "");
            decomposer.increment(30);
            const artist = decompose.tagParts.basics.primative.bytesToStr(decomposer.extract(30)).replace(/\0/g, "");
            decomposer.increment(30);
            const album = decompose.tagParts.basics.primative.bytesToStr(decomposer.extract(30)).replace(/\0/g, "");
            decomposer.increment(30);
            const year = decompose.tagParts.basics.primative.bytesToStr(decomposer.extract(4)).replace(/\0/g, "");
            decomposer.increment(4);
            const hasTrack = decomposer.extract(1,decomposer.scanned+28)[0] === 0; //ID3v1.1 has '28 comment, 1 test, 1 track', ID3v1 has '30 comment'
            const comment = decompose.tagParts.basics.primative.bytesToStr(decomposer.extract(28+(hasTrack?0:2))).replace(/\0/g, "");
            decomposer.increment(28+(hasTrack?0:2));
            const track = hasTrack ? decomposer.extract(2)[1] : 0; // ID3v1.0 has no track number, ID3v1.1 has 0,trck as last 2 bytes of comment
            if (hasTrack) decomposer.increment(2); //all 0 byte delim and track byte, if applicable
            const genre = decomposer.extract(1)[0];
            decomposer.increment(1);
            const genremap = ["Blues", "Classic Rock", "Country", "Dance", "Disco", "Funk", "Grunge", "Hip-Hop", "Jazz", "Metal", "New Age", "Oldies", "Other", "Pop", "R&B", "Rap", "Reggae", "Rock", "Techno", "Industrial", "Alternative", "Ska", "Death Metal", "Pranks", "Soundtrack", "Euro-Techno", "Ambient", "Trip-Hop", "Vocal", "Jazz+Funk", "Fusion", "Trance", "Classical", "Instrumental", "Acid", "House", "Game", "Sound Clip", "Gospel", "Noise", "Alternative Rock", "Bass", "Soul", "Punk", "Space", "Meditative", "Instrumental Pop", "Instrumental Rock", "Ethnic", "Gothic", "Darkwave", "Techno-Industrial", "Electronic", "Pop-Folk", "Eurodance", "Dream", "Southern Rock", "Comedy", "Cult", "Gangsta Rap", "Top 40", "Christian Rap", "Pop/Funk", "Jungle", "Native American", "Cabaret", "New Wave", "Psychedelic", "Rave", "Showtunes", "Trailer", "Lo-Fi", "Tribal", "Acid Punk", "Acid Jazz", "Polka", "Retro", "Musical", "Rock & Roll", "Hard Rock", "Folk", "Folk-Rock", "National Folk", "Swing", "Fast Fusion", "Bebob", "Latin", "Revival", "Celtic", "Bluegrass", "Avantgarde", "Gothic Rock", "Progressive Rock", "Psychedelic Rock", "Symphonic Rock", "Slow Rock", "Big Band", "Chorus", "Easy Listening", "Acoustic", "Humour", "Speech", "Chanson", "Opera", "Chamber Music", "Sonata", "Symphony", "Booty Bass", "Primus", "Porn Groove", "Satire", "Slow Jam", "Club", "Tango", "Samba", "Folklore", "Ballad", "Power Ballad", "Rhythmic Soul", "Freestyle", "Duet", "Punk Rock", "Drum Solo", "A Cappella", "Euro-House", "Dance Hall", "Goa", "Drum & Bass", "Club-House", "Hardcore", "Terror", "Indie", "BritPop", "Negerpunk", "Polsk Punk", "Beat", "Christian Gangsta Rap", "Heavy Metal", "Black Metal", "Crossover", "Contemporary Christian", "Christian Rock", "Merengue", "Salsa", "Thrash Metal", "Anime", "JPop", "Synthpop", "Abstract", "Art Rock", "Baroque", "Bhangra", "Big Beat", "Breakbeat", "Chillout", "Downtempo", "Dub", "EBM", "Eclectic", "Electro", "Electroclash", "Emo", "Experimental", "Garage", "Global", "IDM", "Illbient", "Industro-Goth", "Jam Band", "Krautrock", "Leftfield", "Lounge", "Math Rock", "New Romantic", "Nu-Breakz", "Post-Punk", "Post-Rock", "Psytrance", "Shoegaze", "Space Rock", "Trop Rock", "World Music", "Neoclassical", "Audiobook", "Audio Theatre", "Neue Deutsche Welle", "Podcast", "Indie Rock", "G-Funk", "Dubstep", "Garage Rock", "Psybient"];
            /** @type {(UnComposedFrame | false)[]} */
            const ucFramesOrFalse = [
                title ? {type:"TIT2", data:title}:false,
                artist ? {type:"TPE1", data:[artist]}:false,
                album ? {type:"TALB", data:album}:false,
                year ? {type:"TYER", data:Number.parseInt(year)}:false,
                comment ? {type:"COMM", data:{text:comment, description: "", language: "eng"}}:false,
                track ? {type:"TRCK", data:track + ""}:false,
                genre ? {type:"TCON", data:[genremap[genre] ?? ("Other, ID" + genre)]}:false
            ]
            /** @type {UnComposedFrame[]} */
            const ucFrames = ucFramesOrFalse.filter(v=>v!==false);
            return { cFrames:[], ucFrames, remaining: uint8.slice(0, uint8.length-128) };
        }
    },
    tagParts: {
        basics: {
            primative: {
                /**
                 * @param {Uint8Array} t
                 * @param {number} [e]
                 * @returns {string}
                 */
                bytesToStr(t,e=0) {
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
                },
                /**
                 * @param {Uint8Array} t
                 * @param {number} [e] encoding
                 * @param {boolean} [noNull] indicate if there is no null terminator
                 * @returns {[number,string]}
                 */
                extractStr(t,e=3,noNull) {
                    const is16Bit = e>0 && e<3;
                    let len = noNull?t.byteLength:t.findIndex((v,i,r)=>is16Bit?(v===0 && r[i+1]===0 && i%2===0):v===0);
                    if (len<0) { console.warn("Missing Null Terminator, interpreting all as string."); len = t.byteLength;}
                    return [len, this.bytesToStr(t.slice(0,len),e)];
                }
            },
            /**
             * @typedef EndPartFlags
             * @property {number} rawFlags
             * @property {boolean} isUnsync
             * @property {boolean} isExtended
             * @property {boolean} isExpirimental
             * @property {boolean} hasFooter
             * @property {number} unknownFlag
             * @typedef EndPart
             * @property {string} magic
             * @property {number} version
             * @property {number} revision
             * @property {EndPartFlags} flags
             * @property {number} size
             */
            /**
             * @param {Uint8Array} uint8
             * @returns {null | EndPart}
             */
            decomposeEndPart(uint8) {
                const decomposer = decompose.newDecomposer(uint8);
                if (!decomposer.verify(compose.tagParts.basics.primative.strToBytes("ID3",0,false))&&!decomposer.verify(compose.tagParts.basics.primative.strToBytes("3DI",0,false))) {
                    // No ID3v2 Header Or Footer found
                    return null;
                }
                const magic = this.primative.bytesToStr(decomposer.extract(3),0);
                decomposer.increment(3);
                const [version, revision, rawFlags] = decomposer.extract(3);
                decomposer.increment(3);
                const [isUnsync, isExtended, isExpirimental, hasFooter, unknownFlag] = [
                    Boolean(rawFlags & 0x80), // Bit 7: Unsynchronisation
                    Boolean(rawFlags & 0x40), // Bit 6: Extended header
                    Boolean(rawFlags & 0x20), // Bit 5: Experimental
                    Boolean(rawFlags & 0x10), // Bit 4: Footer present
                    rawFlags & 0x0F           // Bits 3-0: Reserved/Unknown
                ];
                const rawSize = decomposer.extract(4);
                decomposer.increment(4);
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
        },
        /**
         * @param {Uint8Array} uint8
         * @returns {null | EndPart}
         */
        decomposeHeader(uint8) {
            return this.basics.decomposeEndPart(uint8);
        },
        /**
         * @typedef ExtHeader
         * @property {number} size
         * @property {number} flagCount
         * @property {[Uint8Array]} flags // Todo
         */
        /**
         * @param {Uint8Array} uint8
         * @returns {null | ExtHeader}
         */
        decomposeExtHeader(uint8) {
            const decomposer = decompose.newDecomposer(uint8);
            const rawSize = decomposer.extract(4);
            decomposer.increment(4);
            const size = (rawSize[0] << 21) + (rawSize[1] << 14) + (rawSize[2] << 7) + rawSize[3];
            const flagCount = decomposer.extract(1)[0];
            console.warn("Extended Headers are not yet fully supported.");
            return {
                size,
                flagCount,
                flags: [decomposer.remaining()]
            };
        },
        /**
         * @param {Uint8Array} uint8 JUST THE FRAMES, NO HEADER, NO END DATA
         * @param {number} [version] required to handle v2.2 or v2.1, just the 2 or 1
         * @returns {ComposedFrame[]}
         */
        splitFrames(uint8, version = 3) {
            const decomposer = decompose.newDecomposer(uint8);
            const pre3 = version < 3;
            /** @type {ComposedFrame[]} */
            const rawFrames = [];
            while (decomposer.scanned < decomposer.Uint.length) {
                if (decomposer.scanned+(pre3 ? 6:8)>decomposer.Uint.length) break;
                let tp = this.basics.primative.bytesToStr(decomposer.extractrement(pre3 ? 3:4));
                if (!tp || tp === "\0\0\0\0" || tp === "\0\0\0") break;
                if (!tp.match(new RegExp("^[A-Z0-9]{"+(pre3?3:4)+"}$"))) {console.warn("Invalid frame name " + tp + ".\nReturning what I have.");break;}
                if (pre3) {
                    /** @type {Record<String,ID3FrameType>} */
                    const pre3Frames = { /* TEXT FRAMES */ /* Title */ "TT2": "TIT2", /* Artist */ "TP1": "TPE1", /* Album */ "TAL": "TALB", /* Track number */ "TRK": "TRCK", /* Year */ "TYE": "TYER", /* Genre */ "TCO": "TCON", /* Album Artist / Band */ "TP2": "TPE2", /* Composer */ "TCM": "TCOM", /* Lyricist */ "TXT": "TEXT", /* Initial key */ "TKE": "TKEY", /* Language */ "TLA": "TLAN", /* Length */ "TLE": "TLEN", /* Publisher */ "TPB": "TPUB", /* ISRC */ "TRC": "TSRC", /* Part of set */ "TPA": "TPOS", /* Content group */ "TT1": "TIT1", /* Subtitle */ "TT3": "TIT3", /* Media type */ "TMT": "TMED", /* Encoded by */ "TEN": "TENC", /* COMMENTS & LYRICS */ /* Comments */ "COM": "COMM", /* Synchronized lyrics */ "SLT": "SYLT", /* URL FRAMES */ "WCM": "WCOM", "WCP": "WCOP", "WAF": "WOAF", "WAR": "WOAR", "WAS": "WOAS", "WPB": "WPUB", /* SPECIAL / COMPLEX FRAMES */ /* Involved people list */ "IPL": "IPLS", /* Attached picture */ "PIC": "APIC", /* Buffer size*/ "BUF": "RBUF", /* Play counter*/ "CNT": "PCNT", /* Equalization */ "EQU": "EQUA", /* Event Timing */ "ETC": "ETCO", /* File In Tag */ "GEO": "GEOB", /* CD ID*/ "MCI": "MCDI", /* MPEG Lookup Table */ "MLL": "MLLT", /* Relative Volume */ "RVA": "RVAD", /* TempoSync */ "STC": "STCO", /* Unsynced lyrics */ "ULT": "USLT", /* File UID */ "UFI": "UFID", /* Custom URL */ "WXX": "WXXX" };
                    tp = pre3Frames[tp] ?? (tp + " ");
                }
                /** @type {ID3FrameType} */
                // @ts-ignore
                const type = tp;
                const encodedFSize = (pre3?[0]:[]).concat(Array.from(decomposer.extractrement(pre3?3:4)));
                const size = (encodedFSize[0] << 24) + (encodedFSize[1] << 16) + (encodedFSize[2] << 8) + encodedFSize[3];
                if (size > decomposer.Uint.length - decomposer.scanned) throw new Error("Invalid frame size " + size);
                decomposer.backtrack(pre3 ? 6:8);
                const uint8 = decomposer.extractrement(size + (pre3?0:2) + (pre3 ? 6:8));
                /** @type {ComposedFrame} */
                let f = {
                    type,
                    raw: uint8
                };
                rawFrames.push(f);
            }
            return rawFrames;
        },
        /** 
         * @param {ComposedFrame} rawFrame
         * @param {number} [version]
         * @returns {UnComposedFrame | ComposedFrame};
         */
        decomposeFrame(rawFrame, version = 3) {
            const pre3 = version < 3;
            if (rawFrame.raw.byteLength<(pre3 ? 6:8)) return rawFrame;
            const fscn = decompose.newDecomposer(rawFrame.raw);
            let tp = this.basics.primative.bytesToStr(fscn.extractrement(pre3 ? 3:4));
            if (!tp || tp === "\0\0\0\0" || tp === "\0\0\0") return rawFrame;
            if (!tp.match(new RegExp("^[A-Z0-9]{"+(pre3?3:4)+"}$"))) {console.warn("Invalid frame name " + tp + ".\nReturning what I have.");return rawFrame;}
            if (pre3) {
                /** @type {Record<String,ID3FrameType>} */
                const pre3Frames = { /* TEXT FRAMES */ /* Title */ "TT2": "TIT2", /* Artist */ "TP1": "TPE1", /* Album */ "TAL": "TALB", /* Track number */ "TRK": "TRCK", /* Year */ "TYE": "TYER", /* Genre */ "TCO": "TCON", /* Album Artist / Band */ "TP2": "TPE2", /* Composer */ "TCM": "TCOM", /* Lyricist */ "TXT": "TEXT", /* Initial key */ "TKE": "TKEY", /* Language */ "TLA": "TLAN", /* Length */ "TLE": "TLEN", /* Publisher */ "TPB": "TPUB", /* ISRC */ "TRC": "TSRC", /* Part of set */ "TPA": "TPOS", /* Content group */ "TT1": "TIT1", /* Subtitle */ "TT3": "TIT3", /* Media type */ "TMT": "TMED", /* Encoded by */ "TEN": "TENC", /* COMMENTS & LYRICS */ /* Comments */ "COM": "COMM", /* Synchronized lyrics */ "SLT": "SYLT", /* URL FRAMES */ "WCM": "WCOM", "WCP": "WCOP", "WAF": "WOAF", "WAR": "WOAR", "WAS": "WOAS", "WPB": "WPUB", /* SPECIAL / COMPLEX FRAMES */ /* Involved people list */ "IPL": "IPLS", /* Attached picture */ "PIC": "APIC", /* Buffer size*/ "BUF": "RBUF", /* Play counter*/ "CNT": "PCNT", /* Equalization */ "EQU": "EQUA", /* Event Timing */ "ETC": "ETCO", /* File In Tag */ "GEO": "GEOB", /* CD ID*/ "MCI": "MCDI", /* MPEG Lookup Table */ "MLL": "MLLT", /* Relative Volume */ "RVA": "RVAD", /* TempoSync */ "STC": "STCO", /* Unsynced lyrics */ "ULT": "USLT", /* File UID */ "UFI": "UFID", /* Custom URL */ "WXX": "WXXX" };
                tp = pre3Frames[tp] ?? (tp + " ");
            }
            /** @type {ID3FrameType} */
            // @ts-ignore
            const type = tp;
            if (type != rawFrame.type) {console.warn("IDK whats going on, but the type I just extracted is different now. I must be broken. Framing the frame for it and returning it raw."); return rawFrame;}
            const encodedFSize = (pre3?[0]:[]).concat(Array.from(fscn.extractrement(pre3?3:4)));
            const size = (encodedFSize[0] << 24) + (encodedFSize[1] << 16) + (encodedFSize[2] << 8) + encodedFSize[3];
            if (size > rawFrame.raw.length - fscn.scanned) {console.warn("Invalid frame size " + size + "\nReturning Raw Frame."); return rawFrame;}
            const frameFlags = pre3?[0,0]:fscn.extractrement(2);//FrameFlags not in pre-v2.3
            switch (rawFrame.type) {
                case "TPE1": case "TDAT": case "TCOM": case "TCON": case "TLAN": case "TIT1": case "TIT2": case "TIT3": case "TALB": case "TPE2": case "TPE3": case "TPE4": case "TRCK": case "TPOS": case "TKEY": case "TMED": case "TPUB": case "TCOP": case "TEXT": case "TSSE": case "TSRC": case "TDRC": case "TENC": case "TCMP":{
                        const e = fscn.extract(1)[0];
                        fscn.increment(1);
                        const [l, rdata] = this.basics.primative.extractStr(fscn.remaining(), e, true);
                        fscn.increment(l);
                        return /** @type {DistributeFrame<{ type: "TPE1" | "TCOM" | "TCON", data: string[] }|{ type: "TLAN" | "TIT1" | "TIT2" | "TIT3" | "TALB" | "TENC" | "TDRC" | "TPE2" | "TPE3" | "TPE4" | "TRCK" | "TPOS" | "TPUB" | "TKEY" | "TMED" | "TDAT" | "TSRC" | "TSSE" | "TCOP" | "TCMP" | "TEXT", data: string }>} */(
                            (rawFrame.type === "TPE1") || (rawFrame.type === "TCOM") || (rawFrame.type === "TCON") ? 
                            { type:rawFrame.type, data:rdata.split("TCON" === rawFrame.type ? ";" : " / ") }:
                            { type:rawFrame.type, data:rdata }
                        );
                    }
                case "WCOM": case "WCOP": case "WOAF": case "WOAR": case "WOAS": case "WORS": case "WPAY": case "WPUB": {
                        const [l, data] = this.basics.primative.extractStr(fscn.remaining(),0,true);
                        fscn.increment(l);
                        return /** @type {DistributeFrame<{ type: "WCOM" | "WCOP" | "WOAF" | "WOAR" | "WOAS" | "WORS" | "WPAY" | "WPUB", data: string }>} */(
                            { type:rawFrame.type, data }
                        );
                    }
                case "TXXX": case "WXXX": case "USLT": case "COMM": {
                        const e = fscn.extract(1)[0];
                        fscn.increment(1);
                        const language = (rawFrame.type === "USLT" || rawFrame.type === "COMM") ? // TXXX and WXXX don't have lang code;
                            this.basics.primative.bytesToStr(fscn.extract(3),0):"";
                        language.length===0 || fscn.increment(3);
                        const [dl, description] = this.basics.primative.extractStr(fscn.remaining(),e);
                        fscn.increment(dl);
                        const [vl, data] = this.basics.primative.extractStr(fscn.remaining(),(rawFrame.type === "WXXX") ? 3:e); //URL of WXXX is not encoded.
                        fscn.increment(vl);
                        return rawFrame.type === "USLT" ? 
                        { type:rawFrame.type, data:{ lyrics:data, description, language }}:
                        rawFrame.type === "COMM" ?
                        { type:rawFrame.type, data:{ text:data, description, language }}:
                        rawFrame.type === "WXXX" ?
                        { type:rawFrame.type, data:{ url:data, description }}:
                        { type:rawFrame.type, data:{ text:data, description }};
                    }
                case "TBPM": case "TLEN": case "TYER": case "PCNT": {
                        const e = fscn.extract(1)[0];
                        fscn.increment(1);
                        const [vl, dataStr] = this.basics.primative.extractStr(fscn.remaining(),e,true);
                        const data = parseInt(dataStr, 10);
                        fscn.increment(vl);
                        return /** @type {DistributeFrame<{ type: "TBPM" | "TLEN" | "TYER" | "PCNT", data: number }>} */(
                            { type:rawFrame.type, data }
                        );
                    }
                case "PRIV": case "UFID": {
                        const [il, id] = this.basics.primative.extractStr(fscn.remaining(),0);
                        fscn.increment(il);
                        const data = fscn.remaining();
                        /** @type {ID3FrameArgs["PRIV"]} */
                        fscn.increment(data.byteLength);
                        return rawFrame.type === "UFID" ? 
                            { type:rawFrame.type, data:{ id, identifier:data} }:
                            { type:rawFrame.type, data:{ id, data} };
                    }
                case "APIC": {
                        const e = fscn.extract(1)[0];
                        fscn.increment(1);
                        const [ml,mimeType] = this.basics.primative.extractStr(fscn.remaining(),e);
                        fscn.increment(ml);
                        const pictureType = fscn.extract(1)[0];
                        fscn.increment(1);
                        const [dl,description] = this.basics.primative.extractStr(fscn.remaining(), e);
                        fscn.increment(dl);
                        const data = fscn.remaining();
                        fscn.increment(data.byteLength);
                        return { type:rawFrame.type, data:{ data, description, cropMode: pictureType, mimeType }};
                    }
                case "IPLS": {
                        const e = fscn.extract(1)[0];
                        fscn.increment(1);
                        /** @type {[string, number][]} */
                        const data = [];
                        while (fscn.scanned<fscn.Uint.byteLength) {
                            const [sl,str] = this.basics.primative.extractStr(fscn.remaining(), e);
                            fscn.increment(sl);
                            const [nl,ns] = this.basics.primative.extractStr(fscn.remaining(), e);
                            const num = parseInt(ns, 10);
                            fscn.increment(nl);
                            data.push([str, num]);
                        }
                        return { type:rawFrame.type, data };
                    }
                case "SYLT": {
                        const e = fscn.extract(1)[0];
                        fscn.increment(1);
                        const language = this.basics.primative.bytesToStr(fscn.extract(3),0);
                        fscn.increment(3);
                        const timestampFormat = fscn.extract(1)[0];
                        fscn.increment(1);
                        const type = fscn.extract(1)[0];
                        fscn.increment(1);
                        const [dl, description] = this.basics.primative.extractStr(fscn.remaining(), e);
                        fscn.increment(dl);
                        /** @type {[string, number][]} */
                        const data = [];
                        while (fscn.scanned<fscn.Uint.byteLength) {
                            const [sl,str] = this.basics.primative.extractStr(fscn.remaining(), e);
                            fscn.increment(sl);
                            const num = (fscn.extract(4)[0] << 24) + (fscn.extract(4)[1] << 16) + (fscn.extract(4)[2] << 8) + fscn.extract(4)[3];
                            fscn.increment(4);
                            data.push([str, num]);
                        }
                        return { type:rawFrame.type, data:{text:data, language, timestampFormat, type, description }};
                    }
                case "STCO": {
                        const timeStampFormat = fscn.extract(1)[0];
                        fscn.increment(1);
                        /** @type {{ tempo: number, timestamp: number }[]} */
                        const data = [];
                        while (fscn.scanned < fscn.Uint.byteLength) {
                            const tempo = fscn.extract(1)[0];
                            fscn.increment(1);
                            const timestamp = (fscn.extract(4)[0] << 24) | (fscn.extract(4)[1] << 16) | (fscn.extract(4)[2] << 8) | fscn.extract(4)[3];
                            fscn.increment(4);
                            data.push({ tempo, timestamp });
                        }
                        return { type: rawFrame.type, data };
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
                        return { type: rawFrame.type, data:{framesBetweenReference, bytesBetweenReference, millisecondsBetweenReference, devianceBits, deviations}};
                    }
                case "RVAD": {
                        const flags = fscn.extract(1)[0];
                        fscn.increment(1);
                        const increment = (flags & 0x01) !== 0;
                        const bitsUsed = (flags >> 1) & 0x07;
                        /** @type {Array<{ channel: number, volumeChange: number, peakVolume?: Uint8Array | ArrayLike<number> }>} */
                        const channels = [];
                        const data = { increment, bitsUsed, channels };
                        const rem = fscn.remaining();
                        fscn.increment(rem.byteLength);
                        return { type: rawFrame.type, data };
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
                        return { type: rawFrame.type, data:{bufferSize, embeddedInfoFlag, offsetToNextTag}};
                    }
                case "EQUA": {
                        const adjustmentBits = fscn.extract(1)[0];
                        fscn.increment(1);
                        /** @type {{ adjustment: number, frequency: number }[]} */
                        const data = [];
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
                            data.push({ adjustment, frequency });
                        }
                        return { type: rawFrame.type, data };
                    }
                case "ETCO": {
                        const timeStampFormat = fscn.extract(1)[0];
                        fscn.increment(1);
                        /** @type {{ type: number, timestamp: number }[]} */
                        const data = [];
                        while (fscn.scanned < fscn.Uint.byteLength) {
                            const type = fscn.extract(1)[0];
                            fscn.increment(1);
                            const timestamp = (fscn.extract(4)[0] << 24) | (fscn.extract(4)[1] << 16) | (fscn.extract(4)[2] << 8) | fscn.extract(4)[3];
                            fscn.increment(4);
                            data.push({ type, timestamp });
                        }
                        return { type: rawFrame.type, data };
                    }
                case "GEOB": {
                        const e = fscn.extract(1)[0];
                        fscn.increment(1);
                        const [ml, mimeType] = this.basics.primative.extractStr(fscn.remaining(), 0);
                        fscn.increment(ml);
                        const [fl, filename] = this.basics.primative.extractStr(fscn.remaining(), e);
                        fscn.increment(fl);
                        const [dl, description] = this.basics.primative.extractStr(fscn.remaining(), e);
                        fscn.increment(dl);
                        const data = fscn.remaining();
                        fscn.increment(data.byteLength);
                        return { type: rawFrame.type, data:{data, mimeType, filename, description }};
                    }
                case "MCDI": {
                        const data = fscn.remaining();
                        fscn.increment(data.byteLength);
                        return { type: rawFrame.type, data };
                    }
                default:
                    /** @type {undefined} */
                    const u = rawFrame.type;
                    console.warn(`Unsupported frame ${u}.`);
                    return rawFrame;
            }
        },
        /**
         * @param {Uint8Array} uint8
         * @returns {null | EndPart}
         */
        decomposeFooter(uint8) {
            return this.basics.decomposeEndPart(uint8);
        }
    }
}
class Id3Editor {
    /** @type {Uint8Array} */
    untaggedU8;
    /** @type {number} */
    padding;
    /** @type {UnComposedFrame[]} */
    uncomposedFrames;
    /** @type {ComposedFrame[]} */
    composedFrames;
    /**
     * @param {ArrayBuffer|Uint8Array} data
     */
    constructor(data) {
        if (!data || "object" != typeof data || !("byteLength" in data)) throw new Error("First argument should be an instance of ArrayBuffer or Uint8Array");
        const decomposed = decompose.Id3Tag(new Uint8Array(data));
        this.untaggedU8 = decomposed.remaining;
        this.uncomposedFrames = decomposed.uncomposedFrames;
        this.composedFrames = decomposed.composedFrames;
        this.padding = decomposed.padding ?? 2048;
        return this;
    }
    clearFrames() {
        this.composedFrames = [];
        this.uncomposedFrames = [];
        return this;
    }
    clearUnParsableFrames() {
        this.composedFrames = [];
        return this;
    }
    /**
     * Add a frame to the ID3 tag.
     * @param {ComposedFrame | UnComposedFrame} frame 
     * @returns {Id3Editor}
     */
    addFrame(frame) {
        "data" in frame ? 
            this.uncomposedFrames.unshift(frame):
            this.composedFrames.unshift(frame);
        return this;
    }
    /**
     * Find a frame from the ID3 tag.
     * @param {(v: UnComposedFrame) => boolean} predicate
     * @returns {UnComposedFrame | null} found frame
     */
    findUnComposedFrame(predicate) {
        const index = this.uncomposedFrames.findIndex(predicate);
        if (index === -1) return null;
        return this.uncomposedFrames[index];
    }
    /**
     * Find a frame from the ID3 tag.
     * @param {(v:ComposedFrame)=>boolean} predicate
     * @returns {ComposedFrame | null} found frame
     */
    findComposedFrame(predicate) {
        const index = this.composedFrames.findIndex(predicate);
        if (index === -1) return null;
        return this.composedFrames[index];
    }
    /**
     * Find a frame from the ID3 tag, searching uncomposed for it first.
     * @param {(v:ComposedFrame|UnComposedFrame)=>boolean} predicate
     * @returns {ComposedFrame|UnComposedFrame|null} found frame
     */
    findFrame(predicate) {
        const ucIndex = this.uncomposedFrames.findIndex(predicate);
        if (ucIndex === -1) {
            const cIndex = this.composedFrames.findIndex(predicate);
            if (cIndex === -1) return null;
            return this.composedFrames[cIndex];
        }
        return this.uncomposedFrames[ucIndex];
    }
    /**
     * Find frames from the ID3 tag.
     * @param {(v:UnComposedFrame)=>boolean} predicate
     * @returns {UnComposedFrame[]} found frames
     */
    findUnComposedFrames(predicate) {
        return this.uncomposedFrames.filter(predicate);
    }
    /**
     * Find frames from the ID3 tag.
     * @param {(v:ComposedFrame)=>boolean} predicate
     * @returns {ComposedFrame[]} found frames
     */
    findComposedFrames(predicate) {
        return this.composedFrames.filter(predicate);
    }
    /**
     * Find frames from the ID3 tag.
     * @param {(v:ComposedFrame|UnComposedFrame)=>boolean} predicate
     * @returns {(ComposedFrame|UnComposedFrame)[]} found frames
     */
    findFrames(predicate) {
        /** @type {(UnComposedFrame|ComposedFrame)[]} ts gets mad otherwise*/
        const ucf = this.uncomposedFrames.filter(predicate); 
        return ucf.concat(this.composedFrames.filter(predicate));
    }

    /**
     * Remove a frame from the ID3 tag.
     * @param {(v: UnComposedFrame) => boolean} predicate
     * @returns {UnComposedFrame | null} removed frame
     */
    removeUnComposedFrame(predicate) {
        const index = this.uncomposedFrames.findIndex(predicate);
        if (index === -1) return null;
        // Splice removes 1 item at the found index and returns an array containing it
        return this.uncomposedFrames.splice(index, 1)[0];
    }
    /**
     * Remove a frame from the ID3 tag.
     * @param {(v:ComposedFrame)=>boolean} predicate
     * @returns {ComposedFrame | null} removed frame
     */
    removeComposedFrame(predicate) {
        const index = this.composedFrames.findIndex(predicate);
        if (index === -1) return null;
        // Splice removes 1 item at the found index and returns an array containing it
        return this.composedFrames.splice(index, 1)[0];
    }
    /**
     * Remove a frame from the ID3 tag, searching uncomposed for it first.
     * @param {(v:ComposedFrame|UnComposedFrame)=>boolean} predicate
     * @returns {ComposedFrame|UnComposedFrame|null} removed frame
     */
    removeFrame(predicate) {
        const ucIndex = this.uncomposedFrames.findIndex(predicate);
        if (ucIndex === -1) {
            const cIndex = this.composedFrames.findIndex(predicate);
            if (cIndex === -1) return null;
            // Splice removes 1 item at the found index and returns an array containing it
            return this.composedFrames.splice(cIndex, 1)[0];
        }
        // Splice removes 1 item at the found index and returns an array containing it
        return this.uncomposedFrames.splice(ucIndex, 1)[0];
    }
    /**
     * Remove frames from the ID3 tag.
     * @param {(v:UnComposedFrame)=>boolean} predicate
     * @returns {UnComposedFrame[]} removed frames
     */
    removeUnComposedFrames(predicate) {
        /** @type {UnComposedFrame[]} */
        let removed = [];
        this.uncomposedFrames = this.uncomposedFrames.filter(v=>{
            if (predicate(v)) {removed.push(v); return false;} else return true;
        });
        return removed;
    }
    /**
     * Remove frames from the ID3 tag.
     * @param {(v:ComposedFrame)=>boolean} predicate
     * @returns {ComposedFrame[]} removed frames
     */
    removeComposedFrames(predicate) {
        /** @type {ComposedFrame[]} */
        let removed = [];
        this.composedFrames = this.composedFrames.filter(v=>{
            if (predicate(v)) {removed.push(v); return false;} else return true;
        });
        return removed;
    }
    /**
     * Remove frames from the ID3 tag.
     * @param {(v:ComposedFrame|UnComposedFrame)=>boolean} predicate
     * @returns {(ComposedFrame|UnComposedFrame)[]} removed frames
     */
    removeFrames(predicate) {
        /** @type {(ComposedFrame|UnComposedFrame)[]} */
        let removed = [];
        this.uncomposedFrames = this.uncomposedFrames.filter(v=>{
            if (predicate(v)) {removed.push(v); return false;} else return true;
        });
        this.composedFrames = this.composedFrames.filter(v=>{
            if (predicate(v)) {removed.push(v); return false;} else return true;
        });
        return removed;
    }
    getUnTaggedUint8() {
        return this.untaggedU8.slice();
    }
    /** @param {TaggingArgs} [taggingArgs] */
    getTaggedUint8(taggingArgs) {
        // for some reason ts gets unhappy if I don't do it like this.
        /** @type {(UnComposedFrame|ComposedFrame)[]} ts gets mad otherwise  */
        const cFrames = this.composedFrames;
        return compose.Id3Tag({...taggingArgs, misc:{...(taggingArgs??{}), padding:this.padding}, frames:cFrames.concat(this.uncomposedFrames)},this.getUnTaggedUint8()).slice();
    }
    getUnTaggedArrayBuffer() {
        return this.getUnTaggedUint8().buffer;
    }
    /** @param {TaggingArgs} [taggingArgs] */
    getTaggedArrayBuffer(taggingArgs) {
        return this.getTaggedUint8(taggingArgs).buffer;
    }
    getUnTaggedBlob() {
        return new Blob([this.getUnTaggedArrayBuffer()], {
            type: "audio/mpeg"
        });

    }
    /** @param {TaggingArgs} [taggingArgs] */
    getTaggedBlob(taggingArgs) {
        return new Blob([this.getTaggedArrayBuffer(taggingArgs)], {
            type: "audio/mpeg"
        });
    }
    /**
     * @param {number} [timeoutMs] timeout of the ObjectURL or 0 for no timeout
     */
    getUnTaggedURL(timeoutMs = 0) {
        const url = URL.createObjectURL(this.getUnTaggedBlob());
        if (timeoutMs !== 0) {setTimeout(()=>URL.revokeObjectURL(url),timeoutMs)}
        return url;
    }
    /**
     * @param {number} [timeoutMs] timeout of the ObjectURL or 0 for no timeout
     * @param {TaggingArgs} [taggingArgs]
     */
    getTaggedURL(timeoutMs = 0, taggingArgs) {
        const url = URL.createObjectURL(this.getTaggedBlob(taggingArgs));
        if (timeoutMs !== 0) {setTimeout(()=>URL.revokeObjectURL(url),timeoutMs)}
        return url;
    }
}
function genTestData(){
    return {
        start: [73,68,51,2,0,0,0,0,0,23,84,84,50,0,0,17,3,70,114,111,110,116,32,118,50,46,50,32,84,105,116,108,101,255,251,144,68,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,73,68,51,4,0,16,0,0,0,30,84,73,84,50,0,0,0,20,0,0,3,84,114,97,105,108,105,110,103,32,118,50,46,52,32,84,105,116,108,101,51,68,73,4,0,16,0,0,0,30,84,65,71,84,114,97,105,108,105,110,103,32,118,49,32,84,105,116,108,101,0,0,0,0,0,0,0,0,0,0,0,0,0,84,101,115,116,32,65,114,116,105,115,116,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,84,101,115,116,32,65,108,98,117,109,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,50,48,50,54,84,101,115,116,32,67,111,109,109,101,110,116,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12],
        startUCF: '[{"type":"TIT2","data":"Front v2.2 Title"},{"type":"TIT2","data":"Trailing v1 Title"},{"type":"TPE1","data":["Test Artist"]},{"type":"TALB","data":"Test Album"},{"type":"TYER","data":2026},{"type":"COMM","data":{"text":"Test Comment","description":"","language":"eng"}},{"type":"TCON","data":["Other"]},{"type":"TIT2","data":"Trailing v2.4 Title"}]',
        startCF: '[]',
        startNoTag: '[255,251,144,68,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]',
        startAddTag: '[73,68,51,4,0,0,0,0,2,60,84,73,84,50,0,0,0,0,29,0,0,1,254,255,0,70,0,114,0,111,0,110,0,116,0,32,0,118,0,50,0,46,0,50,0,32,0,84,0,105,0,116,0,108,0,101,0,0,84,73,84,50,0,0,0,0,31,0,0,1,254,255,0,84,0,114,0,97,0,105,0,108,0,105,0,110,0,103,0,32,0,118,0,49,0,32,0,84,0,105,0,116,0,108,0,101,0,0,84,80,69,49,0,0,0,0,19,0,0,1,254,255,0,84,0,101,0,115,0,116,0,32,0,65,0,114,0,116,0,105,0,115,0,116,0,0,84,65,76,66,0,0,0,0,17,0,0,1,254,255,0,84,0,101,0,115,0,116,0,32,0,65,0,108,0,98,0,117,0,109,0,0,84,89,69,82,0,127,127,127,126,0,0,0,50,48,50,54,0,67,79,77,77,0,0,0,0,28,0,0,1,101,110,103,255,254,0,0,255,254,84,0,101,0,115,0,116,0,32,0,67,0,111,0,109,0,109,0,101,0,110,0,116,0,0,0,84,67,79,78,0,0,0,0,7,0,0,1,254,255,0,79,0,116,0,104,0,101,0,114,0,0,84,73,84,50,0,0,0,0,35,0,0,1,254,255,0,84,0,114,0,97,0,105,0,108,0,105,0,110,0,103,0,32,0,118,0,50,0,46,0,52,0,32,0,84,0,105,0,116,0,108,0,101,0,0,255,251,144,68,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]',
        rmFramePred: (/** @type {ComposedFrame | UnComposedFrame} */ v)=>v.type[2]==="T",
        /** @type {ID3FrameArgs["APIC"]} */
        addFrame1: {type:"APIC", data:{cropMode:5,data:new Uint8Array(compose.tagParts.basics.primative.strToBytes("NotReallyAnImage")),description:"FakeImage",mimeType:"Fake",useUnicodeEncoding:true}},
        /** @type {ComposedFrame & {type:"TIT1"}} */
        addFrame2: {type:"TIT1", raw:new Uint8Array(compose.tagParts.basics.primative.strToBytes('TIT1\0\0\0\0\x13\0\0\x01\xfe\xff\0'+'CustomBuilt\0'.split("").join("\0"),0,false))},
        postModUCF: '[{"type":"APIC","data":{"cropMode":5,"data":{"0":78,"1":111,"2":116,"3":82,"4":101,"5":97,"6":108,"7":108,"8":121,"9":65,"10":110,"11":73,"12":109,"13":97,"14":103,"15":101,"16":0},"description":"FakeImage","mimeType":"Fake","useUnicodeEncoding":true}},{"type":"TPE1","data":["Test Artist"]},{"type":"TALB","data":"Test Album"},{"type":"TYER","data":2026},{"type":"COMM","data":{"text":"Test Comment","description":"","language":"eng"}},{"type":"TCON","data":["Other"]}]',
        postModCF: '[{"type":"TIT1","raw":{"0":84,"1":73,"2":84,"3":49,"4":0,"5":0,"6":0,"7":0,"8":19,"9":0,"10":0,"11":1,"12":254,"13":255,"14":0,"15":67,"16":0,"17":117,"18":0,"19":115,"20":0,"21":116,"22":0,"23":111,"24":0,"25":109,"26":0,"27":66,"28":0,"29":117,"30":0,"31":105,"32":0,"33":108,"34":0,"35":116,"36":0,"37":0}}]',
        postModAddTag: '[73,68,51,4,0,0,0,0,2,14,84,73,84,49,0,0,0,0,19,0,0,1,254,255,0,67,0,117,0,115,0,116,0,111,0,109,0,66,0,117,0,105,0,108,0,116,0,0,65,80,73,67,0,0,0,0,39,0,0,1,70,97,107,101,0,0,5,255,254,70,0,97,0,107,0,101,0,73,0,109,0,97,0,103,0,101,0,0,0,78,111,116,82,101,97,108,108,121,65,110,73,109,97,103,101,0,84,80,69,49,0,0,0,0,19,0,0,1,254,255,0,84,0,101,0,115,0,116,0,32,0,65,0,114,0,116,0,105,0,115,0,116,0,0,84,65,76,66,0,0,0,0,17,0,0,1,254,255,0,84,0,101,0,115,0,116,0,32,0,65,0,108,0,98,0,117,0,109,0,0,84,89,69,82,0,127,127,127,126,0,0,0,50,48,50,54,0,67,79,77,77,0,0,0,0,28,0,0,1,101,110,103,255,254,0,0,255,254,84,0,101,0,115,0,116,0,32,0,67,0,111,0,109,0,109,0,101,0,110,0,116,0,0,0,84,67,79,78,0,0,0,0,7,0,0,1,254,255,0,79,0,116,0,104,0,101,0,114,0,0,0,0,0,0,0,0,0,0,0,0,255,251,144,68,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]',
        import: myself
    }
};
/** 
 * @param {boolean} logOutput 
 * @returns {Promise<boolean>}
 */
async function test(logOutput){
    const testData = genTestData();
    const td = testData;
    const id3 = td.import;
    const editorClass = id3.Id3Editor;
    const mp3 = testData.start;
    const mp3Buffer = (typeof process === undefined) ? new Uint8Array(mp3):Buffer.from(mp3);
    const editor = new editorClass(mp3Buffer);
    /** @type {boolean[]} */
    let tests = [];
    tests.push(
        JSON.stringify(Array.from(mp3Buffer)) ===
        JSON.stringify(mp3)
    );
    tests.push(
        JSON.stringify(editor.uncomposedFrames) === 
        td.startUCF
    );
    tests.push(
        JSON.stringify(editor.composedFrames) === 
        td.startCF
    );
    tests.push(
        JSON.stringify(Array.from(editor.untaggedU8)) === 
        td.startNoTag
    );
    tests.push(
        JSON.stringify(Array.from(editor.getTaggedUint8())) === 
        td.startAddTag
    );
    tests.push(editor.padding === 0);
    editor.removeFrames(testData.rmFramePred);
    editor.addFrame(testData.addFrame1);
    editor.addFrame(testData.addFrame2);
    editor.padding = 10;
    tests.push(
        JSON.stringify(editor.uncomposedFrames) === 
        td.postModUCF
    );
    tests.push(
        JSON.stringify(editor.composedFrames) === 
        td.postModCF
    );
    tests.push(
        JSON.stringify(Array.from(editor.getTaggedUint8())) === 
        td.postModAddTag
    );
    const pass = tests.every(v=>v);
    if (logOutput) {
        console.log("Test " + (pass ? "Passed!!!":"Failed. ={"));
        pass || console.warn("TEST FAIL ON TEST #(s) " + tests.map((v, i)=>!v?i+1:false).filter(v=>v).join(",") + " (out of " + tests.length + ")");
    }
    return pass;
}
const myself = {
    Id3Editor,
    readTools: decompose,
    writeTools: compose,
    decomposeTools: decompose,
    composeTools: compose,
    decompose,
    compose,
    test
};
export default myself;
module.exports = myself;
// --- Self-Test Entry Point Trigger ---
// @ts-ignore
const isMainNode = typeof process !== 'undefined' && process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'));
// @ts-ignore
const isMainBrowser = typeof window !== 'undefined' && document.currentScript && document.currentScript.src === import.meta.url;
if (isMainNode || isMainBrowser) test(true);