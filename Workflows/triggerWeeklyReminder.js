function triggerWeeklyReminder() {
  // --- Configuration ---
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = ""; // TODO: ENTER YOUR SHEET NAME
  const presenterColumnHeader = ""; // TODO: ENTER COLUMN NAME THAT CONTAINS THE PRESENTERS
  const tagColumnHeader = "";  // TODO: ENTER COLUMN NAME THAT CONTAINS THE SLACKID
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
  const tagColumnIndex = getColumnIndex(sheet, tagColumnHeader);
  if (!tagColumnIndex) {
    Logger.log(`Column with header "${tagColumnHeader}" not found.`);
    return;
  }

  const currentIndex = sheet.getRange(currentIndexCell).getValue();

  // --- Calculate Next Presenter ---
  let nextIndex = (currentIndex % numberOfPresenters); // Use modulo for 0-based index
  if (nextIndex < 0) { // Handle potential negative modulo results
    nextIndex += numberOfPresenters;
  }
  let actualNextIndex = nextIndex + 1; // Convert to 1-based for sheet access

  Logger.log(`Current Index: ${currentIndex}, Initial Next Index (1-based): ${actualNextIndex}`);

  let nextPresenter = sheet.getRange(actualNextIndex, presenterColumnIndex).getValue();
  let nextPresenterTag = sheet.getRange(actualNextIndex, tagColumnIndex).getValue();

  // --- Handle Header Row ---
  if (nextPresenter === presenterColumnHeader) {
    nextIndex = (nextIndex + 1) % numberOfPresenters;
    actualNextIndex = nextIndex + 1;
    nextPresenter = sheet.getRange(actualNextIndex, presenterColumnIndex).getValue();
    nextPresenterTag = sheet.getRange(actualNextIndex, tagColumnIndex).getValue();
    Logger.log(`Skipping header row. New Next Presenter Row: ${actualNextIndex}, Presenter: ${nextPresenter}, Tag: ${nextPresenterTag}`);
  } else {
    Logger.log(`Next Presenter Row: ${actualNextIndex}, Presenter: ${nextPresenter}, Tag: ${nextPresenterTag}`);
  }

  // --- Construct Payload for Webhook ---
  const payload = {
    presenter: nextPresenter,
    tag: nextPresenterTag,
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
