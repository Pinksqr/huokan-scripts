const MESSAGES = {
    DEFAULT: "DEFAULT",
    SUCCESS: "SUCCESS",
    FAILURE: "FAILURE",
    ERROR: "ERROR"
}

const MESSAGE_COLORS = {
    DEFAULT: "#000000",
    SUCCESS: "#6AA84F",
    FAILURE: "#CC0000",
    ERROR: "#46BDC6"
}

const MESSAGE_WEIGHTS = {
    DEFAULT: "normal",
    SUCCESS: "bold",
    FAILURE: "bold",
    ERROR: "bold"
}

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

//TODO: Change left-side to variables to make it cleaner :) (eg, MYSTIC: "MYSTIC")
const TOKENS = {
    1 : "ABOMINABLE",
    2 : "MYSTIC",
    3 : "VENERATED",
    4 : "ZENITH"
}

const BOSSES = {
    0: "SHRIEKWING",
    1: "HUNTSMAN ALTIMOR",
    2: "SUN KING'S SALVATION",
    3: "ARTIFICER XY'MOX",
    4: "HUNGERING DESTROYER",
    5: "LADY INERVA DARKVEIN",
    6: "THE COUNCIL OF BLOOD",
    7: "SLUDGEFIST",
    8: "STONE LEGION GENERALS",
    9: "SIRE DENATHRIUS"
}

const FUNNEL_TYPES = {
    ARMOR : "ARMOR FUNNEL",
    WEAPON : "WEAPON FUNNEL",
    TRINKET : "TRINKET FUNNEL"
}

const SERVICES = {
    SHRIEKWING: "SHRIEKWING",
    HUNTSMAN_ALTIMOR: "HUNTSMAN ALTIMOR",
    SUN_KINGS_SALVATION: "SUN KING'S SALVATION",
    ARTIFICER_XYMOX: "ARTIFICER XY'MOX",
    HUNGERING_DESTROYER: "HUNGERING DESTROYER",
    LADY_INERVA_DARKVEIN: "LADY INERVA DARKVEIN",
    THE_COUNCIL_OF_BLOOD: "THE COUNCIL OF BLOOD",
    SLUDGEFIST: "SLUDGEFIST",
    STONE_LEGION_GENERALS: "STONE LEGION GENERALS",
    SIRE_DENATHRIUS: "SIRE DENATHRIUS",
    LAST_WING: "LAST WING",
    FULL_CLEAR: "FULL CLEAR"
}

const STATS = {
    STR : "STRENGTH",
    AGI : "AGILITY",
    INT : "INTELLECT"
};

const ARMOR_TYPES = {
    PLATE : "PLATE",
    MAIL : "MAIL",
    LEATHER : "LEATHER",
    CLOTH : "CLOTH"
}

const TRINKETS = {
    0 : "SKULKER'S WING",
    1 : "BARGAST'S LEASH",
    2 : "GLUTTINOUS SPIKE",
    3 : "CONSUMPTIVE INFUSION",
    4 : "GLYPH OF ASSIMILATION",
    5 : "SPLINTERED HEART OF AL'AR",
    6 : "TUFT OF SMOULDERING PLUMAGE",
    7 : "SOUL IGNITER",
    8 : "MEMORY OF PAST SINS",
    9 : "MACABRE SHEET MUSIC",
    10 : "HATEFUL CHAIN",
    11 : "STONE LEGION HERALDRY",
    12 : "SANGUINE VINTAGE",
    13 : "CABALIST'S HYMNAL",
    14 : "MANABOUND MIRROR",
    15 : "DREADFIRE VESSEL"
};

/**
 * ----- ALL CONSTANTS BELOW THIS LINE ARE USED FOR RELATIONAL PURPOSES ONLY (EG, WHAT ARMOR TYPES ARE EACH CLASS?)
 * Obviously one day hope to bring it into a database to avoid this fiasco...
 */

const SERVICE_ORDER = {
    "FULL CLEAR": 0,
    "LAST WING": 1,
    "SHRIEKWING": 2,
    "HUNTSMAN ALTIMOR": 3,
    "SUN KING'S SALVATION": 4,
    "ARTIFICER XY'MOX": 5,
    "HUNGERING DESTROYER": 6,
    "LADY INERVA DARKVEIN": 7,
    "THE COUNCIL OF BLOOD": 8,
    "SLUDGEFIST": 9,
    "STONE LEGION GENERALS": 10,
    "SIRE DENATHRIUS": 11,
}

const BOSS_TRINKETS = {
    "SHRIEKWING": [TRINKETS[0]],
    "HUNTSMAN ALTIMOR": [TRINKETS[1]],
    "SUN KING'S SALVATION": [TRINKETS[5], TRINKETS[6], TRINKETS[7]],
    "ARTIFICER XY'MOX": [TRINKETS[4]],
    "HUNGERING DESTROYER": [TRINKETS[2], TRINKETS[3]],
    "LADY INERVA DARKVEIN": [TRINKETS[8]],
    "THE COUNCIL OF BLOOD": [TRINKETS[9]],
    "SLUDGEFIST": [TRINKETS[10]],
    "STONE LEGION GENERALS": [TRINKETS[11]],
    "SIRE DENATHRIUS": [TRINKETS[12], TRINKETS[13], TRINKETS[14], TRINKETS[15]],
}

const BOSS_WEAPONS = {
    "SHRIEKWING": [],
    "HUNTSMAN ALTIMOR": [TOKENS[2]],
    "SUN KING'S SALVATION": [TOKENS[1]],
    "ARTIFICER XY'MOX": [],
    "HUNGERING DESTROYER": [TOKENS[3]],
    "LADY INERVA DARKVEIN": [],
    "THE COUNCIL OF BLOOD": [TOKENS[4]],
    "SLUDGEFIST": [],
    "STONE LEGION GENERALS": [],
    "SIRE DENATHRIUS": [TOKENS[1], TOKENS[2], TOKENS[3], TOKENS[4]],
}

const CLASS_ARMORTYPES = {
    "WARRIOR"       : ARMOR_TYPES.PLATE,
    "PALADIN"       : ARMOR_TYPES.PLATE,
    "HUNTER"        : ARMOR_TYPES.MAIL,
    "ROGUE"         : ARMOR_TYPES.LEATHER,
    "PRIEST"        : ARMOR_TYPES.CLOTH,
    "DEATH KNIGHT"  : ARMOR_TYPES.PLATE,
    "SHAMAN"        : ARMOR_TYPES.MAIL,
    "MAGE"          : ARMOR_TYPES.CLOTH,
    "WARLOCK"       : ARMOR_TYPES.CLOTH,
    "MONK"          : ARMOR_TYPES.LEATHER,
    "DRUID"         : ARMOR_TYPES.LEATHER,
    "DEMON HUNTER"  : ARMOR_TYPES.LEATHER
};

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

const SPEC_TRINKETS = {
    1 : { //WARRIOR
        0 : [ //ARMS
            TRINKETS[0],
            TRINKETS[2],
            TRINKETS[8],
            TRINKETS[9],
            TRINKETS[12],
            TRINKETS[15]
        ],
        1 : [ //FURY
            TRINKETS[0],
            TRINKETS[2],
            TRINKETS[8],
            TRINKETS[9],
            TRINKETS[12],
            TRINKETS[15]
        ],
        2 : [ //PROTECTION
            TRINKETS[1],
            TRINKETS[5],
            TRINKETS[2],
            TRINKETS[9],
            TRINKETS[11],
            TRINKETS[12]
        ] },
    2 : { //PALADIN
        0 : [ //HOLY
            TRINKETS[6],
            TRINKETS[3],
            TRINKETS[2],
            TRINKETS[9],
            TRINKETS[13],
            TRINKETS[14]
        ],
        1 : [ //PROTECTION
            TRINKETS[1],
            TRINKETS[5],
            TRINKETS[2],
            TRINKETS[9],
            TRINKETS[11],
            TRINKETS[12]
        ],
        2 : [ //RETRIBUTION
            TRINKETS[0],
            TRINKETS[2],
            TRINKETS[8],
            TRINKETS[9],
            TRINKETS[11],
            TRINKETS[15]
        ] },
    3 : { //HUNTER
        0 : [ //BEAST MASTERY
            TRINKETS[8],
            TRINKETS[9],
            TRINKETS[10],
            TRINKETS[11],
            TRINKETS[15]
        ],
        1 : [ //MARKSMANSHIP
            TRINKETS[8],
            TRINKETS[9],
            TRINKETS[10],
            TRINKETS[11],
            TRINKETS[15]
        ],
        2 : [ //SURVIVAL
            TRINKETS[0],
            TRINKETS[8],
            TRINKETS[9],
            TRINKETS[10],
            TRINKETS[11],
            TRINKETS[15]
        ] },
    4 : { //ROGUE
        0 : [ //ASSASSINATION
            TRINKETS[0],
            TRINKETS[8],
            TRINKETS[9],
            TRINKETS[10],
            TRINKETS[11],
            TRINKETS[15]
        ],
        1 : [ //OUTLAW
            TRINKETS[0],
            TRINKETS[8],
            TRINKETS[9],
            TRINKETS[10],
            TRINKETS[11],
            TRINKETS[15]
        ],
        2 : [ //SUBTLETY
            TRINKETS[0],
            TRINKETS[8],
            TRINKETS[9],
            TRINKETS[10],
            TRINKETS[11],
            TRINKETS[15]
        ] },
    5 : { //PRIEST
        0 : [ //DISCIPLINE
            TRINKETS[6],
            TRINKETS[3],
            TRINKETS[9],
            TRINKETS[13],
            TRINKETS[14]
        ],
        1 : [ //HOLY
            TRINKETS[6],
            TRINKETS[3],
            TRINKETS[9],
            TRINKETS[13],
            TRINKETS[14]
        ],
        2 : [ //SHADOW
            TRINKETS[7],
            TRINKETS[4],
            TRINKETS[9],
            TRINKETS[13],
            TRINKETS[15]
        ] },
    6 : { //DEATH KNIGHT
        0 : [ //BLOOD
            TRINKETS[1],
            TRINKETS[5],
            TRINKETS[2],
            TRINKETS[9],
            TRINKETS[11],
            TRINKETS[12]
        ],
        1 : [ //FROST
            TRINKETS[0],
            TRINKETS[2],
            TRINKETS[8],
            TRINKETS[9],
            TRINKETS[11],
            TRINKETS[15]
        ],
        2 : [ //UNHOLY
            TRINKETS[0],
            TRINKETS[2],
            TRINKETS[8],
            TRINKETS[9],
            TRINKETS[11],
            TRINKETS[15]
        ] },
    7 : { //SHAMAN
        0 : [ //ELEMENTAL
            TRINKETS[7],
            TRINKETS[4],
            TRINKETS[9],
            TRINKETS[13],
            TRINKETS[15]
        ],
        1 : [ //ENHANCEMENT
            TRINKETS[0],
            TRINKETS[9],
            TRINKETS[10],
            TRINKETS[11],
            TRINKETS[15]
        ],
        2 : [ //RESTORATION
            TRINKETS[6],
            TRINKETS[3],
            TRINKETS[9],
            TRINKETS[13],
            TRINKETS[14]
        ] },
    8 : { //MAGE
        0 : [ //ARCANE
            TRINKETS[7],
            TRINKETS[4],
            TRINKETS[9],
            TRINKETS[13],
            TRINKETS[15]
        ],
        1 : [ //FIRE
            TRINKETS[7],
            TRINKETS[4],
            TRINKETS[9],
            TRINKETS[13],
            TRINKETS[15]
        ],
        2 : [ //FROST
            TRINKETS[7],
            TRINKETS[4],
            TRINKETS[9],
            TRINKETS[13],
            TRINKETS[15]
        ] },
    9 : { //WARLOCK
        0 : [ //AFFLICTION
            TRINKETS[7],
            TRINKETS[4],
            TRINKETS[9],
            TRINKETS[13],
            TRINKETS[15]
        ],
        1 : [ //DEMONOLOGY
            TRINKETS[7],
            TRINKETS[4],
            TRINKETS[9],
            TRINKETS[13],
            TRINKETS[15]
        ],
        2 : [ //DESTRUCTION
            TRINKETS[7],
            TRINKETS[4],
            TRINKETS[9],
            TRINKETS[13],
            TRINKETS[15]
        ] },
    10 : { //MONK
        0 : [ //BREWMASTER
            TRINKETS[1],
            TRINKETS[5],
            TRINKETS[9],
            TRINKETS[10],
            TRINKETS[11],
            TRINKETS[12]
        ],
        1 : [ //MISTWEAVER
            TRINKETS[6],
            TRINKETS[3],
            TRINKETS[9],
            TRINKETS[13],
            TRINKETS[14]
        ],
        2 : [ //WINDWALKER
            TRINKETS[0],
            TRINKETS[8],
            TRINKETS[9],
            TRINKETS[10],
            TRINKETS[11],
            TRINKETS[15]
        ] },
    11 : { //DRUID
        0 : [ //BALANCE
            TRINKETS[7],
            TRINKETS[4],
            TRINKETS[9],
            TRINKETS[13],
            TRINKETS[15]
        ],
        1 : [ //FERAL
            TRINKETS[0],
            TRINKETS[8],
            TRINKETS[9],
            TRINKETS[10],
            TRINKETS[11],
            TRINKETS[15]
        ],
        2 : [ //GUARDIAN
            TRINKETS[1],
            TRINKETS[5],
            TRINKETS[9],
            TRINKETS[10],
            TRINKETS[11],
            TRINKETS[12]
        ],
        3 : [ //RESTORATION
            TRINKETS[6],
            TRINKETS[3],
            TRINKETS[9],
            TRINKETS[13],
            TRINKETS[14]
        ] },
    12 : { //DEMON HUNTER
        0 : [ //HAVOC
            TRINKETS[0],
            TRINKETS[8],
            TRINKETS[9],
            TRINKETS[10],
            TRINKETS[11],
            TRINKETS[15]
        ],
        1 : [ //VENGEANCE
            TRINKETS[1],
            TRINKETS[5],
            TRINKETS[9],
            TRINKETS[10],
            TRINKETS[11],
            TRINKETS[12]
        ] },
};

const TRINKET_SPECS = {
    "SKULKER'S WING": {
        1: {0: true, 1: true, 2: false},
        2: {0: false, 1: false, 2: true},
        3: {0: false, 1: false, 2: true},
        4: {0: true, 1: true, 2: true},
        5: {0: false, 1: false, 2: false},
        6: {0: false, 1: true, 2: true},
        7: {0: false, 1: true, 2: false},
        8: {0: false, 1: false, 2: false},
        9: {0: false, 1: false, 2: false},
        10: {0: false, 1: false, 2: true},
        11: {0: false, 1: true, 2: false, 3: false},
        12: {0: true, 1: false}
    },
    "BARGAST'S LEASH": {
        1: {0: false, 1: false, 2: true},
        2: {0: false, 1: true, 2: false},
        3: {0: false, 1: false, 2: false},
        4: {0: false, 1: false, 2: false},
        5: {0: false, 1: false, 2: false},
        6: {0: true, 1: false, 2: false},
        7: {0: false, 1: false, 2: false},
        8: {0: false, 1: false, 2: false},
        9: {0: false, 1: false, 2: false},
        10: {0: true, 1: false, 2: false},
        11: {0: false, 1: false, 2: true, 3: false},
        12: {0: false, 1: true}
    },
    "GLUTTINOUS SPIKE": {
        1: {0: true, 1: true, 2: true},
        2: {0: true, 1: true, 2: true},
        3: {0: false, 1: false, 2: false},
        4: {0: false, 1: false, 2: false},
        5: {0: false, 1: false, 2: false},
        6: {0: true, 1: true, 2: true},
        7: {0: false, 1: false, 2: false},
        8: {0: false, 1: false, 2: false},
        9: {0: false, 1: false, 2: false},
        10: {0: false, 1: false, 2: false},
        11: {0: false, 1: false, 2: false, 3: false},
        12: {0: false, 1: false}
    },
    "CONSUMPTIVE INFUSION": {
        1: {0: false, 1: false, 2: false},
        2: {0: true, 1: false, 2: false},
        3: {0: false, 1: false, 2: false},
        4: {0: false, 1: false, 2: false},
        5: {0: true, 1: true, 2: false},
        6: {0: false, 1: false, 2: false},
        7: {0: false, 1: false, 2: true},
        8: {0: false, 1: false, 2: false},
        9: {0: false, 1: false, 2: false},
        10: {0: false, 1: true, 2: false},
        11: {0: false, 1: false, 2: false, 3: true},
        12: {0: false, 1: false}
    },
    "GLYPH OF ASSIMILATION": {
        1: {0: false, 1: false, 2: false},
        2: {0: false, 1: false, 2: false},
        3: {0: false, 1: false, 2: false},
        4: {0: false, 1: false, 2: false},
        5: {0: false, 1: false, 2: true},
        6: {0: false, 1: false, 2: false},
        7: {0: true, 1: false, 2: false},
        8: {0: true, 1: true, 2: true},
        9: {0: true, 1: true, 2: true},
        10: {0: false, 1: false, 2: false},
        11: {0: true, 1: false, 2: false, 3: false},
        12: {0: false, 1: false}
    },
    "SPLINTERED HEART OF AL'AR": {
        1: {0: false, 1: false, 2: true},
        2: {0: false, 1: true, 2: false},
        3: {0: false, 1: false, 2: false},
        4: {0: false, 1: false, 2: false},
        5: {0: false, 1: false, 2: false},
        6: {0: false, 1: false, 2: false},
        7: {0: false, 1: false, 2: false},
        8: {0: false, 1: false, 2: false},
        9: {0: false, 1: false, 2: false},
        10: {0: true, 1: false, 2: false},
        11: {0: false, 1: false, 2: true, 3: false},
        12: {0: false, 1: true}
    },
    "TUFT OF SMOULDERING PLUMAGE": {
        1: {0: false, 1: false, 2: false},
        2: {0: true, 1: false, 2: false},
        3: {0: false, 1: false, 2: false},
        4: {0: false, 1: false, 2: false},
        5: {0: true, 1: true, 2: false},
        6: {0: false, 1: false, 2: false},
        7: {0: false, 1: false, 2: true},
        8: {0: false, 1: false, 2: false},
        9: {0: false, 1: false, 2: false},
        10: {0: false, 1: true, 2: false},
        11: {0: false, 1: false, 2: false, 3: true},
        12: {0: false, 1: false}
    },
    "SOUL IGNITER": {
        1: {0: false, 1: false, 2: false},
        2: {0: false, 1: false, 2: false},
        3: {0: false, 1: false, 2: false},
        4: {0: false, 1: false, 2: false},
        5: {0: false, 1: false, 2: true},
        6: {0: false, 1: false, 2: false},
        7: {0: true, 1: false, 2: false},
        8: {0: true, 1: true, 2: true},
        9: {0: true, 1: true, 2: true},
        10: {0: false, 1: false, 2: false},
        11: {0: true, 1: false, 2: false, 3: false},
        12: {0: false, 1: false}
    },
    "MEMORY OF PAST SINS": {
        1: {0: true, 1: true, 2: false},
        2: {0: false, 1: false, 2: true},
        3: {0: true, 1: true, 2: true},
        4: {0: true, 1: true, 2: true},
        5: {0: false, 1: false, 2: false},
        6: {0: false, 1: true, 2: true},
        7: {0: false, 1: false, 2: false},
        8: {0: false, 1: false, 2: false},
        9: {0: false, 1: false, 2: false},
        10: {0: false, 1: false, 2: true},
        11: {0: false, 1: true, 2: false, 3: false},
        12: {0: true, 1: false}
    },
    "MACABRE SHEET MUSIC": {
        1: {0: true, 1: true, 2: true},
        2: {0: true, 1: true, 2: true},
        3: {0: true, 1: true, 2: true},
        4: {0: true, 1: true, 2: true},
        5: {0: true, 1: true, 2: true},
        6: {0: true, 1: true, 2: true},
        7: {0: true, 1: true, 2: true},
        8: {0: true, 1: true, 2: true},
        9: {0: true, 1: true, 2: true},
        10: {0: true, 1: true, 2: true},
        11: {0: true, 1: true, 2: true, 3: true},
        12: {0: true, 1: true}
    },
    "HATEFUL CHAIN": {
        1: {0: false, 1: false, 2: false},
        2: {0: false, 1: false, 2: false},
        3: {0: true, 1: true, 2: true},
        4: {0: true, 1: true, 2: true},
        5: {0: false, 1: false, 2: false},
        6: {0: false, 1: false, 2: false},
        7: {0: false, 1: true, 2: false},
        8: {0: false, 1: false, 2: false},
        9: {0: false, 1: false, 2: false},
        10: {0: true, 1: false, 2: true},
        11: {0: false, 1: true, 2: true, 3: false},
        12: {0: true, 1: true}
    },
    "STONE LEGION HERALDRY": {
        1: {0: true, 1: true, 2: true},
        2: {0: false, 1: true, 2: true},
        3: {0: true, 1: true, 2: true},
        4: {0: true, 1: true, 2: true},
        5: {0: false, 1: false, 2: false},
        6: {0: true, 1: true, 2: true},
        7: {0: false, 1: true, 2: false},
        8: {0: false, 1: false, 2: false},
        9: {0: false, 1: false, 2: false},
        10: {0: true, 1: false, 2: true},
        11: {0: false, 1: true, 2: true, 3: false},
        12: {0: true, 1: true}
    },
    "SANGUINE VINTAGE": {
        1: {0: false, 1: false, 2: true},
        2: {0: false, 1: true, 2: false},
        3: {0: false, 1: false, 2: false},
        4: {0: false, 1: false, 2: false},
        5: {0: false, 1: false, 2: false},
        6: {0: true, 1: false, 2: false},
        7: {0: false, 1: false, 2: false},
        8: {0: false, 1: false, 2: false},
        9: {0: false, 1: false, 2: false},
        10: {0: true, 1: false, 2: false},
        11: {0: false, 1: false, 2: true, 3: false},
        12: {0: false, 1: true}
    },
    "CABALIST'S HYMNAL": {
        1: {0: false, 1: false, 2: false},
        2: {0: true, 1: false, 2: false},
        3: {0: false, 1: false, 2: false},
        4: {0: false, 1: false, 2: false},
        5: {0: true, 1: true, 2: false},
        6: {0: false, 1: false, 2: false},
        7: {0: true, 1: false, 2: true},
        8: {0: true, 1: true, 2: true},
        9: {0: true, 1: true, 2: true},
        10: {0: false, 1: true, 2: false},
        11: {0: true, 1: false, 2: false, 3: true},
        12: {0: false, 1: false}
    },
    "MANABOUND MIRROR": {
        1: {0: false, 1: false, 2: false},
        2: {0: true, 1: false, 2: false},
        3: {0: false, 1: false, 2: false},
        4: {0: false, 1: false, 2: false},
        5: {0: true, 1: true, 2: false},
        6: {0: false, 1: false, 2: false},
        7: {0: false, 1: false, 2: true},
        8: {0: false, 1: false, 2: false},
        9: {0: false, 1: false, 2: false},
        10: {0: false, 1: true, 2: false},
        11: {0: false, 1: false, 2: false, 3: true},
        12: {0: false, 1: false}
    },
    "DREADFIRE VESSEL": {
        1: {0: true, 1: true, 2: false},
        2: {0: false, 1: false, 2: true},
        3: {0: true, 1: true, 2: true},
        4: {0: true, 1: true, 2: true},
        5: {0: false, 1: false, 2: true},
        6: {0: false, 1: true, 2: true},
        7: {0: true, 1: true, 2: false},
        8: {0: true, 1: true, 2: true},
        9: {0: true, 1: true, 2: true},
        10: {0: false, 1: false, 2: true},
        11: {0: true, 1: true, 2: false, 3: false},
        12: {0: true, 1: false}
    }
}

const TRINKET_BOSSES = {
    "SKULKER'S WING": BOSSES[0],
    "BARGAST'S LEASH": BOSSES[1],
    "GLUTTINOUS SPIKE": BOSSES[4],
    "CONSUMPTIVE INFUSION": BOSSES[4],
    "GLYPH OF ASSIMILATION": BOSSES[3],
    "SPLINTERED HEART OF AL'AR": BOSSES[2],
    "TUFT OF SMOULDERING PLUMAGE": BOSSES[2],
    "SOUL IGNITER": BOSSES[2],
    "MEMORY OF PAST SINS": BOSSES[5],
    "MACABRE SHEET MUSIC": BOSSES[6],
    "HATEFUL CHAIN": BOSSES[7],
    "STONE LEGION HERALDRY": BOSSES[8],
    "SANGUINE VINTAGE": BOSSES[9],
    "CABALIST'S HYMNAL": BOSSES[9],
    "MANABOUND MIRROR": BOSSES[9],
    "DREADFIRE VESSEL": BOSSES[9],
}
