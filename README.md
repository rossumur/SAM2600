# SAM2600
A software speech synthesizer for the Atari 2600. 

## A Brief History of Speech Synthesis

### Voder
### The ARPABET
### Software Automatic Mouth (SAM)

To help introduce the Macintoshm Steve Jobs turned to Mark Barton and Andy Hertzfeld to bring SAM to a new audience as MacinTalk: https://www.folklore.org/StoryView.py?project=Macintosh&story=Intro_Demo.txt

## How it Works

### Text to Phonemes

### Phonemes to Formants to Sounds

### Data Format and playback

### Fitting into an Atari 2600
The speech engine only uses 1.2k leaving up to 2.8k for speech in a 4k cartridge. This is enough for about 2 minutes of continuous unique speech, or as much as you like with fancy bank switching.

The example roms use ~500 bytes to produce a animation that maps phonemes to mouth shapes. These mappings are far from perfect but the effect seems to work ok.

### Authoring Tool
[The SAM2600 Authoring Tool](https://rossumur.github.io/SAM2600/SAM2600.htm) can be used to create compact speech data from plain text or phonetic input.

