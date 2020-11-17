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
                return this.raidMembgiters[index];
            }
        }
    }
    getMaxArmorTypes() {
        Logger.log("Function: getMaxArmorTypes Triggered");
        let maxArmorTypes = { "PLATE":0, "MAIL":0, "LEATHER":0, "CLOTH":0};

        for (let index in this.raidMembers) {
            let armorTypeAdded = { "PLATE":false, "MAIL":false, "LEATHER":false, "CLOTH":false};
            let player = this.raidMembers[index];

            if (player.isAvailable()){
                let armorType = player.getArmorType();
                maxArmorTypes[armorType]++;
                armorTypeAdded[armorType] = true;

                let altClasses = player.getAltClasses();
                for (let index in altClasses) {
                    armorType = player.getAlt(index).getArmorType();
                    if (armorTypeAdded[armorType] !== true) {
                        maxArmorTypes[armorType]++;
                        armorTypeAdded[armorType] = true;
                    }
                }

            }
        }
        return maxArmorTypes;
    }
    getMaxArmorType(armorType) {
        let maxArmorType = 0;
        for (let index in this.raidMembers) {
            let player = this.raidMembers[index];
            if (player.isAvailable()) {
                if (armorType.includes(player.getClassName())) {
                    Logger.log(
                        player.getPlayerName() + "'s " +
                        player.getClassName() + " is part of the [" +
                        armorType + "] armor type; Adding to count...")
                    maxArmorType += 1;
                } else {
                    let altClasses = player.getAltClasses();
                    for (let index in altClasses) {
                        if (armorType.includes(altClasses[index])) {
                            Logger.log(
                                player.getPlayerName() + "'s " +
                                player.getAlt(index).getClassName() + " alt (" +
                                player.getAlt(index).getPlayerName() + " is part of the [" +
                                armorType + "] armor type; Adding to count..."
                            );
                            maxArmorType += 1;
                        }
                    }
                }
            }
        }
        return maxArmorType;
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
    getArmorType() {
        return ARMOR_TYPES[this.playerClass];
    }
    isAvailable() {
        return this.available;
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
}

