let properties = PropertiesService.getScriptProperties()

/**
 * onEdit event triggered by creating / updating / deleting a cell
 * @param event
 */
function onEdit(event){
    let sheet = event.source.getActiveSheet()
    let range = event.range
    let value = event.value

    //Raid info/roster/alts sheet updates
    updateRaidRosterSpecCheckboxes(sheet, range, value)
    updateRaidRoster(sheet, range)

    //Reservation sheet updates (the interactive part of the sheets that handle filtering mostly)
    updateReservationSpecDropdown(sheet, range, value)
    updateReservationServiceInfoDropdowns(sheet, range)

    //Reservations (creating, updating, deleting, and error messages)
    clearReservationMessages(sheet, range, value)
    checkReservationBuyerInfo(sheet, range, value)
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
 * When editing the raid mains & raid alts sheet, this method recreates the raid roster and updates the raid properties
 * (so the overall roster stats stay correct)
 * @param sheet The edited sheet (raid mains & raid alts)
 * @param range The range that's been edited
 */
function updateRaidRoster(sheet, range){
    if (sheet.getName() === "Raid Mains" || sheet.getName() === "Raid Alts"){
        let row = range.getRow()
        let col = range.getColumn()

        if (row > 4 && col < 13){
            let raidRoster = createRaidRoster()
            let maxValues = getMaxValues(sheet, raidRoster, [])

            //Sorts the raid roster by number of alts assigned to that raider
            raidRoster.sort(function(a, b){
                return a.alts.length - b.alts.length
            })

            //Add raidRoster to properties (must be present & sorted in case a new reservation sheet is made)
            properties.setProperty("raidRoster", JSON.stringify(raidRoster))

            updateProperties(maxValues)
        }
    }

    /**
     * Creates a raid roster ([]), which is a list of raid members (see the RaidMember class).
     * Each raid member consists of their: name, class, loot specs, and alts (which will also contain name/class/specs/main name)
     * @returns {[]} A raid roster, which is an array of RaidMembers.
     */
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

            if (playerName && playerClass && lootSpecs && available) {
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

    /**
     * Updates the cells that show the stats for the raid roster (on the raid information page), using the max values set in the maxValues() function.
     * @param maxValues
     */
    function updateProperties(maxValues){
        let raidInfoSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Raid Information")

        updateGridValues(CELLS_RAIDINFO_ARMORTYPES, maxValues.armorTypes)
        updateGridValues(CELLS_RAIDINFO_WEAPONS, maxValues.weaponTokens)
        updateValues(CELLS_RAIDINFO_TRINKETS, maxValues.trinkets)

        //Updates values that use a grid (armor types & weapons tokens)
        function updateGridValues(cellArray, values) {
            for (const boss in cellArray) {
                for (const funnelOpt in cellArray[boss]) {
                    let cell = raidInfoSheet.getRange(cellArray[boss][funnelOpt]).clearContent()
                    values[boss] ? (values[boss][funnelOpt] ? cell.setValue(values[boss][funnelOpt]) : null) : null
                }
            }
        }

        //Updates values that dont use a grid (just one row of values)
        function updateValues(cellArray, values) {
            for (const index in cellArray) {
                let cell = raidInfoSheet.getRange(cellArray[index]).clearContent()
                values[index] ? cell.setValue(values[index]) : null
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

    /**
     * Determines how other columns should be filtered when the "Service" column is edited
     * Ex, If funnel type is trinket, and Denathrius is chosen, change the funnel option to only show trinkets for Denathrius
     * @param cells
     * @param values
     */
    function handleService(cells, values) {
        if (values.service && !values.type /*implies !values.option*/ ){
            filter(cells.type, getFilteredTypes(values.service))
        } else if (values.service && values.type) {
            filter(cells.option, getFilteredOptionsWithService(values.service, values.type))
        } else if (!values.service && values.type && values.option) {
            filter(cells.option, getFilteredOptions(values.type))
            filter(cells.service, getFilteredServices(values.type, values.option))
        } else if (!values.service && values.type && !values.option){
            filter(cells.type, getAvailableFunnelTypes())
            filter(cells.option, getFilteredOptions(values.type))
        }
    }

    /**
     * Determines how other columns should be filtered if the "Type" column is edited
     * @param cells
     * @param values
     */
    function handleType(cells, values){
        if (!values.service && values.type){
            filter(cells.option, getFilteredOptions(values.type))
            filter(cells.service, getFilteredServices(values.type, null))
        } else if (values.service && values.type){
            filter(cells.option, getFilteredOptionsWithService(values.service, values.type))
        } else if (!values.type){
            filter(cells.service, Object.values(getAvailableServices()))
            cells.option.clearContent().clearDataValidations()
        }
    }

    /**
     * Determines how other columns should be filtered if the "Option" column is edited
     * @param cells
     * @param values
     */
    function handleOption(cells, values){
        Logger.log("Handling option...")
        if (!values.service && values.option){
            filter(cells.service, getFilteredServices(values.type, values.option))
        } else if (!values.option){
            filter(cells.service, Object.values(getAvailableServices()))
        }
    }

    /**
     * Returns a (filtered) list of what should be displayed in the "Service" column depending on the funnel type & option chosen
     * @param type
     * @param option
     * @returns {(string)[]|*[]}
     */
    function getFilteredServices(type, option){
        if (option) {
            switch (type) {
                case FUNNEL_TYPES.ARMOR:
                    return Object.values(getAvailableServices())
                case FUNNEL_TYPES.WEAPON:
                    for (let boss in BOSSES) {
                        if (SERVICES_AVAIL[boss]) {
                            for (let weapon in BOSS_WEAPONS[BOSSES[boss]]) {
                                if (option === BOSS_WEAPONS[BOSSES[boss]][weapon]) {
                                    return getAvailableServices().includes([BOSSES[BOSS_WEAPONS[BOSSES[boss]]]]) ? [BOSSES[BOSS_WEAPONS[BOSSES[boss]]]] : null
                                }
                            }
                        }
                    }
                    break
                case FUNNEL_TYPES.TRINKET:
                    for (let boss in BOSSES) {
                        if (SERVICES_AVAIL[boss]) {
                            for (let trinket in BOSS_TRINKETS[BOSSES[boss]]) {
                                if (option === BOSS_TRINKETS[BOSSES[boss]][trinket]) {
                                    return getAvailableServices().includes([BOSSES[boss]]) ? [BOSSES[boss]] : null //Break immediately since a trinket can only drop from one boss
                                }
                            }
                        }
                    }
                    break
            }
        } else {
            if (type === FUNNEL_TYPES.ARMOR){
                return [SERVICES.FULL_CLEAR]
            }
        }
    }

    /**
     * Returns a (filtered) list of what should be displayed in the "Type" column depending on the service chosen
     * @param service
     * @returns {string[]|(string)[]|(string)[]}
     */
    function getFilteredTypes(service){
        //If service is a bundle (ie, multiple bosses), you cannot book a trinket or weapon funnel
        if (BUNDLES.includes(service)){ //Only full clears can book funnels
            if (service === "FULL CLEAR") {
                return [FUNNEL_TYPES.ARMOR]
            } else {
                Logger.log("Here")
                return []
            }
        }
        //Otherwise, filter the service type by the boss (since some bosses dont drop weapon tokens, etc)
        for (let boss in BOSSES){
            if (service === BOSSES[boss]){
                let types = []
                for (let index in FUNNEL_TYPES_AVAIL){
                    if (FUNNEL_TYPES_AVAIL[index]){

                        switch (FUNNEL_TYPES[index]){
                            case FUNNEL_TYPES.WEAPON:
                                if (BOSS_WEAPONS[BOSSES[boss]].length > 0){
                                    types.push(FUNNEL_TYPES.WEAPON)
                                }
                                break
                            case FUNNEL_TYPES.TRINKET:
                                types.push(FUNNEL_TYPES.TRINKET) //This only works because every boss drops a trinket
                                break
                            case FUNNEL_TYPES.ARMOR:
                                types.push(FUNNEL_TYPES.ARMOR)
                                break
                        }
                    }
                }
                //If they have a weapon, return the weapon type, otherwise just return armor and trinket
                /*return BOSS_WEAPONS[BOSSES[boss]].length > 0 ?
                    [FUNNEL_TYPES.ARMOR, FUNNEL_TYPES.TRINKET, FUNNEL_TYPES.WEAPON] :
                    [FUNNEL_TYPES.ARMOR, FUNNEL_TYPES.TRINKET]*/
                return types
            }
        }
    }

    /**
     * Returns a (filtered) list of what should be displayed in the "Options" column depending on the funnel type chosen
     * @param type
     * @returns {(string)[]|(string)[]}
     */
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

    /**
     * Returns a (filtered) list of what should be displayed in the "Options" column based on both the funnel type,
     * and service type
     * @param service
     * @param type
     * @returns {*|(string)[]}
     */
    function getFilteredOptionsWithService(service, type){
        switch(service){
            case SERVICES.FULL_CLEAR:
            case SERVICES.LAST_WING:
            case SERVICES.LAST_TWO:
                //Return everything
                return Object.values(ARMOR_TYPES)
            default:
                //Filter funnel options on whichever boss & type is picked
                for (let boss in BOSSES){
                    if (service === BOSSES[boss]){
                        switch(type){
                            case FUNNEL_TYPES.ARMOR:
                                return Object.values(ARMOR_TYPES)
                            case FUNNEL_TYPES.WEAPON:
                                return BOSS_WEAPONS[BOSSES[boss]]
                            case FUNNEL_TYPES.TRINKET:
                                return BOSS_TRINKETS[BOSSES[boss]]
                        }
                    }
                }
                break;
        }
    }

    /**
     * Filters a given cell using the given values (only in a reservation spreadsheet)
     * @param cell
     * @param values
     */
    function filter(cell, values){
        Logger.log(values)
        if (cell && values && values.length) {
            let dataRule = SpreadsheetApp.newDataValidation().requireValueInList(arrayToTitleCase(values)).build()
            cell.setDataValidation(dataRule)
        } else if (cell){
            let dataRule = SpreadsheetApp.newDataValidation().requireValueInList(values).build()
            cell.setDataValidation(dataRule)
        }
    }

}

/**
 * In the reservation sheet, creates/updates/removes warning messages when the buyer class/spec doesnt match
 * the funnel information
 * @param sheet
 * @param range
 */
function checkReservationBuyerInfo(sheet, range, value){
    let sheetName = sheet.getName()
    if (sheetName !== "Raid Mains" && sheetName !== "Raid Alts" && sheetName !== "Raid Information"){
        let row = range.getRow()
        let col = range.getColumn()

        if (row > 7 && (
            col === COLUMNS_RESERVATIONS.SPEC ||
            col === COLUMNS_RESERVATIONS.SERVICE ||
            col === COLUMNS_RESERVATIONS.FUNNEL_TYPE ||
            col === COLUMNS_RESERVATIONS.FUNNEL_OPTION)) {

            let className = sheet.getRange(row, COLUMNS_RESERVATIONS.CLASS).getValue().toUpperCase()
            let spec = sheet.getRange(row, COLUMNS_RESERVATIONS.SPEC).getValue().toUpperCase()
            let service = sheet.getRange(row, COLUMNS_RESERVATIONS.SERVICE).getValue().toUpperCase()
            let funnels = sheet.getRange(row, COLUMNS_RESERVATIONS.FUNNELS).getValue()
            let funnelType = sheet.getRange(row, COLUMNS_RESERVATIONS.FUNNEL_TYPE).getValue().toUpperCase()
            let funnelOpt = sheet.getRange(row, COLUMNS_RESERVATIONS.FUNNEL_OPTION).getValue().toUpperCase()

            if (className && spec && service && funnelType && funnelOpt && funnels && funnels > 0){
                if (!isBuyerMatchingService(className, spec, service, funnelType, funnelOpt)){
                    sendMessage(sheet, row, "Warning: Buyer can't loot this",
                        MESSAGE_WEIGHTS.WARNING, MESSAGE_COLORS.WARNING)
                }
            }
        }
    }

    /** Checks if the buyer class/spec matches the funnel option they want to reserve (ex, trinket is useable, etc.) */
    function isBuyerMatchingService(className, spec, service, funnelType, funnelOpt){
        let isBuyerMatch = false
        switch(funnelType){
            case FUNNEL_TYPES.ARMOR:
                isBuyerMatch = (funnelOpt === CLASS_ARMORTYPES[className])
                break
            case FUNNEL_TYPES.WEAPON:
                isBuyerMatch = (funnelOpt === CLASS_TOKENS[className])
                break
            case FUNNEL_TYPES.TRINKET:
                isBuyerMatch = isBuyerTrinket(className, spec, funnelOpt)
                break
        }
        return isBuyerMatch

        /** Returns true if the buyer's class/spec matches the trinket they want to reserve (or false if it doesnt) */
        function isBuyerTrinket(buyerClass, buyerSpec, trinket){
            let isBuyerTrinket = false
            let trinkets = []

            Logger.log(SPECIALIZATIONS[CLASSES[buyerClass]])
            for (let index in SPECIALIZATIONS[CLASSES[buyerClass]]){
                if (buyerSpec === SPECIALIZATIONS[CLASSES[buyerClass]][index]){
                    trinkets = SPEC_TRINKETS[CLASSES[buyerClass]][index]
                    break
                }
            }

            for (let trinketIndex in trinkets){
                if (trinket === trinkets[trinketIndex]){
                    isBuyerTrinket = true
                    break
                }
            }

            return isBuyerTrinket
        }
    }
}

/**
 * Creates a sheet to book reservations
 */
function createReservationSheet(){
    let spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    let sheets = spreadsheet.getSheets()
    let templateSheet = spreadsheet.getSheetByName("Reservation Template")
    let raidInfoSheet = spreadsheet.getSheetByName("Raid Information")

    //For each spreadsheet, hide anything that isn't raid info, or roster
    for (let index in sheets){
        let sheetName = sheets[index].getSheetName()
        if (sheetName !== "Raid Information" && sheetName !== "Raid Mains" && sheetName !== "Raid Alts" && sheetName !== "Reservation Template"){
            if (index < 4){
                sheets[index].activate()
                spreadsheet.moveActiveSheet(5)
                sheets[index].hideSheet()
            } else if (index > 4){
                sheets[index].hideSheet()
            }
        }
    }

    //Create new sheet and get the sheet name from the raid info details
    let newSheet = templateSheet.copyTo(spreadsheet)
    let newSheetName = raidInfoSheet.getRange(CELLS_RAIDINFO_INFO.DATE).getDisplayValue()

    if (newSheetName && !spreadsheet.getSheetByName(newSheetName)) {
        newSheet.setName(newSheetName)
        newSheet.activate()
        spreadsheet.moveActiveSheet(1)
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
    copyGridCells(raidInfoSheet, CELLS_RAIDINFO_ARMORTYPES, newSheet, CELLS_RESERVATIONS_ARMORTYPES)
    //copyGridCells(raidInfoSheet, CELLS_RAIDINFO_WEAPONS, newSheet, CELLS_RESERVATIONS_WEAPONS)
    //copyCells(raidInfoSheet, CELLS_RAIDINFO_TRINKETS, newSheet, CELLS_RESERVATIONS_TRINKETS)

    /** Used to copy over values from the information sheet, to the (new) reservation sheet */
    function copyCells(sourceSheet, sourceCells, destSheet, destCells) {
        for (let cell in sourceCells) {
            let value = sourceSheet.getRange(sourceCells[cell]).getValue()
            destSheet.getRange(destCells[cell].MAX).setValue(value)
        }
    }

    /** Used to copy over values from the info sheet, to the (new) reservation sheet; Specifically the grid arrays
     * (Armor Types & Weapon Token grids) */
    function copyGridCells(sourceSheet, sourceCells, destSheet, destCells) {
        for (let row in sourceCells) {
            for (let col in sourceCells[row]) {
                let value = sourceSheet.getRange(sourceCells[row][col]).getValue()
                destSheet.getRange(destCells[row][col]).setValue(value)
            }
        }
    }
}

/**
 * Force updates the reservation sheet values (used for when something is changed, like max carries)
 */
function forceUpdateReservationValues() {
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
    let sheetName = sheet.getName()

    if (sheetName !== "Raid Mains" && sheetName !== "Raid Alts" && sheetName !== "Raid Information") {
        let raidRoster = JSON.parse(sheet.getRange(CELLS_RESERVATIONS_JSON.RAID_ROSTER).getValue())
        let reservations = JSON.parse(sheet.getRange(CELLS_RESERVATIONS_JSON.RESERVATIONS).getValue())

        updateReservationSheet(sheet, raidRoster, reservations)
    }
}

/**
 * Resets error messages on the reservation sheet when a row is edited (to clear the error messages)
 */
function clearReservationMessages(sheet, range, value){
    let sheetName = sheet.getName()

    if(sheetName !== "Raid Mains" && sheetName !== "Raid Alts" && sheetName !== "Raid Information") {
        let row = range.getRow()
        let col = range.getColumn()

        if(row > 7 && col > COLUMNS_RESERVATIONS.INDEX && col < COLUMNS_RESERVATIONS.NOTE){
            let fontColor = sheet.getRange(row, COLUMNS_RESERVATIONS.CHECKBOX).getFontColor().toUpperCase()
            if (fontColor === MESSAGE_COLORS.FAILURE || fontColor === MESSAGE_COLORS.WARNING){
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

    if (sheetName !== "Raid Mains" && sheetName !== "Raid Alts" && sheetName !== "Raid Information"){
        if (row > 7 && col === COLUMNS_RESERVATIONS.CHECKBOX) {
            //TODO: Remove hard-coded cell location
            let response
            let isReservation, isCancellation
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

            //If the response is to update the data, do so
            if (response.isUpdate){

                //Sort reservations by boss order so when they're displayed in the raid roster info, they're in the correct order
                reservations.sort(function(a, b){
                    return SERVICE_ORDER[a.service] - SERVICE_ORDER[b.service]
                })
                sheet.getRange(CELLS_RESERVATIONS_JSON.RESERVATIONS).clearContent().setValue(JSON.stringify(reservations))

                //Update the values in the reservation sheet
                updateReservationSheet(sheet, raidRoster, reservations, response)
            }

            //After updating data, send a message with the status of the reservation
            sendMessage(sheet, row, response.message, MESSAGE_WEIGHTS[response.status], MESSAGE_COLORS[response.status])

            //After sending the message, if there is no update then uncheck the checkbox
            if (!response.isUpdate){
                range.uncheck()
            }
        }

        /** Deprecated due to how sheets work; Can't really take permissions away or no script will work on those ranges */
        function lockRow(row) {
            let user = Session.getEffectiveUser()
            let range = sheet.getRange(row, COLUMNS_RESERVATIONS.SERVICE, 1, (COLUMNS_RESERVATIONS.NOTE - COLUMNS_RESERVATIONS.SERVICE + 1))
            let protection = sheet.getRange(row, COLUMNS_RESERVATIONS.SERVICE, 1, (COLUMNS_RESERVATIONS.NOTE - COLUMNS_RESERVATIONS.SERVICE + 1)).protect()
            protection.setDescription(sheet.getRange(row, COLUMNS_RESERVATIONS.INDEX).getValue()).removeEditor(user)
        }

        /** Deprecated due to how sheets work; See lockRow() */
        function unlockRow(row) {
            let user = Session.getEffectiveUser()
            let protection = sheet.getRange(row, COLUMNS_RESERVATIONS.SERVICE, 1, (COLUMNS_RESERVATIONS.NOTE - COLUMNS_RESERVATIONS.SERVICE + 1)).protect()

        }
    }

    /**
     * Begins the process of finding a reservation for a buyer by determining if they are looking for a carry or a funnel
     * @param raidRoster
     * @param reservations
     * @param buyer
     * @returns {ReservationResponse}
     */
    function handleReservation(raidRoster, reservations, buyer){

        //Check that all required columns are properly filled
        switch (true){
            case !buyer.buyerName:
                return new ReservationResponse(false, MESSAGES.FAILURE, "Buyer name missing")
            case !buyer.service:
                return new ReservationResponse(false, MESSAGES.FAILURE, "Service missing")
            case (buyer.funnels > 0 && !buyer.funnelType):
                return new ReservationResponse(false, MESSAGES.FAILURE, "Funnel type required for funnel")
            case (buyer.funnelType && !buyer.funnelOpt):
                return new ReservationResponse(false, MESSAGES.FAILURE, "Funnel option required for funnel")
            case (buyer.funnelType && buyer.funnelOpt && !buyer.funnels):
                return new ReservationResponse(false, MESSAGES.FAILURE, "Funnels must be greater than 0")
            case (buyer.service !== SERVICES.FULL_CLEAR && (buyer.funnelType !== null || buyer.funnelOpt !== null)):
                return new ReservationResponse(false, MESSAGES.FAILURE, "Funnels unavailable for this service")
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
            let availableCarries = sheet.getRange(CELLS_RESERVATIONS_SERVICES[buyer.service].AVAIL).getValue()
            return availableCarries > 0 ? true : false
        }

        /**
         * Attempts to reserve a funnel for the buyer by trying to match each funnel that they want (eg, 1, 2, 3, or 4)
         * to a relevant buyer based on what they want a funnel for (eg, armor, trinket, or weapon token)
         * @returns {ReservationResponse}
         */
        function reserveFunnel(){
            Logger.log("Handling funnel reservation...")
            let boosters = []
            let matches = []

            for (let i = 0; i < buyer.funnels; i++){
                for (let playerIndex in raidRoster){
                    let player = raidRoster[playerIndex]

                    /* If the raider is not assigned to a previous funnel slot (1, 2, 3, or 4) and
                     isn't currently reserved, then we can see if they match the buyer's criteria */
                    if (!isPlayerMatched(player, matches) && !isPlayerReserved(reservations, buyer.service, player)){
                        let booster
                        switch(buyer.funnelType){
                            case FUNNEL_TYPES.ARMOR:
                                booster = getArmorLootable(buyer.funnelOpt, player)
                                break
                            case FUNNEL_TYPES.WEAPON:
                                booster = getTokenLootable(buyer.funnelOpt, buyer.service, player)
                                break
                            case FUNNEL_TYPES.TRINKET:
                                booster = getTrinketLootable(buyer.funnelOpt, player)
                                break
                        }

                        if(booster){
                            boosters.push(new Booster(booster.playerName, player.playerName))
                            matches.push(player.playerName)
                            break
                        }
                    }
                }
            }

            // If we have found enough boosters for the buyer (eg, buyer asks for 4 and we found 4), then create a new reservation
            if (buyer.funnels === boosters.length){
                reservations.push(new Reservation(
                    buyer.service,
                    buyer.funnels,
                    buyer.funnelType,
                    buyer.funnelOpt,
                    buyer.buyerName,
                    boosters))
                return new ReservationResponse(true, MESSAGES.SUCCESS, "Funnels reserved")
            } else {
                return new ReservationResponse(false, MESSAGES.FAILURE, "Not enough boosters found")
            }

            /**
             * Checks if the player is currently matched (eg, a buyer wants four funnels, and we're looking for a 4th, is this person part of the first 3?)
             * @param player
             * @param matches
             * @returns {boolean}
             */
            function isPlayerMatched(player, matches){
                for (let matchIndex in matches){
                    if (player.playerName === matches[matchIndex]){
                        return true
                    }
                }
                return false
            }
        }

        /**
         * Attempts to create a carry reservation (much easier than the funnel, mostly
         * @returns {ReservationResponse}
         */
        function reserveCarry(){
            Logger.log("Handling carry reservation...")
            let reservation = new Reservation(buyer.service, 0, null, null, buyer.buyerName, null);
            reservations.push(reservation)
            return new ReservationResponse(true, MESSAGES.SUCCESS, "Reserved")
        }
    }

    /**
     * Attempts to remove the buyer from the reservations list, freeing up the raider
     * @param raidRoster TODO: Might not be needed?
     * @param reservations
     * @param buyer
     * @returns {ReservationResponse}
     */
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
}

/**
 * Updates the reservation sheets retrieving the current max values for each category, and then updating the cells
 * @param raidRoster
 * @param reservations
 */
function updateReservationSheet(sheet, raidRoster, reservations){

    //Get max values, and update the value cells on the left of the reservations sheet
    let maxValues = getMaxValues(sheet, raidRoster, reservations)
    updateValues(CELLS_RESERVATIONS_BOSSES, maxValues.carries)
    updateGridValues(CELLS_RESERVATIONS_ARMORTYPES, maxValues.armorTypes)
    //updateGridValues(CELLS_RESERVATIONS_WEAPONS, maxValues.weaponTokens)
    //updateValues(CELLS_RESERVATIONS_TRINKETS, maxValues.trinkets)

    //Update the service/buyer/funnelers area on the far right (used for raids to know who their funnelers are that week)
    updateRaidRosterInfo()

    /**
     * Updates values that use a grid (armor types & weapons tokens)
     * @param cellArray
     * @param values
     */
    function updateGridValues(cellArray, values) {
        for (const boss in cellArray) {
            for (const funnelOpt in cellArray[boss]) {
                let cell = sheet.getRange(cellArray[boss][funnelOpt]).clearContent()
                values[boss][funnelOpt] ? cell.setValue(values[boss][funnelOpt]) : cell.setValue("0")
            }
        }
    }

    /**
     * Updates values that dont use a grid (just one row of values)
     * @param cellArray
     * @param values
     */
    function updateValues(cellArray, values) {
        for (const index in cellArray) {
            let cell = sheet.getRange(cellArray[index].AVAIL).clearContent()
            values[index] ? cell.setValue(values[index]) : cell.setValue("0")
        }
    }

    /**
     * Update the area on the far right of the reservation sheets, displaying the buyers & their funnelers
     * (used for raids to know who their funnelers are that week)
     */
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
                let booster = reservation.boosters[boosterIndex]
                sheet.getRange(row, boosterCol).setValue(booster.boosterName)
                row++
            }
            if(!reservation.boosters) {
                row++
            }
        }
    }
}

/** -- Helper functions -- **/

function toTitleCase(str){
    return str.length > 0 ? str.toLowerCase().split(" ").map(function (val) {
        return val.replace(val[0], val[0].toUpperCase())
    }).join(" ") : ""
}

function arrayToTitleCase(strArray) {
    for (let str in strArray){
        strArray[str] = toTitleCase(strArray[str])
    }
    return strArray
}

/**
 * Sends a message on the given row to the status column
 * @param sheet sheet to send the message to
 * @param row row to send the message to (the column is always the status column)
 * @param message message to send
 * @param fontWeight font weight (either normal or bold)
 * @param fontColor font color (constants are declared in the constants.js page)
 */
function sendMessage(sheet, row, message, fontWeight, fontColor){
    sheet.getRange(row, COLUMNS_RESERVATIONS.STATUS).clearContent().setValue(message)
    sheet.getRange(row, COLUMNS_RESERVATIONS.SERVICE, 1, (COLUMNS_RESERVATIONS.STATUS - COLUMNS_RESERVATIONS.SERVICE + 1))
        .setFontWeight(fontWeight)
        .setFontColor(fontColor)
    //Change checkbox to be closer to original grey if returning to default
    if (fontWeight === MESSAGE_WEIGHTS.DEFAULT) {
        sheet.getRange(row, COLUMNS_RESERVATIONS.CHECKBOX).setFontColor("#808080")
    }
}

/**
 * A giant function to determine what the current maximum values, using the raid roster, and the reservations,
 * across all bosses, for each category:
 *  - Maximum of each armor type
 *  - Maximum of each trinket
 *  - Maximum of each weapon token
 * @param sheet
 * @param raidRoster
 * @param reservations
 * @returns {{carries: {}, mainStats: {}, trinkets: {}, classNames: {}, armorTypes: {}, weaponTokens: {}}}
 */
function getMaxValues(sheet, raidRoster, reservations){
    let sheetName = sheet.getName();

    Logger.log("Getting max values for " + JSON.stringify(raidRoster))

    let maxValues = {
        carries      : getMaxCarries(),
        weaponTokens : getMaxWeaponTokens(),
        trinkets     : getMaxTrinkets(),
        armorTypes   : getMaxArmorTypes(),
        mainStats    : {},
        classNames   : {}
    }

    return maxValues

    function getMaxCarries(){
        let maxCarries = {}

        let carrySheet = (sheetName === "Raid Mains" || sheetName === "Raid Alts") ?
            SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Raid Information") : sheet

        for (let serviceIndex in SERVICES){
            let service = SERVICES[serviceIndex]

            Logger.log("Service: " + serviceIndex + " Available: " + SERVICES_AVAIL[service])
            if (SERVICES_AVAIL[serviceIndex]){
                let maxCarry = (sheetName === "Raid Mains" || sheetName === "Raid Alts") ?
                    carrySheet.getRange(CELLS_RAIDINFO_BOSSES[service]).getValue() :
                    carrySheet.getRange(CELLS_RESERVATIONS_BOSSES[service].MAX).getValue()

                Logger.log("For " + service + "...")

                if (maxCarry > 0) {
                    for (let resIndex in reservations){
                        let reservation = reservations[resIndex]

                        Logger.log("Checking " + reservation.service + "...")
                        if (service === reservation.service){
                            maxCarry--

                            Logger.log("Reservation matches service. New available is " + maxCarry)
                        }
                    }
                }

                maxCarries[service] = maxCarry
            }
        }

        Logger.log("---MAX CARRIES---")
        Logger.log(maxCarries)
        return maxCarries
    }

    function getMaxWeaponTokens(){
        let maxWeaponTokens = {}

        for (let bossIndex in BOSSES){
            let boss = BOSSES[bossIndex]
            maxWeaponTokens[boss] = {}

            for (let tokenIndex in BOSS_WEAPONS[boss]){
                let token = BOSS_WEAPONS[boss][tokenIndex]
                if (token){
                    for (let playerIndex in raidRoster){
                        let player = raidRoster[playerIndex]

                        if (!isPlayerReserved(reservations, boss, player)){
                            if (isSpecAvailable(player) && isTokenLootable(token, boss, player)){
                                maxWeaponTokens[boss][token] = maxWeaponTokens[boss][token] + 1 || 1
                            }
                        }
                    }
                }
            }
        }
        Logger.log("---MAX TOKENS---")
        Logger.log(maxWeaponTokens)
        return maxWeaponTokens
    }

    function getMaxTrinkets(){
        let maxTrinkets = {}

        //For each boss
        for (let bossIndex in BOSSES) {
            let boss = BOSSES[bossIndex]

            //For each trinket on that boss
            for (let trinketIndex in BOSS_TRINKETS[boss]){
                let trinket = BOSS_TRINKETS[boss][trinketIndex]
                if (trinket){
                    //For each raider/player
                    for (let playerIndex in raidRoster){
                        let player = raidRoster[playerIndex]

                        if (!isPlayerReserved(reservations, boss, player)){
                            if (isTrinketLootable(trinket, player)){
                                maxTrinkets[trinket] = maxTrinkets[trinket] + 1 || 1
                            }
                        }
                    }
                }
            }
        }
        Logger.log("---MAX TRINKETS---")
        Logger.log(maxTrinkets)
        return maxTrinkets
    }

    function getMaxArmorTypes() {
        let maxArmorTypes = {}
        let armorAdded = false

        //For each boss
        for (let bossIndex in BOSSES) {
            let boss = BOSSES[bossIndex]
            maxArmorTypes[boss] = {}

            //For each armor type
            for (let armorIndex in ARMOR_TYPES) {
                let armorType = ARMOR_TYPES[armorIndex]

                //For each raider/player
                for (let playerIndex in raidRoster) {
                    let player = raidRoster[playerIndex]

                    if (!isPlayerReserved(reservations, boss, player)) {
                        if (isSpecAvailable(player) && isArmorLootable(ARMOR_TYPES[armorIndex], player)) {
                            maxArmorTypes[boss][armorType] = maxArmorTypes[boss][armorType] + 1 || 1
                        }
                    }
                }
            }
        }

        Logger.log("---MAX ARMOR TYPES---")
        Logger.log(maxArmorTypes)
        return maxArmorTypes
    }
}

/** The player is reserved if their main, or any of their alts, match any of the reservations' booster lists.
 * Note that each booster in a reservation, even if they are an alt, will have a main name */
function isPlayerReserved(reservations, boss, player){
    let isBooster = false

    for (let reservation of reservations){

        if (BUNDLES.includes(boss)) {
            //Check if the boss is a full clear or bundle
            switch (boss) {
                case SERVICES.FULL_CLEAR:
                    isBooster = isPlayerBooster(player, reservation.boosters)
                    break;
                case SERVICES.LAST_WING:
                    if (reservation.service === SERVICES.SLUDGEFIST || reservation.service === SERVICES.STONE_LEGION_GENERALS || reservation.service === SERVICES.SIRE_DENATHRIUS) {
                        isBooster = isPlayerBooster(player, reservation.boosters)
                    }
                    break;
                case SERVICES.LAST_TWO:
                    if (reservation.service === SERVICES.STONE_LEGION_GENERALS || reservation.service === SERVICES.SIRE_DENATHRIUS){
                        isBooster = isPlayerBooster(player, reservation.boosters)
                    }
                    break
            }
        } else {
            //Check if the reservation matches the boss, or is a full clear or other bundle
            switch (reservation.service){
                case SERVICES.FULL_CLEAR:
                    isBooster = isPlayerBooster(player, reservation.boosters)
                    break;
                case SERVICES.LAST_WING:
                    if (boss === SERVICES.SLUDGEFIST || boss === SERVICES.STONE_LEGION_GENERALS || boss === SERVICES.SIRE_DENATHRIUS){
                        isBooster = isPlayerBooster(player, reservation.boosters)
                    }
                    break;
                case SERVICES.LAST_TWO:
                    if (boss === SERVICES.STONE_LEGION_GENERALS || boss === SERVICES.SIRE_DENATHRIUS){
                        isBooster = isPlayerBooster(player, reservation.boosters)
                    }
                    break
                case boss:
                    isBooster = isPlayerBooster(player, reservation.boosters)
                    break;
            }
        }

        if (isBooster){
            break;
        }
    }

    return isBooster

    function isPlayerBooster(player, boosters){
        for (let index in boosters){
            if (boosters[index].mainName === player.playerName){
                return true
            }
        }
        return false
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

function isArmorLootable(armorType, player) {
    let filteredPlayer = getArmorLootable(armorType, player)
    return (typeof filteredPlayer === 'object' && filteredPlayer !== null)
}

function isTokenLootable(token, boss, player) {
    let filteredPlayer = getTokenLootable(token, boss, player)
    return (typeof filteredPlayer === 'object' && filteredPlayer !== null)
}

function isTrinketLootable(trinket, player) {
    let filteredPlayer = getTrinketLootable(trinket, player)
    return (typeof filteredPlayer === 'object' && filteredPlayer !== null)
}

/** Armor is lootable if the player, or any alts, are of that armor class */
function getArmorLootable(armorType, player) {
    if (armorType === CLASS_ARMORTYPES[player.playerClass]){
        return player
    } else {
        for (let altIndex in player.alts){
            if (armorType === CLASS_ARMORTYPES[player.alts[altIndex].playerClass]){
                return player.alts[altIndex]
            }
        }
    }
    return null
}

/** Token is lootable if the player, or any of their alts, can loot the token from the specific boss */
function getTokenLootable(token, boss, player){
    if (token === CLASS_TOKENS[player.playerClass]){
        return player
    } else {
        for (let altIndex in player.alts){
            let alt = player.alts[altIndex]
            if (alt.available && token === CLASS_TOKENS[alt.playerClass]){
                return alt
            }
        }
    }
    return null
}

/** Trinket is lootable if the player, or any alts, can loot the trinket on any chosen spec */
function getTrinketLootable(trinket, player){
    let playerTrinkets = getLootableTrinkets(player)

    //Check player
    for (let index in playerTrinkets){
        if (trinket === playerTrinkets[index]){
            return player
        }
    }
    //If player cant loot trinket, check each alt
    for (let altIndex in player.alts){
        let alt = player.alts[altIndex]
        let altTrinkets = getLootableTrinkets(alt)
        for (let trinketIndex in altTrinkets){
            if (alt.available && trinket === altTrinkets[trinketIndex]){
                return alt
            }
        }
    }

    return null

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

/**
 * Gets services that are available for this sheet (ex, heroic only has full clear, last wing, and last two
 */
function getAvailableServices() {
    return getAvailable(SERVICES, SERVICES_AVAIL)
}

function getAvailableFunnelTypes() {
    return getAvailable(FUNNEL_TYPES, FUNNEL_TYPES_AVAIL)
}

function getAvailable(fullList, filteredLIst) {
    let list = []
    for (let index in filteredLIst){
        if (filteredLIst[index]){
            list.push(fullList[index])
        }
    }
    return list
}