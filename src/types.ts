
export interface Word {
    word: string;
    lexId: number;
}

export interface Pointer {
    pointerSymbol: string;
    synsetOffset: number;
    pos: string;
    sourceTargetHex: string;
}

export interface Meta {
    synsetOffset: number;
    lexFilenum: number;
    synsetType: string;
    wordCount: number;
    words: Word[];
    pointerCount: number;
    pointers: Pointer[];
}

export interface Definition {
    glossary: string;
    meta: Meta;
}


