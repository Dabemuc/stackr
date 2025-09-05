import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";

import Header from "../components/Header";

import ClerkProvider from "../integrations/clerk/provider";

import appCss from "../styles.css?url";
import { ThemeProvider } from "@/components/ThemeProvider";
import { NoThemeFlashScript } from "@/components/NoThemeFlashScript";
import { Toaster } from "@/components/ui/sonner";
import { DevtoolsWrapper } from "@/components/Devtools";
import { Suspense } from "react";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Stackr",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.svg",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,

  notFoundComponent: () => {
    return (
      <div>
        <p>Not found!</p>
        <Link to="/">Go home</Link>
      </div>
    );
  },
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head>
        <HeadContent />
        <NoThemeFlashScript />
      </head>
      <body className="h-full">
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <ClerkProvider>
            <Header />
            <Toaster
              position="bottom-center"
              visibleToasts={1}
              closeButton={true}
              expand={false}
            />
            {children}
            {import.meta.env.DEV && (
              <Suspense fallback={null}>
                <DevtoolsWrapper />
              </Suspense>
            )}
          </ClerkProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
