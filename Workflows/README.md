# Slack Workflow: Weekly Presenter Reminder
This Google Apps Script code is designed to **trigger a Slack Workflow via a webhook** on a weekly schedule. The workflow, configured in Slack, can then handle the actual posting of the reminder message to your channel. The script reads the list of presenters and the current presenter index from a Google Sheet.

## Features
* **Triggers Slack Workflow:** Initiates a predefined Slack Workflow using a webhook.
* **Weekly Scheduling:** Leverages Google Apps Script's time-driven triggers for automated weekly execution.
* **Rotation of Presenters:** Cycles through a list of presenters fetched from a Google Sheet, ensuring fair distribution.
* **Slack User Tagging:** Supports tagging presenters in Slack using their Slack user IDs, enhancing notification reliability.
* **Easy Configuration:** Requires minimal setup with clearly defined configuration variables.
* **Error Handling and Logging:** Includes logging for debugging and error reporting within the Google Apps Script environment.
* **Header Row Skipping:** Intelligently skips header rows in the presenter list, preventing errors.


## Setup Instructions
Follow these steps to set up the Slack workflow:

1.  **Create a Google Sheet:**
    * Create a new Google Sheet or use an existing one.
    * In one column (e.g., "Presenter Name"), list the names of the presenters. Ensure the first row of this column contains a clear header.
    * In another column (e.g., "Slack ID"), list the Slack user IDs of the presenters.  This is crucial for tagging users in Slack.  You can typically find a user's ID by right-clicking on their profile picture and copying their member ID.  Ensure the first row also has a clear header.
    * In a separate cell (e.g., "A1"), enter the number `1`. This cell will store the index of the current presenter.
    * Make a note of the following:
        * **Sheet Name:** (e.g., `"Presentations"`)
        * **Presenter Name Column Header:** (e.g., `"Presenter Name"`)
        * **Slack ID Column Header:** (e.g., `"Slack ID"`)
        * **Current Index Cell:** (e.g., `"A1"`)
        * **Total Number of Presenters**

2.  **Open the Script Editor in your Google Sheet:**
    * In your Google Sheet, go to "Extensions" > "Apps Script".

3.  **Copy and Paste the Code:**
    * Delete any existing code in the script editor.
    * Copy the provided Google Apps Script code (`triggerWeeklyReminder.js`) and paste it into the script editor.

4.  **Configure the Script:**
    * Locate the `// --- Configuration ---` section at the beginning of the `triggerWeeklyReminder` function.
    * Replace the placeholder values with your actual information:
        * `const sheetName = "";`  **Replace with the name of your Google Sheet.**
        * `const presenterColumnHeader = "";`  **Replace with the header of the column containing the presenter names.**
        * `const tagColumnHeader = "";`  **Replace with the header of the column containing the Slack IDs.**
        * `const currentIndexCell = "";`  **Replace with the cell address that contains the current presenter index.**
        * `const slackWebhookUrl = "";`  **Replace with the Webhook URL of the *Trigger* step in your Slack Workflow (see step 6).**
        * `const numberOfPresenters = ;`  **Replace with the total number of presenters in your list.**

5.  **Save the Script:**
    * Click the floppy disk icon (Save project) and give your script a name (e.g., "Slack Presenter Trigger").
 
6.  **Create a Slack Workflow with a Webhook Trigger:**
    * In your Slack workspace, navigate to "Automations" in the left sidebar and select "Workflows".
    * Click "Create workflow".
    * Choose "Webhook" as the trigger.
    * Give your workflow a descriptive name (e.g., "Weekly Presenter Announcement").
    * Click "Add step".  The most common step is "Send a message" to a channel.
    * **copy the Webhook URL provided by Slack at the "Webhook" trigger step.** You MUST paste this into the `slackWebhookUrl` variable in your Google Apps Script (step 4).
    * In the "Send a message" step, you can now use variables from the webhook payload.  For example, if your script sends `{"presenter": "John Doe", "tag": "U1234567", "currentIndex": 2}`, you can access these in your message:
        * `{{data.presenter}}` will output "John Doe".
        * To tag the user, use  `<@{{data.tag}}>` which will render as `@John Doe` in Slack, provided "U1234567" is their correct user ID.
        * `{{data.currentIndex}}` will output "2".
    * Add any other steps to your workflow as needed (e.g., formatting the message, adding reactions, etc.).
    * Click "Save" and then "Publish" your workflow.

7.  **Set up a Time-Driven Trigger for the Google Apps Script:**
    * In the Apps Script editor, click the clock icon on the left sidebar (Triggers).
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
1.  **Scheduled Script Execution:** The Google Apps Script runs at the scheduled time defined by the time-driven trigger.
2.  **Reads Configuration:** The script reads the configuration variables, including the URL of the Slack Workflow's webhook trigger.
3.  **Retrieves Data:** It fetches the list of presenter names and the current index from the Google Sheet.
4.  **Calculates Next Presenter:** It determines the next presenter in the rotation, skipping any "Name" placeholders.
5.  **Constructs Webhook Payload:** It creates a JSON payload containing the `presenter` name and the `currentIndex`.
6.  **Triggers Slack Workflow:** The script uses `UrlFetchApp.fetch` to send a POST request to the Slack Workflow's webhook URL, including the JSON payload. This initiates the Slack Workflow.
7.  **Slack Workflow Executes:** The Slack Workflow receives the webhook call and proceeds with the steps you've defined (e.g., sending a formatted message to a channel using the data from the payload).
8.  **Updates Current Index:** The Google Apps Script updates the current index in the Google Sheet to prepare for the next week.

## Notes
* **Webhook URL:** Always use the **Webhook URL from the *Trigger* step** of your Slack Workflow.
* **Slack User IDs:** Accurate Slack user IDs are essential for tagging.  Double-check these in your Google Sheet.
* **Variable Usage in Slack:** Leverage the variables in the webhook payload (`{{data.presenter}}`, `<@{{data.tag}}>`, `{{data.currentIndex}}`) to create dynamic and informative Slack messages.
* **Error Handling:** Monitor the Apps Script execution logs and Slack Workflow logs for any errors.
* **Flexibility:** The Slack Workflow provides extensive flexibility in customizing the message format, adding buttons, or performing other actions.
* **Time Zone:** Be mindful of the time zone when setting up the time-driven trigger in Apps Script.

## Contributing
Feel free to fork this repository and submit pull requests with improvements or bug fixes.
