# 🚀 Browser Extension Stores Publishing Guide

This guide provides step-by-step instructions on how to publish **History Wiper** to the Google Chrome Web Store and the Microsoft Edge Add-ons store.

---

## 📦 Step 1: Package Your Extension for Production

Before uploading to any store, you must create a production build and compress its contents.

1. **Clean & Build:**
   Run the full project build command in your terminal:
   ```bash
   npm run build
   ```
   * This generates two directories:
     * `dist/` - Contains the fully compiled, optimized Chrome Extension.
     * `docs/` - Contains your React landing page (for GitHub Pages).

2. **Zip the Extension:**
   * Open the **`dist`** folder.
   * Select **all files and folders inside** `dist/` (e.g., `assets`, `manifest.json`, `options.html`, `popup.html`, etc.).
   * Right-click and choose **Compress to ZIP file** (or use your zip tool).
   * Name your file something recognizable, like `history-wiper-extension.zip`.
   * **⚠️ CRITICAL:** Do *NOT* zip the parent `dist` folder itself. Zip only the *contents* inside the `dist` folder so that `manifest.json` sits at the very root level of the ZIP file.

---

## 🌐 Step 2: Publish to Google Chrome Web Store

### 1. Register a Developer Account
1. Go to the [Chrome Web Store Developer Console](https://chrome.google.com/webstore/devconsole/).
2. Log in with a Google account.
3. Pay the one-time developer registration fee of **$5 USD** (required by Google to prevent spam accounts).

### 2. Create and Upload Your Item
1. On the dashboard, click the **"Add new item"** (or **"New Item"**) button.
2. Select your zipped file (`history-wiper-extension.zip`) and click upload.

### 3. Fill Out Store Listing Metadata
Provide the following information:
* **Product Name:** `History Wiper` (Auto-extracted from manifest.json).
* **Summary (150 chars):** `Automatically search, match, and wipe targeted URLs and page titles from your history at scheduled intervals.`
* **Detailed Description:**
  ```text
  Take control of your browsing privacy today with History Wiper! 

  History Wiper is a modern, lightweight, privacy-focused browser extension designed to automatically delete targeted URLs and keywords from your local browsing history at scheduled intervals.

  ✨ KEY FEATURES:
  - 🔄 Automated Sweeps: Set background cleaning sweeps to trigger every 30 minutes, 1 hour, 6 hours, 12 hours, or 24 hours.
  - 📝 Advanced Keyword Matching: Matches and deletes history items based on both Webpage URLs and page titles case-insensitively.
  - 🛡️ Accident Safety Guard: Restricts rules to 2+ characters to prevent shorthand inputs (like spaces or single letters) from clearing broad history.
  - ⚡ Instant Manual Wipe: Trigger a sweep manually directly from the extension popup at any time.
  - 📊 Real-time Community Telemetry: See how many items are being wiped globally by our community! Fully opt-in and 100% anonymous.
  - 🔒 100% Local Processing: All scanning and deletion processes run inside your browser sandboxed local environment. Your URLs never leave your computer.
  ```

### 4. Provide Graphic Assets
Prepare and upload:
* **Extension Icon:** Upload the `public/logo.png` (or a 128x128 pixel png).
* **Screenshots (1-5):** Take screenshots of the extension's **Popup Window** and the **Options Dashboard**.
  * Recommended resolution: `1280x800` or `640x400`.
* **Small Promotional Tile:** A `440x280` px promotional image.

### 5. Configure Privacy Practices (Important!)
Because History Wiper requests the `history` and `storage` permissions, Google requires you to complete the privacy tab:
* **Single-purpose description:** `"The extension enables users to automatically filter and clear specific URLs or keywords from their browsing history."`
* **Permission Justification:**
  * `history` - `"To query and delete matching history entries from the local browser storage as customized by the user."`
  * `storage` - `"To store the user's custom watchlist patterns, interval settings, and local stats count securely."`
* **Data Usage:** Select that you do **not** sell user data, do **not** use it for advertising, and process everything locally.
* **Privacy Policy URL:** Enter your official GitHub Pages URL:
  `https://mehmetcanwt.github.io/History-Wiper/` (or `https://github.com/MehmetCanWT/History-Wiper/blob/main/PRIVACY.md`).

### 6. Submit for Review
Click **"Submit for Review"**. 
* Under MV3 (Manifest V3), Google's automated systems and human reviewers usually approve updates within **24 to 72 hours**.

---

## 🌀 Step 3: Publish to Microsoft Edge Add-ons (Optional)

Microsoft Edge uses the same chromium format, meaning your zip works here out of the box!

1. Go to the [Microsoft Partner Center](https://partner.microsoft.com/dashboard/microsoftedge/public/login).
2. Sign in with a Microsoft account (Registration is **100% free**).
3. Click **"Create new extension"** and upload your `history-wiper-extension.zip`.
4. Fill in the listing details, upload your `logo.png` and screenshots.
5. Provide the same permission justifications for `history` and `storage`.
6. Submit. Approval on Edge usually takes **1-3 days**.

---

## 🛠️ Local Verification & Development Testing

Before submitting your zip, always test your unpacked extension locally:
1. Navigate to `chrome://extensions/` in your Chrome browser.
2. Enable the **"Developer mode"** toggle in the top right.
3. Click **"Load unpacked"**.
4. Select your compiled **`dist`** directory.
5. Make sure the extension icon appears, you can open the options dashboard, add patterns, change intervals, and run manual wipes without errors.
