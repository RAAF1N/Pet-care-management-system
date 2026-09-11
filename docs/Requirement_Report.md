# RAJSHAHI UNIVERSITY OF ENGINEERING & TECHNOLOGY (RUET)
## DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING
### CSE 3206 – Software Engineering Sessional
### Lab 2: Software Process Models, Requirement Analysis & MVP Development

---

# PROJECT DESIGN REPORT
## Pet Care Management System (MVP)

**Assigned Scenario:** Group #37 – Pet Care Management System  
**Process Model:** Prototype Software Process Model  
**Target Milestone:** Lab 2 MVP Prototype & Requirement Baseline  

---

## 2. Team Information

**Team Name:** Group #07 from Section B (2nd 30)  
**Academic Session:** 2025–2026  
**Course Code:** CSE 3206 (Software Engineering Sessional)  

### Team Member Distribution & Work Ownership

| Roll No. | Member Name | Role / Assignment | Git Feature Branch | Key Contributions |
| :--- | :--- | :--- | :--- | :--- |
| **Member 1** | Team Member 1 | **System Architect & Auth Lead** | `member1-feature` | • Server scaffolding & routing architecture<br>• Relational database schema (`SQLite`)<br>• User Authentication & Role Switching (Owner/Staff)<br>• Navigation Shell & Report Sections 1–5, 10–12 |
| **Member 2** | Team Member 2 | **Pet Profile & Medical Records Lead** | `member2-feature` | • Pet Profile CRUD Operations<br>• Species & Breed Taxonomy Management<br>• Vaccination Tracker & Allergy Warning System<br>• Report Sections 6–9 (12 FRs, 8 NFRs, 5 Use Cases) |
| **Member 3** | Team Member 3 | **Appointments & Dashboard Analytics Lead** | `member3-feature` | • Clinical Appointment Booking Engine<br>• Appointment Lifecycle Workflow (Scheduled/Completed/Cancelled)<br>• Real-time Analytics & Health Alert Dashboard<br>• Report Sections 13–16 & PDF Compilation |

---

## 3. Project Title
**PetCare: An Interactive Pet Healthcare & Clinical Appointment Management System**

---

## 4. Problem Statement
Pet owners face significant friction in maintaining longitudinal health records, tracking recurring vaccination schedules, and scheduling veterinary clinical visits. Most small-to-medium veterinary clinics and domestic pet parents rely on fragmented paper booklets, unindexed chat messages, or rudimentary phone appointments. This leads to:
1. **Missed Vaccination Deadlines:** Potentially fatal lapses in rabies and core boosters due to lack of automated due-date visibility.
2. **Scattered Medical Histories:** Critical allergies, surgical notes, and biometric trends are often lost during veterinary consultations.
3. **Scheduling Overhead & Double-booking:** Manual appointment logging causes operational bottlenecks for clinic staff and long wait times for pet owners.
4. **Lack of Accessible Portals:** Inability for pet owners to inspect diagnostic summaries, leading to poor adherence to dietary and medical care advice.

---

## 5. Project Objectives
The primary objectives of this software engineering project are:
- **Centralized Pet Medical Records:** Establish a unified digital repository for pet biometrics (species, breed, weight, age), identification tags (microchips), and known allergies.
- **Automated Health Tracking:** Surface immediate alerts for upcoming or overdue immunizations directly on a responsive dashboard.
- **Frictionless Appointment Workflow:** Enable self-service clinical appointment scheduling across various care disciplines (General Checkups, Vaccinations, Grooming, Surgeries).
- **Role-Based Collaboration:** Deliver tailored views for Pet Owners (focusing on their pets and bookings) and Veterinary/Clinic Staff (focusing on clinic-wide appointments and treatments).
- **Extensible Architecture:** Maintain a clean, modular Model-Route-Controller codebase to support subsequent lab milestones (Design Patterns and Automated Testing).

---

## 6. Stakeholder Analysis

| Stakeholder Group | Primary Interests & Goals | System Interactions | Key Success Metrics |
| :--- | :--- | :--- | :--- |
| **Pet Owners** | • Timely vaccination notifications<br>• Easy booking for care & grooming<br>• Access to pet clinical records anywhere | Registers pets, views medical history, schedules visits, tracks appointment statuses. | • Under 2 minutes to book a visit<br>• Zero missed rabies booster alerts |
| **Veterinarians / Clinical Specialists** | • Rapid access to pet allergies & past diagnoses<br>• Transparent daily consultation schedule<br>• Streamlined status logging | Reviews patient histories, logs vaccine administrations, marks treatments as completed. | • Instant retrieval of patient allergy profile<br>• Reduced consultation prep time |
| **Clinic Receptionists / Administrative Staff** | • High scheduling efficiency<br>• Managing patient flow<br>• Preventing scheduling conflicts | Views daily appointment roster, filters by date/status, registers walk-in profiles. | • Elimination of double bookings<br>• Accurate daily patient tracking |
| **Academic Evaluators (Course Instructors)** | • Demonstration of software engineering rigor<br>• Appropriate process model justification<br>• Clear Git collaboration & code modularity | Audits Git history, evaluates requirements compliance, inspects architecture and viva. | • Adherence to RUET CSE 3206 rubric<br>• Clean Git commit and merge history |

---

## 7. Functional Requirements (12 Specifications)

- **FR-01 (User Authentication):** The system shall permit users to securely register, log in, and log out with validated credentials.
- **FR-02 (Role Identification & Context Switching):** The system shall identify the active user as either a *Pet Owner* or *Clinic Staff / Veterinarian*, filtering views and permissions accordingly.
- **FR-03 (Pet Profile Registration):** The system shall allow pet owners to create pet profiles containing Name, Species, Breed, Age, Gender, Weight, Microchip ID, and Avatar image URL.
- **FR-04 (Pet Profile Modification & Deletion):** The system shall enable updating pet biographical information and deleting pet profiles along with cascaded records.
- **FR-05 (Species Taxonomy & Search Filter):** The system shall allow real-time searching of pets by name or breed and filtering by species category (Dog, Cat, Rabbit, Bird, Other).
- **FR-06 (Vaccination Logging & Status Tracking):** The system shall record vaccine doses (Vaccine Name, Date Administered, Next Due Date, Attending Vet) and classify status as *Administered*, *Due Soon*, or *Overdue*.
- **FR-07 (Allergy & Medical Observation Logging):** The system shall allow logging known allergies (e.g., poultry, penicillin) and behavioral/medical observations that persist on the pet's clinical file.
- **FR-08 (Appointment Scheduling):** The system shall allow users to book appointments by specifying Pet, Service Type (General Checkup, Vaccination, Grooming & Spa, Dental, Surgery Consultation, Emergency), Date, Time Slot, and Specialist.
- **FR-09 (Appointment Lifecycle Management):** The system shall support transitioning appointment status across the lifecycle states: *Scheduled*, *In-Progress*, *Completed*, and *Cancelled*.
- **FR-10 (Appointment Status Filtering):** The system shall allow users to filter appointments by status tabs (*All*, *Scheduled*, *Completed*, *Cancelled*) for efficient clinical workflow management.
- **FR-11 (Executive Dashboard Analytics):** The system shall dynamically compute and display real-time counters: Total Registered Pets, Scheduled Appointments, Vaccines Due/Overdue, and Completed Services.
- **FR-12 (Sample Data Seeding & State Reset):** The system shall provide an administrative reset trigger to populate the database with realistic demonstration entities (pets, users, appointments) for laboratory evaluation.

---

## 8. Non-Functional Requirements (8 Specifications)

- **NFR-01 (Performance & Response Time):** All local API endpoints and database queries shall respond within **300 milliseconds** under standard demonstration workloads.
- **NFR-02 (Usability & Responsive Layout):** The user interface shall be fully responsive across desktop, laptop, and tablet viewport widths (\(\ge 768\text{px}\)) utilizing clean CSS Grid and Flexbox layouts.
- **NFR-03 (Modularity & Separation of Concerns):** The system architecture shall strictly decouple data persistence (`src/db/`), API routing (`src/routes/`), and frontend presentation (`src/public/`) to accommodate future lab requirements (Design Patterns & Unit Testing).
- **NFR-04 (Portability & Zero-friction Setup):** The system shall execute on any standard Node.js runtime without requiring external database server installations, utilizing built-in relational SQLite storage with JSON fallback.
- **NFR-05 (Data Integrity & Referential Constraints):** The database schema shall enforce relational integrity via foreign key constraints (`ON DELETE CASCADE`) between Users, Pets, Vaccinations, and Appointments.
- **NFR-06 (Security & Input Validation):** All client input payloads (dates, emails, numerical weights/ages) shall be validated and sanitized prior to database persistence to prevent malformed data and injection.
- **NFR-07 (Reliability & Graceful Failure):** The application shall handle unexpected errors gracefully by returning structured HTTP status codes (`400`, `404`, `409`, `500`) with human-readable JSON diagnostics.
- **NFR-08 (Traceability & Version Control):** All deliverables shall be version-controlled using Git with distinct feature branches (`member1-feature`, `member2-feature`, `member3-feature`) merged into `main` via documented pull requests.

---

## 9. User Stories & Use Cases

### User Story 1: Registering a Pet Profile
- **As a** domestic pet owner,  
  **I want to** register my 3-year-old Golden Retriever with his weight, breed, and microchip tag,  
  **So that** the veterinary clinic has an accurate digital baseline for future medical visits.  
- **Acceptance Criteria:**
  - Form validates required fields (Name, Species, Breed, Age, Gender, Weight).
  - Newly created pet card appears immediately in the Pet Profiles view and updates the Dashboard count.

### User Story 2: Booking a Clinical Vaccination Appointment
- **As a** pet owner,  
  **I want to** schedule a vaccination appointment for my pet next Tuesday at 11:00 AM,  
  **So that** my pet receives their booster without waiting in clinic queues.  
- **Acceptance Criteria:**
  - System presents a dropdown of only the owner's registered pets.
  - Appointment is created with status *Scheduled* and displayed in the upcoming appointments calendar.

### User Story 3: Reviewing Immediate Health Alerts
- **As a** pet owner or veterinary assistant,  
  **I want to** see overdue vaccination warnings on the dashboard,  
  **So that** I can prioritize clinical intervention for pets at risk of infectious diseases.  
- **Acceptance Criteria:**
  - Dashboard automatically highlights pets whose vaccine status is *Overdue* or *Due Soon* in prominent alert cards.

### User Story 4: Completing a Clinical Service
- **As a** clinic veterinarian (Dr. Rahman),  
  **I want to** mark an appointment as *Completed* after finishing an examination,  
  **So that** the clinic appointment roster stays accurate and the completed metrics counter increments.  
- **Acceptance Criteria:**
  - Single-click action on the appointment row transitions status to *Completed*.
  - Completed counter on the dashboard increments dynamically without full page reload.

### User Story 5: Logging a Pet's Vaccine Administration
- **As a** veterinary specialist,  
  **I want to** log a newly administered vaccine with the next booster due date,  
  **So that** the pet's medical file stays up to date and future reminders can trigger accurately.  
- **Acceptance Criteria:**
  - The modal allows inputting vaccine name, dose date, and next due date.
  - The new dose immediately appears in the vaccination history log table.

---

## 10. Selected Software Process Model: Prototype Software Model

For the Pet Care Management System, the **Prototype Software Process Model** was selected as the guiding software engineering methodology.

```
       ┌──────────────────────────────────────┐
       │   Initial Requirement Gathering      │
       └──────────────────┬───────────────────┘
                          │
                          ▼
       ┌──────────────────────────────────────┐
       │       Quick Design & Architecture    │
       └──────────────────┬───────────────────┘
                          │
                          ▼
       ┌──────────────────────────────────────┐
       │     Build Prototype (Working MVP)    │
       └──────────────────┬───────────────────┘
                          │
                          ▼
       ┌──────────────────────────────────────┐
       │    Customer / Stakeholder Evaluation │ ◄──┐
       └──────────────────┬───────────────────┘    │
                          │                        │ Iterative Refinement
            Requirements  ├─[ Needs Revision ]─────┘
             Satisfied?   │
                          ▼ [ Approved ]
       ┌──────────────────────────────────────┐
       │       Final Engineering Milestone    │
       └──────────────────────────────────────┘
```

---

## 11. Justification of the Selected Process Model

The Prototype model is uniquely suitable for this project due to the following domain and environmental characteristics:

1. **Evolving & User-Centric Requirements:** Non-technical stakeholders (pet owners, animal caretakers, groomers) often struggle to articulate precise UI and workflow requirements upfront. A tangible, interactive prototype allows them to visually experience the appointment booking flow and medical history display, uncovering missing fields (such as microchip tags and allergies) early.
2. **Minimization of Rework in Future Labs:** CSE 3206 is a semester-long project where future labs build upon this foundation with Design Patterns (e.g., Factory, Singleton, Observer) and automated testing. Developing a functional MVP prototype in Lab 2 validates the core database entities and route abstractions before architectural patterns are applied.
3. **Rapid Usability Feedback:** Veterinary clinics require minimal cognitive overhead during emergency intake. The prototype allows testing whether veterinarians can view a pet's critical allergy warning in less than 3 clicks.

---

## 12. Comparison with Alternative Models

| Feature / Metric | Prototype Model (Selected) | Waterfall Model | Agile Scrum | Spiral Model |
| :--- | :--- | :--- | :--- | :--- |
| **Requirement Flexibility** | **High:** Iteratively refined via prototype feedback | **Low:** Rigidly frozen at the analysis phase | **High:** Iterated every sprint | **Medium:** Refined per spiral cycle |
| **Early Customer Feedback** | **Immediate:** Working prototype demonstrated early | **Late:** Delivered only near project completion | **Periodic:** Delivered after 2–4 week sprints | **Periodic:** Delivered after risk milestones |
| **Suitability for Lab 2 Scope** | **Optimal:** Fits short lab timeframe to build an MVP | **Poor:** High risk of discovering flaws too late | **Moderate:** High meeting overhead for a 1-week lab | **Poor:** Excessive overhead for low-risk systems |
| **Risk Management Approach** | Validates UI and feature feasibility through mockups | Assumes zero uncertainty in specifications | Managed incrementally through user stories | Explicit, heavy mathematical risk analysis |

### Detailed Invalidation of Alternatives:
- **Why Waterfall is Unsuitable:** The Waterfall model strictly forbids going back to modify requirements once implementation begins. In a pet healthcare system where clinical workflows depend on veterinarian and owner interaction patterns, rigid upfront assumptions often lead to an unusable system that fails client needs.
- **Why Spiral is Unsuitable:** The Spiral model is engineered for large-scale, high-risk systems (e.g., flight control, banking transaction engines). The elaborate risk assessment phases introduce unnecessary administrative complexity for a 3-member university team delivering a focused MVP.

---

## 13. MVP Design Overview

### 13.1 System Architecture
The Pet Care MVP is structured according to a modular 3-tier architectural pattern:
- **Presentation Layer (Client):** Single Page Application (SPA) driven by Vanilla JavaScript (`app.js`, `pets.js`, `appointments.js`), HTML5, and responsive modern CSS.
- **Application Layer (API Server):** Node.js runtime executing Express.js routers organized by domain responsibility (`authRoutes.js`, `petRoutes.js`, `appointmentRoutes.js`).
- **Data Persistence Layer (Database):** Embedded SQLite database (`node:sqlite`) with foreign key constraints, with an automated fallback to atomic JSON persistence.

### 13.2 Relational Data Model (Schema Diagram)

```
  ┌────────────────────────┐             ┌────────────────────────┐
  │         USERS          │             │          PETS          │
  ├────────────────────────┤             ├────────────────────────┤
  │ id (PK)                │1           *│ id (PK)                │
  │ name                   ├────────────►│ owner_id (FK)          │
  │ email (UNIQUE)         │             │ name                   │
  │ password               │             │ species                │
  │ role (owner/staff)     │             │ breed                  │
  │ phone                  │             │ age                    │
  └────────────────────────┘             │ gender                 │
               │                         │ weight                 │
               │ 1                       │ microchip_id           │
               │                         │ medical_notes          │
               │                         │ allergies              │
               │                         │ vaccination_status     │
               │                         └───────────┬────────────┘
               │                                     │ 1
               │                                     │
               │ *                                   │ *
  ┌────────────▼───────────┐             ┌───────────▼────────────┐
  │      APPOINTMENTS      │             │      VACCINATIONS      │
  ├────────────────────────┤             ├────────────────────────┤
  │ id (PK)                │             │ id (PK)                │
  │ pet_id (FK)            │◄────────────┤ pet_id (FK)            │
  │ owner_id (FK)          │             │ vaccine_name           │
  │ service_type           │             │ administered_date      │
  │ appointment_date       │             │ next_due_date          │
  │ appointment_time       │             │ veterinarian           │
  │ veterinarian           │             │ status                 │
  │ status                 │             └────────────────────────┘
  │ reason_notes           │
  │ cost                   │
  └────────────────────────┘
```

---

## 14. GitHub Collaboration Evidence

The repository strictly followed the collaborative Git branching model mandated in Lab 2 guidelines:

```
main (Production Prototype Baseline)
  │
  ├── [PR #1 Merged] ── member1-feature (Architecture, SQLite DAL, User Auth)
  │
  ├── [PR #2 Merged] ── member2-feature (Pet Profiles CRUD, Medical Records, Filters)
  │
  └── [PR #3 Merged] ── member3-feature (Appointments Engine, Dashboard Analytics, Report)
```

### Pull Requests & Branching Summary

| Branch Name | Author | Scope / Deliverables | Associated Commits | Pull Request |
| :--- | :--- | :--- | :--- | :--- |
| `member1-feature` | Team Member 1 | Scaffold, Express server, SQLite schema, Auth routes, Nav shell | `feat(core): project scaffold & db`<br>`feat(auth): login & register endpoints` | **PR #1: Core Architecture & Authentication** (Merged to `main`) |
| `member2-feature` | Team Member 2 | Pet Profile CRUD, species filters, vaccination records modal | `feat(pets): pet profiles database & rest api`<br>`feat(ui): pet cards & medical history modal` | **PR #2: Pet Profiles & Medical Records** (Merged to `main`) |
| `member3-feature` | Team Member 3 | Appointment booking engine, status lifecycle, dashboard metrics | `feat(appts): appointment booking & status`<br>`feat(dash): real-time metrics & report docs` | **PR #3: Appointments & Dashboard Analytics** (Merged to `main`) |

---

## 15. Challenges Encountered & Engineering Solutions

1. **Native SQLite vs Cross-Platform Compatibility:**
   - *Challenge:* Compiling native database modules like `sqlite3` or `better-sqlite3` often causes build errors on different operating systems due to missing C++ compilers.
   - *Solution:* Leveraged Node 22's built-in `node:sqlite` (`DatabaseSync`) module and implemented a resilient JSON fallback layer, ensuring the project executes out-of-the-box anywhere without installation friction.
2. **Express 5 Path Matching Changes:**
   - *Challenge:* In Express 5, using wildcard routes (`app.get('*', ...)`) triggers a `PathError` due to updated regular expression parsing in `path-to-regexp`.
   - *Solution:* Transitioned the SPA catch-all handler to middleware notation (`app.use((req, res) => ...)`), which is robust and universally compatible across both Express 4 and Express 5.
3. **Multi-Role User Context in a Lightweight Prototype:**
   - *Challenge:* Demonstrating both Pet Owner and Clinic Veterinarian experiences during a brief laboratory viva without cumbersome multi-account registration.
   - *Solution:* Implemented one-click Quick Demo logins for both *Sarah Jenkins (Pet Owner)* and *Dr. Rahman (Chief Vet)*, allowing instant context switching during demonstration.

---

## 16. Conclusion
The **Pet Care Management System MVP** successfully fulfills all objectives set forth in RUET CSE 3206 Lab 2. By applying the **Prototype Software Process Model**, the team conceptualized, designed, and delivered an interactive, functional software prototype tailored to the real-world operational challenges of pet healthcare. 

The modular architecture, comprehensive requirement specifications (12 Functional and 8 Non-Functional requirements), collaborative Git workflow across 3 team members, and zero-dependency runtime establish an exemplary engineering foundation for subsequent software engineering labs throughout the semester.
