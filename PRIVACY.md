# Privacy Policy for History Wiper

**Last Updated: May 20, 2026**

History Wiper ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how our browser extension handles your information.

## 1. Data Collection and Usage
History Wiper is designed with a **privacy-first** approach. 
- **No Personal Data Collection:** We do not collect, store, or transmit any personal data, browsing history, or user identifiers to external servers.
- **Local Storage:** All settings, including your "Watched URLs" list and interval preferences, are stored strictly on your local device using the `chrome.storage.local` API.
- **History Access:** The extension uses the `history` permission solely to search for and delete specific URLs that **you** have manually added to the watchlist. This process happens entirely within your browser.
- **Optional Global Counter Telemetry:** Users can choose to participate in our public stats counter by enabling the "Global Counter" option (opt-in by default, can be disabled at any time in settings). When active, the extension transmits the number of deleted items along with a dynamic timestamp, an HMAC cryptographic signature (to verify authenticity), and a randomly generated **anonymous installation ID** (to protect against API spam and duplicates). Absolutely **no URLs, page titles, search keywords, IP logs, or personally identifying information (PII)** are ever transmitted, and the installation ID is completely anonymous and never linked to any personal user accounts. The server only accumulates the numerical sum of deleted items globally to display a public ticker.

## 2. Permissions
- **history:** Required to identify and delete specified entries from your browser's history.
- **storage:** Required to save your URL watchlist and configuration settings locally.
- **alarms:** Required to trigger the automatic cleaning process at your defined intervals.

## 3. Data Sharing
We do not sell, rent, or trade any user information. The anonymous numerical telemetry is used solely to maintain the public deletion ticker and is never shared with third parties. No third-party tracking scripts, trackers, or ad systems are embedded in this extension.

## 4. Changes to This Policy
We may update our Privacy Policy from time to time. Any changes will be reflected by updating the "Last Updated" date at the top of this document.

## 5. Contact
If you have any questions about this Privacy Policy, you can contact the developer through the GitHub repository or the store contact form.
