const CLASSES = {
    "WARRIOR" : 1,
    "PALADIN" : 2,
    "HUNTER" : 3,
    "ROGUE" : 4,
    "PRIEST" : 5,
    "DEATH KNIGHT" : 6,
    "SHAMAN" : 7,
    "MAGE" : 8,
    "WARLOCK" : 9,
    "MONK" : 10,
    "DRUID" : 11,
    "DEMON HUNTER" : 12
};

const SPECIALIZATIONS = {
    1 : ["ARMS", "FURY", "PROTECTION"],
    2 : ["HOLY", "PROTECTION", "RETRIBUTION"],
    3 : ["BEAST MASTERY", "MARKSMANSHIP", "SURVIVAL"],
    4 : ["ASSASSINATION", "OUTLAW", "SUBTLETY"],
    5 : ["DISCIPLINE", "HOLY", "SHADOW"],
    6 : ["BLOOD", "FROST", "UNHOLY"],
    7 : ["ELEMENTAL", "ENHANCEMENT", "RESTORATION"],
    8 : ["ARCANE", "FIRE", "FROST"],
    9 : ["AFFLICTION", "DEMONOLOGY", "DESTRUCTION"],
    10 : ["BREWMASTER", "MISTWEAVER", "WINDWALKER"],
    11 : ["BALANCE", "FERAL", "GUARDIAN", "RESTORATION"],
    12 : ["HAVOC", "VENGEANCE"]
};

//TODO: Change left side to numbers, then use CLASS_ARMORTYPES[CLASSES[this.playerClass.toUpperCase()]]
const CLASS_ARMORTYPES = {
    "WARRIOR"       : "PLATE",
    "PALADIN"       : "PLATE",
    "HUNTER"        : "MAIL",
    "ROGUE"         : "LEATHER",
    "PRIEST"        : "CLOTH",
    "DEATH KNIGHT"  : "PLATE",
    "SHAMAN"        : "MAIL",
    "MAGE"          : "CLOTH",
    "WARLOCK"       : "CLOTH",
    "MONK"          : "LEATHER",
    "DRUID"         : "LEATHER",
    "DEMON HUNTER"  : "LEATHER"
};

const STATS = {
    STR : "STRENGTH",
    AGI : "AGILITY",
    INT : "INTELLECT"
};

const SPEC_STATS = {
    1 : { 0:STATS.STR, 1:STATS.STR, 2:STATS.STR },
    2 : { 0:STATS.INT, 1:STATS.STR, 2:STATS.STR },
    3 : { 0:STATS.AGI, 1:STATS.AGI, 2:STATS.AGI },
    4 : { 0:STATS.AGI, 1:STATS.AGI, 2:STATS.AGI },
    5 : { 0:STATS.INT, 1:STATS.INT, 2:STATS.INT},
    6 : { 0:STATS.STR, 1:STATS.STR, 2:STATS.STR},
    7 : { 0:STATS.INT, 1:STATS.AGI, 2:STATS.INT},
    8 : { 0:STATS.INT, 1:STATS.INT, 2:STATS.INT},
    9 : { 0:STATS.INT, 1:STATS.INT, 2:STATS.INT},
    10 : { 0:STATS.AGI, 1:STATS.INT, 2:STATS.AGI},
    11 : { 0:STATS.INT, 1:STATS.AGI, 2:STATS.AGI, 3:STATS.INT},
    12 : { 0:STATS.AGI, 1:STATS.AGI}
};

const TOKENS = {
    1 : "ABOMINABLE",
    2 : "MYSTIC",
    3 : "VENERATED",
    4 : "ZENITH"
}

//TODO: Change left side to numbers, then use CLASS_TOKENS[CLASSES[this.playerClass]]
const CLASS_TOKENS = {
    "WARRIOR"       : "ZENITH",
    "PALADIN"       : "VENERATED",
    "HUNTER"        : "MYSTIC",
    "ROGUE"         : "ZENITH",
    "PRIEST"        : "VENERATED",
    "DEATH KNIGHT"  : "ABOMINABLE",
    "SHAMAN"        : "VENERATED",
    "MAGE"          : "MYSTIC",
    "WARLOCK"       : "ABOMINABLE",
    "MONK"          : "ZENITH",
    "DRUID"         : "MYSTIC",
    "DEMON HUNTER"  : "ABOMINABLE"
};

const TRINKETS = {
    0 : "SKULKER'S WING",               //STR AGI
    1 : "BARGAST'S LEASH",              //STR AGI
    2 : "GLUTTINOUS SPIKE",             //STR
    3 : "CONSUMPTIVE INFUSION",         //INT
    4 : "GLYPH OF ASSIMILATION",        //INT
    5 : "SPLINTERED HEART OF AL'AR",    //STR AGI
    6 : "TUFT OF SMOULDERING PLUMAGE",  //INT
    7 : "SOUL IGNITER",                 //INT
    8 : "MEMORY OF PAST SINS",          //STR AGI
    9 : "MACABRE SHEET MUSIC",          //STR AGI INT
    10 : "HATEFUL CHAIN",               //AGI
    11 : "STONE LEGION HERALDRY",       //STR AGI
    12 : "SANGUINE VINTAGE",            //STR AGI
    13 : "CABALIST'S HYMNAL",           //INT
    14 : "MANABOUND MIRROR",            //INT
    15 : "DREADFIRE VESSEL"             //STR AGI INT
};

const ROLE_TRINKETS = {
    TANK : [],
    HEALER : [],
    MELEE_STR : [TRINKETS[0], TRINKETS[1], TRINKETS[2], TRINKETS[5], TRINKETS[8], TRINKETS[9], TRINKETS[11], TRINKETS[12], TRINKETS[15]],
    MELEE_AGI : [TRINKETS[0], TRINKETS[1], TRINKETS[5], TRINKETS[8], TRINKETS[9], TRINKETS[10], TRINKETS[11], TRINKETS[12], TRINKETS[15]],
    RANGE_AGI : [TRINKETS[0], TRINKETS[1], TRINKETS[5], TRINKETS[8], TRINKETS[9], TRINKETS[10], TRINKETS[11], TRINKETS[12], TRINKETS[15]],
    RANGE_INT : [TRINKETS[3], TRINKETS[4], TRINKETS[6], TRINKETS[7], TRINKETS[9], TRINKETS[13], TRINKETS[14], TRINKETS[15]],
};

const SPEC_TRINKETS = {
    1 : { //WARRIOR
        0 : [ROLE_TRINKETS.MELEE_STR],
        1 : [ROLE_TRINKETS.MELEE_STR],
        2 : [ROLE_TRINKETS.MELEE_STR] },
    2 : { //PALADIN
        0 : [ROLE_TRINKETS.RANGE_INT],
        1 : [ROLE_TRINKETS.MELEE_STR],
        2 : [ROLE_TRINKETS.MELEE_STR] },
    3 : { //HUNTER
        0 : [ROLE_TRINKETS.RANGE_AGI],
        1 : [ROLE_TRINKETS.RANGE_AGI],
        2 : [ROLE_TRINKETS.RANGE_AGI] },
    4 : { //ROGUE
        0 : [ROLE_TRINKETS.MELEE_AGI],
        1 : [ROLE_TRINKETS.MELEE_AGI],
        2 : [ROLE_TRINKETS.MELEE_AGI] },
    5 : { //PRIEST
        0 : [ROLE_TRINKETS.RANGE_INT],
        1 : [ROLE_TRINKETS.RANGE_INT],
        2 : [ROLE_TRINKETS.RANGE_INT] },
    6 : { //DEATH KNIGHT
        0 : [ROLE_TRINKETS.MELEE_STR],
        1 : [ROLE_TRINKETS.MELEE_STR],
        2 : [ROLE_TRINKETS.MELEE_STR] },
    7 : { //SHAMAN
        0 : [ROLE_TRINKETS.RANGE_INT],
        1 : [ROLE_TRINKETS.MELEE_AGI],
        2 : [ROLE_TRINKETS.RANGE_INT] },
    8 : { //MAGE
        0 : [ROLE_TRINKETS.RANGE_INT],
        1 : [ROLE_TRINKETS.RANGE_INT],
        2 : [ROLE_TRINKETS.RANGE_INT] },
    9 : { //WARLOCK
        0 : [ROLE_TRINKETS.RANGE_INT],
        1 : [ROLE_TRINKETS.RANGE_INT],
        2 : [ROLE_TRINKETS.RANGE_INT] },
    10 : { //MONK
        0 : [ROLE_TRINKETS.MELEE_AGI],
        1 : [ROLE_TRINKETS.RANGE_INT],
        2 : [ROLE_TRINKETS.MELEE_AGI] },
    11 : { //DRUID
        0 : [ROLE_TRINKETS.RANGE_INT],
        1 : [ROLE_TRINKETS.MELEE_AGI],
        2 : [ROLE_TRINKETS.MELEE_AGI],
        3 : [ROLE_TRINKETS.RANGE_INT] },
    12 : { //DEMON HUNTER
        0 : [ROLE_TRINKETS.MELEE_AGI],
        1 : [ROLE_TRINKETS.MELEE_AGI] },
};
