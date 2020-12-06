/** RAID INFORMATION SHEET */

const CELLS_RAIDINFO_INFO = {
    "GUILD" : "C7",
    "DATE" : "C8",
    "TIME" : "C9"
};

const CELLS_RAIDINFO_CARRIES = {
    "SHRIEKWING"            : "F8",
    "HUNTSMAN ALTIMOR"      : "F9",
    "SUN KING'S SALVATION"  : "F10",
    "ARTIFICER XY'MOX"      : "F11",
    "HUNGERING DESTROYER"   : "F12",
    "LADY INERVA DARKVEIN"  : "F13",
    "THE COUNCIL OF BLOOD"  : "F14",
    "SLUDGEFIST"            : "F15",
    "STONE LEGION GENERALS" : "F16",
    "SIRE DENATHRIUS"       : "F17",
};

const CELLS_RAIDINFO_FUNNELS = {
    "SHRIEKWING"            : "G8",
    "HUNTSMAN ALTIMOR"      : "G9",
    "SUN KING'S SALVATION"  : "G10",
    "ARTIFICER XY'MOX"      : "G11",
    "HUNGERING DESTROYER"   : "G12",
    "LADY INERVA DARKVEIN"  : "G13",
    "THE COUNCIL OF BLOOD"  : "G14",
    "SLUDGEFIST"            : "G15",
    "STONE LEGION GENERALS" : "G16",
    "SIRE DENATHRIUS"       : "G17",
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
    "PLATE"     : "L8",
    "MAIL"      : "L9",
    "LEATHER"   : "L10",
    "CLOTH"     : "L11"
};

const CELLS_RAIDINFO_MAINSTATS = {
    "STRENGTH"  : "O8",
    "AGILITY"   : "O9",
    "INTELLECT" : "O10"
};

const CELLS_RAIDINFO_WEAPONS = {
    "ABOMINABLE"    : "R8",
    "MYSTIC"        : "R9",
    "VENERATED"     : "R10",
    "ZENITH"        : "R11"
};

const CELLS_RAIDINFO_TRINKETS = {
    "SKULKER'S WING"                : "U8",
    "BARGAST'S LEASH"               : "U9",
    "GLUTTINOUS SPIKE"              : "U10",
    "CONSUMPTIVE INFUSION"          : "U11",
    "GLYPH OF ASSIMILATION"         : "U12",
    "SPLINTERED HEART OF AL'AR"     : "U13",
    "TUFT OF SMOULDERING PLUMAGE"   : "U14",
    "SOUL IGNITER"                  : "U15",
    "MEMORY OF PAST SINS"           : "U16",
    "MACABRE SHEET MUSIC"           : "U17",
    "HATEFUL CHAIN"                 : "U18",
    "STONE LEGION HERALDRY"         : "U19",
    "SANGUINE VINTAGE"              : "U20",
    "CABALIST'S HYMNAL"             : "U21",
    "MANABOUND MIRROR"              : "U22",
    "DREADFIRE VESSEL"              : "U23"
};

/** RESERVATION TEMPLATE SHEET */

const CELLS_RESERVATIONS_INFO = {
    "GUILD_INFO" : "B3"
};

const CELLS_RESERVATIONS_CARRIES = {
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
}

const CELLS_RESERVATIONS_FUNNELS = {
    "SHRIEKWING"            : { MAX : "E8", AVAIL : "F8" },
    "HUNTSMAN ALTIMOR"      : { MAX : "E9", AVAIL : "F9" },
    "SUN KING'S SALVATION"  : { MAX : "E10", AVAIL : "F10" },
    "ARTIFICER XY'MOX"      : { MAX : "E11", AVAIL : "F11" },
    "HUNGERING DESTROYER"   : { MAX : "E12", AVAIL : "F12" },
    "LADY INERVA DARKVEIN"  : { MAX : "E13", AVAIL : "F13" },
    "THE COUNCIL OF BLOOD"  : { MAX : "E14", AVAIL : "F14" },
    "SLUDGEFIST"            : { MAX : "E15", AVAIL : "F15" },
    "STONE LEGION GENERALS" : { MAX : "E16", AVAIL : "F16" },
    "SIRE DENATHRIUS"       : { MAX : "E17", AVAIL : "F17" },
}

const CELLS_RESERVATIONS_ARMORTYPES = {
    "PLATE"     : { MAX : "C20", AVAIL : "D20" },
    "MAIL"      : { MAX : "C21", AVAIL : "D21" },
    "LEATHER"   : { MAX : "C22", AVAIL : "D22" },
    "CLOTH"     : { MAX : "C23", AVAIL : "D23" }
};

const CELLS_RESERVATIONS_MAINSTATS = {
    "STRENGTH"  : { MAX : "C26", AVAIL : "D26" },
    "AGILITY"   : { MAX : "C27", AVAIL : "D27" },
    "INTELLECT" : { MAX : "C28", AVAIL : "D28" },
}

/*const CELLS_RESERVATIONS_CLASSES = {
    "WARRIOR"       : "C41",
    "PALADIN"       : "C42",
    "HUNTER"        : "C43",
    "ROGUE"         : "C44",
    "PRIEST"        : "C45",
    "DEATH KNIGHT"  : "C46",
    "SHAMAN"        : "C47",
    "MAGE"          : "C48",
    "WARLOCK"       : "C49",
    "MONK"          : "C50",
    "DRUID"         : "C51",
    "DEMON HUNTER"  : "C52"
};*/

const CELLS_RESERVATIONS_WEAPONS = {
    "ABOMINABLE"    : { MAX : "C31", AVAIL : "D31" },
    "MYSTIC"        : { MAX : "C32", AVAIL : "D32" },
    "VENERATED"     : { MAX : "C33", AVAIL : "D33" },
    "ZENITH"        : { MAX : "C34", AVAIL : "D34" }
};

const CELLS_RESERVATIONS_TRINKETS = {
    "SKULKER'S WING"                : { MAX : "C37", AVAIL : "D37" },
    "BARGAST'S LEASH"               : { MAX : "C38", AVAIL : "D38" },
    "GLUTTINOUS SPIKE"              : { MAX : "C39", AVAIL : "D39" },
    "CONSUMPTIVE INFUSION"          : { MAX : "C40", AVAIL : "D40" },
    "GLYPH OF ASSIMILATION"         : { MAX : "C41", AVAIL : "D41" },
    "SPLINTERED HEART OF AL'AR"     : { MAX : "C42", AVAIL : "D42" },
    "TUFT OF SMOULDERING PLUMAGE"   : { MAX : "C43", AVAIL : "D43" },
    "SOUL IGNITER"                  : { MAX : "C44", AVAIL : "D44" },
    "MEMORY OF PAST SINS"           : { MAX : "C45", AVAIL : "D45" },
    "MACABRE SHEET MUSIC"           : { MAX : "C46", AVAIL : "D46" },
    "HATEFUL CHAIN"                 : { MAX : "C47", AVAIL : "D47" },
    "STONE LEGION HERALDRY"         : { MAX : "C48", AVAIL : "D48" },
    "SANGUINE VINTAGE"              : { MAX : "C49", AVAIL : "D49" },
    "CABALIST'S HYMNAL"             : { MAX : "C50", AVAIL : "D50" },
    "MANABOUND MIRROR"              : { MAX : "C51", AVAIL : "D51" },
    "DREADFIRE VESSEL"              : { MAX : "C52", AVAIL : "D52" }
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
    BUYER_NAME      : 9,
    CLASS           : 12,
    SPEC            : 13,
    SERVICE         : 15,
    FUNNELS         : 16,
    FUNNEL_TYPE     : 17,
    FUNNEL_OPTION   : 18,
    NOTE            : 19,
    CHECKBOX        : 20
};