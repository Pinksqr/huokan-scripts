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
    "FULL CLEAR"            : { MAX : "C18", AVAIL : "D18" },
    "2/10"                  : { MAX : "C19", AVAIL : "D19" },
    "3/10"                  : { MAX : "C20", AVAIL : "D20" },
    "4/10"                  : { MAX : "C21", AVAIL : "D21" },
    "5/10"                  : { MAX : "C22", AVAIL : "D22" },
    "6/10"                  : { MAX : "C23", AVAIL : "D23" },
    "7/10"                  : { MAX : "C24", AVAIL : "D24" },
    "8/10"                  : { MAX : "C25", AVAIL : "D25" },
    "9/10"                  : { MAX : "C26", AVAIL : "D26" },
}

const CELLS_RESERVATIONS_ARMORTYPES = {
    "SHRIEKWING"            : { CLOTH : "C29", LEATHER : "D29" , MAIL : "E29", PLATE: "F29"},
    "HUNTSMAN ALTIMOR"      : { CLOTH : "C30", LEATHER : "D30" , MAIL : "E30", PLATE: "F30"},
    "SUN KING'S SALVATION"  : { CLOTH : "C31", LEATHER : "D31" , MAIL : "E31", PLATE: "F31"},
    "ARTIFICER XY'MOX"      : { CLOTH : "C32", LEATHER : "D32" , MAIL : "E32", PLATE: "F32"},
    "HUNGERING DESTROYER"   : { CLOTH : "C33", LEATHER : "D33" , MAIL : "E33", PLATE: "F33"},
    "LADY INERVA DARKVEIN"  : { CLOTH : "C34", LEATHER : "D34" , MAIL : "E34", PLATE: "F34"},
    "THE COUNCIL OF BLOOD"  : { CLOTH : "C35", LEATHER : "D35" , MAIL : "E35", PLATE: "F35"},
    "SLUDGEFIST"            : { CLOTH : "C36", LEATHER : "D36" , MAIL : "E36", PLATE: "F36"},
    "STONE LEGION GENERALS" : { CLOTH : "C37", LEATHER : "D37" , MAIL : "E37", PLATE: "F37"},
    "SIRE DENATHRIUS"       : { CLOTH : "C38", LEATHER : "D38" , MAIL : "E38", PLATE: "F38"},
};

const CELLS_RESERVATIONS_WEAPONS = {
    "HUNTSMAN ALTIMOR"      : { ABOMINABLE : "C50", MYSTIC : "D50" , VENERATED : "E50", ZENITH: "F50"},
    "SUN KING'S SALVATION"  : { ABOMINABLE : "C51", MYSTIC : "D51" , VENERATED : "E51", ZENITH: "F51"},
    "HUNGERING DESTROYER"   : { ABOMINABLE : "C52", MYSTIC : "D52" , VENERATED : "E52", ZENITH: "F52"},
    "THE COUNCIL OF BLOOD"  : { ABOMINABLE : "C53", MYSTIC : "D53" , VENERATED : "E53", ZENITH: "F53"},
    "SIRE DENATHRIUS"       : { ABOMINABLE : "C54", MYSTIC : "D54" , VENERATED : "E54", ZENITH: "F54"},
};

const CELLS_RESERVATIONS_TRINKETS = {
    "SKULKER'S WING"                : { MAX : "C57", AVAIL : "D57" },
    "BARGAST'S LEASH"               : { MAX : "C58", AVAIL : "D58" },
    "GLUTTINOUS SPIKE"              : { MAX : "C59", AVAIL : "D59" },
    "CONSUMPTIVE INFUSION"          : { MAX : "C60", AVAIL : "D60" },
    "GLYPH OF ASSIMILATION"         : { MAX : "C61", AVAIL : "D61" },
    "SPLINTERED HEART OF AL'AR"     : { MAX : "C62", AVAIL : "D62" },
    "TUFT OF SMOULDERING PLUMAGE"   : { MAX : "C63", AVAIL : "D63" },
    "SOUL IGNITER"                  : { MAX : "C64", AVAIL : "D64" },
    "MEMORY OF PAST SINS"           : { MAX : "C65", AVAIL : "D65" },
    "MACABRE SHEET MUSIC"           : { MAX : "C66", AVAIL : "D66" },
    "HATEFUL CHAIN"                 : { MAX : "C67", AVAIL : "D67" },
    "STONE LEGION HERALDRY"         : { MAX : "C68", AVAIL : "D68" },
    "SANGUINE VINTAGE"              : { MAX : "C69", AVAIL : "D69" },
    "CABALIST'S HYMNAL"             : { MAX : "C70", AVAIL : "D70" },
    "MANABOUND MIRROR"              : { MAX : "C71", AVAIL : "D71" },
    "DREADFIRE VESSEL"              : { MAX : "C72", AVAIL : "D72" }
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