let properties = PropertiesService.getScriptProperties();

function onEdit(event) {
    let sheet = event.source.getActiveSheet();
    let range = event.range;
    let value = event.value;

    //Raid info/roster/alts sheet updates
    updateRaidRosterSpecCheckboxes(sheet, range, value);
    updateRaidRoster(sheet, range);

    //Reservation sheet updates
    updateReservationSpecDropdown(sheet, range, value);
    updateReservationFunnelDropdown(sheet, range, value);

    //Reservation sheet validation
    checkReservation(sheet, range, value);
}

function updateRaidRosterSpecCheckboxes(sheet, range, value) {
    if (sheet.getName() === "Raid Mains" || sheet.getName() === "Raid Alts") {
        let classColumn = getColumnByName(sheet, 4, "Class");
        let row = range.getRow();
        let col = range.getColumn();

        if (row > 4 && col === classColumn) {
            sheet.getRange(row, col+1, 1, 8).clearContent().removeCheckboxes();

            if (value) {
                let specNameCells = [col + 2, col + 4, col + 6, col + 8];
                let specNames = SPECIALIZATIONS[CLASSES[value.toUpperCase()]];

                for (let index in specNames) {
                    let specName = specNames[index];
                    sheet.getRange(row, specNameCells[index]).setValue(toTitleCase(specName));
                    sheet.getRange(row, specNameCells[index] - 1).insertCheckboxes();
                }
            }
        }
    }
}

function updateRaidRoster(sheet, range) {
    if (sheet.getName() === "Raid Mains" || sheet.getName() === "Raid Alts") {
        let row = range.getRow();
        let col = range.getColumn();

        if (row > 4 && col < 13) {
            let raidRoster = createRaidRoster();

            raidRoster.sort(function(a, b) {
                return a.alts.length - b.alts.length;
            })

            updateProperties(raidRoster);
        }
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

        if (main && main.available && available && altName && altClass && lootSpecs) {
            main.addAlt(altName, altClass.toUpperCase(), lootSpecs, available);
        }
    }

    function getMainByName(name) {
        for (let index in raidRoster) {
            if (raidRoster[index].playerName() === name) {
                return raidRoster[index];
            }
        }
    }

    return raidRoster;
}

function updateProperties(raidRoster) {
    let raidInfoSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Raid Information");
    let maxValues = getMaxValues(raidRoster);

    //Clear values
    clearValues(CELLS_RAIDINFO_ARMORTYPES);
    clearValues(CELLS_RAIDINFO_MAINSTATS);
    clearValues(CELLS_RAIDINFO_CLASSES);
    clearValues(CELLS_RAIDINFO_WEAPONS);
    clearValues(CELLS_RAIDINFO_TRINKETS);

    //Update values
    updateValues(maxValues.maxArmorTypes, CELLS_RAIDINFO_ARMORTYPES);
    updateValues(maxValues.maxMainStats, CELLS_RAIDINFO_MAINSTATS);
    updateValues(maxValues.maxWeaponTokens, CELLS_RAIDINFO_WEAPONS);
    updateValues(maxValues.maxTrinkets, CELLS_RAIDINFO_TRINKETS);
    updateValues(maxValues.maxClassNames, CELLS_RAIDINFO_CLASSES);

    //Add raidRoster to properties (must be present in case a new reservation sheet is made)
    properties.setProperty("raidRoster", JSON.stringify(raidRoster));

    function clearValues(rangeArray) {
        for (const cell in rangeArray) {
            raidInfoSheet.getRange(rangeArray[cell]).clearContent();
        }
    }

    function updateValues(values, rangeArray) {
        for (const value in values) {
            raidInfoSheet.getRange(rangeArray[value]).setValue(values[value]);
        }
    }
}

function updateReservationSpecDropdown(sheet, range, value) {
    let sheetName = sheet.getName()
    if (sheetName !== "Raid Mains" && sheetName !== "Raid Alts" && sheetName !== "Raid Information") {
        let row = range.getRow();
        let col = range.getColumn();

        if (row > 7 && col === COLUMNS_RESERVATIONS.CLASS) {
            let specCell = sheet.getRange(row, COLUMNS_RESERVATIONS.SPEC).clearContent().clearDataValidations();
            let specNames = SPECIALIZATIONS[CLASSES[value.toUpperCase()]];
            if (specNames) {
                let dataRule = SpreadsheetApp.newDataValidation().requireValueInList(arrayToTitleCase(specNames)).build();
                specCell.setDataValidation(dataRule);
            }
        }
    }
}

function updateReservationFunnelDropdown(sheet, range, value) {
    let sheetName = sheet.getName()
    if (sheetName !== "Raid Mains" && sheetName !== "Raid Alts" && sheetName !== "Raid Information") {
        let row = range.getRow();
        let col = range.getColumn();

        if (row > 7 && col === COLUMNS_RESERVATIONS.FUNNEL_TYPE) {
            let funnelOptionCell = sheet.getRange(row, COLUMNS_RESERVATIONS.FUNNEL_OPTION).clearContent().clearDataValidations();
            let funnelOptions = []

            if (value === "Weapon Funnel") {
                for (let token in TOKENS) {
                    funnelOptions.push(TOKENS[token]);
                }
            } else if (value === "Trinket Funnel") {
                for (let trinket in TRINKETS) {
                    funnelOptions.push(TRINKETS[trinket]);
                }
            }

            if (funnelOptions && funnelOptions.length) {
                let dataRule = SpreadsheetApp.newDataValidation().requireValueInList(arrayToTitleCase(funnelOptions)).build();
                funnelOptionCell.setDataValidation(dataRule);
            }
        }
    }
}

function checkReservation(sheet, range, value) {
    let sheetName = sheet.getName();

    if(sheetName !== "Raid Mains" && sheetName !== "Raid Alts" && sheetName !== "Raid Information") {
        let row = range.getRow();
        let col = range.getColumn();

        if (row > 7 && col === COLUMNS_RESERVATIONS.CHECKBOX && range.isChecked()) {
            let raidRoster  = JSON.parse(sheet.getRange("A1").getValue());
            let buyer = {
                buyerName   : sheet.getRange(row, COLUMNS_RESERVATIONS.BUYER_NAME).getValue(),
                className   : sheet.getRange(row, COLUMNS_RESERVATIONS.CLASS).getValue().toUpperCase(),
                service     : sheet.getRange(row, COLUMNS_RESERVATIONS.SERVICE).getValue().toUpperCase(),
                funnels     : sheet.getRange(row, COLUMNS_RESERVATIONS.FUNNELS).getValue(),
                funnelType  : sheet.getRange(row, COLUMNS_RESERVATIONS.FUNNEL_TYPE).getValue().toUpperCase(),
                funnelOpt   : sheet.getRange(row, COLUMNS_RESERVATIONS.FUNNEL_OPTION).getValue().toUpperCase(),
            }

            /** Checks if a carry is available, then determines if regular service or a funnel service */
            if (isCarryAvailable(sheet, buyer)) {
                switch (true) {
                    case buyer.funnels > 0:
                        reserveFunnel(sheet, raidRoster, buyer);
                        break;
                    case buyer.funnels === 0:
                        reserveCarry(buyer);
                        break;
                }
            } else {
                Logger.log("Not enough carry spots are available!")
            }
        }
    }

    /** Checks if a carry spot is available */
    function isCarryAvailable(sheet, buyer) {
        for (let bossName in CELLS_RESERVATIONS_CARRIES) {
            if (buyer.service === bossName) {
                let carriesAvail = sheet.getRange(CELLS_RESERVATIONS_CARRIES[bossName].AVAIL).getValue();
                return carriesAvail > 0;
            }
        }
    }

    /** Checks if a funnel spot is available */
    function isFunnelAvailable(sheet, buyer) {
        for (let bossName in CELLS_RESERVATIONS_FUNNELS) {
            if (buyer.service === bossName) {
                let funnelsAvail = sheet.getRange(CELLS_RESERVATIONS_FUNNELS[bossName].AVAIL).getValue();
                return funnelsAvail >= buyer.funnels;
            }
        }
    }

    /** Reserves a carry by decreasing the number of available carries (for the service selected) */
    function reserveCarry(buyer) {
        let carriesAvail = sheet.getRange(CELLS_RESERVATIONS_CARRIES[buyer.service].AVAIL).getValue();
        sheet.getRange(CELLS_RESERVATIONS_CARRIES[buyer.service].AVAIL).clearContent().setValue(carriesAvail - 1);
    }

    function reserveFunnel(sheet, raidRoster, buyer) {
        if (isFunnelAvailable(sheet, buyer)) {
            let matches = [];

            //For each funnel
            for (let num = 0; num < buyer.funnels; num++) {
                let funnelFound = false;

                //For each raid member (while funnel not found)
                for (let index = 0; (index < raidRoster.length && !funnelFound); index++){
                    let player = raidRoster[index];
                    let alts = player.alts

                    //If player is available, does not have a buyer (or alts with a buyer), and has not already been matched (or has alts matched)
                    if (player.available && !hasBuyer(player) && !isMatched(matches, index)) {
                        if (isMatch(player, buyer)) {
                            Logger.log(player.playerName)
                            funnelFound = true;
                            matches.push({mainIndex : index, altIndex : -1})
                        } else {
                            for (let altIndex = 0; (altIndex < alts.length && !funnelFound); altIndex++) {
                                let alt = alts[altIndex];
                                if (alt.available) {
                                    if (isMatch(alt, buyer)) {
                                        Logger.log(alt.playerName + " " + index + " " + altIndex)
                                        funnelFound = true;
                                        matches.push({mainIndex: index, altIndex: altIndex});
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (matches.length === buyer.funnels) {
                Logger.log("Found funnels! Pairing up boosters with " + buyer.buyerName + " for " + buyer.funnels + " " + buyer.funnelType)
                updateData(sheet, raidRoster, matches, buyer);
            } else {
                Logger.log("Funnel spots are available, but not enough boosters meet the criteria!")
            }

        } else {
            Logger.log("Not enough funnel spots available!")
        }

        function isMatched(matches, index) {
            let isMatched = false;
            matches.forEach(function (match) {
                if (match.mainIndex === index) {
                    isMatched = true;
                }
            });
            return isMatched;
        }

        function updateData(sheet, raidRoster, matches, buyer) {
            //Update buyerName in raidRoster data
            matches.forEach(function (match) {
                if (match.altIndex >= 0) {
                    raidRoster[match.mainIndex].alts[match.altIndex].buyerName = buyer.buyerName;
                } else {
                    raidRoster[match.mainIndex].buyerName = buyer.buyerName;
                }
            })

            //Update max values (and raidRoster cell...)
            updateAvailableValues(sheet, raidRoster, buyer);

        }
    }

    function updateAvailableValues(sheet, raidRoster, buyer) {
        let availableValues = getMaxValues(raidRoster);
        Logger.log(raidRoster)
        Logger.log(availableValues.maxArmorTypes)

        //Update carry & funnel cells
        let carryCell = CELLS_RESERVATIONS_CARRIES[buyer.service].AVAIL;
        let funnelCell = CELLS_RESERVATIONS_FUNNELS[buyer.service].AVAIL;
        let carryValue = sheet.getRange(carryCell).getValue();
        let funnelValue = sheet.getRange(funnelCell).getValue();
        sheet.getRange(carryCell).clearContent().setValue(carryValue - 1);
        sheet.getRange(funnelCell).clearContent().setValue(funnelValue - buyer.funnels);

        //Clear old values
        clearValues(CELLS_RESERVATIONS_ARMORTYPES);
        clearValues(CELLS_RESERVATIONS_MAINSTATS);
        clearValues(CELLS_RESERVATIONS_WEAPONS);
        clearValues(CELLS_RESERVATIONS_TRINKETS);

        //Update values
        updateValues(availableValues.maxArmorTypes, CELLS_RESERVATIONS_ARMORTYPES);
        updateValues(availableValues.maxMainStats, CELLS_RESERVATIONS_MAINSTATS);
        updateValues(availableValues.maxWeaponTokens, CELLS_RESERVATIONS_WEAPONS);
        updateValues(availableValues.maxTrinkets, CELLS_RESERVATIONS_TRINKETS);

        if (raidRoster) {
            sheet.getRange("A1").clearContent().setValue(JSON.stringify(raidRoster));
        }

        function clearValues(rangeArray) {
            for (const cell in rangeArray) {
                sheet.getRange(rangeArray[cell].AVAIL).clearContent();
            }
        }

        function updateValues(values, rangeArray) {
            for (const value in values) {
                sheet.getRange(rangeArray[value].AVAIL).setValue(values[value]);
            }
        }
    }

    /** Matches a player to a buyer */
    function isMatch (player, buyer) {
        switch (buyer.funnelType) {
            case FUNNEL_TYPES.ARMOR:
                if (CLASS_ARMORTYPES[player.playerClass] === CLASS_ARMORTYPES[buyer.className]) {
                    return true;
                }
                break;

            case FUNNEL_TYPES.CLASS:
                if (player.playerClass === buyer.className) {
                    return true;
                }
                break;

            case FUNNEL_TYPES.WEAPON:
                if (CLASS_TOKENS[player.playerClass] === CLASS_TOKENS[buyer.className]) {
                    return true;
                }
                break;

            case FUNNEL_TYPES.TRINKET:
                let trinket = buyer.funnelOpt;
                for (let index in player.lootSpecs) {
                    if (player.lootSpecs[index]) {
                        if (TRINKET_SPECS[trinket][CLASSES[player.playerClass]][index] === true){
                            return true;
                        }
                    }
                }
                break;
        }
        return false;
    }

    /** Returns true if a player can loot a trinket for the spec specified */
    function canLootTrinket(player, index, trinket) {
        Logger.log(player.className + " " + TRINKET_SPECS[trinket][CLASSES[player.playerClass]][index])
        return TRINKET_SPECS[trinket][CLASSES[player.playerClass]][index];
    }
}

function createReservationSheet() {
    let spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let templateSheet = spreadsheet.getSheetByName("Reservation Template");
    let raidInfoSheet = spreadsheet.getSheetByName("Raid Information");

    let newSheet = templateSheet.copyTo(spreadsheet);
    let newSheetName = raidInfoSheet.getRange(CELLS_RESERVATIONS_INFO.DATE).getDisplayValue();

    if (newSheetName && !spreadsheet.getSheetByName(newSheetName)) {
        newSheet.setName(newSheetName);
        newSheet.activate();
        spreadsheet.moveActiveSheet(5);
    }

    let raidRoster = properties.getProperty("raidRoster");
    Logger.log(raidRoster);

    if (raidRoster) {
        newSheet.getRange("A1").clearContent().setValue(raidRoster);
    }

    //Currently not copying class data; too much clutter
    copyCells(raidInfoSheet, CELLS_RAIDINFO_CARRIES, newSheet, CELLS_RESERVATIONS_CARRIES);
    copyCells(raidInfoSheet, CELLS_RAIDINFO_FUNNELS, newSheet, CELLS_RESERVATIONS_FUNNELS);
    copyCells(raidInfoSheet, CELLS_RAIDINFO_ARMORTYPES, newSheet, CELLS_RESERVATIONS_ARMORTYPES);
    copyCells(raidInfoSheet, CELLS_RAIDINFO_MAINSTATS, newSheet, CELLS_RESERVATIONS_MAINSTATS);
    copyCells(raidInfoSheet, CELLS_RAIDINFO_WEAPONS, newSheet, CELLS_RESERVATIONS_WEAPONS);
    copyCells(raidInfoSheet, CELLS_RAIDINFO_TRINKETS, newSheet, CELLS_RESERVATIONS_TRINKETS);

    function copyCells(sourceSheet, sourceCells, destSheet, destCells) {
        for (let cell in sourceCells) {
            let value = sourceSheet.getRange(sourceCells[cell]).getValue();
            destSheet.getRange(destCells[cell].MAX).setValue(value);
        }
    }
}

/** Helper Functions **/

function getColumnByName(sheet, row, name) {
    return sheet.getDataRange().getValues()[row].indexOf(name)+1;
}

function getMaxValues(raidMembers) {
    let maxValues = {
        maxArmorTypes   : {},
        maxMainStats    : {},
        maxClassNames   : {},
        maxWeaponTokens : {},
        maxTrinkets     : {}
    }

    raidMembers.forEach(function(main) {
        let addedValues = {
            armorTypes      : {},
            mainStats       : {},
            classNames      : {},
            weaponTokens    : {},
            trinkets        : {}
        }

        //TODO: Condense some duplicated code here
        let playerHasBuyer = hasBuyer(main);

        if (main.available && !playerHasBuyer) {
            let lootSpecs = main.lootSpecs;
            let armorType = CLASS_ARMORTYPES[main.playerClass];
            let className = main.playerClass;
            let weaponToken = CLASS_TOKENS[main.playerClass];
            let trinkets = getTrinkets(main);

            if (isSpecAvailable(main)) {
                //Add values to maxValues object
                maxValues.maxArmorTypes[armorType] = maxValues.maxArmorTypes[armorType] + 1 || 1;
                maxValues.maxClassNames[className] = maxValues.maxClassNames[className] + 1 || 1;
                maxValues.maxWeaponTokens[weaponToken] = maxValues.maxWeaponTokens[weaponToken] + 1 || 1;

                //For each ACTIVE spec, add each unique main stat the specs provide (ex, Paladin provides Int & Str for all specs)
                for (let index in lootSpecs) {
                    if (lootSpecs[index]) {
                        let mainStat = SPEC_STATS[CLASSES[main.playerClass]][index];
                        if (mainStat && !addedValues.mainStats[mainStat]) {
                            maxValues.maxMainStats[mainStat] = maxValues.maxMainStats[mainStat] + 1 || 1;
                            addedValues.mainStats[mainStat] = true;
                        }
                    }
                }

                trinkets.forEach(function (spec) {
                    spec.forEach(function (trinket) {
                        if (!addedValues.trinkets[trinket]) {
                            maxValues.maxTrinkets[trinket] = maxValues.maxTrinkets[trinket] + 1 || 1;
                            addedValues.trinkets[trinket] = true;
                        }
                    })
                })

                //Since a main can't provide more than one funnel (unless they multi-box), they're armor class, etc, can only be added once.
                addedValues.armorTypes[armorType] = true;
                addedValues.classNames[className] = true;
                addedValues.weaponTokens[weaponToken] = true;
            }
        }

        let alts = main.alts;

        alts.forEach(function(alt) {
            if (alt.available){
                let altLootSpecs = alt.lootSpecs;
                let altArmorType = CLASS_ARMORTYPES[alt.playerClass];
                let altClassName = alt.playerClass;
                let altWeaponToken = CLASS_TOKENS[alt.playerClass];
                let altTrinkets = getTrinkets(alt);

                if (main.available && isSpecAvailable(alt) && !playerHasBuyer) {
                    if (!addedValues.armorTypes[altArmorType]) {
                        maxValues.maxArmorTypes[altArmorType] = maxValues.maxArmorTypes[altArmorType] + 1 || 1;
                        addedValues.armorTypes[altArmorType] = true;
                    }

                    if (!addedValues.classNames[altClassName]) {
                        maxValues.maxClassNames[altClassName] = maxValues.maxClassNames[altClassName] + 1 || 1;
                        addedValues.armorTypes[altArmorType] = true;
                    }

                    if (!addedValues.weaponTokens[altWeaponToken]) {
                        maxValues.maxWeaponTokens[altWeaponToken] = maxValues.maxWeaponTokens[altWeaponToken] + 1 || 1;
                        addedValues.weaponTokens[altWeaponToken] = true;
                    }

                    for (let index in altLootSpecs) {
                        if (altLootSpecs[index]) {
                            let mainStat = SPEC_STATS[CLASSES[alt.playerClass]][index];
                            if (mainStat && !addedValues.mainStats[mainStat]) {
                                maxValues.maxMainStats[mainStat] = maxValues.maxMainStats[mainStat] + 1 || 1;
                                addedValues.mainStats[mainStat] = true;
                            }
                        }
                    }

                    altTrinkets.forEach(function (spec) {
                        spec.forEach(function (trinket) {
                            if (!addedValues.trinkets[trinket]) {
                                maxValues.maxTrinkets[trinket] = maxValues.maxTrinkets[trinket] + 1 || 1;
                                addedValues.trinkets[trinket] = true;
                            }
                        })
                    })
                }
            }
        })
    })

    return maxValues;
}

/** Returns true if the player or any of their alts have a buyer assigned to them */
function hasBuyer(player) {
    let hasBuyer = false;
    if (!player.buyerName){
        player.alts.forEach(function(alt) {
            if (alt.buyerName) {
                hasBuyer = true;
            }
        })
    }
    return hasBuyer;
}

function isSpecAvailable(player) {
    let specAvailable = false;
    for (let spec in player.lootSpecs) {
        if (player.lootSpecs[spec]) {
            specAvailable = true;
        }
    }
    return specAvailable;
}

function getTrinkets(player) {
    let trinkets = [];

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

function toTitleCase(str){
    return str.toLowerCase().split(" ").map(function(val){
        return val.replace(val[0], val[0].toUpperCase());
    }).join(" ");
}

function arrayToTitleCase(strArray) {
    for (let str in strArray){
        strArray[str] = toTitleCase(strArray[str]);
    }
    return strArray;
}