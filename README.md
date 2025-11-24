# Rat Hacks

## Description

This is a website for Rat Hacks. It's homepage provides information for the upcoming hackathon! There are also accounts to manage things like events and workshops.

## Features

Participants get to have an account that manages signing up for events and workshops. They are able to edit their data through a settings page and perform actions like logging out of their accounts. Organizer can create and manage events and workshops. Organizers also are able to see the users and send out emails within the website. There are judge accounts that are able to leave feedback on projects.

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

## Demo Video For Siege Week 12

https://github.com/user-attachments/assets/146116a9-1786-478d-9e64-a10666cb7403

## Technologies

The frontend is build in TypeScript React and uses Axios to make called to the backend's API. The Backend is build in TypeScript ExpressJS. It handle tokens with JWT and sends emails through <https://loops.so>. There is a access token and refresh token system to keep users logged in. The database is PostgreSQL and is interfaced through Prisma.

## Deployment

This is deployed with Docker! Check out the docker-compose.yaml and fill in the environment variables if you want to run this locally.
