import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanstackDevtools } from "@tanstack/react-devtools";

import Header from "../components/Header";

import ClerkProvider from "../integrations/clerk/provider";

import appCss from "../styles.css?url";
import { ThemeProvider } from "@/components/ThemeProvider";
import { NoThemeFlashScript } from "@/components/NoThemeFlashScript";
import { Button } from "@/components/ui/button";
import { seedDb } from "@/db/db";
import { Toaster } from "@/components/ui/sonner";

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
        title: "TanStack Start Starter",
      },
    ],
    links: [
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
            <TanstackDevtools
              config={{
                position: "bottom-left",
              }}
              plugins={[
                {
                  name: "Tanstack Router",
                  render: <TanStackRouterDevtoolsPanel />,
                },
                {
                  name: "Stackr DevTools",
                  render: (
                    <div className="p-3">
                      <Button onClick={() => seedDb()}>Seed db</Button>
                    </div>
                  ),
                },
              ]}
            />
          </ClerkProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
