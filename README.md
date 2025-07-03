# Nyasha WhatsApp Bot

A simple WhatsApp bot using `@whiskeysockets/baileys` and the Google Gemini API, embodying the persona of Nyasha Munyanyiwa, a 16-year-old boy from Magwegwe North, Zimbabwe.

The bot is designed to respond to messages with as few words as possible to mimic human-like, casual teen conversation.

## Features

*   Connects to WhatsApp using phone number linking (via QR code on initial run).
*   Uses Google Gemini API for generating responses.
*   Maintains a specific persona (16-year-old Zimbabwean teenager).
*   Keeps responses minimal and casual.
*   Persists session data in the `baileysauthinfo` folder to avoid re-linking on restarts.

## Prerequisites

*   Node.js (v14 or higher recommended)
*   npm or yarn package manager
*   Git
*   A WhatsApp account to link the bot to.
*   A Google Gemini API key.

## Setup and Deployment to Render

Since platforms like Render don't provide interactive terminals for scanning QR codes, the recommended approach is to **generate the initial session files (`baileysauthinfo` folder) using a temporary environment like Replit or running locally the very first time.**

**Step 1: Clone the Repository**

Clone this repository to your local machine.


**Step 2: Initial Pairing (Using Replit or Locally)**

This step generates the `baileysauthinfo` folder needed for persistence.

*   **Option A (Using Replit - Recommended for generating session files for cloud deployment):**
    1.  Create a new Node.js repl on Replit.
    2.  Upload the `index.js`, `package.json`, and `.gitignore` files from this repository.
    3.  **Crucially:** Set the environment variable `GEMINI_API_KEY` in Replit's "Secrets" or "Environment Variables" settings with your Google Gemini API key.
    4.  Run the repl.It will automatically install dependencies and then display a QR code in the Replit console.
    5.  Open WhatsApp on your phone (the one with number +263 71 667 6259), go to `Settings` > `Linked Devices` > `Link a Device`, and scan the QR code displayed in the Replit console.
    6.  Once linked, the Replit console should show "Connection opened! Nyasha is online!".
    7.  **Important:** Stop the Replit instance. In the Replit file explorer, you will now see a new folder named `baileysauthinfo`. Download this entire folder to your local machine.

*   **Option B (Running Locally Temporarily):**
    1.  Make sure you have Node.js and npm installed.
    2.  Run `npm install` in the project directory on your local machine.
    3.  Create a file named `.env` in the root directory and add `GEMINI_API_KEY=YOUR_GEMINI_API_KEY` (replace with your actual key).
    4.  Run `node index.js`.
    5.  Scan the QR code displayed in your local terminal using WhatsApp on your phone.
    6.  Once linked, the `baileysauthinfo` folder will be created in your project directory.
    7.  Stop the script (`Ctrl+C`).
    8.  **Delete the `.env` file** before pushing to your public repository.

**Step 3: Add Session Files to Your Repository**

1.  Copy the downloaded `baileysauthinfo` folder (from Replit or your local run) into the root of your local repository clone.
2.  If you uncommented `/baileysauthinfo` in `.gitignore` during the local run, comment it back out or remove that line entirely so that Git tracks the folder.
3.  Add the new folder and its contents to Git:
    ```
bash
    git add baileysauthinfo
    git commit -m "Add WhatsApp session files"
    
**Step 4: Deploy to Render**

1.  Go to your Render Dashboard.
2.  Click "New" and select "Web Service".
3.  Connect your Git repository where you pushed the code (including the `baileysauthinfo` folder).
4.  Render should automatically detect it's a Node.js project.
5.  Configure the web service settings:
    *   **Root Directory:** Leave empty unless your code is in a subdirectory.
    *   **Build Command:** `npm install` (Render detects this automatically from `package.json`)
    *   **Start Command:** `node index.js` (Render detects this automatically from `package.json`'s `start` script)
    *   **Environment Variables:** Add a secret environment variable named `GEMINI_API_KEY` and paste your Google Gemini API key as its value.
    *   **Instance Type:** Choose a suitable plan (e.g., Free or Starter for testing).
    *   **Auto-Deploy:** Set to `Yes` for automatic deployments on push.
6.  Click "Create Web Service".

Render will now build and deploy your bot. It will use the `baileysauthinfo` folder from your repository to resume the previously linked session. The console output on Render won't show a QR code again unless the session breaks entirely (e.g., if you link the phone to another device and choose "Log out").

**Important Security Note:** Storing session files (`baileysauthinfo`) in a public Git repository is **not recommended** as it can expose your WhatsApp session. If your repository is private, the risk is reduced but still exists if the repo is compromised. For higher security, you might explore alternative methods like storing session data in a database or cloud storage, though this requires more complex coding. This guide provides the simplest method for deployment using Render's standard features.

## Running Locally (After Initial Pairing)

After you have generated the `baileysauthinfo` folder and set the `GEMINI_API_KEY` environment variable (e.g., using a `.env` file and a package like `dotenv`), you can run the bot locally:

1.  `npm install`
2.  `export GEMINI_API_KEY=YOUR_GEMINI_API_KEY` (or use a `.env` file and `dotenv`)
3.  `npm start` or `node index.js`

The bot should connect using the saved session data.



