# Social Events Server

REST API for the Social Development Events Platform, built with Express and MongoDB.

## Setup

1. Run `npm install`
2. Copy `.env.example` to `.env` and fill in your values
3. Run `npm run dev`

## Endpoints

| Method | Route | Access | Purpose |
|---|---|---|---|
| GET | /events | Public | Upcoming events (supports limit, type, search) |
| GET | /events/:id | Public | Single event details |
| POST | /events | JWT | Create an event |
| GET | /my-events | JWT | Events created by the user |
| PUT | /events/:id | JWT | Update own event |
| DELETE | /events/:id | JWT | Delete own event |
| POST | /events/:id/join | JWT | Join an event |
| GET | /joined-events | JWT | Events joined by the user |