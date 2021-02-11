/** RAID INFORMATION SHEET */

const CELLS_RAIDINFO_INFO = {
    "GUILD" : "C7",
    "DATE" : "C8",
    "TIME" : "C9",
    "CONCAT" : "C10"
};

const CELLS_RAIDINFO_BOSSES = {
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
    "SHRIEKWING"            : { CLOTH : "L8", LEATHER : "M8" , MAIL : "N8", PLATE: "O8"},
    "HUNTSMAN ALTIMOR"      : { CLOTH : "L9", LEATHER : "M9" , MAIL : "N9", PLATE: "O9"},
    "SUN KING'S SALVATION"  : { CLOTH : "L10", LEATHER : "M10" , MAIL : "N10", PLATE: "O10"},
    "ARTIFICER XY'MOX"      : { CLOTH : "L11", LEATHER : "M11" , MAIL : "N11", PLATE: "O11"},
    "HUNGERING DESTROYER"   : { CLOTH : "L12", LEATHER : "M12" , MAIL : "N12", PLATE: "O12"},
    "LADY INERVA DARKVEIN"  : { CLOTH : "L13", LEATHER : "M13" , MAIL : "N13", PLATE: "O13"},
    "THE COUNCIL OF BLOOD"  : { CLOTH : "L14", LEATHER : "M14" , MAIL : "N14", PLATE: "O14"},
    "SLUDGEFIST"            : { CLOTH : "L15", LEATHER : "M15" , MAIL : "N15", PLATE: "O15"},
    "STONE LEGION GENERALS" : { CLOTH : "L16", LEATHER : "M16" , MAIL : "N16", PLATE: "O16"},
    "SIRE DENATHRIUS"       : { CLOTH : "L17", LEATHER : "M17" , MAIL : "N17", PLATE: "O17"},
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
    "FULL CLEAR"            : { MAX : "C18", AVAIL : "D18" }
}

const CELLS_RESERVATIONS_ARMORTYPES = {
    "SHRIEKWING"            : { CLOTH : "C21", LEATHER : "D21" , MAIL : "E21", PLATE: "F21"},
    "HUNTSMAN ALTIMOR"      : { CLOTH : "C22", LEATHER : "D22" , MAIL : "E22", PLATE: "F22"},
    "SUN KING'S SALVATION"  : { CLOTH : "C23", LEATHER : "D23" , MAIL : "E23", PLATE: "F23"},
    "ARTIFICER XY'MOX"      : { CLOTH : "C24", LEATHER : "D24" , MAIL : "E24", PLATE: "F24"},
    "HUNGERING DESTROYER"   : { CLOTH : "C25", LEATHER : "D25" , MAIL : "E25", PLATE: "F25"},
    "LADY INERVA DARKVEIN"  : { CLOTH : "C26", LEATHER : "D26" , MAIL : "E26", PLATE: "F26"},
    "THE COUNCIL OF BLOOD"  : { CLOTH : "C27", LEATHER : "D27" , MAIL : "E27", PLATE: "F27"},
    "SLUDGEFIST"            : { CLOTH : "C28", LEATHER : "D28" , MAIL : "E28", PLATE: "F28"},
    "STONE LEGION GENERALS" : { CLOTH : "C29", LEATHER : "D29" , MAIL : "E29", PLATE: "F29"},
    "SIRE DENATHRIUS"       : { CLOTH : "C30", LEATHER : "D30" , MAIL : "E30", PLATE: "F30"},
};

const CELLS_RESERVATIONS_WEAPONS = {
    "HUNTSMAN ALTIMOR"      : { ABOMINABLE : "C42", MYSTIC : "D42" , VENERATED : "E42", ZENITH: "F42"},
    "SUN KING'S SALVATION"  : { ABOMINABLE : "C43", MYSTIC : "D43" , VENERATED : "E43", ZENITH: "F43"},
    "HUNGERING DESTROYER"   : { ABOMINABLE : "C44", MYSTIC : "D44" , VENERATED : "E44", ZENITH: "F44"},
    "THE COUNCIL OF BLOOD"  : { ABOMINABLE : "C45", MYSTIC : "D45" , VENERATED : "E45", ZENITH: "F45"},
    "SIRE DENATHRIUS"       : { ABOMINABLE : "C46", MYSTIC : "D46" , VENERATED : "E46", ZENITH: "F46"},
};

const CELLS_RESERVATIONS_TRINKETS = {
    "SKULKER'S WING"                : { MAX : "C49", AVAIL : "D49" },
    "BARGAST'S LEASH"               : { MAX : "C50", AVAIL : "D50" },
    "GLUTTINOUS SPIKE"              : { MAX : "C51", AVAIL : "D51" },
    "CONSUMPTIVE INFUSION"          : { MAX : "C52", AVAIL : "D52" },
    "GLYPH OF ASSIMILATION"         : { MAX : "C53", AVAIL : "D53" },
    "SPLINTERED HEART OF AL'AR"     : { MAX : "C54", AVAIL : "D54" },
    "TUFT OF SMOULDERING PLUMAGE"   : { MAX : "C55", AVAIL : "D55" },
    "SOUL IGNITER"                  : { MAX : "C56", AVAIL : "D56" },
    "MEMORY OF PAST SINS"           : { MAX : "C57", AVAIL : "D57" },
    "MACABRE SHEET MUSIC"           : { MAX : "C58", AVAIL : "D58" },
    "HATEFUL CHAIN"                 : { MAX : "C59", AVAIL : "D59" },
    "STONE LEGION HERALDRY"         : { MAX : "C60", AVAIL : "D60" },
    "SANGUINE VINTAGE"              : { MAX : "C61", AVAIL : "D61" },
    "CABALIST'S HYMNAL"             : { MAX : "C62", AVAIL : "D62" },
    "MANABOUND MIRROR"              : { MAX : "C63", AVAIL : "D63" },
    "DREADFIRE VESSEL"              : { MAX : "C64", AVAIL : "D64" }
};

/** RAID MAINS & RAID ALTS SHEET */

const COLUMNS_RAIDMAINS = {
    AWAY            : 1,
    AVAILABLE       : 3,
    PLAYER_NAME     : 4,
    PLAYER_CLASS    : 5,
    LOOT_SPECS      : [6, 8, 10, 12],
    AVAILABLE_8     : 14
};

const COLUMNS_RAIDALTS = {
    AVAILABLE   : 1,
    MAIN_NAME   : 2,
    ALT_NAME    : 3,
    ALT_CLASS   : 4,
    LOOT_SPECS  : [5, 7, 9, 11],
    AVAILABLE_8 : 13
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
    LISTED_PRICE    : 27,
    CHARGED_PRICE   : 28,
    PAID_BAL        : 29,
    REMAINING_BAL   : 30,
    RAID_SERVICE    : 33,
    RAID_BUYER      : 34,
    RAID_BOOSTER    : 35
};