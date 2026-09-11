# 🐾 PetCare - Pet Healthcare & Clinical Appointment Management System

> **RUET CSE 3206: Software Engineering Sessional**  
> **Lab #2:** Software Process Models, Requirement Analysis & MVP Development  
> **Course Outcome:** CO2 &bull; **Program Outcome:** PO3 &bull; **Marks:** 10  
> **Assigned Scenario:** Group #37 &bull; **Software Process Model:** **Prototype Model**  
> **Team:** Group #07 from Section B (2nd 30)

---

## 📋 Table of Contents
1. [Project Overview](#-project-overview)
2. [Software Process Model Justification](#-software-process-model-justification)
3. [Team Members & Work Division](#-team-members--work-division)
4. [Key MVP Features](#-key-mvp-features)
5. [System Architecture & Tech Stack](#-system-architecture--tech-stack)
6. [Repository Structure](#-repository-structure)
7. [Getting Started & Local Setup](#-getting-started--local-setup)
8. [Demo Credentials](#-demo-credentials)
9. [Git Branching & GitHub Collaboration](#-git-branching--github-collaboration)
10. [Documentation & Deliverables](#-documentation--deliverables)

---

## 🌟 Project Overview

**PetCare** is an interactive web-based Minimum Viable Product (MVP) designed to streamline pet healthcare tracking, vaccination schedules, and veterinary appointment booking. Developed collaboratively by a 3-member engineering team, this milestone satisfies all criteria of RUET CSE 3206 Lab 2.

### The Problem It Solves
Domestic pet owners and veterinary clinics frequently suffer from fragmented health records, missed rabies and core booster vaccinations, and operational bottlenecks from manual phone-based appointments. PetCare unifies biometric profiles, allergy histories, immunization logs, and service scheduling into a single responsive interface.

---

## 🔄 Software Process Model Justification

### Why the **Prototype Model**?
- **Evolving Qualitative Requirements:** Pet owners and clinic staff have diverse, qualitative workflows that are hard to specify in advance. An interactive prototype allows stakeholders to test booking flows and medical records early.
- **Early Usability Validation:** Enables veterinary staff to test whether allergy alerts and vaccination statuses are visible in under 3 clicks before investing in enterprise billing modules.
- **Foundation for Semester-Long Labs:** This MVP establishes clean domain entities and modular routers that will host Design Patterns and Automated Testing in subsequent labs.

### Comparison with Alternatives
| Criterion | Prototype Model (Chosen) | Waterfall Model | Spiral Model |
| :--- | :--- | :--- | :--- |
| **Requirement Flexibility** | **High** (Refined via working mockups) | **Low** (Frozen during analysis) | **Moderate** (Refined per cycle) |
| **User Feedback Loop** | **Immediate** (Working demo in Lab 2) | **Late** (At project delivery) | **Periodic** (After risk audits) |
| **Lab 2 MVP Fit** | **Optimal** for 3-member rapid delivery | **Poor** (High risk of rework) | **Poor** (Excessive overhead) |

---

## 👥 Team Members & Work Division

| Member | Assigned Role | Feature Branch | Technical Scope | Report Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Member 1** | **System Architect & Auth Lead** | `member1-feature` | Server architecture, SQLite schema, User Auth (login/register), Navigation shell | Sections 1–5, 10–12 (Title, Objectives, Process Model) |
| **Member 2** | **Pet Profile & Medical Records Lead** | `member2-feature` | Pet Profile CRUD, Species filters, Allergy tracker, Vaccination log modal | Sections 6–9 (12 FRs, 8 NFRs, 5 Use Cases) |
| **Member 3** | **Appointments & Dashboard Lead** | `member3-feature` | Appointment booking engine, status lifecycle, Dashboard metrics & alerts | Sections 13–16, PDF Compilation & Readme |

---

## 🚀 Key MVP Features

- **🔐 Role-Based Authentication:** Support for Pet Owners and Clinic Staff with instant one-click demo login.
- **🐶 Pet Profile Management (CRUD):** Add, view, edit, and delete pets with breed, age, weight, microchip ID, and avatar images.
- **💉 Vaccination & Health Alerts:** Track administered and upcoming vaccines with automatic **Up-to-Date**, **Due Soon**, and **Overdue** warning badges.
- **📅 Appointment Booking Engine:** Schedule clinical visits across 6 disciplines (Checkup, Vaccination, Grooming, Surgery, Dental, Emergency).
- **📊 Real-Time Analytics Dashboard:** Instant counters for registered pets, scheduled visits, overdue vaccinations, and completed services.
- **⚡ Zero-Friction Storage:** Built-in relational SQLite engine with zero database setup required.

---

## 🏗 System Architecture & Tech Stack

```
[ Client (Browser) ]
      │
      ▼ HTTP REST / JSON
[ Express.js Server (Node.js) ]
      ├── /api/auth          ──> authRoutes.js (Member 1)
      ├── /api/pets          ──> petRoutes.js  (Member 2)
      └── /api/appointments  ──> appointmentRoutes.js (Member 3)
      │
      ▼ Relational Data Layer
[ SQLite Database / Universal JSON Fallback ] (database.js)
```

- **Backend:** Node.js, Express.js
- **Database:** SQLite (`node:sqlite` built-in) with universal JSON fallback
- **Frontend:** HTML5, Modern Responsive CSS Grid/Flexbox, Vanilla JavaScript
- **Documentation:** Markdown, ReportLab Python PDF engine

---

## 📁 Repository Structure

```
petcare-management-system/
├── README.md                      # Primary project documentation
├── package.json                   # Project scripts and dependencies
├── docs/
│   ├── Requirement_Report.md      # 16-section Project Design Report (Markdown)
│   ├── Requirement_Report.pdf     # Official compiled PDF report
│   └── generate_pdf.py            # Python ReportLab compilation script
├── src/
│   ├── server.js                  # Express server entry point & SPA catch-all
│   ├── db/
│   │   ├── database.js            # SQLite database schema & DAL
│   │   ├── petcare.sqlite         # SQLite database file
│   │   └── seed.js                # Initial mock dataset for live demo
│   ├── routes/
│   │   ├── authRoutes.js          # Member 1: User auth & session endpoints
│   │   ├── petRoutes.js           # Member 2: Pet CRUD & vaccination endpoints
│   │   └── appointmentRoutes.js   # Member 3: Appointment & dashboard endpoints
│   └── public/
│       ├── index.html             # Main single-page application shell
│       ├── css/
│       │   └── style.css          # Responsive styling, cards, and modals
│       └── js/
│           ├── app.js             # Navigation, state & auth controller (Member 1)
│           ├── pets.js            # Pet profiles & health records (Member 2)
│           └── appointments.js    # Appointments & dashboard metrics (Member 3)
├── assets/
│   └── logo.svg                   # Vector brand logo
└── screenshots/
    └── .gitkeep                   # Visual captures of the running prototype
```

---

## 💻 Getting Started & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ or 22+ recommended)
- [Git](https://git-scm.com/)
- [Python 3](https://www.python.org/) (optional, only needed if recompiling the PDF report)

### Quick Run
```bash
# 1. Clone the repository
git clone https://github.com/your-username/petcare-management-system.git
cd petcare-management-system

# 2. Install dependencies
npm install

# 3. Start the application
npm start
```

Now open your browser and navigate to:
👉 **`http://localhost:3000`**

---

## 🔑 Demo Credentials

The system comes pre-seeded with realistic demonstration accounts. You can sign in using the **Quick Demo Access** buttons in the login modal:

| Role | Email | Password | Pre-loaded Data |
| :--- | :--- | :--- | :--- |
| **Pet Owner (Sarah Jenkins)** | `sarah.owner@petcare.com` | `password123` | 4 Pets (Max, Luna, Rocky, Milo), 4 Appointments |
| **Veterinarian (Dr. K. Rahman)** | `dr.rahman@petcare.com` | `password123` | Full clinical access to all patients & records |

---

## 🌿 Git Branching & GitHub Collaboration

As specified in Phase 4 of RUET Lab 2, the team utilized a strict feature branch workflow:

```
main (Production Baseline)
  │
  ├── [PR #1 Merged] ── member1-feature (Scaffold, Express, Auth, Base UI)
  │
  ├── [PR #2 Merged] ── member2-feature (Pet Profiles, Medical Cards, Species Filter)
  │
  └── [PR #3 Merged] ── member3-feature (Appointments Engine, Dashboard, Report)
```

To view the collaborative commit graph:
```bash
git log --graph --oneline --all
```

---

## 📄 Documentation & Deliverables

- **Markdown Report:** [docs/Requirement_Report.md](docs/Requirement_Report.md)
- **Official PDF Report:** [docs/Requirement_Report.pdf](docs/Requirement_Report.pdf) (Contains all 16 required sections)
- **Recompile PDF:** Run `python docs/generate_pdf.py`

---

*Submitted for evaluation in partial fulfillment of the requirements for CSE 3206 (Software Engineering Sessional) at Rajshahi University of Engineering & Technology (RUET).*
