# Slack Automation Workflows

This repository contains Google Apps Script resources and configurations for automating various tasks within our Slack workspace. It includes scripts to trigger Slack workflows, enhancing communication and streamlining processes.

## Structure

The repository is organized as follows:

* **`/Workflows/`**: This directory contains the configurations and related files for our Slack workflows.
    * **`/Workflows/Presenter-Reminder/`**: This subdirectory houses the files for presenter reminder workflows. It includes:
        * `triggerWeeklyReminder.js`:  A Google Apps Script to trigger a Slack workflow for weekly presenter rotation.
        * `triggerWeeklyReminderBasedOnDate.js`: A more advanced Google Apps Script for triggering Slack workflows based on specific dates within a timeframe.
        * `README.md`: Documentation for setting up and using the presenter reminder workflows (covers both scripts).

## Overview

This repository provides tools to automate routine tasks, send timely notifications, and integrate with other services within our Slack workspace. Workflows are designed to be modular, with each workflow's logic and setup instructions contained within its own subdirectory under `/Workflows/`.  The `Presenter-Reminder` workflow offers two script options to cater to different scheduling needs.

## Getting Started

To use any of the workflows in this repository:

1.  Navigate to the specific workflow's directory (e.g., `/Workflows/Presenter-Reminder/`).
2.  Carefully review the `README.md` file within that directory. It will provide detailed instructions on:
    * The purpose of each script (if there are multiple options).
    * Setup and configuration steps (including Google Sheet setup and Slack workflow creation).
    * Any specific dependencies or requirements.
3.  Choose the script that best fits your needs and follow the instructions.

## Presenter Reminder Workflow: Script Selection

The `/Workflows/Presenter-Reminder/` directory contains two scripts:

* **`triggerWeeklyReminder.js`**:  Use this script for simple weekly rotation of presenters. It's ideal for recurring meetings with a fixed schedule.
* **`triggerWeeklyReminderBasedOnDate.js`**: Use this script for more flexible, date-driven reminders.  It allows you to specify reminder dates within a range, making it suitable for events that don't follow a strict weekly pattern.

The `README.md` in the `/Workflows/Presenter-Reminder/` directory provides comprehensive instructions for both scripts, clearly outlining their differences and when to use each one.
