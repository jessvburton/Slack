# Slack Workflow: Weekly Presenter Reminder

This Google Apps Script code is designed to **trigger a Slack Workflow via a webhook** on a weekly schedule. The workflow, configured in Slack, can then handle the actual posting of the reminder message to your channel. The script reads the list of presenters and the current presenter index from a Google Sheet.

## Features

* **Triggers Slack Workflow:** Google Apps Script initiates a predefined Slack Workflow.
* **Weekly Scheduling:** Google Apps Script is scheduled to run weekly.
* **Rotation of Presenters:** Cycles through a list of presenters stored in a Google Sheet.
* **Easy Configuration:** Requires minimal setup by updating a few variables in the script and configuring the Slack workflow.
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

2.  **Open the Script Editor in your Google Sheet:**
    * In your Google Sheet, go to "Extensions" > "Apps Script".

3.  **Copy and Paste the Code:**
    * Delete any existing code in the script editor.
    * Copy the provided Google Apps Script code and paste it into the script editor.

4.  **Configure the Script:**
    * Locate the `// --- Configuration ---` section at the beginning of the `triggerWeeklyReminder` function.
    * Replace the placeholder values with your actual information:
        * `const sheetName = "";` **Replace with the name of your Google Sheet.** (e.g., `"Presentations"`)
        * `const presenterColumnHeader = "";` **Replace with the header of the column containing the presenter names.** (e.g., `"Presenter Name"`)
        * `const currentIndexCell = "";` **Replace with the cell address that contains the current presenter index.** (e.g., `"A1"`)
        * `const slackWebhookUrl = "";` **Replace with the Webhook URL of the *Trigger* step in your Slack Workflow (see step 6).**
        * `const numberOfPresenters = ;` **Replace with the total number of presenters in your list.** (e.g., `5`)

5.  **Save the Script:**
    * Click the floppy disk icon (Save project) and give your script a name (e.g., "Slack Presenter Trigger").

6.  **Create a Slack Workflow with a Webhook Trigger:**
    * In your Slack workspace, navigate to "Automations" in the left sidebar.
    * Click "Create workflow".
    * Choose "Webhook" as the trigger.
    * Give your workflow a name (e.g., "Weekly Presenter Announcement").
    * Click "Add step". This is where you'll define what happens when the webhook is called. Typically, you'll want to "Send a message" to your desired channel.
    * **Copy the Webhook URL provided by Slack at the "Webhook" trigger step.** You will need to paste this into the `slackWebhookUrl` variable in your Google Apps Script (step 4).
    * In the "Send a message" step, you can use variables from the webhook payload to include the presenter's name. For example, if your script sends `{"presenter": "John Doe", "currentIndex": 2}`, you can access these in your message as `{{data.presenter}}` and `{{data.currentIndex}}`.
    * Add any other steps you want in your workflow (e.g., formatting the message, adding reactions, etc.).
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

* Ensure you use the **Webhook URL from the *Trigger* step of your Slack Workflow** in the script's configuration.
* The data sent in the webhook payload from the script (e.g., `presenter`, `currentIndex`) can be accessed as variables within the steps of your Slack Workflow.
* You have more flexibility in formatting the Slack message and adding other actions within the Slack Workflow itself.
* Check the script logs in the Apps Script editor and the workflow execution logs in Slack for any errors or successful runs.

This approach provides a clear separation of concerns: Google Apps Script handles the data retrieval and scheduling, while Slack Workflow manages the messaging and any other Slack-specific actions. Thanks for clarifying your intended setup! Let me know if you have any more questions.

## Contributing

Feel free to fork this repository and submit pull requests with improvements or bug fixes.
