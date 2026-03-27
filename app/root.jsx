import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "react-router";

import "./app.css";
import "@radix-ui/themes/styles.css";

import { Navigation } from "./components/navigation";
import { Theme, TabNav } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import AuthContext from "./context";

export const links = () => [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
    },
    {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
    },
];

export function Layout({ children }) {
    const [theme, setTheme] = useState("light");
    const [isAuth, setIsAuth] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const changeThemeHandle = () => {
        const gotTheme = theme === "light" ? "dark" : "light";
        setTheme(gotTheme);
    };

    useEffect(() => {
        if (localStorage.getItem("authentificated") !== null) {
            setIsAuth(true);
        }
        if (localStorage.getItem("isAdmin" !== null)) {
            setIsAdmin(true);
        }

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleChange = (e) => {
            setTheme(e.matches ? "dark" : "light");
        };

        setTheme(mediaQuery.matches ? "dark" : "light");

        mediaQuery.addEventListener("change", handleChange);

        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body>
                <Theme
                    appearance={theme}
                    accentColor="jade"
                    panelBackground="translucent"
                    radius="large"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <AuthContext.Provider
                        value={{
                            theme,
                            isAuth,
                            setIsAuth,
                            isAdmin,
                            setIsAdmin,
                        }}
                    >
                        <Navigation
                            theme={theme}
                            changeTheme={changeThemeHandle}
                        ></Navigation>

                        {children}
                    </AuthContext.Provider>
                </Theme>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return <Outlet />;
}

export function ErrorBoundary({ error }) {
    let message = "Oops!";
    let details = "An unexpected error occurred.";
    let stack;

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? "404" : "Error";
        details =
            error.status === 404
                ? "The requested page could not be found."
                : error.statusText || details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <main className="pt-16 p-4 container mx-auto">
            <h1>{message}</h1>
            <p>{details}</p>
            {stack && (
                <pre className="w-full p-4 overflow-x-auto">
                    <code>{stack}</code>
                </pre>
            )}
        </main>
    );
}
