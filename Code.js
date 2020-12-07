let properties = PropertiesService.getScriptProperties()

function onEdit(event){
    let sheet = event.source.getActiveSheet()
    let range = event.range
    let value = event.value

    //Raid info/roster/alts sheet updates
    updateRaidRosterSpecCheckboxes(sheet, range, value)
    updateRaidRoster(sheet, range)

    //Reservation sheet updates
    updateReservationSpecDropdown(sheet, range, value)
    updateReservationServiceInfoDropdowns(sheet, range)

    //Reservations
    updateReservationMessages(sheet, range, value)
    handleReservations(sheet, range, value)
}

/**
 * When a character class is changed on the raid mains & raid alts sheet,
 * this will generate & update the specialization checkboxes beside it
 * @param sheet The edited sheet (raid mains & raid alts)
 * @param range The edited range
 * @param value The edited cell (class drop-down)
 */
function updateRaidRosterSpecCheckboxes(sheet, range, value){
    if (sheet.getName() === "Raid Mains" || sheet.getName() === "Raid Alts"){
        let classColumn = getColumnByName(sheet, 4, "Class")
        let row = range.getRow()
        let col = range.getColumn()

        if (row > 4 && col === classColumn){
            sheet.getRange(row, col+1, 1, 8).clearContent().removeCheckboxes()

            if (value){
                let specNameCells = [col + 2, col + 4, col + 6, col + 8]
                let specNames = SPECIALIZATIONS[CLASSES[value.toUpperCase()]]

                for (let index in specNames){
                    let specName = specNames[index]
                    sheet.getRange(row, specNameCells[index]).setValue(toTitleCase(specName))
                    sheet.getRange(row, specNameCells[index] - 1).insertCheckboxes()
                }
            }
        }
    }

    function getColumnByName(sheet, row, name){
        return sheet.getDataRange().getValues()[row].indexOf(name)+1
    }
}

/**
 * On edit of the raid mains & raid alts sheet, recreates the raid roster and updates the raid properties
 * (eg,
 * @param sheet The edited sheet (raid mains & raid alts)
 * @param range The range that's been edited
 */
function updateRaidRoster(sheet, range){
    if (sheet.getName() === "Raid Mains" || sheet.getName() === "Raid Alts"){
        let row = range.getRow()
        let col = range.getColumn()

        if (row > 4 && col < 13){
            let raidRoster = createRaidRoster()
            let maxValues = getMaxValues(sheet, raidRoster, {})

            //Sorts the raid roster by number of alts assigned to that raider
            raidRoster.sort(function(a, b){
                return a.alts.length - b.alts.length
            })

            //Add raidRoster to properties (must be present & sorted in case a new reservation sheet is made)
            properties.setProperty("raidRoster", JSON.stringify(raidRoster))

            updateProperties(maxValues)
        }
    }

    function createRaidRoster() {
        let spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
        let mainSheet = spreadsheet.getSheetByName("Raid Mains");
        let altSheet = spreadsheet.getSheetByName("Raid Alts");
        let mainSheetValues = mainSheet.getSheetValues(6, 1, mainSheet.getLastRow(), 11);
        let altSheetValues = altSheet.getSheetValues(6, 1, altSheet.getLastRow(), 12);
        let raidRoster = []; //new RaidRoster();

        //Create main raiders and add to roster
        for (let row in mainSheetValues) {
            let currentRow  = mainSheetValues[row];
            let available   = currentRow[COLUMNS_RAIDMAINS.AVAILABLE];
            let playerName  = currentRow[COLUMNS_RAIDMAINS.PLAYER_NAME];
            let playerClass = currentRow[COLUMNS_RAIDMAINS.PLAYER_CLASS];
            let lootSpecs   = [];

            COLUMNS_RAIDMAINS.LOOT_SPECS.forEach(function (col) {
                lootSpecs.push(currentRow[col]);
            });

            if (playerName && playerClass && lootSpecs) {
                raidRoster.push(new RaidMain(playerName, playerClass.toUpperCase(), lootSpecs, available));
            }
        }

        //Create raider alts and connect to mains in the raid roster
        for (let row in altSheetValues){
            let currentRow  = altSheetValues[row];
            let available   = currentRow[COLUMNS_RAIDALTS.AVAILABLE];
            let mainName    = currentRow[COLUMNS_RAIDALTS.MAIN_NAME];
            let altName     = currentRow[COLUMNS_RAIDALTS.ALT_NAME];
            let altClass    = currentRow[COLUMNS_RAIDALTS.ALT_CLASS];
            let lootSpecs   = [];

            COLUMNS_RAIDALTS.LOOT_SPECS.forEach(function (col) {
                lootSpecs.push(currentRow[col]);
            });

            let main = getMainByName(mainName);

            if (main && altName && altClass && lootSpecs) {
                main.addAlt(altName, altClass.toUpperCase(), lootSpecs, available);
            }
        }

        function getMainByName(name) {
            for (let index in raidRoster) {
                if (raidRoster[index].playerName === name) {
                    return raidRoster[index];
                }
            }
        }

        return raidRoster;
    }

    function updateProperties(maxValues){
        let raidInfoSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Raid Information")

        //Clear values
        clearValues(CELLS_RAIDINFO_ARMORTYPES)
        clearValues(CELLS_RAIDINFO_MAINSTATS)
        clearValues(CELLS_RAIDINFO_CLASSES)
        clearValues(CELLS_RAIDINFO_WEAPONS)
        clearValues(CELLS_RAIDINFO_TRINKETS)

        //Update values
        updateValues(maxValues.armorTypes, CELLS_RAIDINFO_ARMORTYPES)
        updateValues(maxValues.mainStats, CELLS_RAIDINFO_MAINSTATS)
        updateValues(maxValues.weaponTokens, CELLS_RAIDINFO_WEAPONS)
        updateValues(maxValues.trinkets, CELLS_RAIDINFO_TRINKETS)
        updateValues(maxValues.classNames, CELLS_RAIDINFO_CLASSES)

        function clearValues(rangeArray){
            for (const cell in rangeArray){
                raidInfoSheet.getRange(rangeArray[cell]).clearContent()
            }
        }

        function updateValues(values, rangeArray){
            for (const value in values) {
                raidInfoSheet.getRange(rangeArray[value]).setValue(values[value])
            }
        }
    }
}

/**
 * When a class is chosen/changed on the reservation sheet,
 * this will generate/update a new drop-down of available specializations
 * @param sheet The edited sheet (reservations)
 * @param range The edited range
 * @param value The edited cell (class drop-down)
 */
function updateReservationSpecDropdown(sheet, range, value){
    let sheetName = sheet.getName()
    if (sheetName !== "Raid Mains" && sheetName !== "Raid Alts" && sheetName !== "Raid Information"){
        let row = range.getRow()
        let col = range.getColumn()

        if (row > 7 && col === COLUMNS_RESERVATIONS.CLASS){
            let specCell = sheet.getRange(row, COLUMNS_RESERVATIONS.SPEC).clearContent().clearDataValidations()
            let specNames = SPECIALIZATIONS[CLASSES[value.toUpperCase()]]
            if (specNames){
                let dataRule = SpreadsheetApp.newDataValidation().requireValueInList(arrayToTitleCase(specNames)).build()
                specCell.setDataValidation(dataRule)
            }
        }
    }
}

/**
 * In the reservation sheet, handles the updates on the drop-down menus for service, funnel type, and funnel options,
 * so that when one is picked, the others update.
 * Ex, when Sire Denathrius is picked as a service, only trinkets/weapons from that boss should be shown in the drop-downs
 * @param sheet
 * @param range
 */
function updateReservationServiceInfoDropdowns(sheet, range) {
    let sheetName = sheet.getName()
    if (sheetName !== "Raid Mains" && sheetName !== "Raid Alts" && sheetName !== "Raid Information") {
        let row = range.getRow()
        let col = range.getColumn()

        if (row > 7 && (
            col === COLUMNS_RESERVATIONS.SERVICE ||
            col === COLUMNS_RESERVATIONS.FUNNEL_TYPE ||
            col === COLUMNS_RESERVATIONS.FUNNEL_OPTION
        )) {
            let cells = {
                service: sheet.getRange(row, COLUMNS_RESERVATIONS.SERVICE),
                type: sheet.getRange(row, COLUMNS_RESERVATIONS.FUNNEL_TYPE),
                option: sheet.getRange(row, COLUMNS_RESERVATIONS.FUNNEL_OPTION)
            }

            let values = {
                service: cells.service.getValue().toUpperCase(),
                type: cells.type.getValue().toUpperCase(),
                option: cells.option.getValue().toUpperCase()
            }

            //Determine which cell (if any) needs to be filtered for each type of edit
            switch (col){
                case COLUMNS_RESERVATIONS.SERVICE:
                    handleService(cells, values)
                    break;
                case COLUMNS_RESERVATIONS.FUNNEL_TYPE:
                    handleType(cells, values)
                    break;
                case COLUMNS_RESERVATIONS.FUNNEL_OPTION:
                    handleOption(cells,values)
                    break;
            }
        }
    }

    function handleService(cells, values) {
        if (values.service && !values.type /*implies !values.option*/ ){
            filter(cells.type, getFilteredTypes(values.service))
        } else if (values.service && values.type) {
            filter(cells.option, getFilteredOptionsWithService(values.service, values.type))
        } else if (!values.service && values.type && values.option) {
            filter(cells.service, getFilteredServices(values.type, values.option))
        } else if (!values.service && values.type && !values.option){
            cells.option.clearContent().clearDataValidations()
        }
    }

    function handleType(cells, values){
        if (!values.service && values.type){
            filter(cells.option, getFilteredOptions(values.type))
        } else if (values.service && values.type){
            filter(cells.option, getFilteredOptionsWithService(values.service, values.type))
        } else if (!values.type){
            cells.option.clearContent().clearDataValidations()
        }
    }

    function handleOption(cells, values){
        if (!values.service && values.option){
            filter(cells.service, getFilteredServices(values.type, values.option))
        } else if (values.service && !values.option){
            filter(cells.service, Object.values(SERVICES))
        }
    }

    function getFilteredServices(type, option){
        switch (type){
            case FUNNEL_TYPES.ARMOR:
                return Object.values(SERVICES)
            case FUNNEL_TYPES.WEAPON:
                for (let boss in BOSSES){
                    for (let weapon in BOSS_WEAPONS[BOSSES[boss]]){
                        if (option === BOSS_WEAPONS[BOSSES[boss]][weapon]) {
                            Logger.log("Found " + BOSSES[BOSS_WEAPONS[BOSSES[boss]]])
                            return [BOSSES[BOSS_WEAPONS[BOSSES[boss]]]]
                        }
                    }
                }
                break;
            case FUNNEL_TYPES.TRINKET:
                for (let boss in BOSSES){
                    for (let trinket in BOSS_TRINKETS[BOSSES[boss]]){
                        if (option === BOSS_TRINKETS[BOSSES[boss]][trinket]) {
                            return [BOSSES[boss]] //Break immediately since a trinket can only drop from one boss
                        }
                    }
                }
                break;
        }
    }

    function getFilteredTypes(service){
        //If service is full clear, you cannot book a trinket or weapon funnel
        if(service === SERVICES.FULL_CLEAR){
            return [FUNNEL_TYPES.ARMOR]
        }
        //Otherwise, filter the service type by the boss (since some bosses dont drop weapon tokens, etc)
        for (let boss in BOSSES){
            if (service === BOSSES[boss]){
                return BOSS_WEAPONS[BOSSES[boss]].length > 0 ?
                    [FUNNEL_TYPES.ARMOR, FUNNEL_TYPES.TRINKET, FUNNEL_TYPES.WEAPON] :
                    [FUNNEL_TYPES.ARMOR, FUNNEL_TYPES.TRINKET]
            }
        }
    }

    function getFilteredOptions(type){
        switch (type){
            case FUNNEL_TYPES.ARMOR:
                return Object.values(ARMOR_TYPES)
            case FUNNEL_TYPES.WEAPON:
                return Object.values(TOKENS)
            case FUNNEL_TYPES.TRINKET:
                return Object.values(TRINKETS)
        }
    }

    function getFilteredOptionsWithService(service, type){
        //If full clear is picked with armor funnel, then display the armor types
        if (service === SERVICES.FULL_CLEAR && type === FUNNEL_TYPES.ARMOR){
            return Object.values(ARMOR_TYPES)
        }
        //Otherwise filter the funnel options by whichever boss & type is picked
        for (let boss in BOSSES){
            if (service === BOSSES[boss]){
                switch(type){
                    case FUNNEL_TYPES.WEAPON:
                        return BOSS_WEAPONS[BOSSES[boss]]
                    case FUNNEL_TYPES.TRINKET:
                        return BOSS_TRINKETS[BOSSES[boss]]
                }
            }
        }
    }

    function filter(cell, values){
        Logger.log("Filtering with " + values)
        if (cell && values && values.length) {
            let dataRule = SpreadsheetApp.newDataValidation().requireValueInList(arrayToTitleCase(values)).build()
            cell.setDataValidation(dataRule)
        }
    }

}

/**
 * Creates a sheet to book reservations
 */
function createReservationSheet(){
    let spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    let templateSheet = spreadsheet.getSheetByName("Reservation Template")
    let raidInfoSheet = spreadsheet.getSheetByName("Raid Information")

    let newSheet = templateSheet.copyTo(spreadsheet)
    let newSheetName = raidInfoSheet.getRange(CELLS_RAIDINFO_INFO.DATE).getDisplayValue()

    if (newSheetName && !spreadsheet.getSheetByName(newSheetName)) {
        newSheet.setName(newSheetName)
        newSheet.activate()
        spreadsheet.moveActiveSheet(5)
    }

    let raidRoster = properties.getProperty("raidRoster")
    Logger.log(raidRoster)

    if (raidRoster) {
        newSheet.getRange(CELLS_RESERVATIONS_JSON.RAID_ROSTER).clearContent().setValue(raidRoster)
    }
    newSheet.getRange(CELLS_RESERVATIONS_JSON.RESERVATIONS).clearContent().setValue(JSON.stringify([]))
    newSheet.getRange(CELLS_RESERVATIONS_INFO.GUILD_INFO).setValue(raidInfoSheet.getRange(CELLS_RAIDINFO_INFO.CONCAT).getValue())

    //Currently not copying class data; too much clutter
    copyCells(raidInfoSheet, CELLS_RAIDINFO_BOSSES, newSheet, CELLS_RESERVATIONS_BOSSES)
    copyCells(raidInfoSheet, CELLS_RAIDINFO_ARMORTYPES, newSheet, CELLS_RESERVATIONS_ARMORTYPES)
    copyCells(raidInfoSheet, CELLS_RAIDINFO_MAINSTATS, newSheet, CELLS_RESERVATIONS_MAINSTATS)
    copyCells(raidInfoSheet, CELLS_RAIDINFO_WEAPONS, newSheet, CELLS_RESERVATIONS_WEAPONS)
    copyCells(raidInfoSheet, CELLS_RAIDINFO_TRINKETS, newSheet, CELLS_RESERVATIONS_TRINKETS)

    function copyCells(sourceSheet, sourceCells, destSheet, destCells) {
        for (let cell in sourceCells) {
            let value = sourceSheet.getRange(sourceCells[cell]).getValue()
            destSheet.getRange(destCells[cell].MAX).setValue(value)
        }
    }
}

/**
 * Resets error messages on the reservation sheet when a row is edited (to clear the error messages)
 */
function updateReservationMessages(sheet, range, value){
    let sheetName = sheet.getName()

    if(sheetName !== "Raid Mains" && sheetName !== "Raid Alts" && sheetName !== "Raid Information") {
        let row = range.getRow()
        let col = range.getColumn()

        if(row > 7 && col > COLUMNS_RESERVATIONS.INDEX && col < COLUMNS_RESERVATIONS.NOTE){
            if (sheet.getRange(row, COLUMNS_RESERVATIONS.CHECKBOX).getFontColor().toUpperCase() === MESSAGE_COLORS.FAILURE){
                sendMessage(sheet, row, "", MESSAGE_WEIGHTS.DEFAULT, MESSAGE_COLORS.DEFAULT)
            }
        }
    }
}

/**
 * Handles reserving a spot when the reservation check-box is checked (or unchecked)
 * @param sheet
 * @param range
 * @param value
 */
function handleReservations(sheet, range, value){
    //Declared here so rest of function has scope on these variables instead of passing all the way down
    let sheetName = sheet.getName()
    let row = range.getRow()
    let col = range.getColumn()

    if(sheetName !== "Raid Mains" && sheetName !== "Raid Alts" && sheetName !== "Raid Information") {
        if (row > 7 && col === COLUMNS_RESERVATIONS.CHECKBOX) {
            //TODO: Remove hard-coded cell location
            let response
            let raidRoster = JSON.parse(sheet.getRange(CELLS_RESERVATIONS_JSON.RAID_ROSTER).getValue())
            let reservations = JSON.parse(sheet.getRange(CELLS_RESERVATIONS_JSON.RESERVATIONS).getValue())
            let buyer = {
                buyerName   : sheet.getRange(row, COLUMNS_RESERVATIONS.BUYER_NAME).getValue(),
                className   : sheet.getRange(row, COLUMNS_RESERVATIONS.CLASS).getValue().toUpperCase(),
                service     : sheet.getRange(row, COLUMNS_RESERVATIONS.SERVICE).getValue().toUpperCase(),
                funnels     : sheet.getRange(row, COLUMNS_RESERVATIONS.FUNNELS).getValue(),
                funnelType  : sheet.getRange(row, COLUMNS_RESERVATIONS.FUNNEL_TYPE).getValue().toUpperCase(),
                funnelOpt   : sheet.getRange(row, COLUMNS_RESERVATIONS.FUNNEL_OPTION).getValue().toUpperCase(),
            }

            //Determine if this is a reservation request, or a cancellation request
            if (range.isChecked()) {
                response = handleReservation(raidRoster, reservations, buyer)
            } else {
                response = handleCancellation(raidRoster, reservations, buyer)
            }

            //Send a message with the status of the reservation before updating the other data
            sendMessage(sheet, row, response.message, MESSAGE_WEIGHTS[response.status], MESSAGE_COLORS[response.status])

            //The response tells us if an update on the data needs to be done
            if (response.isUpdate){
                updateReservationSheet(raidRoster, reservations, response)
            } else {
                range.uncheck() //Uncheck reserved checkbox
            }
        }
    }

    function handleReservation(raidRoster, reservations, buyer){
        Logger.log("Handling reservation...")

        //Check that all required columns are properly filled
        switch (true){
            case !buyer.buyerName:
                return new ReservationResponse(false, MESSAGES.FAILURE, "Buyer name required")
            case !buyer.service:
                return new ReservationResponse(false, MESSAGES.FAILURE, "Service required")
            case (buyer.funnels > 0 && !buyer.funnelType):
                return new ReservationResponse(false, MESSAGES.FAILURE, "Funnel type required when funnels are selected")
            case (buyer.funnels > 0 && (buyer.funnelType === FUNNEL_TYPES.TRINKET || buyer.funnelType === FUNNEL_TYPES.WEAPON) && !buyer.funnelOpt):
                return new ReservationResponse(false, MESSAGES.FAILURE, "Funnel option required for trinket & weapon funnels")
        }

        //Is there a carry spot?
        if (isSpotAvailable()){
            //Is it a carry, or a funnel?
            if (buyer.funnels > 0){
                return reserveFunnel()
            }else{
                return reserveCarry()
            }
        } else {
            return new ReservationResponse (false, MESSAGES.FAILURE, "Not enough spots available")
        }

        /** Checks if a carry spot is available for the reservation request */
        function isSpotAvailable(){
            let availableCarries = sheet.getRange(CELLS_RESERVATIONS_BOSSES[buyer.service].AVAIL).getValue()
            return availableCarries > 0 ? true : false
        }

        /** Creates a funnel (+carry) reservation */
        function reserveFunnel(){
            switch(buyer.service){
                case FUNNEL_TYPES.ARMOR:
                    reserveArmorFunnel()
                    break;
                case FUNNEL_TYPES.WEAPON:
                    reserveWeaponFunnel()
                    break;
                case FUNNEL_TYPES.TRINKET:
                    reserveTrinketFunnel()
                    break;
                default:
                    sendMessage(sheet, row, "Error: Could not find funnel type; Please see admin", "bold", MESSAGE_COLORS.ERROR)
            }

            function reserveArmorFunnel(){
            }

            function reserveWeaponFunnel(){
            }

            function reserveTrinketFunnel(){
            }
        }

        /** Creates a carry reservation */
        function reserveCarry(){
            Logger.log("Reserving carry...")
            //Dont think this is needed since we already check if there's enough spots already
            /*let availableCarries = sheet.getRange(CELLS_RESERVATIONS_SERVICES[buyer.service].AVAIL).getValue()

            if (availableCarries > 0){*/
                let reservation = new Reservation(buyer.service, 0, null, null, buyer.buyerName, null);
                reservations.push(reservation)
                return new ReservationResponse(true, MESSAGES.SUCCESS, "Reserved")
            /*} else {
                return new ReservationResponse()
            }*/
        }
    }

    function handleCancellation(raidRoster, reservations, buyer){
        for (let index in reservations){
            let res = reservations[index]
            if (res.buyerName === buyer.buyerName && res.service === buyer.service){
                reservations.splice(index, 1)
                return new ReservationResponse(true, MESSAGES.DEFAULT, "Reservation removed")
            }
        }
        return new ReservationResponse(false, MESSAGES.ERROR, "Could not find reservation")
    }

    function updateReservationSheet(raidRoster, reservations){
        //No need to update raid roster, because no changes should ever be made (unless we put a new feature in to edit them mid-week)

        //Sort reservations by boss order so when they're displayed in the raid roster info, they're in the correct order
        reservations.sort(function(a, b){
            return BOSS_ORDER[a.service] - BOSS_ORDER[b.service]
        })
        sheet.getRange(CELLS_RESERVATIONS_JSON.RESERVATIONS).clearContent().setValue(JSON.stringify(reservations))

        let maxValues = getMaxValues(sheet, raidRoster, reservations)
        updateValues(CELLS_RESERVATIONS_BOSSES, maxValues.carries)
        updateValues(CELLS_RESERVATIONS_TRINKETS, maxValues.trinkets)
        updateValues(CELLS_RESERVATIONS_WEAPONS, maxValues.weaponTokens)

        updateRaidRosterInfo()

        function updateValues(rangeArray, values){
            for (const index in values){
                sheet.getRange(rangeArray[index].AVAIL).clearContent().setValue(values[index]);
            }
        }

        function updateRaidRosterInfo(){
            let row = 8 //First row in raid roster info
            let serviceCol = COLUMNS_RESERVATIONS.RAID_SERVICE
            let buyerCol = COLUMNS_RESERVATIONS.RAID_BUYER
            let boosterCol = COLUMNS_RESERVATIONS.RAID_BOOSTER

            sheet.getRange(row, serviceCol, sheet.getLastRow(), boosterCol - serviceCol +1).clearContent()

            for (let index in reservations){
                let reservation = reservations[index]
                sheet.getRange(row, serviceCol).setValue(toTitleCase(reservation.service))
                sheet.getRange(row, buyerCol).setValue(reservation.buyerName)

                for(let boosterIndex in reservation.boosters){
                    let booster = reservation.boosters[index]
                    sheet.getRange(row, boosterCol).setValue(booster)
                    row++
                }
                row++
            }
        }
    }
}


/** -- Helper functions -- **/

function toTitleCase(str){
    return str.length > 0 ? str.toLowerCase().split(" ").map(function(val){
        return val.replace(val[0], val[0].toUpperCase())
    }).join(" ") : ""
}

function arrayToTitleCase(strArray) {
    for (let str in strArray){
        strArray[str] = toTitleCase(strArray[str])
    }
    return strArray
}

function sendMessage(sheet, row, message, fontWeight, fontColor){
    sheet.getRange(row, COLUMNS_RESERVATIONS.STATUS).clearContent().setValue(message)
    sheet.getRange(row, COLUMNS_RESERVATIONS.SERVICE, 1, (COLUMNS_RESERVATIONS.STATUS - COLUMNS_RESERVATIONS.SERVICE + 1))
        .setFontWeight(fontWeight)
        .setFontColor(fontColor)
    sheet.getRange(row, COLUMNS_RESERVATIONS.CHECKBOX).setFontColor("#808080") //Change checkbox to be closer to original
}

function getMaxValues(sheet, raidRoster, reservations){
    let sheetName = sheet.getName();
    //let carryRange = (sheetName === "Raid Mains" || sheetName === "Raid Alts") ? CELLS_RAIDINFO_CARRIES : CELLS_RESERVATIONS_CARRIES
    //let carrySheet = (sheetName === "Raid Mains" || sheetName === "Raid Alts") ? "Raid Information" : null

    let maxValues = {
        carries      : getMaxCarries(),
        weaponTokens : getMaxWeaponTokens(),
        trinkets     : getMaxTrinkets(),
        armorTypes   : {},
        mainStats    : {},
        classNames   : {}
    }

    return maxValues

    function getMaxCarries(){
        let maxCarries = {}

        let carrySheet = (sheetName === "Raid Mains" || sheetName === "Raid Alts") ?
            SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Raid Information") : sheet
        let carryRange = (sheetName === "Raid Mains" || sheetName === "Raid Alts") ?
            CELLS_RAIDINFO_BOSSES : CELLS_RESERVATIONS_BOSSES

        for (let bossIndex in BOSSES){
            let maxCarry = carrySheet.getRange(carryRange[BOSSES[bossIndex]].MAX).getValue()
            if (maxCarry > 0) {
                for (let resIndex in reservations) {
                    let reservation = reservations[resIndex]
                    switch (reservation.service){
                        case SERVICES.FULL_CLEAR:
                            maxCarry--
                            break;
                        case SERVICES.LAST_WING:
                            if (
                                BOSSES[bossIndex] === SERVICES.SLUDGEFIST ||
                                BOSSES[bossIndex] === SERVICES.STONE_LEGION_GENERALS ||
                                BOSSES[bossIndex] === SERVICES.SIRE_DENATHRIUS
                            ){  maxCarry-- }
                            break;
                        default:
                            if (BOSSES[bossIndex] === reservations[resIndex].service) {
                                maxCarry--
                            }
                            break;
                    }
                }
            }
            maxCarries[BOSSES[bossIndex]] = maxCarry
        }
        Logger.log(maxCarries)
        return maxCarries
    }

    function getMaxWeaponTokens(){
        let maxWeaponTokens = {}

        for (let bossIndex in BOSSES){
            let boss = BOSSES[bossIndex]
            for (let tokenIndex in BOSS_WEAPONS[boss]){
                let token = BOSS_WEAPONS[boss][tokenIndex]
                if (token){
                    for (let playerIndex in raidRoster){
                        let player = raidRoster[playerIndex]

                        if (!isPlayerReserved(boss, player)){
                            if (isSpecAvailable(player) && isTokenLootable(token, boss, player)){
                                maxWeaponTokens[token] = maxWeaponTokens[token] + 1 || 1
                            }
                        }
                    }
                }
            }
        }

        /** The token is lootable if the player, or any of their alts, can loot the token from the specific boss */
        function isTokenLootable(token, boss, player){
            if (token === CLASS_TOKENS[player.playerClass]){
                return true
            } else {
                for (let altIndex in player.alts){
                    let alt = player.alts[altIndex]
                    if (token === CLASS_TOKENS[alt.playerClass]){
                        return true
                    }
                }
            }
            return false
        }

    }

    function getMaxTrinkets(){
        let maxTrinkets = {}

        for (let bossIndex in BOSSES){
            let boss = BOSSES[bossIndex]
            for (let trinketIndex in TRINKETS){
                let trinket = BOSS_TRINKETS[boss][trinketIndex]
                if (trinket){
                    for (let playerIndex in raidRoster){
                        let player = raidRoster[playerIndex]

                        if(!isPlayerReserved(boss, player)){
                            if (isTrinketLootable(trinket, boss, player)){

                            }
                        }
                    }
                }
            }
        }

        return maxTrinkets

        /** The trinket is lootable if the player, or any alts, can loot the trinket on any chosen spec */
        function isTrinketLootable(trinket, player){
            let playerTrinkets = getLootableTrinkets(player)


            for (let index in playerTrinkets){
                if (trinket === playerTrinkets[index]){
                    return true
                }
            }

            for (let altIndex in player.alts){
                let altTrinkets = getLootableTrinkets(player.alts[altIndex])
                for (let trinketIndex in altTrinkets){
                    if (trinket === altTrinkets[trinketIndex]){
                        return true
                    }
                }
            }

            return false

            function getLootableTrinkets(player){
                let trinkets = []
                for (let index in player.lootSpecs) {
                    if (player.lootSpecs[index]) {
                        let specTrinkets = SPEC_TRINKETS[CLASSES[player.playerClass]][index];

                        if (index && specTrinkets) {
                            specTrinkets.forEach(function (trinket) {
                                trinkets.push(trinket);
                            })
                        }
                    }
                }
                return trinkets;
            }
        }
    }

    /** ----Helpers for getMaxValues()---- */

    /** The player is reserved if their main, or any of their alts, match any of the reservations' booster lists.
     * Note that each booster in a reservation, even if they are an alt, will have a main name */
    function isPlayerReserved(boss, player){
        for (let index in reservations){
            let boosters = reservations[index].boosters

            switch (reservations.service){
                case SERVICES.FULL_CLEAR:
                    return isPlayerBooster(player, boosters)
                    break;
                case SERVICES.LAST_WING:
                    if (boss === SERVICES.SLUDGEFIST || boss == SERVICES.STONE_LEGION_GENERALS || boss == SERVICES.SIRE_DENATHRIUS){
                        return isPlayerBooster(player, boosters)
                    }
                    break;
                default:
                    if (boss === reservations.service) {
                        isPlayerBooster(player, boosters)
                    }
                    break;
            }
        }
        return false

        function isPlayerBooster(player, boosters){
            for (let index in boosters){
                if (boosters[index].mainName === player.playerName){
                    return true
                }
            }
        }
    }

    /** A spec is available if the player has at least one spec enabled of the three */
    function isSpecAvailable(player) {
        let specAvailable = false;
        for (let spec in player.lootSpecs) {
            if (player.lootSpecs[spec]) {
                specAvailable = true;
            }
        }
        return specAvailable;
    }

}