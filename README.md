# File Storage API

REST API for file management with JWT authentication.

---

## Stack

Node.js · Express · MySQL · Prisma ORM · JWT

---

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/MaksimBurakou/erp-aero-test.git
cd erp-aero-test
npm install
```

Create a `.env` file based on `.env.example`:

```
PORT=5000
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=password
DATABASE_NAME=erp_aero
DB_CONNECTION_LIMIT=5
DATABASE_URL=mysql://root:password@localhost:3306/erp_aero
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

Apply migrations and start the server:

```bash
npx prisma migrate dev
npm run dev
```

---

## Authentication

The API uses Bearer tokens. Access token is valid for 10 minutes, refresh token for 7 days.
Refresh tokens are single-use, once used, the old token is invalidated and a new pair is issued.

Multiple devices can be logged in simultaneously under the same account.
Logging out only invalidates the token pair of the current device, other sessions remain active.

---

## Endpoints

**Auth**

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/signup` | Register a new user | — |
| POST | `/signin` | Log in | — |
| POST | `/signin/new_token` | Refresh token pair | — |
| GET | `/info` | Get current user data | ✓ |
| GET | `/logout` | Log out | ✓ |

**Files**

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/file/upload` | Upload a file | ✓ |
| GET | `/file/list` | Get paginated file list | ✓ |
| GET | `/file/:id` | Get file info | ✓ |
| GET | `/file/download/:id` | Download a file | ✓ |
| PUT | `/file/update/:id` | Replace a file | ✓ |
| DELETE | `/file/delete/:id` | Delete a file | ✓ |

---
