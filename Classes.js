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
    constructor(playerName, playerClass, lootSpecs, available, buyerName, boosterName){
        this.playerName = playerName
        this.playerClass = playerClass
        this.lootSpecs = lootSpecs
        this.available = available
    }
}

/**
 * RaidMain is an extension of RaidMember. Raid main contains information on a main raider.
 * Unlike a regular raid member, a main raider also may have one or many alts.
 * alts: An array of RaidMembers, each representing an alt that the main raider has.
 */
class RaidMain extends RaidMember {
    constructor(playerName, playerClass, lootSpecs, available) {
        super(playerName, playerClass, lootSpecs, available)
        this.alts = []
    }

    addAlt(altName, altClass, lootSpecs, available) {
        let alt = new RaidMember(altName, altClass, lootSpecs, available)
        this.alts.push(alt)
        return alt
    }
}

class Reservation {
    constructor(service, funnels, funnelType, funnelOption, buyerName, boosters) {
        this.service = service
        this.funnels = funnels
        this.funnelType = funnelType
        this.funnelOption = funnelOption
        this.buyerName = buyerName
        this.boosters = boosters
    }
}

class ReservationResponse {
    constructor(isUpdate, status, message) {
        this.isUpdate = isUpdate
        this.status = status
        this.message = message
    }
}