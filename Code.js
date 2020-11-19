let properties = PropertiesService.getScriptProperties();

/*function onOpen(event) {
    Logger.log("Event: onOpen Triggered");

    let raidRoster = JSON.parse(properties.getProperty("raidRoster"));
    if (raidRoster === null) {
        updateRaidRoster();
    }
}*/

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
}

function updateRaidRosterSpecCheckboxes(sheet, range, value) {
    if (sheet.getName() === "Raid Mains" || sheet.getName() === "Raid Alts") {
        let classColumn = getColumnByName(sheet, 4, "Class");
        let row = range.getRow();
        let col = range.getColumn();

        if (row > 4 && col === classColumn) {

            //Clear data
            sheet.getRange(row, col+1, 1, 8).clearContent().removeCheckboxes();

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

        if (row > 4 && col < 13) {

            let raidRoster = createRaidRoster();
            raidRoster.sort(function(a, b) {
                return a.alts.length - b.alts.length;
            })

            raidRoster.forEach(function(player) {
                Logger.log(player.getPlayerName() + " alts: " + player.alts.length);
            })

            updateProperties(raidRoster);
            updateRaidRosterMaxCounts();
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

    //Column values for each variable; Must be updated when the sheet is moved around
    const mainSheetCols = {
        available   : 1,
        playerName  : 2,
        playerClass : 3,
        lootSpecs   : [4, 6, 8, 10]
    };

    const altSheetCols = {
        available   : 1,
        mainName    : 2,
        altName     : 3,
        altClass    : 4,
        lootSpecs   : [5, 7, 9, 11]
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

        if (available && playerName && playerClass && lootSpecs) {
            raidRoster.push(new RaidMain(playerName, playerClass.toUpperCase(), lootSpecs, available));
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

        //TODO: Currently fails if a main is unavailable and an alt is available!
        if (available && mainName && altName && altClass && lootSpecs) {
            raidRoster[getMainIndexByName(mainName)].addAlt(altName, altClass.toUpperCase(). lootSpecs, available);
        }
    }

    function getMainIndexByName(name) {
        for (let index in raidRoster) {
            if (raidRoster[index].getPlayerName() === name) {
                return index;
            }
        }
    }

    return raidRoster;
}

function updateProperties(raidRoster) {
    let maxValues = getMaxValues(raidRoster);

    properties.setProperties({
        "raidRoster"    : JSON.stringify(raidRoster),
        "maxPlate"      : maxValues.maxArmorType.PLATE,
        "maxMail"       : maxValues.maxArmorType.MAIL,
        "maxLeather"    : maxValues.maxArmorType.LEATHER,
        "maxCloth"      : maxValues.maxArmorType.CLOTH,
        "maxStr"        : maxValues.maxMainStat.STR,
        "maxAgi"        : maxValues.maxMainStat.AGI,
        "maxInt"        : maxValues.maxMainStat.INT
    }, true);
}

function updateRaidRosterMaxCounts() {
    let raidInfoSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Raid Information");

    let raidMainCells = {
        maxPlateValue   : "M8",
        maxMailValue    : "M9",
        maxLeatherValue : "M10",
        maxClothValue   : "M11",
        maxStrValue     : "P8",
        maxAgiValue     : "P9",
        maxIntValue     : "P10"
    };

    raidInfoSheet.getRange(raidMainCells.maxPlateValue).setFormula(getMaxPlate());
    raidInfoSheet.getRange(raidMainCells.maxMailValue).setFormula(getMaxMail());
    raidInfoSheet.getRange(raidMainCells.maxLeatherValue).setFormula(getMaxLeather());
    raidInfoSheet.getRange(raidMainCells.maxClothValue).setFormula(getMaxCloth());
    raidInfoSheet.getRange(raidMainCells.maxStrValue).setFormula(getMaxStrength());
    raidInfoSheet.getRange(raidMainCells.maxAgiValue).setFormula(getMaxAgility());
    raidInfoSheet.getRange(raidMainCells.maxIntValue).setFormula(getMaxIntellect());
}

function updateReservationSpecDropdown(sheet, range, value) {
    if (sheet.getName() !== "Raid Mains" && sheet.getName() !== "Raid Alts") {
        let row = range.getRow();
        let col = range.getColumn();

        if (row > 7 && col === 11) {
            let specCell = sheet.getRange(row, 11).clearContent().clearDataValidations();
            let specNames = SPECIALIZATIONS[CLASSES[value.toUpperCase()]];
            let dataRule = SpreadsheetApp.newDataValidation().requireValueInList(arrayToTitleCase(specNames)).build();
            specCell.setDataValidation(dataRule);
        }
    }
}

function updateReservationFunnelDropdown(sheet, range, value) {
    if (sheet.getName() !== "Raid Mains" && (sheet.getName !== "RaidAlts")) {
        let row = range.getRow();
        let col = range.getColumn();

        if (row > 7 && col === 16 ) {

        }
    }
}

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

function getMaxStrength() {
    return properties.getProperty("maxStr");
}

function getMaxAgility() {
    return properties.getProperty("maxAgi");
}

function getMaxIntellect() {
    return properties.getProperty("maxInt");
}

function getColumnByName(sheet, row, name) {
    return sheet.getDataRange().getValues()[row].indexOf(name)+1;
}

function getMaxValues(raidMembers) {
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

    raidMembers.forEach(function(main) {
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
                addedValues.armorTypes[armorType] = true;
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

/** Helper Functions **/

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