# Rat Hacks

## Description

This is a website for Rat Hacks. Currently it has a home page to see all of the previous projects from the last hackathon. It also has an ccount system that will be used to manage future signups and submissions for future events hosted by Rat Hacks.

## Features

Participants get to have an account that manages signing up for events. They also have tools to manage their account by doing things like logging out of all devices or editing their information. Organizers are able to create events and and manage them.

## Demo

You can test this out yourself at <https://rathacks.com> by using the following credentials:

Organizer:

email - <e0bg3a@hack.af>

password - Organizer@123

Student:

email - <e9do1a@hack.af>

password - Student@123

## Technologies

The frontend is build in TypeScript React and uses Axios to make called to the backend's API. The Backend is build in TypeScript ExpressJS. It handle tokens with JWT and sends emails through <https://loops.so>.

## Deployment

This is deployed with Docker! Check out the docker-compose.yaml and fill in the environment variables if you want to run this locally.
