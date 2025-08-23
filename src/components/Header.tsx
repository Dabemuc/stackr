import { Link } from "@tanstack/react-router";

import ClerkHeader from "../integrations/clerk/clerk-header.tsx";
import { ModeToggle } from "./ModeToggle.tsx";

export default function Header() {
  const headerElems: { name: string; to: string }[] = [
    { name: "Overview", to: "/" },
    { name: "Build your stack", to: "/stack" },
  ];

  return (
    <header className="flex items-center justify-between px-6 py-3 shadow-sm bg-background">
      {/* Left section: Logo + Nav */}
      <div className="flex items-center gap-8">
        <div className="text-xl font-extrabold tracking-tight">Stackr</div>

        <nav className="flex items-center gap-6">
          {headerElems.map((elem, index) => (
            <Link
              key={"header-" + index}
              to={elem.to}
              className="text-sm font-medium transition-colors hover:text-primary hover:underline"
            >
              {elem.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Right section: Mode toggle + Clerk */}
      <div className="flex items-center gap-4">
        <ModeToggle />
        <ClerkHeader />
      </div>
    </header>
  );
}
