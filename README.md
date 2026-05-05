# BTS CRM Portal

A full-stack Lead Management System built for internal agency operations to track business outreach, client interactions, and team performance.

## Description

The BTS CRM Portal is a custom-built solution designed to replace manual spreadsheets with a streamlined digital workflow. It allows team members to log leads, track their niche, and maintain a chronological history of follow-ups. With integrated Role-Based Access Control, it ensures that data remains organized and accessible to the right people.

## Tech Stack

*   **Frontend:** React, Tailwind CSS (v4), Framer Motion, Lucide Icons
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB with Mongoose
*   **Security:** JSON Web Tokens (JWT), CORS

## Core Features

*   **Dual-Role System:** Support for both Admin and User roles with specific permissions.
*   **Lead Tracking:** Create and manage leads with fields for company names, contact persons (HR, CEO, etc.), social media links, and business niches.
*   **Follow-up History:** Add unlimited text-based follow-ups to any lead with automatic timestamping.
*   **Status Management:** Filter and update leads based on their current stage: New, In Progress, Rejected, or Confirm.
*   **Admin Dashboard:** Admins can monitor all team activities, including the ability to view, update, or delete any lead record.

## Project Structure

This repository contains both the frontend and backend code:
*   **Client:** The React-based dashboard interface.
*   **Server:** The Express API and MongoDB connection logic.

> [!WARNING]  
> **Proprietary Code:** This repository contains a private internal tool developed for ByteTechStudio. Copying, distributing, or using this code for personal or commercial purposes is strictly prohibited. Access is provided for portfolio review and evaluation only.
