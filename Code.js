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

        if (main && main.isAvailable() && available && altName && altClass && lootSpecs) {
            main.addAlt(altName, altClass.toUpperCase(), lootSpecs, available);
        }
    }

    function getMainByName(name) {
        for (let index in raidRoster) {
            if (raidRoster[index].getPlayerName() === name) {
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
    Logger.log(JSON.stringify(raidRoster));
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

        if (row > 7 && col === COLUMNS_RESERVATIONS.CHECKBOX && value) {
            let carryCheck = isCarryAvailable(sheet.getRange(row, COLUMNS_RESERVATIONS.SERVICE).getValue());
            let funnelCheck = isFunnelAvailable(sheet.getRange(row, COLUMNS_RESERVATIONS.FUNNELS).getValue());

            if (carryCheck && funnelCheck) {
                let raidRoster  = JSON.parse(sheet.getRange("A1").getValue());
                let buyerName   = sheet.getRange(row, COLUMNS_RESERVATIONS.BUYER_NAME).getValue();
                let service     = sheet.getRange(row, COLUMNS_RESERVATIONS.SERVICE).getValue();
                let funnels     = sheet.getRange(row, COLUMNS_RESERVATIONS.FUNNELS).getValue();
                let funnelType  = sheet.getRange(row, COLUMNS_RESERVATIONS.FUNNEL_TYPE).getValue();
                let funnelOpt   = sheet.getRange(row, COLUMNS_RESERVATIONS.FUNNEL_OPTION).getValue();

                Logger.log(buyerName + service + funnels + funnelType + funnelOpt);

                //TODO: Find booster for buyer with raidRoster
                for (let funnelNum = 0; funnelNum <= funnels; funnelNum++) {
                    for (let booster in raidRoster) {
                        Logger.log(raidRoster[booster]);
                    }
                }

                //TODO: Change booster(s) buyerName to buyer
                //TODO: Recalculate current values
                //let currentValues = getMaxValues(raidRoster);
            }
        }
    }

    /** Checks if a carry spot is available */
    function isCarryAvailable(service) {
        return true;
    }

    /** Checks if a funnel spot is available */
    function isFunnelAvailable(funnelNumber) {
        return true;
    }

}

function processReservation(sheet, range, value) {
    let raidRoster = JSON.parse(sheet.getRange("A1").getValue());


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
            destSheet.getRange(destCells[cell]).setValue(value);
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

        if (main.isAvailable() && !main.hasBuyer()) {
            let lootSpecs = main.getLootSpecs();
            let armorType = main.getArmorType();
            let className = main.getClassName();
            let weaponToken = main.getWeaponToken();
            let trinkets = main.getTrinkets();

            if (main.isSpecAvailable()) {
                //Add values to maxValues object
                maxValues.maxArmorTypes[armorType] = maxValues.maxArmorTypes[armorType] + 1 || 1;
                maxValues.maxClassNames[className] = maxValues.maxClassNames[className] + 1 || 1;
                maxValues.maxWeaponTokens[weaponToken] = maxValues.maxWeaponTokens[weaponToken] + 1 || 1;

                //For each ACTIVE spec, add each unique main stat the specs provide (ex, Paladin provides Int & Str for all specs)
                for (let index in lootSpecs) {
                    if (lootSpecs[index]) {
                        let mainStat = main.getMainStat(index);
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

        let alts = main.getAlts();

        alts.forEach(function(alt) {

            if (alt.isAvailable()){
                let altLootSpecs = alt.getLootSpecs();
                let altArmorType = alt.getArmorType();
                let altClassName = alt.getClassName();
                let altMainStats = alt.getMainStats();
                let altWeaponToken = alt.getWeaponToken();
                let altTrinkets = alt.getTrinkets();

                if (main.isAvailable() && alt.isSpecAvailable()) {
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
                            let mainStat = alt.getMainStat(index);
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