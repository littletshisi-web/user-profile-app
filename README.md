# User Profile App

A small Node.js + Express + MongoDB demo for user registration, login, and profile updates.

This repository contains a minimal example app intended for learning and light demos. It uses JWT-based authentication with the token stored in an HttpOnly cookie.

## Features

- Register and login with username/password
- Passwords hashed with bcryptjs
- JWT issued at login and stored as an HttpOnly cookie
- Profile view and update endpoints
- Simple static UI in public/ and iews/

## Environment

Create a .env file in the project root with the following variables:

```
MONGO_URI=mongodb://localhost:27017/user-profile-app
JWT_SECRET=your_secret_here
PORT=3000
NODE_ENV=development
```

Do NOT commit .env to source control. A .env.example file is provided.

## Local Development

Install dependencies and run locally:

```bash
npm install
npm run dev   # uses nodemon for local development
# or
npm start     # production start
```

Open http://localhost:3000 to view the app. The server exposes a health endpoint at /health.

## Project Structure

```
.
 servers.js              # Application entrypoint
 models/
    User.js             # Mongoose schema with password hashing
 routes/
    auth.js             # Login, register, profile endpoints
 public/
    profile.html        # Profile UI
    login.html          # Login page
    js/main.js          # Client-side fetch logic with credentials
 views/
    login.html          # Login form
    register.html       # Registration form
    profile.html        # Profile management
 package.json            # Dependencies and scripts
 .env.example            # Template for environment variables
 .gitignore              # Git ignore rules
 render.yaml             # Render deployment config
```

## Deployment (Render)

To deploy on Render (or any similar host):

- Ensure package.json and package-lock.json are committed and up to date.
- Set environment variables on the service: MONGO_URI, JWT_SECRET, NODE_ENV=production.
- Use the command 
pm start as the start command.
- If using MongoDB Atlas, make sure network access is configured and the URI is correct.

Notes:
- The lockfile must not reference native crypt if the target build environment cannot compile native modules. This project uses cryptjs to avoid native compilation.
- Engines in package.json are set to be compatible with Render's Node version range (>=18 <26).

## Security & Hardening

- **HttpOnly Cookies**: JWTs are stored in an HttpOnly cookie to protect against XSS-based token theft.
- **CSRF**: Consider adding CSRF protections (double-submit cookie or CSRF token) if you add state-changing POST endpoints used from browsers.
- **HTTPS**: Use HTTPS (TLS) in production and set secure: true on cookies.
- **Credentials**: Do not expose JWT_SECRET or database credentials in source control.

## Scripts

- 
pm start  Start the server (production)
- 
pm run dev  Start with nodemon for local development (watches for changes)
- 
pm test  Run tests (configure in package.json)
- 
pm run lint  Lint code with ESLint

## Contributing

This is a small demo; open an issue or a PR if you have improvements.

## License

MIT (or update with your preferred license)
