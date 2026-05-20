# Cloudflare Worker Telemetry Setup Guide

This folder contains a ready-to-deploy **Cloudflare Worker** that securely registers and serves anonymous global deletion metrics for your **History Wiper** extensions and landing page.

It runs 100% for free on Cloudflare Workers and utilizes a Cloudflare KV (Key-Value) store as your database.

---

## ⚡ Deployment Steps (Takes 2 Minutes)

### 1. Create a Cloudflare Worker
1. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and log in (or register a free account).
2. On the sidebar, click **Workers & Pages** ➜ **Overview** ➜ **Create application** ➜ **Create Worker**.
3. Set the name of your worker to **`history-wiper-api`**.
4. Click **Deploy**.

### 2. Paste the Code
1. Click **Edit code** inside your newly created worker.
2. Replace all the code inside the editor with the contents of the local file [server/worker.js](file:///c:/Users/MehmetCan/Desktop/Code/History%20Wiper/server/worker.js).
3. Click **Save and Deploy**.

### 3. Create & Bind a KV Namespace (Database)
Cloudflare Workers use **KV Namespaces** to store database states like your total count.
1. Go back to your Cloudflare Dashboard under **Workers & Pages** ➜ **KV**.
2. Click **Create namespace**. Set the name to **`HISTORY_WIPER_KV`** and click **Add**.
3. Now go back to **Workers & Pages** ➜ **Overview** ➜ Click your **`history-wiper-api`** worker.
4. Click **Settings** ➜ **Variables**.
5. Scroll down to **KV Namespace Bindings** and click **Add binding**.
6. Set the **Variable name** strictly to: **`HISTORY_WIPER_KV`**.
7. Set the **KV namespace** to the **`HISTORY_WIPER_KV`** namespace you created in step 2.
8. Click **Save and deploy**.

### 4. Initialize Counter (Optional)
If you want to start your worldwide counter at a specific number (like `1,842,910`):
1. In the **KV** tab, click your **`HISTORY_WIPER_KV`** namespace.
2. Click **Add Key**.
3. Set Key to `total_deleted` and Value to your starting count (e.g., `1842910`).
4. Click **Save**.

---

🚀 **All Set!** 
Your backend is live at: `https://history-wiper-api.mehmetcanwt.workers.dev`.
The extension background script and React landing page are already configured to connect to this API endpoint to serve and increment authentic deletion statistics officially!
