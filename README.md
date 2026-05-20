# History Wiper 🧹

History Wiper is a modern browser extension designed to help you maintain your digital privacy by automatically clearing specific URLs or keywords from your browser history at scheduled intervals.

![History Wiper Logo](public/logo.png)

## ✨ Features

- **Automated Cleaning:** Clears matched history items every 1 hour (default) or at your preferred interval.
- **Custom URL Watchlist:** Add specific domains or keywords to be targetted for deletion.
- **Manual Wipe:** Trigger an instant clean-up whenever you need it.
- **Dashboard:** Track how many items have been cleared and see when the last operation occurred.
- **Modern UI:** Built with React and Tailwind CSS for a sleek, responsive experience.
- **Privacy First:** All data is stored locally in your browser. No external servers involved.

## 🚀 Installation (Local Development)

1. Clone this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. Open your browser and go to `chrome://extensions/`.
5. Enable **Developer mode** (toggle in the top right).
6. Click **Load unpacked** and select the `dist` folder generated in your project directory.

## 🛠 Tech Stack

- **Framework:** Vite + React + TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Extension API:** Manifest V3, Chrome History, Alarms, and Storage APIs.

---

# 📦 Web Store Publishing Guide

To publish **History Wiper** to the Chrome Web Store or other browser stores, follow these steps:

### 1. Prepare the Build
Run the production build command:
```bash
npm run build
```
This will create a `dist` folder. Zip the **contents** of this folder (not the folder itself) into a file named `history-wiper-v1.0.0.zip`.

### 2. Chrome Web Store Developer Dashboard
1. Go to the [Chrome Web Store Developer Console](https://chrome.google.com/webstore/devconsole/).
2. Pay the one-time developer registration fee (if you haven't already).
3. Click **"New Item"** and upload your `.zip` file.

### 3. Store Listing Assets
You will need to provide:
- **Product Description:** Use a clear explanation of what the extension does.
- **Icons:** You already have the logo. The store requires specific sizes (128x128 is usually enough as it's auto-scaled).
- **Screenshots:** Take at least one screenshot of the Options Page/Dashboard (1280x800 or 640x400).
- **Promotional Tile:** A 440x280 image for the store front.

### 4. Privacy & Permissions
- In the **Privacy** tab, explain why you need the `history` permission (e.g., "To identify and delete specific URLs from the user's history as requested by the user").
- Since this extension interacts with history, Google might review it more strictly. Ensure your description clearly states that data is processed locally.

### 5. Submit for Review
Click **"Submit for Review"**. Reviews usually take 24-72 hours.

---

## 🔒 Privacy Policy
Your privacy is our top priority. For detailed information on how we handle your data, please read our [Privacy Policy](PRIVACY.md).

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
