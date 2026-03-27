import { TabNav, DropdownMenu, Button, Text, Flex } from "@radix-ui/themes";
import { NavLink, useLocation, useNavigate } from "react-router";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useState, useContext } from "react";
import AuthContext from "../context";
import Cookies from "js-cookie";

export function Navigation({ theme, changeTheme }) {
    const location = useLocation();
    const navigate = useNavigate();

    const { isAuth, setIsAuth, isAdmin, setIsAdmin } = useContext(AuthContext);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const tabs = [
        {
            path: "/",
            label: "Главная",
            auth: false,
            guest: false,
        },
        {
            path: "/admin",
            label: "Админка",
            auth: true,
            guest: false,
        },
        // {
        //     path: "/registration",
        //     label: "Регистрация",
        //     auth: false,
        //     guest: true,
        // },
        // {
        //     path: "/auth",
        //     label: "Авторизация",
        //     auth: false,
        //     guest: true,
        // },
    ];

    // Функция для проверки, активен ли путь (с поддержкой вложенных маршрутов)
    const isTabActive = (tabPath) => {
        if (tabPath === "/") {
            return location.pathname === "/";
        }
        // Для вложенных маршрутов, например /settings/notifications
        return location.pathname.startsWith(tabPath);
    };

    const ActualTabs = tabs.map((tab, index) => {
        if (!tab || typeof tab !== "object") {
            return null;
        }

        return (
            <TabNav.Link
                key={index}
                asChild
                active={isTabActive(tab.path)}
                style={{
                    height: 52,
                    fontSize: 16,
                    display:
                        !tab.auth && !tab.guest
                            ? "flex"
                            : !isAuth && tab.guest
                              ? "flex"
                              : isAuth && tab.auth
                                ? "flex"
                                : "none",
                }}
            >
                <NavLink to={tab.path}>{tab.label}</NavLink>
            </TabNav.Link>
        );
    });

    const closeMenu = () => {
        if (isMenuOpen) setIsMenuOpen(false);
    };

    const handleMenuChanged = (openOrClose) => {
        setIsMenuOpen(openOrClose);
    };

    const exitFromAccount = () => {
        const allCookies = Cookies.get();
        Object.keys(allCookies).forEach((cookieName) => {
            Cookies.remove(cookieName);
        });

        setIsAuth(false);
        localStorage.removeItem("authentificated");

        setIsAdmin(false);
        localStorage.removeItem("isAdmin");

        navigate("/auth", { replace: true });
    };

    return (
        <TabNav.Root className="w-full h-15 items-center @container">
            <div className="w-full flex items-center @min-[425px]:justify-center">
                <TabNav.Link asChild>
                    <a onClick={changeTheme}>
                        {theme === "light" ? (
                            <SunIcon className="w-6 h-6" />
                        ) : (
                            <MoonIcon className="w-6 h-6" />
                        )}
                    </a>
                </TabNav.Link>

                {ActualTabs}

                <TabNav.Link
                    asChild
                    style={{
                        height: 52,
                        fontSize: 16,
                        cursor: "pointer",
                        display: isAuth ? "flex" : "none",
                    }}
                    onClick={exitFromAccount}
                >
                    <Text>Выйти</Text>
                </TabNav.Link>

                <DropdownMenu.Root
                    asChild
                    open={isMenuOpen}
                    onOpenChange={handleMenuChanged}
                >
                    <DropdownMenu.Trigger
                        style={{
                            marginLeft: 10,
                            marginRight: 10,
                            display: isAuth ? "none" : "flex",
                        }}
                    >
                        <Button variant="outline" style={{ fontSize: 16 }}>
                            Войти
                            <DropdownMenu.TriggerIcon />
                        </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Item
                            onClick={closeMenu}
                            style={{
                                paddingTop: 8,
                                paddingBottom: 8,
                                fontSize: 16,
                            }}
                        >
                            <NavLink to="/registration">Регистрация</NavLink>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                            onClick={closeMenu}
                            style={{
                                marginTop: 4,
                                paddingTop: 8,
                                paddingBottom: 8,
                                fontSize: 16,
                            }}
                        >
                            <NavLink to="/auth">Авторизация</NavLink>
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </div>
        </TabNav.Root>
    );
}
