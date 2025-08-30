import type { NewComponent, NewTag, NewType } from "@/db/schema";
import type { ComponentRelation } from "@/db/types";

// ---------------- Tags ----------------
export const tagsData: NewTag[] = [
  { name: "UI" },
  { name: "ORM" },
  { name: "Cloud" },
  { name: "Authentication" },
  { name: "Analytics" },
  { name: "DevOps" },
  { name: "Testing" },
  { name: "Payments" },
  { name: "CICD" },
];

// ---------------- Types ----------------
export const typesData: NewType[] = [
  { name: "Framework" },
  { name: "Database" },
  { name: "Tool" },
  { name: "Service" },
  { name: "Platform" },
];

// ---------------- Components ----------------
export const componentsData: NewComponent[] = [
  {
    name: "React",
    status: "Production-ready",
    description: "JavaScript UI library",
    links: ["https://react.dev"],
    article: `
# React
React is a **JavaScript library** for building user interfaces.  
It emphasizes a declarative, component-driven approach and powers some of the largest apps on the web.

## Key Features
- Component-based architecture
- Virtual DOM for efficient updates
- Strong ecosystem with tools like React Router and Redux
- Backed by Meta and a huge open-source community

## When to Use
Use React when building interactive UIs where state management and reusable components are important.
    `,
  },
  {
    name: "Next.js",
    status: "Production-ready",
    description: "Fullstack React framework",
    links: ["https://nextjs.org"],
    article: `
# Next.js
Next.js is a **fullstack framework** built on top of React.  

## Features
- File-based routing
- Server-side rendering (SSR) & static site generation (SSG)
- API routes for backend logic
- Excellent developer experience with hot reloads and TypeScript support

## Use Cases
Perfect for production-ready apps that need SEO, fast load times, or a hybrid SSR/SSG approach.
    `,
  },
  {
    name: "Angular",
    status: "Production-ready",
    description: "TypeScript-based frontend framework",
    links: ["https://angular.io"],
    article: `
# Angular
Angular is a **TypeScript-based web framework** developed by Google.

## Key Features
- Two-way data binding
- Dependency injection
- RxJS-powered reactive programming
- Strong typing with TypeScript

## Best For
Large-scale enterprise applications with complex requirements and long-term support needs.
    `,
  },
  {
    name: "Vue.js",
    status: "Production-ready",
    description: "Progressive frontend framework",
    links: ["https://vuejs.org"],
    article: `
# Vue.js
Vue.js is a **progressive frontend framework** that balances simplicity with powerful tooling.

## Highlights
- Lightweight and fast
- Single-file components (\`.vue\` files)
- Strong ecosystem (Vue Router, Pinia, Vite)

## Why Vue?
Great for teams who want flexibility, simplicity, and fast onboarding.
    `,
  },
  {
    name: "PostgreSQL",
    status: "Production-ready",
    description: "Relational database",
    links: ["https://www.postgresql.org"],
    article: `
# PostgreSQL
PostgreSQL is an **open-source relational database** known for reliability and standards compliance.

## Features
- ACID-compliant transactions
- Advanced SQL support
- Extensions (PostGIS, TimescaleDB)
- Strong performance for OLTP and OLAP

## Use Cases
Perfect for structured data, analytics, and applications needing strong data integrity.
    `,
  },
  {
    name: "MongoDB",
    status: "Production-ready",
    description: "NoSQL document database",
    links: ["https://www.mongodb.com"],
    article: `
# MongoDB
MongoDB is a **NoSQL document-oriented database**.

## Features
- Stores data as flexible JSON-like documents
- Horizontal scaling via sharding
- Powerful query language with aggregation pipeline
- Atlas cloud service for managed deployments

## Best Fit
Applications with flexible schemas or unstructured data.
    `,
  },
  {
    name: "Prisma",
    status: "Production-ready",
    description: "Type-safe ORM for Node.js",
    links: ["https://www.prisma.io"],
    article: `
# Prisma
Prisma is a **type-safe ORM** for Node.js and TypeScript.

## Features
- Auto-generated TypeScript client
- Declarative data modeling with Prisma Schema
- Migration system
- Works with PostgreSQL, MySQL, MongoDB, SQLite, and more

## Why Prisma?
Speeds up backend development with type safety and excellent developer tooling.
    `,
  },
  {
    name: "TypeORM",
    status: "Production-ready",
    description: "ORM supporting multiple databases",
    links: ["https://typeorm.io"],
    article: `
# TypeORM
TypeORM is a **database ORM** for Node.js written in TypeScript.

## Features
- Active Record and Data Mapper patterns
- Supports multiple databases (Postgres, MySQL, SQLite, etc.)
- Schema migrations
- Decorator-based entities

## Use Cases
Good for developers who prefer a TypeScript-native ORM with flexibility in architecture.
    `,
  },
  {
    name: "Firebase Auth",
    status: "Production-ready",
    description: "Authentication as a service",
    links: ["https://firebase.google.com/docs/auth"],
    article: `
# Firebase Auth
Firebase Auth is an **authentication-as-a-service** solution.

## Features
- Email/password, phone, and OAuth providers
- JWT-based tokens
- Tight integration with Firebase ecosystem
- Managed infrastructure

## Ideal For
Mobile and web apps that need fast, scalable, and low-maintenance auth.
    `,
  },
  {
    name: "Supabase",
    status: "Experimental",
    description: "Open source Firebase alternative with Postgres",
    links: ["https://supabase.com"],
    article: `
# Supabase
Supabase is an **open-source Firebase alternative** built on PostgreSQL.

## Features
- Instant APIs from database schema
- Authentication and storage
- Real-time subscriptions
- Self-hosted or cloud-managed

## Use Cases
Developers who want Firebase-like DX but with SQL and open standards.
    `,
  },
  {
    name: "Auth0",
    status: "Production-ready",
    description: "Identity and authentication platform",
    links: ["https://auth0.com"],
    article: `
# Auth0
Auth0 is an **identity and authentication platform**.

## Features
- OAuth2, OpenID Connect, SAML support
- Enterprise-grade identity federation
- Role-based access control
- SDKs for many languages and frameworks

## Why Auth0?
Best for production apps that need secure, enterprise-ready authentication.
    `,
  },
  {
    name: "Jest",
    status: "Production-ready",
    description: "JavaScript testing framework",
    links: ["https://jestjs.io"],
    article: `
# Jest
Jest is a **JavaScript testing framework**.

## Features
- Snapshot testing
- Fast watch mode
- Built-in mocking
- Great integration with React

## Best For
Unit and integration testing in JavaScript/TypeScript projects.
    `,
  },
  {
    name: "Playwright",
    status: "Experimental",
    description: "End-to-end testing framework",
    links: ["https://playwright.dev"],
    article: `
# Playwright
Playwright is a **modern end-to-end testing framework** by Microsoft.

## Features
- Cross-browser (Chromium, Firefox, WebKit)
- API for UI automation
- Headless and headed modes
- Parallel test execution

## Use Cases
Automated UI tests across browsers with consistent APIs.
    `,
  },
  {
    name: "Docker",
    status: "Production-ready",
    description: "Containerization platform",
    links: ["https://www.docker.com"],
    article: `
# Docker
Docker is a **containerization platform**.

## Highlights
- Package apps with dependencies in containers
- Portable across environments
- Large ecosystem of images (Docker Hub)
- Works well with CI/CD

## Best For
Developers wanting consistent environments across dev, test, and production.
    `,
  },
  {
    name: "Kubernetes",
    status: "Production-ready",
    description: "Container orchestration system",
    links: ["https://kubernetes.io"],
    article: `
# Kubernetes
Kubernetes is a **container orchestration system**.

## Features
- Automated scaling and deployment
- Service discovery and load balancing
- Rolling updates and self-healing
- Works with many cloud providers

## Why K8s?
Best for teams deploying microservices or complex container-based systems.
    `,
  },
  {
    name: "Stripe API",
    status: "Production-ready",
    description: "Payments API",
    links: ["https://stripe.com/docs/api"],
    article: `
# Stripe API
Stripe provides a **payments API** for developers.

## Features
- Secure payment processing
- Subscriptions and invoicing
- Webhooks for payment events
- Global currency and compliance support

## Use Cases
Perfect for apps needing payments, subscriptions, or marketplaces.
    `,
  },
  {
    name: "Segment",
    status: "Production-ready",
    description: "Analytics and data pipeline",
    links: ["https://segment.com"],
    article: `
# Segment
Segment is an **analytics and customer data platform**.

## Features
- Collects events from multiple sources
- Routes data to analytics, marketing, or BI tools
- Identity resolution across devices
- Strong integration ecosystem

## Ideal For
Centralizing data pipelines and analytics integrations.
    `,
  },
  {
    name: "GitHub Actions",
    status: "Production-ready",
    description: "CI/CD for GitHub repositories",
    links: ["https://github.com/features/actions"],
    article: `
# GitHub Actions
GitHub Actions provides **CI/CD pipelines** built into GitHub.

## Features
- Workflow automation with YAML
- Marketplace of reusable actions
- Strong integration with GitHub ecosystem
- Supports containers and VMs

## Use Cases
Automating builds, tests, and deployments directly in GitHub repos.
    `,
  },
  {
    name: "CircleCI",
    status: "Production-ready",
    description: "Continuous integration & delivery",
    links: ["https://circleci.com"],
    article: `
# CircleCI
CircleCI is a **continuous integration and delivery platform**.

## Features
- Cloud and self-hosted runners
- Flexible pipelines as code
- Caching for faster builds
- Rich ecosystem of orbs (reusable configs)

## Best Fit
Teams that want flexible, cloud-first CI/CD pipelines.
    `,
  },
  {
    name: "Terraform",
    status: "Production-ready",
    description: "Infrastructure as Code",
    links: ["https://www.terraform.io"],
    article: `
# Terraform
Terraform is an **Infrastructure as Code (IaC)** tool.

## Features
- Declarative configuration with HCL
- Works with multiple providers (AWS, GCP, Azure, etc.)
- State management for infra tracking
- Modular, reusable code

## Why Terraform?
Best for managing infrastructure at scale with reproducibility and version control.
    `,
  },
];

// ---------------- Components ↔ Tags ----------------
export const componentsTagsLinks = [
  { comp: "React", tags: ["UI"] },
  { comp: "Next.js", tags: ["UI", "Authentication"] },
  { comp: "Angular", tags: ["UI"] },
  { comp: "Vue.js", tags: ["UI"] },
  { comp: "PostgreSQL", tags: ["Cloud"] },
  { comp: "MongoDB", tags: ["Cloud"] },
  { comp: "Prisma", tags: ["ORM"] },
  { comp: "TypeORM", tags: ["ORM"] },
  { comp: "Firebase Auth", tags: ["Authentication"] },
  { comp: "Supabase", tags: ["Cloud", "Authentication"] },
  { comp: "Auth0", tags: ["Authentication"] },
  { comp: "Jest", tags: ["Testing"] },
  { comp: "Playwright", tags: ["Testing"] },
  { comp: "Docker", tags: ["DevOps"] },
  { comp: "Kubernetes", tags: ["DevOps"] },
  { comp: "Stripe API", tags: ["Payments"] },
  { comp: "Segment", tags: ["Analytics"] },
  { comp: "GitHub Actions", tags: ["CICD"] },
  { comp: "CircleCI", tags: ["CICD"] },
  { comp: "Terraform", tags: ["DevOps"] },
];

// ---------------- Components ↔ Types ----------------
export const componentsTypesLinks = [
  { comp: "React", types: ["Framework"] },
  { comp: "Next.js", types: ["Framework"] },
  { comp: "Angular", types: ["Framework"] },
  { comp: "Vue.js", types: ["Framework"] },
  { comp: "PostgreSQL", types: ["Database"] },
  { comp: "MongoDB", types: ["Database"] },
  { comp: "Prisma", types: ["Tool"] },
  { comp: "TypeORM", types: ["Tool"] },
  { comp: "Firebase Auth", types: ["Service"] },
  { comp: "Supabase", types: ["Platform"] },
  { comp: "Auth0", types: ["Service"] },
  { comp: "Jest", types: ["Tool"] },
  { comp: "Playwright", types: ["Tool"] },
  { comp: "Docker", types: ["Tool"] },
  { comp: "Kubernetes", types: ["Platform"] },
  { comp: "Stripe API", types: ["Service"] },
  { comp: "Segment", types: ["Service"] },
  { comp: "GitHub Actions", types: ["Platform"] },
  { comp: "CircleCI", types: ["Platform"] },
  { comp: "Terraform", types: ["Tool"] },
];

// ---------------- Relations ----------------
export const relationsData: {
  sourceName: string;
  targetName: string;
  relationType: ComponentRelation;
}[] = [
  { sourceName: "Next.js", targetName: "React", relationType: "Depends on" },
  { sourceName: "Vue.js", targetName: "React", relationType: "Alternative to" },
  {
    sourceName: "Angular",
    targetName: "React",
    relationType: "Alternative to",
  },
  {
    sourceName: "Prisma",
    targetName: "PostgreSQL",
    relationType: "Depends on",
  },
  {
    sourceName: "TypeORM",
    targetName: "PostgreSQL",
    relationType: "Depends on",
  },
  {
    sourceName: "MongoDB",
    targetName: "PostgreSQL",
    relationType: "Alternative to",
  },
  {
    sourceName: "Supabase",
    targetName: "PostgreSQL",
    relationType: "Depends on",
  },
  {
    sourceName: "Supabase",
    targetName: "Firebase Auth",
    relationType: "Alternative to",
  },
  {
    sourceName: "Auth0",
    targetName: "Firebase Auth",
    relationType: "Alternative to",
  },
  { sourceName: "Playwright", targetName: "Jest", relationType: "Complements" },
  {
    sourceName: "Kubernetes",
    targetName: "Docker",
    relationType: "Depends on",
  },
  {
    sourceName: "CircleCI",
    targetName: "GitHub Actions",
    relationType: "Alternative to",
  },
  {
    sourceName: "Terraform",
    targetName: "Kubernetes",
    relationType: "Complements",
  },
  {
    sourceName: "Segment",
    targetName: "Stripe API",
    relationType: "Complements",
  },
];
