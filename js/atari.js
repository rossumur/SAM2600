

// Atari audio channel
function AudioChannel()
{
    var myAudf;
    var myAudc;
    var myAudv;

    var myClockEnable;
    var myNoiseFeedback;
    var myNoiseCounterBit4;
    var myPulseCounterHold;

    var myDivCounter;
    var myPulseCounter;
    var myNoiseCounter;

    var that = this;

    function reset()
    {
        myAudc = 0;
        myAudv = 0;
        myAudf = 0;
        myClockEnable = myNoiseFeedback = myNoiseCounterBit4 = myPulseCounterHold = false;
        myDivCounter = myPulseCounter = myNoiseCounter = 0;
    }
    reset();

    return {
        reset: function()
        {
            reset();
        },

        phase0: function()
        {
            if (myClockEnable) {
                myNoiseCounterBit4 = myNoiseCounter & 0x01;

                switch (myAudc & 0x03) {
                    case 0x00:
                    case 0x01:
                        myPulseCounterHold = false;
                        break;

                    case 0x02:
                        myPulseCounterHold = (myNoiseCounter & 0x1e) != 0x02;
                        break;

                    case 0x03:
                        myPulseCounterHold = !myNoiseCounterBit4;
                        break;
                }

                switch (myAudc & 0x03) {
                    case 0x00:
                        myNoiseFeedback =
                        ((myPulseCounter ^ myNoiseCounter) & 0x01) ||
                        !(myNoiseCounter || (myPulseCounter != 0x0a)) ||
                        !(myAudc & 0x0c);
                        break;

                    default:
                        myNoiseFeedback =
                        (((myNoiseCounter & 0x04) ? 1 : 0) ^ (myNoiseCounter & 0x01)) ||
                        myNoiseCounter == 0;
                        break;
                }
            }

            myClockEnable = myDivCounter == myAudf;

            if (myDivCounter == myAudf || myDivCounter == 0x1f) {
                myDivCounter = 0;
            } else {
                ++myDivCounter;
            }
        },

        phase1: function()
        {
            if (myClockEnable) {
                var pulseFeedback = 0;
                switch (myAudc >> 2) {
                    case 0x00:
                        pulseFeedback =
                        (((myPulseCounter & 0x02) ? 1 : 0) ^ (myPulseCounter & 0x01)) &&
                        (myPulseCounter != 0x0a) &&
                        (myAudc & 0x03);

                        break;

                    case 0x01:
                        pulseFeedback = !(myPulseCounter & 0x08);
                        break;

                    case 0x02:
                        pulseFeedback = !myNoiseCounterBit4;
                        break;

                    case 0x03:
                        pulseFeedback = !((myPulseCounter & 0x02) || !(myPulseCounter & 0x0e));
                        break;
                }

                myNoiseCounter >>= 1;
                if (myNoiseFeedback) {
                    myNoiseCounter |= 0x10;
                }

                if (!myPulseCounterHold) {
                    myPulseCounter = ~(myPulseCounter >> 1) & 0x07;

                    if (pulseFeedback) {
                        myPulseCounter |= 0x08;
                    }
                }
            }
            return (myPulseCounter & 0x01) * myAudv;
        },

        audc: function(value)
        {
            myAudc = value & 0x0f;
        },

        audv: function(value)
        {
            myAudv = value & 0x0f;
        },

        audf: function(value)
        {
            myAudf = value & 0x1f;
        }
    }
};


// https://www.randomterrain.com/atari-2600-memories-music-and-sound.html
// https://www.biglist.com/lists/stella/archives/199704/msg00007.html
// https://www.randomterrain.com/atari-2600-memories-program-tone-toy-2008.html

/*
 pixelclock/114 = 31440
 cpuclock/114 = 10480

 VALUE      WHAT IT SOUNDS LIKE
 ---------- ---------------------
 00 & 11    TOTALLY SILENT
 01         Buzzy tones
            pixelclock/114 001010000111011 divisor 15
 02         Carries distortion 1 downward into a rumble
            pixelclock/114 001010000111011->0100000000000000000100000000000 (465 bits long)
 03         Flangy wavering tones, like a UFO
            pixelclock/114 001010000111011->0010110011111000110111010100001 (465 bits long)
 04 & 05    Pure tones : 0 is 15720hz, 31 is 491.3hz
            pixelclock/114 01
 06 & 10    Inbetween pure tone and buzzy tones (Adventure death uses this). Maybe filters off the highs here
            pixelclock/114 1111111111111000000000000000000 divisor 31
 07 & 09    Reedy tones, much brighter, down to Enduro car rumble
            pixelclock/114 0010110011111000110111010100001 divisor 31
 08         White noise/explosions/lightning, jet/spacecraft engine
            pixelclock/114 white noise 511 bits
 12 & 13    Pure tones, goes much lower in pitch than 04 & 05. 1/3 freq
            CPUclock/114 10
 14         Electronic tones, mostly lows, extends to rumble.
            CPUclock/114 1111111111111000000000000000000 divisor 31 338->10
 15         Electronic tones, mostly highs, extends to rumble.
            CPUclock/114 0010110011111000110111010100001 divisor 31
*/

function FreqMap() {
public:
    var _freqs = new Float32Array(16*32);
    var that = this;
    function init(index,clock,div)
    {
        for (var f = 0; f < 32; f++)
            _freqs[index*32 + f] = clock/(f+1)/div;
    }

    init(1,31440,15);
    init(2,31440,465);
    init(3,31440,465);
    init(4,31440,2);
    //init(5,31440,2);
    init(6,31440,31);
    init(7,31440,31);
    init(8,31440,511);
    //init(9,31440,31);
    //init(10,31440,31);
    // 11
    init(12,10480,2);
    //init(13,10480,2);
    init(14,10480,31);
    init(15,10480,31);
    
    function match_one(control,f,c)
    {
        var index = control*32;
        for (var i = 0; i < 32; i++) {
            var err = Math.abs(_freqs[index+i] - f)/f;      //
            if (err < c.err) {
                c.err = err;
                c.control = control;
                c.frequency = i;
            }
        }
    }

    return {
        get_freq: function(c)
        {
            return _freqs[c.control*32 + c.frequency];
        },

        match: function(f,v,unvoiced)
        {
            var c = {volume:v,err:999999};
            if (unvoiced) {
                //match_one(8,f,c);     // lo TODO. SPECTRAL MATCH different table?
                match_one(12,f,c);      // med
                c.control = 8;          // hmm...spectral matchish?
            } else {
                //match_one(1,f,c,err);   // lo buzzy
                match_one(6,f,c);   // lo
                match_one(4,f,c);   // hi
                match_one(12,f,c);  // med - favor square wave?
            }
            return c;
        }
    }
};

// enough hardware to make a nice atari sound
function AtariAudio()
{
    var FREQUENCY = 15720*2;
    var a0 = new AudioChannel();
    var a1 = new AudioChannel();    
    var freq = new FreqMap();

    var last_out = 0;

    var last_s0 = 0;
    var last_s1 = 0;

    return {
        get: function()
        {
            a0.phase0();
            a1.phase0();
            var s0 = a0.phase1();
            var s1 = a1.phase1(); // 0 - 15

/*
            s0 *= 32768/16;
            s1 *= 32768/16;
            var a = 0.9;
            s0 = s0 - last_s0*a;
            last_s0 = (s0*7+last_s0)/8;
            s1 = s1 - last_s1*a;
            last_s1 = (s1*7+last_s1)/8;
            return last_s0 + last_s1;
            */
            /*

            var sample = (s0+s1) * 32767/64;         // remove dc
            return sample;
            var s = sample - last_out*0.1;
            var lo = s*.5 + last_out*0.5;
            last_out = sample;
            return s;
            */

            var mixed = (s0-s1) * 32767/32;             // remove dc
            last_out = (mixed*7 + last_out*1) / 8;      // slight low pass
            return last_out;
        },

        match: function(f,v,unvoiced)
        {
            return freq.match(f,v,unvoiced);
        },

        get_freq: function(c)
        {
            return freq.get_freq(c);
        },

        AUDV0: function(v) { a0.audv(v|0); },
        AUDV1: function(v) { a1.audv(v|0); },
        AUDF0: function(v) { a0.audf(v|0); },
        AUDF1: function(v) { a1.audf(v|0); },
        AUDC0: function(v) { a0.audc(v|0); },
        AUDC1: function(v) { a1.audc(v|0); }
    }
};
var _atari = new AtariAudio();
