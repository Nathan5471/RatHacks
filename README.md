# Rat Hacks

## Description

This is a website for Rat Hacks. It's homepage provides information for the upcoming hackathon! There are also accounts to manage things like events and workshops.

## Features

Participants get to have an account that manages signing up for events and workshops. They are able to edit their data through a settings page and perform actions like logging out of their accounts. When submitting participants upload their screenshot and video to a Cloudlfare R2 bucket. Organizer can create and manage events and workshops. Organizers also are able to see the users and send out emails within the website. Organizers are easily able to create backups, upload backups, and load from backups. There are judge accounts that are able to leave feedback on projects.

## Demo

You can test this out yourself at <https://demo.rathacks.com> by using the following credentials:

Organizer:

email - <demo.rathacks.com.putdown972@passinbox.com>

password - Organizer@123

## Hack Club Terra

### Email List

I added a pretty simple email list features that allows you to easily import external emails. This is so I can import emails from events like Haven Roanoke. It currently doesn't do much, but soon it'll be an option to send to people!

<img width="1920" height="878" alt="image" src="https://github.com/user-attachments/assets/70f27272-8b68-4275-b28c-bc27d8fc3a62" />

### Past Events Page

I added Haven Roanoke and made it look a bit better and display the whole photos instead of zooming in.

<img width="1915" height="1080" alt="image" src="https://github.com/user-attachments/assets/618d2482-926d-4a50-96b8-5cb8d79e401a" />

## Technologies

The frontend is build in TypeScript React and uses Axios to make called to the backend's API. The Backend is build in TypeScript ExpressJS. It handle tokens with JWT and sends emails through <https://loops.so>. There is a access token and refresh token system to keep users logged in. The database is PostgreSQL and is interfaced through Prisma.

### AI Usage

GitHub Copilot Tab Complete was used in the making of this project.

## Deployment

This is deployed with Docker! Check out the docker-compose.yaml and fill in the environment variables if you want to run this locally.
