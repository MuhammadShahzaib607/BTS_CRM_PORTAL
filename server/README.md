# BTS CRM Portal (Backend)

A specialized internal Lead Management System built for ByteTechStudio to streamline business outreach and client tracking.

## Description

The BTS CRM Portal Backend provides a secure and scalable environment to manage business leads. It features a robust Role-Based Access Control (RBAC) system, allowing different levels of access for standard Users and Admins. The system is designed to handle the complete lifecycle of a lead—from the initial contact to final confirmation.

## Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB with Mongoose
* **Authentication:** JSON Web Tokens (JWT)
* **Security:** CORS, Dotenv

## Core Features

* **Role-Based Access Control:** Separate logic for Admins and Users. Admins have a global view of all leads across the entire team.
* **Lead Lifecycle Management:** API support for creating and updating detailed lead information (Company, Contact Person, Niche, Status, etc.).
* **Follow-up Logs:** A dedicated system to track chronological communication history for every lead with automatic timestamps.
* **Global Filters:** Endpoints designed to filter data based on Lead Status (New, In Progress, Rejected, Confirm).
* **Administrative Controls:** Full CRUD permissions for Admins to manage, audit, and clean up team-wide data.

> [!WARNING]  
> **Proprietary Code:** This repository contains a private internal tool developed for ByteTechStudio. Copying, distributing, or using this code for personal or commercial purposes is strictly prohibited. Access is provided for portfolio review and evaluation only.

## Architecture and Data Flow

* **User Authentication:** Every request is filtered through a JWT middleware. The payload includes the user's role to determine permission levels.
* **Lead Schema:** A flexible MongoDB schema where almost all fields are optional, allowing users to build a lead's profile over time as they gather more information.
* **Follow-up Sub-documents:** Follow-ups are stored as nested documents within each lead, ensuring all interaction history is retrieved in a single efficient query.
* **Admin Privilege:** Specialized controller logic allows Admin users to override standard ownership checks, providing a birds-eye view of team performance.
