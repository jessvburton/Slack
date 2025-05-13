function triggerWeeklyReminderBasedOnDate() { // Renamed function for clarity
  // --- Configuration ---
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = ""; 
  const presenterColumnHeader = ""; 
  const dateColumnHeader = "";  
  const slackWebhookUrl = ""; 
  const slackChannelColumnHeader = ""; 
  const slackIdColumnHeader = ""; 
  const meetingColumnHeader = ""; 
  const daysAheadToCheck = ; // How many days ahead to check

  // --- Get Today's Date and Calculate Check End Date ---
  const timezone = ss.getSpreadsheetTimeZone(); // Get the spreadsheet's timezone
  const today = new Date(); // Get the current date and time
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Get today's date at midnight
  const formattedToday = Utilities.formatDate(startOfDay, timezone, "yyyy-MM-dd"); // Format today's date

  const checkEndDate = new Date(startOfDay); // Create a new date object for the check end date
  checkEndDate.setDate(startOfDay.getDate() + daysAheadToCheck); // Add the specified number of days to the start date
  const formattedCheckEndDate = Utilities.formatDate(checkEndDate, timezone, "yyyy-MM-dd"); // Format the check end date

  Logger.log(`Checking meetings between ${formattedToday} and ${formattedCheckEndDate}`); // Log the date range


  // --- Get Data from Sheet ---
  const sheet = ss.getSheetByName(sheetName); // Get the sheet by name
  if (!sheet) { // Check if the sheet exists
    Logger.log(`Sheet "${sheetName}" not found.`);
    return; // Exit if the sheet is not found
  }

  const headerRowValues = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]; // Get the values of the header row
  const presenterColumnIndex = getColumnIndex(sheet, presenterColumnHeader); // Get the index of the presenter column
  const dateColumnIndex = getColumnIndexByHeaderName(headerRowValues, dateColumnHeader); // Get the index of the date column
  const slackChannelColumnIndex = getColumnIndexByHeaderName(headerRowValues, slackChannelColumnHeader); // Get the index of the Slack channel column
  const slackIdColumnIndex = getColumnIndexByHeaderName(headerRowValues, slackIdColumnHeader); // Get the index of the Slack ID column
  const meetingColumnIndex = getColumnIndexByHeaderName(headerRowValues, meetingColumnHeader); // Get the index of the meeting column

  // --- Error Handling: Check if required columns exist ---
  if (!presenterColumnIndex) {
    Logger.log(`Column "${presenterColumnHeader}" not found.`);
    return; // Exit if the column is not found
  }
  if (!dateColumnIndex) {
    Logger.log(`Column "${dateColumnHeader}" not found.`);
    return; // Exit if the column is not found
  }
  if (!slackChannelColumnIndex) {
    Logger.log(`Column "${slackChannelColumnHeader}" not found.`);
    return; // Exit if the column is not found
  }
  if (!slackIdColumnIndex) {
    Logger.log(`Column "${slackIdColumnHeader}" not found.`);
    return; // Exit if the column is not found
  }
  if (!meetingColumnIndex) {
    Logger.log(`Column "${meetingColumnHeader}" not found.`);
    return; // Exit if the column is not found
  }

  // --- Find Upcoming Meetings ---
  let upcomingMeetings = []; // Array to store upcoming meeting details

  const allData = sheet.getDataRange().getValues(); // Get all data from the sheet
  // Iterate through rows, starting from the second row (index 1) to skip the header
  for (let i = 1; i < allData.length; i++) {
    const row = allData[i]; // Get the current row
    const dateCell = row[dateColumnIndex - 1]; // Get the date cell value (adjusting for 0-based array indexing)
    let sheetDateFormatted = ""; // Variable to store the formatted date from the sheet

    // Format the date from the sheet, handling both Date objects and strings
    if (dateCell instanceof Date) {
      sheetDateFormatted = Utilities.formatDate(dateCell, timezone, "yyyy-MM-dd");
    } else if (dateCell) {
      sheetDateFormatted = dateCell.toString().trim(); // Trim whitespace from string dates
    }

    // Check if the formatted date is within the specified date range
    if (sheetDateFormatted >= formattedToday && sheetDateFormatted <= formattedCheckEndDate) {
      const presenter = row[presenterColumnIndex - 1]; // Get the presenter
      const slackChannel = row[slackChannelColumnIndex - 1]; // Get the Slack channel
      const slackId = row[slackIdColumnIndex - 1]; // Get the Slack ID
      const meeting = row[meetingColumnIndex - 1]; // Get the meeting title

      Logger.log(`Presenter: ${presenter}, SlackChannel: ${slackChannel}, SlackId: ${slackId}, Meeting: ${meeting}`); // Log the meeting details

      // Check if the presenter cell is not empty
      if (presenter && presenter.trim() !== "") {
        // Add the meeting details to the array
        upcomingMeetings.push({
          date: sheetDateFormatted,
          presenter: presenter,
          slackChannel: slackChannel,
          slackId: slackId,
          meeting: meeting,
        });
      }
    }
  }

  // --- Construct and Send Payloads ---
  if (upcomingMeetings.length > 0) { // Check if there are any upcoming meetings
    // Iterate through the upcoming meetings and send a webhook for each
    upcomingMeetings.forEach(meeting => {
      const payload = { // Construct the payload for the webhook
        presenter: meeting.presenter,
        date: meeting.date,
        slackChannel: meeting.slackChannel,
        slackId: meeting.slackId,
        meeting: meeting.meeting,
      };

      const options = { // Options for the UrlFetchApp.fetch method
        method: "POST",
        contentType: "application/json",
        payload: JSON.stringify(payload),
      };

      try {
        UrlFetchApp.fetch(slackWebhookUrl, options); // Send the webhook
        Logger.log(`Webhook sent for ${meeting.date}: ${meeting.presenter} to ${meeting.slackChannel}`); // Log success
      } catch (error) {
        Logger.log(`Webhook error for ${meeting.date}: ${error}`); // Log error
      }
    });
  } else {
    Logger.log(`No upcoming meetings in the next ${daysAheadToCheck} days.`); // Log if no meetings are found
  }
}

/**
 * Helper function to get the column index by its header name.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet The sheet to search in.
 * @param {string} headerName The header name to find.
 * @return {number} The column index (1-based), or null if not found.
 */
function getColumnIndex(sheet, headerName) {
  const headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]; // Get the header row values
  for (let i = 0; i < headerRow.length; i++) { // Iterate through the header row
    if (headerRow[i] === headerName) { // Check if the header matches
      return i + 1; // Return the 1-based index of the column
    }
  }
  return null; // Return null if the header is not found
}

/**
 * Helper function to get column index from a pre-fetched header row.
 * @param {Array<string>} headerRowValues Array of header values.
 * @param {string} headerName The header name to find.
 * @return {number|null} The column index (1-based), or null if not found.
 */
function getColumnIndexByHeaderName(headerRowValues, headerName) {
  for (let i = 0; i < headerRowValues.length; i++) { // Iterate through the header row values
    if (headerRowValues[i].toString().trim() === headerName.trim()) { // Check if the header matches (case-insensitive and whitespace-insensitive)
      return i + 1; // Return the 1-based index of the column
    }
  }
  return null; // Return null if the header is not found
}
