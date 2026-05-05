# BTS CRM Portal (Frontend)

A modern, fast, and intuitive dashboard built for ByteTechStudio to manage business leads and follow-ups.

## Description

The BTS CRM Portal Frontend is an internal dashboard designed for high productivity. It allows team members to track their outreach efforts, manage company contacts, and log every interaction in real-time. Built with a focus on speed and clarity, it helps the agency stay organized and never miss a follow-up.

## Tech Stack

* **Framework:** React.JS
* **Routing:** React Router DOM
* **Styling:** Tailwind CSS (v4)
* **Icons:** Lucide React
* **Animations:** Framer Motion
* **API Client:** Axios

## Core Features

* **Lead Tracking Dashboard:** A clean interface to create leads with fields for company names, contact roles (CEO, HR, Manager), and business niches.
* **Dynamic Lead Updates:** Fields are easily updatable as more data becomes available, ensuring the lead profile grows with the conversation.
* **Real-time Follow-up Logs:** A dedicated section for each lead to record text-based follow-ups. Timestamps are generated automatically for every entry.
* **Status Management:** Visual indicators for lead status (New, In Progress, Rejected, Confirm) with quick-action updates.
* **Admin Overview:** A specialized view for administrators to monitor the entire team's progress, including total counts of confirmed or rejected leads.
* **Modern UI:** Responsive design with smooth transitions and professional icons for a premium internal tool feel.

## Setup Instructions

> [!WARNING]  
> **Proprietary Code:** This repository contains a private internal tool developed for ByteTechStudio. Copying, distributing, or using this code for personal or commercial purposes is strictly prohibited. Access is provided for portfolio review and evaluation only.

## Architecture and Data Flow

* **Client-Side Routing:** Managed via `react-router-dom` to separate the Authentication (Login/Signup) pages from the main Dashboard.
* **State Management:** Uses a combination of React hooks and Axios to manage live lead data and UI states.
* **Follow-up Interaction:** When a user logs a follow-up, the UI optimistically updates to show the new entry immediately while the backend confirms the save.
* **Filtering Logic:** Frontend-driven filters allow users to quickly toggle between "New" leads and "Confirmed" clients without page reloads.
