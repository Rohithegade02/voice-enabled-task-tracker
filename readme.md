# Voice Enabled Task Tracker

A full-stack application for managing tasks with voice command capabilities.

## 1. Project Setup

### a. Prerequisites
- **Node.js**: v18+ recommended
- **MongoDB**: Running instance (Local or Atlas)
- **API Keys Required**:
  - AssemblyAI (Voice Transcription)
  - Google Gemini (Text Parsing)

### b. Backend Install & Run
1. Navigate to: `cd backend`
2. Install: `npm install`
3. Configure Environment: Create `.env.local` file
   ```env
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/tasktracker
   ASSEMBLYAI_API_KEY=your_key_here
   GEMINI_API_KEY=your_key_here
   ```
4. Start Server: `npm run dev`

### c. Frontend Install & Run
1. Navigate to: `cd frontend`
2. Install: `yarn install`
3. Start Dev Server: `yarn dev`
4. Access at: `http://localhost:5173`

## 2. Tech Stack

### Backend
- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **AI Services**: 
  - **AssemblyAI**: High-accuracy Speech-to-Text
  - **Google Gemini**: Natural Language Understanding (Date/Intent extraction)
- **File Handling**: Multer

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: TailwindCSS v4 + Shadcn UI
- **State Management**: Zustand
- **Drag & Drop**: @dnd-kit (Kanban board)
- **Utilities**: date-fns, axios, lucide-react

## 3. API Documentation

### Task Endpoints
- **GET** `/api/tasks`
  - Fetch all tasks. Supports optional query filters.
- **POST** `/api/tasks`
  - Create a new task.
  - Body: `{ "title": "...", "priority": "High" }`
- **PUT** `/api/tasks/:id`
  - Update task details.
  - Body: `{ "status": "Done" }` or any partial update.
- **DELETE** `/api/tasks/:id`
  - Remove a task permanently.

### AI Endpoints
- **POST** `/api/tasks/parse-voice`
  - Upload an audio file/blob for AI processing.
  - **Body**: `FormData` with key `audio`.
  - **Response**: `{ transcript: "...", parsedTask: { ... } }`
- **POST** `/api/tasks/parse-text`
  - Parse raw text string into structured task data.
  - **Body**: `{ "text": "Fix bug by Friday" }`

## 4. Backend Code Architecture

The backend follows **Clean Architecture** principles to separate concerns and ensure scalability.
*📖 Recommended Reading: [Clean Architecture in Node.js](https://medium.com/@ben.dev.io/clean-architecture-in-node-js-39c3358d46f3)*

### 📂 Directory Structure (`src/`)

#### 1. **Domain Layer** (`/domain`)
*The core business logic. Completely isolated from external libraries (DB, web frameworks).*
- **`/entities`**:
  - `Task.ts`: Defines the Task model with pure business rules (e.g., validation, status changes).
- **`/interfaces`**:
  - `ITaskRepository.ts`: Contract defining how data *should* be saved/retrieved. (Infrastructure implements this).
- **`/usecases`**:
  - `CreateTask.ts`, `UpdateTask.ts`, etc.: Application-specific business rules. Orchestrates data flow between Entities and Repositories.

#### 2. **Infrastructure Layer** (`/infrastructure`)
*Implementations of external tools and database logic.*
- **`/database`**:
  - `TaskRepository.ts`: Implements `ITaskRepository`. Uses Mongoose to talk to MongoDB.
- **`/services`**:
  - `GeminiParserService.ts`: Implements AI parsing logic.
  - `VoiceParsingService.ts`: Handles audio file processing via AssemblyAI.

#### 3. **Interface Adapters** (`/interfaces`)
*Connects the outside world (Web/HTTP) to the Application.*
- **`/controllers`**:
  - `TaskController.ts`: Handles HTTP requests/responses. Calls UseCases.
- **`/routes`**:
  - `taskRoutes.ts`: Defines API endpoints and maps them to Controller methods.
- **`/middleware`**:
  - `upload.ts`: Multer configuration for file uploads.
  - `errorHandler.ts`: Centralized error handling.

#### 4. **Configuration** (`/config`)
- `env.ts`: Centralized environment variable management.

## 5. Frontend Code Architecture

The frontend uses **Atomic Design** principles to build a scalable and reusable UI component library.
*📖 Recommended Reading: [React Patterns](https://www.patterns.dev/react/)*

### 📂 Directory Structure (`src/`)

#### 1. **Components** (`/components`)
- **`/atoms`**:
  - The smallest, indivisible building blocks.
  - *Examples*: `Button.tsx`, `Input.tsx`, `Badge.tsx`.
  - *Responsibility*: Pure UI rendering with no business logic.
- **`/molecules`**:
  - Combinations of atoms and other molecules functioning together.
  - *Examples*: `TaskCard.tsx`, `VoiceRecorder.tsx`, `TaskForm.tsx`.
  - *Responsibility*: Specific UI functionality (e.g., a form group, a card with actions).

#### 2. **Screens (Pages)** (`/screens`)
- Represents full views or pages that the user interacts with.
- **`/Dashboard`**:
  - The main application view.
  - Composed of molecules like Kanban boards and lists.
  - Connects UI components to Stores/Hooks.

#### 3. **State & Logic**
- **`/stores`** (Zustand):
  - Global state management (e.g., `useTaskStore`, `useVoiceStore`).
  - Separation of state logic from UI components.
- **`/hooks`**:
  - Custom hooks for reusable logic (e.g., `useAudioRecorder`).

#### 4. **Services** (`/services`)
- **`/api`**:
  - `client.ts`: Axios instance configuration.
  - `taskApi.ts`: Specific API calls (GET, POST, etc.) corresponding to backend endpoints.

## 6. Decisions & Assumptions

### Key Design Decisions
- **Dual AI Approach**: Separated transcription (AssemblyAI) from parsing (Gemini) to leverage the best-in-class strengths of each provider.
- **Strict Date Validation**: Implemented a custom post-processing layer in the backend to handle relative dates (e.g., "next Thursday") to strictly map to End-of-Day timestamps, avoiding timezone offset bugs.
- **Kanban + List Views**: Frontend supports switching between interactions for better UX.

### Assumptions
- **Single User**: application assumes a single-user environment (no authentication).
- **Environment**: Users have valid API keys for both AI services.
- **Voice Input**: Assumes English language commands for optimal parsing.
