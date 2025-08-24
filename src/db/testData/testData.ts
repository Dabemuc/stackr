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
  },
  {
    name: "Next.js",
    status: "Production-ready",
    description: "Fullstack React framework",
    links: ["https://nextjs.org"],
  },
  {
    name: "Angular",
    status: "Production-ready",
    description: "TypeScript-based frontend framework",
    links: ["https://angular.io"],
  },
  {
    name: "Vue.js",
    status: "Production-ready",
    description: "Progressive frontend framework",
    links: ["https://vuejs.org"],
  },
  {
    name: "PostgreSQL",
    status: "Production-ready",
    description: "Relational database",
    links: ["https://www.postgresql.org"],
  },
  {
    name: "MongoDB",
    status: "Production-ready",
    description: "NoSQL document database",
    links: ["https://www.mongodb.com"],
  },
  {
    name: "Prisma",
    status: "Production-ready",
    description: "Type-safe ORM for Node.js",
    links: ["https://www.prisma.io"],
  },
  {
    name: "TypeORM",
    status: "Production-ready",
    description: "ORM supporting multiple databases",
    links: ["https://typeorm.io"],
  },
  {
    name: "Firebase Auth",
    status: "Production-ready",
    description: "Authentication as a service",
    links: ["https://firebase.google.com/docs/auth"],
  },
  {
    name: "Supabase",
    status: "Experimental",
    description: "Open source Firebase alternative with Postgres",
    links: ["https://supabase.com"],
  },
  {
    name: "Auth0",
    status: "Production-ready",
    description: "Identity and authentication platform",
    links: ["https://auth0.com"],
  },
  {
    name: "Jest",
    status: "Production-ready",
    description: "JavaScript testing framework",
    links: ["https://jestjs.io"],
  },
  {
    name: "Playwright",
    status: "Experimental",
    description: "End-to-end testing framework",
    links: ["https://playwright.dev"],
  },
  {
    name: "Docker",
    status: "Production-ready",
    description: "Containerization platform",
    links: ["https://www.docker.com"],
  },
  {
    name: "Kubernetes",
    status: "Production-ready",
    description: "Container orchestration system",
    links: ["https://kubernetes.io"],
  },
  {
    name: "Stripe API",
    status: "Production-ready",
    description: "Payments API",
    links: ["https://stripe.com/docs/api"],
  },
  {
    name: "Segment",
    status: "Production-ready",
    description: "Analytics and data pipeline",
    links: ["https://segment.com"],
  },
  {
    name: "GitHub Actions",
    status: "Production-ready",
    description: "CI/CD for GitHub repositories",
    links: ["https://github.com/features/actions"],
  },
  {
    name: "CircleCI",
    status: "Production-ready",
    description: "Continuous integration & delivery",
    links: ["https://circleci.com"],
  },
  {
    name: "Terraform",
    status: "Production-ready",
    description: "Infrastructure as Code",
    links: ["https://www.terraform.io"],
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
