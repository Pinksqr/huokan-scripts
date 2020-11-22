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
    constructor(playerName, playerClass, lootSpecs, available, buyerName){
        this.playerName = playerName;
        this.playerClass = playerClass;
        this.lootSpecs = lootSpecs;
        this.available = available;
        this.buyerName = buyerName;
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
        return CLASS_ARMORTYPES[this.playerClass];
    }
    getWeaponToken() {
        return CLASS_TOKENS[this.playerClass];
    }
    getMainStat(specNumber) {
        return SPEC_STATS[CLASSES[this.playerClass]][specNumber];
    }
    getMainStats() {
        let mainStats = [];
        for (let specNumber in this.getLootSpecs()){
            mainStats.push(SPEC_STATS[CLASSES[this.playerClass]][specNumber]);
        }
        return mainStats;
    }
    getTrinkets() {
        let trinkets = [];
        for (let specNumber in this.getLootSpecs()){
            if (this.lootSpecs[specNumber]) {
                let specTrinkets = SPEC_TRINKETS[CLASSES[this.playerClass]][specNumber];

                if (specNumber && specTrinkets) {
                    specTrinkets.forEach(function (trinket) {
                        trinkets.push(trinket);
                    })
                }
            }
        }
        return trinkets;
    }
    isAvailable() {
        return this.available;
    }
    isSpecAvailable() {
        let specAvailable = false;
        for (let spec in this.lootSpecs) {
            if (this.lootSpecs[spec]) {
                specAvailable = true;
            }
        }
        return specAvailable;
    }
    hasBuyer() {
        return this.buyerName ? true : false;
    }
    setBuyerName(buyerName) {
        this.buyerName = buyerName;
    }
    getBuyerName() {
        return this.buyerName;
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
        return this.alts.length;
    }
}