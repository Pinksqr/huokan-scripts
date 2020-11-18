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
const ARMOR_TYPES = {
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
const STAT_SPECS = {
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
}