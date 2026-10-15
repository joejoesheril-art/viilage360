# SmartVillage 360 – Digital Village Management System

A college demo website for villagers: government schemes, agriculture help, notices, complaints, directory and an admin panel. Tamil/English and light/dark mode included.

**This is a DEMO.** Data and login live only in your own browser (localStorage). It is not connected to any government system, and weather/market prices are intentionally not shown because no real, verified source is connected.

## Demo logins
- Villager: demo@village.test / Demo@123
- Admin: admin@village.test / Admin@123

## Put it online (Android phone)
1. Open github.com in Chrome, sign in, tap **+ → New repository**. Name it `smartvillage360`, choose **Public**, tap **Create repository**.
2. Tap **Add file → Create new file**. Name it `index.html`, paste the code, tap **Commit changes**.
3. Repeat for `style.css`, `script.js`, `README.md` (names must match exactly, lowercase).
4. Go to **Settings → Pages**. Under Branch choose `main` and `/ (root)`, tap **Save**.
5. Wait 1–2 minutes. Your site: `https://YOUR-USERNAME.github.io/smartvillage360/`
(If Chrome shows a mobile page, use **⋮ → Desktop site** to see GitHub's full menus.)

## Test checklist
- Language button switches Tamil/English; moon button switches theme.
- Register with wrong data → error messages; correct data → dashboard.
- Schemes/Notices/Directory: type in search and change filters.
- Complaints: log in as villager, submit, note the ID.
- Admin: log in as admin → Complaints tab → change status and response, save → villager sees a notification.
- Admin → Notices: add, edit, delete. Schemes: add/delete. Users: delete. Export CSV buttons download files.
- Reload the page: data is still there. To reset, clear the site data in Chrome.

## Demo-only vs needs backend
| Feature | Now | Real version needs |
|---|---|---|
| Login/roles | Demo, browser only | Server auth, hashed passwords (bcrypt/argon2), server-side role checks |
| Complaints, notices, users | localStorage | API + PostgreSQL/MySQL |
| Photo upload | File name only | Secure upload with type/size checks and storage |
| Weather, market prices | Not shown | Backend calling a real API; show source and date |
| Rate limiting, validation | Basic form checks | Server validation, rate limits, HTTPS |

## Upgrade plan
1. Backend (Node/Express or Django) with REST API; keep API keys and DB passwords in environment variables only.
2. PostgreSQL tables: users, complaints, announcements, schemes, notifications.
3. Login with hashed passwords and secure session cookies or JWT; check roles on every admin endpoint.
4. Validate all input, add rate limiting, secure uploads, and a privacy policy.
5. Change script.js to call the API instead of localStorage.
