# User Profile App

A small Node.js + Express + MongoDB demo for user registration, login, and profile updates.

This repository contains a minimal example app intended for learning and light demos. It uses JWT-based authentication with the token stored in an HttpOnly cookie.

## Features

- Register and login with username/password
- Passwords hashed with bcryptjs
- JWT issued at login and stored as an HttpOnly cookie
- Profile view and update endpoints
- Simple static UI in `public/` and `views/`

## Environment

Create a `.env` file in the project root with the following variables:

```
MONGO_URI=mongodb://localhost:27017/user-profile-app
JWT_SECRET=your_secret_here
PORT=3000
NODE_ENV=development
```

Do NOT commit `.env` to source control. A `.env.example` file is provided.

## Local Development

Install dependencies and run locally:

```powershell
cd "C:\Users\tshis_jj4yzyb\Downloads\program and deployment\user-profile-app"
npm install
npm run dev   # uses nodemon for local development
# or
npm start     # production start
```

Open http://localhost:3000 to view the app. The server exposes a health endpoint at `/health`.

## Deployment (Render)

To deploy on Render (or any similar host):

- Ensure `package.json` and `package-lock.json` are committed and up to date.
- Set environment variables on the service: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`.
- Use the command `npm start` as the start command.
- If using MongoDB Atlas, make sure network access is configured and the URI is correct.

Notes:
- The lockfile must not reference native `bcrypt` if the target build environment cannot compile native modules. This project uses `bcryptjs` to avoid native compilation.
- Engines in `package.json` are set to be compatible with Render's Node version range.

## Security & Hardening

- JWTs are stored in an HttpOnly cookie to protect against XSS-based token theft.
- Consider adding CSRF protections (double-submit cookie or CSRF token) if you add state-changing POST endpoints used from browsers.
- Use HTTPS (TLS) in production and set `secure: true` on cookies.
- Do not expose `JWT_SECRET` or database credentials in source control.

## Tests & Linting

- `npm run lint` is provided for lint checks (project uses ESLint configuration). Adjust if your shell environment treats operators differently.

## Contributing

This is a small demo; open an issue or a PR if you have improvements.

---

Generated and updated README by assistant to improve maintainability.
