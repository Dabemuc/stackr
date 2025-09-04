import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignInButton,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";

export default function ClerkHeader() {
  return (
    <>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignInButton>
          <Button variant={"secondary"}>Sign in</Button>
        </SignInButton>
      </SignedOut>
    </>
  );
}
