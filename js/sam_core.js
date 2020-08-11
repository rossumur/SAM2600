


// generate 1/60th a frame of audio
var _phase = 0;
var _adata = [];

function atari_data(name,a)
{
	var data = name + "\n";
	for (var i = 0; i < a.length; i += 16) {
		var str = "    hex ";
		var n = Math.min(16,a.length-i);
		for (var j = 0; j < n; j++)
			str += hex(a[i+j]);
		data += str + "\n";
		if (((i + 16) & 0xFF) == 0)
			data += '\n';
	}
	return data;
}
make_mouth();

function make_atari()
{
	console.log(atari_data("speech",_adata));
	console.log(atari_data("vox_f1",_f1tab));
	console.log(atari_data("vox_f2",_f2tab));
	console.log(atari_data("vox_a",_atab));
	console.log(atari_data("vox_tia",_tia_tab));
	console.log(atari_data("vox_mix",G_MIX_TAB));
}

// pitch stress tab pitch delta 1-8
var _pitch_adjust = [-32 , -26 , -20 , -13 , -7 , 0 , 6 , 12];

function render60th(f1,v1,f2,v2,pitch,unvoiced,pcm,j)
{
	//f1 = TIAfrequencies[f1];
	//f2 = TIAfrequencies[f2];

	// pitch is  20 (1) => 64 (8) over range
	// this is approximate....
	
	//var p = (512/pitch - 16) | 0;
	//f1 += p;
	//f2 += p;

	f1 *= 27;
	f2 *= 27;	// no quant

	//v1 = amplitudeRescale[v1];	/// ???
	//v2 = amplitudeRescale[v2];	// does this really help

	var SYNTH_FREQ = 15720*2;
	var FRAME_SAMPLES = SYNTH_FREQ/60 | 0;
    var PAD = FRAME_SAMPLES/16 | 0;			// 

	if (1) {
		var ts = tiny_synth(f1,v1,f2,v2,unvoiced,pitch);		// pitch, larger is lower
		for (var i = 0; i < ts.length; i++)
			pcm[j++] = ts[i];
		return j;
	}

	var c0;
	var c1; //glottal swap?
	if (true || _phase & 1) {
    	c0 = _atari.match(f1,v1,unvoiced);  		// f1 is never unvoiced...TODO
    	c1 = _atari.match(f2,v2,unvoiced);		// buzzy formants?
	} else {
		c1 = _atari.match(f1,v1,unvoiced);  		// f1 is never unvoiced...TODO
    	c0 = _atari.match(f2,v2,unvoiced);		// buzzy formants?
	}
	_phase++;

	if (unvoiced) {
		c0.control = c1.control = 8;
		c0.frequency = 8;
		c1.frequency = 7;
	}

    //if (unvoiced)
    //	console.log(" f:" + f1 + "->" + c0.frequency + ",  f2:" + f2 + "->" + c1.frequency);

    _atari.AUDV0(c0.volume);
    _atari.AUDC0(c0.control);
    _atari.AUDF0(c0.frequency);
    _atari.AUDV1(c1.volume);
    _atari.AUDC1(c1.control);
    _atari.AUDF1(c1.frequency);

    _adata.push((c1.volume << 4) | c0.volume);
    _adata.push(((c0.control & 0xFE) << 4) | c0.frequency);
    _adata.push(((c1.control & 0xFE) << 4) | c1.frequency);

    //console.log(c0.control + "," + c0.volume + "," + c0.frequency + ","+ c1.control + "," + c1.volume + "," + c1.frequency);

    for (var n = 0; n < FRAME_SAMPLES; n++)
        pcm[j++] = _atari.get();

    if (!unvoiced) {
    	j -= PAD;
    	for (var n = 0; n < PAD; n++)
        	pcm[j++] = 0;
    }
	return j;
}

// TODO
// 1. compact representation
// 2. voiced/unvoiced consanants
// 3. better visualization
// 4. atari runtime
// 5. better phonemes

/*
	First mix output value is same as run
*/

/*
 SAMPLED VOICED CONSONANTS
0x09,0x33,0x0b,0x03,0x06,0x06,0x01,0x03,0x02,0x14,	// Z* 38 sampled consonant [VOICED,CONSONANT,ALVEOLAR,FRICATIVE] - zoo
0x0a,0x42,0x0b,0x05,0x06,0x06,0x02,0x03,0x02,0x14,	// ZH 39 sampled consonant [VOICED,CONSONANT,FRICATIVE] - pleasure
0x08,0x28,0x0b,0x03,0x07,0x08,0x03,0x03,0x02,0x14,	// V* 40 sampled consonant [VOICED,CONSONANT,FRICATIVE] - seven
0x0a,0x2f,0x0b,0x04,0x06,0x06,0x03,0x02,0x01,0x14,	// DH 41 sampled consonant [VOICED,CONSONANT,ALVEOLAR,FRICATIVE] - then
*/

var _frames;


// blend fraction.
// https://www.edn.com/design/systems-design/4421214/Double-speed-interpolation
// 
/*
blend   lsr                   ; Low bit of factor to CARRY
        sta   factor          ;  and save shifted result.
        lda   IN2,x           ; Init sum to IN2(i)
        ldy   #8              ; 8 iterations
blender bcc   addIN2          ; bit off: add IN2(i)
        clc                   ; bit on:  add IN1(i)
        adc   IN1,x           ;  (after clearing CARRY)
        jmp   shift

addIN2  adc   IN2,x           ; add IN2(i) (CARRY already clear)
shift   ror                   ; (shifts in any carry out)
        ror   factor          ; Next bit of factor to CARRY
        dey
        bne   blender         ; 8 iterations
        rts                   ; Return with OUT(i) in Accumulator.  
*/

// 8 bytes + 8 bytes temp
var G_PTR;
var G_STATE;
var G_COUNTER;
var G_RUN_MIX;
var G_MIX_FRACTION;
var G_PITCH;
var G_FORMANT;

var TEMP = [0,0,0,0,0,0,0,0];

var G_STATE_IDLE = 0;
var G_STATE_RUN = 1;
var G_STATE_MIX = 2;
var G_MIX_TAB = [255/1,255/2,255/3,255/4,255/5,255/6,255/7,255/8,255/9,255/10,255/11,255/12,255/13,255/14,255/15];

// small mem
// 8 + 6 + 4 temp? 20

var AUDV = [0,0];
var AUDC = [0,0];
var AUDF = [0,0];

function atari_vbl(pcm)
{
	var A,X;
	function blend(i) {
		return lerp_x(G_MIX_FRACTION >> 4,[TEMP[i]],[TEMP[i+4]],0);
	}

	function expand(x,offset)
	{
		TEMP[0+offset] = (_f1tab[x] & 0x7F) + (G_PITCH>>1);	// + pitch
		TEMP[1+offset] = _f2tab[x] + (G_PITCH>>1);
		TEMP[2+offset] = _atab[x] >> 4;
		TEMP[3+offset] = _atab[x] & 0x0F;

		var str = hex(x) + " " + hex(_atab[x]) + ' x:';
		for (var i = 0; i < 8; i++)
			str += hex(TEMP[i]) + " ";
		console.log(str);
	}

	function next()
	{
		G_FORMANT = _atari_data[G_PTR++];		// formant
		G_RUN_MIX = _atari_data[G_PTR++];		// run/mix
		//G_PITCH = _atari_data[G_PTR++];		// pitch index
		//G_PITCH = 0;
	}

	function next_formant()
	{
		return _atari_data[G_PTR];
	}

	function set_freq(f,x)
	{
		var A = _tia_tab[f];	// map frequencies to control...
		AUDF[x] = A;
		AUDC[x] = (A & 0xE0) >> 4;
	}

	function sound()
	{
		set_freq(TEMP[0],0);			// F1
		set_freq(TEMP[1],1);			// F2
		AUDV[0] = TEMP[2];				// A1
		AUDV[1] = TEMP[3];				// A2

		if (_f1tab[G_FORMANT] & 0x80) {
			AUVC0 = 8;
			AUVC1 = 8;
		}
	}

	if (G_STATE == G_STATE_RUN) {	// Now playing a Run
		if (--G_COUNTER)
			return;					// still running
		G_COUNTER = G_RUN_MIX;		// mix count may be zero
		G_RUN_MIX = G_MIX_TAB[G_RUN_MIX];	// mix step
		G_MIX_FRACTION = 0;			//
		G_STATE = G_STATE_MIX;		// now in mix state
	}

	// 4 byte temp for mix

	if (G_STATE == G_STATE_MIX) {		// Now mixing
		if (G_COUNTER) {
			G_MIX_FRACTION += G_RUN_MIX;	// mix step

			expand(G_FORMANT,0);
			expand(next_formant(),4);
			TEMP[0] = blend(0);
			TEMP[1] = blend(1);
			TEMP[2] = blend(2);
			TEMP[3] = blend(3);

			var str = 'b:';
			for (var i = 0; i < 8; i++)
				str += hex(TEMP[i]) + " ";
			console.log(str);

			sound();

			--G_COUNTER;
			return;
		}
		// now in idle state, fall thru
	}

	// Now in IDLE state, pull another
	next();
	// start the run
	G_STATE = G_STATE_RUN;
	G_COUNTER = G_RUN_MIX >> 4;			// run
	G_RUN_MIX &= 0xF;

	expand(G_FORMANT,0);
	console.log("starting " + phoname(G_FORMANT) + " run:" + G_COUNTER + ", mix:" + G_RUN_MIX);
	if (G_COUNTER == 0)
		throw "Run should never be zero here";
	sound();
}

function lerp_x(factor,in1,in2,x)
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

function sam_atari(pcm,stats)
{
	var s = init_sam();
	_atari_data = [];
	G_PTR = 0;
	G_STATE = 0;
	var frames = 0;

	for (var i = 0; i < s.length-3; i += 3) {
		_atari_data.push(s[i]);
		_atari_data.push(s[i+1]);
		var a = s[i+1];
		frames += (a >> 4) + (a & 0xF);
		//_atari_data.push(255/s[i+2] | 0);	// pitch!
	}

	var j = 0;
	var phase = 0;
	while (G_PTR < _atari_data.length) {
		atari_vbl(pcm);

		// Generate a frame
	    _atari.AUDV0(AUDV[0]);
	    _atari.AUDC0(AUDC[0]);
	    _atari.AUDF0(AUDF[0]);
	    _atari.AUDV1(AUDV[1]);
	    _atari.AUDC1(AUDC[1]);
	    _atari.AUDF1(AUDF[1]);

	    var SYNTH_FREQ = 15720*2;
		var FRAME_SAMPLES = SYNTH_FREQ/60 | 0;
    	var PAD = FRAME_SAMPLES/16 | 0;

    	for (var n = 0; n < FRAME_SAMPLES; n++)
        	pcm[j++] = _atari.get();

        if (--phase <= 0) {
	        j -= PAD;
	        for (var n = 0; n < PAD; n++)
	        	pcm[j++] = 0;
	    }
	}
	_adata = _atari_data;
	make_atari();
	console.log(frames + " frames in " + _atari_data.length + " bytes (" + _atari_data.length / (frames/60) + " per second)");
}

function sam_blend_synth(pcm)
{
	_frames = 0;
	var stats = [];
	//sam_samples();
	atari_sam_wav(pcm,stats);
	return stats;
	
	/*
	sam_atari(pcm,stats);
	return stats;
*/

	var s = init_sam();
	var frames = 0;
	var data = 0;
    var j = 0;

    function formant(f1,v1,f2,v2,p,unvoiced)
    {
    	console.log(" f:" + hex(flags) + " " + f1 + ":" +v1 + " " + f2 + ":" + v2 + " p:" + pitch);
    	j = render60th(f1,v1,f2,v2,p,unvoiced,pcm,j);
    }

    function lerp(m,n,a,b)
    {
    	m++;
    	n++;

    	var step = 255/m | 0;
    	step *= n;

    	var alpha = n/m;
    	//console.log("lerp " + alpha + " " + a + " " + b);
    	return (alpha*a + (1-alpha)*b + 0.5) | 0;
    }

	for (var i = 0; i < s.length-3; i += 3) {
		var pi = s[i];
		if (pi == 0x80) {
			data++;
			console.log("--- " + (frames ? (data*8 + 8)/frames*60 | 0 : -1));
			frames = data = 0;
			continue;
		}
		var run = s[i+1] >> 4;
		var mix = s[i+1] & 0x0F;	// number of frames to mix
		var pitch = s[i+2];			// pitch is really length glottal pulse (actually 3/4 pitch * some sample #)

		var flags = sampledConsonantFlags[pi];
		var a1 = _atab[pi] >> 4;
		var a2 = _atab[pi] & 0xF;
		var f1 = _f1tab[pi] & 0x7F;
		var f2 = _f2tab[pi];
		console.log(phoname(pi) + " f:" + hex(flags) + " run:" + run + " mix:" + mix + " " + (_f1tab[pi]&0x7F) + ":" +a1 + " " + _f2tab[pi] + ":" + a2 + " p:" + pitch);
		stats.push({name:phoname(pi),unvoiced:flags & 0xF8,fi:_frames,a1:a1,a2:a2,flags:flags,pi:pi,run:run,mix:mix,f1:TIAfrequencies[_f1tab[pi]],f2:TIAfrequencies[_f2tab[pi]]})

		var pi2 = s[i+3];
		if (pi2 == 0x80) {
			//run += mix;			// TODO: Fade out
			//mix = 0;
            pi2 = 0;
			stats.push({name:"end",unvoiced:0,fi:_frames+run+mix,a1:0,a2:0,flags:0,pi:0,run:0,mix:0,f1:0,f2:0});
		}

		data += 2;
		frames += run + mix;
		_frames += run + mix;	// global

		while (run--)
			formant(f1,a1,f2,a2,pitch,flags);

		if (pi2 == 0x80)
			continue;

		if (!mix)
			continue;

        // TODO? don't lerp to and from unvoiced?
        // 
        var unvoiced = flags & 0xF8;
        var unvoiced_next = sampledConsonantFlags[pi2] & 0xF8;
        unvoiced = unvoiced & unvoiced_next;

        var G_NOW =[];
        var G_NEXT = [];

        G_NOW[0] = f1;
        G_NOW[1] = a1;
        G_NOW[2] = f2;
        G_NOW[3] = a2;

		G_NEXT[0] = _f1tab[pi2] & 0x7F;
        G_NEXT[1] = _atab[pi2] >> 4;
        G_NEXT[2] = _f2tab[pi2];
        G_NEXT[3] = _atab[pi2] & 0x0F;

		var step = 255/(mix+1);
        var factor = 0;
		do {
			factor += step;
	        var tmp = [];
	       	for (var x = 0; x < 4; x++)
	       		tmp[x] = lerp_x(factor >> 4,G_NOW,G_NEXT,x);
	       	formant(tmp[0],tmp[1],tmp[2],tmp[3],pitch,unvoiced);
       	} while (--mix);
	}

	make_atari();
	console.log(stats);
	return stats;
}

function draw_stats(stats,pcm)
{
	var canvas = _q("#src_spectrogram");
	var width = canvas.width;
	var height = canvas.height;
	var scale = 20;
	var ctx = canvas.getContext("2d");

	function envelope(x,a,run,anext,mix)
	{
		a *= 4;
		anext *= 4;
		ctx.strokeStyle = "#44F";
		function strk() {
			ctx.beginPath();
			ctx.moveTo(x*scale,height/2 + a);
			ctx.lineTo((x+run)*scale,height/2 + a);
			ctx.lineTo((x+run+mix)*scale,height/2 + anext);
			ctx.stroke();
		}
		strk();
		a = -a;
		anext = -anext;
		strk();
	}

	ctx.fillStyle = "#000";
	ctx.fillRect(0,0,width,height);

	for (var i = 0; i < stats.length; i++) {
		var s = stats[i];
		var x = s.fi*scale;	// frame index

		ctx.fillStyle = s.unvoiced ? "#00F" : "#888";
		ctx.fillRect(x,0,1,height);

		if (s.run) {
			ctx.fillStyle = "#444";
			ctx.fillRect(x + s.run*scale,0,1,height);
		}

		ctx.fillStyle = "#AAA";
		var str = s.name + " " + s.f1 + " " + s.f2;
		var h = x + 2;
		ctx.fillText(s.name,h,10);

		if (i != stats.length-1) {
			envelope(s.fi,s.a1,s.run,stats[i+1].a1,s.mix);
			envelope(s.fi,s.a2,s.run,stats[i+1].a2,s.mix);
		}
		/*
		//ctx.fillText(str,x+2,20);
		ctx.fillText(s.f1,h,40);
		ctx.fillText(s.f2,h,50);
		*/
	}

	// draw computed waveform
	var avg = [];
	var n = (15720*2)/60/scale | 0;
	var sum = 0;
	for (var i = 0; i < pcm.length; i++) {
		sum += abs(pcm[i]);
		if (((i+1) % n) == 0) {
			avg.push(sum/n);
			sum =0;
		}
	}

	ctx.fillStyle = "rgba(255,255,255,0.33)";
	for (var i = 0; i < avg.length; i++) {
		var s = avg[i]/128;
		ctx.fillRect(i,height/2-s/2,1,s);
	}
}
