

var vox_sin;
var vox_f1;
var vox_f2;
var vox_amp;
var vox_vol;

// https://www.randomterrain.com/atari-2600-lets-make-a-game-spiceware-10.html
var seedhi = 1;
var seedlo = 0;
function rand16()
{
	var A = seedhi;
	var C = A & 1;
	A >>= 1;
	seedlo = (seedlo << 1) | C;
	if (seedlo > 255) {
		A ^= 0xB4;
		seedlo &= 0xFF;
	}
	seedhi = A & 0xFF;
	A ^= seedlo;
	return A;
}

//	need to add in run lengths for sampled things
//	this really should be part of the capture process in sam code

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

/*
Measured noise frequencies from sam sample tables
				First	second
Z*,S* 			4580
ZH,CH,SH,J*,T*	2890
V*,DH,F*,TH,P*	2343  1725
/H				2700  1060
/X				1600  1116

ranked by frequency
Z*,S* 			4580		// 1-2
ZH,CH,SH,J*,T*	2890		// 3
/H				2700  1060  // 4
V*,DH,F*,TH,P*	2343  1725	// 5
/X				1600  1116	// 7
*/


//  voiced phoneme: Z*, ZH, V*, DH
//  sampledConsonantFlags & 0xFC == 0
//   Phoneme   Sample Start   Sample End
//   32: S*    15             255	// Unvoiced fricatives
//   33: SH    257            511
//   34: F*    559            767
//   35: TH    583            767

//   36: /H    903            1023	// Unvoiced consonants
//   37: /X    1135           1279
//
//   38: Z*    84             119	// Voiced fricatives. TODO. Add noise on F2?
//   39: ZH    340            375
//   40: V*    596            639
//   41: DH    596            631
//
//   42: CH
//   43: **    399            511	// plosives
//
//   44: J*
//   45: **    257            276	// stop consonant
//   46: **
//
//   66: P*
//   67: **    743            767	// plosives
//   68: **
//
//   69: T*
//   70: **    231            255	// plosives
//   71: **

function patch_runs(s)
{
	for (var i = 0; i < s.length-3; i += 3) {
		var pi = s[i];
		var flags = sampledConsonantFlags[pi];
		if (flags & 0xF8) {
   			var page = (flags & 7)-1;						// 6 pages
			var offset = (flags & 0xF8) ^ 0xFF;				// offset into sample pages
			var SAM_SAMPLES_10MS_FRAME = 22050/100;
			var run = ((256-offset)*8/SAM_SAMPLES_10MS_FRAME + 0.5) | 0;	// approx number of frames
			s[i+1] = (s[i+1] & 0x07) | (run << 3);			// in frames 5:3 runs:mix
   		}
	}
}

// get the inferred amplitude of unvoiced sample
function get_amp(i)
{
	var amp = [ampl1data[i],ampl2data[i]];
	var flags = sampledConsonantFlags[i];
	if (flags & 0xF8) {	// unvoiced
		var page = (flags & 7)-1;
   		var hi = 5;
		var lo = [0x18, 0x1A, 0x17, 0x17, 0x17][page] & 0x0F;
   		var a = lo-hi;	// estimated from unvoiced wave things
   		amp[0] = amp[1] = amplitudeRescale[a*2];
	}
	return amp;
}

function make_wave_tables(mouth,throat,VOL_STEPS)
{
	SetMouthThroat(mouth || 128,throat || 128);
	VOL_STEPS = VOL_STEPS || 8;
	function aindex(a) {
		return a;
		//return max(0,a/15 * VOL_STEPS - 1) | 0;
	}

	vox_sin = new Uint8Array(256/2);
	vox_f1 = new Uint8Array(80);
	vox_f2 = new Uint8Array(80);
	vox_amp = new Uint8Array(80);
	vox_vol = new Uint8Array(VOL_STEPS*16);

	for (var i = 0; i < 256; i++)
		vox_sin[i>>1] = (Math.sin(2*Math.PI*i/256)*7 + 8) | 0;	// 128 or 64 might do, low nybble
		//vox_sin[i>>1] = (Math.sin(2*Math.PI*i/256)*7 + (Math.random()-1) + 8) | 0;	// 128 or 64 might do, low nybble

	var fscale = 15720/2/256;
	for (var i = 0; i < 80; i++) {
    	vox_f1[i] = freq1data[i]*27/fscale | 0;
    	vox_f2[i] = freq2data[i]*27/fscale | 0;
    	vox_amp[i] = (aindex(ampl1data[i]) << 4) | aindex(ampl2data[i]);

        // CALCULATE AMPLITUDE OF UNVOICED.....
    	var flags = sampledConsonantFlags[i];
		if (flags & 0xF8) {	// unvoiced
			var page = (flags & 7)-1;
	   		var hi = 5;
			var lo = [0x18, 0x1A, 0x17, 0x17, 0x17][page] & 0x0F;
	   		var a = lo-hi;	// estimated from unvoiced wave things
            a = aindex(a/3);
	   		vox_amp[i] = (a << 4) | a;	// unvoiced is lower
	   		vox_f1[i] |= 0x80;			// unvoiced
		} else {
			if (flags && ((flags & 0xFC) == 0)) {
				vox_f2[i] |= 0x80;		// frictives
    			vox_amp[i] = (aindex(ampl1data[i]/2) << 4) | aindex(ampl2data[i]/2);
			}
		}
    }

    for (var j = 0; j < VOL_STEPS; j++) {
        for (var i = 0; i < 16; i++)
        	vox_vol[j*16 + i] = i*j/(VOL_STEPS-1) | 0;
        	//vox_vol[j*16 + i] = amplitudeRescale[i*vscale | 0];
    }

    // output throat

	console.log(atari_data("vox_sin",vox_sin));
	console.log(atari_data("vox_f1",vox_f1));
	console.log(atari_data("vox_f2",vox_f2));
	console.log(atari_data("vox_amp",vox_amp));
	console.log(atari_data("vox_vol",vox_vol));
	console.log(atari_data("vox_mix",vox_mix));
	console.log(atari_data("vox_unvoiced_divider",vox_unvoiced_divider));
}

// constants
var VOX_FLAG_FRICTAVE = 0x80;
var VOX_FLAG_UNVOICED = 0x40;
var VOX_FLAG_MIXING = 0x20;

var vox_mix = [255/1|0,255/2|0,255/3|0,255/4|0,255/5|0,255/6|0,255/7|0,255/8|0,255/9|0,255/10|0,255/11|0,255/12|0,255/13|0,255/14|0,255/15|0];

// small mem
var VOX_PTR = 0;		// word
var VOX_FLAGS = 0;		// 
var VOX_COUNTER = 1;	// 
var VOX_PHONEME= 0;
var VOX_RUN_MIX= 0;

//	Blending system.
var VOX_MIX_FRAC = 0;
var VOX_MIX_STEP = 0;
var VOX_BLEND = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; // 15 keep together DEFAULT PITCH TODO!

// Params for sound production
var VOX_PITCH = 0;
var VOX_PITCH_COUNTER = 1;
var VOX_F1 = 0;
var VOX_F2 = 0;
var VOX_P1 = 0;
var VOX_P2 = 0;
var VOX_VOLPTR_1 = 0; // word
var VOX_VOLPTR_2 = 0; // word

function pia()
{
	var s = '';
	for (var i = 0; i < 15; i++)
		s += hex(VOX_BLEND[i]) + " ";
	s += hex(VOX_FLAGS);
	console.log(s);
}

// TODO buzzing is comming from zero amp
// Do we want a special silence frame?
// single byte? > 80 up to 127-80 frames of silence?

var vox_unvoiced_divider = [3,4,6,6,5,8, 0x80|0,0x80|1,0x80|3,0x80|3,0,4,0,4]; // 32-45

/*
// ranked by frequency
// Z*,S* 			4580		// 3
// ZH,CH,SH,J*,T*	2890		// 4
// /H				2700  1060  // 5
// V*,DH,F*,TH,P*	2343  1725	// 6
// /X				1600  1116	// 8

switch (VOX_PHONEME) {
	case 32: 	_atari.AUDF1(3); break;	// S*
	case 33: 	_atari.AUDF1(4); break;	// SH
	case 34: 	_atari.AUDF1(6); break;	// F*
	case 35: 	_atari.AUDF1(6); break;	// TH
	case 36: 	_atari.AUDF1(5); break;	// /H
	case 37: 	_atari.AUDF1(8); break;	// /X

	case 38: 	_atari.AUDF1(3); break;	// Z*  these are short and sound better with lower rates
	case 39: 	_atari.AUDF1(4); break;	// ZH
	case 40: 	_atari.AUDF1(6); break;	// V*
	case 41: 	_atari.AUDF1(6); break;	// DH

	case 43: 	_atari.AUDF1(4); break;	// CH2
	case 45: 	_atari.AUDF1(4); break;	// J2
	case 67: 	_atari.AUDF1(6); break;	// P2
	case 70: 	_atari.AUDF1(4); break;	// T2
}
*/

function atari_sam_frame()
{
	var A,X;
	var s = new Int16Array(131*4);
	var si = 0;

	function vox_sample()
	{
		if (VOX_F1) {									// unvoiced VOX_F1 == 0, buzzy = 1
			VOX_PITCH_COUNTER = (VOX_PITCH_COUNTER-1) & 0xFF;
			if (VOX_PITCH_COUNTER == 0) {
				VOX_P1 = 0;								// glottal stop is a phase change
				VOX_P2 = 0;
				VOX_PITCH_COUNTER = VOX_PITCH;			// current pitch

				// Add noise at end of glottal pulses on voiced fricatives
				if (VOX_FLAGS & VOX_FLAG_FRICTAVE) {
					VOX_FLAGS ^= 0x08;
					_atari.AUDC1(VOX_FLAGS);				// alternate between samples and noise (only in 1?)
					if (VOX_FLAGS & 0x08)
						VOX_PITCH_COUNTER = VOX_PITCH >> 2;	// burst of noise at end of pulse
				}
			} else {
				VOX_P1 += VOX_F1;
				A = vox_sin[(VOX_P1 & 0xFF)>> 1];		// can be 128 or less
				X = vox_vol[A + VOX_VOLPTR_1];
				VOX_P2 += VOX_F2;
				A = vox_sin[(VOX_P2 & 0xFF)>> 1];
				A = vox_vol[A + VOX_VOLPTR_2];
				_atari.AUDV1((X+A) >> 1);
			}
		}
		for (var j = 0; j < 4; j++)
			s[si++] = _atari.get();
	}


	// start a new sound
	function vox_sound(x)
	{
		_atari.AUDF1(vox_unvoiced_divider[VOX_PHONEME-32]);		// Get freq divider for noise for this guy
		if (VOX_FLAGS & VOX_FLAG_UNVOICED) {
			VOX_F1 = 0;
			if (VOX_PHONEME > 45)
				_atari.AUDF1(2);					// P2,T2 fixup as vox_unvoiced_divider is too small
			_atari.AUDC1(8);
			_atari.AUDV1(VOX_BLEND[x+3] >> 3);
			return;
		}

		// VOICED
		_atari.AUDC1(0);
		VOX_F1 = VOX_BLEND[x+0];					// Do we need to copy?
		VOX_F2 = VOX_BLEND[x+1];
		VOX_VOLPTR_1 = VOX_BLEND[x+2] & 0xF0;
		VOX_VOLPTR_2 = VOX_BLEND[x+3] & 0xF0;		// volume lookup table
		VOX_PITCH = VOX_BLEND[x+4] - (VOX_F1 >> 1);
	}

	// does this help?
	function blend(m)
	{
		var y = 5;
		if (m & VOX_MIX_FRAC)
			y = 10;
		VOX_BLEND[0] = (VOX_BLEND[0] + VOX_BLEND[y+0]) >> 1;
		VOX_BLEND[1] = (VOX_BLEND[1] + VOX_BLEND[y+1]) >> 1;
		VOX_BLEND[2] = (VOX_BLEND[2] + VOX_BLEND[y+2]) >> 1;
		VOX_BLEND[3] = (VOX_BLEND[3] + VOX_BLEND[y+3]) >> 1;
		VOX_BLEND[4] = (VOX_BLEND[4] + VOX_BLEND[y+4]) >> 1;
		vox_sample();	// fall thru...
	}

	function get_byte()
	{
		return _atari_data[VOX_PTR++];
	}

	// main entry loop
	// VBL
	// state is always either run or mix
	// run->run if zero run count
	// run->mix
	// mix->run

	// Handle state changes: probably ok to drop samples on state transitions
	// need to keep an even number of lines here tho.
	// maybe a timer dependng on get_byte complexity etc
	// vox_task
	if (--VOX_COUNTER == 0) {
		if ((VOX_FLAGS & VOX_FLAG_MIXING) == 0) {	// transitioning from run->mix
			VOX_COUNTER = VOX_RUN_MIX & 0x07;		// mix count may be zero
			VOX_MIX_STEP = vox_mix[VOX_COUNTER];	// mix step
			VOX_MIX_FRAC = 0;

			// Shift last blendable params, including pitch
			var x = 5;
			while (x--)
				VOX_BLEND[5+x] = VOX_BLEND[10+x];		// shift

			// Get next formant record from the stream,  2 or 3 bytes
			VOX_PHONEME = get_byte();					// formant
			if (VOX_PHONEME & 0x80) {
				VOX_BLEND[14] = get_byte();				// pitch update TODO
				VOX_PHONEME &= 0x7F;					// TODO. formant phase?
			}
			if (VOX_PHONEME >= 80) {					// 80-111 are run lengths (80 is actually invalid)
				VOX_RUN_MIX = (VOX_PHONEME-80) << 3;	// 5:3
				VOX_PHONEME = 0;						// indicates silence
			} else {
				VOX_RUN_MIX = get_byte();				// run/mix
				if ((VOX_RUN_MIX & 0xF8) == 0)
					throw "run should never be zero";
			}

			// Unpack new params
			x = VOX_PHONEME;
			VOX_BLEND[10] = vox_f1[x] & 0x7F;			// high bit is unvoiced flag
			VOX_BLEND[11] = vox_f2[x] & 0x7F;			// high bit is frictive flag
			VOX_BLEND[12] = (vox_amp[x] & 0xF0) >> 1;	// amplitude index in high nybble is 0..7
			VOX_BLEND[13] = (vox_amp[x] & 0x0F) << 3;	// blend[14] has new pitch info
			VOX_FLAGS = (VOX_FLAGS & VOX_FLAG_FRICTAVE) | VOX_FLAG_MIXING;	// now mixing, counter may be zero
		}
		
		// WSYNC if didn't fall thru from above
		if (VOX_COUNTER == 0 && (VOX_FLAGS & VOX_FLAG_MIXING)) {	// might be falling back to run
			VOX_COUNTER = VOX_RUN_MIX >> 3;				// run count, should always be nonzero
			VOX_FLAGS = vox_f2[VOX_PHONEME] & 0x80;		// transition back to run, set frictive flag
			if (vox_f1[VOX_PHONEME] & 0x80)				// high bit is unvoiced flag
				VOX_FLAGS |= VOX_FLAG_UNVOICED;			// promote flag on transition to run
			vox_sound(10);								// start playing new samples
		}
	} else {
		// WSYNC
		// WSYNC
	}

	// first 4 lines may be consumed with blending if in mix phase
	if ((VOX_FLAGS & VOX_FLAG_MIXING) == 0) {
		vox_sample();	// needs to be 2 lines, might as well copy? blend?
		vox_sample();
		vox_sample();
		vox_sample();
	} else {
		VOX_MIX_FRAC += VOX_MIX_STEP;	// always updated
		blend(0x10);		// 2 lines
		blend(0x20);
		blend(0x40);
		blend(0x80);
		vox_sound(0);		// update sound after every blend
	}
	// BLEND 0-4 is unused during rest of frame

	// record samples
	for (var i = 0; i < (131-4); i++)
		vox_sample();
	return s;
}

// Compress samples into atari runtime version
// A sample is encoded as 1,2 or 3 bytes
// Sample timing units are in VBLs so PAL and NTSC are going to be a bit different
// 1 byte: 80-127 is silence
// 2 bytes: 0..79 for formant index, (run << 3) | mix for durations up to about 1/2 second
// 3 bytes: 128 | 0..79 also includes a byte for pitch change

var _total_frames = 0;
function compress2vox(s,unsing,speed)
{
	patch_runs(s);
	log_reset();
	var dst = [];
	var pitch = 64;
	var last_silence = 0;
	var last_phoneme = 0;
	var repeated = [];

	speed = speed || 72;
	function adjust_speed(v)
	{
		return v*speed/72 | 0;
	}

	function write_one(phoneme,run,mix,p)
	{
		if (phoneme == 0) {
			if (run+mix > 31)
				throw "run+mix too big";
			dst.push(80+run+mix);
			log_(">Silence " + (run+mix) + "\n");
			return;
		}
		if (p) {
			dst.push(phoneme | 0x80);	// update pitch if changed
			dst.push(p);
			log_(">" + phoname(phoneme) + " " + run + ":" + mix + " pitch:" + p + "\n");
		} else {
			dst.push(phoneme);
			log_(">" + phoname(phoneme) + " " + run + ":" + mix + "\n");
		}
		dst.push((run << 3) | mix);
	}

	var curr;
	function flush_repeats(phoneme,pitch)
	{
		if (!curr)
			return;
		while (curr.run > 31) {
			write_one(curr.phoneme,31,0,curr.pitch);
			curr.pitch = 0;
			curr.run -= 31;
		}
		write_one(curr.phoneme,curr.run,curr.mix,curr.pitch);
		curr = null;
	}

	var phoneme;
	var frames = 0;
	for (var i = 0; i < s.length; i += 3) {
		phoneme = s[i];
		var flags = sampledConsonantFlags[phoneme];
		var unvoiced = flags & 0xFC;
		var run = s[i+1] >> 3;			// 5 bits
		var mix = s[i+1] & 0x07;		// 3 bits
		run = Math.max(1,adjust_speed(run));
		mix = adjust_speed(mix);

		var p = s[i+2];					// pitch
		var amp = get_amp(phoneme);
		frames += run + mix;

		var n = phoname(phoneme);
		//log_(n + " pitch:" + p + ", run:" + run + ", mix:" + mix + "\n");

		// force silence to formant 0
		if (phoneme >= 54 && amp[0] == 0 && amp[1] == 0)	// >= B* 54 STOPPED,PLOSIVE
			phoneme = 0;

		// a pitch of zero means something TODO
		// change pitch to undo singmode in some filesss
		if (p && unsing && !unvoiced)
			p += (vox_f1[phoneme] & 0x7F) >> 1;

		// check if it needs to be updated
		var update_pitch = (i == 0) || (p && p != pitch);
		update_pitch = update_pitch && !unvoiced && phoneme != 0;

		if (update_pitch || phoneme != last_phoneme)
			flush_repeats();
		last_phoneme = phoneme;
		if (update_pitch)
			pitch = p;

		if (!curr)
			curr = {phoneme:phoneme,run:run,mix:mix,pitch:update_pitch ? p : 0};
		else {
			if (phoneme != curr.phoneme)
				throw "what?";
			curr.run += run + curr.mix;
			curr.mix = mix;
		}
	}
	flush_repeats();

	//log_(dst.length + " bytes encoded, src was " + s.length + ", (" + ((dst.length*8*60/frames) | 0) + " bps)");
	//log_flush();
	_total_frames += frames;
	return dst;
}

// TODO
// debug gui
// plosive compression
// mouth animation
// Proper GUI for phoneme mapping
var _mouth = 128;
var _throat = 128;
function atari_sam_wav(src,pcm,speed,mouth,throat)
{
	var unsing = 0;
	if (!vox_sin || (_throat != throat) || (mouth != _mouth)) {
		make_wave_tables(mouth,throat);
		_mouth = mouth;
		_throat = throat;
	}

	//unsing = 1;	// for data that needs to be in singmode, sometimes songs already have the -(f1 >> 1) factored in
	_atari_data = compress2vox(src,unsing,speed);	// 

    _atari.AUDV0(0);
    _atari.AUDC0(0);
    _atari.AUDF0(0);
    _atari.AUDV1(0);
    _atari.AUDC1(0);
    _atari.AUDF1(0);

    VOX_PTR = 0;
	while (VOX_PTR < _atari_data.length) {
		var ts = atari_sam_frame();
		for (var i = 0; i < ts.length; i++)
			pcm.push(ts[i]);
	}
	_adata = _atari_data;
	//make_atari();
	return _atari_data;
}

function play_sam(src,speed,mouth,throat)
{
	var pcm = [];
	atari_sam_wav(src,pcm,speed,mouth || 128,throat || 128);
	return pcm;
}
