/** RAID INFORMATION SHEET */

const CELLS_RAIDINFO_INFO = {
    "GUILD" : "C7",
    "DATE" : "C8",
    "TIME" : "C9",
    "CONCAT" : "C10"
};

const CELLS_RAIDINFO_BOSSES = {
    "FULL CLEAR" : "F8",
    "LAST TWO": "F9",
    "AOTC": "F10"
};

const CELLS_RAIDINFO_CLASSES = {
    "WARRIOR"       : "I8",
    "PALADIN"       : "I9",
    "HUNTER"        : "I10",
    "ROGUE"         : "I11",
    "PRIEST"        : "I12",
    "DEATH KNIGHT"  : "I13",
    "SHAMAN"        : "I14",
    "MAGE"          : "I15",
    "WARLOCK"       : "I16",
    "MONK"          : "I17",
    "DRUID"         : "I18",
    "DEMON HUNTER"  : "I19"
};

const CELLS_RAIDINFO_ARMORTYPES = {
    "FULL CLEAR": { CLOTH : "L8", LEATHER : "M8", MAIL : "N8", PLATE : "O8" }
};

const CELLS_RAIDINFO_MAINSTATS = {
    "STRENGTH"  : "O8",
    "AGILITY"   : "O9",
    "INTELLECT" : "O10"
};

const CELLS_RAIDINFO_WEAPONS = {
    "HUNTSMAN ALTIMOR"      : { ABOMINABLE : "R8", MYSTIC : "S8" , VENERATED : "T8", ZENITH: "U8"},
    "SUN KING'S SALVATION"  : { ABOMINABLE : "R9", MYSTIC : "S9" , VENERATED : "T9", ZENITH: "U9"},
    "HUNGERING DESTROYER"   : { ABOMINABLE : "R10", MYSTIC : "S10" , VENERATED : "T10", ZENITH: "U10"},
    "THE COUNCIL OF BLOOD"  : { ABOMINABLE : "R11", MYSTIC : "S11" , VENERATED : "T11", ZENITH: "U11"},
    "SIRE DENATHRIUS"       : { ABOMINABLE : "R12", MYSTIC : "S12" , VENERATED : "T12", ZENITH: "U12"},
};

const CELLS_RAIDINFO_TRINKETS = {
    "SKULKER'S WING"                : "X8",
    "BARGAST'S LEASH"               : "X9",
    "GLUTTINOUS SPIKE"              : "X10",
    "CONSUMPTIVE INFUSION"          : "X11",
    "GLYPH OF ASSIMILATION"         : "X12",
    "SPLINTERED HEART OF AL'AR"     : "X13",
    "TUFT OF SMOULDERING PLUMAGE"   : "X14",
    "SOUL IGNITER"                  : "X15",
    "MEMORY OF PAST SINS"           : "X16",
    "MACABRE SHEET MUSIC"           : "X17",
    "HATEFUL CHAIN"                 : "X18",
    "STONE LEGION HERALDRY"         : "X19",
    "SANGUINE VINTAGE"              : "X20",
    "CABALIST'S HYMNAL"             : "X21",
    "MANABOUND MIRROR"              : "X22",
    "DREADFIRE VESSEL"              : "X23"
};

/** RESERVATION TEMPLATE SHEET */

const CELLS_RESERVATIONS_JSON = {
    RAID_ROSTER : "A1",
    RESERVATIONS: "A2"
}

const CELLS_RESERVATIONS_INFO = {
    "GUILD_INFO" : "B3"
};

const CELLS_RESERVATIONS_BOSSES = {
    "FULL CLEAR": { MAX : "C8", AVAIL : "D8" },
    "LAST TWO": { MAX : "C9", AVAIL : "D9" },
    "AOTC": { MAX : "C10", AVAIL : "D10" },
}

const CELLS_RESERVATIONS_BUNDLES = {
    "FULL CLEAR": { MAX : "C8", AVAIL : "D8" },
    "LAST TWO": { MAX : "C9", AVAIL : "D9" },
    "AOTC": { MAX : "C10", AVAIL : "D10" },
}

const CELLS_RESERVATIONS_SERVICES = {
    "SHRIEKWING"            : { MAX : "C8", AVAIL : "D8" },
    "HUNTSMAN ALTIMOR"      : { MAX : "C9", AVAIL : "D9" },
    "SUN KING'S SALVATION"  : { MAX : "C10", AVAIL : "D10" },
    "ARTIFICER XY'MOX"      : { MAX : "C11", AVAIL : "D11" },
    "HUNGERING DESTROYER"   : { MAX : "C12", AVAIL : "D12" },
    "LADY INERVA DARKVEIN"  : { MAX : "C13", AVAIL : "D13" },
    "THE COUNCIL OF BLOOD"  : { MAX : "C14", AVAIL : "D14" },
    "SLUDGEFIST"            : { MAX : "C15", AVAIL : "D15" },
    "STONE LEGION GENERALS" : { MAX : "C16", AVAIL : "D16" },
    "SIRE DENATHRIUS"       : { MAX : "C17", AVAIL : "D17" },
    "LAST WING"             : { MAX : "C18", AVAIL : "D18" },
    "FULL CLEAR"            : { MAX : "C19", AVAIL : "D19" }
}

const CELLS_RESERVATIONS_ARMORTYPES = {
    "FULL CLEAR": { CLOTH : "C13", LEATHER : "D13" , MAIL : "E13", PLATE: "F13"}
};

const CELLS_RESERVATIONS_WEAPONS = {
    "HUNTSMAN ALTIMOR"      : { ABOMINABLE : "C36", MYSTIC : "D36" , VENERATED : "E36", ZENITH: "F36"},
    "SUN KING'S SALVATION"  : { ABOMINABLE : "C37", MYSTIC : "D37" , VENERATED : "E37", ZENITH: "F37"},
    "HUNGERING DESTROYER"   : { ABOMINABLE : "C38", MYSTIC : "D38" , VENERATED : "E38", ZENITH: "F38"},
    "THE COUNCIL OF BLOOD"  : { ABOMINABLE : "C39", MYSTIC : "D39" , VENERATED : "E39", ZENITH: "F39"},
    "SIRE DENATHRIUS"       : { ABOMINABLE : "C40", MYSTIC : "D40" , VENERATED : "E40", ZENITH: "F40"},
};

const CELLS_RESERVATIONS_TRINKETS = {
    "SKULKER'S WING"                : { MAX : "C43", AVAIL : "D43" },
    "BARGAST'S LEASH"               : { MAX : "C44", AVAIL : "D44" },
    "GLUTTINOUS SPIKE"              : { MAX : "C45", AVAIL : "D45" },
    "CONSUMPTIVE INFUSION"          : { MAX : "C46", AVAIL : "D46" },
    "GLYPH OF ASSIMILATION"         : { MAX : "C47", AVAIL : "D47" },
    "SPLINTERED HEART OF AL'AR"     : { MAX : "C48", AVAIL : "D48" },
    "TUFT OF SMOULDERING PLUMAGE"   : { MAX : "C49", AVAIL : "D49" },
    "SOUL IGNITER"                  : { MAX : "C50", AVAIL : "D50" },
    "MEMORY OF PAST SINS"           : { MAX : "C51", AVAIL : "D51" },
    "MACABRE SHEET MUSIC"           : { MAX : "C52", AVAIL : "D52" },
    "HATEFUL CHAIN"                 : { MAX : "C53", AVAIL : "D53" },
    "STONE LEGION HERALDRY"         : { MAX : "C54", AVAIL : "D54" },
    "SANGUINE VINTAGE"              : { MAX : "C55", AVAIL : "D55" },
    "CABALIST'S HYMNAL"             : { MAX : "C56", AVAIL : "D56" },
    "MANABOUND MIRROR"              : { MAX : "C57", AVAIL : "D57" },
    "DREADFIRE VESSEL"              : { MAX : "C58", AVAIL : "D58" }
};

/** RAID MAINS & RAID ALTS SHEET */

const COLUMNS_RAIDMAINS = {
    AVAILABLE       : 1,
    PLAYER_NAME     : 2,
    PLAYER_CLASS    : 3,
    LOOT_SPECS      : [4, 6, 8, 10]
};

const COLUMNS_RAIDALTS = {
    AVAILABLE   : 1,
    MAIN_NAME   : 2,
    ALT_NAME    : 3,
    ALT_CLASS   : 4,
    LOOT_SPECS  : [5, 7, 9, 11]
};

const COLUMNS_RESERVATIONS = {
    INDEX           : 8,
    ADVERTISER_NAME : 9,
    BUYER_NAME      : 13,
    BUYER_BTAG      : 14,
    BUYER_DISCID    : 15,
    CLASS           : 16,
    SPEC            : 17,
    SERVICE         : 19,
    FUNNELS         : 20,
    FUNNEL_TYPE     : 21,
    FUNNEL_OPTION   : 22,
    NOTE            : 23,
    CHECKBOX        : 24,
    STATUS          : 25,
    RAID_SERVICE    : 33,
    RAID_BUYER      : 34,
    RAID_BOOSTER    : 35
};