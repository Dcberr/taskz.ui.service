# FRONTEND_PLAN.md

# Sprint F1 - AI Task Dashboard MVP

## Goal

Build the first usable frontend for Taskz.

The frontend should allow users to:

* View tasks
* Filter tasks
* Inspect task details
* View AI-generated metadata
* Track task lifecycle
* View audit history

Backend APIs already exist.

This sprint focuses only on consuming existing APIs.

No Teams integration yet.

No authentication yet.

==================================================

# Tech Stack

## Core

* React 19
* TypeScript
* Vite

## UI

* Material UI (MUI)

## Data

* TanStack Query
* Axios

## Routing

* React Router

## Forms

* React Hook Form

## Date

* dayjs

==================================================

# Application Layout

---

Sidebar

---

Dashboard

Tasks

Completed

Analytics (placeholder)

---

Main Content

---

Task List

Task Detail Drawer

==================================================

# Epic F1.1 - Frontend Foundation

## Objective

Setup project architecture.

---

## Folder Structure

src/

app/

components/

features/

task/

dashboard/

shared/

api/

hooks/

layouts/

pages/

routes/

types/

utils/

---

## Tasks

* [ ] Setup React + TypeScript
* [ ] Setup MUI
* [ ] Setup React Router
* [ ] Setup Axios
* [ ] Setup TanStack Query
* [ ] Setup Layout System

==================================================

# Epic F1.2 - Task List Page

## Objective

Display tasks from backend.

---

## Endpoint

GET /api/tasks

---

## UI

Task Table

Columns

* Title
* Assignee
* Requester
* Priority
* Status
* Due Date
* Created At

---

## Features

* Pagination
* Sorting
* Refresh

---

## Tasks

* [ ] Task API Client
* [ ] Task Query Hook
* [ ] Task Table
* [ ] Pagination

==================================================

# Epic F1.3 - Dashboard Overview

## Objective

Create a management dashboard.

---

## Endpoint

GET /api/tasks/open

GET /api/tasks/completed

---

## Cards

Open Tasks

Completed Tasks

Blocked Tasks

Urgent Tasks

---

## Widgets

Recent Tasks

Upcoming Deadlines

---

## Tasks

* [ ] Dashboard Cards
* [ ] Dashboard Layout
* [ ] Dashboard API Hooks

==================================================

# Epic F1.4 - Task Filters

## Objective

Allow users to filter tasks.
Add CORS

---

## Backend Support

status

priority

assignee

---

## UI

Filter Bar

Status Select

Priority Select

Assignee Input

Clear Filters

---

## Tasks

* [ ] Filter State
* [ ] Add CORS
* [ ] URL Sync
* [ ] Query Params Mapping

==================================================

# Epic F1.5 - Task Detail Drawer

## Objective

Show full task information.

---

## Endpoint

GET /api/tasks/{id}

---

## UI

Right Side Drawer

Sections

General Information

AI Metadata

Source Information

Task Lifecycle

---

## Fields

Title

Description

Requester

Assignee

Priority

Status

Due Date

Source

Source Message Id

AI Confidence

Created At

Updated At

Completed At

---

## Tasks

* [ ] Detail API
* [ ] Drawer UI
* [ ] Metadata Section

==================================================

# Epic F1.6 - Task Actions

## Objective

Allow users to update tasks.

---

## Endpoints

PATCH /api/tasks/{id}/status

PATCH /api/tasks/{id}/priority

PATCH /api/tasks/{id}/assignee

---

## UI

Status Dropdown

Priority Dropdown

Assignee Input

Save Button

---

## Tasks

* [ ] Mutation Hooks
* [ ] Form Validation
* [ ] Optimistic Update

==================================================

# Epic F1.7 - Activity Timeline

## Objective

Visualize audit trail.

---

## Endpoint

GET /api/tasks/{id}/events

---

## UI

Vertical Timeline

Example

Task Created

↓

Priority Changed

↓

Status Changed

↓

Completed

---

## Event Mapping

TASK_CREATED

STATUS_CHANGED

PRIORITY_CHANGED

ASSIGNEE_CHANGED

TASK_COMPLETED

TASK_CANCELLED

---

## Tasks

* [ ] Timeline Component
* [ ] Event API
* [ ] Event Formatting

==================================================

# Epic F1.8 - AI Insights Section

## Objective

Highlight AI-generated information.

---

## Source

TaskDetailResponse

---

## UI Card

AI Confidence

Task Source

Source Message

AI Generated Flag

---

## Example

AI Confidence

94%

Source

MOCK

Generated From

Teams Message

---

## Tasks

* [ ] Confidence Badge
* [ ] Source Badge
* [ ] Metadata Card

==================================================

# Epic F1.9 - UX Polish

## Objective

Make the dashboard feel production-ready.

---

## Features

Loading States

Skeletons

Error States

Empty States

Success Toasts

Confirmation Dialogs

---

## Tasks

* [ ] Global Error Handling
* [ ] Loading Components
* [ ] Toast Notifications
* [ ] Fixes remaining UI bugs (due date 2026-06-17T06:00:00Z not displaying, status bar text being overlaid).

==================================================

# Success Criteria

User can:

✓ View tasks

✓ Filter tasks

✓ Open task detail

✓ Update status

✓ Update priority

✓ Reassign task

✓ View audit history

✓ View AI metadata

✓ Navigate without page reload

==================================================

# Sprint F2 Preview

Task Analytics

* Task Trends
* Priority Distribution
* Completion Rate
* AI Confidence Metrics

==================================================

# Sprint F3 Preview

Microsoft Teams Integration UI

* Incoming Messages
* Message Queue
* AI Analysis Review
* Task Approval Workflow
  """
