# DayFlow - Personal Life Dashboard

## Project Overview

**Project Name:** DayFlow  
**Type:** Full-stack MERN Web Application  
**Core Functionality:** Personal productivity dashboard for managing reading, work, school, business, daily planning, and notes  
**Target Users:** Individuals seeking to organize and track multiple areas of their personal and professional life

---

## Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** cors, helmet, dotenv, bcryptjs

### Frontend
- **Framework:** React.js 18 with Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **State:** React Context API
- **HTTP Client:** Axios
- **Date Handling:** date-fns

---

## UI/UX Specification

### Design System

#### Color Palette
- **Background Primary:** #0f0f0f (dark mode), #fafafa (light mode)
- **Background Secondary:** #1a1a1a (dark), #ffffff (light)
- **Background Card:** #222222 (dark), #f5f5f5 (light)
- **Text Primary:** #ffffff (dark), #111111 (light)
- **Text Secondary:** #a0a0a0
- **Accent Primary:** #6366f1 (Indigo)
- **Category Colors:**
  - Reading: #10b981 (Emerald Green)
  - Work: #3b82f6 (Blue)
  - School: #a855f7 (Purple)
  - Business: #f97316 (Orange)
  - Daily: #ec4899 (Pink)

#### Typography
- **Font Family:** 'Outfit' (headings), 'DM Sans' (body)
- **Headings:**
  - H1: 36px, font-weight: 700
  - H2: 28px, font-weight: 600
  - H3: 20px, font-weight: 600
- **Body:** 16px, font-weight: 400
- **Small:** 14px, font-weight: 400

#### Spacing
- **Base unit:** 4px
- **Container max-width:** 1400px
- **Card padding:** 24px
- **Section gap:** 32px
- **Component gap:** 16px

### Layout Structure
- **Sidebar:** Fixed left, 280px width, collapsible on mobile
- **Main content:** Fluid, padding-left 280px (desktop), 0 (mobile)
- **Responsive breakpoints:**
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

### Components

#### Buttons
- **Primary:** Indigo background, white text, rounded-lg(12px), padding 12px 24px
- **Secondary:** Transparent, border 1px, hover background
- **Icon Button:** 40px circle, centered icon
- **FAB:** 56px circle, fixed bottom-right, shadow-lg

#### Cards
- **Background:** Elevated with subtle shadow
- **Border radius:** 16px
- **Border:** 1px solid transparent (dark mode) / #e5e5e5 (light mode)

#### Input Fields
- **Height:** 48px
- **Border radius:** 12px
- **Focus state:** Indigo ring, 2px

#### Navigation
- **Sidebar items:** Icon + label, active state with background highlight
- **Mobile:** Bottom tab bar

### Animations
- **Page transitions:** Fade + slide, 300ms ease-out
- **Card hover:** Scale 1.02, 200ms
- **Button hover:** Background shift, 150ms
- **Loading:** Skeleton shimmer effect

---

## Functionality Specification

### Authentication

#### Register
- Fields: name, email, password, confirmPassword
- Validation: Email format, password min 6 chars
- Response: JWT token + user object

#### Login
- Fields: email, password
- Response: JWT token + user object

#### Logout
- Clear JWT from localStorage
- Redirect to login

#### Protected Routes
- Check JWT presence
- Redirect to login if unauthenticated

### Modules

#### 1. Reading Tracker
- Add book: title, author, totalPages, status (backlog/reading/done)
- Update current page
- Progress bar visualization
- Reading streak counter
- Notes per book

#### 2. Work Manager
- Kanban columns: To Do, In Progress, Done
- Task: title, description, priority (low/medium/high), deadline, tags
- Drag-drop between columns
- Daily summary widget

#### 3. School Planner
- Subject/course management
- Assignments with deadlines
- Grade tracking per subject
- Upcoming deadline alerts

#### 4. Business Board
- Goals with milestones
- Progress tracking (%)
- Finance log (income/expense)
- Idea notepad with tags

#### 5. Daily Planner
- Time blocks: Morning, Afternoon, Evening
- Habit tracker with daily reset
- Weekly review summary

#### 6. Quick Notes
- Rich text editor (React Quill)
- Pin to dashboard
- Tag and search

### Dashboard Homepage
- Greeting banner with date/time
- Today's tasks summary
- Reading progress widget
- Upcoming deadlines
- Habit streak display
- Quick-add FAB

---

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- POST /api/auth/logout

### Books
- GET /api/books
- POST /api/books
- PUT /api/books/:id
- DELETE /api/books/:id

### Tasks
- GET /api/tasks
- POST /api/tasks
- PUT /api/tasks/:id
- DELETE /api/tasks/:id
- PUT /api/tasks/:id/status

### Subjects
- GET /api/subjects
- POST /api/subjects
- PUT /api/subjects/:id
- DELETE /api/subjects/:id

### Assignments
- GET /api/assignments
- POST /api/assignments
- PUT /api/assignments/:id
- DELETE /api/assignments/:id

### Goals
- GET /api/goals
- POST /api/goals
- PUT /api/goals/:id
- DELETE /api/goals/:id

### Finance
- GET /api/finance
- POST /api/finance
- DELETE /api/finance/:id

### Notes
- GET /api/notes
- POST /api/notes
- PUT /api/notes/:id
- DELETE /api/notes/:id

### Habits
- GET /api/habits
- POST /api/habits
- PUT /api/habits/:id/toggle
- DELETE /api/habits/:id

### TimeBlocks
- GET /api/timeblocks
- POST /api/timeblocks
- PUT /api/timeblocks/:id
- DELETE /api/timeblocks/:id

---

## Acceptance Criteria

### Authentication
- [ ] User can register with name, email, password
- [ ] User can login with email, password
- [ ] User can logout
- [ ] Protected routes redirect to login
- [ ] JWT stored in localStorage

### UI/UX
- [ ] Dark/light mode toggle works
- [ ] Colors match category specification
- [ ] Animations are smooth
- [ ] Responsive on mobile/tablet/desktop

### Dashboard
- [ ] Shows greeting with time
- [ ] Displays today's tasks
- [ ] Shows reading progress
- [ ] Shows upcoming deadlines
- [ ] FAB opens quick-add

### Reading Tracker
- [ ] Can add new book
- [ ] Can update current page
- [ ] Progress bar updates
- [ ] Status changes work

### Work Manager
- [ ] Kanban board displays
- [ ] Tasks can be added
- [ ] Can change task status
- [ ] Priority visible

### Notes
- [ ] Can create note
- [ ] Rich text works
- [ ] Can pin note
- [ ] Can delete note

---

## File Structure

```
/backend
  /config
    db.js
  /controllers
    authController.js
    bookController.js
    taskController.js
    subjectController.js
    assignmentController.js
    goalController.js
    financeController.js
    noteController.js
    habitController.js
    timeblockController.js
  /models
    User.js
    Book.js
    Task.js
    Subject.js
    Assignment.js
    Goal.js
    Finance.js
    Note.js
    Habit.js
    TimeBlock.js
  /routes
    auth.js
    books.js
    tasks.js
    subjects.js
    assignments.js
    goals.js
    finance.js
    notes.js
    habits.js
    timeblocks.js
  /middleware
    auth.js
  server.js
  .env

/frontend
  /src
    /components
      /layout
        Sidebar.jsx
        Navbar.jsx
      /common
        Button.jsx
        Input.jsx
        Card.jsx
        Modal.jsx
      /dashboard
        Widget.jsx
        QuickAddFab.jsx
    /context
      AuthContext.jsx
      ThemeContext.jsx
    /hooks
      useAuth.js
    /pages
      /auth
        Login.jsx
        Register.jsx
        Logout.jsx
      /dashboard
        Dashboard.jsx
      /reading
        Reading.jsx
      /work
        Work.jsx
      /school
        School.jsx
      /business
        Business.jsx
      /daily
        Daily.jsx
      /notes
        Notes.jsx
      /profile
        Profile.jsx
    /services
      api.js
    App.jsx
    main.jsx
    index.css
  index.html
  vite.config.js
  tailwind.config.js
  package.json
```