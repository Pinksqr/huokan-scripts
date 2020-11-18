/**
 * RaidRoster contains an array of RaidMains, who represent people on a raid team.
 * Each raid member contains a name, class, specs, and an array of alts (if applicable)
 */
class RaidRoster {
    constructor(){
        this.raidMembers = [];
    }
    addMain(playerName, playerClass, lootSpecs, available) {
        let member = new RaidMain(playerName, playerClass, lootSpecs, available);
        this.raidMembers.push(member);
        return member;
    }
    getMainByName(name) {
        for(let index in this.raidMembers) {
            if (this.raidMembers[index].getPlayerName() === name) {
                return this.raidMembers[index];
            }
        }
    }
    //TODO: Only count an armor type if a spec is chosen!
    getMaxArmorTypes() {
        Logger.log("Function: getMaxArmorTypes Triggered");
        let maxArmorTypes = { "PLATE":0, "MAIL":0, "LEATHER":0, "CLOTH":0};

        for (let index in this.raidMembers) {
            let armorTypeAdded = { "PLATE":false, "MAIL":false, "LEATHER":false, "CLOTH":false};
            let player = this.raidMembers[index];

            if (player.isAvailable()){
                let armorType = player.getArmorType();
                //TODO: Only count if a spec is chosen!
                Logger.log(player.playerName + " " + player.getLootSpecs());
                Logger.log(player.playerName + "'s first spec is " + STAT_SPECS[1][0] + " " +
                    STAT_SPECS[CLASSES[player.getClassName()]][0]);

                player.getLootSpecs().forEach(function(specAvailable) {
                    if (specAvailable){
                        maxArmorTypes[armorType]++;
                        armorTypeAdded[armorType] = true;
                    }
                });

                let alts = player.getAlts();

                for (let index in alts) {
                    let alt = alts[index];
                    if (alt.isAvailable()) {
                        Logger.log(player.playerName + "'s alt is available");
                        let armorType = alt.getArmorType();

                    }
                }
                /*let altClasses = player.getAltClasses();
                for (let index in altClasses) {
                    armorType = player.getAlt(index).getArmorType();
                    if (armorTypeAdded[armorType] !== true) {
                        maxArmorTypes[armorType]++;
                        armorTypeAdded[armorType] = true;
                    }
                }*/

            }
        }
        Logger.log("Function: getMaxArmorTypes Finished")
        return maxArmorTypes;
    }

    getMaxValues() {
        let maxValues = {
            maxArmorType : { "PLATE":0, "MAIL":0, "LEATHER":0, "CLOTH":0 },
            maxMainStat : { STR:0, AGI:0, INT:0 },
            maxClass : { "WARRIOR":0, "PALADIN":0, "HUNTER":0, "ROGUE":0, "PRIEST":0, "DEATH KNIGHT":0, "SHAMAN":0,
                "MAGE":0, "WARLOCK":0, "MONK":0, "DRUID":0, "DEMON HUNTER":0 }
        }

        let addedValues = {
            armorTypes : {},
            classNames : {},
            mainStats : {}
        }

        this.raidMembers.forEach(function(main) {
            if (main.isAvailable()) {
                let armorType = main.getArmorType();
                let className = main.getClassName();
                let mainStats = main.getMainStats();

                if (main.isSpecAvailable()) {
                    maxValues.maxArmorType[armorType]++;
                    maxValues.maxClass[className]++;
                    mainStats.forEach(function(stat) {
                        if (!addedValues.mainStats[stat]) {
                            maxValues.maxMainStat[stat]++;
                            addedValues.mainStats[stat] = true;
                        }
                    });
                    addedValues.armorType[armorType] = true;
                    addedValues.classNames[className] = true;
                }
            }

            let alts = main.getAlts();
            alts.forEach(function(alt) {
                if (alt.isAvailable()){
                    let altArmorType = alt.getArmorType();
                    let altClassName = alt.getClassName();
                    let altMainStats = alt.getMainStats();

                    if (main.isSpecAvailable()) {
                        if (!addedValues.armorTypes[altArmorType]) {
                            maxValues.maxArmorType[altArmorType]++;
                            addedValues.armorTypes[altArmorType] = true;
                        }
                        if (!addedValues.classNames[altClassName]) {
                            maxValues.maxClass[altClassName]++;
                            addedValues.armorTypes[altArmorType] = true;
                        }
                        altMainStats.forEach(function(stat) {
                            if (!addedValues.mainStats[stat]) {
                                maxValues.maxMainStat[stat]++;
                                addedValues.mainStats[stat] = true;
                            }
                        });
                    }
                }
            })
        })

        return maxValues;
    }

}

/**
 * RaidMember contains information on an individual raider, who is normally part of a raid team.
 * playerName: String name of the raid member/player (ex, "Bob")
 * playerClass: String class of the raid member/player (ex, "WARRIOR")
 * lootSpecs: Array of strings, each representing a loot spec and if it is tradeable or not.
 * (ex, ["TRUE", "FALSE", "FALSE"] meaning Bob can trade only his first spec.
 * Note that each value in the array corresponds to the values in Constants.SPECIALIZATIONS
 * available: if the player is currently available (not sitting/out/saved)
 */
class RaidMember {
    constructor(playerName, playerClass, lootSpecs, available){
        this.playerName = playerName;
        this.playerClass = playerClass;
        this.lootSpecs = lootSpecs;
        this.available = available;
    }
    getPlayerName() {
        return this.playerName;
    }
    getClassName() {
        return this.playerClass;
    }
    getLootSpecs() {
        return this.lootSpecs;
    }
    getArmorType() {
        return ARMOR_TYPES[this.playerClass];
    }
    getMainStats() {
        let mainStats = [];
        for (let specNumber in this.lootSpecs()){
            Logger.log(this.playerName + "'s " + " spec is " + STAT_SPECS[CLASSES[this.playerClass]][specNumber]);
            mainStats.push(STAT_SPECS[CLASSES[this.playerClass]][specNumber]);
        }
        return mainStats;
    }
    isAvailable() {
        return this.available;
    }
    isSpecAvailable() {
        for (let spec in this.lootSpecs) {
            return spec ? true : false;
        }
    }
}

/**
 * RaidMain is an extension of RaidMember. Raid main contains information on a main raider.
 * Unlike a regular raid member, a main raider also may have one or many alts.
 * alts: An array of RaidMembers, each representing an alt that the main raider has.
 */
class RaidMain extends RaidMember {
    constructor(playerName, playerClass, lootSpecs, available) {
        super(playerName, playerClass, lootSpecs, available);
        this.alts = [];
    }
    addAlt(altName, altClass, lootSpecs, available) {
        let alt = new RaidMember(altName, altClass, lootSpecs, available);
        this.alts.push(alt);
        return alt;
    }
    getAlts() {
        return this.alts;
    }
    getAlt(index) {
        return this.alts[index];
    }
    getAltClasses() {
        let altClasses = [];
        for (let index in this.alts) {
            altClasses.push(this.alts[index].getClassName());
        }
        return altClasses;
    }
    getAltCount() {
        return this.alts.count;
    }
}

