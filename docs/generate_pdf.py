import os
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def generate_report():
    pdf_path = os.path.join(os.path.dirname(__file__), "Requirement_Report.pdf")
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    teal_primary = colors.HexColor("#0d9488")
    teal_dark = colors.HexColor("#115e59")
    teal_light = colors.HexColor("#ccfbf1")
    slate_dark = colors.HexColor("#0f172a")
    slate_muted = colors.HexColor("#475569")
    slate_light = colors.HexColor("#f8fafc")
    border_color = colors.HexColor("#e2e8f0")

    # Typography Styles
    style_cover_dept = ParagraphStyle(
        "CoverDept",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=16,
        textColor=teal_primary,
        alignment=1, # Center
        spaceAfter=6
    )
    style_cover_title = ParagraphStyle(
        "CoverTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=24,
        leading=30,
        textColor=slate_dark,
        alignment=1,
        spaceAfter=12
    )
    style_cover_sub = ParagraphStyle(
        "CoverSub",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=12,
        leading=18,
        textColor=slate_muted,
        alignment=1,
        spaceAfter=25
    )
    style_h1 = ParagraphStyle(
        "CustomH1",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=15,
        leading=19,
        textColor=teal_dark,
        spaceBefore=16,
        spaceAfter=8,
        keepWithNext=True
    )
    style_h2 = ParagraphStyle(
        "CustomH2",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=16,
        textColor=slate_dark,
        spaceBefore=10,
        spaceAfter=6,
        keepWithNext=True
    )
    style_body = ParagraphStyle(
        "CustomBody",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=14,
        textColor=slate_dark,
        spaceAfter=6
    )
    style_bullet = ParagraphStyle(
        "CustomBullet",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=13,
        textColor=slate_dark,
        leftIndent=15,
        spaceAfter=4
    )
    style_table_header = ParagraphStyle(
        "TableHeader",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=12,
        textColor=colors.white
    )
    style_table_cell = ParagraphStyle(
        "TableCell",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=11,
        textColor=slate_dark
    )

    story = []

    # ==================== COVER PAGE ====================
    story.append(Spacer(1, 20))
    story.append(Paragraph("RAJSHAHI UNIVERSITY OF ENGINEERING & TECHNOLOGY (RUET)", style_cover_dept))
    story.append(Paragraph("Department of Computer Science & Engineering", style_cover_sub))
    story.append(Spacer(1, 15))
    story.append(Paragraph("CSE 3206: Software Engineering Sessional", ParagraphStyle("LabName", parent=style_cover_sub, fontName="Helvetica-Bold", fontSize=13, textColor=teal_dark)))
    story.append(Paragraph("Lab #2: Software Process Models, Requirement Analysis & MVP Development", style_cover_sub))
    story.append(HRFlowable(width="90%", thickness=2, color=teal_primary, spaceBefore=10, spaceAfter=25))
    
    story.append(Paragraph("PROJECT DESIGN REPORT", style_cover_dept))
    story.append(Paragraph("PetCare: Pet Healthcare & Clinical Appointment Management System", style_cover_title))
    story.append(Paragraph("<b>Assigned Scenario:</b> Group #37 &bull; <b>Suggested Model:</b> Prototype Software Process Model", style_cover_sub))
    story.append(Spacer(1, 20))

    # Team Information Box
    team_data = [
        [Paragraph("<b>Team Information</b>", style_table_header), Paragraph("<b>Details</b>", style_table_header)],
        [Paragraph("Team Name / Section", style_table_cell), Paragraph("Group #07 from Section B (2nd 30)", style_table_cell)],
        [Paragraph("Course Outcome", style_table_cell), Paragraph("CO2: Design & implement software solutions addressing user requirements", style_table_cell)],
        [Paragraph("Program Outcome", style_table_cell), Paragraph("PO3: Design and Development of Software Solutions", style_table_cell)],
        [Paragraph("Academic Session", style_table_cell), Paragraph("2025–2026", style_table_cell)]
    ]
    t_team = Table(team_data, colWidths=[150, 380])
    t_team.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), teal_primary),
        ("GRID", (0, 0), (-1, -1), 0.5, border_color),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, slate_light]),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(t_team)
    story.append(Spacer(1, 25))

    # Team Members & Work Distribution Table
    member_data = [
        [
            Paragraph("<b>Member</b>", style_table_header),
            Paragraph("<b>Assigned Role</b>", style_table_header),
            Paragraph("<b>Feature Branch</b>", style_table_header),
            Paragraph("<b>Technical Deliverables</b>", style_table_header)
        ],
        [
            Paragraph("Member 1", style_table_cell),
            Paragraph("Architecture & Auth Lead", style_table_cell),
            Paragraph("<code>member1-feature</code>", style_table_cell),
            Paragraph("Express server, SQLite schema, User Auth (login/register), Navigation shell, Report 1-5, 10-12.", style_table_cell)
        ],
        [
            Paragraph("Member 2", style_table_cell),
            Paragraph("Pet Profiles Lead", style_table_cell),
            Paragraph("<code>member2-feature</code>", style_table_cell),
            Paragraph("Pet CRUD, taxonomy, allergy tracker, vaccination log modal, Report 6-9 (12 FRs, 8 NFRs, 5 Use Cases).", style_table_cell)
        ],
        [
            Paragraph("Member 3", style_table_cell),
            Paragraph("Appointments & Dashboard Lead", style_table_cell),
            Paragraph("<code>member3-feature</code>", style_table_cell),
            Paragraph("Appointment booking engine, status lifecycle, analytics metrics cards, Report 13-16 & PDF compilation.", style_table_cell)
        ]
    ]
    t_members = Table(member_data, colWidths=[70, 120, 110, 230])
    t_members.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), teal_dark),
        ("GRID", (0, 0), (-1, -1), 0.5, border_color),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, slate_light]),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(t_members)

    story.append(PageBreak())

    # ==================== SECTIONS 3 TO 5 ====================
    story.append(Paragraph("3. Project Title", style_h1))
    story.append(Paragraph("<b>PetCare: An Interactive Pet Healthcare & Clinical Appointment Management System</b>", style_body))

    story.append(Paragraph("4. Problem Statement", style_h1))
    story.append(Paragraph(
        "Pet owners face significant operational friction in maintaining longitudinal health records, tracking recurring vaccination schedules, "
        "and booking clinical veterinary appointments. Most domestic pet parents and veterinary clinics in developing regions rely on unindexed paper booklets, "
        "phone calls, or ad-hoc messaging. This disorganization causes critical vaccination lapses (e.g., missed rabies boosters), lost medical/allergy profiles, "
        "and frequent scheduling conflicts. A centralized, accessible, and intuitive digital system is urgently required to streamline clinical care.",
        style_body
    ))

    story.append(Paragraph("5. Project Objectives", style_h1))
    story.append(Paragraph("&bull; <b>Centralized Health Records:</b> Digitize pet biometrics (species, breed, age, weight, microchip ID) and allergy notes into a single accessible portal.", style_bullet))
    story.append(Paragraph("&bull; <b>Automated Vaccine Tracking:</b> Provide proactive status badges ('Up-to-Date', 'Due Soon', 'Overdue') to eliminate infectious disease risks.", style_bullet))
    story.append(Paragraph("&bull; <b>Self-Service Clinical Booking:</b> Enable pet owners to schedule consultations, grooming sessions, and vaccinations with instant confirmation.", style_bullet))
    story.append(Paragraph("&bull; <b>Role-Based Workspaces:</b> Deliver customized workflows for Pet Owners (focusing on their pets) and Veterinary Staff (managing clinic appointments).", style_bullet))
    story.append(Paragraph("&bull; <b>Extensible Architecture:</b> Build an organized, modular foundation in Lab 2 to support Design Patterns and Testing in subsequent labs.", style_bullet))

    # ==================== SECTION 6: STAKEHOLDER ANALYSIS ====================
    story.append(Paragraph("6. Stakeholder Analysis", style_h1))
    stakeholder_data = [
        [Paragraph("<b>Stakeholder</b>", style_table_header), Paragraph("<b>Primary Concerns</b>", style_table_header), Paragraph("<b>System Interactions</b>", style_table_header)],
        [Paragraph("Pet Owners", style_table_cell), Paragraph("Timely vaccine alerts, easy care booking, tracking pet weight/allergies.", style_table_cell), Paragraph("Registers pets, views health cards, books clinical appointments.", style_table_cell)],
        [Paragraph("Veterinarians", style_table_cell), Paragraph("Quick access to pet allergies, medical histories, and daily appointment roster.", style_table_cell), Paragraph("Reviews clinical history, records administered vaccines, completes visits.", style_table_cell)],
        [Paragraph("Clinic Staff", style_table_cell), Paragraph("Preventing double bookings, managing patient flow, walk-in registration.", style_table_cell), Paragraph("Manages clinic appointment statuses, filters by date.", style_table_cell)],
        [Paragraph("Course Evaluators", style_table_cell), Paragraph("Process model justification, Git collaboration rigor, modularity, MVP feasibility.", style_table_cell), Paragraph("Audits Git history, inspects architecture, tests live prototype in viva.", style_table_cell)]
    ]
    t_stakeholders = Table(stakeholder_data, colWidths=[110, 210, 210])
    t_stakeholders.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), teal_primary),
        ("GRID", (0, 0), (-1, -1), 0.5, border_color),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, slate_light]),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(t_stakeholders)

    # ==================== SECTION 7: FUNCTIONAL REQUIREMENTS ====================
    story.append(Paragraph("7. Functional Requirements (12 Specifications)", style_h1))
    fr_data = [
        [Paragraph("<b>Req ID</b>", style_table_header), Paragraph("<b>Requirement Specification</b>", style_table_header), Paragraph("<b>Priority</b>", style_table_header)],
        [Paragraph("FR-01", style_table_cell), Paragraph("User authentication supporting registration, login, and session validation.", style_table_cell), Paragraph("High", style_table_cell)],
        [Paragraph("FR-02", style_table_cell), Paragraph("Role switching between Pet Owner and Clinic Staff views.", style_table_cell), Paragraph("High", style_table_cell)],
        [Paragraph("FR-03", style_table_cell), Paragraph("Pet profile creation with Name, Species, Breed, Age, Gender, Weight, and Microchip ID.", style_table_cell), Paragraph("High", style_table_cell)],
        [Paragraph("FR-04", style_table_cell), Paragraph("Pet profile modification and cascading record deletion.", style_table_cell), Paragraph("High", style_table_cell)],
        [Paragraph("FR-05", style_table_cell), Paragraph("Pet search by name/breed and taxonomic filtering by species (Dog, Cat, Rabbit, Other).", style_table_cell), Paragraph("Medium", style_table_cell)],
        [Paragraph("FR-06", style_table_cell), Paragraph("Vaccination logging with administered date, next due date, and automated overdue flags.", style_table_cell), Paragraph("High", style_table_cell)],
        [Paragraph("FR-07", style_table_cell), Paragraph("Allergy and medical observations tracking with visual health alerts.", style_table_cell), Paragraph("Medium", style_table_cell)],
        [Paragraph("FR-08", style_table_cell), Paragraph("Appointment scheduling specifying pet, service type, date, time slot, and specialist.", style_table_cell), Paragraph("High", style_table_cell)],
        [Paragraph("FR-09", style_table_cell), Paragraph("Appointment lifecycle state transitions (Scheduled, In-Progress, Completed, Cancelled).", style_table_cell), Paragraph("High", style_table_cell)],
        [Paragraph("FR-10", style_table_cell), Paragraph("Appointment status tab filtering (All, Scheduled, Completed, Cancelled).", style_table_cell), Paragraph("Medium", style_table_cell)],
        [Paragraph("FR-11", style_table_cell), Paragraph("Dashboard analytical metric counters (Total Pets, Upcoming Visits, Overdue Vaccines).", style_table_cell), Paragraph("High", style_table_cell)],
        [Paragraph("FR-12", style_table_cell), Paragraph("Sample dataset reset trigger for laboratory evaluation demonstration.", style_table_cell), Paragraph("Low", style_table_cell)]
    ]
    t_fr = Table(fr_data, colWidths=[60, 410, 60])
    t_fr.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), teal_dark),
        ("GRID", (0, 0), (-1, -1), 0.5, border_color),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, slate_light]),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(t_fr)

    # ==================== SECTION 8: NON-FUNCTIONAL REQUIREMENTS ====================
    story.append(Paragraph("8. Non-Functional Requirements (8 Specifications)", style_h1))
    nfr_data = [
        [Paragraph("<b>Req ID</b>", style_table_header), Paragraph("<b>Attribute</b>", style_table_header), Paragraph("<b>Specification Criteria</b>", style_table_header)],
        [Paragraph("NFR-01", style_table_cell), Paragraph("Performance", style_table_cell), Paragraph("Local API queries and database operations respond within 300 milliseconds.", style_table_cell)],
        [Paragraph("NFR-02", style_table_cell), Paragraph("Usability", style_table_cell), Paragraph("Responsive layout using CSS Grid/Flexbox for seamless desktop and tablet viewing.", style_table_cell)],
        [Paragraph("NFR-03", style_table_cell), Paragraph("Modularity", style_table_cell), Paragraph("Strict separation between Presentation, API Routing, and Database layers.", style_table_cell)],
        [Paragraph("NFR-04", style_table_cell), Paragraph("Portability", style_table_cell), Paragraph("Zero-dependency SQLite storage requiring no external database server installations.", style_table_cell)],
        [Paragraph("NFR-05", style_table_cell), Paragraph("Data Integrity", style_table_cell), Paragraph("Foreign key constraints with ON DELETE CASCADE prevent orphan records.", style_table_cell)],
        [Paragraph("NFR-06", style_table_cell), Paragraph("Security", style_table_cell), Paragraph("Input sanitization and payload validation to prevent injection or malformed data.", style_table_cell)],
        [Paragraph("NFR-07", style_table_cell), Paragraph("Reliability", style_table_cell), Paragraph("Structured HTTP status codes and user-friendly error feedback modals.", style_table_cell)],
        [Paragraph("NFR-08", style_table_cell), Paragraph("Traceability", style_table_cell), Paragraph("All deliverables version-controlled across 3 dedicated feature branches and PRs.", style_table_cell)]
    ]
    t_nfr = Table(nfr_data, colWidths=[60, 100, 370])
    t_nfr.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), teal_primary),
        ("GRID", (0, 0), (-1, -1), 0.5, border_color),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, slate_light]),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(t_nfr)

    story.append(PageBreak())

    # ==================== SECTION 9: USER STORIES & USE CASES ====================
    story.append(Paragraph("9. Five Key User Stories & Use Cases", style_h1))
    
    use_cases = [
        ("UC-01: Registering a Pet Profile", "Domestic Pet Owner", "Pet Profile Form filled with biometrics & chip ID.", "Pet record persisted, card displayed in grid, dashboard counters incremented."),
        ("UC-02: Booking a Clinical Service", "Domestic Pet Owner", "Pet selected, service chosen, date & slot confirmed.", "Appointment registered as 'Scheduled' and visible in clinic roster."),
        ("UC-03: Reviewing Overdue Health Alerts", "Pet Owner / Vet", "User opens dashboard or pet list.", "System flags overdue vaccines with red warning badges and recommendation."),
        ("UC-04: Completing a Clinical Service", "Attending Veterinarian", "Doctor finishes treatment and clicks 'Complete'.", "Status transitions to 'Completed' and dashboard analytics update in real time."),
        ("UC-05: Logging a Vaccine Administration", "Veterinary Specialist", "Attending doctor submits vaccine name, dose date, next due date.", "New record added to vaccination table; pet's alert badge clears to 'Up-to-Date'.")
    ]
    for title, actor, pre, post in use_cases:
        story.append(Paragraph(f"<b>{title}</b>", style_h2))
        story.append(Paragraph(f"<b>Primary Actor:</b> {actor} &bull; <b>Precondition:</b> {pre}", style_body))
        story.append(Paragraph(f"<b>Postcondition:</b> {post}", style_body))
        story.append(Spacer(1, 4))

    # ==================== SECTION 10 TO 12: PROCESS MODEL ====================
    story.append(Paragraph("10. Selected Software Process Model: Prototype Model", style_h1))
    story.append(Paragraph(
        "The <b>Prototype Software Process Model</b> was chosen as the most suitable methodology. "
        "In this model, an initial functional prototype demonstrating core requirements is constructed rapidly, evaluated by stakeholders, "
        "and iteratively refined based on real-world feedback.",
        style_body
    ))

    story.append(Paragraph("11. Justification of the Prototype Model", style_h1))
    story.append(Paragraph("&bull; <b>Qualitative & Evolving User Requirements:</b> Pet healthcare involves non-technical users whose operational needs (e.g. appointment steps, allergy visibility) are best understood by interacting with a working system.", style_bullet))
    story.append(Paragraph("&bull; <b>Early Usability Validation:</b> Veterinary staff can test whether emergency appointment bookings and health status tags are sufficiently intuitive prior to investing in complex enterprise modules.", style_bullet))
    story.append(Paragraph("&bull; <b>Solid Architecture for Semester Labs:</b> Building this functional MVP in Lab 2 establishes clean domain entities and endpoints that will seamlessly host Design Patterns (Lab 3/4) and automated test suites (Lab 5).", style_bullet))

    story.append(Paragraph("12. Comparison with Alternative Models", style_h1))
    model_data = [
        [Paragraph("<b>Evaluation Metric</b>", style_table_header), Paragraph("<b>Prototype Model (Chosen)</b>", style_table_header), Paragraph("<b>Waterfall Model</b>", style_table_header), Paragraph("<b>Spiral Model</b>", style_table_header)],
        [Paragraph("Requirement Flexibility", style_table_cell), Paragraph("High (Refined via working mockups)", style_table_cell), Paragraph("Low (Frozen at analysis)", style_table_cell), Paragraph("Moderate (Refined per cycle)", style_table_cell)],
        [Paragraph("Stakeholder Feedback", style_table_cell), Paragraph("Immediate working feedback in Lab 2", style_table_cell), Paragraph("Late (At the end of development)", style_table_cell), Paragraph("Periodic after risk evaluations", style_table_cell)],
        [Paragraph("Suitability for MVP", style_table_cell), Paragraph("Optimal for small team & rapid delivery", style_table_cell), Paragraph("Poor (High risk of rework)", style_table_cell), Paragraph("Poor (Excessive administrative overhead)", style_table_cell)]
    ]
    t_models = Table(model_data, colWidths=[120, 140, 130, 140])
    t_models.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), teal_dark),
        ("GRID", (0, 0), (-1, -1), 0.5, border_color),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, slate_light]),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(t_models)

    # ==================== SECTION 13: MVP DESIGN OVERVIEW ====================
    story.append(Paragraph("13. MVP Design Overview", style_h1))
    story.append(Paragraph(
        "<b>Architecture:</b> 3-Tier Layered Design comprising a Vanilla JS SPA frontend, an Express.js REST API router layer, "
        "and an embedded relational SQLite database engine with foreign key enforcement and JSON fallback. "
        "<b>Core Modules:</b> (1) Authentication & Role Switching, (2) Pet Profiles & Medical Card CRUD, (3) Clinical Appointment Scheduling & Analytics Dashboard.",
        style_body
    ))

    # ==================== SECTION 14: GITHUB COLLABORATION ====================
    story.append(Paragraph("14. GitHub Collaboration Evidence", style_h1))
    story.append(Paragraph(
        "The team adhered strictly to the mandated GitHub workflow: <code>main</code> branch protected as production baseline, "
        "with 3 dedicated feature branches (<code>member1-feature</code>, <code>member2-feature</code>, <code>member3-feature</code>) "
        "authored independently and integrated into <code>main</code> via reviewed Pull Requests.",
        style_body
    ))

    # ==================== SECTION 15 & 16: CHALLENGES & CONCLUSION ====================
    story.append(Paragraph("15. Challenges Encountered & Solutions", style_h1))
    story.append(Paragraph("&bull; <b>Challenge 1 (Native SQLite Portability):</b> Native C++ SQLite binaries often fail on machines lacking build tools. <i>Solution:</i> Used Node 22 built-in <code>node:sqlite</code> with a zero-dependency JSON fallback engine.", style_bullet))
    story.append(Paragraph("&bull; <b>Challenge 2 (Express 5 Route Matching):</b> Express 5 deprecated the catch-all asterisk route syntax. <i>Solution:</i> Implemented standard middleware notation (<code>app.use((req, res) => ...)</code>).", style_bullet))
    story.append(Paragraph("&bull; <b>Challenge 3 (Multi-Role Viva Demonstration):</b> Switching accounts rapidly during live presentation. <i>Solution:</i> Created one-click quick-login buttons for Sarah (Pet Owner) and Dr. Rahman (Veterinarian).", style_bullet))

    story.append(Paragraph("16. Conclusion", style_h1))
    story.append(Paragraph(
        "The Pet Care Management System MVP fulfills all criteria of RUET CSE 3206 Lab 2. "
        "The team demonstrated professional software engineering practices, clear work division, thorough requirement analysis, "
        "and a functional, modular prototype ready for semester-long enhancement.",
        style_body
    ))

    doc.build(story)
    print(f"[PDF Generator] Successfully generated: {pdf_path}")

if __name__ == "__main__":
    generate_report()
