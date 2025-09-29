# Rat Hacks

## Description

This is a website for Rat Hacks. It's homepage provides information for the upcoming hackathon! There are also accounts to manage things like events and workshops.

## Features

Participants get to have an account that manages signing up for events and workshops. They are able to edit their data through a settings page and perform actions like logging out of their accounts. Organizer can create and manage events and workshops.

## Demo

You can test this out yourself at <https://demo.rathacks.com> by using the following credentials:

Organizer:

email - <0agokw@hack.af>

password - Organizer@123

Student:

email - <ekiwlh@hack.af>

password - Student@123

## Technologies

The frontend is build in TypeScript React and uses Axios to make called to the backend's API. The Backend is build in TypeScript ExpressJS. It handle tokens with JWT and sends emails through <https://loops.so>.

## Deployment

This is deployed with Docker! Check out the docker-compose.yaml and fill in the environment variables if you want to run this locally.
