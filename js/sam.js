

// flags ampl1 freq1 ampl2 freq2 ampl3 freq3 pitch
//------------------------------------------------

function draw_speech(canvas)
{
    var speech = sam_mixed;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    var colors = ["#F00","#C44","#00F","#44C"];

    function rng(n,m) {
        n = n/m*canvas.height;
        return canvas.height - n;
    }
    for (var n = 0; n < 4; n++) {
        ctx.strokeStyle = colors[n];
        ctx.beginPath();
        for (var i = 0; i < speech.length; i += 8) {
            switch (n) {
                case 0: y = rng(speech[i+2]*16,1200); break; // f1
                case 1: y = rng(speech[i+4]*16,1200); break; // f2
                case 2: y = rng(speech[i+1],32); break;    // a1
                case 3: y = rng(speech[i+3],32); break;    // a2
            }
            if (i == 0)
                ctx.moveTo(i/4,y);
            else
                ctx.lineTo(i/4,y);
        }
        ctx.stroke();
    }
    draw_formants(canvas);
}

function draw_formants(canvas)
{
    combined_tables();
    var speech = sam_mixed;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.font = "16px arial";

    for (var i = 0; i < freq1data.length; i++) {
        var f1 = freq1data[i]*24;
        var f2 = freq2data[i]*24;
        var vowel = flags[i] & 0x80;
        var consonant = flags[i] & 0x40;
        var voiced = flags[i] & 0x04;

        var y = (f1 - 100)/2;
        var x = (2700-f2)/4;
        ctx.fillStyle = voiced ? '#FFF' : '#88F';
        ctx.fillText(phoname_ipa(i),x,y);
    }
}

// Looks like it's used as bit flags
// High bits masked by 248 (11111000)
//
// 32: S*    241         11110001
// 33: SH    226         11100010
// 34: F*    211         11010011
// 35: TH    187         10111011
// 36: /H    124         01111100
// 37: /X    149         10010101
// 38: Z*    1           00000001
// 39: ZH    2           00000010
// 40: V*    3           00000011
// 41: DH    3           00000011
// 43: **    114         01110010
// 45: **    2           00000010
// 67: **    27          00011011
// 70: **    25          00011001
// tab45936

var sampledConsonantFlags =
[
    0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,
    0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,
    0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,
    0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,
    0xF1 , 0xE2 , 0xD3 , 0xBB , 0x7C , 0x95 , 1 , 2 ,
    3 , 3 , 0 , 0x72 , 0 , 2 , 0 , 0 ,
    0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,
    0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,
    0 , 0 , 0 , 0x1B , 0 , 0 , 0x19 , 0 ,
    0 , 0 , 0 , 0 , 0 , 0 , 0 , 0
];


//tab45056
var freq1data = [
    0x00 ,0x13 ,0x13 ,0x13 ,0x13 , 0xA , 0xE ,0x12
    ,  0x18 ,0x1A ,0x16 ,0x14 ,0x10 ,0x14 , 0xE ,0x12
    ,   0xE ,0x12 ,0x12 ,0x10 , 0xC , 0xE , 0xA ,0x12
    ,   0xE ,0xA  , 8  , 6  , 6  ,  6 ,  6 ,0x11
    ,    6 , 6 , 6 , 6 ,0xE , 0x10 , 9 ,0xA
    ,    8 ,0xA , 6 , 6 , 6 , 5 , 6 , 0
    ,  0x12 , 0x1A , 0x14 , 0x1A , 0x12 ,0xC , 6 , 6
    ,    6 , 6 , 6 , 6 , 6 , 6 , 6 , 6
    ,    6 , 6 , 6 , 6 , 6 , 6 , 6 , 6
    ,    6 ,0xA ,0xA , 6 , 6 , 6 , 0x2C , 0x13
];

//about 
var freq2data = [
    0x00 , 0x43 , 0x43 , 0x43 , 0x43 , 0x54 , 0x48 , 0x42 ,
    0x3E , 0x28 , 0x2C , 0x1E , 0x24 , 0x2C , 0x48 , 0x30 ,
    0x24 , 0x1E , 0x32 , 0x24 , 0x1C , 0x44 , 0x18 , 0x32 ,
    0x1E , 0x18 , 0x52 , 0x2E , 0x36 , 0x56 , 0x36 , 0x43 ,
    0x49 , 0x4F , 0x1A , 0x42 , 0x49 , 0x25 , 0x33 , 0x42 ,
    0x28 , 0x2F , 0x4F , 0x4F , 0x42 , 0x4F , 0x6E , 0x00 ,
    0x48 , 0x26 , 0x1E , 0x2A , 0x1E , 0x22 , 0x1A , 0x1A ,
    0x1A , 0x42 , 0x42 , 0x42 , 0x6E , 0x6E , 0x6E , 0x54 ,
    0x54 , 0x54 , 0x1A , 0x1A , 0x1A , 0x42 , 0x42 , 0x42 ,
    0x6D , 0x56 , 0x6D , 0x54 , 0x54 , 0x54 , 0x7F , 0x7F
];

//tab45216
var freq3data = [
    0x00 , 0x5B , 0x5B , 0x5B , 0x5B , 0x6E , 0x5D , 0x5B ,
    0x58 , 0x59 , 0x57 , 0x58 , 0x52 , 0x59 , 0x5D , 0x3E ,
    0x52 , 0x58 , 0x3E , 0x6E , 0x50 , 0x5D , 0x5A , 0x3C ,
    0x6E , 0x5A , 0x6E , 0x51 , 0x79 , 0x65 , 0x79 , 0x5B ,
    0x63 , 0x6A , 0x51 , 0x79 , 0x5D , 0x52 , 0x5D , 0x67 ,
    0x4C , 0x5D , 0x65 , 0x65 , 0x79 , 0x65 , 0x79 , 0x00 ,
    0x5A , 0x58 , 0x58 , 0x58 , 0x58 , 0x52 , 0x51 , 0x51 ,
    0x51 , 0x79 , 0x79 , 0x79 , 0x70 , 0x6E , 0x6E , 0x5E ,
    0x5E , 0x5E , 0x51 , 0x51 , 0x51 , 0x79 , 0x79 , 0x79 ,
    0x65 , 0x65 , 0x70 , 0x5E , 0x5E , 0x5E , 0x08 , 0x01
];

var ampl1data = [
    0 , 0 , 0 , 0 , 0 ,0xD ,0xD ,0xE ,
    0xF ,0xF ,0xF ,0xF ,0xF ,0xC ,0xD ,0xC ,
    0xF ,0xF ,0xD ,0xD ,0xD ,0xE ,0xD ,0xC ,
    0xD ,0xD ,0xD ,0xC , 9 , 9 , 0 , 0 ,
    0 , 0 , 0 , 0 , 0 , 0 ,0xB ,0xB ,
    0xB ,0xB , 0 , 0 , 1 ,0xB , 0 , 2 ,
    0xE ,0xF ,0xF ,0xF ,0xF ,0xD , 2 , 4 ,
    0 , 2 , 4 , 0 , 1 , 4 , 0 , 1 ,
    4 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,
    0 ,0xC , 0 , 0 , 0 , 0 ,0xF ,0xF
];

var ampl2data = [
    0 , 0 , 0 , 0 , 0 ,0xA ,0xB ,0xD ,
    0xE ,0xD ,0xC ,0xC ,0xB , 9 ,0xB ,0xB ,
    0xC ,0xC ,0xC , 8 , 8 ,0xC , 8 ,0xA ,
    8 , 8 ,0xA , 3 , 9 , 6 , 0 , 0 ,
    0 , 0 , 0 , 0 , 0 , 0 , 3 , 5 ,
    3 , 4 , 0 , 0 , 0 , 5 ,0xA , 2 ,
    0xE ,0xD ,0xC ,0xD ,0xC , 8 , 0 , 1 ,
    0 , 0 , 1 , 0 , 0 , 1 , 0 , 0 ,
    1 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,
    0 ,0xA , 0 , 0 ,0xA , 0 , 0 , 0
];

var ampl3data = [
    0 , 0 , 0 , 0 , 0 , 8 , 7 , 8 ,
    8 , 1 , 1 , 0 , 1 , 0 , 7 , 5 ,
    1 , 0 , 6 , 1 , 0 , 7 , 0 , 5 ,
    1 , 0 , 8 , 0 , 0 , 3 , 0 , 0 ,
    0 , 0 , 0 , 0 , 0 , 0 , 0 , 1 ,
    0 , 0 , 0 , 0 , 0 , 1 ,0xE , 1 ,
    9 , 1 , 0 , 1 , 0 , 0 , 0 , 0 ,
    0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,
    0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,
    0 , 7 , 0 , 0 , 5 , 0 , 0x13 , 0x10
];


// Used to decide which phoneme's blend lengths. The candidate with the lower score is selected.
// tab45856
var blendRank = 
[
    0 , 0x1F , 0x1F , 0x1F , 0x1F , 2 , 2 , 2 ,
    2 , 2 , 2 , 2 , 2 , 2 , 5 , 5 ,
    2 ,0xA , 2 , 8 , 5 , 5 ,0xB ,0xA ,
    9 , 8 , 8 , 0xA0 , 8 , 8 , 0x17 , 0x1F ,
    0x12 , 0x12 , 0x12 , 0x12 , 0x1E , 0x1E , 0x14 , 0x14 ,
    0x14 , 0x14 , 0x17 , 0x17 , 0x1A , 0x1A , 0x1D , 0x1D ,
    2 , 2 , 2 , 2 , 2 , 2 , 0x1A , 0x1D ,
    0x1B , 0x1A , 0x1D , 0x1B , 0x1A , 0x1D , 0x1B , 0x1A ,
    0x1D , 0x1B , 0x17 , 0x1D , 0x17 , 0x17 , 0x1D , 0x17 ,
    0x17 , 0x1D , 0x17 , 0x17 , 0x1D , 0x17 , 0x17 , 0x17
];


// Number of frames at the end of a phoneme devoted to interpolating to next phoneme's final value
var outBlendLength =
[
    0 , 2 , 2 , 2 , 2 , 4 , 4 , 4 ,
    4 , 4 , 4 , 4 , 4 , 4 , 4 , 4 ,
    4 , 4 , 3 , 2 , 4 , 4 , 2 , 2 ,
    2 , 2 , 2 , 1 , 1 , 1 , 1 , 1 ,
    1 , 1 , 1 , 1 , 1 , 1 , 2 , 2 ,
    2 , 1 , 0 , 1 , 0 , 1 , 0 , 5 ,
    5 , 5 , 5 , 5 , 4 , 4 , 2 , 0 ,
    1 , 2 , 0 , 1 , 2 , 0 , 1 , 2 ,
    0 , 1 , 2 , 0 , 2 , 2 , 0 , 1 ,
    3 , 0 , 2 , 3 , 0 , 2 , 0xA0 , 0xA0
];


// Number of frames at beginning of a phoneme devoted to interpolating to phoneme's final value
var inBlendLength =
[
    0 , 2 , 2 , 2 , 2 , 4 , 4 , 4 ,
    4 , 4 , 4 , 4 , 4 , 4 , 4 , 4 ,
    4 , 4 , 3 , 3 , 4 , 4 , 3 , 3 ,
    3 , 3 , 3 , 1 , 2 , 3 , 2 , 1 ,
    3 , 3 , 3 , 3 , 1 , 1 , 3 , 3 ,
    3 , 2 , 2 , 3 , 2 , 3 , 0 , 0 ,
    5 , 5 , 5 , 5 , 4 , 4 , 2 , 0 ,
    2 , 2 , 0 , 3 , 2 , 0 , 4 , 2 ,
    0 , 3 , 2 , 0 , 2 , 2 , 0 , 2 ,
    3 , 0 , 3 , 3 , 0 , 3 , 0xB0 , 0xA0
];


//tab45616???
var phonemeStressedLengthTable =
[
    0x00 , 0x12 , 0x12 , 0x12 , 8 ,0xB , 9 ,0xB ,
    0xE ,0xF ,0xB , 0x10 ,0xC , 6 , 6 ,0xE ,
    0xC ,0xE ,0xC ,0xB , 8 , 8 ,0xB ,0xA ,
    9 , 8 , 8 , 8 , 8 , 8 , 3 , 5 ,
    2 , 2 , 2 , 2 , 2 , 2 , 6 , 6 ,
    8 , 6 , 6 , 2 , 9 , 4 , 2 , 1 ,
    0xE ,0xF ,0xF ,0xF ,0xE ,0xE , 8 , 2 ,
    2 , 7 , 2 , 1 , 7 , 2 , 2 , 7 ,
    2 , 2 , 8 , 2 , 2 , 6 , 2 , 2 ,
    7 , 2 , 4 , 7 , 1 , 4 , 5 , 5
];

//tab45536???
var phonemeLengthTable =
[
    0 , 0x12 , 0x12 , 0x12 , 8 , 8 , 8 , 8 ,
    8 ,0xB , 6 ,0xC ,0xA , 5 , 5 ,0xB ,
    0xA ,0xA ,0xA , 9 , 8 , 7 , 9 , 7 ,
    6 , 8 , 6 , 7 , 7 , 7 , 2 , 5 ,
    2 , 2 , 2 , 2 , 2 , 2 , 6 , 6 ,
    7 , 6 , 6 , 2 , 8 , 3 , 1 , 0x1E ,
    0xD ,0xC ,0xC ,0xC ,0xE , 9 , 6 , 1 ,
    2 , 5 , 1 , 1 , 6 , 1 , 2 , 6 ,
    1 , 2 , 8 , 2 , 2 , 4 , 2 , 2 ,
    6 , 1 , 4 , 6 , 1 , 4 , 0xC7 , 0xFF
];

var amplitudeRescale = [
    0 , 1 , 2 , 2 , 2 , 3 , 3 , 4 ,
    4 , 5 , 6 , 8 , 9 ,0xB ,0xD ,0xF, 0  //17 elements?
];

var flags_name = ["PLOSIVE","STOPPED","VOICED","FLAG08","DIPTHONG","DIPTHONG_YX","CONSONANT","VOWEL"];
var flags2_name = ["PUNCT","FLAG02","ALVEOLAR","NASAL","LIQUID","FRICATIVE","FLAG40","PAUSE?"];
function fnames(n,names)
{
    var list=[];
    for (var i = 0; i < 8; i++) {
        if ((1 << i) & n)
            list.push(names[i]);
    }
    return list;
}


// just multiply vowels
/*
DESCRIPTION          SPEED     PITCH     THROAT    MOUTH
Elf                   72        64        110       160
Little Robot          92        60        190       190
Stuffy Guy            82        72        110       105
Little Old Lady       82        32        145       145
Extra-Terrestrial    100        64        150       200
SAM                   72        64        128       128
*/

function SetMouthThroat(mouth,throat)
{
// throat formants (F1) 5..29
    var mouthFormants5_29 = [
        //0, 0, 0, 0, 0, 
        10, 14, 19, 24, 27, 23, 21, 16, 
        20, 14, 18, 14, 18, 18, 16, 13, 
        15, 11, 18, 14, 11, 9, 6, 6, 6
    ];

    // throat formants (F2) 5..29
    var throatFormants5_29 = [
    //255, 255, 255, 255, 255, 
        84, 73, 67, 63, 40, 44, 31, 37,
        45, 73, 49, 36, 30, 51, 37, 29,
        69, 24, 50, 30, 24, 83, 46, 54, 86
    ];

    // there must be no zeros in this 2 tables
    // formant 1 frequencies (mouth) 48..53
    var mouthFormants48_53 = [19, 27, 21, 27, 18, 13];

    // formant 2 frequencies (throat) 48..53
    var throatFormants48_53 =[72, 39, 31, 43, 30, 34];

    for (var i = 0; i < mouthFormants5_29.length; i++) {
        freq1data[5+i] = mouthFormants5_29[i]*mouth >> 7;
        freq2data[5+i] = throatFormants5_29[i]*throat >> 7;
    }
    for (var i = 0; i < mouthFormants48_53.length; i++) {
        freq1data[48+i] = mouthFormants48_53[i]*mouth >> 7;
        freq2data[48+i] = throatFormants48_53[i]*throat >> 7;
    }
}

//loc_9F8C
var flags = [
    0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0xA4 , 0xA4 , 0xA4 ,
    0xA4 , 0xA4 , 0xA4 , 0x84 , 0x84 , 0xA4 , 0xA4 , 0x84 ,
    0x84 , 0x84 , 0x84 , 0x84 , 0x84 , 0x84 , 0x44 , 0x44 ,
    0x44 , 0x44 , 0x44 , 0x4C , 0x4C , 0x4C , 0x48 , 0x4C ,
    0x40 , 0x40 , 0x40 , 0x40 , 0x40 , 0x40 , 0x44 , 0x44 ,
    0x44 , 0x44 , 0x48 , 0x40 , 0x4C , 0x44 , 0x00 , 0x00 ,
    0xB4 , 0xB4 , 0xB4 , 0x94 , 0x94 , 0x94 , 0x4E , 0x4E ,
    0x4E , 0x4E , 0x4E , 0x4E , 0x4E , 0x4E , 0x4E , 0x4E ,
    0x4E , 0x4E , 0x4B , 0x4B , 0x4B , 0x4B , 0x4B , 0x4B ,
    0x4B , 0x4B , 0x4B , 0x4B , 0x4B , 0x4B , 0x80 , 0xC1 ,
    0xC1
];

var flags2 =
[
    0x80 , 0xC1 , 0xC1 , 0xC1 , 0xC1 , 0x00 , 0x00 , 0x00 ,
    0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 ,
    0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x10 ,
    0x10 , 0x10 , 0x10 , 0x08 , 0x0C , 0x08 , 0x04 , 0x40 ,
    0x24 , 0x20 , 0x20 , 0x24 , 0x00 , 0x00 , 0x24 , 0x20 ,
    0x20 , 0x24 , 0x20 , 0x20 , 0x00 , 0x20 , 0x00 , 0x00 ,
    0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 ,
    0x00 , 0x04 , 0x04 , 0x04 , 0x00 , 0x00 , 0x00 , 0x00 ,
    0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x04 , 0x04 , 0x04 ,
    0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00
];


//1 bit samples
var _sampleTable =
[
    //00 38: Z* 01
    0x38 , 0x84 , 0x6B , 0x19 , 0xC6 , 0x63 ,  0x18 , 0x86
    ,  0x73 , 0x98 , 0xC6 , 0xB1 , 0x1C , 0xCA , 0x31 , 0x8C
    ,  0xC7 , 0x31 , 0x88 , 0xC2 , 0x30 , 0x98 , 0x46 , 0x31
    ,  0x18 , 0xC6 , 0x35 ,0xC , 0xCA , 0x31 ,0xC , 0xC6
    //20
    ,  0x21 , 0x10 , 0x24 , 0x69 , 0x12 , 0xC2 , 0x31 , 0x14
    ,  0xC4 , 0x71 , 8 , 0x4A , 0x22 , 0x49 , 0xAB , 0x6A
    ,  0xA8 , 0xAC , 0x49 , 0x51 , 0x32 , 0xD5 , 0x52 , 0x88
    ,  0x93 , 0x6C , 0x94 , 0x22 , 0x15 , 0x54 , 0xD2 , 0x25
    //40
    ,  0x96 , 0xD4 , 0x50 , 0xA5 , 0x46 , 0x21 , 8 , 0x85
    ,  0x6B , 0x18 , 0xC4 , 0x63 , 0x10 , 0xCE , 0x6B , 0x18
    ,  0x8C , 0x71 , 0x19 , 0x8C , 0x63 , 0x35 ,0xC , 0xC6
    ,  0x33 , 0x99 , 0xCC , 0x6C , 0xB5 , 0x4E , 0xA2 , 0x99
    //60
    ,  0x46 , 0x21 , 0x28 , 0x82 , 0x95 , 0x2E , 0xE3 , 0x30
    ,  0x9C , 0xC5 , 0x30 , 0x9C , 0xA2 , 0xB1 , 0x9C , 0x67
    ,  0x31 , 0x88 , 0x66 , 0x59 , 0x2C , 0x53 , 0x18 , 0x84
    ,  0x67 , 0x50 , 0xCA , 0xE3 ,0xA , 0xAC , 0xAB , 0x30
    //80
    ,  0xAC , 0x62 , 0x30 , 0x8C , 0x63 , 0x10 , 0x94 , 0x62
    ,  0xB1 , 0x8C , 0x82 , 0x28 , 0x96 , 0x33 , 0x98 , 0xD6
    ,  0xB5 , 0x4C , 0x62 , 0x29 , 0xA5 , 0x4A , 0xB5 , 0x9C
    ,  0xC6 , 0x31 , 0x14 , 0xD6 , 0x38 , 0x9C , 0x4B , 0xB4
    //A0
    ,  0x86 , 0x65 , 0x18 , 0xAE , 0x67 , 0x1C , 0xA6 , 0x63
    ,  0x19 , 0x96 , 0x23 , 0x19 , 0x84 , 0x13 , 8 , 0xA6
    ,  0x52 , 0xAC , 0xCA , 0x22 , 0x89 , 0x6E , 0xAB , 0x19
    ,  0x8C , 0x62 , 0x34 , 0xC4 , 0x62 , 0x19 , 0x86 , 0x63
    //C0
    ,  0x18 , 0xC4 , 0x23 , 0x58 , 0xD6 , 0xA3 , 0x50 , 0x42
    ,  0x54 , 0x4A , 0xAD , 0x4A , 0x25 , 0x11 , 0x6B , 0x64
    ,  0x89 , 0x4A , 0x63 , 0x39 , 0x8A , 0x23 , 0x31 , 0x2A
    ,  0xEA , 0xA2 , 0xA9 , 0x44 , 0xC5 , 0x12 , 0xCD , 0x42
    //E0
    ,  0x34 , 0x8C , 0x62 , 0x18 , 0x8C , 0x63 , 0x11 , 0x48
    ,  0x66 , 0x31 , 0x9D , 0x44 , 0x33 , 0x1D , 0x46 , 0x31
    ,  0x9C , 0xC6 , 0xB1 ,0xC , 0xCD , 0x32 , 0x88 , 0xC4
    ,  0x73 , 0x18 , 0x86 , 0x73 , 8 , 0xD6 , 0x63 , 0x58


    //100 ZH 02
    ,    7 , 0x81 , 0xE0 , 0xF0 , 0x3C , 7 , 0x87 , 0x90
    ,  0x3C , 0x7C ,0xF , 0xC7 , 0xC0 , 0xC0 , 0xF0 , 0x7C
    ,  0x1E , 7 , 0x80 , 0x80 , 0 , 0x1C , 0x78 , 0x70
    ,  0xF1 , 0xC7 , 0x1F , 0xC0 ,0xC , 0xFE , 0x1C , 0x1F
    //120
    ,  0x1F ,0xE ,0xA , 0x7A , 0xC0 , 0x71 , 0xF2 , 0x83
    ,  0x8F , 3 ,0xF ,0xF ,0xC , 0 , 0x79 , 0xF8
    ,  0x61 , 0xE0 , 0x43 ,0xF , 0x83 , 0xE7 , 0x18 , 0xF9
    ,  0xC1 , 0x13 , 0xDA , 0xE9 , 0x63 , 0x8F ,0xF , 0x83
    //140
    ,  0x83 , 0x87 , 0xC3 , 0x1F , 0x3C , 0x70 , 0xF0 , 0xE1
    ,  0xE1 , 0xE3 , 0x87 , 0xB8 , 0x71 ,0xE , 0x20 , 0xE3
    ,  0x8D , 0x48 , 0x78 , 0x1C , 0x93 , 0x87 , 0x30 , 0xE1
    ,  0xC1 , 0xC1 , 0xE4 , 0x78 , 0x21 , 0x83 , 0x83 , 0xC3
    //160
    ,  0x87 , 6 , 0x39 , 0xE5 , 0xC3 , 0x87 , 7 ,0xE
    ,  0x1C , 0x1C , 0x70 , 0xF4 , 0x71 , 0x9C , 0x60 , 0x36
    ,  0x32 , 0xC3 , 0x1E , 0x3C , 0xF3 , 0x8F ,0xE , 0x3C
    ,  0x70 , 0xE3 , 0xC7 , 0x8F ,0xF ,0xF ,0xE , 0x3C
    //180
    ,  0x78 , 0xF0 , 0xE3 , 0x87 , 6 , 0xF0 , 0xE3 , 7
    ,  0xC1 , 0x99 , 0x87 ,0xF , 0x18 , 0x78 , 0x70 , 0x70
    ,  0xFC , 0xF3 , 0x10 , 0xB1 , 0x8C , 0x8C , 0x31 , 0x7C
    ,  0x70 , 0xE1 , 0x86 , 0x3C , 0x64 , 0x6C , 0xB0 , 0xE1
    //1A0
    ,  0xE3 ,0xF , 0x23 , 0x8F ,0xF , 0x1E , 0x3E , 0x38
    ,  0x3C , 0x38 , 0x7B , 0x8F , 7 ,0xE , 0x3C , 0xF4
    ,  0x17 , 0x1E , 0x3C , 0x78 , 0xF2 , 0x9E , 0x72 , 0x49
    ,  0xE3 , 0x25 , 0x36 , 0x38 , 0x58 , 0x39 , 0xE2 , 0xDE
    //1C0
    ,  0x3C , 0x78 , 0x78 , 0xE1 , 0xC7 , 0x61 , 0xE1 , 0xE1
    ,  0xB0 , 0xF0 , 0xF0 , 0xC3 , 0xC7 ,0xE , 0x38 , 0xC0
    ,  0xF0 , 0xCE , 0x73 , 0x73 , 0x18 , 0x34 , 0xB0 , 0xE1
    ,  0xC7 , 0x8E , 0x1C , 0x3C , 0xF8 , 0x38 , 0xF0 , 0xE1
    //1E0
    ,  0xC1 , 0x8B , 0x86 , 0x8F , 0x1C , 0x78 , 0x70 , 0xF0
    ,  0x78 , 0xAC , 0xB1 , 0x8F , 0x39 , 0x31 , 0xDB , 0x38
    ,  0x61 , 0xC3 ,0xE ,0xE , 0x38 , 0x78 , 0x73 , 0x17
    ,  0x1E , 0x39 , 0x1E , 0x38 , 0x64 , 0xE1 , 0xF1 , 0xC1


    //200 V*, DH
    ,  0x4E ,0xF , 0x40 , 0xA2 , 2 , 0xC5 , 0x8F , 0x81
    ,  0xA1 , 0xFC , 0x12 , 8 , 0x64 , 0xE0 , 0x3C , 0x22
    ,  0xE0 , 0x45 , 7 , 0x8E ,0xC , 0x32 , 0x90 , 0xF0
    ,  0x1F , 0x20 , 0x49 , 0xE0 , 0xF8 ,0xC , 0x60 , 0xF0
    //220
    ,  0x17 , 0x1A , 0x41 , 0xAA , 0xA4 , 0xD0 , 0x8D , 0x12
    ,  0x82 , 0x1E , 0x1E , 3 , 0xF8 , 0x3E , 3 ,0xC
    ,  0x73 , 0x80 , 0x70 , 0x44 , 0x26 , 3 , 0x24 , 0xE1
    ,  0x3E , 4 , 0x4E , 4 , 0x1C , 0xC1 , 9 , 0xCC
    //240
    ,  0x9E , 0x90 , 0x21 , 7 , 0x90 , 0x43 , 0x64 , 0xC0
    ,   0xF , 0xC6 , 0x90 , 0x9C , 0xC1 , 0x5B , 3 , 0xE2
    ,  0x1D , 0x81 , 0xE0 , 0x5E , 0x1D , 3 , 0x84 , 0xB8
    ,  0x2C ,0xF , 0x80 , 0xB1 , 0x83 , 0xE0 , 0x30 , 0x41
    //260
    ,  0x1E , 0x43 , 0x89 , 0x83 , 0x50 , 0xFC , 0x24 , 0x2E
    ,  0x13 , 0x83 , 0xF1 , 0x7C , 0x4C , 0x2C , 0xC9 ,0xD
    ,  0x83 , 0xB0 , 0xB5 , 0x82 , 0xE4 , 0xE8 , 6 , 0x9C
    ,    7 , 0xA0 , 0x99 , 0x1D , 7 , 0x3E , 0x82 , 0x8F
    //280
    ,  0x70 , 0x30 , 0x74 , 0x40 , 0xCA , 0x10 , 0xE4 , 0xE8
    ,   0xF , 0x92 , 0x14 , 0x3F , 6 , 0xF8 , 0x84 , 0x88
    ,  0x43 , 0x81 ,0xA , 0x34 , 0x39 , 0x41 , 0xC6 , 0xE3
    ,  0x1C , 0x47 , 3 , 0xB0 , 0xB8 , 0x13 ,0xA , 0xC2
    //2A0
    ,  0x64 , 0xF8 , 0x18 , 0xF9 , 0x60 , 0xB3 , 0xC0 , 0x65
    ,  0x20 , 0x60 , 0xA6 , 0x8C , 0xC3 , 0x81 , 0x20 , 0x30
    ,  0x26 , 0x1E , 0x1C , 0x38 , 0xD3 , 1 , 0xB0 , 0x26
    ,  0x40 , 0xF4 ,0xB , 0xC3 , 0x42 , 0x1F , 0x85 , 0x32
    //2C0
    ,  0x26 , 0x60 , 0x40 , 0xC9 , 0xCB , 1 , 0xEC , 0x11
    ,  0x28 , 0x40 , 0xFA , 4 , 0x34 , 0xE0 , 0x70 , 0x4C
    ,  0x8C , 0x1D , 7 , 0x69 , 3 , 0x16 , 0xC8 , 4
    ,  0x23 , 0xE8 , 0xC6 , 0x9A ,0xB , 0x1A , 3 , 0xE0
    //2E0
    ,  0x76 , 6 , 5 , 0xCF , 0x1E , 0xBC , 0x58 , 0x31
    ,  0x71 , 0x66 , 0 , 0xF8 , 0x3F , 4 , 0xFC ,0xC
    ,  0x74 , 0x27 , 0x8A , 0x80 , 0x71 , 0xC2 , 0x3A , 0x26
    ,    6 , 0xC0 , 0x1F , 5 ,0xF , 0x98 , 0x40 , 0xAE

    //300
    ,    1 , 0x7F , 0xC0 , 7 , 0xFF , 0 ,0xE , 0xFE
    ,    0 , 3 , 0xDF , 0x80 , 3 , 0xEF , 0x80 , 0x1B
    ,  0xF1 , 0xC2 , 0 , 0xE7 , 0xE0 , 0x18 , 0xFC , 0xE0
    ,  0x21 , 0xFC , 0x80 , 0x3C , 0xFC , 0x40 ,0xE , 0x7E
    //320
    ,    0 , 0x3F , 0x3E , 0 ,0xF , 0xFE , 0 , 0x1F
    ,  0xFF , 0 , 0x3E , 0xF0 , 7 , 0xFC , 0 , 0x7E
    ,  0x10 , 0x3F , 0xFF , 0 , 0x3F , 0x38 ,0xE , 0x7C
    ,    1 , 0x87 ,0xC , 0xFC , 0xC7 , 0 , 0x3E , 4
    //340
    ,   0xF , 0x3E , 0x1F ,0xF ,0xF , 0x1F ,0xF , 2
    ,  0x83 , 0x87 , 0xCF , 3 , 0x87 ,0xF , 0x3F , 0xC0
    ,    7 , 0x9E , 0x60 , 0x3F , 0xC0 , 3 , 0xFE , 0
    ,  0x3F , 0xE0 , 0x77 , 0xE1 , 0xC0 , 0xFE , 0xE0 , 0xC3
    //360
    ,  0xE0 , 1 , 0xDF , 0xF8 , 3 , 7 , 0 , 0x7E
    ,  0x70 , 0 , 0x7C , 0x38 , 0x18 , 0xFE ,0xC , 0x1E
    ,  0x78 , 0x1C , 0x7C , 0x3E ,0xE , 0x1F , 0x1E , 0x1E
    ,  0x3E , 0 , 0x7F , 0x83 , 7 , 0xDB , 0x87 , 0x83
    //380
    ,    7 , 0xC7 , 7 , 0x10 , 0x71 , 0xFF , 0 , 0x3F
    ,  0xE2 , 1 , 0xE0 , 0xC1 , 0xC3 , 0xE1 , 0 , 0x7F
    ,  0xC0 , 5 , 0xF0 , 0x20 , 0xF8 , 0xF0 , 0x70 , 0xFE
    ,  0x78 , 0x79 , 0xF8 , 2 , 0x3F ,0xC , 0x8F , 3
    //3a0
    ,   0xF , 0x9F , 0xE0 , 0xC1 , 0xC7 , 0x87 , 3 , 0xC3
    ,  0xC3 , 0xB0 , 0xE1 , 0xE1 , 0xC1 , 0xE3 , 0xE0 , 0x71
    ,  0xF0 , 0 , 0xFC , 0x70 , 0x7C ,0xC , 0x3E , 0x38
    ,   0xE , 0x1C , 0x70 , 0xC3 , 0xC7 , 3 , 0x81 , 0xC1
    //3c0
    ,  0xC7 , 0xE7 , 0 ,0xF , 0xC7 , 0x87 , 0x19 , 9
    ,  0xEF , 0xC4 , 0x33 , 0xE0 , 0xC1 , 0xFC , 0xF8 , 0x70
    ,  0xF0 , 0x78 , 0xF8 , 0xF0 , 0x61 , 0xC7 , 0 , 0x1F
    ,  0xF8 , 1 , 0x7C , 0xF8 , 0xF0 , 0x78 , 0x70 , 0x3C
    //3e0
    ,  0x7C , 0xCE ,0xE , 0x21 , 0x83 , 0xCF , 8 , 7
    ,  0x8F , 8 , 0xC1 , 0x87 , 0x8F , 0x80 , 0xC7 , 0xE3
    ,    0 , 7 , 0xF8 , 0xE0 , 0xEF , 0 , 0x39 , 0xF7
    ,  0x80 ,0xE , 0xF8 , 0xE1 , 0xE3 , 0xF8 , 0x21 , 0x9F

    //400
    ,  0xC0 , 0xFF , 3 , 0xF8 , 7 , 0xC0 , 0x1F , 0xF8
    ,  0xC4 , 4 , 0xFC , 0xC4 , 0xC1 , 0xBC , 0x87 , 0xF0
    ,   0xF , 0xC0 , 0x7F , 5 , 0xE0 , 0x25 , 0xEC , 0xC0
    ,  0x3E , 0x84 , 0x47 , 0xF0 , 0x8E , 3 , 0xF8 , 3
    //420
    ,  0xFB , 0xC0 , 0x19 , 0xF8 , 7 , 0x9C ,0xC , 0x17
    ,  0xF8 , 7 , 0xE0 , 0x1F , 0xA1 , 0xFC ,0xF , 0xFC
    ,    1 , 0xF0 , 0x3F , 0 , 0xFE , 3 , 0xF0 , 0x1F
    ,    0 , 0xFD , 0 , 0xFF , 0x88 ,0xD , 0xF9 , 1
    //440
    ,  0xFF , 0 , 0x70 , 7 , 0xC0 , 0x3E , 0x42 , 0xF3
    ,   0xD , 0xC4 , 0x7F , 0x80 , 0xFC , 7 , 0xF0 , 0x5E
    ,  0xC0 , 0x3F , 0 , 0x78 , 0x3F , 0x81 , 0xFF , 1
    ,  0xF8 , 1 , 0xC3 , 0xE8 ,0xC , 0xE4 , 0x64 , 0x8F
    ////460
    ,  0xE4 ,0xF , 0xF0 , 7 , 0xF0 , 0xC2 , 0x1F , 0
    ,  0x7F , 0xC0 , 0x6F , 0x80 , 0x7E , 3 , 0xF8 , 7
    ,  0xF0 , 0x3F , 0xC0 , 0x78 ,0xF , 0x82 , 7 , 0xFE
    ,  0x22 , 0x77 , 0x70 , 2 , 0x76 , 3 , 0xFE , 0
    //480
    ,  0xFE , 0x67 , 0 , 0x7C , 0xC7 , 0xF1 , 0x8E , 0xC6
    ,  0x3B , 0xE0 , 0x3F , 0x84 , 0xF3 , 0x19 , 0xD8 , 3
    ,  0x99 , 0xFC , 9 , 0xB8 ,0xF , 0xF8 , 0 , 0x9D
    ,  0x24 , 0x61 , 0xF9 ,0xD , 0 , 0xFD , 3 , 0xF0
    //4a0
    ,  0x1F , 0x90 , 0x3F , 1 , 0xF8 , 0x1F , 0xD0 ,0xF
    ,  0xF8 , 0x37 , 1 , 0xF8 , 7 , 0xF0 ,0xF , 0xC0
    ,  0x3F , 0 , 0xFE , 3 , 0xF8 ,0xF , 0xC0 , 0x3F
    ,    0 , 0xFA , 3 , 0xF0 ,0xF , 0x80 , 0xFF , 1
    //4c0
    ,  0xB8 , 7 , 0xF0 , 1 , 0xFC , 1 , 0xBC , 0x80
    ,  0x13 , 0x1E , 0 , 0x7F , 0xE1 , 0x40 , 0x7F , 0xA0
    ,  0x7F , 0xB0 , 0 , 0x3F , 0xC0 , 0x1F , 0xC0 , 0x38
    ,   0xF , 0xF0 , 0x1F , 0x80 , 0xFF , 1 , 0xFC , 3
    //4e0
    ,  0xF1 , 0x7E , 1 , 0xFE , 1 , 0xF0 , 0xFF , 0
    ,  0x7F , 0xC0 , 0x1D , 7 , 0xF0 ,0xF , 0xC0 , 0x7E
    ,    6 , 0xE0 , 7 , 0xE0 ,0xF , 0xF8 , 6 , 0xC1
    ,  0xFE , 1 , 0xFC , 3 , 0xE0 ,0xF , 0 , 0xFC
];


//tab40682
var signInputTable1 = [
    ' ', '.', '?', ',', '-', 'I', 'I', 'E',
    'A', 'A', 'A', 'A', 'U', 'A', 'I', 'E',
    'U', 'O', 'R', 'L', 'W', 'Y', 'W', 'R',
    'L', 'W', 'Y', 'M', 'N', 'N', 'D', 'Q',
    'S', 'S', 'F', 'T', '/', '/', 'Z', 'Z',
    'V', 'D', 'C', '*', 'J', '*', '*', '*',
    'E', 'A', 'O', 'A', 'O', 'U', 'B', '*',
    '*', 'D', '*', '*', 'G', '*', '*', 'G',
    '*', '*', 'P', '*', '*', 'T', '*', '*',
    'K', '*', '*', 'K', '*', '*', 'U', 'U',
    'U'
];

//tab40763
var signInputTable2 = [
    '*', '*', '*', '*', '*', 'Y', 'H', 'H',
    'E', 'A', 'H', 'O', 'H', 'X', 'X', 'R',
    'X', 'H', 'X', 'X', 'X', 'X', 'H', '*',
    '*', '*', '*', '*', '*', 'X', 'X', '*',
    '*', 'H', '*', 'H', 'H', 'X', '*', 'H',
    '*', 'H', 'H', '*', '*', '*', '*', '*',
    'Y', 'Y', 'Y', 'W', 'W', 'W', '*', '*',
    '*', '*', '*', '*', '*', '*', '*', 'X',
    '*', '*', '*', '*', '*', '*', '*', '*',
    '*', '*', '*', 'X', '*', '*', 'L', 'M',
    'N'
];

function phoname(i) {
    if (i == 254)
        return "BRK";
    
    function iname() {
        switch (i) {
            case 43: return "CH2";

            case 45: return "J2";

            // stopped
            case 55: return "B2";
            case 56: return "B3";

            case 58: return "D2";
            case 59: return "D3";

            case 61: return "G2";
            case 62: return "G3";

            case 64: return "GX2";
            case 65: return "GX3";

            // plosize
            case 67: return "P2";
            case 68: return "P3";

            case 70: return "T2";
            case 71: return "T3";

            case 73: return "K2";
            case 74: return "K3";

            case 76: return "KX2";
            case 77: return "KX3";
        }
    }
	var s = signInputTable1[i] + signInputTable2[i];
	return s == "**" ? iname() : s;
}

function phoname_ipa(i) {
    var s = signInputTable1[i] + signInputTable2[i];
    if (s == "**")
        return "__" + i;
    if (signInputTable2[i] == "*")
        s = signInputTable1[i];

    switch (s) {
        case "/H": s = "HH"; break;
        case "UL": s = "AXL"; break;
        case "UM": s = "AXM"; break;
        case "UN": s = "AXN"; break;
    }
    if (!_arpabet2ipa[s]) {
        console.log("******* missing " + s);
        return '?';
    }
    return _arpabet2ipa[s];
}

/*
// https://www.piskelapp.com/
// https://github.com/DanielSWolf/rhubarb-lip-sync
Ⓐ 0
Closed mouth for the “P”, “B”, and “M” sounds. This is almost identical to the Ⓧ shape,
but there is ever-so-slight pressure between the lips.

Ⓑ 1
Slightly open mouth with clenched teeth. This mouth shape is used for most consonants
(“K”, “S”, “T”, etc.). It’s also used for some vowels such as the “EE” sound in bee.

Ⓒ 2
Open mouth. This mouth shape is used for vowels like “EH” as in men and “AE” as in bat.
It’s also used for some consonants, depending on context. This shape is also used as an
in-between when animating from Ⓐ or Ⓑ to Ⓓ. So make sure the animations ⒶⒸⒹ and ⒷⒸⒹ look smooth!

Ⓓ 3
Wide open mouth. This mouth shapes is used for vowels like “AA” as in father.

Ⓔ 4
Slightly rounded mouth. This mouth shape is used for vowels like “AO” as in off and “ER” as in bird.

Ⓕ 5
Puckered lips. This mouth shape is used for “UW” as in you, “OW” as in show, and “W” as in way.

Ⓖ 6
Upper teeth touching the lower lip for “F” as in for and “V” as in very.

Ⓗ 7
This shape is used for long “L” sounds, with the tongue raised behind the upper teeth.
The mouth should be at least far open as in Ⓒ, but not quite as far as in Ⓓ.
*/

// "PLOSIVE","STOPPED","VOICED","FLAG08","DIPTHONG","DIPTHONG_YX","CONSONANT","VOWEL"];

/*
    To phonetics: espeak?
    From SAM/espeak?
*/

function dictionary()
{
    var words = {};
    _sam_dict.split("\n").forEach(s => {
        var w = s.trim().split('=');
        if (w.length == 2) {
            var left = w[0].trim().split(" ");
            var right = w[1].trim().split(" ");
            for (var i = 0; i < left.length; i++)
                words[left[i].toLowerCase()] = right[i];
        }
    });
    console.log(words);
    return words;
}

//sam_say("Unaccustomed as I am to public speaking, I'd like to share with you a maxim I thought of the first time I met an IBM mainframe. Never trust a computer you can't lift.",false);
//sam_say("Obviously, I can talk, but right now I'd like to sit back and listen.",false);
//sam_say("So, it is with considerable pride that I introduce a man who's been like a father to me: Steve Jobs.",false);

function make_mouth()
{
    dictionary();

    var FLAG_VOWEL = 0x80;
    var FLAG_CONSONANT = 0x40;
    var FLAG_DIPTHONG_YX = 0x20;
    var FLAG_DIPTHONG = 0x10;
    var FLAG_FLAG08 = 0x08;
    var FLAG_VOICED= 0x04;
    var FLAG_STOPPED = 0x02;
    var FLAG_PLOSIVE = 0x01;

    var a = [];
    var pm = ["["];
    var last;
    for (var i = 0; i < 80; i++) {
        var mi = 0;
        var n = phoname(i);
        if (flags[i] & FLAG_CONSONANT)
            mi = 1;
        else if (flags[i] & FLAG_VOWEL)
            mi = 3;
        var no_match = 0;

        switch (n) {
            case "M*": // Closed mouth for the “P”, “B”, and “M” sounds.
            case "P*":
            case "P2":
            case "P3":
            case "B*":
            case "B2":
            case "B3":
            case "UM":
                mi = 0;
                break;

            // Slightly open mouth with clenched teeth. This mouth shape is used for most consonants
            // (“K”, “S”, “T”, etc.). It’s also used for some vowels such as the “EE” sound in bee.
           //     mi = 1;
            //    break;
            case "S*":
            case "K*":
            case "K2":
            case "K3":
            case "T*":
            case "T2":
            case "T3":
                mi = 1;
                break;

            case "YU": // Open mouth. This mouth shape is used for vowels like “EH” as in men and “AE” as in bat.
            case "AH":
            case "IY": // IY VOICED,DIPTHONG_YX,VOWEL
            case "EH": // EH VOICED,DIPTHONG_YX,VOWEL
                mi = 2;
                break;
            
            case "AA": // Wide open mouth. This mouth shapes is used for vowels like “AA” as in father.
            case "AH": // budget
                mi = 3;
                break;

            case "OH": // Slightly rounded mouth. This mouth shape is used for vowels like “AO” as in off and “ER” as in bird.
            case "AO": // talk
            case "ER": // bird
                mi = 4;
                break;

            case "U*": // Puckered lips. This mouth shape is used for “UW” as in you, “OW” as in show, and “W” as in way.
            case "UW":
            case "W*":
            case "UX":
            case "OW":
                mi = 5;
                break;

            case "F*": // Upper teeth touching the lower lip for “F” as in for and “V” as in very.
            case "V*":
                mi = 6;
                break;

            case "L*": // This shape is used for long “L” sounds, with the tongue raised behind the upper teeth.
            case "UL":
            case "TH": // he, that, then, they, this, brother.election, alone, elicit, elm, leg, pull. TH,L
                mi = 7;
                break;

            default:
                console.log("no explicit match for " + n + " " + i);
                no_match = 1;
                break;
        }

        var f = fnames(flags[i],flags_name).concat(fnames(flags2[i],flags2_name));
        pm.push(mi + ", // " + phoname(i) + " " + f + (no_match ? "- no explicit match" : ""));
        if (i & 1)
            a.push((last << 4) | mi);
        last = mi;
    }
    pm.push("]");
    var s = pm.join("\n");
    console.log(s);
    console.log(atari_data("phoneme2mouth",a));
}

function combined_tables()
{
    // parse the big table
    // get best natches for ipa->arpabet
    var ipa_grid = [];
    _phonene_sim.split("\n").forEach(s=> {
        if (s.length && s[0] != ';') {
            ipa_grid.push(s.split("|").map(c => c.trim()));
        }
    });
    console.log(ipa_grid);

    //  MAP ALL (maintain grid?)
    var ipa_map = {};
    for (var y = 1; y < ipa_grid.length; y++) {
        var row = ipa_grid[y];
        var maxx = 1;
        for (var x = 1; x < row.length; x++) {
            var v = row[x] = row[x].length ? parseFloat(row[x]) : 0;
            if (v > row[maxx])
                maxx = x;
        }
        ipa_map[row[0]] = ipa_grid[0][maxx];
    }

    // map arpabet to phonemes - not symmetric
    var arpanames = ipa_grid[0];
    for (var x = 1; x < arpanames.length; x++) {
        var maxy = 1;
        for (var y = 1; y < ipa_grid.length; y++) {
            var v = ipa_grid[y][x];
            if (v > ipa_grid[maxy][x])
                maxy = y;
        }
        _arpabet2ipa[arpanames[x]] = ipa_grid[maxy][0];
    }

    // TODO: Missing vowels!
    ipa_map["e"] = "EY";
    ipa_map["o"] = "OH";
    ipa_map["əl"] = "EHL";   // TODO?
    ipa_map["ʉ"] = "UH";    // Close central rounded vowel

    console.log(ipa_map);
    _ipa2arpabet = ipa_map;

    parse_lex();

    var pmap = {};
    _sam_phonetics.split("\n").forEach(s => {
        var lst = [];
        s.split(" ").forEach(w => {
            if (w.length)
                lst.push(w);
        })
        if (!lst.length || lst[0][0] == '!')
            ;
        else {
            var n = lst[0];
            if (n.length == 1) n += "*";
            pmap[n] = lst.slice(1).join(" ");
        }
    });

    var str = "//f1   f2   a1   a2  len slen flag  inb outb rank\n";
    for (var i = 0; i < freq1data.length; i++) {
        [freq1data,freq2data,ampl1data,ampl2data,phonemeLengthTable,phonemeStressedLengthTable,
            sampledConsonantFlags,inBlendLength,outBlendLength,blendRank].forEach(a=> {
            str += "0x" + hex(a[i]) + ",";
        });
        str += "\t// " + phoname(i) + " " + i;
        var cflag = sampledConsonantFlags[i];
        if (cflag) {
            if (cflag & 0xF8) {
                var page = (cflag & 7)-1;                       // 6 pages
                var offset = (cflag & 0xF8) ^ 0xFF;             // offset into sample pages
                var SAM_SAMPLES_10MS_FRAME = 22050/100;
                var run = ((256-offset)*8/SAM_SAMPLES_10MS_FRAME + 0.5) | 0;    // approx number of frames
                str += " sampled, " + run + " frames";
            } else {
                str += " sampled consonant";
            }
        } else {
            if (ampl1data[i] == 0 && ampl2data[i] == 0)
                str += " silent";
        }

        // note flags
        var f = fnames(flags[i],flags_name).concat(fnames(flags2[i],flags2_name));
        str += " [" + f.join(",") + "]";

        var example = pmap[phoname(i)];
        if (example)
            str += " - " + example;
        str += "\n";
    }
    return str;
}

// 5 pages of 256 bytes, 2048 1 bit samples
function get_samples(flags,pcm,force_voiced)
{
	var voiced = force_voiced || (0xFC & flags) == 0;
	var page = (flags & 7)-1;	// 6 pages
  	var offset = (flags & 0xF8) ^ 0xFF;
	var hi = 26;
	var lo = 6;
	if (!voiced) {
		hi = 5;
		lo = [0x18, 0x1A, 0x17, 0x17, 0x17][page];
		offset = 0;
	}
	do {
		var s = _sampleTable[page*256 + offset];
		for (var b = 0; b < 8; b++) {
			pcm.push((s & 0x80) ? hi*256 : lo*256);
			s <<= 1;
		}
		offset = (offset + 1) & 0xFF;
	} while (offset);
}

// dump raw samples (5 pages, 2048 samples)
function sam_samples()
{
	var SYNTH_FREQ = 15720*2;
    var FRAME_SAMPLES = SYNTH_FREQ/60;
    var PAD = FRAME_SAMPLES/32;
    var pcm = [];

/*
	for (var i = 0; i < sampledConsonantFlags.length; i++) {
		var flags = sampledConsonantFlags[i];
		if (!flags)
			continue;
	    var n = 1;
	    while (n--)
	    	get_samples(flags,pcm);
	    n = 1024;
	    while (n--)
	    	pcm.push(0);
	}
	*/

	// raw pages
    var j = 0;
	for (var i = 0; i < 5; i++) {
        for (var k = 0; k < 256; k++) {
            var s = _sampleTable[j++];
            for (var b = 0; b < 8; b++) {
                pcm.push((s & 0x80) ? 4096 : -4096);
                s <<= 1;
            }
        }
		var n = 1024;
	    while (n--)
	    	pcm.push(0);
	}

    pcm = new Int16Array(pcm);
    saveWAV("sam_samples.wav",pcm,22050);
    return pcm;
}

function chk()
{
	for (var i = 0; i < sampledConsonantFlags.length; i++) {
		var n = sampledConsonantFlags[i];
		if (!n)
			continue;
		if (n & 0xF8) {
   			var page = (n & 7)-1;	// 6 pages
   			var offset = (n & 0xF8) ^ 0xFF;
   			console.log(i + ":" + hex(n) + " " + phoname(i) + " unvoiced page " + page + " " + (page*256+offset) + "->" + (page*256+255)+ ":" + (256-offset));
		} else {
			console.log(i + ":" + hex(n) + " " + phoname(i) + " voiced " + n);
		}
	}
}
chk();

// dump a frequency sweep
// side by side offers a nice periodicity
function distort()
{
	var SYNTH_FREQ = 15720*2;
	var pcm = new Int16Array((SYNTH_FREQ)*32);	// don't know
	var noises = [8];
	var j = 0;
	for (var f = 0; f < 32; f++) {
		for (var i = 0; i < noises.length; i++) {

	        _atari.AUDV0(15);
	        _atari.AUDC0(noises[i]);
	        _atari.AUDF0(f);

	        _atari.AUDV1(15);
	        _atari.AUDC1(noises[i]);
	        _atari.AUDF1(15);	// mid
	        var n = SYNTH_FREQ;
	        while (n--)
	        	pcm[j++] = _atari.get();
	    }
	}
    saveWAV("atari_noise.wav",pcm,SYNTH_FREQ);
    return pcm;
}

var TIAfrequencies = [
/*
   31.7,    //c=6,f=31
   32.7,    //c=6,f=30
   33.8,     //c=6,f=29
   35,     //c=6,f=28
   36.2,     //c=6,f=27
   37.6,     //c=6,f=26
   39,     //c=6,f=25
   40.6,     //c=6,f=24
   42.3,     //c=6,f=23
   44.1,     //c=6,f=22
   46.1,    //c=6,f=21
   48.3,     //c=6,f=20
   50.7,    //c=6,f=19
   53.4,     //c=6,f=18
   56.3,     //c=6,f=17
   59.7,     //c=6,f=16
   63.4,     //c=6,f=15
*/
      // -> nothing below 120hz?
   1234567890, // not used
   67.6,     //c=6,f=14
   72.4,     //c=6,f=13
   78,     //c=6,f=12
   84.5,     //c=6,f=11
   92.2,     //c=6,f=10
   101.4,     //c=6,f=9
   112.7,    //c=6,f=8
   126.8,     //c=6,f=7
   144.9,    //c=6,f=6

   163.8,     //c=12,f=31
   169,     //c=12,f=30
   174.7,     //c=12,f=29
   180.7,     //c=12,f=28
   187.1,     //c=12,f=27
   194.1,     //c=12,f=26
   201.5,    //c=12,f=25
   209.6,     //c=12,f=24
   218.3,     //c=12,f=23
   227.8,     //c=12,f=22
   238.2,     //c=12,f=21
   249.5,     //c=12,f=20
   262,     //c=12,f=19
   275.8,     //c=12,f=18
   291.1,     //c=12,f=17
   308.2,    //c=12,f=16
   327.5,     //c=12,f=15
   349.3,     //c=12,f=14
   374.3,     //c=12,f=13
   403.1,     //c=12,f=12
   436.7,     //c=12,f=11
   476.4,     //c=12,f=10
   491.3,     //c=4,f=31
   507.1,     //c=4,f=30
   524,    //c=4,f=29
   542.1,     //c=4,f=28
   561.4,     //c=4,f=27
   582.2,     //c=4,f=26
   604.6,     //c=4,f=25
   628.8,     //c=4,f=24
   655,    //c=4,f=23
   683.5,     //c=4,f=22
   714.5,    //c=4,f=21
   748.6,     //c=4,f=20
   786,     //c=4,f=19
   827.4,     //c=4,f=18
   873.3,     //c=4,f=17
   924.7,     //c=4,f=16
   982.5,     //c=4,f=15
   1048,     //c=4,f=14
   1122.9, //c=4,f=13
   1209.2,    //c=4,f=12
   1310,     //c=4,f=11
   1429.1, //c=4,f=10
   1572,     //c=4,f=9
   1746.7, //c=4,f=8
   1965,     //c=4,f=7
   2245.7, //c=4,f=6
   2620,     //c=4,f=5
   3144,     //c=4,f=4
   3930,    //c=4,f=3
   5240,     //c=4,f=2
   7860,     //c=4,f=1
   15720,     //c=4,f=0
];

// 
function to_index(f)
{
	var index = 0;
	var e = 100000;
    for (var i = 0; i < TIAfrequencies.length; i++) {
        var err = Math.abs(TIAfrequencies[i] - f)/f;      //
        if (err < e) {
            e = err;
            index = i;
        }
    }
    return index;
}

var _f1tab = [];
var _f2tab = [];
var _atab = [];
var _tia_tab = []; // (control/freq)

// Generate tables from SAM phoneme data
// patch in amplitude data

function make_tabs(mouth,throat)
{
    console.log(combined_tables());
	var SYNTH_FREQ = 15720*2;
    mouth = mouth || 128;
    throat = throat || 128;
    SetMouthThroat(mouth,throat);

	for (var i = 0; i < freq1data.length; i++) {
        _f1tab[i] = freq1data[i];
        _f2tab[i] = freq2data[i];

        if (sampledConsonantFlags[i])
            _f1tab[i] |= 0x80;

		_atab[i] = (ampl1data[i] << 4) | ampl2data[i];
		if (_atab[i] == 0) {
			var flags = sampledConsonantFlags[i];
			if (!flags) {
				console.log("ZERO AMP FOR (plosive?)" + phoname(i));
			} else {
                // CALCULATE AMPLITUDE OF UNVOICED.....
				if (flags & 0xF8) {	// unvoiced
					var page = (flags & 7)-1;
			   		var hi = 5;
					var lo = [0x18, 0x1A, 0x17, 0x17, 0x17][page] & 0x0F;
			   		var a = lo-hi;	// estimated from unvoiced wave things
			   		_atab[i] = (a << 4) | a;	// unvoiced is lower
				} else {
					console.log("ZEROAMP WITH FLAGS!");
				}
			}
		}
		console.log(phoname(i) + " " + _f1tab[i] + " " + _f2tab[i] + " a:" + hex(_atab[i]) + " f:" + hex(sampledConsonantFlags[i]));
		//console.log(phoname(i) + " " + TIAfrequencies[_f1tab[i]] + " " + TIAfrequencies[_f2tab[i]]);
	}

    // now make the table that maps frequencies to control/atari frequency register
    for (var i = 0; i < 128; i++) {
        var c0 = _atari.match(i*26,15); // was 27 TODO
        if (c0.control & 0x1)
            throw "needs to be 4,6 or 12";
        _tia_tab[i] = (c0.control << 4) + c0.frequency;
    }
}

function lerp_(factor,in1,in2,x)
{
	var carry = factor & 1;
	factor >>= 1;
	var y = 4;				// can be any precsison 8 or four etc
	var A = in1[x];			// or zero
	do {
		if (carry) {
			carry = 0;
			A += in2[x];
		} else {
			A += in1[x];
		}
		A >>= 1;
		carry = factor & 1;
		factor >>= 1;
		y--;
	} while(y);
	return A;
}

// As low as 4 bytes?
// mix_factor
// run / state
// pointers

function test_lerp()
{
	function lerp_t(mix,a,b)
	{
		var factor = 0;			// a/b - fracstep? rate etc
		for (var n = 1; n < mix; n++) {
			factor += 255/mix;	// this we can look up..... 255,127,85,64,51..f9 8, 
			var v = lerp_(factor >> 4,[a],[b],0);
			console.log(n + " " + v + " " +a + "->" + b + " " + hex(factor));
		}
	}
	lerp_t(15,10,70);
	lerp_t(3,50,10);
	lerp_t(5,1,0);
	lerp_t(4,0,0);
}


var _phonemap = [
    ["b","B","b","file:///wiki/Voiced_bilabial_stop","Voiced bilabial stop","<b>b</b>uy\n"],
    ["C","CH","tʃ","file:///wiki/Voiceless_palato-alveolar_affricate","Voiceless palato-alveolar affricate","<b>Ch</b>ina\n"],
    ["d","D","d","file:///wiki/Voiced_alveolar_stop","Voiced alveolar stop","<b>d</b>ie\n"],
    ["D","DH","ð","file:///wiki/Voiced_dental_fricative","Voiced dental fricative","<b>th</b>y\n"],
    ["F","DX","ɾ","file:///wiki/Alveolar_tap","Alveolar tap","bu<b>tt</b>er\n"],
    ["L","EL","l̩","file:///wiki/Syllabic_consonant","Syllabic consonant","bott<b>le</b>\n"],
    ["M","EM","m̩","file:///wiki/Syllabic_consonant","Syllabic consonant","rhyth<b>m</b>\n"],
    ["N","EN","n̩","file:///wiki/Syllabic_consonant","Syllabic consonant","butt<b>on</b>\n"],
    ["f","F","f","file:///wiki/Voiceless_labiodental_fricative","Voiceless labiodental fricative","<b>f</b>ight\n"],
    ["g","G","ɡ","file:///wiki/Voiced_velar_stop","Voiced velar stop","<b>g</b>uy\n"],
    ["h","/H or HH or H[4]","h","file:///wiki/Voiceless_glottal_fricative","Voiceless glottal fricative","<b>h</b>igh\n"],
    ["J","JH","dʒ","file:///wiki/Voiced_palato-alveolar_affricate","Voiced palato-alveolar affricate","<b>j</b>ive\n"],
    ["k","K","k","file:///wiki/Voiceless_velar_stop","Voiceless velar stop","<b>k</b>ite\n"],
    ["l","L","l","file:///wiki/Alveolar_lateral_approximant","Alveolar lateral approximant","<b>l</b>ie\n"],
    ["m","M","m","file:///wiki/Bilabial_nasal","Bilabial nasal","<b>m</b>y\n"],
    ["n","N","n","file:///wiki/Alveolar_nasal","Alveolar nasal","<b>n</b>igh\n"],
    ["G","NX or NG[4]","ŋ","file:///wiki/Velar_nasal","Velar nasal","si<b>ng</b>\n"],
    ["N/A","NX[4]","ɾ̃","file:///wiki/Alveolar_nasal_tap","Alveolar nasal tap","wi<b>nn</b>er\n"],
    ["p","P","p","file:///wiki/Voiceless_bilabial_stop","Voiceless bilabial stop","<b>p</b>ie\n"],
    ["Q","Q","ʔ","file:///wiki/Glottal_stop","Glottal stop","uh<b>-</b>oh\n"],
    ["r","R","ɹ","file:///wiki/Alveolar_approximant","Alveolar approximant","<b>r</b>ye\n"],
    ["s","S","s","file:///wiki/Voiceless_alveolar_sibilant","Voiceless alveolar sibilant","<b>s</b>igh\n"],
    ["S","SH","ʃ","file:///wiki/Voiceless_palato-alveolar_fricative","Voiceless palato-alveolar fricative","<b>sh</b>y\n"],
    ["t","T","t","file:///wiki/Voiceless_alveolar_stop","Voiceless alveolar stop","<b>t</b>ie\n"],
    ["T","TH","θ","file:///wiki/Voiceless_dental_fricative","Voiceless dental fricative","<b>th</b>igh\n"],
    ["v","V","v","file:///wiki/Voiced_labiodental_fricative","Voiced labiodental fricative","<b>v</b>ie\n"],
    ["w","W","w","file:///wiki/Voiced_labial%E2%80%93velar_approximant","Voiced labial–velar approximant","<b>w</b>ise\n"],
    ["H","WH","ʍ","file:///wiki/Voiceless_labialized_velar_approximant","Voiceless labialized velar approximant","<b>wh</b>y\n"],
    ["y","Y","j","file:///wiki/Palatal_approximant","Palatal approximant","<b>y</b>acht\n"],
    ["z","Z","z","file:///wiki/Voiced_alveolar_sibilant","Voiced alveolar sibilant","<b>z</b>oo\n"],
    ["Z","ZH","ʒ","file:///wiki/Voiced_palato-alveolar_fricative","Voiced palato-alveolar fricative","plea<b>s</b>ure\n"],
    ["a","AA","ɑ","file:///wiki/Open_central_unrounded_vowel","Open central unrounded vowel","b<b>al</b>m, b<b>o</b>t\n"],
        
    ["@","AE","æ","file:///wiki/Near-open_front_unrounded_vowel","Near-open front unrounded vowel","b<b>a</b>t\n"],
    ["@","AE","a","file:///wiki/Near-open_front_unrounded_vowel","Near-open front unrounded vowel","b<b>a</b>t\n"],

    ["A","AH","ʌ","file:///wiki/Near-open_central_vowel","Near-open central vowel","b<b>u</b>tt\n"],
    ["c","AO","ɔ","file:///wiki/Open-mid_back_rounded_vowel","Open-mid back rounded vowel","st<b>o</b>ry\n"],
    ["W","AW","aʊ","","","b<b>ou</b>t\n"],
    ["x","AX","ə","file:///wiki/Mid_central_vowel","Mid central vowel","comm<b>a</b>\n"],
    ["N/A","AXR[4]","ɚ","file:///wiki/R-colored_vowel","R-colored vowel","lett<b>er</b>\n"],
    ["Y","AY","aɪ","","","b<b>i</b>te\n"],
    ["E","EH","ɛ","file:///wiki/Open-mid_front_unrounded_vowel","Open-mid front unrounded vowel","b<b>e</b>t\n"],
    ["R","ER","ɝ","file:///wiki/R-colored_vowel","R-colored vowel","b<b>ir</b>d\n"],
    ["e","EY","eɪ","","","b<b>ai</b>t\n"],
    ["I","IH","ɪ","file:///wiki/Near-close_front_unrounded_vowel","Near-close front unrounded vowel","b<b>i</b>t\n"],
    ["X","IX","ɨ","file:///wiki/Close_central_unrounded_vowel","Close central unrounded vowel","ros<b>e</b>s, rabb<b>i</b>t\n"],
    ["i","IY","i","file:///wiki/Close_front_unrounded_vowel","Close front unrounded vowel","b<b>ea</b>t\n"],

    ["o","OW","oʊ","","","b<b>oa</b>t\n"],
    ["O","OY","ɔɪ","","","b<b>oy</b>\n"],
    ["o","OW","əʊ","","","b<b>oa</b>t\n"],

    ["U","UH","ʊ","file:///wiki/Near-close_back_rounded_vowel","Near-close back rounded vowel","b<b>oo</b>k\n"],
    ["u","UW","u","file:///wiki/Close_back_rounded_vowel","Close back rounded vowel","b<b>oo</b>t\n"],
    ["N/A","UX[4]","ʉ","file:///wiki/Close_central_rounded_vowel","Close central rounded vowel","d<b>u</b>de\n"]
];

var daizy = `
10000 DATA DEHEHEHEHEHEHEHEHEHEY,45,81,2
10010 DATA ZIYIYIYIYIYIYIYIYIYIY,48,96,1
10020 DATA DEHEHEHEHEHEHEHEHEHEY,63,121,2
10030 DATA ZIYIYIYIYIYIYIYIYIYIY,77,162,1
10040 DATA GIHV,70,144,1
10050 DATA MIYIY,62,128,2
10060 DATA YOHR,62,121,1
10070 DATA AEAEAEAEAENN,76,144,2
10080 DATA SER,63,121,1
10090 DATA TRUXUXUXUXUXUXUXUXUXUXUXUX,79,162,1
10100 DATA --,100,0,1
10110 DATA AAAAAAAAAAIYIYMM,77,144,2
10120 DATA /HAEAEAEAEAEAEFF,53,91,1
10130 DATA KREHEHEHEHIYIY,52,96,2
10140 DATA ZZIYIYIYIYIYIY-,59,121,1
10160 DATA OHOW,74,144,2
10170 DATA VAHER,66,128,1
10180 DATA DHIYIYIY,59,121,1
10190 DATA LAHAHAHAHAHAHAHAHV,59,108,2
10200 DATA AHAHAHV,54,96,2
10210 DATA YUXUXUXUXUXUXUXUXUXUXUXUX,55,108,1
10220 DATA ---,100,0,1
10230 DATA IHT,55,108,2
10240 DATA WOWNNT BIYIYIY,53,96,1
10250 DATA AHAHAHAH,59,108,2
10260 DATA STAAAAIYL,49,81,2
10270 DATA LIXSHSH-,51,96,1
10280 DATA MEHEHRR,57,108,2
10290 DATA IHIHIHIHIHIHIHIHIHJ,61,121,1
10300 DATA --,100,0,1
10310 DATA AAIY,61,108,2
10320 DATA KAEAEAEAENNT,55,96,1
10330 DATA AHAH,65,121,2
10340 DATA FFOHOHOHOHRRDXD,73,144,1
10350 DATA AHAH,65,121,2
10360 DATA KEHEHRR,73,144,2
10370 DATA IHIHIHIHIHIHJ,79,162,1
10380 DATA --,100,0,1
10390 DATA BAHAHDXT,83,162,2
10400 DATA YUXUXUXUXL,61,121,1
10410 DATA LUHDXK,51,96,1
10420 DATA SWIYIYIYIYIYDXT,53,108,2
10430 DATA AHAHQP,83,162,2
10440 DATA AAAAAAAANN,66,121,2
10450 DATA DHAHAH,54,96,2
10460 DATA SIYIYDXT,53,108,1
10470 DATA AHAHV,54,96,2
10480 DATA EHIY,50,91,1
10490 DATA BAAIY,49,81,2
10500 DATA SIHDXK,49,96,1
10510 DATA ULLL,61,121,2
10520 DATA BIHIHIHIHLDXT,55,108,2
10530 DATA FOHOHR,81,162,1
10540 DATA TUXUXUXUXUXUXUXUXUXUXUXUXUXUXUX,61,121,1`;


// needs to be unsung in conversion
var national_anthem = [
    {speed: 40, pitch: 64, text: 'ohohoh'},
    {speed: 40, pitch: 76, text: 'ohohoh'},
    {speed: 40, pitch: 96, text: 'sehehehehehehehehehey'},
    {speed: 40, pitch: 76, text: 'kaeaeaeaeaeaeaeaeaen'},
    {speed: 40, pitch: 64, text: 'yuxuxuxuxuxuxw'},
    {speed: 40, pitch: 48, text: 'siyiyiyiyiyiyiyiyiyiyiyiyiyiyiyiyiyiy'},
    {speed: 40, pitch: 38, text: 'baaaaay'},
    {speed: 40, pitch: 42, text: 'dhaaaxaxaxax'},
    {speed: 40, pitch: 48, text: 'daoaoaoaoaoaoaonz'},
    {speed: 40, pitch: 76, text: 'ererererererer'},
    {speed: 40, pitch: 68, text: 'liyiyiyiyiyiyiyiyiy'},
    {speed: 40, pitch: 64, text: 'laaaaaaaaaaaaaaaaaaaaaaaaayt'},
    {speed: 40, pitch: 64, text: 'whahahaht'},
    {speed: 40, pitch: 64, text: 'sohohuw'},
    {speed: 40, pitch: 38, text: 'praaaaaaaaaaaaaaaauwd'},
    {speed: 40, pitch: 42, text: 'liyiyiy'},
    {speed: 40, pitch: 48, text: 'wiyiyiyiyiyiyiyiyiy'},
    {speed: 40, pitch: 51, text: '/heheheheheheheheheheheheheheheheheheyld'},
    {speed: 40, pitch: 56, text: 'aeaeaeaet'},
    {speed: 40, pitch: 51, text: 'dhaaaxaxaxax'},
    {speed: 40, pitch: 48, text: 'twaaaaaaaaaaaaaaiy'},
    {speed: 40, pitch: 48, text: 'laaaaaaaaaaaaiyts'},
    {speed: 40, pitch: 64, text: 'laeaeaeaeaeaeaeaeaest'},
    {speed: 40, pitch: 76, text: 'gliyiyiyiyiyiyiyiyiym'},
    {speed: 40, pitch: 96, text: 'mihihihihihihihihihihnx'},
    {speed: 40, pitch: 64, text: '/huxuxuxuxuxuxuxuxuxuxwz'},
    {speed: 40, pitch: 76, text: 'braoaoaod'},
    {speed: 40, pitch: 96, text: 'straaaaaaaaaaaaiyps'},
    {speed: 40, pitch: 76, text: 'aeaeaeaeaeaeaeaeaeaend'},
    {speed: 40, pitch: 64, text: 'braaaaaaaaaaaaaaiyt'},
    {speed: 40, pitch: 48, text: 'staaaaaaaaaaaaaaaaaaaaaaaaaarz'},
    {speed: 40, pitch: 38, text: 'thruxuxw'},
    {speed: 40, pitch: 42, text: 'dhaaaxaxaxax'},
    {speed: 40, pitch: 48, text: 'pehehehehehehehehehehr'},
    {speed: 40, pitch: 76, text: 'rixixixixixixixixixixixixl'},
    {speed: 40, pitch: 68, text: 'lahahahahahahahahahs'},
    {speed: 40, pitch: 64, text: 'faaaaaaaaaaaaaaaaaaaaaaaaaaiyt'},
    {speed: 40, pitch: 64, text: 'ohohohr'},
    {speed: 40, pitch: 64, text: 'dhaaaxaxaxax'},
    {speed: 40, pitch: 38, text: 'raeaeaeaeaeaeaeaeaeaeaeaem'},
    {speed: 40, pitch: 42, text: 'paaaarts'},
    {speed: 40, pitch: 48, text: 'wiyiyiyiyiyiyiyiyiy'},
    {speed: 40, pitch: 51, text: 'waaaaaaaaaaaaaaaaaaaaaaaaaachd'},
    {speed: 40, pitch: 56, text: 'werer'},
    {speed: 40, pitch: 51, text: 'sohohw'},
    {speed: 40, pitch: 48, text: 'gaeaeaeaeaeaeaeaeaeael'},
    {speed: 40, pitch: 48, text: 'lixixixixixixixixixixixixixnt'},
    {speed: 40, pitch: 64, text: 'liyiyiyiyiyiyiyiyiy'},
    {speed: 40, pitch: 76, text: 'striyiyiyiyiyiyiyiyiym'},
    {speed: 40, pitch: 96, text: 'mihihihihihihihihihnx'},
    {speed: 40, pitch: 38, text: 'aeaeaeaeaend'},
    {speed: 40, pitch: 38, text: 'dhaaaxaxaxax'},
    {speed: 40, pitch: 38, text: 'raaaaaaaaaaaak'},
    {speed: 40, pitch: 36, text: 'kixixixixixixixixixixixts'},
    {speed: 40, pitch: 32, text: 'rehehehehehehehehehd'},
    {speed: 40, pitch: 32, text: 'gleheheheheheheheheheheheheheheherer'},
    {speed: 40, pitch: 36, text: 'dhaaaxaxaxax'},
    {speed: 40, pitch: 38, text: 'baaaamz'},
    {speed: 40, pitch: 42, text: 'bererererererst'},
    {speed: 40, pitch: 38, text: 'tihihihihihihihihihnx'},
    {speed: 40, pitch: 36, text: 'ihihihihihihihihihihn'},
    {speed: 40, pitch: 36, text: 'eheheheheheheheheheheheheheheheheheyr'},
    {speed: 40, pitch: 36, text: 'geheheheyv'},
    {speed: 40, pitch: 38, text: 'pruxuxuxuxuxuxuxuxuxuxuxuxwf'},
    {speed: 40, pitch: 42, text: 'thruxuxw'},
    {speed: 40, pitch: 48, text: 'dhaaaxaxax'},
    {speed: 40, pitch: 51, text: 'naaaaaaaaaaaaaaaaaaaaaaayiyt'},
    {speed: 40, pitch: 56, text: 'dhaeaeaeaet'},
    {speed: 40, pitch: 51, text: 'aaaaaauwr'},
    {speed: 40, pitch: 48, text: 'flaeaeaeaeaeaeaeaeaeg'},
    {speed: 40, pitch: 76, text: 'wahahahahahahahahahz'},
    {speed: 40, pitch: 68, text: 'stihihihihihihihihihl'},
    {speed: 40, pitch: 64, text: 'dhehehehehehehehehehehehehehehehehehehehr'},
    {speed: 40, pitch: 64, text: 'ohohohohohohow'},
    {speed: 40, pitch: 48, text: 'sehehehehehehehehehey'},
    {speed: 40, pitch: 48, text: 'dahahahahahahahahahz'},
    {speed: 40, pitch: 48, text: 'dhaeaeae'},
    {speed: 40, pitch: 51, text: 'aeaeaet'},
    {speed: 40, pitch: 56, text: 'staaaaaaaaaaaar'},
    {speed: 40, pitch: 56, text: 'spehehehehehehehehehiynx'},
    {speed: 40, pitch: 56, text: 'gaxaxaxaxaxaxaxaxaxaxaxaxld'},
    {speed: 40, pitch: 42, text: 'baeaeaeaeaeaeaeaeaen'},
    {speed: 40, pitch: 36, text: 'nerer'},
    {speed: 40, pitch: 38, text: 'ererer'},
    {speed: 40, pitch: 42, text: 'yeheheh'},
    {speed: 40, pitch: 48, text: 'eheheheht'},
    {speed: 40, pitch: 48, text: 'weheheheheheheheheheheh'},
    {speed: 40, pitch: 51, text: 'ehehehehehehehiyiyiyv'},
    {speed: 40, pitch: 64, text: 'ohohohr'},
    {speed: 40, pitch: 64, text: 'dhaaaxaxaxax'},
    {speed: 40, pitch: 48, text: 'laeaeaeaeaeaeaeaeaeaeaeae'},
    {speed: 40, pitch: 42, text: 'aeaeaend'},
    {speed: 40, pitch: 38, text: 'ahahahv'},
    {speed: 40, pitch: 36, text: 'dhaaaxaxaxax'},
    {speed: 40, pitch: 32, text: 'friyiyiyiyiyiyiyiyiyiyiyiyiyiyiyiyiyiy'},
    {speed: 40, pitch: 48, text: 'aeaeaend'},
    {speed: 40, pitch: 42, text: 'dhaaaxaxaxax'},
    {speed: 40, pitch: 38, text: '/hohohohohohohohohowm'},
    {speed: 40, pitch: 36, text: 'ahahahahv'},
    {speed: 40, pitch: 42, text: 'dhaaaxaxaxaxaxaxaxaxaxaxaxaxax'},
    {speed: 40, pitch: 48, text: 'brehehehehehehehehehehiyiyiyv'}
];

function ddaisy()
{
    var a = ['const SAMREC ddaisy[] = {'];
    daizy.split("\n").forEach(s => {
        var d = s.substring(11).split(",");
        if (d.length == 4) {
            a.push('{"' + d[0] + '",' + d[1] + "," + d[2] + "," + d[3] + "},");
        }
    });
    a.push('}');
    a.push('const SAMREC anthem[] = {');
    national_anthem.forEach(s => {
        a.push('{"' + s.text + '",' + s.pitch + "," + s.speed + "," + 0+ "},");
    });
    a.push('}');
    console.log(a.join("\n"));
}

// https://github.com/cmusphinx/cmudict-tools/blob/master/accents/en-GB-x-rp.csv
// https://codeberg.org/rmemr/w3.phoneme-extractor/src/branch/master/data/phoneme.similarity.csv

var _arpabet2ipa = {};
var _ipa2arpabet = {
  "p": "P",
  "b": "B",
  "t": "T",
  "d": "D",
  "k": "K",
  "m": "M",
  "n": "N",
  "l": "L",
  "r": "R",
  "ɹ": "R",
  "f": "F",
  "v": "V",
  "s": "S",
  "z": "Z",
  "h": "HH",
  "w": "W",
  "ɡ": "G",
  "ʧ": "CH",
  "ʤ": "JH",
  "ŋ": "NG",
  "θ": "TH",
  "ð": "DH",
  "ʃ": "SH",
  "ʒ": "ZH",
  "j": "Y",
  "i": "IH",
  "ɑ": "AA",
  //"ɔ": "AO",
  "ɔː": "AO",
  "uː": "UW",
  //"u": "UW",
  "ɝ": "ER",
  "ɪ": "IH",
  "ɛ": "EH",
  "e": "EH",
  "eɪ": "EY",
  "œ": "AE",
  "a": "AE",
  "ʌ": "AH",
  "o": "OH",
  "ɒ": "OH",
  "ʊ": "UH",
  "ɐ": "UH",
  "ə": "AX",
  "ɘɪ": "EY",
  "aɪ": "AY",
  "oɪ": "OY",
  "oʊ": "OW",
  "əʊ": "OW",
  "aʊ": "AW",
  "ʔ": "Q",
  "ɾ": "DX",
  "ɨ": "IX",
  "ɚ": "AXR",
  "ʉ": "UX",
  "l̩": "EL",
  "m̩": "EM",
  "n̩": "EN",
  "ŋ̩": "ENG",
  "ɾ̃": "NX",
  "ɪɹ": "IA",
  "əɹ": "EA",
  "ʊɹ": "UA",

  "iː":"IY",
};

function ipa2arpabet(s,sam)
{
    if (s.length == 0)
        return "";

    var c_primary_stress = "ˈ";
    var c_secondary_stress = "ˌ";
    var c_long = "ː";               // follows
    var c_half_long = "ˑ";          // follows
    var c_extra_short = "◌̆";
    var c_syllable_break = ".";
    var c_linking = "‿";

    // add ARPABET stress
    var stress = 0;
    switch (s[0]) {
        case "ˈ": stress = 5; break;    // primary stress
        case "ˌ": stress = 3; break;    // secondary stress
    }
    if (stress)
        s = s.substring(1);

    // add ARPABET length
    var len = 0;
    if (s[s.length-1] == "ː" || s[s.length-1] == "ˑ") {
        len++;
        s = s.substring(0,s.length-1);
    }

    console.log("mapping " + s + " " + _ipa2arpabet[s]);
    var arpa = _ipa2arpabet[s];
    if (sam) {
        switch (arpa) {
            case "HH": arpa = "/H"; break;
            case "AXL": arpa = "UL"; break;
            case "AXM": arpa = "UM"; break;
            case "AXN": arpa = "UN"; break;
        }
    }
    if (arpa)
        return arpa + (stress ? stress : "");
    return "?" + s + "?";
}

// parse
function ipa2arpabetstr(s)
{
    if (s.length == 0)
        s = "həlˈəʊ mˈeɪ nˈeɪm ɪz sˈam";

    function parse_word(w,sam) {
        var arpa = '';
        var i = 0;

        function peek()
        {
            return w[i];
        }

        function next()
        {
            return w[i++];

        }

        // split chunks?
        var c_primary_stress = "ˈ";
        var c_secondary_stress = "ˌ";
        var c_long = "ː";               // follows
        var c_half_long = "ˑ";          // follows
        var c_extra_short = "◌̆";
        var c_syllable_break = ".";
        var c_linking = "‿";

        while (i < w.length) {
            var pre = '';
            var post = '';
            var match = '';
            for (;;) {
                var p = peek();
                if (p == c_primary_stress || p == c_secondary_stress) {
                    if (match)
                        break;
                    pre += next();
                } else if (p == c_long || p == c_half_long) {
                    post += next();
                    break;
                } else {
                    var cc = match + peek();    // still match?
                    if (_ipa2arpabet[cc]) {
                        match = cc;
                        next();             // greedy match
                    } else {
                        if (match)
                            break;
                        match += next();
                    }
                }
            }
            arpa += ipa2arpabet(pre+match+post,sam);
        }
        return arpa;
    }

    var lines = [];
    s.trim().split("\n").forEach(line => {
        var words = line.trim().split(" ");
        var list = [];
        words.forEach(w => {
            list.push(parse_word(w.trim(),true));
        });
        lines.push(list.join(" "));
    });
    return lines.join("\n");
}

function ipa()
{
    var v = _q("#ipa_input").value;
    var r = ipa2arpabetstr(v);
    _q("#ipa_output").innerText = r;
}


function init_sam()
{
    ///console.log(mapper());
	_phase = 0;
	make_tabs();
	patch_runs(sam_blend);
	return sam_blend;
}

    //var f1 = [280,370,405,600,860,830,560,430,400,330,680];
   // var f2 = [2230,2090,2080,1930,1550,1170,820,980,1100,1260,1310];

function sam_synth()
{
	//return distort();
	//return 
	//sam_samples();

    var speech = sam_mixed;
    var SYNTH_FREQ = 15720*2;
    var FRAME_SAMPLES = SYNTH_FREQ/60;
    var PAD = FRAME_SAMPLES/32;
    var pcm = new Int16Array(speech.length/8*(FRAME_SAMPLES+PAD)*2);	// don't know
    var j = 0;
   	var stats = sam_blend_synth(pcm);
   	draw_stats(stats,pcm);
   	saveWAV("blend.wav",pcm,SYNTH_FREQ);
   	return pcm;

   	if (0) {
    // low 2 bits of flag         // voiced phoneme: Z*, ZH, V*, DH
    function formant(f1,v1,f2,v2,unvoiced)
    {
        var c0 = _atari.match(f1,v1,unvoiced);
        var c1 = _atari.match(f2,v2,unvoiced);	// buzzy formants?

        if (unvoiced)
        	console.log("unvoiced f:" + f1 + "->" + c0.frequency + ",  f2:" + f2 + "->" + c1.frequency);

        _atari.AUDV0(c0.volume);
        _atari.AUDC0(c0.control);
        _atari.AUDF0(c0.frequency);
        _atari.AUDV1(c1.volume);
        _atari.AUDC1(c1.control);
        _atari.AUDF1(c1.frequency);
        console.log(c0.control + "," + c0.volume + "," + c0.frequency + ","+ c1.control + "," + c1.volume + "," + c1.frequency);
        for (var n = 0; n < FRAME_SAMPLES; n++)
            pcm[j++] = _atari.get();
    }

    for (var i = 0; i < speech.length; i += 8) {
        var f1 = speech[i+2]*24*SYNTH_FREQ/44100;		// ~24 for SYNTH_FREQ proper
        var f2 = speech[i+4]*24*SYNTH_FREQ/44100;

        var pitch = speech[i+7]+speech[i+2]/2;	// some modulaton of pitch may be useful? harmonic of 60hz?
        pitch = 64/pitch;
        var a = 0.33;
        pitch = a*pitch + (1-a);
        f1 *= pitch;
        f2 *= pitch;

        var a1 = speech[i+1];
        var a2 = speech[i+3];
        var flags = speech[i];

       	var unvoiced = flags & 0xF8;
       	if (unvoiced) {
       		var level = ((flags & 7)-1);
       		var hi = 5;
			var lo = [0x18, 0x1A, 0x17, 0x17, 0x17][level] & 0x0F;
       		var da1 = 0;
       		var da2 = 0;
       		a1 = a2 = (lo-hi);	// estimated from unvoiced wave things

       		/*
       		switch (flags) {
       			case 0xF1: // S*
       		    case 0xE2: // SH fade in?
       			a1 = a2 = 0;	
       			da1 = 1;
       			da2 = 1;
       			break;
       			case 0xD3: // F*
       			break;
       			case 0xBB: // TH
       			break;
       			case 0x7C: // /H
       			break;
       			case 0x95: // /X
       			break;
       		}
			*/

       		var page = (flags & 7)-1;			// 6 pages
       		var offset = (flags & 0xF8) ^ 0xFF;	// offset into sample pages
       		var SAM_SAMPLES_10MS_FRAME = 22050/100;
       		var frames = ((256-offset)*8/SAM_SAMPLES_10MS_FRAME + 0.5)| 0;	// approx
       		while (frames--) {
       			a1 += da1;
       			a2 += da2;
       			formant(f1,a1,f2,a2,true);
       		}
       		i += 8;	// SKIP NEXT ONE
       	} else {
       		formant(f1,a1,f2,a2,false);
         	for (var n = 0; n < PAD; n++)
            	pcm[j++] = 0;
       	}
    }

    saveWAV("atari.wav",pcm,44100);
    return pcm;
   }
}

//====================================================================================
//====================================================================================

var FLAG_VOWEL = 0x80;
var FLAG_CONSONANT = 0x40;
var FLAG_DIPTHONG_YX = 0x20;
var FLAG_DIPTHONG = 0x10;
var FLAG_FLAG08 = 0x08;
var FLAG_VOICED= 0x04;
var FLAG_STOPPED = 0x02;
var FLAG_PLOSIVE = 0x01;

// parse phoneme text to indexes/stresses
function parse1(phoneme_text)
{
    var p = [];
    var s = [];
    var i = 0;

    function match(p0,p1) {
        for (var j = 0; j <= 80; j++) { // table has 81 entries
            if (signInputTable1[j] == p0 && signInputTable2[j] == p1)
                return j
        }
        return -1;
    }

    function add(n)
    {
        p.push({phoneme:n,stress:0,len:0});
    }

    while (i < phoneme_text.length) {
        var c0 = phoneme_text[i++];
        var c1 = phoneme_text[i];   // might be null
        var n = match(c0,c1);       // 2 letter
        if (n != -1) {
            add(n);
            i++;
            continue;
        }
        n = match(c0,"*");          // 1 letter
        if (n != -1) {
            add(n);
            continue;
        }
        n = "12345678".indexOf(c0);
        if (n != -1) { // stress?
            p[p.length-1].stress = n+1;
            continue;
        }
        console.log("Failed to parse " + phoneme_text + " at index " + i);
        return null;
    }

/*
    // check?
    var str = '';
    for (i = 0; i <  p.length; i++) {
        var c = p[i];
        str += signInputTable1[c.phoneme];
        if (signInputTable2[c.phoneme] != '*')
            str += signInputTable2[c.phoneme];
        if (c.stress)
            str += "12345678"[c.stress-1];
    }
    console.log(str);
*/
    return p;
}

// Rewrites the phonemes using the following rules:
//
//       <DIPHTONG ENDING WITH WX> -> <DIPHTONG ENDING WITH WX> WX
//       <DIPHTONG NOT ENDING WITH WX> -> <DIPHTONG NOT ENDING WITH WX> YX
//       UL -> AX L
//       UM -> AX M
//       <STRESSED VOWEL> <SILENCE> <STRESSED VOWEL> -> <STRESSED VOWEL> <SILENCE> Q <VOWEL>
//       T R -> CH R
//       D R -> J R
//       <VOWEL> R -> <VOWEL> RX
//       <VOWEL> L -> <VOWEL> LX
//       G S -> G Z
//       K <VOWEL OR DIPHTONG NOT ENDING WITH IY> -> KX <VOWEL OR DIPHTONG NOT ENDING WITH IY>
//       G <VOWEL OR DIPHTONG NOT ENDING WITH IY> -> GX <VOWEL OR DIPHTONG NOT ENDING WITH IY>
//       S P -> S B
//       S T -> S D
//       S K -> S G
//       S KX -> S GX
//       <ALVEOLAR> UW -> <ALVEOLAR> UX
//       CH -> CH CH' (CH requires two phonemes to represent it)
//       J -> J J' (J requires two phonemes to represent it)
//       <UNSTRESSED VOWEL> T <PAUSE> -> <UNSTRESSED VOWEL> DX <PAUSE>
//       <UNSTRESSED VOWEL> D <PAUSE>  -> <UNSTRESSED VOWEL> DX <PAUSE>

function parse2(phonemes)
{
    function insert(index,phoneme,stress)   // insert after index
    {
        phonemes.splice(index+1,0,{phoneme:phoneme,stress:stress,len:0});
    }

    var _mt = {phoneme:0,stress:0,len:0};
    function at(i)
    {
        if (i < 0 || (i >= phonemes.length))
            return _mt;
        return phonemes[i];
    }

    function stressed_vowel(i)
    {
        return (flags[at(i).phoneme] & FLAG_VOWEL) && at(i).stressed != 0;
    }

    function silence(i)
    {
        return at(i).phoneme == 0;
    }

    for (var i = 0; i < phonemes.length; i++) {
        var c = at(i).phoneme;
        if (c == 0)
            continue;       // space/pause
        //console.log(c + " " + phoname(c));

        var f = flags[c];
        if (f & FLAG_DIPTHONG) {
            var xy = (f & FLAG_DIPTHONG_YX) ? 21:20;  // End in IY sound? 'WX' = 20 'YX' = 21
            insert(i,xy,at(i).stress);
        }

        var prior = at(i-1).phoneme;
        switch (c) {
            case 78: // UL -> AX L: MEDDLE
                at(i).phoneme = 13;             // 'AX'
                insert(i,24,at(i).stress);      // 'L' 
                continue;

            case 79: //  UM -> AX M: ASTRONOMY
                at(i).phoneme = 13;             // 'AX'
                insert(i,27,at(i).stress);      // 'M' 
                continue;

            case 80: // UN -> AX N: FUNCTION
                at(i).phoneme = 13;             // 'AX'
                insert(i,28,at(i).stress);      // 'N' 
                continue;

            case 23:  // RULES FOR PHONEMES BEFORE R
                {
                    switch (prior) {
                        case 69:                    // T R -> CH R: TRACK
                            at(i-1).phoneme = 42;   // CH
                            continue;

                        case 57:                    // D R -> J R: DRY
                            at(i-1).phoneme = 44;   // J
                            continue;

                        default:
                            if (flags[prior] & FLAG_VOWEL) // <VOWEL> R -> <VOWEL> RX: ART
                                at(i).phoneme = 18; // RX
                            continue;
                    }
                }
                break;

            case 24: // L
                if (flags[prior] & FLAG_VOWEL)     // <VOWEL> L -> <VOWEL> LX: ALL
                    at(i).phoneme = 19;             // LX
                break;

            case 32: // S
                if (prior == 60)                    // G S -> G Z
                    at(i).phoneme = 38;             // Z
                break;

            // K <VOWEL OR DIPHTONG NOT ENDING WITH IY> -> KX <VOWEL OR DIPHTONG NOT ENDING WITH IY>: COW
            case 72: // K
                if ((flags[at(i+1).phoneme] & FLAG_DIPTHONG_YX) == 0)
                    at(i).phoneme = 75;             // KX
                break;

            // G <VOWEL OR DIPHTONG NOT ENDING WITH IY> -> GX <VOWEL OR DIPHTONG NOT ENDING WITH IY>:GO
            case 60: // G
                if ((flags[at(i+1).phoneme] & FLAG_DIPTHONG_YX) == 0)
                    at(i).phoneme = 63;             // GX
                break;

            // <ALVEOLAR> UW -> <ALVEOLAR> UX: NEW, DEW, SUE, ZOO, THOO, TOO
            case 53: // 'UW'
                if (flags2[prior] & 4)
                    at(i).phoneme = 16;             // UX
                break;

            // CH -> CH CH' (CH requires two phonemes to represent it):CHEW
            case 42: // CH
                insert(i++,42+1,at(i).stress);     // CH'
                break;

            // J -> J J' (J requires two phonemes to represent it): JAY
            case 44: // J
                insert(i++,44+1,at(i).stress);     // J'
                break;

            //      Replace with softer version
            //      S P -> S B
            //      S T -> S D
            //      S K -> S G
            //      S KX -> S GX
            // Examples: SPY, STY, SKY, SCOWL
            default:
                if ((f & FLAG_PLOSIVE) && (prior == 32)) {  // S
                    at(i).phoneme -= 12;
                }
                break;
        }

        // <STRESSED VOWEL> <SILENCE> <STRESSED VOWEL> -> <STRESSED VOWEL> <SILENCE> Q <VOWEL>: AWAY EIGHT
        if (stressed_vowel(i) && silence(i+1) && stressed_vowel(i+2)) {
            insert(++i,31,at(i).stress);        // 'Q' glottal stop after silence
            continue;
        }

        // RULE: Soften T following vowel
        // NOTE: This rule fails for cases such as "ODD"
        //       <UNSTRESSED VOWEL> T <PAUSE> -> <UNSTRESSED VOWEL> DX <PAUSE>
        //       <UNSTRESSED VOWEL> D <PAUSE>  -> <UNSTRESSED VOWEL> DX <PAUSE>
        // Example: PARTY, TARDY
        if ((c == 69 || c == 57) && (flags[prior] & FLAG_VOWEL))   // T or D
        {
            var n = at(i+1).phoneme;    // next
            if (n != 0) {
                // next is not a pause
                if (((flags[n] & FLAG_VOWEL) == 0) || at(i+1).stress)    // 
                    continue;
                at(i).phoneme = 30; // RULE: Soften T or D following vowel or ER and preceding a pause -> DX
            } else {
                // next is a pause, look beyond
                if (flags[at(i+2).phoneme] & FLAG_VOWEL)    // 
                    at(i).phoneme = 30; // RULE: Soften T or D following vowel or ER and preceding a pause -> DX
            }

        }
    }
    return phonemes;
}

// copy stress to consanant from following vowel if present
function copy_stress(phonemes)
{
    for (var i = 0; i < phonemes.length-1; i++)
    {
        var c = phonemes[i];
        if ((flags[c.phoneme] & FLAG_CONSONANT) == 0)
            continue;
        if ((flags[phonemes[i+1].phoneme] & FLAG_VOWEL) == 0)
            continue;
        var s = phonemes[i+1].stress;
        if (s)
            phonemes[i].stress = s+1;
    }

    // copy length
    for (var i = 0; i < phonemes.length; i++)
        phonemes[i].len = phonemes.stress ? phonemeStressedLengthTable[i] : phonemeLengthTable[i];
    return phonemes;
}

// LENGTHEN VOWELS PRECEDING PUNCTUATION
//
// Search for punctuation. If found, back up to the first vowel, then
// process all phonemes between there and up to (but not including) the punctuation.
// If any phoneme is found that is a either a fricative or voiced, the duration is
// increased by (length * 1.5) + 1

function adjust_lengths(phonemes)
{
    var _mt = {phoneme:0,stress:0,len:0};
    function at(i)
    {
        if (i < 0 || (i >= phonemes.length))
            return _mt;
        return phonemes[i];
    }

    for (var i = 0; i < phonemes.length; i++) {
        if ((flags2[phonemes[i].phoneme] & 1) == 0) // not punct
            continue;

        // backup to vowel
        var j = i;
        while (j && (flags[phonemes[j].phoneme] && FLAG_VOWEL))
            --j;

        while (j < i) {
            // test for fricative/unvoiced or not voiced
            // Lengthen <FRICATIVE> or <VOICED> between <VOWEL> and <PUNCTUATION> by 1.5
            var p = phonemes[j].phoneme;
            if (((flags2[p] & 32) == 0) || ((flags[p] & FLAG_VOICED) != 0)) {
                phonemes[j].len += (phonemes[j].len >> 1) + 1;
            }
            j++;
        }
    }

    // bunch of other rules
    // <VOWEL> <RX | LX> <CONSONANT> - decrease length by 1
    // <not VOWEL> <UNVOICED PLOSIVE> - decrease vowel by 1/8th
    // <not VOWEL> <VOICED CONSONANT> - increase vowel by 1/2 + 1
    // <NASAL> <STOP CONSONANT> - set nasal = 5, consonant = 6

    // <UNVOICED STOP CONSONANT> {optional silence} <STOP CONSONANT> - shorten both to 1/2 + 1
    // <VOICED STOP CONSONANT> {optional silence} <STOP CONSONANT> Shorten both to (length/2 + 1)

    for (var i = 0; i < phonemes.length; i++) {
        var f = flags[phonemes[i].phoneme];
        var n = at(i+1);
        if (f & FLAG_VOWEL) {
            // <VOWEL> <RX | LX> <CONSONANT> - decrease length by 1
            if (n.phoneme == 18 || n.phoneme == 19)    // 'RX' & 'LX'
                phonemes[i].len -= 1;
        } else {
            if ((flags[n.phoneme] & FLAG_VOICED) == 0) {
                // <not VOWEL> <UNVOICED PLOSIVE> - decrease vowel by 1/8th
                if (flags[n.phoneme] & FLAG_PLOSIVE)
                    phonemes[i].phoneme -= phonemes[i].phoneme >> 3;
            } else  {
                // <not VOWEL> <VOICED CONSONANT> - increase vowel by 1/2 + 1
                if (flags[n.phoneme] & FLAG_CONSONANT)
                    phonemes[i].phoneme += (phonemes[i].phoneme >> 1) + 1;
            }
        }

        if (flags2[phonemes[i].phoneme] & 8)    // nasal
        {
            // <NASAL> <STOP CONSONANT> - set nasal = 5, consonant = 6
            if (flags[n.phoneme] & FLAG_STOPPED) {    // STOP CONSONANT
                phonemes[i].len = 5;    // nasal
                n.len = 6;
            }
        }

        // <UNVOICED STOP CONSONANT> {optional silence} <STOP CONSONANT> - shorten both to 1/2 + 1
        // <VOICED STOP CONSONANT> {optional silence} <STOP CONSONANT> Shorten both to (length/2 + 1)
        if (f & FLAG_STOPPED) {    // STOP CONSONANT
            var j = i+1;
            while (at(j).phoneme == 0 && (j < phonemes.length))
                j++;               // skip space
            if (flags[at(j).phoneme] & FLAG_STOPPED) {
                phonemes[i].len = (phonemes[i].len >> 1) + 1;
                at(j).len = (at(j).len >> 1) + 1;
            }
        }

        // <stopped><liquid> len -= 2
        if (flags2[phonemes[i].phoneme] & 16)    // FLAG2_LIQUID
        {
            if (flags[at(i-1).phoneme] & FLAG_STOPPED)
                phonemes[i].len -= 2;
        }
    }
    return phonemes;
}

// insert unvoiced consanant triples.
function insert_triples(phonemes)
{
    function insert(index,phoneme,len,stress)   // insert after index
    {
        phonemes.splice(index+1,0,{phoneme:phoneme,stress:stress,len:len});
    }

    for (var i = 0; i < phonemes.length; )  {
        var p = phonemes[i].phoneme;
        if ((flags[p] & FLAG_STOPPED) && (flags[p] & FLAG_PLOSIVE))  // FLAG_STOPPED
        {
            var j,n;
            for (j = i+1; j < phonemes.length; j++) {   // skip spaces
                if (n = phonemes[j].phoneme)
                    break;
            }
            if (j < phonemes.length) {
                if ((flags[n] & 8) || (n == 36) || (n == 37)) // '/H' '/X' after space?
                {
                    ++i;
                    continue;
                }
            }
            insert(i, p+1, phonemeLengthTable[p+1], phonemes[i].stress);
            insert(i+1, p+2, phonemeLengthTable[p+2], phonemes[i].stress);
            i += 2;
        }
        i++;
    }
    return phonemes;
}

var BREAK = 254;
function insert_breath(phonemes)
{
    function insert(index,phoneme,len,stress)   // insert after index
    {
        phonemes.splice(index+1,0,{phoneme:phoneme,stress:stress,len:len});
    }

    var len = 0;
    var space = 0;
    for (var i = 0; i < phonemes.length; )  {
        var p = phonemes[i].phoneme;
        len += phonemes[i].len;
        if (len < 232) {
            if (p == BREAK) {

            } else if ((flags2[p] & 1) == 0) {  // punctuation?
                if (p == 0)
                    space = i;
            } else {
                len = 0;
                insert(i, BREAK, 0, 0);
            }
        } else {
            i = space;
            insert(i, 31, 4, 0);        // 'Q*' glottal stop
            insert(++i, BREAK, 0, 0);
        }
        i++;
    }
    return phonemes;
}

function ts()
{
    var _tst = [
        "MEHDDUL, AESTRUNAHMIY, FAH5NKSHUN, TRAEK, DRAY, AA5RT, AOL, KOW",
        "GOW, NUW, DUW, SUW, ZUW5, THUW5, TUW5, CHYUW, JEY5, AXWEY5 EY4T, PAA5RTIY, TAA5RDIY",
    ];
    _tst.forEach(s => {
        console.log("parsing " + s);
        var a = parse1(s);
        a = parse2(a);
        a = copy_stress(a);
        a = adjust_lengths(a);
        a = insert_triples(a);
        a = insert_breath(a);
        a.forEach(p => {
            console.log(p.phoneme + " " + phoname(p.phoneme) + " " + p.stress);
        })
    });
}
ts();

