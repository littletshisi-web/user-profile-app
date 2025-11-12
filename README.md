# User Profile App

A small Node.js + Express + MongoDB demo for user registration, login, and profile updates.

This repository contains a minimal example app intended for learning and light demos. It uses JWT-based authentication with the token stored in an HttpOnly cookie.

## Features

- Register and login with username/password
- Passwords hashed with bcryptjs
- JWT issued at login and stored as an HttpOnly cookie
- Profile view and update endpoints
- Simple static UI in public/ and views/
- Dockerized for consistent deployment

## Environment

Create a .env file in the project root with the following variables:

```
MONGO_URI=mongodb+srv://littletshisi_db_user:password@cluster0.zoejifh.mongodb.net/user-profile-app?retryWrites=true&w=majority
JWT_SECRET=your_secret_here
PORT=3000
NODE_ENV=development
```

Do NOT commit .env to source control. A .env.example file is provided.

## Local Development

### Option 1: Node.js (direct)

```bash
npm install
npm run dev   # uses nodemon for local development
# or
npm start     # production start
```

Open http://localhost:3000 to view the app. The server exposes a health endpoint at /health.

### Option 2: Docker

Build and run the app in a container:

```bash
# Build the Docker image
docker build -t user-profile-app:latest .

# Run the container
docker run -p 3000:3000 \
  -e MONGO_URI="mongodb+srv://user:password@cluster0.xxx.mongodb.net/user-profile-app?retryWrites=true&w=majority" \
  -e JWT_SECRET="your-secret-key" \
  user-profile-app:latest
```

### Option 3: Docker Compose (recommended for local dev)

```bash
# Build and start the app (with optional local MongoDB)
docker-compose up

# Start with MongoDB service (use 'dev' profile)
docker-compose --profile dev up

# Stop all services
docker-compose down
```

## Project Structure

```
.
 servers.js              # Application entrypoint
 Dockerfile              # Docker image definition
 docker-compose.yml      # Multi-service orchestration
 .dockerignore           # Files to exclude from Docker build
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

## Deployment

### Render (Node.js or Docker)

#### Option A: Node.js Service (current setup)
- Ensure package.json and package-lock.json are committed and up to date.
- Set environment variables on the service: MONGO_URI, JWT_SECRET, NODE_ENV=production.
- Use the command npm start as the start command.

#### Option B: Docker Service (full control)
- Render can deploy Docker images directly.
- Push your Docker image to Docker Hub or use Render's Docker build.
- Benefits: exact runtime control, consistent across environments.

### Local Docker Testing

Test your Docker setup before pushing to production:

```bash
# Build the image
docker build -t user-profile-app:test .

# Run and test
docker run -p 3000:3000 \
  -e MONGO_URI="<your-atlas-uri>" \
  -e JWT_SECRET="test-secret" \
  user-profile-app:test

# Test the health endpoint
curl http://localhost:3000/health
```

Expected response: `{ "status":"OK", "message":"Server is running" }`

## MongoDB Atlas Configuration

- Ensure your MongoDB Atlas cluster has Network Access whitelisted (add 0.0.0.0/0 for testing; restrict for production).
- Database name: user-profile-app
- Connection string format: mongodb+srv://username:password@cluster0.xxx.mongodb.net/user-profile-app?retryWrites=true&w=majority

## Security & Hardening

- **HttpOnly Cookies**: JWTs are stored in an HttpOnly cookie to protect against XSS-based token theft.
- **CSRF**: Consider adding CSRF protections (double-submit cookie or CSRF token) if you add state-changing POST endpoints used from browsers.
- **HTTPS**: Use HTTPS (TLS) in production and set secure: true on cookies.
- **Credentials**: Do not expose JWT_SECRET or database credentials in source control.
- **Docker**: Runs as non-root user (nodejs) for added security. Uses dumb-init for proper signal handling.

## Scripts

- \
pm start\  Start the server (production)
- \
pm run dev\  Start with nodemon for local development (watches for changes)
- \
pm test\  Run tests (configure in package.json)
- \
pm run lint\  Lint code with ESLint

## Docker Image Details

- **Base Image**: node:25-alpine (small, lightweight)
- **Multi-stage Build**: Reduces final image size by excluding build dependencies
- **Non-root User**: Runs as nodejs user (UID 1001) for security
- **Health Check**: Built-in Docker health checks via /health endpoint
- **Signal Handling**: Uses dumb-init to gracefully handle SIGTERM/SIGINT

## Contributing

This is a small demo; open an issue or a PR if you have improvements.

## License

MIT (or update with your preferred license)
