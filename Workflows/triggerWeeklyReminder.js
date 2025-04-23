function triggerWeeklyReminder() {
  // --- Configuration ---
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = ""; // TODO: ENTER YOUR SHEET NAME
  const presenterColumnHeader = ""; // TODO: ENTER COLUMN NAME THAT CONTAINS THE PRESENTERS
  const currentIndexCell = ""; // TODO: ENTER CELL WITH CURRENT INDEX
  const slackWebhookUrl = ""; // TODO: REPLACE THIS WITH YOUR WEBHOOK URL
  const numberOfPresenters = ; // TODO: ENTER NUMBER OF PRESENTERS

 // --- Get Data from Sheet ---
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    Logger.log(`Sheet named "${sheetName}" not found.`);
    return;
  }
  const presenterColumnIndex = getColumnIndex(sheet, presenterColumnHeader);
  if (!presenterColumnIndex) {
    Logger.log(`Column with header "${presenterColumnHeader}" not found.`);
    return;
  }

  const presenters = sheet
    .getRange(1, presenterColumnIndex, sheet.getLastRow(), 1)
    .getValues()
    .flat()
    .filter(String);
  const currentIndex = sheet.getRange(currentIndexCell).getValue();

  // --- Calculate Next Presenter ---
  let nextIndex = (currentIndex % numberOfPresenters) + 1;
  if (nextIndex > numberOfPresenters) {
    nextIndex = 1;
  }
  let actualNextIndex = nextIndex;
  Logger.log(`Current Index: ${currentIndex}, Next Index: ${actualNextIndex}`);
  let nextPresenter = sheet.getRange(actualNextIndex, presenterColumnIndex).getValue();
  if (nextPresenter === "Name") { // Check if the value is "Name"
    // If it is, increment nextIndex and get the presenter again.
    nextIndex++;
    if (nextIndex > numberOfPresenters) {
      nextIndex = 1; //wrap around
    }
    actualNextIndex = nextIndex;
    nextPresenter = sheet.getRange(actualNextIndex, presenterColumnIndex).getValue();
  }
  Logger.log(`Next Presenter Row: ${actualNextIndex}, Column: ${presenterColumnIndex}, Value: ${nextPresenter}`);

  // --- Construct Payload for Webhook ---
  const payload = {
    presenter: nextPresenter,
    currentIndex: actualNextIndex,
  };

  const options = {
    method: "POST",
    contentType: "application/json",
    payload: JSON.stringify(payload),
  };

  // --- Send Webhook ---
  try {
    UrlFetchApp.fetch(slackWebhookUrl, options);
    Logger.log("Webhook sent successfully.");

    // --- Update the Google Sheet ---
    sheet.getRange(currentIndexCell).setValue(actualNextIndex);
    Logger.log("Current Index updated to " + actualNextIndex);
  } catch (error) {
    Logger.log("Error sending webhook: " + error);
  }
}

/**
 * Helper function to get the column index by its header name.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet The sheet to search in.
 * @param {string} headerName The header name to find.
 * @return {number} The column index (1-based), or null if not found.
 */
function getColumnIndex(sheet, headerName) {
  const headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  for (let i = 0; i < headerRow.length; i++) {
    if (headerRow[i] === headerName) {
      return i + 1; // 1-based index
    }
  }
  return null; // Not found
}
