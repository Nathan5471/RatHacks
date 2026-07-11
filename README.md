# Rat Hacks

## Description

This is a website for Rat Hacks. It's homepage provides information for the upcoming hackathon! There are also accounts to manage things like events and workshops.

## Features

Participants get to have an account that manages signing up for events and workshops. They are able to edit their data through a settings page and perform actions like logging out of their accounts. When submitting participants upload their screenshot and video to a Cloudlfare R2 bucket. Organizer can create and manage events and workshops. Organizers also are able to see the users and send out emails within the website. Organizers are easily able to create backups, upload backups, and load from backups. There are judge accounts that are able to leave feedback on projects.

## Demo

You can test this out yourself at <https://demo.rathacks.com> by using the following credentials:

Organizer:

email - <4g5hfj@hack.af>

password - Organizer@123

Judge:

email - <0imwsn@rushilchopra.com>

password - Judge@123

Student:

email - <kjccr0@hack.af>

password - Student@123

## Horizons Nexus

### Improved Past Events Page

I brought every event in the past events page up to speed with the Campfire Roanoke one by adding "Organizers" and "Stats" section to all of them. I also added a "Sponsors" section to everyone as well that shows all of the parterns/sponsors of each event. I also rewrote all of the descriptions/paragraphs about the events to sound a bit better.

### Analytics

I swtiched from Matomo to using my own custom analytics. Currently it function by tracking page views and sending heartbeats. View sessions contain all page views of that session and can be extended once a heartbeat is sent. There is a page for organizers to view some statistics.

## Technologies

The frontend is build in TypeScript React and uses Axios to make called to the backend's API. The Backend is build in TypeScript ExpressJS. It handle tokens with JWT and sends emails through <https://loops.so>. There is a access token and refresh token system to keep users logged in. The database is PostgreSQL and is interfaced through Prisma.

### AI Usage

GitHub Copilot Tab Complete was used in the making of this project.

## Deployment

This is deployed with Docker! Check out the docker-compose.yaml and fill in the environment variables if you want to run this locally.
