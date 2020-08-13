//====================================================================================
//====================================================================================
// Sample player/

var _audio_ctx = new (window.AudioContext || window.webkitAudioContext)();

// Play samples
function SamplePlayer(ctx) {
    var buf = [];
    var marks = [];
    var kRate = 262*60;
    var name = '';
    var analyser;
    var source;
    var processor;
    var fft = [];
    var that = {
        add: function(s16)
        {
            //if (buf.length > 30*kRate)
            //  throw "Too many samples"
            buf.push(s16);
        },
        freq: function()
        {
            return kRate;
        },
        set: function(samples,rate,n)
        {
            that.reset();
            that.sample_rate = rate;
            buf = samples;
            kRate = rate;
            name = n;
        },
        onended: null,
        source_onended: function()
        {
            console.log("got onended");
            source.stop();
            //processor.disconnect();
            if (that.onended)
                that.onended();
        },
        onaudioprocess: function(e)
        {
            if (!source)
                return;
            var array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            fft.push(array);
        },
        play: function()
        {
            if (source)
                source.disconnect(ctx.destination);
            
            var buffer = ctx.createBuffer(1,buf.length,kRate);
            var data = buffer.getChannelData(0);
            for (var i = 0; i < buf.length; i++)
                data[i] = buf[i]/32767;

            // audio source is our buffers of 8 bit etc
            source = ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(ctx.destination);
            source.onended = that.source_onended;

/*
            // processor for gettint fft chunks
            processor = ctx.createScriptProcessor(FFT_BINS*2, 1, 1);
            processor.connect(ctx.destination);
            processor.onaudioprocess = that.onaudioprocess;

            // analyser for fft
            analyser = ctx.createAnalyser();
            analyser.smoothingTimeConstant = 0;
            analyser.fftSize = FFT_BINS;
            source.connect(analyser);
            analyser.connect(processor);
*/
            source.start();
        },
        reset: function(n)
        {
            buf = [];
            marks = [];
            fft = [];
            name = n;
            kRate = 60*262;
        },
        samples: function()
        {
            return buf
        },
        mark: function(n)
        {
            marks[buf.length] = n;
        },
        getMarks: function()
        {
            return marks;
        },
        getName : function()
        {
            return name;
        },
        getFFT : function()
        {
            return fft;
        },

        encodeWAV: function()
        {
            var channels = 1;
            var rate = 262*60;
            var b = new Uint8Array(44+buf.length);
            function str(p,s)
            {
                for (var i = 0; i < s.length; i++)
                    b[p++] = s.charCodeAt(i);
            }
            function u16(p,n)
            {
                b[p++] = n;
                b[p++] = n>>8;
            }
            function u32(p,n)
            {
                b[p++] = n;
                b[p++] = n>>8;
                b[p++] = n>>16;
                b[p++] = n>>24;
            }

            str(0, 'RIFF');
            u32(4, 36 + buf.length);
            str(8, 'WAVEfmt ');
            u32(16, 16);        // fmt len
            u16(20, 1);         // raw
            u16(22, channels);
            u32(24, rate);
            u32(28, rate*channels);
            u16(32, channels);
            u16(34, 8);         // 8 bit pcm
            str(36, 'data');
            u32(40, buf.length);

            for (var i = 0; i < buf.length; i++)
                b[44+i] = 128-buf[i];
            return b;
        }
    }
    return that;
}
var _player = new SamplePlayer(_audio_ctx);

