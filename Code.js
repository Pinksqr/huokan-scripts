let properties = PropertiesService.getScriptProperties();

function onOpen(event) {
    Logger.log("Event: onOpen Triggered")

    let raidRoster = JSON.parse(properties.getProperty("raidRoster"));
    if (raidRoster === null) {
        setRaidRosterProperties();
    }
}

function onEdit(event) {
    Logger.log("Event: onEdit Triggered");

    let sheet = event.source.getActiveSheet();
    let range = event.range;

    updateRaidRoster(sheet, range);
    //updateSpecCheckboxes()
}

function updateRaidRoster(sheet, range) {
    if (sheet.getName() === "Raid Mains" || sheet.getName() === "Raid ALts") {
        let row = range.getRow();
        let col = range.getColumn();

        if (row > 5 && col < 13) {
            setRaidRosterProperties();
        }
    }
}

function setRaidRosterProperties() {
    let raidRoster = createRaidRoster();
    let maxArmorTypes = raidRoster.getMaxArmorTypes();

    properties.setProperties({
        "raidRoster"    : JSON.stringify(raidRoster),
        "maxCloth"      : maxArmorTypes.CLOTH,
        "maxLeather"    : maxArmorTypes.LEATHER,
        "maxMail"       : maxArmorTypes.MAIL,
        "maxPlate"      : maxArmorTypes.PLATE
    }, true);
}

function createRaidRoster() {
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
            lootSpecs.push(currentRow[mainSheetCols.lootSpecs[col]]);
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
            lootSpecs.push(currentRow[altSheetCols.lootSpecs[col]]);
        });

        if (mainName && altName && altClass && lootSpecs) {
            raidRoster.getMainByName(mainName).addAlt(altName, altClass.toUpperCase(), lootSpecs, available)
        }
    }

    return raidRoster;
}


function updateSpecCheckboxes() {}

function createSaleSheet() {}

function getMaxPlate() {
    return properties.getProperty("maxPlate");
}