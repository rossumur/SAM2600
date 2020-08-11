

var _sam_phonetics = 
`!VOWELS
IY  feet
IH  pin
EH  beg
AE  Sam
AA  pot
AH  budget
AO  talk
OH  cone
UH  book
UX  loot
ER  bird
AX  gallon
IX  digit

!DIPTHONGS
EY  made
AY  high
OY  boy
AW  how
OW  slow
UW  crew

!VOICED CONSONANTS
R   red
L   allow
W   away
WH  whale
Y   you
M   Sam
N   man
NX  song
B   bad
D   dog
G   again
J   judge
Z   zoo
ZH  pleasure
V   seven
DH  then

!UNVOICED CONSONANTS
S   Sam
SH  fish
F   fish
TH  thin
P   poke
T   talk
K   cake
CH  speech
/H  ahead

!SPECIAL PHONEMES
UL  settle (= AXL)
UM  astronomy (= AXM)
UN  function (= ASN)
Q   kitt-en (glottal stop)

!SAM internals
YX diphthong ending
WX diphthong ending
RX R after a vowel
LX L after a vowel
/X H before a non-front vowel or consonant
DX "flap" as in pity`;

var combined = [
//f1   f2   a1   a2  len slen flag  inb outb rank
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,  //  * 0 zero [PAUSE?]
0x13,0x43,0x00,0x00,0x12,0x12,0x00,0x02,0x02,0x1f,  // .* 1 zero [PUNCT,FLAG40,PAUSE?]
0x13,0x43,0x00,0x00,0x12,0x12,0x00,0x02,0x02,0x1f,  // ?* 2 zero [PUNCT,FLAG40,PAUSE?]
0x13,0x43,0x00,0x00,0x12,0x12,0x00,0x02,0x02,0x1f,  // ,* 3 zero [PUNCT,FLAG40,PAUSE?]
0x13,0x43,0x00,0x00,0x08,0x08,0x00,0x02,0x02,0x1f,  // -* 4 zero [PUNCT,FLAG40,PAUSE?]

0x0a,0x54,0x0d,0x0a,0x08,0x0b,0x00,0x04,0x04,0x02,  // IY 5 [VOICED,DIPTHONG_YX,VOWEL] - feet
0x0e,0x48,0x0d,0x0b,0x08,0x09,0x00,0x04,0x04,0x02,  // IH 6 [VOICED,DIPTHONG_YX,VOWEL] - pin
0x12,0x42,0x0e,0x0d,0x08,0x0b,0x00,0x04,0x04,0x02,  // EH 7 [VOICED,DIPTHONG_YX,VOWEL] - beg
0x18,0x3e,0x0f,0x0e,0x08,0x0e,0x00,0x04,0x04,0x02,  // AE 8 [VOICED,DIPTHONG_YX,VOWEL] - Sam
0x1a,0x28,0x0f,0x0d,0x0b,0x0f,0x00,0x04,0x04,0x02,  // AA 9 [VOICED,DIPTHONG_YX,VOWEL] - pot
0x16,0x2c,0x0f,0x0c,0x06,0x0b,0x00,0x04,0x04,0x02,  // AH 10 [VOICED,DIPTHONG_YX,VOWEL] - budget
0x14,0x1e,0x0f,0x0c,0x0c,0x10,0x00,0x04,0x04,0x02,  // AO 11 [VOICED,VOWEL] - talk
0x10,0x24,0x0f,0x0b,0x0a,0x0c,0x00,0x04,0x04,0x02,  // UH 12 [VOICED,VOWEL] - book
0x14,0x2c,0x0c,0x09,0x05,0x06,0x00,0x04,0x04,0x02,  // AX 13 [VOICED,DIPTHONG_YX,VOWEL] - gallon
0x0e,0x48,0x0d,0x0b,0x05,0x06,0x00,0x04,0x04,0x05,  // IX 14 [VOICED,DIPTHONG_YX,VOWEL] - digit
0x12,0x30,0x0c,0x0b,0x0b,0x0e,0x00,0x04,0x04,0x05,  // ER 15 [VOICED,VOWEL] - bird
0x0e,0x24,0x0f,0x0c,0x0a,0x0c,0x00,0x04,0x04,0x02,  // UX 16 [VOICED,VOWEL] - loot
0x12,0x1e,0x0f,0x0c,0x0a,0x0e,0x00,0x04,0x04,0x0a,  // OH 17 [VOICED,VOWEL] - cone
0x12,0x32,0x0d,0x0c,0x0a,0x0c,0x00,0x03,0x03,0x02,  // RX 18 [VOICED,VOWEL] - R after a vowel
0x10,0x24,0x0d,0x08,0x09,0x0b,0x00,0x03,0x02,0x08,  // LX 19 [VOICED,VOWEL] - L after a vowel
0x0c,0x1c,0x0d,0x08,0x08,0x08,0x00,0x04,0x04,0x05,  // WX 20 [VOICED,VOWEL] - diphthong ending
0x0e,0x44,0x0e,0x0c,0x07,0x08,0x00,0x04,0x04,0x05,  // YX 21 [VOICED,VOWEL] - diphthong ending
0x0a,0x18,0x0d,0x08,0x09,0x0b,0x00,0x03,0x02,0x0b,  // WH 22 [VOICED,CONSONANT] - whale
0x12,0x32,0x0c,0x0a,0x07,0x0a,0x00,0x03,0x02,0x0a,  // R* 23 [VOICED,CONSONANT,LIQUID] - red
0x0e,0x1e,0x0d,0x08,0x06,0x09,0x00,0x03,0x02,0x09,  // L* 24 [VOICED,CONSONANT,LIQUID] - allow
0x0a,0x18,0x0d,0x08,0x08,0x08,0x00,0x03,0x02,0x08,  // W* 25 [VOICED,CONSONANT,LIQUID] - away
0x08,0x52,0x0d,0x0a,0x06,0x08,0x00,0x03,0x02,0x08,  // Y* 26 [VOICED,CONSONANT,LIQUID] - you
0x06,0x2e,0x0c,0x03,0x07,0x08,0x00,0x01,0x01,0xa0,  // M* 27 [VOICED,FLAG08,CONSONANT,NASAL] - Sam
0x06,0x36,0x09,0x09,0x07,0x08,0x00,0x02,0x01,0x08,  // N* 28 [VOICED,FLAG08,CONSONANT,ALVEOLAR,NASAL] - man
0x06,0x56,0x09,0x06,0x07,0x08,0x00,0x03,0x01,0x08,  // NX 29 [VOICED,FLAG08,CONSONANT,NASAL] - song

0x06,0x36,0x00,0x00,0x02,0x03,0x00,0x02,0x01,0x17,  // DX 30 zero [FLAG08,CONSONANT,ALVEOLAR] - "flap" as in pity
0x11,0x43,0x00,0x00,0x05,0x05,0x00,0x01,0x01,0x1f,  // Q* 31 zero [VOICED,FLAG08,CONSONANT,FLAG40] - kitt-en (glottal stop)
0x06,0x49,0x00,0x00,0x02,0x02,0xf1,0x03,0x01,0x12,  // S* 32 sampled, 9 frames [CONSONANT,ALVEOLAR,FRICATIVE] - Sam
0x06,0x4f,0x00,0x00,0x02,0x02,0xe2,0x03,0x01,0x12,  // SH 33 sampled, 8 frames [CONSONANT,FRICATIVE] - fish
0x06,0x1a,0x00,0x00,0x02,0x02,0xd3,0x03,0x01,0x12,  // F* 34 sampled, 8 frames [CONSONANT,FRICATIVE] - fish
0x06,0x42,0x00,0x00,0x02,0x02,0xbb,0x03,0x01,0x12,  // TH 35 sampled, 7 frames [CONSONANT,ALVEOLAR,FRICATIVE] - thin
0x0e,0x49,0x00,0x00,0x02,0x02,0x7c,0x01,0x01,0x1e,  // /H 36 sampled, 4 frames [CONSONANT] - ahead
0x10,0x25,0x00,0x00,0x02,0x02,0x95,0x01,0x01,0x1e,  // /X 37 sampled, 5 frames [CONSONANT] - H before a non-front vowel or consonant

0x09,0x33,0x0b,0x03,0x06,0x06,0x01,0x03,0x02,0x14,  // Z* 38 sampled consonant [VOICED,CONSONANT,ALVEOLAR,FRICATIVE] - zoo
0x0a,0x42,0x0b,0x05,0x06,0x06,0x02,0x03,0x02,0x14,  // ZH 39 sampled consonant [VOICED,CONSONANT,FRICATIVE] - pleasure
0x08,0x28,0x0b,0x03,0x07,0x08,0x03,0x03,0x02,0x14,  // V* 40 sampled consonant [VOICED,CONSONANT,FRICATIVE] - seven
0x0a,0x2f,0x0b,0x04,0x06,0x06,0x03,0x02,0x01,0x14,  // DH 41 sampled consonant [VOICED,CONSONANT,ALVEOLAR,FRICATIVE] - then

0x06,0x4f,0x00,0x00,0x06,0x06,0x00,0x02,0x00,0x17,  // CH 42 zero [FLAG08,CONSONANT,FRICATIVE] - speech
0x06,0x4f,0x00,0x00,0x02,0x02,0x72,0x03,0x01,0x17,  // 43 43 sampled, 4 frames [CONSONANT,FRICATIVE]

0x06,0x42,0x01,0x00,0x08,0x09,0x00,0x02,0x00,0x1a,  // J* 44 [VOICED,FLAG08,CONSONANT] - judge
0x05,0x4f,0x0b,0x05,0x03,0x04,0x02,0x03,0x01,0x1a,  // 45 45 sampled consonant [VOICED,CONSONANT,FRICATIVE]
0x06,0x6e,0x00,0x0a,0x01,0x02,0x00,0x00,0x00,0x1d,  // 46 46 []
0x00,0x00,0x02,0x02,0x1e,0x01,0x00,0x00,0x05,0x1d,  // 47 47 []

0x12,0x48,0x0e,0x0e,0x0d,0x0e,0x00,0x05,0x05,0x02,  // EY 48 [VOICED,DIPTHONG,DIPTHONG_YX,VOWEL] - made
0x1a,0x26,0x0f,0x0d,0x0c,0x0f,0x00,0x05,0x05,0x02,  // AY 49 [VOICED,DIPTHONG,DIPTHONG_YX,VOWEL] - high
0x14,0x1e,0x0f,0x0c,0x0c,0x0f,0x00,0x05,0x05,0x02,  // OY 50 [VOICED,DIPTHONG,DIPTHONG_YX,VOWEL] - boy
0x1a,0x2a,0x0f,0x0d,0x0c,0x0f,0x00,0x05,0x05,0x02,  // AW 51 [VOICED,DIPTHONG,VOWEL] - how
0x12,0x1e,0x0f,0x0c,0x0e,0x0e,0x00,0x04,0x04,0x02,  // OW 52 [VOICED,DIPTHONG,VOWEL] - slow
0x0c,0x22,0x0d,0x08,0x09,0x0e,0x00,0x04,0x04,0x02,  // UW 53 [VOICED,DIPTHONG,VOWEL] - crew

// Stopped...
0x06,0x1a,0x02,0x00,0x06,0x08,0x00,0x02,0x02,0x1a,  // B* 54 [STOPPED,VOICED,FLAG08,CONSONANT] - bad
0x06,0x1a,0x04,0x01,0x01,0x02,0x00,0x00,0x00,0x1d,  // 55 55 [STOPPED,VOICED,FLAG08,CONSONANT]
0x06,0x1a,0x00,0x00,0x02,0x02,0x00,0x02,0x01,0x1b,  // 56 56 zero [STOPPED,VOICED,FLAG08,CONSONANT]

0x06,0x42,0x02,0x00,0x05,0x07,0x00,0x02,0x02,0x1a,  // D* 57 [STOPPED,VOICED,FLAG08,CONSONANT,ALVEOLAR] - dog
0x06,0x42,0x04,0x01,0x01,0x02,0x00,0x00,0x00,0x1d,  // 58 58 [STOPPED,VOICED,FLAG08,CONSONANT,ALVEOLAR]
0x06,0x42,0x00,0x00,0x01,0x01,0x00,0x03,0x01,0x1b,  // 59 59 zero [STOPPED,VOICED,FLAG08,CONSONANT,ALVEOLAR]

0x06,0x6e,0x01,0x00,0x06,0x07,0x00,0x02,0x02,0x1a,  // G* 60 [STOPPED,VOICED,FLAG08,CONSONANT] - again
0x06,0x6e,0x04,0x01,0x01,0x02,0x00,0x00,0x00,0x1d,  // 61 61 [STOPPED,VOICED,FLAG08,CONSONANT]
0x06,0x6e,0x00,0x00,0x02,0x02,0x00,0x04,0x01,0x1b,  // 62 62 zero [STOPPED,VOICED,FLAG08,CONSONANT]

0x06,0x54,0x01,0x00,0x06,0x07,0x00,0x02,0x02,0x1a,  // GX 63 [STOPPED,VOICED,FLAG08,CONSONANT]
0x06,0x54,0x04,0x01,0x01,0x02,0x00,0x00,0x00,0x1d,  // 64 64 [STOPPED,VOICED,FLAG08,CONSONANT]
0x06,0x54,0x00,0x00,0x02,0x02,0x00,0x03,0x01,0x1b,  // 65 65 zero [STOPPED,VOICED,FLAG08,CONSONANT]

0x06,0x1a,0x00,0x00,0x08,0x08,0x00,0x02,0x02,0x17,  // P* 66 zero [PLOSIVE,STOPPED,FLAG08,CONSONANT] - poke
0x06,0x1a,0x00,0x00,0x02,0x02,0x1b,0x00,0x00,0x1d,  // 67 67 sampled, 1 frames [PLOSIVE,STOPPED,FLAG08,CONSONANT]
0x06,0x1a,0x00,0x00,0x02,0x02,0x00,0x02,0x02,0x17,  // 68 68 zero [PLOSIVE,STOPPED,FLAG08,CONSONANT]

0x06,0x42,0x00,0x00,0x04,0x06,0x00,0x02,0x02,0x17,  // T* 69 zero [PLOSIVE,STOPPED,FLAG08,CONSONANT,ALVEOLAR] - talk
0x06,0x42,0x00,0x00,0x02,0x02,0x19,0x00,0x00,0x1d,  // 70 70 sampled, 1 frames [PLOSIVE,STOPPED,FLAG08,CONSONANT,ALVEOLAR]
0x06,0x42,0x00,0x00,0x02,0x02,0x00,0x02,0x01,0x17,  // 71 71 zero [PLOSIVE,STOPPED,FLAG08,CONSONANT,ALVEOLAR]

0x06,0x6d,0x00,0x00,0x06,0x07,0x00,0x03,0x03,0x17,  // K* 72 zero [PLOSIVE,STOPPED,FLAG08,CONSONANT] - cake
0x0a,0x56,0x0c,0x0a,0x01,0x02,0x00,0x00,0x00,0x1d,  // 73 73 [PLOSIVE,STOPPED,FLAG08,CONSONANT]
0x0a,0x6d,0x00,0x00,0x04,0x04,0x00,0x03,0x02,0x17,  // 74 74 zero [PLOSIVE,STOPPED,FLAG08,CONSONANT]

0x06,0x54,0x00,0x00,0x06,0x07,0x00,0x03,0x03,0x17,  // KX 75 zero [PLOSIVE,STOPPED,FLAG08,CONSONANT]
0x06,0x54,0x00,0x0a,0x01,0x01,0x00,0x00,0x00,0x1d,  // 76 76 [PLOSIVE,STOPPED,FLAG08,CONSONANT]
0x06,0x54,0x00,0x00,0x04,0x04,0x00,0x03,0x02,0x17,  // 77 77 zero [PLOSIVE,STOPPED,FLAG08,CONSONANT]

0x2c,0x7f,0x0f,0x00,0xc7,0x05,0x00,0xb0,0xa0,0x17,  // UL 78 [VOWEL] - settle (= AXL)
0x13,0x7f,0x0f,0x00,0xff,0x05,0x00,0xa0,0xa0,0x17,  // UM 79 [PLOSIVE,CONSONANT,VOWEL] - astronomy (= AXM)
];

var _sam_dict = `
abandon = AHBAE4NDUN
ability = AHBIH4LIXTIY
able = EY4BUL
abort = AHBOH4RT
about = AHBAW4T
above = AHBAH4V
absolute = AE5BSOHLUW4T
abuse = AHBYUW4S
accelerate = EHKSEH4LEREYT
accent = AE4KSEHNT
accept = AEKSEH4PT
access = AE4KSEHS
accident = AE4KSIXDEHNT
account = AHKAW4NT
acknowledge = EHKNA4LIHJ
action = AE4KSHUN
active = AE4KTIHV
address = AE4DREHS
adjust = AHJAH4ST
adult = AHDAH4LT
advance = EHDVAE4NS
adventure = AEDVEH4NCHER
affair = AHFEY4R
afford = AHFOH4RD
after = AE4FTER
age = EY4J
agree = AHGRIY4
air = EH4R
airplane = EH4RPLEYN
alarm = AHLAA4RM
algebra = AE4LJAXBRAH
alien = EY4LIYIXN
allow = AHLAW4
alone = AHLOW4N
along = AHLAO4NX
alphabet = AE4LFAXBEHT
alternate = AO4LTERNIXT
America = AHMEH4RIXKAH
among = AHMAH4NX
analysis = AHNAE4LIXSIXS
and = AE4ND
anger = AE4NXGER
announce = AHNAW4NS
answer = AE4NSER
antenna = AENTEH4NAH
anticipate = AENTIH4SIXPEYT
apology = AHPAA4LAXJIY
appear = AHPIY4R
apple = AE4PUL
appropriate = AHPROH4PRIYIXT
approve = AHPRUW4V
area = EH4RIYAH
arm = AA4RM
arrive = AHRAY4V
ask = AE4SK
assumption = AHSAH4MPSHUN
astronomy = AHSTRAA4NUMIY
Atari = AHTAA4RIY
atom = AE4TUM
attack = AHTAE4K
audio = AO4DIYOW
authority = AHTHOH4RIXTIY
automatic = AO5TUMAE4TIXK
auxiliary = AOKZIH4LYERIY
available = AHVEH4LAXBUL


- B -

baby = BEY4BIY
back = BAE4K
bad = BAE4D
balance = BAE4LIXNS
bank = BAE4NXK
bargain = BAA4RGUN
base = BEY4S
basic = BEY4SIHK
battle = BAE4TUL
beam = BIY4M
beautiful = BYUW4TIXFUHL
behave = BIY/HEY4V
belief = BIXLIY4F
beneficial = BEH4NAXFIH4SHUL
betray = BIYTREY4
better = BEH4TER
bible = BAY4BUL
bibliography = BIH5BLIYAA4GRAXFIY
bicycle = BAY4SIXKUL
billion = BIH4LYUN
binary = BAY4NEHRIY
bite = BAY4T
black = BAE4K
blast = BLAE4ST
block = BLAA4K
blood = BLAH4D
board = BOH4RD
bomb = BAA4M
book = BUH4K
boot = BUW4T
boss = BAO4S
bottle = BAA4TUL
bottom = BAA4TUM
box = BAA4KS
boy = BOY4
brain = BREY4N
branch = BRAE4NCH
break = BREY4K
brief = BRIY4F
bring = BRIH4NX
broken = BROW4KIXN
brother = BRAH4DHER
budget = BAH4JIXT
buffer = BAH4FER
bug = BAH4G
bureau = BYER4OW
burglar = BER4GULER
bus = BAH4S
business = BIH4ZNIXS
busy = BIH4ZIY
by = BAY4
byfe = BAY4T


- C -

cabinet = KAE4BUNIXT
cable KEY4BUL
calculate = KAE4LKYAXLEYT
calendar = KAE4LUNDER
call = KAO4L
calorie = KAE4LERIY
cancel = KAE4NSUL
candy = KAE4NDIY
cant = KAE4NT
capacity = KAXPAE4SIXTIY
captain = KAE4PTIXN
capture = KAE4PCHER
card = KAA4RD
careful = KEH4RFUHL
carry = KEH4RIY
cartridge = KAA4RTRIXJ
case = KEY4S
cashier = KAE4SHIY4R
cassette = KAXSEH4T
catalog = KAE4TULAOG
celebrate = SEH4LAXBREYT
celestial = SULEH4SCHIYUL
Celsius = SEH4LSIYAXS
center = SEH4NTER
certain = SER4TQN
challenge = CHAE4LIXNJ
change = CHEY4NJ
channel = CHAE4NUL
chapter = CHAE4PTER
charge = CHAA4RJ
chauvenism = SHOH4VIXNIHZUM
Cheese = CHIY4Z
child = CHAY4LD
children = CHIH4LDRIXN
chocolate = CHAO4KLIXT
choreography = KOH5RIYAA4GRAXFIY
Christmas = KRIH4SMAXS
church = CHER4CH
cinema = SIH4NUMAH
circle = SER4KUL
circuit = SER4KIXT
circumstance = SER4KUMSTAENS
citizen = SIH4TIXSUN
city = SIH4TIY
classify = KLAE4SIXFAY
clear = KLIY4R
close = KLOW4Z
coaxial = KOHAE4KSIYUL
coffee = KAO4FIY
coherent = KOW/HEH4RIXNT
cold = KOW4LD
college = KAA4LIXJ
color = KAH4LER
comfortable = KAH4MFTERBUL
command = KUMAE4ND
common = KAA4MUN
company = KAHM4PUNIY
complain = KUMPLEY4N
complex = KUMPLEH4KS
component = KAHMPOH4NUNT
computer = KUMPYUW4TER
condition = KUNDIH4SHUN
conscience = KAA4NSHUNTS
console = KAA4NSOHL
control = KUNTROH4L
conversation = KAA5NVERSEY4SHUN
coordinate = KOHWOH4DUNIXT
corporation = KOH5RPEREY4SHUN
correction = KOHREH4KSHUN
count = KAW4NT
country = KAH4NTRIY
cousin = KAH4ZIXN
create = KRIYEY4T
critical = KRIH4TIXKUL
culture = KAH4LCHER
curious = KYUH4RIYAXS


- D -

danger = DEY4NJER
data = DEY4TAH
decay = DIXKEY4
decibel = DEH4SIXBUL
decrease = DIYKRIY4S
definition = DEH5FUNIH4SHUN
degree = DIXGRIY4
delay = DIXLEY4
demonstrate = DEH4MUNSTREYT
department = DIYPAA4RTMIXNT
desire = DIXZAY4ER
develop = DIXVEH4LAHP
dictionary = DIH4KSHUNEHRIY
different = DIH4FRIXNT
discount = DIH4SKAWNT
distance = DIH4STIXNS
distribution = DIH5STRAXBYUW4SHUN
division = DIXVIH4ZHUN
doctor = DAA4KTER
double = DAH4BUL
down = DAW4N
drive = DRAY4V
dungeon = DAH4NJUN


- E -

earth = ER4TH
easy = IY4ZIY
economics = IY5KUNAA4MIXKS
education = EH5JUWKEY4SHUN
either = IY4DHER
eject = IXJEH4KT
electricity = ULEHKTRIH4SIXTIY
electronic = ULEHKTRAA4NIXK
elementary = EH4LUMEH4NTRIY
emphasis = EH4MFAXSIHS
encyclopedia=EHNSAY5KLAXPIY4DIYAH
energy = EH4NERJIY
engineering = EH5NJUNIY4RIHNX
enter = EH4NTER
enunciate = IYNAH4NSIYEYT
equal = IY4KWUL
erase = IXREY4S
error = EH4ROHR
escape = EHSKEY4P
estimate = EH4STUMIXT
Europe = YUH4RAXP
evil = IY4VUL
exciting = EHKSAY4TIHNX
explain = EHKSPLEY4N
expression EHKSPREH4SHUN
extra = EH4KSTRAH


- F -

face = FEY4S
fail = FEY4L
Fahrenheit = FEH4RIXN/HAYT
false = FAO4LS
family = FAE4MULIY
fast = FAE4ST
fatal = FEY4TUL
father= FAA4DHER
fault = FAO4LT
female = FIY4MEYL
fight = FAY4T
figure = FIH4GYER
file = FAY4L
filter= FIH4LTER6
finance = FAY4NAENS
find = FAY4ND
finger = FIH4NXGER
finish = FIH4NIXSH
fire = FAY4ER
first = FER4ST
flavor = FLEY4VER
flight = FLAY4T
flow chart = FLOW4CHAART
flower = FLAW4ER
fluorescent = FLUHREH4SIXNT
focus = FOW4KAXS
follow = FAA4LOW
foot = FUH5T
force = FOH4RS
formula = FOH4RMYUXLAH
forward = FOH4RWERD
fraction = FRAE4KSHUN
fragile = FRAE4JUL
freedom = FRIY4DUM
frequency = FRIY4KWUNSIY
from = FRAH4M
fuel = FYUW4L
full = FUH4L
function = FAH4NXKSHUN
fundamental = FAH5NDUMEH4NTUL
fuse = FYUW4Z
fusion = FYUWSZHUN
future = FYUW4CHER


- G -

gain = GEY4N
galaxy = GAE4LAXKSIY
game = GEY4M
garbage = GAA4RBIXJ
gasoline = GAE4SULIYN
gate = GEY4T
general = JEH4NERUL
generate = JEH4NEREYT
genius = JIY4NYAXS
gentle = JEH4NTUL
genuine = JEH4NUYXIXN
geometry = JIYAA4MIXTRIY
get = GEH4T
giant = JAY4IXNT
gift = GIH4FT
glass = GLAE4S
gnome = NOW4M
go = GOW4
gold = GOH4LD
good = GUH4D
gourmet = GUHRMEY4
government = GAH4VERNMEHNT
grand = GRAE4ND
graphic = GRAE4FIXK
gravity = GRAE4VIXTIY
ground = GRAW4ND
guarantee = GAE4RIXNTIY4
guide = GAY4D
gun = GAH4N
gyroscope = JAY4RAXSKOWP


- H -

habit = /HAE4BIXT
hacker = /HAE4KER
hair = /HEH4R
half = /HAE4F
hallucination = /HULUW4SIXNEY5SHUN
hand = /HAE4ND
happy = /HAE4PIY
hardware = /HAA4RDWEHR
harmony = /HAA4RMUNIY
have = /HAE4V
head = /HEH4D
heart = /HAA4RT
helicopter = /HEH4LIXKAAPTER
hello = /HEH4LOW
here = /HIY4R
hero = /HIY4ROW
herta = /HER4TS
hesitate = /HEH4ZIXTEY6T
hexadecimal = !HEH5KSIXDEH4SUMUL
high = /HAY4
history = /HIH4STERIY
hobby = /HAA4BIY
hold = /HOW4LD
home = /HOW4M
honest = AA4NIXST
horoscope = /HOH4RAXSKOWP
hospital = /HAA4SPIXTUL
hour = AW4ER
house = /HAW4S
however = /HAWEH4VER
huge /HYUW4J
human = /HYUW4MUN
humor = /HUYW4MER
husband = /HAH4ZBUND
hyper = /HAY4PER
hypothesis = /HAYPAA4THAXSIHS

- I -

I = AY4
ice = AY4S
idea = AYDIY4AX
identical = AYDEH4NTIXKUL
identity = AYDEH4N11XTIY
illusion = IHLUX4ZHUN
image = IH4MIXJ
imagination = IHMAE4JIXNEY5SHUN
immobilize = IXMOH4BULAYZ
important = IHMPOH4RTUNT
in = IH4N
inch = IHN4CH
included = IHNKLUX4DIXD
income = IH4NKUM
inconvenient = IHN5KUNVIY4NYUNT
increase = IHNKRIY4S
indeed = IHNDIY4D
index = IH4NDEHKS
indicate = IH4NDIXKEYT
indirect = IH5NDEREH4KT
individual = IH5NDIXVIH4JUWUL
industry = IH4NDAHSTRIY
inferior = IHNFIH4RIYER
inflation = IHNFLEY4SHUN
influence = IH4NFLUWIXNS
information = IH5NFERMEY4SHUN
-ing = IHNX
inject = IHNJEH4KT
injure = IH4NJER
initial = IXNIH4SHUL
inside = IHNSAY4D
inspect = IHNSPEH4KT
insulator = IH4NSULEYTER
integer = IH4NTIXJER
intelligent = IHNTEH4LIXJIXNT
interest = IH4NTREHST
interference = IH4NTERFIY4RIXNS
intermittent = IH4NTERMIH4TNNT
invader = IHNVEY4DER
invent = IHNVEH4NT
inverse = IH4NVERS
involve = IHNVAA4LV
iron = AY4ERN
irrational = IHRAE4SHUNUL
isolate = AY4SULEYT
issue = IH4SHUW
item = AY4TUM


- J -

jacket = JAE4KIXT
jam = JAE4M
jargon = JAA4RGUN
jazz = JAE4Z
jiffy = JIH4FIY
job = JAA4B
join = JOY4N
joke = JOW4K
judge = JAH4J
jump = JAH4MP
junction = JAH4NXKSHUN
junior = JUW4NYER
just = JAH4ST
jail = JEY4L
jewelry = JUW4LRIY
journey = JER4NIY
jungle JAH4NXGUL
junk = JAH4NXK


- K -

keep = KIY4P
key = KIY4
keyboard = KIY4BOHRD
kilobyte = KIH4LAXBAYT
kind = KAY4ND
kingdom = KIH4NXGDUM
knight = NAY4T
knowledge = NAA4LIXJ


- L -

label = LEY4BUL
lady = LEY4DIY
language = LAE4NXGWIXJ
large = LAA4RJ
laser = LEY4ZER
last = LAE4ST
late = LEY4T
laugh = LAE4F
launch = LAO4NCH
law = LAO4
layer = LEY4ER
lead = LIY4D
lease = LIY4S
lecture = LEH4KCHER
left = LEH4FT
legal = LIY4GUL
legend = LEH4JIXND
leisure = LIY4ZHER
length = LEH4NTH
letter = LEH4TER
level = LEH4VUL
liberal = LIH4BERUL
life = LAY4F
lift = LIH4FT
light = LAY4T
like = LAY4K
limit = LIH4MIXT
linear = LIH4NIYER
liquid = LIH4KWIXD
list = LIH4ST
listen = LIH4SIXN
literature = LIH4TERIXCHER
little = LIH4TU
load = LOW4D
local = LOW4KUL
location = LOWKEY4SHUN
lock = LAA4K
logarithm = LAO4GERIH5DHUM
logical = LAA4JIHKUL
long = LAO4NX
look = LUH4K
loop = LUW4P
lose = LOW4Z
love = LAH4V
low = LOW4
loyal = LOY4UL
luminescence = LUW4MIXNEH5SIXNS
lunatic = LUW4NAXTIH6K
luxury = LAH4GZHERIY


- M -

machine = MAXSHIY4N
madam = MAE4DUM
made = MEY4D
magazine = MAEGAXZIY4N
magic = MAE4JIHK
magnet = MAE4GNIXT
magnitude = MAE4GNIHTUX5D
mail = MEY4L
main = MEY4N
major = MEY4JER
make = MEY4K
malfunction = MAE5LFAH4NXKSHUN
man = MAE4N
manager = MAE4NIXJER
maneuver = MUNUW4VER
manipulate = MUNIH4PYUHLEYT
manual = MAE4NYUWUL
manufacture = MAE5NUYXFAE4KCHER
many = MEH4NIY
marginal = MAA4RJIXNUL
market = MM4RKIXT
marriage = MEH4RIXJ
mass = MAE4S
master = MAE4STER
mate = MEY4T
material = MAXTIH4RIYUL
mathematics = MAE4THUMAE5TIXKS
mature = MAXCHUX4R
maximum = MAE4KSIXMUM
may = MEY4
meaning = MUY4NIHNX
measure = MEH4ZHER
mechanical = MIXKAE4NIHKUL
mechanism = MEH4KUNIHZUM
media = MIY4DIYAH
medical = MEH4DIXKUL
medium = MIY4DIYUM
member = MEH4MBER
memory = MEH4MERIY
mental = MEH4NTUL
menu = MEH4NYUW
merchandise = MER4CHUNDAY5S
merge = MER4J
metal = MEH4TUL
meter = MIY4TER
method = MEH4THIXD
micro = MAY4KROW6
middle = MIH4DUL
might = MAY4T
mile = MAY4L
military = MIH4LIXTEH6RIY
million = MIH4LYUN
mind = MAY4ND
mineral = MIH4NERUL
miniature = MIH4NIYAXCHER
minimum = MIH4NIXMUM
minus = MAY4NIXS
miracle = MIH4RIXKUL
miscellaneous = MIH5SULEY4NIYAXS
missile = MIH4SUL
mister = MIH4STER
mixture = MIH4KSCHER
mnemonic = NIXMAA4NIXK
model = MAA4DUL
modulation = MAA4JULEY5SHUN
molecule = MAA4LIXKYUWL
moment = MOH4MIXNT
money = MAH4NIY
monitor = MAA4NIXTER
monolithic = MAANULIH4THIXK
monotone = MAA4NAXTOW6N
month = MAH4NTH
moon = MUW4N
morning = MOH4RNIHNX
most = MOW4ST
mother = MAH4DHER
motion = MOW4SHUN
motor = MOW4TER
mouth = MAW4TH
move = MUW4V
much = MAH4CH
multiply = MAH4LTIX6PLAY
murder = MER4DER
muscle = MAH4SUL
music = MYUW4ZIXK
must = MAH4ST
my = MAY4
myself = MAYSEH4LF
mystery = MIH4STERIY


- N -

naive = NAY5IY4V
name = NEY4M
narrate = NAE4REYT
narrow = NAE4ROW
natural = NAE4CHERUL
nature = NEY4CHER
navigate = NAE4VIXGEYT
near = NIY4R
need = NIY4D
negative = NEH5GAXTIH6V
negotiate NIXGOW4SHIYEYT
neighborhood = NEY4BER/HUH6D
nerve = NER4V
neutral = NUX4TRUL
news = NUW4Z
nice = NAY4S
night = NAY4T
noise = NOY4Z
nomenclature = NOH4MIXNKLEY6CHER
none = NAH4N
normal = NOH4RMUL
north = NOH4RTH
nose = NOW4Z
notation = NOHTEY4SHUN
notice = NOW4TIXS
nothing = NAH4THIHNX
now = NAW4
nuclear = NUX4KLIYER
number = NAH4MBER

- O -

object = AA4BJEHKT
obligation = AA5BLIXGEY4SHUN
observe = AXBZER4V
obvious = AA4BVIYAXS
occational = AHKEY4ZHUNUL
occupation = AA5KYUXPEY4SHUN
ocean = OW4SHUN
odd = AA4D
of = AH4V
off = AO4F
offer = AO4FER
office = AO4FIXS
official = AHFIH4SHUL
ogre = OW4GER
ohm = OW4M
oil = OY4L
O.K. = OW4KEY
old = OW4LD
omen = OW4MUN
on = AA4N
open = OW4PUN
operate = AA4PEREYT
opinion = AHPIH4NYUN
oppose = AHPOW4Z
opposite = AA4PAXSIHT
option = AA4PSHUN
orbit = OH4RBIHT
orchestra = OH4RKEHSTRAH
order = OH4RDER
ordinary = OH4RDIXNEHRIY
organize = OH4GUNAYZ
origin = OH4RIXJIXN
oscillation = AA5SULEY4SHUN
other = AH4DHER
ought = AO4T
out = AW4T
outlet = AW4TLEHT
output = AW4TPUHT
outside = AWTSAY4D
over = OW4VER
own = OW4N
oxygen = AA4KSAXJIXN


- p -

pack = PAEPAE4K
package = PAE4KIXJ
page = PEY4J
paint = PEY4NT
pair = PEH4R
palace = PAE4LIXS
panel = PAE4NUL
paper = PEY4PER
parabola = PERAE4BULAH
paradox = PAE4RAXDAA6KS
parallel = PAE4RULEH6L
paragraph = PAE4RAXGRAEF
pardon = PAA4RDUN
parent = PEH4RUNT
parity = PAE4RIXTIY
park = PAA4RK
part = PAA4RT
particle = PAA4RTIXKUL
particular = PAARTIH4KYUHLER
pass = PAE4S
patch = PAE4TCH
pathetic = PAHTHEH4TIXK
pattern = PAE4TERN
pause = PAO4Z
pay = PEY4
payroll = PEY4ROW6L
peculiar = PIXKYUW4LYER
penalty = PEH4NULTIY4
penetrate = PEH4NAXTREY6T
perception = PERSEH4PSHUN
perfect = PER4FIXKT
period = PIH4RIYIXD
permanent = PER4MUNIXNT
permission = PERMIH4SHUN
person = PER4SUN
personality = PER4SUNAE5LIX1
perspective = PERSPEH4KTIXV
pet = PEH4T
phantom = FAE4NTUM
phase = FEY4Z
phenomenon = FUNAA4MIXNU
philosophy = FULAA4SAHFIY
phoneme = FOW4NIYM
photo = FOW4TOW
physical = FIH4ZIXKUL
physics = FIH4ZIXKS
piano = PYAE4NOW
pick = PIH4K
picture = PIH4KCHER
pilot = PAY4LIXT
pin = PIH4N
pirate = PAY4RIXT
pistol = PIH4STUL
pitch = PIH4TCH
pity = PIH4TIY
place = PLEY4S
plan = PLAE4N
planet = PLAE4NIXT
plastic = PLAE4STIxK
plausible = PLAO4ZAXBUL
play = PLEY4
please = PLIY4Z
pleasure = PLEH4ZHER
plectrum = PLEH4KTRUM
plenty = PLEH4NTIY
plot = PLAA4T
plug = PLAH4G
plus = PLAH4S
poetry = POW4IXTRIY
point = POY4NT
poke = POW4K
police = PULIY4S
policy = PAA4LIXSIY
polynomial = PAA5LIXNOH4MIYUL
pop = PAA4P
popular = PAA4PYULER
population = PAA4PYULEY4SHUN
port = POH4RT
portable = POH4RTAXBUL
positive = PAA4ZIXTIX6V
position = PAXZIH4SHUN
power= PAW4ER
practice = PRAE4KTIHS
precise = PRIXSAY4S
prefer = PRIXFER4
preliminary = PREIXLIH4MIXNEHRIY
prepare = PRIXPEH4R
present = PREH4ZIXNT
press = PREH4S
pressure = PREH4SHER
prevent = PRIXVEH4NT
primary = PRAY4MEHRIY
primitive = PRIH4MIXTIX6V
prince = PRIH4NS
princess = PRIH4NSEHS
print = PRIH4NT
private = PRAY4VIXT
probably = PRAA4BAXBLIY
problem = PRAA4BLUM
proceed = PROHSIY4D
process = PRAA4SEHS
produce = PRAXDUW4S
professional = PRAXFEH4SHUNUL
professor = PRAHFEH4SER
profit = PRAA4FIXT
program = PROW4GRAEM
project = PRAA4JEHKT
promise = PRAA4MIHS
pronounce = PRUNAW4NS
proper = PRAA4PER
proportional = PRAXPOH4RSHUNUL
protect = PRAXTEH4KT
proud = PRAW4D
psychiatrist = SAYKAY4AXTRIX6ST
public = PAH4BLIXK
publish = PAH4BLIHSH
pull = PUH4L
pulse = PAH4LS
pure = PYUW4R
push = PUH4SH
put = PUH4T


- Q -

quality = KWAA4LIXTIY
quantity = KWAA4NTIXTIY
question = KWEH4SCHUN
quick= KWIH4K
quiet = KWAY4IXT
quit = KWIH4T
quiz = KWIH4Z
quote = KWOW4T
quotient = KWOW4SHUNT


- R -

race = REY4S
radar = REY4DAAR
radiation = REY5DIYEY4SHUN
radio = REY4DIYOW
radius = REY4DIYAHS
rain = REY4N
random = RAE4NDUM
range = REY4NJ
rare = REH4R
rate = REY4T
rather = RAE4DHER
ratio = REY4SHIYOW
reach = RIY4CH
reaction = RIYAE4KSHUN
read = RIY4D
realistic = RIY5LIH4STIXK
reason = RIY4ZUN
receive = RIXSIY4V
reciter = RIXSAY4TER
recognize = REH4KAXGNAYZ
recommend = REH5KUMEH4ND
record = REH4KERD
recover = RIYKAH4VER
rectangle = REH4KTAENXGUL
reduce = RIXDUW4S
refer = RIYFER4
reference = REH4FERIXNS
reflection = RIXFLEH4KSHUN
refrigerator = RIXFRIH4JEREYTER
region = RIY4JUN
register = REH4JIXSTER
regular = REH4GYUXLER
reject = RIXJEH4KT
relativity = REH5LAXTIH4VIXTIY
relax = RIXLAE4KS
relay= RIY4LEY
release = RIXLIY4S
relief = RIYLIY4F
religion = RIXLUH4JUN
remain = RIYMEY4N
remember = RIXMEH4MBER
remove = RIYMUX4V
rent = REH4NT
repeat = RIXPIY4T
replace = RIXPLEY4S
reply = RIXPLAY4
report = RIXPOH4RT
represent = REHPRIXZEH4NT
reproduction = RIY5PRAXDAH4KSHUN
republic = RIXPAH4BLIXK
rescue = REH4SKYUW
research = RIY4SERCH
reserve = RIXZER4V
resistance = RIXZIH4STUNS
respect = RIXSPEH4KT
response = RIXSPAA4NS
rest = REH4ST
restore = RIXSTOH4R
retail = RIY4TEY6L
return = RIXTER4N
reverse = RIXVER4S
review = RIXVYUW4
revolution = REH5VULUXWSHUN
rhapsody = RAE4PSAXDIY
rhythm = RIH4DHUM
rich = RIH4CH
ride = RAY4D
ridiculous = RIXDIH4KYULAXS
right = RAY4T
rigid = RIH4JIXD
ring = RIH4NX
rise = RAY4Z
river = RIH4VER
road = ROW4D
rocket = RAA4KIXT
roll = ROH4L
room = RUW4M
rough = RAH4F
round = RAW4ND
rubber= RAH4BER
rule = RUW4L
run = RAH4N
rush = RAH4SH


- S -

sabotage = SAE5BAXTAA6ZH
sacrifice = SAE4KRIXFAYS
sad = SAE4D
safe = SEY4F
safety = SEY4FTIY
saint = SEY4NT
sale = SEY4L
S.A.M. = SAE4M
same = SEY4M
sample = SAE4MPUL
sanctuary = SAE4NXKCHUWEH6RIY
sandwich = SAE4NWIXCH
sarcasm = SAA4IRKAEZUM
satisfaction = SAE4TIXSFAE4KSHUN
savage = SAE4VIXJ
save = SEY4V
say = SEY4
scale = SKEY4L
scandal = SKAE4NDUL
scarce = SKEY4RS
scatter = SKAE4TER
scenic = SIY4NIXK
schedule = SKEH4JYUWL
scheme = SKIY4M
scholar = SKAA4LER
school = SKUW4L
science = SAY4IHNS
scientific = SAY4UNTIH5FIXK
scientific = SAY4AXNTIH5FIXK
scissors = SIH4ZERZ
score = SKOH4R
scramble = SKRAE4MBUL
scratch = SKRAE4CH
scream = SKRIY4M
screw = SKRUW4
script = SKRIH4PT
scroll = SKROW4L
seal = SIY4L
search = SER4CH
season = SIY4ZUN
second = SEH4KUND
secret = SIY4KRIXT
secretary = SEH4KRIXTEH5RIY
section = SEH4KSHUN
security = SIXKYUH4RIXTIY
see = SIY4
seek = SIY4K
segment = SEH4GMIXNT
self = SEH4LF
sell = SEH4L
semi- = SEH4MIY
send = SEH4ND
sensation = SEHNSEY4SHUN
senior = SIY4NYER
sense = SEH4NS
sensible = SEH4NSIXBUL
sensitive = SEH4NSIXTIX6V
sentence = SEH4NTIXNS
separate = SEH4PERIXT
sequence = SIY4KWEHNS
serial = SIH4RIYUL
serious = SIH4RIYAHS
serve = SER4V
service = SER4VIXS
session = SEH4SHUN
set = SEH4T
settle = SEH4TUL
several = SEH4VERUL
sex = SEH4KS
shadow = SHAE4DOW
shake = SHEY4K
shame = SHEY4M
shape = SHEY4P
share = SHEY4R
sharp = SHAA4RP
she = SHIY4
sheet = SHIY4T
shield = SHIY4LD
shift = SHIH4FT
shock = SHAA4K
shoot = SHUW4T
shop = SHAA4P
short = SHOH4RT
should = SHUH4D
show = SHOW4
shy = SHAY4
sick = SIH4K
side = SAY4D
sight = SAY4T
sign = SAY4N
signal = SIH4GNUL
silent = SAY4LIXNT
silver = SIH4LVER
similar = SIH4MULER
simple = SIH4MPUL
simplicity = SIHMPLIH4SIXTIY
simulator = SIH4MYULEYTER
sin = SIH4N
single = SIH4NXGUL
sinister = SIH4NIXSTER
sir = SER4
siren = SAY4RIXN
sit = SIH4T
situation = SIH5CHUWEY4SHUN
skeptical = SKEH4PTIXKUL
sketch = SKEH4TCH
skill = SKIH4L
skip = SKIH4P
slang = SLAE4NX
sleep = SLIY4P
sleeve = SLIY4V
slip = SLIH4P
slot = SLAA4T
slow = SLOW4
small = SMAO4L
smart = SMAA4RT
smell = SMEH4L
smooth = SMUW4DH
snap = SNAE4P
so = SOW4
social = SOW4SHUL
society = SAXSAY4IXTIY
soft = SAO4FT
solar = SOW4LER
soldier = SOH4LJER
solemn = SAA4LUM
solid = SAA4LIXD
solitude = SAA4LIXTUW6D
solution = SULUW4SHUN
some = SAH4M
somebody = SAH4MBAADIY
song = SAO4NX
soon = SUW4N
sophisticated = SAXFIH4STIXKEYTIXD
sorry = SAA4RIY
sort = SOH4RT
sound = SAW4ND
south = SAW4TH
space = SPEY4S
spare = SPEY4R
spatial = SPEY4SHUL
speak = SPIY4K
special = SPEH4SHUL
specific = SPAXSIH4FIXK
speculate = SPEH4KYULEYT
speech = SPIY4CH
speed = SPIY4D
spell = SPEH4L
spend = SPEH4ND
sphere = SFIY4R
spin = SPIH4N
spiral = SPAY4RUL
spirit = SPIH4RIXT
splendid = SPLEH4NDIXD
split = SPLIH4T
spoil = SPOY4L
spontaneous = SPAANTEY4NIYAHS
sports = SPOH4RTS
spot = SPAA4T
spread = SPREH4D
spring = SPRIH4NX
spy = SPAY4
square = SKWEH4R
squeeze = SKWIY4Z
stability = STAXBIH4LIXTIY
staff = STAE4F
stand = STAE4ND
standard = STAE4NDERD
star = STAA4R
start = STAA4RT
state = STEY4T
static = STAE4TIXK
station = STEY4SHUN
stay = STEY4
steady = STEH4DIY
steer = STIY4R
step = STEH4P
stereo = STEH4RIYOW
stick = STIH4K
stimualte = STIH4MYULEYT
stock = STAA4K
stone = STOW4N
stop = STAA4P
store = STOH4R
story = STOH4RIY
straight = STREY4T
strange = STREY4NJ
strategy = STRAE4TIXJIY
street = STRIY4T
strength = STREY4NTH
strike = STRAY4K
strong = STRAO4NX
structure = STRAH4KCHER
stubborn = STAH4BERN
student = STUW4DIXNT
study = STAH4DIY
stuff = STAH4F
stupid = STUX4PIXD
style = STAY4L
subject = SAH4BJEHKT
substance = SAH4BSTIXNS
subtle = SAH4TUL
succession = SAHKSEH4SHUN
succeed = SAHKSIY4D
such = SAH4CH
sudden = SAH4DIXN
suggest = SAHGJEH4ST
sum = SAH4M
summer = SAH4MER
sun = SAH4N
super = SUX4PER
superb = SUXPER4B
superior = SUXPIH4RIYER
supply = SAXPLAY4
support = SAXPOH4RT
sure = SHUX4R
surprise = SERPRAY4Z
surroundings = SERAW4NDIHNXGZ
suspend = SAHSPEH4ND
swear = SWEH4R
sweep = SWIY4P
swell = SWEH4L
swing = SWIH4NX
syllable = SIH4LAXBUL
symbol = SIH4MBUL
symbolic = SIHMBAA4LIXK
symmetric = SIHMEH4TRIXK
sympathy = SIH4MPAXTHIY
synchronize = SIH4NXKRAX5NAYZ
synonym = SIH4NUNIXM
system = SIH4STUM
synthesizer = SIH4NTHAXSAYZER


- T -

tab = TAE4B
table = TEY4BUL
tactical = TAE4KTIXKUL
tail = TEY4L
take = TEY4K
talent = TAE4LIX6NT
tall = TAO4L
talk = TAO4K
tap = TAE4P
tape = TEY4P
target = TAA4RGIXT
task = TEY4ST
tax = TAE4KS
teach = TIY4CH
team = TIY4M
technical = TEH4KNIXKUL
technology = TEHKNAA4LAXJIY
telephone = TEH4LAX6FOWN
television = TEH4LAX6VIXZHUN
temper = TEH4MPER
tender = TEH4NDER
tense = TEH4NS
tension = TEH4NSHUN
term = TER4M
terminal = TER4MIXNUL
terrestrial = TER6EH4STRIY6UL
terrible = TEH4RAXBUL
territory = TEH4RAXTOH6RIY
terror = TEH4RER6
test = TEH4ST
testimony = TEH4STUMOHNIY
text = TEH4KST
than = DHAE4N
than = DHAE4N
thank = THAE4NXK
that = DHAE4T
the = DHAH4
theater = THIY4AHTER
then = DHEH4N
theorem = THIY4RUM
theory = THIY4RIY
thermometer = THERMAA4MIXTER
thesis = THIY4SIXS
they = DHEY4
thin = THIH4N
thing = THIH4NX
think = THIH4NXK
this = DHIH4S
thought = THAO4T
threshold = THREH4SH/HOWLD
through = THRUW4
ticket = TIH4KIXT
tight = TAY4T
time = TAY4M
tiny = TAY4NIY
tired = TAY4ERD
title = TAY4TUL
together = TUXGEH4DHER
tolerance = TAA4LERIXNS
tone = TOW4N
tool = TUW4L
top = TAA4P
toss = TAO4S
touch = TAH4CH
tough = TAH4F
tournament = TER4NUMIXNT
toward = TOH4RD
toward = TOW4RD
town = TAW4N
toy = TOY4
trace = TREY4S
track = TRAE4K
trade = TREY4D
tradition = TRAXDIH4SHUN
traffic = TRAE4FIXK
trail = TREY4L
trajectory = TRAXJEH4KTERY
transaction = TRAENZAE4KSHUN
transfer = TRAE4NSFER
transform = TRAENSFOH4RM
transistor = TRAENZIH4STER
translate = TRAE4NZLEYT
transmit = TRAE4NZMIXT
transparent = TRAE5NSPEH4RIXNT
transportation = TRAE5NZPOHRTEY4SHUN
trap = TRAE4P
treasury = TREH4ZHERIY
tree = TRIY4
trek = TREH4K
tremendous = TRIXMEH4NDAXS
trespass = TREH4SPAES
trial = TRAY4UL
trangle = TRAY4AENXGUL
trick = TRIH4K
trgger = TRIH4GER
trim = TRIH4M
trip = TRIH4P
triple = TRIH4PUL
triumph = TRAY4AHMF
troll = TROW4L
trophy = TROW4FIY
trouble = TRAH4BUL
truck = TRAH4K
true = TRUW4
truth = TRUW4TH
trj = TRAY4
tune = TUW4N
tunnel = TAH4NUL
turn = TER4N
tutor = TUW4TER
twist = TWIH4ST
type = TAY4P
typewriter = TAY4PRAYTER

- U -

ugly = AH4GLIY
ultimate = AH4LTAX6MIXT
uncle = AH4NKUL
under = AH4NDER
understand = AH5NDERSTAE4ND
uniform = YUW4NIXFOHRM
union = YUW4NYUN
unit = YUW4NIXT
universal = YUW5NIXVER4SUL
unless = AHNLEH4S
up = AH4P
upset = AHPSEH4T
urge = EH4RJ
use = YUW4S
utility = YUWTIH4LIXTIY


- V -

vacation = VEYKEY4SHUN
vacuum = VAE4KYUWM
vague = VEY4G
valid = VAE4LIXD
value = VAE4LYUW
valve = VAE4LV
vanadium = VUNEY4DIYUM
vapor = VEY4PER
variation = VEH5RIYEY4SHUN
various = VEH4RIYAHS
vary = VEH4RIY
veal = VIY4L
vector = VEH4KTER
vegetable = VEH4JTAXBUL
vehicle = VIY4IX6KUL
ventilate = VEH4NTULEYT
verb = VER4B
versatile = VER4SAXTUL
verse = VER4S
version = VER4ZHUN
vertical = VER4TIXKUL
very = VEH4RIY
veto = VIY4TOW
vibration = VAYBREY4SHUN
vicinity = VAXSIH4NIXTIY
victory = VIH4KTERIY
video = VIH4DIYOW
village = VIH4LIXJ
vinyl = VAY4NUL
violation = VAY4AXLEY5SHUN
virtue = VER4CHUW
visible = VIH4ZIXBUL
visit = VIH4ZIXT
vital = VAY4TUL
vocabulary = VOHKAE4BYULEHRIY
vocal = VOW4KUL
voice = VOY4S
volt = VOW4LT
volume = VAA4LYUWM
voluntary = VAA4LUNTEH5RIY
vote = VOW4T
vowel = VAW4UL
voyage = VOY4IXJ
video = VIH4DIYOW


- W -

wafer = WEY4FER
wage = WEY4J
wait = WEY4T
wake = WEY4K
walk = WAO4K
wall = WAO4L
war = WOH4R
warm = WOH4RM
warp = WOH4RP
warranty = WOH5RIXNTIY4
wash = WAA4SH
waste = WEY4ST
watch = WAA4CH
water = WAO4TER
watt = WAA4T
wave = WEY4V
way = WEY4
weak = WIY4K
wealth = WEH4LTH
wear = WEH4R
wedding = WEH4DIHNX
week = WIY4K
weight = WEY4
welcome = WEH4LKUM
well = WEH4L
were = WER4
what = WHAH4T
wheel = WHIY4L
when = WHEH4N
which = WHIH4CH
while = WHAY4L
whisper = WHIH4SPER
white = WHAY4T
who = /HUW4
whole = /HOW4L
wide = WAY4D
wild = WAY4LD
will = WIH4L
win = WIH4N
window = WIH4NDOW
wing = WIH4NX
winter = WIH4NTER
wise = WAY4Z
wish = WIH4SH
with = WIH4TH
wizard = WIH4ZERD
woman = WUH4MUN
women = WIH4MIXN
wonder = WAH4NDER
word = WER4D
Wordrace = WER2DREYS
work = WER4K
world = WUH4RLD
worry = WER4IY
would = WUH4D
wrap = RAE4P
write = RAY4T
wrong = RAO4NX


- X -

Zerox = ZIH4RAAKS
X-ray = EH4KSREY
xylophone = ZAY4LAXFOWN


- Y -

yacht = YAA4T
yard = YAA4RD
yawn = YAO4N
year = YIH4R
yellow = YEH4LOW
yes = YEH4S
you = YUW4
your = YOH4R
youth = YUX4TH


- Z -

zany = ZEY4NIY
zero = ZIY4ROW
zig-zag = ZIH3GZAEG
zip = ZIH4P
zodiac = ZOW4DIY6AEK
zone = ZOW4N


- DAYS OF THE WEEK -

Monday = MAH4NDEY
Tuesday = TUW4ZDEY
Wednesday = WEH4NZDEY
Thursday = THER4ZDEY
Friday = FRAY4DEY
Saturday = SAE4TERDEY
Sunday = SAH4NDEY


- MONTHS OF THE YEAR -

January = JAE4NYUXEHRIY
February = FEH4BRUXEH6RIY
March = MAA4RCH
April = EY4PRIXL
May= MEY4
June = JUW4N
July = JUHLAY4
August = AO4GAXST
September = SEHPTEH4MBER
October = AAKTOW4BER
November = NOHVEH4MBER
December = DIHSEH4MBER


- NUMBERS -

one = WAH4N
two = TUW4
three = THRIY4
four = FOH4R
five = FAY4V
six = SIH4KS
seven = SEH4VIXN
eight = EY4T
nine = NAY4N
ten = TEH4N
eleven = IXLEH4VIXN
twelve = TWEH4LV
thirteen = THER4TIY6N
twenty = TWEH4NTIY
thirty = THER4TIY
hundred = /HAH4NDRIXD
thousand = THAW4ZUND
million = MIH4LYUN

- STATES AND PROVINCES -

United States = YUWNAY4TIXD STEY4TS
Alabama = AE4LAXBAE6MAX
Alaska = AHLAE4SKAH
Arizona = EH4RAXZOW5NAH
Arkansas = AA4RKUNSAO
California = KAE5LAXFOH4RNYAH
Colorado = KAA5LAXRAA4DOW
Connecticut = KAHNEH4TIXKAHT
Delaware = DEH4LAXWEH6R
Florida = FLOH4RIXDAH
Georgia = JOH4RJAH
Hawaii = /HAHWAY4IY
Idaho = AY4DAH/HOW
Illinois = IHLUNOY4
Indiana = IH5NDIYAE4NAH
Iowa = AY4AHWAH
Kansas = KAE4NZIXS
Kentucky = KEHNTAH4KIY
Louisiana = LUXIY4ZIYAE5NAH
Maine = MEY4N
Maryland = MEH4RULIXND
Massachusetts = MAE5SAXCHUW4SIXTS
Michigan = MIH4SAXGUN
Minnesota = MIH5NAXSOW4TAH
Mississippi = MIH5SIXSIH4PIY
Missouri = MIHZUH4RIY
Montana = MAANTAE4NAH
Nebraska = NAXBRAE4SKAH
Nevada = NAXVAE4DAH
New Hampshire= NUW6 /HAE4MPSHER
New Jersey = NUW JER4ZIY
New Mexico = NUW MEH4KSIXKOW
New York = NUW YOH4RK
North Carolina = NOH4RTH KEH5RULAY4NAH
North Dakota= NOH4RTH DAHKOW4TAH
Ohio = OW/HAY4OW
Oklahoma = OWKLAX6/HOW4MAH
Oregon = OH4RIXGUN
Pennsylvania = PEH5NSULVEY4NYAH
Rhode Island = ROW5D AY4LUND
South Carolina = SAW4TH KEH5RULAY4NAH
South Dakota = SAW4TH DAXKOW4TAH
Tennessee = TEH5NAXSIY4
Texas = TEH4KSAXS
Utah = YUW4TAO6
Vermont = VERMAA4NT
Virginia = VERJIH4NYAH
Washington = WAA4SHIHNXTAHN
West Virginia = WEH5ST VERJIH4NYAH
Wisconsin = WIHSKAA4NSUN
Wyoming = WAYOW4MIHNX

Provinces of Canada = PRAA4VIXNSIXZ AHV KAE4NAXDAH

Alberta = AELBER4TAH
British Columbia = BRIH4TIXSH KAHLAH4MBIYAH
Manitoba = MAE5NIXTOW4BAH
New Brunswich = NUW BRAH4NZWIXK
Newfoundland = NUW4FIXNLIXND
Nova Scotia = NOH4VAX5KOW4SHAH
Ontario = AANTEH4RIYOW
Prince Edward Island = PRIH5NS EH4DWERD AY4LUND
Quebec = KUHBEH4K
Saskatchewan = SAESKAE4CHAXWAAN

- UNITS -

units = YUW4NIXTS
inches = IH4NCHIXZ
feet = FIY4T
yards = YAA4RDZ
miles = MAY4LZ
centimeters = SEH4NTIXMIY6TERZ
kilometers = KIXLAA4MIXTERZ
acres = EY4KERZ
ounces = AW4NSIXZ
pounds = PAW4NDZ
tons = TAH4NZ
grams = GRAE4MZ
teaspoons = TIY4SPUWNZ
cups = KAH4PS
pints = PAY4NTS
quarts = KWOH4RTS
gallons = GAE4LUNZ
liters = LIY4TERZ
degrees = DAXGRIY4Z

`;