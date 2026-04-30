# Cloud Intellect Backend API

Backend API for Cloud Intellect Admin Panel built with Node.js, Express, and MongoDB.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env` file:
- Set `MONGODB_URI` (local MongoDB or MongoDB Atlas connection string)
- Set `JWT_SECRET` (use a strong random string)
- Set `FRONTEND_URL` and `ADMIN_URL` if needed

### 3. Set Up MongoDB

📖 **Detailed MongoDB Setup Guide**: See [MONGODB_SETUP.md](./MONGODB_SETUP.md) for complete instructions.

**Quick Start:**

**Option A: MongoDB Atlas (Cloud - Recommended)**
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free cluster (M0)
3. Create database user and whitelist your IP
4. Get connection string and update `MONGODB_URI` in `.env`

**Option B: Local MongoDB**
1. Install MongoDB on your machine
2. Start MongoDB service
3. Update `MONGODB_URI` in `.env` to: `mongodb://localhost:27017/cloudintellect`

See [MONGODB_SETUP.md](./MONGODB_SETUP.md) for detailed installation steps for macOS, Windows, and Linux.

### 4. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000` (or the PORT specified in `.env`)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Alumni
- `GET /api/alumni` - Get all alumni
- `GET /api/alumni/:id` - Get single alumnus
- `POST /api/alumni` - Create alumnus (requires auth)
- `PUT /api/alumni/:id` - Update alumnus (requires auth)
- `DELETE /api/alumni/:id` - Delete alumnus (requires auth)
- `PUT /api/alumni/reorder` - Reorder alumni (requires auth)

### Batches
- `GET /api/batches` - Get all batches
- `GET /api/batches/:id` - Get single batch
- `POST /api/batches` - Create or update batch (requires auth)
- `PUT /api/batches/:id` - Update batch (requires auth)
- `DELETE /api/batches/:id` - Delete batch (requires auth)

### Success Stories
- `GET /api/success-stories` - Get all success stories
- `GET /api/success-stories/:id` - Get single story
- `POST /api/success-stories` - Create story (requires auth)
- `PUT /api/success-stories/:id` - Update story (requires auth)
- `DELETE /api/success-stories/:id` - Delete story (requires auth)
- `PUT /api/success-stories/reorder` - Reorder stories (requires auth)

### Webinars
- `GET /api/webinars/topics` - Get all webinar topics
- `POST /api/webinars/topics` - Create topic (requires auth)
- `PUT /api/webinars/topics/:id` - Update topic (requires auth)
- `DELETE /api/webinars/topics/:id` - Delete topic (requires auth)
- `GET /api/webinars/who-should-attend` - Get all who should attend items
- `POST /api/webinars/who-should-attend` - Create item (requires auth)
- `PUT /api/webinars/who-should-attend/:id` - Update item (requires auth)
- `DELETE /api/webinars/who-should-attend/:id` - Delete item (requires auth)

### File Upload
- `POST /api/upload` - Upload single file (requires auth)
- `POST /api/upload/multiple` - Upload multiple files (requires auth)

## Authentication

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Database Models

### User
- username, email, password, role, isActive

### Alumni
- name, company, specialization, description, image, order, isActive

### Batch
- id, icon, bannerBg, title, description, batchStart, nextBatch, linkText, linkHref, isOpen

### SuccessStory
- name, time, profileImage, rating, text, readMoreUrl, order, isActive

### WebinarTopic
- title, description, icon, order, isActive

### WhoShouldAttend
- title, description, icon, order, isActive

## Creating First Admin User

You can create the first admin user using the register endpoint:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@cloudintellect.com",
    "password": "admin123",
    "role": "admin"
  }'
```

Or use a MongoDB client to insert directly into the database.
