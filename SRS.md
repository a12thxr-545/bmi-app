# Software Requirements Specification (SRS)
## BMI Tracker Web Application

**Version:** 1.0  
**Date:** January 19, 2026  
**Project Name:** BMI Tracker

---

## 1. Introduction

### 1.1 Purpose
This document is the Software Requirements Specification (SRS) for the BMI Tracker Web Application system. It is an application for tracking and analyzing Body Mass Index (BMI) for multiple users, complete with comprehensive MIS reports.

### 1.2 Scope
- Multi-user System
- Login/Register System
- Record and Calculate BMI
- Historical MIS Reports (Daily, Weekly, Monthly, Yearly)
- Dashboard displaying statistical data

### 1.3 Technology Stack
- **Frontend:** Next.js (Latest Version) + React
- **Backend:** Next.js API Routes
- **Database:** SQLite with Prisma ORM
- **Authentication:** NextAuth.js
- **UI Framework:** Custom CSS with modern design
- **Charts:** Chart.js / Recharts

---

## 2. Overall Description

### 2.1 Product Perspective
BMI Tracker is a standalone web application where users can:
- Register and Login
- Record weight and height data
- View historical BMI records
- Access analytical reports

### 2.2 User Classes

| User Type | Description | Access Rights |
|-----------|-------------|---------------|
| **User** | General User | Record BMI, View personal reports |
| **Admin** | Administrator | Manage users, View aggregate reports |

### 2.3 Operating Environment
- Web Browser: Chrome, Firefox, Safari, Edge (Latest versions)
- Responsive Design: Supports Desktop, Tablet, Mobile
- Server: Node.js Runtime

---

## 3. Specific Requirements

### 3.1 Functional Requirements

#### 3.1.1 Authentication System (FR-AUTH)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-AUTH-001 | Users can register with Email and Password | High |
| FR-AUTH-002 | Users can login with Email and Password | High |
| FR-AUTH-003 | System must validate Email format | High |
| FR-AUTH-004 | Password must be at least 8 characters long | High |
| FR-AUTH-005 | System must encrypt Password before storage | High |
| FR-AUTH-006 | Users can Logout | High |
| FR-AUTH-007 | System must manage Sessions securely | High |

#### 3.1.2 Profile Management System (FR-PROFILE)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-PROFILE-001 | Users can view their own profile | High |
| FR-PROFILE-002 | Users can edit their Full Name | Medium |
| FR-PROFILE-003 | Users can change Password | Medium |
| FR-PROFILE-004 | Users can set BMI goals | Medium |

#### 3.1.3 BMI Recording System (FR-BMI)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-BMI-001 | Users can record weight (kg) and height (cm) | High |
| FR-BMI-002 | System must calculate BMI automatically (weight / height²) | High |
| FR-BMI-003 | System must display BMI category (Underweight/Normal/Overweight/Obese) | High |
| FR-BMI-004 | Users can record multiple times per day | Medium |
| FR-BMI-005 | System must record date and time automatically | High |
| FR-BMI-006 | Users can edit recorded BMI data | Medium |
| FR-BMI-007 | Users can delete recorded BMI data | Medium |

#### 3.1.4 MIS Report System (FR-REPORT)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-REPORT-001 | Display Daily BMI Report | High |
| FR-REPORT-002 | Display Weekly BMI Report | High |
| FR-REPORT-003 | Display Monthly BMI Report | High |
| FR-REPORT-004 | Display Yearly BMI Report | High |
| FR-REPORT-005 | Report must display BMI trend graphs | High |
| FR-REPORT-006 | Report must display statistics (Max/Min/Average) | High |
| FR-REPORT-007 | Report must compare with goals | Medium |
| FR-REPORT-008 | Ability to Export reports as PDF/CSV | Low |

#### 3.1.5 Dashboard (FR-DASHBOARD)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-DASH-001 | Display user's latest BMI | High |
| FR-DASH-002 | Display BMI graph for the last 7 days | High |
| FR-DASH-003 | Display BMI change statistics | Medium |
| FR-DASH-004 | Display advice based on BMI value | Medium |

---

### 3.2 Non-Functional Requirements

#### 3.2.1 Performance

| ID | Requirement |
|----|-------------|
| NFR-PERF-001 | Web pages must load within 3 seconds |
| NFR-PERF-002 | API Response must not exceed 500ms |
| NFR-PERF-003 | Support 100 concurrent users |

#### 3.2.2 Security

| ID | Requirement |
|----|-------------|
| NFR-SEC-001 | Password must be encrypted with bcrypt |
| NFR-SEC-002 | Use HTTPS for communication |
| NFR-SEC-003 | Session must expire in 24 hours |
| NFR-SEC-004 | Prevent SQL Injection and XSS |

#### 3.2.3 Usability

| ID | Requirement |
|----|-------------|
| NFR-USE-001 | UI must be Responsive and support all devices |
| NFR-USE-002 | Support English Language |
| NFR-USE-003 | Have Loading State for every Action |

---

## 4. Data Model

### 4.1 Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────────┐
│    User     │       │    BMIRecord    │
├─────────────┤       ├─────────────────┤
│ id (PK)     │──┐    │ id (PK)         │
│ email       │  │    │ userId (FK)     │──┐
│ password    │  └────│ weight          │  │
│ name        │       │ height          │  │
│ role        │       │ bmi             │  │
│ targetBMI   │       │ category        │  │
│ createdAt   │       │ recordedAt      │  │
│ updatedAt   │       │ createdAt       │  │
└─────────────┘       └─────────────────┘
```

### 4.2 Database Schema

#### User Table
```sql
CREATE TABLE User (
    id          TEXT PRIMARY KEY,
    email       TEXT UNIQUE NOT NULL,
    password    TEXT NOT NULL,
    name        TEXT,
    role        TEXT DEFAULT 'user',
    targetBMI   REAL,
    createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt   DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### BMIRecord Table
```sql
CREATE TABLE BMIRecord (
    id          TEXT PRIMARY KEY,
    userId      TEXT NOT NULL,
    weight      REAL NOT NULL,
    height      REAL NOT NULL,
    bmi         REAL NOT NULL,
    category    TEXT NOT NULL,
    recordedAt  DATETIME NOT NULL,
    createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);
```

---

## 5. API Endpoints

### 5.1 Authentication APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/session` | Check Session |

### 5.2 User APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me` | Get current user profile |
| PUT | `/api/users/me` | Update user profile |
| PUT | `/api/users/me/password` | Change Password |

### 5.3 BMI Record APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bmi` | Get all BMI records |
| POST | `/api/bmi` | Record new BMI |
| GET | `/api/bmi/:id` | Get BMI data by ID |
| PUT | `/api/bmi/:id` | Edit BMI data |
| DELETE | `/api/bmi/:id` | Delete BMI data |

### 5.4 Report APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/daily` | Daily Report |
| GET | `/api/reports/weekly` | Weekly Report |
| GET | `/api/reports/monthly` | Monthly Report |
| GET | `/api/reports/yearly` | Yearly Report |
| GET | `/api/reports/statistics` | Overall Statistics |

---

## 6. User Interface Design

### 6.1 Pages

| Page | URL | Description |
|-----|-----|-------------|
| Landing | `/` | Application Introduction Page |
| Login | `/login` | Login Page |
| Register | `/register` | Registration Page |
| Dashboard | `/dashboard` | Main Page after Login |
| BMI Calculator | `/bmi` | BMI Recording Page |
| History | `/history` | BMI History Page |
| Reports | `/reports` | MIS Reports Page |
| Profile | `/profile` | User Profile Page |

### 6.2 Design Requirements

- **Color Scheme:** 
  - Primary: #6366F1 (Indigo)
  - Secondary: #22C55E (Green)
  - Warning: #F59E0B (Amber)
  - Danger: #EF4444 (Red)
  - Background: Dark mode (#0F172A)
  
- **Typography:** Inter font family

- **Components:**
  - Cards with glassmorphism effect
  - Animated charts
  - Responsive navigation
  - Toast notifications

---

## 7. BMI Categories

| BMI Value | Category | Color |
|-----------|----------|-------|
| < 18.5 | Underweight | 🔵 Blue |
| 18.5 - 24.9 | Normal | 🟢 Green |
| 25.0 - 29.9 | Overweight | 🟡 Yellow |
| ≥ 30.0 | Obese | 🔴 Red |

---

## 8. Project Timeline

| Phase | Task | Duration |
|-------|------|----------|
| 1 | Project Setup & Database | 1 day |
| 2 | Authentication System | 1 day |
| 3 | BMI CRUD Operations | 1 day |
| 4 | Reports & Dashboard | 1 day |
| 5 | UI Polish & Testing | 1 day |

---

## 9. Acceptance Criteria

### 9.1 Authentication
- [ ] Users can register successfully
- [ ] Users can login successfully
- [ ] Users can logout successfully
- [ ] Sessions are managed correctly

### 9.2 BMI Recording
- [ ] Can record BMI successfully
- [ ] BMI is calculated correctly
- [ ] BMI category is displayed correctly
- [ ] Can edit/delete data

### 9.3 Reports
- [ ] Daily report displays correct data
- [ ] Weekly report displays correct data
- [ ] Monthly report displays correct data
- [ ] Yearly report displays correct data
- [ ] Graphs display correctly

---

## 10. Appendix

### 10.1 BMI Formula
```
BMI = weight (kg) / height (m)²
```

### 10.2 References
- World Health Organization (WHO) BMI Classification
- Next.js Documentation
- Prisma Documentation

---

**Document Prepared By:** AI Assistant  
**Document Approved By:** _________________  
**Date:** January 19, 2026
