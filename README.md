<h1 align="center">
  <br>
  <a href="https://stackr.dabemuc.de"><img src="https://raw.githubusercontent.com/Dabemuc/stackr/refs/heads/main/public/logo.svg" alt="Stackr" width="200"></a>
  <br>
    <a href="https://stackr.dabemuc.de">Stackr</a>
  <br>
</h1>

<h4 align="center">A personal knowledge base for every thing in IT.</h4>

<p align="center">
  <a href="#about">About</a> •
  <a href="#features">Features</a> •
  <a href="#demo">Demo</a> •
  <a href="#tech-stack">Tech-Stack</a> •
  <a href="#develop">Develop</a> •
  <a href="#deploy">Deploy</a>
</p>

## About

Stackr is a self-hostable knowledge base for every thing you come across in IT. <br />
It aims at being a place where you put new stuff you learn, as well as making it easier to find solutions for a task at hand.

Also feel free to use mine hosted at <https://stackr.dabemuc.de>. <br />
Though my focus may differ from yours.

## Features

- Organize IT knowledge into searchable entries
- Tagging and categorization
- Powerful views and filter-functionality
- Self-hostable

## Demo

TODO: Add gif

## Tech-Stack

- Fullstack Framework: [TanStack start](https://tanstack.com/start/latest) (Vite, React, TanStack Router, Typescript, Tailwind)
- Database: [Neon Postgres](https://neon.com/)
- ORM: [Drizzle](https://orm.drizzle.team/)
- Cache: [Upstash](https://upstash.com/)
- Auth Provider: [Clerk](https://clerk.com/)
- Component Library: [Shadcn](https://ui.shadcn.com/)

Currently deployed on a always-free Oracle Cloud VM.Standard.E2.1.Micro and built using GitHub Actions.

## Develop

Note: All following commands should be run from the projects root directory.

### Dev Server

1. Install packages: `npm install`
2. Rename .example.env to .env and fill in secrets
3. Push schema to db: `npm run drizzle:dev:push`
4. Run dev server: `npm run dev`

### Npm utils

- Generate drizzle migration: `npm run drizzle:generate`
- Migrate db using drizzle migrations: `npm run drizzle:[prod|dev]:migrate` <br />
  (Expects a .env.\[production|development\])
- Push drizzle schema to db: `npm run drizzle:[prod|dev]:push` <br />
  (Expects a .env.\[production|development\])

### Tanstack devtools

Found on the bottom left corner when running in dev environment

- "Seed db"-Button: Clears and fills dev db using seed script at /src/db/testData/seedTestData.ts

## Deploy

Note: Simply running `npm run build` and `npm run start` will result in a working build, but the **application expects certain env vars to be set** and **clerk expects your production request to be coming from a domain**. Although you obviously can set all the env vars directly on your host machine, the recommended way is to build and run the docker image.

Build image with public env vars:

```sh
docker build --build-arg VITE_CLERK_PUBLISHABLE_KEY=[YOUR CLERK PUBLISHABLE KEY] -t stackr .
```

Don't forget to push the schema to the prod db using the appropriate [npm script](#npm-utils).

How you proceed with the image depends on the infrastructure you want to deploy on. You might want to push the image to a registry and have your orchestrator fetch it. For the sake of simplicity the following is an example on how to run the image on the same machine it was built on:

```sh
docker run -p 3000:3000 \
-e VITE_CLERK_PUBLISHABLE_KEY='[YOUR CLERK PUBLISHABLE KEY]' \
-e CLERK_SECRET_KEY='[YOUR CLERK SECRET KEY]' \
-e DATABASE_URL='[YOUR NEON DB URL]' \
--name stackr \
stackr
```
