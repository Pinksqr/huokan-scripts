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
    "LAST WING"             : { MAX : "C18", AVAIL : "D18" },
    "FULL CLEAR"            : { MAX : "C19", AVAIL : "D19" }
}

const CELLS_RESERVATIONS_ARMORTYPES = {
    "PLATE"     : { MAX : "C22", AVAIL : "D22" },
    "MAIL"      : { MAX : "C23", AVAIL : "D23" },
    "LEATHER"   : { MAX : "C24", AVAIL : "D24" },
    "CLOTH"     : { MAX : "C25", AVAIL : "D25" }
};

const CELLS_RESERVATIONS_MAINSTATS = {
    "STRENGTH"  : { MAX : "C28", AVAIL : "D28" },
    "AGILITY"   : { MAX : "C29", AVAIL : "D29" },
    "INTELLECT" : { MAX : "C30", AVAIL : "D30" },
}

const CELLS_RESERVATIONS_WEAPONS = {
    "ABOMINABLE"    : { MAX : "C33", AVAIL : "D33" },
    "MYSTIC"        : { MAX : "C34", AVAIL : "D34" },
    "VENERATED"     : { MAX : "C35", AVAIL : "D35" },
    "ZENITH"        : { MAX : "C36", AVAIL : "D36" }
};

const CELLS_RESERVATIONS_TRINKETS = {
    "SKULKER'S WING"                : { MAX : "C39", AVAIL : "D39" },
    "BARGAST'S LEASH"               : { MAX : "C40", AVAIL : "D40" },
    "GLUTTINOUS SPIKE"              : { MAX : "C41", AVAIL : "D41" },
    "CONSUMPTIVE INFUSION"          : { MAX : "C42", AVAIL : "D42" },
    "GLYPH OF ASSIMILATION"         : { MAX : "C43", AVAIL : "D43" },
    "SPLINTERED HEART OF AL'AR"     : { MAX : "C44", AVAIL : "D44" },
    "TUFT OF SMOULDERING PLUMAGE"   : { MAX : "C45", AVAIL : "D45" },
    "SOUL IGNITER"                  : { MAX : "C46", AVAIL : "D46" },
    "MEMORY OF PAST SINS"           : { MAX : "C47", AVAIL : "D47" },
    "MACABRE SHEET MUSIC"           : { MAX : "C48", AVAIL : "D48" },
    "HATEFUL CHAIN"                 : { MAX : "C49", AVAIL : "D49" },
    "STONE LEGION HERALDRY"         : { MAX : "C50", AVAIL : "D50" },
    "SANGUINE VINTAGE"              : { MAX : "C51", AVAIL : "D51" },
    "CABALIST'S HYMNAL"             : { MAX : "C52", AVAIL : "D52" },
    "MANABOUND MIRROR"              : { MAX : "C53", AVAIL : "D53" },
    "DREADFIRE VESSEL"              : { MAX : "C54", AVAIL : "D54" }
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
    INDEX           : 6,
    ADVERTISER_NAME : 7,
    BUYER_NAME      : 9,
    BUYER_BTAG      : 10,
    BUYER_DISCID    : 11,
    CLASS           : 12,
    SPEC            : 13,
    SERVICE         : 15,
    FUNNELS         : 16,
    FUNNEL_TYPE     : 17,
    FUNNEL_OPTION   : 18,
    NOTE            : 19,
    CHECKBOX        : 20,
    STATUS          : 21,
    RAID_SERVICE    : 28,
    RAID_BUYER      : 29,
    RAID_BOOSTER    : 30
};