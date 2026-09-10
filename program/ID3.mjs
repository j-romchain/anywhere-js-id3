// @ts-check
/** @typedef {{ name: string, value: string, size: number }} stringFrame */
/** @typedef {{ name: string, value: number, size: number }} integerFrame */
/** 
 * @typedef {Object} ID3FrameMap
 * @property {{desc:"song artists",arg:{type:"TPE1",                                     data:string[]},                                                                                         frame:{name:"TPE1",value:string,size:number}}} TPE1
 * @property {{desc:"song composers",arg:{type:"TCOM",                                   data:string[]},                                                                                         frame:{name:"TCOM",value:string,size:number}}} TCOM
 * @property {{desc:"song genres",arg:{type:"TCON",                                      data:string[]},                                                                                         frame:{name:"TCON",value:string,size:number}}} TCON
 * @property {{desc:"language",arg:{type:"TLAN",                                         data:string},                                                                                           frame:{name:"TLAN",value:string,size:number}}} TLAN
 * @property {{desc:"content group description",arg:{type:"TIT1",                        data:string},                                                                                           frame:{name:"TIT1",value:string,size:number}}} TIT1
 * @property {{desc:"song title",arg:{type:"TIT2",                                       data:string},                                                                                           frame:{name:"TIT2",value:string,size:number}}} TIT2
 * @property {{desc:"song subtitle",arg:{type:"TIT3",                                    data:string},                                                                                           frame:{name:"TIT3",value:string,size:number}}} TIT3
 * @property {{desc:"album title",arg:{type:"TALB",                                      data:string},                                                                                           frame:{name:"TALB",value:string,size:number}}} TALB
 * @property {{desc:"album artist",arg:{type:"TPE2",                                     data:string},                                                                                           frame:{name:"TPE2",value:string,size:number}}} TPE2
 * @property {{desc:"conductor/performer refinement",arg:{type:"TPE3",                   data:string},                                                                                           frame:{name:"TPE3",value:string,size:number}}} TPE3
 * @property {{desc:"interpreted, remixed, or otherwise modified by",arg:{type:"TPE4",   data:string},                                                                                           frame:{name:"TPE4",value:string,size:number}}} TPE4
 * @property {{desc:"song number in album",arg:{type:"TRCK",                             data:string},                                                                                           frame:{name:"TRCK",value:string,size:number}}} TRCK
 * @property {{desc:"album disc number",arg:{type:"TPOS",                                data:string},                                                                                           frame:{name:"TPOS",value:string,size:number}}} TPOS
 * @property {{desc:"label name",arg:{type:"TPUB",                                       data:string},                                                                                           frame:{name:"TPUB",value:string,size:number}}} TPUB
 * @property {{desc:"initial key",arg:{type:"TKEY",                                      data:string},                                                                                           frame:{name:"TKEY",value:string,size:number}}} TKEY
 * @property {{desc:"media type",arg:{type:"TMED",                                       data:string},                                                                                           frame:{name:"TMED",value:string,size:number}}} TMED
 * @property {{desc:"album release date expressed as 'DDMM'",arg:{type:"TDAT",           data:string},                                                                                           frame:{name:"TDAT",value:string,size:number}}} TDAT
 * @property {{desc:"isrc - international standard recording code",arg:{type:"TSRC",     data:string},                                                                                           frame:{name:"TSRC",value:string,size:number}}} TSRC
 * @property {{desc:"software/hardware and settings used for encoding",arg:{type:"TSSE", data:string},                                                                                           frame:{name:"TSSE",value:string,size:number}}} TSSE
 * @property {{desc:"copyright message",arg:{type:"TCOP",                                data:string},                                                                                           frame:{name:"TCOP",value:string,size:number}}} TCOP
 * @property {{desc:"iTunes compilation flag",arg:{type:"TCMP",                          data:string},                                                                                           frame:{name:"TCMP",value:string,size:number}}} TCMP
 * @property {{desc:"lyricist / text writer",arg:{type:"TEXT",                           data:string},                                                                                           frame:{name:"TEXT",value:string,size:number}}} TEXT
 * @property {{desc:"commercial information",arg:{type:"WCOM",                           data:string},                                                                                           frame:{name:"WCOM",value:string,size:number}}} WCOM
 * @property {{desc:"copyright/Legal information",arg:{type:"WCOP",                      data:string},                                                                                           frame:{name:"WCOP",value:string,size:number}}} WCOP
 * @property {{desc:"official audio file webpage",arg:{type:"WOAF",                      data:string},                                                                                           frame:{name:"WOAF",value:string,size:number}}} WOAF
 * @property {{desc:"official artist/performer webpage",arg:{type:"WOAR",                data:string},                                                                                           frame:{name:"WOAR",value:string,size:number}}} WOAR
 * @property {{desc:"official audio source webpage",arg:{type:"WOAS",                    data:string},                                                                                           frame:{name:"WOAS",value:string,size:number}}} WOAS
 * @property {{desc:"official internet radio station homepage",arg:{type:"WORS",         data:string},                                                                                           frame:{name:"WORS",value:string,size:number}}} WORS
 * @property {{desc:"payment",arg:{type:"WPAY",                                          data:string},                                                                                           frame:{name:"WPAY",value:string,size:number}}} WPAY
 * @property {{desc:"publishers official webpage",arg:{type:"WPUB",                      data:string},                                                                                           frame:{name:"WPUB",value:string,size:number}}} WPUB
 * @property {{desc:"song duration in milliseconds",arg:{type:"TLEN",                    data:number},                                                                                           frame:{name:"TLEN",value:number,size:number}}} TLEN
 * @property {{desc:"album release year",arg:{type:"TYER",                               data:number},                                                                                           frame:{name:"TYER",value:number,size:number}}} TYER
 * @property {{desc:"beats per minute",arg:{type:"TBPM",                                 data:number},                                                                                           frame:{name:"TBPM",value:number,size:number}}} TBPM
 * @property {{desc:"comments",arg:{type:"COMM",                                         data:{description?:string,text:string,language?:string}},                                               frame:{name:"COMM",value: string, language: number[], description: string, size: number}}} COMM
 * @property {{desc:"unsychronised lyrics",arg:{type:"USLT",                             data:{description?:string,lyrics:string,language?:string}},                                             frame:{name:"USLT",value: string, language: number[], description: string, size: number }}} USLT
 * @property {{desc:"involved people list",arg:{type:"IPLS",                             data:[string, number][]},                                                                               frame:{name:"IPLS",value: [string, number][], size:number}}} IPLS
 * @property {{desc:"synchronised lyrics",arg:{type:"SYLT",                              data:{type:number,text:[string,number][],timestampFormat:number,language?:string,description?:string}}, frame:{name:"SYLT",value: [string, number][]; language: number[]; description: string; type: number; timestampFormat: number; size: number; }}} SYLT
 * @property {{desc:"user defined text",arg:{type:"TXXX",                                data:{description?:string,value:string}},                                                               frame:{name:"TXXX",description: string, value: string, size: number}}} TXXX
 * @property {{desc:"private frame",arg:{type:"PRIV",                                    data:{id:string,data:ArrayBuffer | ArrayLike<number>}},                                                 frame:{name:"PRIV",value: ArrayBuffer | ArrayLike<number>, id: string, size: number}}} PRIV
 * @property {{desc:"attached picture",arg:{type:"APIC",                                 data:{type:number,data:ArrayBuffer,description?:string,useUnicodeEncoding?:boolean}},                   frame:{name:"APIC",value: ArrayBuffer | ArrayLike<number>, pictureType: number, mimeType: "image/jpeg" | "image/png" | "image/gif" | "image/webp" | "image/tiff" | "image/bmp" | "image/x-icon", useUnicodeEncoding?: boolean, description: string, size: number}}} APIC
 */
/** @typedef {keyof ID3FrameMap} ID3FrameType */
/** @typedef {{ [K in ID3FrameType]: ID3FrameMap[K]['desc']; }} ID3FrameDescriptions */
/** @typedef {ID3FrameMap[ID3FrameType]['frame']} ID3Frame */
/** @typedef {{ [K in ID3FrameType]: ID3FrameMap[K]['frame']; }} ID3Frames */
/** @typedef {ID3FrameMap[ID3FrameType]['arg']} ID3FrameArg */
/** @typedef {{ [K in ID3FrameType]: ID3FrameMap[K]['arg']; }} ID3FrameArgs */


/**
 * @param {string} e
 */
function charCodes(e) {
    return String(e).split("").map(e => e.charCodeAt(0))
}
/**
 * @param {string} t
 */
function strToBytes(t) {
    return new Uint8Array(charCodes(t))
}
/**
 * @param {Uint8Array} t
 * @returns {string}
 */
function bytesToStr(t) {
    return String.fromCharCode(...t);
}
/**
 * @param {string} t
 */
function utf16String(t) {
    const a = new ArrayBuffer(2 * t.length), r = new Uint8Array(a);
    return new Uint16Array(a).set(charCodes(t)), r
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
class Id3Editor {
    /** @type {ArrayBuffer} */
    arrayBuffer;
    /** @type {number} */
    padding = 4096;
    /** @type {ID3Frame[]} */
    frames = [];
    /** @type {string} */
    url = "";
    /**
     * @param {ArrayBuffer} arrayBuffer
     */
    constructor(arrayBuffer) {
        if (!arrayBuffer || "object" != typeof arrayBuffer || !("byteLength" in arrayBuffer)) throw new Error("First argument should be an instance of ArrayBuffer or Buffer");
        this.arrayBuffer = arrayBuffer;
        this.frames = this.readTag(arrayBuffer).frames;
    }
    /**
     * @template {ID3FrameType} K
     * @param {K} frameType
     * @param {string | number} value
     * @returns {{name:K}&integerFrame}
     */
    _genIntegerFrame(frameType, value) {
        const a=parseInt(value + "",10);
        return { name: frameType, value: a, size: plusTextHeader(a.toString().length) };
    }
    /**
     * @template {ID3FrameType} T
     * @param {T} frameType
     * @param {string} value
     * @returns {{name:T}&stringFrame}
     */
    _genStringFrame(frameType, value) {
        const a = value.toString();
        return { name: frameType, value: a, size: (frameType === "TDAT") ? 13+2*a.length : plusTextHeader(a.length)};
    }
    /**
     * @param {number} e
     * @param {string} a
     * @param {ArrayBuffer | ArrayLike<number>} t
     * @param {boolean} r
     * @returns {ID3Frames["APIC"]}
     */
    _genPictureFrame(e, t, a, r) {
        const n = function (e) {
            if (!e || !e.length) return null;
            if (255 === e[0] && 216 === e[1] && 255 === e[2]) return "image/jpeg";
            if (137 === e[0] && 80 === e[1] && 78 === e[2] && 71 === e[3]) return "image/png";
            if (71 === e[0] && 73 === e[1] && 70 === e[2]) return "image/gif";
            if (87 === e[8] && 69 === e[9] && 66 === e[10] && 80 === e[11]) return "image/webp";
            const t = 73 === e[0] && 73 === e[1] && 42 === e[2] && 0 === e[3], a = 77 === e[0] && 77 === e[1] && 0 === e[2] && 42 === e[3];
            return t || a ? "image/tiff" : 66 === e[0] && 77 === e[1] ? "image/bmp" : 0 === e[0] && 0 === e[1] && 1 === e[2] && 0 === e[3] ? "image/x-icon" : null
        }
            (new Uint8Array(t)), i = a.toString();
        if (!n) throw new Error("Unknown picture MIME type");
        a || (r = !1);
        if (!("byteLength" in t)) throw new Error("Picture frame data must be an ArrayBuffer or ArrayLike<number>");
        return { name: "APIC", value: t, pictureType: e, mimeType: n, useUnicodeEncoding: r, description: i, size: pictureFrameSize(t.byteLength, n.length, i.length, r) };
    }
    /**
     * @param {string} e
     * @param {string} t
     * @param {string} a
     * @returns {ID3Frames["USLT"]}
     */
    _genLyricsFrame(e, t, a) {
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
    _genCommentFrame(e, t, a) {
        const r = e.split("").map(e => e.charCodeAt(0)), n = t.toString(), s = a.toString();
        var i, c;
        return { name: "COMM", value: s, language: r, description: n, size: (i = n.length, c = s.length, 16 + 2 * i + 2 + 2 + 2 * c) }
    }
    /**
     * @param {string} e
     * @param {ArrayBuffer | ArrayLike<number>} t
     * @returns {ID3Frames["PRIV"]}
     */
    _genPrivateFrame(e, t) {
        const a = e.toString();
        if (!('byteLength' in t)) throw new Error("Private frame data must be an ArrayBuffer or ArrayLike<number>");
        return { name: "PRIV", value: t, id: a, size: 10 + a.length + 1 + t.byteLength }
    }
    /**
     * @param {string} e
     * @param {string} t
     * @returns {ID3Frames["TXXX"]}
     */
    _genUserStringFrame(e, t) {
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
    _genUrlLinkFrame(e, t) {
        const a = t.toString();
        return { name: e, value: a, size: 10 + a.length }
    }
    /**
     * @param {"IPLS"} e
     * @param {[string, number][]} t
     */
    _genPairedTextFrame(e, t) {
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
    _genSynchronisedLyricsFrame(e, t, a, r, n) {
        const s = n.toString(), i = r.split("").map(e => e.charCodeAt(0));
        return { name: "SYLT", value: t, language: i, description: s, type: e, timestampFormat: a, size: syncLyricsFrameSize(t, s.length) }
    }
    /**
     * @template {ID3FrameType} K
     * @param {ID3FrameArg} dummyFrame 
     * @returns {ID3Frame}
     */
    genFrame(dummyFrame) {
        switch (dummyFrame.type) {
            case "TPE1": case "TCOM": case "TCON": {
                if (!Array.isArray(dummyFrame.data)) throw new Error(`${dummyFrame.type} frame value should be an array of strings`);
                return this._genStringFrame(dummyFrame.type, dummyFrame.data.join("TCON" === dummyFrame.type ? ";" : " / "));
            }
            case "TLAN": case "TIT1": case "TIT2": case "TIT3": case "TALB": case "TPE2": case "TPE3": case "TPE4": case "TRCK": case "TPOS": case "TMED": case "TPUB": case "TCOP": case "TKEY": case "TEXT": case "TDAT": case "TCMP": case "TSSE": case "TSRC":
                return this._genStringFrame(dummyFrame.type, dummyFrame.data);
            case "TBPM": case "TLEN": case "TYER":
                return this._genIntegerFrame(dummyFrame.type, dummyFrame.data);
            case "USLT": 
                if (dummyFrame.data.language = dummyFrame.data.language || "eng", "object" != typeof dummyFrame.data || !("description" in dummyFrame.data) || !("lyrics" in dummyFrame.data)) throw new Error("USLT frame value should be an object with keys description and lyrics");
                if (dummyFrame.data.language && !dummyFrame.data.language.match(/[a-z]{3}/i)) throw new Error("Language must be coded following the ISO 639-2 standards");
                return this._genLyricsFrame(dummyFrame.data.language, dummyFrame.data.description || "", dummyFrame.data.lyrics);
            case "APIC":
                if ("object" != typeof dummyFrame.data || !("type" in dummyFrame.data) || !("data" in dummyFrame.data) || !("description" in dummyFrame.data)) throw new Error("APIC frame value should be an object with keys type, data and description");
                if (dummyFrame.data.type < 0 || dummyFrame.data.type > 20) throw new Error("Incorrect APIC frame picture type");
                return this._genPictureFrame(dummyFrame.data.type, dummyFrame.data.data, dummyFrame.data.description || "", !!dummyFrame.data.useUnicodeEncoding);
            case "TXXX": 
                if ("object" != typeof dummyFrame.data || !("description" in dummyFrame.data) || !("value" in dummyFrame.data)) throw new Error("TXXX frame value should be an object with keys description and value");
                return this._genUserStringFrame(dummyFrame.data.description || "", dummyFrame.data.value);
            case "WCOM": case "WCOP": case "WOAF": case "WOAR": case "WOAS": case "WORS": case "WPAY": case "WPUB": 
                return this._genUrlLinkFrame(dummyFrame.type, dummyFrame.data);
            case "COMM": 
                if (dummyFrame.data.language = dummyFrame.data.language || "eng", "object" != typeof dummyFrame.data || !("description" in dummyFrame.data) || !("text" in dummyFrame.data)) throw new Error("COMM frame value should be an object with keys description and text");
                if (dummyFrame.data.language && !dummyFrame.data.language.match(/[a-z]{3}/i)) throw new Error("Language must be coded following the ISO 639-2 standards");
                return this._genCommentFrame(dummyFrame.data.language, dummyFrame.data.description || "", dummyFrame.data.text);
            case "PRIV": 
                if ("object" != typeof dummyFrame.data || !("id" in dummyFrame.data) || !("data" in dummyFrame.data)) throw new Error("PRIV frame value should be an object with keys id and data");
                return this._genPrivateFrame(dummyFrame.data.id, dummyFrame.data.data);
            case "IPLS": 
                if (!Array.isArray(dummyFrame.data) || !Array.isArray(dummyFrame.data[0])) throw new Error("IPLS frame value should be an array of pairs");
                return this._genPairedTextFrame(dummyFrame.type, dummyFrame.data);
            case "SYLT": 
                if ("object" != typeof dummyFrame.data || !("type" in dummyFrame.data) || !("text" in dummyFrame.data) || !("timestampFormat" in dummyFrame.data)) throw new Error("SYLT frame value should be an object with keys type, text and timestampFormat");
                if (!Array.isArray(dummyFrame.data.text) || !Array.isArray(dummyFrame.data.text[0])) throw new Error("SYLT frame text value should be an array of pairs");
                if (dummyFrame.data.type < 0 || dummyFrame.data.type > 6) throw new Error("Incorrect SYLT frame content type");
                if (dummyFrame.data.timestampFormat < 1 || dummyFrame.data.timestampFormat > 2) throw new Error("Incorrect SYLT frame time stamp format");
                return this._genSynchronisedLyricsFrame(dummyFrame.data.type, dummyFrame.data.text, dummyFrame.data.timestampFormat, dummyFrame.data.language || "eng", dummyFrame.data.description || "");
            // @ts-ignore
            default: throw new Error(`Unsupported frame ${dummyFrame.type}`)
        }
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
        this.frames.push(this.genFrame(dummyFrame));
        return this
    }
    removeTag() {
        if (this.arrayBuffer.byteLength < 10) return;
        const e = new Uint8Array(this.arrayBuffer), t = e[3], a = ((r = [e[6], e[7], e[8], e[9]])[0] << 21) + (r[1] << 14) + (r[2] << 7) + r[3] + 10;
        var r, n;
        73 !== (n = e)[0] || 68 !== n[1] || 51 !== n[2] || t < 2 || t > 4 || (this.arrayBuffer = new Uint8Array(e.subarray(a)).buffer)
    }
    addTag() {
        this.removeTag();
        const UTFBOM = [255, 254];
        const totalTagLength = 10 + this.frames.reduce((sum, frame) => sum + frame.size, 0) + this.padding;
        const newBuffer = new ArrayBuffer(this.arrayBuffer.byteLength + totalTagLength)
        const newUint = new Uint8Array(newBuffer);
        let c = 0; 
        const ID33 = [73, 68, 51, 3];
        newUint.set(ID33, c);
        c += ID33.length;//Header
        c += 2;//FrameFlags (0's)
        const encodedLength = ((bodyLength) => {
            const t = 127;return [bodyLength >>> 21 & t, bodyLength >>> 14 & t, bodyLength >>> 7 & t, bodyLength & t];
        })(totalTagLength - 10);
        newUint.set(encodedLength, c); 
        c += encodedLength.length;
        this.frames.forEach(frame => {
            const encodedFName = strToBytes(frame.name);
            newUint.set(encodedFName, c);
            c += encodedFName.length;
            const encodedFSize = intToBytes(frame.size - 10);
            newUint.set(encodedFSize, c);
            c += encodedFSize.length;
            c += 2;//FrameFlags (0's)
            function write (/** @type {ArrayLike<number>} */set) {
                newUint.set(set, c);
                c += set.length;
            }
            switch (frame.name) {
                case "TPE1": case "TCOM": case "TCON": case "TLAN": case "TIT1": case "TIT2": case "TIT3": case "TALB": case "TPE2": case "TPE3": case "TPE4": case "TRCK": case "TPOS": case "TKEY": case "TMED": case "TPUB": case "TCOP": case "TEXT": case "TSSE": case "TSRC":
                    write([1].concat(UTFBOM));
                case "WCOM": case "WCOP": case "WOAF": case "WOAR": case "WOAS": case "WORS": case "WPAY": case "WPUB":
                    const fVal = strToBytes(frame.value); 
                    write(fVal);
                    break;
                case "TXXX": case "USLT": case "COMM":
                    write([1]);
                    if (frame.name != "TXXX") {
                        write(frame.language);
                    }
                    write(UTFBOM);
                    write(utf16String(frame.description));
                    write([0, 0].concat(UTFBOM));
                    write(utf16String(frame.value));
                    break;
                case "TBPM": case "TLEN": case "TDAT": case "TYER":
                    c++;
                    write(strToBytes(frame.value+""));
                    break;
                case "PRIV":
                    write(strToBytes(frame.id));
                    c++;
                    write(new Uint8Array(frame.value));
                    break;
                case "APIC":
                    write([frame.useUnicodeEncoding ? 1 : 0]);
                    write(strToBytes(frame.mimeType));
                    write([0, frame.pictureType]);
                    if (frame.useUnicodeEncoding) {
                        write(UTFBOM);
                        write(utf16String(frame.description));
                        c+=2; 
                    } else {
                        write(strToBytes(frame.description));
                        c++;
                    }
                    write(new Uint8Array(frame.value));
                    break;
                case "IPLS":
                    write([1])
                    frame.value.forEach((t) => {
                        write(UTFBOM);
                        write(utf16String(t[0].toString()));
                        write([0, 0].concat(UTFBOM));
                        write(utf16String(t[1].toString()));
                        write([0, 0]);
                    });
                    break;
                case "SYLT": 
                    write([1].concat(frame.language).concat(frame.timestampFormat).concat(frame.type));
                    write(UTFBOM);
                    write(utf16String(frame.description));
                    c+=2;
                    frame.value.forEach((t) => {
                        write(UTFBOM);
                        write(utf16String(t[0].toString()));
                        write([0, 0])
                        write(intToBytes(t[1]));
                    });
                    break;
                default:
                    throw new Error(`Unsupported frame ${frame.name}`)
            }

        }
        ), c += this.padding, newUint.set(new Uint8Array(this.arrayBuffer), c), this.arrayBuffer = newBuffer, newBuffer
    }
    /**
     * 
     * @param {ArrayBuffer} arrayBuffer
     * @returns {{ frames:ID3Frame[], remaining:ArrayBuffer }}
     */
    readTag(arrayBuffer) {
        /** @type {ID3Frame[]} */
        const frames = [];
        const Uint = new Uint8Array(arrayBuffer);
        let scanned = 0;
        const UTFBOM = [255, 254];
        function verify(/** @type {ArrayLike<number>} */set, /** @type {number|undefined} */depth) {
            return Uint.subarray(depth??scanned, (depth??scanned) + set.length).every((e, i) => e === set[i]);
        }
        function extract(/** @type {number} */length, /** @type {number|undefined} */depth) {
            const sub = Uint.subarray(depth??scanned, (depth??scanned) + length);
            return sub;
        }
        const isStart = verify(charCodes("ID3"));
        const isOldEnd = verify(charCodes("TAG"),Uint.length-128);
        const isNewEnd = verify(charCodes("3DI"),Uint.length-(isOldEnd?138:10));
        console.log(isStart+"-"+isOldEnd+"-"+isNewEnd);
        console.log(extract(3,0)+"-"+extract(10,Uint.length-128)+"-"+extract(10,Uint.length-138));
        return;
        const ID33 = [73, 68, 51, 3];
        if (!verify(ID33)) throw new Error("Invalid Version Number " + extract(4).join(","));//ID3v2.3.0
        scanned += ID33.length + 2;//FrameFlags (ignored)
        const encodedLength = extract(4);
        const decodedLength = (encodedLength[0] << 21) + (encodedLength[1] << 14) + (encodedLength[2] << 7) + encodedLength[3];
        scanned += 4;
        if (decodedLength > Uint.length - scanned) throw new Error("Invalid tag length " + decodedLength);
        const headerend = scanned;
        while (scanned < headerend + decodedLength) {
            /** @type {any} */
            const frame = {};
            const encodedFName = extract(4);
            frame.name = bytesToStr(encodedFName);
            if (!frame.name || frame.name === "\0\0\0\0") break;
            if (!frame.name.match(/^[A-Z0-9]{4}$/)) throw new Error("Invalid frame name " + frame.name);
            scanned += 4;
            const encodedFSize = extract(4);
            frame.size = (encodedFSize[0] << 24) + (encodedFSize[1] << 16) + (encodedFSize[2] << 8) + encodedFSize[3];
            let remainingFrame = frame.size;
            if (frame.size > decodedLength + headerend - scanned) throw new Error("Invalid frame size " + frame.size);
            scanned += 4;
            scanned += 2;//FrameFlags (ignored)
            switch (frame.name) {
                case "TPE1": case "TCOM": case "TCON": case "TLAN": case "TIT1": case "TIT2": case "TIT3": case "TALB": case "TPE2": case "TPE3": case "TPE4": case "TRCK": case "TPOS": case "TKEY": case "TMED": case "TPUB": case "TCOP": case "TEXT": case "TSSE": case "TSRC":
                    if (!verify([1].concat(UTFBOM))) throw new Error("Unsupported encoding for frame " + frame.name);
                    scanned += [1].concat(UTFBOM).length;
                case "WCOM": case "WCOP": case "WOAF": case "WOAR": case "WOAS": case "WORS": case "WPAY": case "WPUB":
                    frame.value = bytesToStr(extract(remainingFrame - 1));
                    scanned += remainingFrame - 1;
                    break;
                case "TXXX": case "USLT": case "COMM":
                    if (!verify([1])) throw new Error("Unsupported encoding for frame " + frame.name);
                    scanned += 1;
                    remainingFrame -= 1;
                    if (frame.name != "TXXX") {
                        frame.language = Array.from(extract(3));
                        scanned += 3;
                        remainingFrame -= 3;
                    }
                    if (!verify(UTFBOM)) throw new Error("Unsupported encoding for frame " + frame.name);
                    scanned += UTFBOM.length;
                    remainingFrame -= UTFBOM.length;
                    frame.description = bytesToStr(extract(remainingFrame - 2));
                    scanned += frame.description.length + 2;
                    remainingFrame -= frame.description.length + 2;
                    if (!verify([0, 0].concat(UTFBOM))) throw new Error("Unsupported encoding for frame " + frame.name);
                    scanned += [0, 0].concat(UTFBOM).length;
                    remainingFrame -= [0, 0].concat(UTFBOM).length;
                    frame.value = bytesToStr(extract(remainingFrame));
                    scanned += remainingFrame;
                    break;
                case "TBPM": case "TLEN": case "TDAT": case "TYER":
                    if (!verify([0])) throw new Error("Unsupported encoding for frame " + frame.name);
                    frame.value = parseInt(bytesToStr(extract(remainingFrame - 1)), 10);
                    scanned += remainingFrame;
                    break;
                case "PRIV":
                    frame.id = bytesToStr(extract(remainingFrame - 1));
                    scanned += frame.id.length + 1;
                    remainingFrame -= frame.id.length + 1;
                    frame.value = extract(remainingFrame - 1 - frame.id.length);
                    scanned += frame.value.byteLength;
                    break;
                case "APIC":
                    frame.useUnicodeEncoding = extract(1)[0]===1;
                    frame.mimeType = bytesToStr(extract(remainingFrame - 1 - 1 - 1));
                    scanned += frame.mimeType.length + 1;
                    remainingFrame -= frame.mimeType.length + 1;
                    if (!verify([0])) throw new Error("Unsupported encoding for frame " + frame.name);
                    frame.pictureType = extract(1)[0];
                    scanned += 1;
                    remainingFrame -= 1;
                    if (frame.useUnicodeEncoding) {
                        if (!verify(UTFBOM)) throw new Error("Unsupported encoding for frame " + frame.name);
                        scanned += UTFBOM.length;
                        remainingFrame -= UTFBOM.length;
                        frame.description = bytesToStr(extract(remainingFrame - 2));
                        scanned += frame.description.length + 2;
                        remainingFrame -= frame.description.length + 2;
                    } else {
                        frame.description = bytesToStr(extract(remainingFrame - 1));
                        scanned += frame.description.length + 2;
                        remainingFrame -= frame.description.length + 2;
                    }
                    frame.value = extract(remainingFrame);
                    scanned += frame.value.length;
                    break;
                case "IPLS":
                    if (!verify([1])) throw new Error("Unsupported encoding for frame " + frame.name);
                    scanned += 1;
                    remainingFrame -= 1;
                    /** @type {[string, number][]} */
                    frame.value = [];
                    while (remainingFrame > 0) {
                        if (!verify(UTFBOM)) throw new Error("Unsupported encoding for frame " + frame.name);
                        scanned += UTFBOM.length;
                        remainingFrame -= UTFBOM.length;
                        const str = bytesToStr(extract(remainingFrame - 2));
                        scanned += str.length + 2;
                        remainingFrame -= str.length + 2;
                        if (!verify([0, 0].concat(UTFBOM))) throw new Error("Unsupported encoding for frame " + frame.name);
                        scanned += [0, 0].concat(UTFBOM).length;
                        remainingFrame -= [0, 0].concat(UTFBOM).length;
                        const num = parseInt(bytesToStr(extract(remainingFrame - 2)), 10);
                        scanned += num.toString().length + 2;
                        remainingFrame -= num.toString().length + 2;
                        frame.value.push([str, num]);
                        if (!verify([0, 0])) throw new Error("Unsupported encoding for frame " + frame.name);
                        scanned += 2;
                        remainingFrame -= 2;
                    }
                    break;
                case "SYLT": 
                    if (!verify([1])) throw new Error("Unsupported encoding for frame " + frame.name);
                    scanned += 1;
                    remainingFrame -= 1;
                    frame.language = Array.from(extract(3));
                    scanned += 3;
                    remainingFrame -= 3;
                    frame.timestampFormat = extract(1)[0];
                    scanned += 1;
                    remainingFrame -= 1;
                    frame.type = extract(1)[0];
                    scanned += 1;
                    remainingFrame -= 1;
                    if (!verify(UTFBOM)) throw new Error("Unsupported encoding for frame " + frame.name);
                    scanned += UTFBOM.length;
                    remainingFrame -= UTFBOM.length;
                    frame.description = bytesToStr(extract(remainingFrame - 2));
                    scanned += frame.description.length + 2;
                    remainingFrame -= frame.description.length + 2;
                    /** @type {[string, number][]} */
                    frame.value = [];
                    while (remainingFrame > 0) {
                        if (!verify(UTFBOM)) throw new Error("Unsupported encoding for frame " + frame.name);
                        scanned += UTFBOM.length;
                        remainingFrame -= UTFBOM.length;
                        const str = bytesToStr(extract(remainingFrame - 2));
                        scanned += str.length + 2;
                        remainingFrame -= str.length + 2;
                        if (!verify([0, 0])) throw new Error("Unsupported encoding for frame " + frame.name);
                        scanned += 2;
                        remainingFrame -= 2;
                        const num = (extract(4)[0] << 24) + (extract(4)[1] << 16) + (extract(4)[2] << 8) + extract(4)[3];
                        scanned += 4;
                        remainingFrame -= 4;
                        frame.value.push([str, num]);
                    }
                    break;
                default:
                    throw new Error(`Unsupported frame ${frame.name}`)
            }
            scanned += remainingFrame;
            frames.push(frame);
        }
        const remaining = Uint.subarray(scanned);
        return { frames: frames, remaining: remaining.buffer };
    }
    getBlob() {
        return new Blob([this.arrayBuffer], {
            type: "audio/mpeg"
        }
        )
    }
    getURL() {
        return this.url || (this.url = URL.createObjectURL(this.getBlob())), this.url
    }
    revokeURL() {
        URL.revokeObjectURL(this.url)
    }

}
export {
    Id3Editor as Id3Editor
}
    ;
