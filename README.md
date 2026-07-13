# SpotMe - Intelligent Event Photo Sharing

**SpotMe** is a modern, high-performance web application designed for seamless event photo sharing and automated facial recognition. Instead of scrolling through hundreds of photos to find yourself after a wedding, party, or conference, SpotMe uses AI face-embeddings to "spot" you. By uploading a single reference photo (selfie), you can instantly view and download all photos from an event that feature your face.

---

##  Key Features

*   **Smart Face-Spotting**: Leverage PostgreSQL `pgvector` to run cosine similarity matches between user reference faces and event photos.
*   **Asynchronous Processing**: Scalable processing of image uploads and facial recognition using **BullMQ** and **Redis**.
*   **Google Photos & Drive Sync**: Directly import and sync albums from Google Drive / Google Photos.
*   **Real-time Progress Updates**: Instant frontend notifications via **Socket.io** when uploads are processed or matching photos are found.
*   **On-the-fly Client Compression**: Automatically compress high-resolution photos using `browser-image-compression` to ensure fast and lightweight uploads.
*   **One-Click Batch Downloads**: Package your spotted photos into a ZIP archive dynamically using `jszip`.
*   **Secure Authentication**: Fully fledged authentication powered by **Better Auth**, supporting Email/Password verification and Google OAuth.

---

##  Architecture & Tech Stack

### Frontend
*   **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vite.dev/)
*   **Styling**: [TailwindCSS v4](https://tailwindcss.com/) + [Material UI (MUI)](https://mui.com/)
*   **State Management & Data Fetching**: [Zustand](https://github.com/pmndrs/zustand) + [TanStack React Query](https://tanstack.com/query/latest)
*   **Real-time Networking**: [Socket.io Client](https://socket.io/docs/v4/client-api/)
*   **UI Components**: `react-photo-album` (masonry grid), `yet-another-react-lightbox` (lightbox viewer)

### Backend
*   **Framework**: [Express.js](https://expressjs.com/) with TypeScript
*   **Database & ORM**: PostgreSQL with [pgvector](https://github.com/pgvector/pgvector) + [Prisma ORM](https://www.prisma.io/)
*   **Task Queue & Workers**: [BullMQ](https://bullmq.io/) + Redis
*   **Authentication**: [Better Auth](https://www.better-auth.com/) + Google OAuth Client
*   **Media Storage**: [Cloudinary](https://cloudinary.com/) (image hosting)
*   **Email Deliverability**: [Nodemailer](https://nodemailer.com/) (SMTP mailer)

---

##  Project Structure

```
SpotMe/
├── backend/                  # Express API Server & BullMQ Worker
│   ├── prisma/               # Schema configuration & migrations
│   │   ├── migrations/       # SQL migrations including pgvector init
│   │   └── schema.prisma     # Prisma database models
│   ├── src/
│   │   ├── config/           # Auth, Redis, Rate Limiter configs
│   │   ├── controllers/      # Route controllers (Event, Photo, Upload)
│   │   ├── jobs/             # BullMQ queue processors & workers
│   │   ├── queues/           # BullMQ queue definitions
│   │   ├── routers/          # API route definitions
│   │   ├── utils/            # Shared utilities & mock embeddings
│   │   ├── app.ts            # App initialization
│   │   └── server.ts         # Express server startup
│   ├── tsconfig.json
│   └── package.json
├── frontend/                 # React Single Page Application (SPA)
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable components (Navbar, PhotoGrid)
│   │   ├── hooks/            # Custom React Query & API hooks
│   │   ├── pages/            # Core views (Landing, Dashboard, EventDetails, FindMeTab)
│   │   ├── routes/           # React Router router setup
│   │   ├── App.tsx           # Entry wrapper
│   │   └── main.tsx          # DOM mounting point
│   ├── tsconfig.json
│   └── package.json
└── README.md                 # Project README
```

---

##  Getting Started & Setup

### Prerequisites
1.  **Node.js**: Ensure you have Node.js (v18+) installed.
2.  **PostgreSQL**: A running instance with the `pgvector` extension installed.
3.  **Redis**: A running Redis instance (e.g. locally or via Upstash Redis).

---

### Backend Setup

1.  **Navigate and install dependencies**:
    ```bash
    cd backend
    npm install
    ```

2.  **Configure Environment Variables**:
    Create a `.env` file in the `backend/` directory with the following variables (refer to `.env` template):
    ```ini
    PORT=5000
    QUEUE_PORT=5001
    BETTER_AUTH_SECRET=your_better_auth_secret_key
    BETTER_AUTH_URL=http://localhost:5000
    FRONTEND_ORIGIN=http://localhost:5173

    # Database
    DATABASE_URL="postgresql://username:password@localhost:5432/spotme?schema=public"
    DIRECT_URL="postgresql://username:password@localhost:5432/spotme?schema=public"

    # Cloudinary Credentials
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret

    # Auth & Integration
    CLIENT_ID=your_google_oauth_client_id
    CLIENT_SECRET=your_google_oauth_client_secret

    # Redis Configurations
    REDIS_URL="redis://localhost:6379"

    # Nodemailer Credentials
    EMAIL=your_smtp_sender_email@gmail.com
    EMAIL_PASSKEY=your_gmail_app_passkey
    ```

3.  **Database Migration & Client Generation**:
    Deploy migrations (which will automatically enable the `vector` extension and set up tables) and generate the Prisma Client:
    ```bash
    npm run db:migrate
    npm run db:generate
    ```

4.  **Start Services**:
    In separate terminals, start the API server and the BullMQ background queue worker:
    *   **API Server**:
        ```bash
        npm run dev
        ```
    *   **Queue Worker**:
        ```bash
        npm run queue
        ```

---

### Frontend Setup

1.  **Navigate and install dependencies**:
    ```bash
    cd frontend
    npm install
    ```

2.  **Configure Environment Variables**:
    Create a `.env` file in the `frontend/` directory:
    ```ini
    VITE_SERVER_BASE_URL=http://localhost:5000
    ```

3.  **Start Vite Dev Server**:
    ```bash
    npm run dev
    ```
    The application will be accessible at [http://localhost:5173](http://localhost:5173).

---

##  Face-Spotting Workflow

1.  **Create Event**: Host logs in, creates a new event, and gets an invite link.
2.  **Invite Guests**: Guests click the invite link to join the event and link their account.
3.  **Upload Images**: The host (or guests, depending on permissions) uploads photos. Images are compressed on the client side, uploaded to Cloudinary, and queued for facial recognition.
4.  **Extract Face Embeddings**: The BullMQ queue picks up the new photos and extracts 512-dimension face vectors.
5.  **Scan/Spot**: A guest goes to the "Find Me" tab, uploads their reference face (which gets vectorized), and the system executes a similarity query using `pgvector` cosine distance.
6.  **Download**: The guest instantly views their spotted pictures and downloads them as a neat ZIP archive!
