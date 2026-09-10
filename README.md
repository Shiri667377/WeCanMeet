# WeCanMeet

WeCanMeet is a guest-first web app for finding the best meeting time for a group based on everyone's availability.

## MVP

- Create a group without an account
- Define a date range and minimum meeting duration
- Share a group link
- Join as a guest
- Add and edit availability
- Identify returning participants
- View participant submission status
- Calculate and rank the best common meeting times
- Close a group to new submissions
- Google Calendar sync

## Tech Stack

### Frontend
- React
- JavaScript
- Vite

### Backend
- Java
- Spring Boot
- Maven

### Database
- PostgreSQL
- Spring Data JPA

### Security
- Secure admin and participant tokens
- SHA-256 token hashing
- HttpOnly cookies

## Main Data Model

- **Group** — group details, date range, meeting duration, active status
- **Participant** — guest participant belonging to a group
- **Availability** — participant availability windows

## Current Status

Completed:
- Core frontend
- Group creation and retrieval
- Group closing with admin authorization
- Participant creation
- Returning participant identification

In progress:
- Availability backend

Next:
- Matching and ranking logic
- Frontend-backend integration
- Validation and error handling
- Testing
- Docker and deployment
