# Slack Workflow: Weekly Presenter Reminder

This Google Apps Script code automates sending a weekly reminder to a designated Slack channel, informing everyone who the next presenter is. It reads the list of presenters and the current presenter index from a Google Sheet.

## Features

* **Weekly Reminders:** Automatically sends a message to a Slack channel at a scheduled time each week.
* **Rotation of Presenters:** Cycles through a list of presenters stored in a Google Sheet.
* **Easy Configuration:** Requires minimal setup by updating a few variables in the script.
* **Error Handling:** Includes basic logging for debugging and error reporting.
* **Skips Placeholder Names:** Designed to skip rows in the presenter list that contain the word "Name".

## Setup Instructions

Follow these steps to set up the Slack workflow:

1.  **Create a Google Sheet:**
    * Create a new Google Sheet or use an existing one.
    * In one of the columns, list the names of the presenters. Ensure the first row of this column contains a clear header (e.g., "Presenter Name").
    * In another cell, enter the number `1`. This cell will store the index of the current presenter.
    * Make a note of the **sheet name**, the **header of the presenter column**, and the **cell containing the current index**.
    * Determine the **total number of presenters** in your list.

2.  **Create a Slack App and Get a Webhook URL:**
    * Go to [Slack API](https://api.slack.com/apps) and create a new app.
    * Give your app a name and choose the workspace where you want to use it.
    * Navigate to "Incoming Webhooks" in the left-hand menu and activate it.
    * Click "Add New Webhook to Workspace".
    * Choose the channel where you want the weekly reminders to be sent and click "Authorize".
    * Copy the **Webhook URL** provided. You'll need this in the next step.

3.  **Open the Script Editor in your Google Sheet:**
    * In your Google Sheet, go to "Extensions" > "Apps Script".

4.  **Copy and Paste the Code:**
    * Delete any existing code in the script editor.
    * Copy the provided Google Apps Script code and paste it into the script editor.

5.  **Configure the Script:**
    * Locate the `// --- Configuration ---` section at the beginning of the `triggerWeeklyReminder` function.
    * Replace the placeholder values with your actual information:
        * `const sheetName = "";` **Replace with the name of your Google Sheet.** (e.g., `"Presentations"`)
        * `const presenterColumnHeader = "";` **Replace with the header of the column containing the presenter names.** (e.g., `"Presenter Name"`)
        * `const currentIndexCell = "";` **Replace with the cell address that contains the current presenter index.** (e.g., `"A1"`)
        * `const slackWebhookUrl = "";` **Replace with the Slack Webhook URL you copied earlier.**
        * `const numberOfPresenters = ;` **Replace with the total number of presenters in your list.** (e.g., `5`)

6.  **Save the Script:**
    * Click the floppy disk icon (Save project) and give your script a name (e.g., "Slack Presenter Reminder").

7.  **Set up a Time-Driven Trigger:**
    * Click the clock icon on the left sidebar (Triggers).
    * Click the "Add Trigger" button in the bottom right corner.
    * In the dropdown menus, configure the trigger as follows:
        * **Choose which function to run:** `triggerWeeklyReminder`
        * **Choose which deployment should run:** `Head`
        * **Select event source:** `Time-driven`
        * **Select type of time based trigger:** `Week timer`
        * **Select day of the week:** Choose the day you want the reminder to be sent.
        * **Select time of day:** Choose the time you want the reminder to be sent.
    * Click "Save". You may be asked to authorize the script to access your Google Sheet and connect to an external service (Slack). Follow the on-screen instructions to grant the necessary permissions.

## How it Works

1.  **Reads Configuration:** The script starts by reading the configuration variables you set, such as the sheet name, column header, current index cell, Slack webhook URL, and the total number of presenters.
2.  **Retrieves Data:** It fetches the list of presenter names from the specified column in your Google Sheet and the current presenter index from the designated cell.
3.  **Calculates Next Presenter:** It calculates the index of the next presenter in the rotation. If the current index reaches the total number of presenters, it wraps back to the beginning of the list. It also includes logic to skip any rows where the presenter name is "Name".
4.  **Constructs Slack Message:** It creates a JSON payload containing the name of the next presenter.
5.  **Sends Slack Notification:** It uses the `UrlFetchApp.fetch` method to send a POST request to your Slack webhook URL with the JSON payload. This triggers a message to be sent to the configured Slack channel.
6.  **Updates Current Index:** After successfully sending the notification, the script updates the current index cell in your Google Sheet to the index of the presenter who was just announced. This ensures that the next time the script runs, it will pick the subsequent presenter in the list.

## Notes

* Ensure that the sheet name, column header, and cell address for the current index are entered correctly in the script configuration.
* The script assumes that the presenter names start from the first row after the header in the specified column.
* The "Name" check is a simple way to skip placeholder rows. You can modify this logic if you have a different way of indicating non-presenter rows.
* You can adjust the time-driven trigger settings to change the day and time the reminder is sent each week.
* Check the script logs (View > Logs) in the Apps Script editor for any errors or successful executions.

## Contributing

Feel free to fork this repository and submit pull requests with improvements or bug fixes.
