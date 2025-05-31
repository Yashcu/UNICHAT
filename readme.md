# Unichat AI – Smart Campus Communication System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Status: Vision - Active Development for Core Features](https://img.shields.io/badge/status-vision%20%26%20active%20development-blue?style=flat-square)]()
<!-- Add other relevant badges here: build status, coverage, etc. -->

Unichat AI is envisioned as an intelligent, multi-tenant communication platform designed to serve multiple college campuses. It aims to centralize communication, streamline information flow, and provide AI-powered assistance to students, faculty, and administrators, fostering a more connected, efficient, and scalable campus ecosystem.

**Note:** This document outlines the full vision for Unichat AI, including features for multi-tenancy and comprehensive role-based functionalities. The "Project Status" section reflects current implementation progress towards this vision. Achieving the full scope is a significant development undertaking.

## Table of Contents

- [Introduction](#introduction)
- [Vision & Scope](#vision--scope)
- [Core Principles](#core-principles)
- [User Roles & Detailed Functionalities](#user-roles--detailed-functionalities)
  - [Student](#student)
  - [Faculty](#faculty)
  - [Campus Administrator (Admin)](#campus-administrator-admin)
  - [Super Administrator (Multi-Campus Management - Planned)](#super-administrator-multi-campus-management---planned)
- [Key Features (Implemented & Planned)](#key-features-implemented--planned)
- [Project Status](#project-status)
  - [Feature Implementation Matrix](#feature-implementation-matrix)
- [Multi-Tenancy Architecture (Vision)](#multi-tenancy-architecture-vision)
- [Technology Stack](#technology-stack)
- [Getting Started (Development Environment)](#getting-started-development-environment)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Roadmap](#roadmap)
- [System Architecture Highlights](#system-architecture-highlights)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction

Unichat AI aims to revolutionize campus communication by providing a modern, real-time, web-based system integrated with intelligent modules. It serves as a smart intranet alternative, enhancing interaction and information dissemination across one or many educational institutions.

## Vision & Scope

The ultimate vision for Unichat AI is a scalable, multi-tenant Software-as-a-Service (SaaS) platform where multiple universities can operate their own secure and customized instances of the communication system.

**Scope Includes:**
-   Real-time chatrooms and direct messaging.
-   AI-driven circular summarization and Q&A.
-   Comprehensive notification system.
-   Role-based access tailored to campus hierarchies.
-   Administrative tools for campus-level and system-wide management.
-   Secure data isolation between institutions.

## Core Principles
-   **User-Centric Design:** Intuitive and accessible for all campus members.
-   **Intelligence:** Leverage AI to simplify tasks and provide timely information.
-   **Scalability:** Architected to support a growing number of users and institutions.
-   **Security & Privacy:** Robust protection of user data and communication.
-   **Customizability:** Allowing institutions to tailor aspects of the platform.

## User Roles & Detailed Functionalities

Unichat AI supports distinct roles with granular permissions:

### Student

*   **Account Management:**
    *   ✅ Register with an institute email and secure password.
    *   ✅ Login and Logout securely (JWT-based).
    *   ⬜ Request password reset / Forgot password.
    *   ✅ Update personal profile information (e.g., name, department, year).
    *   ⬜ Update profile avatar and status message.
*   **Messaging & Collaboration:**
    *   ✅ View list of available group chats and private conversations.
    *   ✅ Initiate and participate in private (one-to-one) messages.
    *   ✅ Join, participate in, and leave public/course-based group chats.
    *   ✅ Send text messages, hyperlinks, and documents (PDFs, DOCs, etc.).
    *   ⬜ Send image and video attachments.
    *   ✅ React to messages with emojis.
    *   ✅ View read receipts for sent messages.
    *   ✅ Receive real-time message updates via WebSockets.
    *   ⬜ See typing indicators from other users.
    *   ⬜ See user presence (online/offline/away).
    *   ⬜ Search message history within chats.
*   **Information Access:**
    *   ✅ View circulars and announcements posted by Faculty/Admin.
    *   ⬜ Filter and search circulars.
*   **AI Assistant (Chatbot):**
    *   ✅ Access and interact with the AI Chatbot for campus-related Q&A.
    *   ✅ Receive contextual answers based on the institution's knowledge base.
    *   ⬜ Provide feedback on chatbot responses.
*   **Notifications:**
    *   ✅ Receive real-time push notifications (for new messages, circulars, critical alerts).
    *   ✅ View and manage past notifications in a dedicated Notification Center.
    *   ⬜ Customize notification preferences.

### Faculty

*   **Includes all Student functionalities, plus:**
*   **Circulars & Announcements Management:**
    *   ✅ Post new circulars and announcements (text or by uploading PDF/document).
    *   ✅ Utilize AI to automatically summarize uploaded circulars.
    *   ⬜ Edit or delete own posted circulars/announcements.
    *   ⬜ Schedule circulars for future publication.
    *   ⬜ Target circulars to specific groups or departments.
*   **Group Management (Planned for enhanced roles):**
    *   ⬜ Create and manage course-specific or department-specific groups.
    *   ⬜ Add/remove members from groups they administer.
    *   ⬜ Moderate content within owned groups.
*   **AI Assistant Interaction:**
    *   ✅ Utilize the AI chatbot for queries.
    *   ⬜ (Potentially) Contribute or suggest updates to the AI chatbot's knowledge base for their specific courses/departments (moderated by Admin).

### Campus Administrator (Admin)

*   **Includes all Faculty functionalities (often with campus-wide scope), plus:**
*   **User Management (for their specific campus):**
    *   ✅ View list of all users within their institution.
    *   ✅ Create new user accounts (Student, Faculty, Admin for their campus).
    *   ✅ Modify user roles and profile details.
    *   ✅ Suspend, unsuspend, or delete user accounts.
    *   ⬜ Bulk import users (e.g., from a CSV file).
    *   ⬜ Manage user registration approval workflows (if applicable).
*   **Campus-Wide Communication:**
    *   ✅ Create and manage special announcement channels (e.g., emergency alerts, campus-wide news).
    *   ✅ Post and manage all circulars for the institution.
    *   ⬜ Send broadcast messages to all users or specific roles/departments.
*   **AI Chatbot Configuration (for their campus):**
    *   ✅ Configure and customize the AI Chatbot's knowledge base.
    *   ✅ Upload documents (FAQs, policies, campus info) to train/update the chatbot.
    *   ✅ Review and curate chatbot Q&A pairs.
    *   ⬜ Monitor chatbot usage and effectiveness through analytics.
    *   ⬜ Define chatbot persona, greeting messages, and escalation paths.
*   **System Configuration (for their campus):**
    *   ⬜ Manage campus-specific settings (e.g., branding elements like logo, primary color - if supported by multi-tenancy).
    *   ⬜ Define categories for circulars.
    *   ⬜ (Planned) Access a campus-specific admin dashboard with analytics on user activity, message volume, chatbot interactions, etc.
*   **Content Moderation (Planned):**
    *   ⬜ Oversee content and address reported messages or users.
    *   ⬜ Set content policies and filters.

### Super Administrator (Multi-Campus Management - Planned for Full Multi-Tenancy)

*   **This role is crucial for the "n no of universities" vision.**
*   **Tenant (University) Management:**
    *   ⬜ Onboard new universities/institutions onto the platform.
    *   ⬜ Configure and manage tenant-specific settings (domain, master admin account, feature flags).
    *   ⬜ Suspend or deactivate entire university instances.
*   **System-Wide Administration:**
    *   ⬜ Access a global dashboard with aggregated analytics across all universities.
    *   ⬜ Manage system-wide configurations and default settings.
    *   ⬜ Oversee platform health, performance, and security.
    *   ⬜ Manage billing and subscription plans for universities (if applicable for SaaS).
    *   ⬜ Deploy updates and new features to the platform.
    *   ⬜ Manage API integrations for third-party AI services.

## Key Features (Implemented & Planned)

-   **Authentication:** ✅ Secure JWT-based login/registration. ⬜ SSO/OAuth integration.
-   **Role-based Access Control:** ✅ Granular permissions for Students, Faculty, Campus Admins. ⬜ Super Admin role for multi-tenancy.
-   **Real-time Messaging:** ✅ Group and private chat (WebSockets). ✅ Text, links, documents. ⬜ File/Image attachments, typing indicators, user presence.
-   **Message Enhancements:** ✅ Reactions, ✅ Read Receipts.
-   **Circulars & Announcements:** ✅ Posting (Admin/Faculty), ✅ Viewing (All). ✅ AI Summarization. ⬜ Scheduling, targeting.
-   **AI Chatbot:** ✅ Campus Q&A. ⬜ Advanced RAG, feedback mechanisms, campus-specific customization by Admins.
-   **Notification System:** ✅ Push notifications, ✅ Notification Center. ⬜ Customizable preferences.
-   **User Management:** ✅ Basic CRUD by Admin. ⬜ Bulk actions, approval workflows.
-   **Admin Tools:** ✅ Chatbot content config, ✅ Special Announcement Channel. ⬜ Campus Admin Dashboard, ⬜ Super Admin Dashboard, ⬜ Multi-tenant management.
-   **UI/UX:** ⬜ Multilingual Support, ⬜ Dark/Light Theme, ⬜ Profile Avatars/Status, ⬜ Enhanced Search (messages, users, circulars), ⬜ Accessibility (a11y) compliance.
-   **Multi-Tenancy:** ⬜ Full support for isolating and managing multiple universities.

## Project Status

This matrix reflects the current implementation status against the full vision.

### Feature Implementation Matrix

| Feature / Role                | Student | Faculty | Campus Admin | Super Admin (Planned) |
|------------------------------|:-------:|:-------:|:------------:|:---------------------:|
| **Core Authentication & Profile** |         |         |              |                       |
| Register/Login (JWT)         |   ✅    |   ✅    |     ✅       |          ✅           |
| Update Profile               |   ✅    |   ✅    |     ✅       |          ✅           |
| Profile Avatars/Status       |   ⬜    |   ⬜    |     ⬜       |          ⬜           |
| **Messaging**                 |         |         |              |                       |
| Group & Private Messaging    |   ✅    |   ✅    |     ✅       |          ✅           |
| Real-time Messaging (WS)     |   ✅    |   ✅    |     ✅       |          ✅           |
| Send Text/Links/Documents    |   ✅    |   ✅    |     ✅       |          ✅           |
| File/Image Attachments       |   ⬜    |   ⬜    |     ⬜       |          ⬜           |
| Message Reactions            |   ✅    |   ✅    |     ✅       |          ✅           |
| Read Receipts                |   ✅    |   ✅    |     ✅       |          ✅           |
| Typing Indicators            |   ⬜    |   ⬜    |     ⬜       |          ⬜           |
| User Presence                |   ⬜    |   ⬜    |     ⬜       |          ⬜           |
| Search (Messages, Users)     |   ⬜    |   ⬜    |     ⬜       |          ⬜           |
| **Circulars & Announcements** |         |         |              |                       |
| Circulars (View)             |   ✅    |   ✅    |     ✅       |          ✅           |
| Circulars (Post/Upload)      |         |   ✅    |     ✅       |          ✅           |
| AI Circular Summarization    |         |   ✅    |     ✅       |          ✅           |
| **AI Chatbot**                |         |         |              |                       |
| AI Chatbot (Q&A)             |   ✅    |   ✅    |     ✅       |          ✅           |
| Configure Chatbot Content    |         |         |     ✅       |          ✅           |
| **Notifications**             |         |         |              |                       |
| Push Notifications           |   ✅    |   ✅    |     ✅       |          ✅           |
| Notification Center          |   ✅    |   ✅    |     ✅       |          ✅           |
| **Campus Admin Functions**    |         |         |              |                       |
| Special Announcement Channel |         |         |     ✅       |          ✅           |
| User Management (Campus)     |         |         |     ✅       |          N/A          |
| Admin Dashboard/Analytics    |         |         |     ⬜       |          N/A          |
| **System-Wide & UI**        |         |         |              |                       |
| Multilingual Support         |   ⬜    |   ⬜    |     ⬜       |          ⬜           |
| Dark/Light Theme             |   ⬜    |   ⬜    |     ⬜       |          ⬜           |
| Accessibility (a11y)         |   ⬜    |   ⬜    |     ⬜       |          ⬜           |
| **Multi-Tenancy (Super Admin)**|        |         |              |                       |
| Tenant (University) Mgmt     |   N/A   |   N/A   |    N/A       |          ⬜           |
| Global System Analytics      |   N/A   |   N/A   |    N/A       |          ⬜           |

**Legend:**
- ✅ = Implemented (core functionality for a single campus setup)
- ⬜ = Planned/Not yet implemented (essential for full vision, especially multi-tenancy)
- N/A = Not Applicable for this role directly

---

## Multi-Tenancy Architecture (Vision)

To support "n no of universities," Unichat AI is envisioned to adopt a multi-tenant architecture. Key considerations include:

1.  **Data Isolation:**
    *   **Strategy:** (e.g., Schema-per-tenant, Database-per-tenant, or Row-level security with a Tenant ID column in shared tables). This needs careful evaluation based on trade-offs (isolation, cost, complexity, performance).
    *   Ensuring that data from one university is strictly inaccessible to another.
2.  **Tenant Identification:**
    *   Requests must be mapped to the correct tenant (e.g., via subdomain, JWT claim, or a dedicated tenant identifier in API paths).
3.  **Customization & Configuration:**
    *   Allowing each university (tenant) to have specific configurations:
        *   Branding (logo, theme colors).
        *   Custom circular categories.
        *   Independent AI Chatbot knowledge bases and personas.
        *   Role definitions and permissions specific to their structure (if advanced).
4.  **Scalability & Resource Management:**
    *   Designing the infrastructure (database, application servers, AI services) to scale horizontally to accommodate numerous tenants and their users.
    *   Monitoring resource usage per tenant.
5.  **Onboarding & Provisioning:**
    *   A streamlined process for Super Admins to register new universities, set up their initial configuration, and create their Campus Admin accounts.
6.  **Authentication & Authorization:**
    *   Ensuring that authentication is tenant-aware and authorization policies respect tenant boundaries.

## Technology Stack

*(This remains largely the same but should be robust enough for the vision)*

-   **Frontend:** React.js / Next.js (Responsive Web UI, PWA capabilities)
-   **Backend:** (e.g., Node.js with NestJS/Express.js, Python with Django/FastAPI, Java with Spring Boot - *Choose a framework suitable for large, scalable applications*)
-   **Database:** PostgreSQL (good for relational data and row-level security) / MongoDB (flexible schema, but tenant isolation needs careful design)
-   **Real-time Communication:** WebSockets (e.g., Socket.IO, or a managed service like Ably/Pusher)
-   **Caching:** Redis
-   **Authentication:** JSON Web Tokens (JWT), potentially with OAuth2/OIDC for SSO.
-   **AI/NLP:**
    -   OpenAI API / HuggingFace API / Other LLM providers (for LLM tasks, RAG)
    -   Vector Databases (e.g., Pinecone, Weaviate) for efficient RAG.
-   **Push Notifications:** Firebase Cloud Messaging (FCM) / (Other: *Specify*)
-   **Search:** Elasticsearch / OpenSearch / Algolia (for advanced search capabilities)
-   **Deployment & Infrastructure:** Docker, Kubernetes, Cloud Provider (AWS, Azure, GCP), Serverless functions where appropriate.
-   **Monitoring & Logging:** Prometheus, Grafana, ELK Stack.

## Getting Started (Development Environment)

*(Instructions for setting up a development environment for the current codebase)*
... (keep existing or adapt as needed) ...

## Roadmap

The roadmap outlines the phased development towards the full vision of Unichat AI:

**Phase 1: Core Single-Campus Functionality (Partially Complete - ✅)**
-   [✅] Implement core features as per the matrix for a single campus.
-   [✅] Basic Student, Faculty, and Admin roles.
-   [ ] Refine existing features and address bugs.

**Phase 2: Enhancements & UX Improvements (Upcoming)**
-   [⬜] File/Image Attachments in messaging.
-   [⬜] Typing Indicators & User Presence.
-   [⬜] Advanced Search (Messages, Users, Circulars).
-   [⬜] Profile Avatars/Status.
-   [⬜] Dark/Light Theme.
-   [⬜] Initial Accessibility (a11y) improvements.
-   [⬜] Campus Admin Dashboard & Analytics (Basic).

**Phase 3: Multi-Tenancy Foundation (Strategic Development)**
-   [⬜] Design and implement core multi-tenant architecture (data isolation, tenant identification).
-   [⬜] Develop Super Administrator role and basic tenant management capabilities.
-   [⬜] Adapt authentication and authorization for multi-tenancy.
-   [⬜] Infrastructure planning for scalability.

**Phase 4: Full Multi-Tenancy & Advanced Features (Long-term Vision)**
-   [⬜] Full tenant customization options (branding, specific configurations).
-   [⬜] Advanced AI Chatbot management per tenant.
-   [⬜] Global Super Admin dashboard with cross-tenant analytics.
-   [⬜] Billing and subscription management (if commercialized).
-   [⬜] Comprehensive Accessibility (a11y) and Multilingual Support.
-   [⬜] PWA enhancements.

## System Architecture Highlights

-   **Modular & Microservices-Oriented (Vision):** For scalability and maintainability, backend services may be broken down (e.g., auth service, messaging service, AI service, tenant management service).
-   **API-First Design:** Well-defined APIs for frontend-backend communication and potential third-party integrations.
-   **Event-Driven Architecture (Consideration):** Using message queues (e.g., RabbitMQ, Kafka) for asynchronous tasks and inter-service communication, especially in a multi-tenant environment.
-   **Robust Security:** End-to-end encryption (HTTPS), secure JWT, input validation, protection against common web vulnerabilities (OWASP Top 10), regular security audits. Data privacy by design, especially for multi-tenancy.
-   **Scalability & Reliability:** Designed for high availability, fault tolerance, and horizontal scaling. Aiming for high uptime (e.g., 99.9%) with efficient resource utilization.

## Contributing
... (keep existing) ...

## License
... (keep existing) ...

## Contact
... (keep existing) ...

---

*This README outlines the comprehensive vision for Unichat AI. Development is an iterative process, and features will be implemented and refined over time. For current progress, refer to the "Project Status" matrix and the active development branches in the codebase.*