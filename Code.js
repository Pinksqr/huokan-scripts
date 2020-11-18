let properties = PropertiesService.getScriptProperties();

function onOpen(event) {
    Logger.log("Event: onOpen Triggered");

    let raidRoster = JSON.parse(properties.getProperty("raidRoster"));
    if (raidRoster === null) {
        updateRaidRoster();
    }
}

function onEdit(event) {
    Logger.log("Event: onEdit Triggered");

    let sheet = event.source.getActiveSheet();
    let range = event.range;
    let value = event.value;

    //Raid roster sheet updates
    updateRaidRosterSpecCheckboxes(sheet, range, value);
    updateRaidRoster(sheet, range);
    //updateRaidRosterMaxCounts(sheet);

    //Reservation sheet updates
    updateReservationSpecDropdown(sheet, range, value);
    updateReservationFunnelDropdown(sheet, range, value);
    Logger.log("Function: onEdit Finished");
}

function updateRaidRosterSpecCheckboxes(sheet, range, value) {
    if (sheet.getName() === "Raid Mains" || sheet.getName() === "Raid Alts") {
        let classColumn = getColumnByName(sheet, 4, "Class");
        let row = range.getRow();
        let col = range.getColumn();

        if (row > 5 && col === classColumn) {
            Logger.log("Function: updateRaidRosterSpecCheckboxes Triggered: Updating checkboxes for " + value + "class");

            //Clear data
            sheet.getRange(row, col+1, 1, classColumn+8).clearContent().removeCheckboxes();

            if (value) {
                //Get & set spec names
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

        if (row > 5 && col < 13) {
            Logger.log("Function: updateRaidRoster Triggered")

            let raidRoster = createRaidRoster();
            updateProperties(raidRoster);
            updateRaidRosterMaxCounts(sheet);
        }
    }
}

function createRaidRoster() {
    Logger.log("Function: createRaidRoster Triggered")

    let spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let mainSheet = spreadsheet.getSheetByName("Raid Mains");
    let altSheet = spreadsheet.getSheetByName("Raid Alts");
    let mainSheetValues = mainSheet.getSheetValues(6, 1, mainSheet.getLastRow(), 11);
    let altSheetValues = altSheet.getSheetValues(6, 1, altSheet.getLastRow(), 12);
    let raidRoster = new RaidRoster();

    //Column values for each variable; Must be updated when the sheet is moved around
    const mainSheetCols = {
        available   : 0,
        playerName  : 1,
        playerClass : 2,
        lootSpecs   : [3, 5, 7, 9]
    };
    const altSheetCols = {
        available   : 0,
        mainName    : 1,
        altName     : 2,
        altClass    : 3,
        lootSpecs   : [4, 6, 8, 10]
    };

    //Create main raiders and add to roster
    for (let row in mainSheetValues) {
        let currentRow  = mainSheetValues[row];
        let available   = currentRow[mainSheetCols.available];
        let playerName  = currentRow[mainSheetCols.playerName];
        let playerClass = currentRow[mainSheetCols.playerClass];
        let lootSpecs   = [];
        mainSheetCols.lootSpecs.forEach(function (col) {
            lootSpecs.push(currentRow[col]);
        });

        if (playerName && playerClass && lootSpecs) {
            raidRoster.addMain(playerName, playerClass.toUpperCase(), lootSpecs, available);
        }
    }

    //Create raider alts and connect to mains in the raid roster
    for (let row in altSheetValues){
        let currentRow  = altSheetValues[row];
        let available   = currentRow[altSheetCols.available];
        let mainName    = currentRow[altSheetCols.mainName];
        let altName     = currentRow[altSheetCols.altName];
        let altClass    = currentRow[altSheetCols.altClass];
        let lootSpecs   = [];
        altSheetCols.lootSpecs.forEach(function (col) {
            lootSpecs.push(currentRow[col]);
        });

        if (mainName && altName && altClass && lootSpecs) {
            raidRoster.getMainByName(mainName).addAlt(altName, altClass.toUpperCase(), lootSpecs, available)
        }
    }
    return raidRoster;
}

function updateProperties(raidRoster) {
    Logger.log("Function: updateProperties Triggered")
    let maxArmorTypes = raidRoster.getMaxArmorTypes();

    properties.setProperties({
       "raidRoster" : JSON.stringify(raidRoster),
       "maxPlate" : maxArmorTypes.PLATE,
       "maxMail" : maxArmorTypes.MAIL,
       "maxLeather" : maxArmorTypes.LEATHER,
       "maxCloth" : maxArmorTypes.CLOTH
    }, true);
    Logger.log("Function: updateProperties Finished")
}

function updateRaidRosterMaxCounts(sheet) {
    Logger.log("Function: updateRaidRosterMaxCounts Triggered")
    let raidMainCells = {
        maxPlateValue   : "N20",
        maxMailValue    : "N21",
        maxLeatherValue : "N22",
        maxClothValue   : "N23"
    };
    sheet.getRange(raidMainCells.maxPlateValue).setFormula(getMaxPlate());
    sheet.getRange(raidMainCells.maxMailValue).setFormula(getMaxMail());
    sheet.getRange(raidMainCells.maxLeatherValue).setFormula(getMaxLeather());
    sheet.getRange(raidMainCells.maxClothValue).setFormula(getMaxCloth());
}

function updateReservationSpecDropdown(sheet, range, value) {
    if (sheet.getName() !== "Raid Mains" && sheet.getName() !== "Raid Alts" && value) {
        let row = range.getRow();
        let col = range.getColumn();

        if (row > 7 && col ===7) {
            Logger.log("Function: updateReservationSpecDropdown Triggered: Updating drop-down for " + value + " class");

            let specCell = sheet.getRange(row, 8).clearContent().clearDataValidations();
            let specNames = SPECIALIZATIONS[CLASSES[value.toUpperCase()]];
            let dataRule = SpreadsheetApp.newDataValidation().requireValueInList(arrayToTitleCase(specNames)).build();
            specCell.setDataValidation(dataRule);
        }
    }
}

//TODO: Make WEAPON and TRINKET funnel options ONLY appear when the appropriate class is selected!
function updateReservationFunnelDropdown(sheet, range, value) { }

function getMaxPlate() {
    return properties.getProperty("maxPlate");
}

function getMaxMail() {
    return properties.getProperty("maxMail");
}

function getMaxLeather() {
    return properties.getProperty("maxLeather");
}

function getMaxCloth() {
    return properties.getProperty("maxCloth");
}

function getColumnByName(sheet, row, name) {
    return sheet.getDataRange().getValues()[row].indexOf(name)+1;
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