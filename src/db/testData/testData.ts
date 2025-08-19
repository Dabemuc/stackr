import type { NewComponent, NewTag } from "@/db/schema";
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

export const tagLinks = [
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

// ---------------- Components ----------------
export const componentsData: NewComponent[] = [
  {
    name: "React",
    type: ["Framework"],
    status: "Production-ready",
    description: "JavaScript UI library",
    links: ["https://react.dev"],
  },
  {
    name: "Next.js",
    type: ["Framework"],
    status: "Production-ready",
    description: "Fullstack React framework",
    links: ["https://nextjs.org"],
  },
  {
    name: "Angular",
    type: ["Framework"],
    status: "Production-ready",
    description: "TypeScript-based frontend framework",
    links: ["https://angular.io"],
  },
  {
    name: "Vue.js",
    type: ["Framework"],
    status: "Production-ready",
    description: "Progressive frontend framework",
    links: ["https://vuejs.org"],
  },
  {
    name: "PostgreSQL",
    type: ["Database"],
    status: "Production-ready",
    description: "Relational database",
    links: ["https://www.postgresql.org"],
  },
  {
    name: "MongoDB",
    type: ["Database"],
    status: "Production-ready",
    description: "NoSQL document database",
    links: ["https://www.mongodb.com"],
  },
  {
    name: "Prisma",
    type: ["Tool"],
    status: "Production-ready",
    description: "Type-safe ORM for Node.js",
    links: ["https://www.prisma.io"],
  },
  {
    name: "TypeORM",
    type: ["Tool"],
    status: "Production-ready",
    description: "ORM supporting multiple databases",
    links: ["https://typeorm.io"],
  },
  {
    name: "Firebase Auth",
    type: ["Service"],
    status: "Production-ready",
    description: "Authentication as a service",
    links: ["https://firebase.google.com/docs/auth"],
  },
  {
    name: "Supabase",
    type: ["Platform"],
    status: "Experimental",
    description: "Open source Firebase alternative with Postgres",
    links: ["https://supabase.com"],
  },
  {
    name: "Auth0",
    type: ["Service"],
    status: "Production-ready",
    description: "Identity and authentication platform",
    links: ["https://auth0.com"],
  },
  {
    name: "Jest",
    type: ["Tool"],
    status: "Production-ready",
    description: "JavaScript testing framework",
    links: ["https://jestjs.io"],
  },
  {
    name: "Playwright",
    type: ["Tool"],
    status: "Experimental",
    description: "End-to-end testing framework",
    links: ["https://playwright.dev"],
  },
  {
    name: "Docker",
    type: ["Tool"],
    status: "Production-ready",
    description: "Containerization platform",
    links: ["https://www.docker.com"],
  },
  {
    name: "Kubernetes",
    type: ["Platform"],
    status: "Production-ready",
    description: "Container orchestration system",
    links: ["https://kubernetes.io"],
  },
  {
    name: "Stripe API",
    type: ["Service"],
    status: "Production-ready",
    description: "Payments API",
    links: ["https://stripe.com/docs/api"],
  },
  {
    name: "Segment",
    type: ["Service"],
    status: "Production-ready",
    description: "Analytics and data pipeline",
    links: ["https://segment.com"],
  },
  {
    name: "GitHub Actions",
    type: ["Platform"],
    status: "Production-ready",
    description: "CI/CD for GitHub repositories",
    links: ["https://github.com/features/actions"],
  },
  {
    name: "CircleCI",
    type: ["Platform"],
    status: "Production-ready",
    description: "Continuous integration & delivery",
    links: ["https://circleci.com"],
  },
  {
    name: "Terraform",
    type: ["Tool"],
    status: "Production-ready",
    description: "Infrastructure as Code",
    links: ["https://www.terraform.io"],
  },
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
