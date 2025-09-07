import { Link } from "@tanstack/react-router";

import ClerkHeader from "../integrations/clerk/clerk-header.tsx";
import { ModeToggle } from "./ModeToggle.tsx";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "./ui/button.tsx";
import { useState } from "react";
import { AlignJustifyIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "./ui/separator.tsx";

type HeaderElem = { name: string; to: string };

export default function Header() {
  const { isSignedIn, sessionClaims } = useAuth();
  const [accordionOpen, setAccordionOpen] = useState(false);

  const headerElems: HeaderElem[] = [
    { name: "Overview", to: "/" },
    { name: "Build your stack", to: "/stack" },
    { name: "About", to: "/about" },
    ...(isSignedIn && sessionClaims.metadata.role === "admin"
      ? [{ name: "Add Component", to: "/add" }]
      : []),
  ];

  return (
    <header className="px-6 py-3 shadow-sm bg-background flex flex-col">
      <div className="flex items-center justify-between">
        {/* Left section: Name + Nav */}
        <div className="flex items-center gap-8">
          <div className="flex items-center">
            {/* Logo */}
            <img src={"/logo.svg"} className="w-auto h-8 mr-1" />
            <div className="text-xl font-extrabold tracking-tight">Stackr</div>
          </div>
          <div className="hidden md:block">
            <DesktopNav headerElems={headerElems} />
          </div>
        </div>

        {/* Mobile Nav Button */}
        <div className="md:hidden">
          <MobileNavButton
            accordionOpen={accordionOpen}
            setAccordionOpen={setAccordionOpen}
          />
        </div>

        {/* Right section: Mode toggle + Clerk */}
        <div className="items-center gap-4 hidden md:flex">
          <ModeToggle />
          <ClerkHeader />
        </div>
      </div>

      {/* Mobile Accordion */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          accordionOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <MobileNav headerElems={headerElems} />
      </div>
    </header>
  );
}

function DesktopNav({ headerElems }: { headerElems: HeaderElem[] }) {
  return (
    <nav className="flex items-center gap-6">
      {Array.from(headerElems).map((elem, index) => (
        <Link
          key={"header-" + index}
          to={elem.to}
          className="text-sm font-medium transition-colors hover:text-primary hover:underline"
        >
          {elem.name}
        </Link>
      ))}
    </nav>
  );
}

function MobileNavButton({
  accordionOpen,
  setAccordionOpen,
}: {
  accordionOpen: boolean;
  setAccordionOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Button variant="ghost" onClick={() => setAccordionOpen(!accordionOpen)}>
      <AnimatePresence mode="wait" initial={false}>
        {accordionOpen ? (
          <motion.div
            key="x"
            initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <X className="scale-125" />
          </motion.div>
        ) : (
          <motion.div
            key="hamburger"
            initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <AlignJustifyIcon className="scale-125" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}

function MobileNav({ headerElems }: { headerElems: HeaderElem[] }) {
  return (
    <div className="flex flex-col gap-4 items-start w-full mt-3 rounded-b-2xl">
      <div className="flex flex-col gap-4 pt-4 w-full">
        {Array.from(headerElems).map((elem, index) => (
          <div key={"header-" + index}>
            <Link
              to={elem.to}
              className="pl-4 font-medium transition-colors hover:text-primary hover:underline"
            >
              {elem.name}
            </Link>
            <Separator />
          </div>
        ))}
      </div>
      <div className="flex justify-end w-full gap-4">
        <ModeToggle />
        <ClerkHeader />
      </div>
    </div>
  );
}
