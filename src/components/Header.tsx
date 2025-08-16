import { Link } from "@tanstack/react-router";

import ClerkHeader from "../integrations/clerk/clerk-header.tsx";

export default function Header() {
  const headerElems: { name: string; to: string }[] = [
    { name: "Home", to: "/" },
    { name: "Build your stack", to: "/stack" },
  ];

  return (
    <header className="p-2 flex gap-2 bg-white text-black justify-between">
      <div className="flex justify-start">
        <div className="mx-15">Logo</div>

        <nav className="flex flex-row">
          {headerElems.map((elem, index) => (
            <div className="px-2 font-bold" key={"header-" + index}>
              <Link to={elem.to}>{elem.name}</Link>
            </div>
          ))}
        </nav>
      </div>

      <div>
        <ClerkHeader />
      </div>
    </header>
  );
}
