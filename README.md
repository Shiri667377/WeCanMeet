# WeCanMeet

A web app for finding the best meeting time for a group based on everyone's availability.

## The Idea

Instead of choosing a few predefined time slots and asking everyone to vote, WeCanMeet allows a group to define a relevant date range.

Each participant provides their availability manually or by connecting their Google Calendar, and the system finds and ranks the best meeting times automatically.

## MVP

* Create a group as a guest
* Define a group name and relevant date range
* Share an invite link with participants
* Join a group without creating an account
* Add availability manually
* Sync availability with Google Calendar
* Edit previously submitted availability
* View participants and their submission status
* Automatically calculate the best common meeting times
* Filter the suggested results
* Edit group details
* Open or close the invite link

## Current Tech Stack

### Frontend

* React
* TypeScript

### Backend

* Java
* Spring Boot
* Maven

### Database

* PostgreSQL
* Spring Data JPA

### External Integration

* Google OAuth 2.0
* Google Calendar API

### Later

* Docker
* Automated testing
* Deployment

## Main Data Model

* **Group** — the meeting group and its date range
* **Participant** — a guest participating in a specific group
* **Availability** — one or more availability windows belonging to a participant

A participant is currently identified only within a specific group. User accounts may be added in a future version.

## Project Status

🚧 In development — initial backend setup.
