import {
    ArchiveIcon,
    BellIcon,
    BlendingModeIcon,
    ClockIcon,
    DiscIcon,
    PersonIcon,
    RocketIcon,
    SizeIcon,
} from "@radix-ui/react-icons";
import {
    Badge,
    Box,
    Button,
    Card,
    DataList,
    Dialog,
    Flex,
    ScrollArea,
    Select,
    Skeleton,
    Spinner,
    Strong,
    Table,
    Text,
    TextField,
} from "@radix-ui/themes";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import DepositsList from "../components/depositsList";
import ActivityForm from "../components/activityForm";
import AuthContext from "../context";

const API_URL = import.meta.env.VITE_API_URL;
// const API_URL = "http://127.0.0.1:8000";

function useMediaQuery(query) {
    const mediaQuery = useMemo(() => window.matchMedia(query), [query]);
    const [match, setMatch] = useState(mediaQuery.matches);

    useEffect(() => {
        const onChange = () => setMatch(mediaQuery.matches);
        mediaQuery.addEventListener("change", onChange);

        return () => mediaQuery.removeEventListener("change", onChange);
    }, [mediaQuery]);

    return match;
}

function useMediaQueries() {
    const sm = useMediaQuery("(min-width: 320px)");
    const smx = useMediaQuery("(min-width: 375px)");
    const smxx = useMediaQuery("(min-width: 420px)");
    const smxxx = useMediaQuery("(min-width: 500px)");
    const md = useMediaQuery("(min-width: 580px)");
    const lg = useMediaQuery("(min-width: 768px)");
    const xl = useMediaQuery("(min-width: 1024px)");

    return { sm, smx, smxx, smxxx, md, lg, xl };
}

export default function Admin() {
    const media = useMediaQueries();

    const { isAuth, isAdmin, setIsAuth, setIsAdmin } = useContext(AuthContext);
    const navigate = useNavigate();
    const hasFetched = useRef(false);

    const deposits = [
        {
            id: 3,
            created_at: "2026-03-23 10:09:20.165",
            machine: "fer2",
            size: "M",
            color: "Синий",
            tokens_count: 8,
        },
        {
            id: 2,
            created_at: "2026-03-18 20:18:05.763",
            machine: "fer2",
            size: "L",
            color: "Синий",
            tokens_count: 12,
        },
        {
            id: 1,
            created_at: "2026-03-18 20:17:20.800",
            machine: "fer2",
            size: "M",
            color: "Красный",
            tokens_count: 8,
        },
    ];

    const [users, setUsers] = useState([]);
    const [allDeposits, setAllDeposits] = useState([]);
    const [sessions, setSessions] = useState([]);

    const [userIsAdmin, setUserIsAdmin] = useState(false);

    const getColorFromColor = (colorValue) => {
        switch (colorValue) {
            case "unknown":
                return "gray";
            case "Красный":
                return "red";
            case "Синий":
                return "blue";
            case "Зеленый":
                return "jade";
            case "Желтый":
                return "amber";
            case "Черный":
                return "gray";
            case "Белый":
                return "bronze";
            default:
                return "gray";
        }
    };

    const getColorFromSize = (sizeValue) => {
        switch (sizeValue) {
            case "unknown":
                return "gray";
            case "M":
                return "lime";
            case "L":
                return "jade";
            case "XL":
                return "indigo";
            case "XXL":
                return "plum";
            default:
                return "gray";
        }
    };

    const [emailFilter, setEmailFilter] = useState("");
    const [machineFilter, setMachineFilter] = useState("");
    const [colorFilter, setColorFilter] = useState("");
    const [sizeFilter, setSizeFilter] = useState("");

    const changeEmailFilter = (event) => {
        setEmailFilter(event.target.value);
    };

    const filteredCaps = useMemo(() => {
        return allDeposits.filter(
            (dep) =>
                dep.machine.includes(machineFilter) &&
                dep.color.includes(colorFilter) &&
                dep.size.includes(sizeFilter),
        );
    }, [allDeposits, machineFilter, colorFilter, sizeFilter]);

    const clearFilters = () => {
        setMachineFilter("");
        setColorFilter("");
        setSizeFilter("");
    };

    useEffect(() => {
        if (hasFetched.current) {
            return;
        }

        if (
            (!isAuth && localStorage.getItem("authentificated") === null) ||
            (!isAdmin && localStorage.getItem("isAdmin") === null)
        ) {
            navigate("/auth", { replace: true });
            return;
        }

        const fetchAdminData = async () => {
            const response = await fetch(`${API_URL}/api/get-admin-info`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });
            const responseData = await response.json();
            console.log(responseData);

            if (responseData.status === "Successful") {
                setUsers([...responseData.users]);
                setAllDeposits([...responseData.deposits]);
                setSessions([...responseData.sessions]);
            } else if (
                responseData.message === "Invalid Token" ||
                responseData.message === "Token Error"
            ) {
                setIsAuth(false);
                localStorage.removeItem("authentificated");

                setIsAdmin(false);
                localStorage.removeItem("isAdmin");

                navigate("/auth", { replace: true });
                return;
            }
        };

        hasFetched.current = true;
        fetchAdminData();
    }, [hasFetched]);

    const updateUserRole = (id, boolValue) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === id ? { ...user, is_admin: boolValue } : user,
            ),
        );
    };

    const formateDate = (str) => {
        const fullDate = new Date(str);

        return fullDate;
    };

    const filteredSessions = (userId) => {
        const thisSessions = sessions
            .filter((s) => s !== null && s.user_id === userId)
            .sort(
                (a, b) =>
                    formateDate(a.first_activity_time) -
                    formateDate(b.first_activity_time),
            );
        return thisSessions;
    };

    const usersTable = useMemo(() => {
        const filteredUsers = users.filter(
            (el) => el && el.email && el.email.includes(emailFilter),
        );

        return (
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>
                            Статистика
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Роль</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>
                            Права админа
                        </Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {filteredUsers.map((user, index) => {
                        if (!user || typeof user !== "object") {
                            return null;
                        }

                        return (
                            <Table.Row key={index}>
                                <Table.Cell>
                                    <Dialog.Root>
                                        <Dialog.Trigger>
                                            <Button color="jade">
                                                Посмотреть
                                            </Button>
                                        </Dialog.Trigger>

                                        <Dialog.Content maxWidth="850px">
                                            <Dialog.Title
                                                className="text-center"
                                                mb="5"
                                                style={{
                                                    fontSize: 28,
                                                }}
                                            >
                                                Статистика пользователя
                                            </Dialog.Title>

                                            <Flex
                                                wrap="wrap"
                                                gap={"4"}
                                                className="grow flex-2"
                                            >
                                                <Card className="grow flex-1 min-w-64">
                                                    <Flex
                                                        align="center"
                                                        justify="center"
                                                        className="pb-3 gap-2"
                                                    >
                                                        <PersonIcon className="w-5 h-5" />
                                                        <h3 className="font-medium text-center">
                                                            Аккаунт
                                                        </h3>
                                                    </Flex>

                                                    <Flex>
                                                        <DataList.Root
                                                            orientation={{
                                                                initial:
                                                                    "vertical",
                                                                sm: "horizontal",
                                                            }}
                                                        >
                                                            <DataList.Item>
                                                                <DataList.Label minWidth="100px">
                                                                    <Strong>
                                                                        Роль
                                                                    </Strong>
                                                                </DataList.Label>
                                                                <DataList.Value>
                                                                    <Badge
                                                                        color={
                                                                            user.is_admin
                                                                                ? "tomato"
                                                                                : "indigo"
                                                                        }
                                                                    >
                                                                        {user.is_admin
                                                                            ? "Администратор"
                                                                            : "Пользователь"}
                                                                    </Badge>
                                                                </DataList.Value>
                                                            </DataList.Item>

                                                            <DataList.Item>
                                                                <DataList.Label minWidth="100px">
                                                                    <Strong>
                                                                        Email
                                                                    </Strong>
                                                                </DataList.Label>
                                                                <DataList.Value>
                                                                    <Link href="#">
                                                                        {
                                                                            user.email
                                                                        }
                                                                    </Link>
                                                                </DataList.Value>
                                                            </DataList.Item>

                                                            <DataList.Item>
                                                                <DataList.Label minWidth="100px">
                                                                    <Strong>
                                                                        Telegram
                                                                        ID
                                                                    </Strong>
                                                                </DataList.Label>
                                                                <DataList.Value>
                                                                    <Text className="italic">
                                                                        Отсутствует
                                                                    </Text>
                                                                </DataList.Value>
                                                            </DataList.Item>

                                                            <DataList.Item>
                                                                <DataList.Label minWidth="100px">
                                                                    <Strong>
                                                                        Баланс
                                                                        токенов
                                                                    </Strong>
                                                                </DataList.Label>
                                                                <DataList.Value>
                                                                    {
                                                                        user.balance
                                                                    }
                                                                </DataList.Value>
                                                            </DataList.Item>

                                                            <DataList.Item>
                                                                <DataList.Label minWidth="100px">
                                                                    <Strong>
                                                                        Внесено
                                                                        крышек
                                                                    </Strong>
                                                                </DataList.Label>
                                                                <DataList.Value>
                                                                    {
                                                                        allDeposits.filter(
                                                                            (
                                                                                dep,
                                                                            ) =>
                                                                                dep.user_id ==
                                                                                user.id,
                                                                        ).length
                                                                    }
                                                                </DataList.Value>
                                                            </DataList.Item>
                                                        </DataList.Root>
                                                    </Flex>
                                                </Card>

                                                <Card className="grow flex-1 min-w-64">
                                                    <Flex
                                                        align="center"
                                                        justify="center"
                                                        className="pb-3 gap-2"
                                                    >
                                                        <ClockIcon className="w-5 h-5" />
                                                        <h3 className="font-medium text-center">
                                                            История
                                                        </h3>
                                                    </Flex>

                                                    <ScrollArea
                                                        type="auto"
                                                        scrollbars="vertical"
                                                        style={{
                                                            height: 364,
                                                            paddingRight: 18,
                                                        }}
                                                    >
                                                        {allDeposits.filter(
                                                            (dep) =>
                                                                dep.user_id ==
                                                                user.id,
                                                        ) !== null &&
                                                        allDeposits.filter(
                                                            (dep) =>
                                                                dep.user_id ==
                                                                user.id,
                                                        ).length > 0 ? (
                                                            <DepositsList
                                                                deposits={allDeposits.filter(
                                                                    (dep) =>
                                                                        dep.user_id ==
                                                                        user.id,
                                                                )}
                                                            ></DepositsList>
                                                        ) : allDeposits.filter(
                                                              (dep) =>
                                                                  dep.user_id ==
                                                                  user.id,
                                                          ) !== null &&
                                                          allDeposits.filter(
                                                              (dep) =>
                                                                  dep.user_id ==
                                                                  user.id,
                                                          ).length == 0 ? (
                                                            <Box className="max-w-[320px] mx-auto text-center pl-4.5">
                                                                <Text>
                                                                    Вы еще не
                                                                    внесли ни
                                                                    одну крышку.
                                                                    Воспользуйтесь
                                                                    формой выше,
                                                                    чтобы внести
                                                                    первые
                                                                    крышки и
                                                                    получить
                                                                    токены!
                                                                </Text>
                                                            </Box>
                                                        ) : (
                                                            <Skeleton>
                                                                <Box
                                                                    width="100%"
                                                                    height="100%"
                                                                ></Box>
                                                            </Skeleton>
                                                        )}
                                                    </ScrollArea>
                                                </Card>

                                                <Card className="grow flex-2 min-w-[512px]">
                                                    <Flex
                                                        align="center"
                                                        justify="center"
                                                        className="pb-3 gap-2"
                                                    >
                                                        <RocketIcon className="w-5 h-5" />
                                                        <h3 className="font-medium text-center">
                                                            Активность
                                                        </h3>
                                                    </Flex>

                                                    {filteredSessions(
                                                        user.id,
                                                    ) !== null &&
                                                        filteredSessions(
                                                            user.id,
                                                        ).length > 0 && (
                                                            <ActivityForm
                                                                activityData={filteredSessions(
                                                                    user.id,
                                                                )}
                                                            ></ActivityForm>
                                                        )}
                                                </Card>
                                            </Flex>

                                            <Flex
                                                gap="3"
                                                mt="4"
                                                justify="center"
                                            >
                                                <Dialog.Close>
                                                    <Button size="3">
                                                        Закрыть окно
                                                    </Button>
                                                </Dialog.Close>
                                            </Flex>
                                        </Dialog.Content>
                                    </Dialog.Root>
                                </Table.Cell>
                                <Table.Cell>{user.email}</Table.Cell>
                                <Table.Cell>
                                    <Badge
                                        color={
                                            user.is_admin ? "tomato" : "indigo"
                                        }
                                    >
                                        {user.is_admin
                                            ? "Администратор"
                                            : "Пользователь"}
                                    </Badge>
                                </Table.Cell>
                                {user !== null && !user.is_admin ? (
                                    <Table.Cell>
                                        <Dialog.Root>
                                            <Dialog.Trigger>
                                                <Button
                                                    color="jade"
                                                    style={{
                                                        lineHeight: 1,
                                                    }}
                                                >
                                                    Сделать админом
                                                </Button>
                                            </Dialog.Trigger>

                                            <Dialog.Content maxWidth="450px">
                                                <Dialog.Title
                                                    className="text-center"
                                                    mb="5"
                                                    style={{
                                                        fontSize: 28,
                                                    }}
                                                >
                                                    Вы уверены?
                                                </Dialog.Title>

                                                <Text
                                                    as="p"
                                                    trim="both"
                                                    size="3"
                                                    my="6"
                                                >
                                                    Выдача прав администратора
                                                    даст пользователю
                                                    возможность менять данные в
                                                    БД, просматривать чужую
                                                    статистику и вызывать
                                                    курьера.
                                                </Text>

                                                <Flex
                                                    gap="3"
                                                    mt="4"
                                                    justify="center"
                                                >
                                                    <Dialog.Close>
                                                        <Button
                                                            size="4"
                                                            variant="soft"
                                                        >
                                                            Нет
                                                        </Button>
                                                    </Dialog.Close>
                                                    <Dialog.Close
                                                        onClick={() =>
                                                            updateUserRole(
                                                                user.id,
                                                                true,
                                                            )
                                                        }
                                                    >
                                                        <Button size="4">
                                                            Да
                                                        </Button>
                                                    </Dialog.Close>
                                                </Flex>
                                            </Dialog.Content>
                                        </Dialog.Root>
                                    </Table.Cell>
                                ) : (
                                    <Table.Cell>
                                        <Dialog.Root>
                                            <Dialog.Trigger>
                                                <Button
                                                    color="tomato"
                                                    style={{
                                                        lineHeight: 1,
                                                    }}
                                                >
                                                    Забрать права
                                                </Button>
                                            </Dialog.Trigger>

                                            <Dialog.Content maxWidth="450px">
                                                <Dialog.Title
                                                    className="text-center"
                                                    mb="5"
                                                    style={{
                                                        fontSize: 28,
                                                    }}
                                                >
                                                    Вы уверены?
                                                </Dialog.Title>

                                                <Text
                                                    as="p"
                                                    trim="both"
                                                    size="3"
                                                    my="6"
                                                >
                                                    Если вы заберете права
                                                    администратора у
                                                    пользователя, он потеряет
                                                    возможность просматривать
                                                    статистику и вызывать
                                                    курьера.
                                                </Text>

                                                <Flex
                                                    gap="3"
                                                    mt="4"
                                                    justify="center"
                                                >
                                                    <Dialog.Close>
                                                        <Button
                                                            size="4"
                                                            variant="soft"
                                                            color="tomato"
                                                        >
                                                            Нет
                                                        </Button>
                                                    </Dialog.Close>
                                                    <Dialog.Close
                                                        onClick={() =>
                                                            updateUserRole(
                                                                user.id,
                                                                false,
                                                            )
                                                        }
                                                    >
                                                        <Button
                                                            size="4"
                                                            color="tomato"
                                                        >
                                                            Да
                                                        </Button>
                                                    </Dialog.Close>
                                                </Flex>
                                            </Dialog.Content>
                                        </Dialog.Root>
                                    </Table.Cell>
                                )}
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table.Root>
        );
    }, [hasFetched, users, emailFilter]);

    return (
        <main>
            <Flex direction={"column"} gap={"4"} className="lg:w-5xl px-5">
                <Card className="grow flex-2 min-w-64">
                    <Flex
                        align="center"
                        justify="center"
                        className="pb-3 gap-2"
                    >
                        <PersonIcon className="w-5 h-5 -translate-y-1.5" />
                        <h2 className="pb-3 font-medium text-center">
                            Пользователи
                        </h2>
                    </Flex>

                    <ScrollArea
                        type="auto"
                        scrollbars="both"
                        style={{
                            width: media.xl
                                ? "auto"
                                : media.lg
                                  ? 642
                                  : media.md
                                    ? 484
                                    : media.smxxx
                                      ? 420
                                      : media.smxx
                                        ? 350
                                        : media.smx
                                          ? 300
                                          : 250,
                            height: 350,
                            paddingRight: 16,
                            paddingBottom: 16,
                        }}
                    >
                        {users.length > 0 ? (
                            usersTable
                        ) : (
                            <Flex
                                direction="column"
                                align="center"
                                className="ml-5"
                            >
                                <p className="text-center">
                                    Данные подгружаются...
                                </p>
                                <Spinner
                                    style={{
                                        width: 64,
                                        height: 64,
                                        marginTop: 20,
                                    }}
                                />
                            </Flex>
                        )}
                    </ScrollArea>

                    <TextField.Root
                        size="2"
                        placeholder="Фильтр по Email"
                        className="mt-3"
                        value={emailFilter}
                        onChange={changeEmailFilter}
                    />
                </Card>

                <Card className="grow flex-2 min-w-64">
                    <Flex
                        align="center"
                        justify="center"
                        className="pb-3 gap-2"
                    >
                        <DiscIcon className="w-5 h-5 -translate-y-1.5" />
                        <h2 className="pb-3 font-medium text-center">
                            Все крышки
                        </h2>
                    </Flex>

                    <ScrollArea
                        type="auto"
                        scrollbars="both"
                        style={{
                            width: media.xl
                                ? "auto"
                                : media.lg
                                  ? 642
                                  : media.md
                                    ? 484
                                    : media.smxxx
                                      ? 420
                                      : media.smxx
                                        ? 350
                                        : media.smx
                                          ? 300
                                          : 250,
                            height: 350,
                            paddingRight: 16,
                            paddingBottom: 16,
                        }}
                    >
                        {allDeposits.length > 0 ? (
                            <Table.Root>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeaderCell>
                                            Время
                                        </Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>
                                            Установка
                                        </Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>
                                            Цвет
                                        </Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>
                                            Размер
                                        </Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>
                                            Токены
                                        </Table.ColumnHeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {filteredCaps.map((dep, index) => (
                                        <Table.Row key={index}>
                                            <Table.Cell>
                                                {dep.created_at}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {dep.machine}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Badge
                                                    color={getColorFromColor(
                                                        dep.color,
                                                    )}
                                                >
                                                    {dep.color}
                                                </Badge>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Badge
                                                    color={getColorFromSize(
                                                        dep.size,
                                                    )}
                                                >
                                                    {dep.size}
                                                </Badge>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {dep.tokens_count}
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        ) : (
                            <Flex
                                direction="column"
                                align="center"
                                className="ml-5"
                            >
                                <p className="text-center">
                                    Данные подгружаются...
                                </p>
                                <Spinner
                                    style={{
                                        width: 64,
                                        height: 64,
                                        marginTop: 20,
                                    }}
                                />
                            </Flex>
                        )}
                    </ScrollArea>

                    <Flex
                        gapX="3"
                        gapY="2"
                        align="center"
                        wrap="wrap"
                        className="place-self-center mt-3"
                    >
                        <Text size="4">
                            <Strong>Фильтры:</Strong>
                        </Text>

                        <Select.Root
                            value={machineFilter}
                            onValueChange={(val) => setMachineFilter(val)}
                        >
                            <Select.Trigger placeholder="Установка" />
                            <Select.Content position="popper">
                                <Select.Group>
                                    <Select.Label>Установки:</Select.Label>
                                    <Select.Item value="fer2">fer2</Select.Item>
                                    <Select.Item value="mpa3">mpa3</Select.Item>
                                    <Select.Item value="gor1">gor1</Select.Item>
                                </Select.Group>
                            </Select.Content>
                        </Select.Root>

                        <Select.Root
                            value={colorFilter}
                            onValueChange={(val) => setColorFilter(val)}
                        >
                            <Select.Trigger placeholder="Цвет" />
                            <Select.Content position="popper">
                                <Select.Group>
                                    <Select.Label>Цвета:</Select.Label>
                                    <Select.Item value="Красный">
                                        Красный
                                    </Select.Item>
                                    <Select.Item value="Синий">
                                        Синий
                                    </Select.Item>
                                    <Select.Item value="Зеленый">
                                        Зеленый
                                    </Select.Item>
                                    <Select.Item value="Желтый">
                                        Желтый
                                    </Select.Item>
                                    <Select.Item value="Черный">
                                        Черный
                                    </Select.Item>
                                    <Select.Item value="Белый">
                                        Белый
                                    </Select.Item>
                                    <Select.Item value="unknown">
                                        unknown
                                    </Select.Item>
                                </Select.Group>
                            </Select.Content>
                        </Select.Root>

                        <Select.Root
                            value={sizeFilter}
                            onValueChange={(val) => setSizeFilter(val)}
                        >
                            <Select.Trigger placeholder="Размер" />
                            <Select.Content position="popper">
                                <Select.Group>
                                    <Select.Label>Размеры:</Select.Label>
                                    <Select.Item value="S">S</Select.Item>
                                    <Select.Item value="M">M</Select.Item>
                                    <Select.Item value="L">L</Select.Item>
                                    <Select.Item value="XL">XL</Select.Item>
                                    <Select.Item value="XLL">XLL</Select.Item>
                                    <Select.Item value="unknown">
                                        unknown
                                    </Select.Item>
                                </Select.Group>
                            </Select.Content>
                        </Select.Root>

                        <Button onClick={clearFilters}>Очистить</Button>
                    </Flex>

                    <Flex
                        align="center"
                        justify="center"
                        gapX="4"
                        gapY="1"
                        wrap="wrap"
                        className="place-self-center mt-5"
                    >
                        <Text size="4">
                            <Strong>Число крышек: </Strong>
                            {filteredCaps.length}
                        </Text>

                        <Dialog.Root>
                            <Dialog.Trigger>
                                <Button
                                    color="tomato"
                                    size="3"
                                    disabled={
                                        machineFilter === "" ||
                                        colorFilter === "" ||
                                        sizeFilter === ""
                                    }
                                >
                                    <BellIcon />
                                    Вызвать курьера
                                </Button>
                            </Dialog.Trigger>

                            <Dialog.Content maxWidth="450px">
                                <Dialog.Title
                                    className="text-center"
                                    mb="5"
                                    style={{ fontSize: 28 }}
                                >
                                    Уведомление отправлено
                                </Dialog.Title>

                                <Text as="p" trim="both" size="3" my="6">
                                    Скоро курьер выедет к установке{" "}
                                    {machineFilter}, чтобы собрать крышки цвета
                                    "{colorFilter}" и размера "{sizeFilter}".
                                </Text>

                                <Flex gap="3" mt="4" justify="center">
                                    <Dialog.Close>
                                        <Button size="4">ОК</Button>
                                    </Dialog.Close>
                                </Flex>
                            </Dialog.Content>
                        </Dialog.Root>
                    </Flex>
                </Card>

                <Flex wrap="wrap" gap={"4"} className="grow flex-2">
                    <Card className="grow flex-1 min-w-64">
                        <Flex
                            align="center"
                            justify="center"
                            className="pb-3 gap-2"
                        >
                            <SizeIcon className="w-5 h-5" />
                            <h3 className="font-medium text-center">
                                Размеры крышек
                            </h3>
                        </Flex>

                        <DataList.Root
                            orientation={{
                                initial: "vertical",
                                sm: "horizontal",
                            }}
                        >
                            <DataList.Item>
                                <DataList.Label minWidth="100px">
                                    <Strong>Название</Strong>
                                </DataList.Label>
                                <DataList.Value>
                                    <Badge color="gray">S</Badge>
                                </DataList.Value>
                            </DataList.Item>

                            <DataList.Item>
                                <DataList.Label minWidth="100px">
                                    <Strong>Название</Strong>
                                </DataList.Label>
                                <DataList.Value>
                                    <Badge color="lime">M</Badge>
                                </DataList.Value>
                            </DataList.Item>

                            <DataList.Item>
                                <DataList.Label minWidth="100px">
                                    <Strong>Название</Strong>
                                </DataList.Label>
                                <DataList.Value>
                                    <Badge color="jade">L</Badge>
                                </DataList.Value>
                            </DataList.Item>

                            <DataList.Item>
                                <DataList.Label minWidth="100px">
                                    <Strong>Название</Strong>
                                </DataList.Label>
                                <DataList.Value>
                                    <Badge color="indigo">XL</Badge>
                                </DataList.Value>
                            </DataList.Item>

                            <DataList.Item>
                                <DataList.Label minWidth="100px">
                                    <Strong>Название</Strong>
                                </DataList.Label>
                                <DataList.Value>
                                    <Badge color="plum">XXL</Badge>
                                </DataList.Value>
                            </DataList.Item>

                            <DataList.Item>
                                <DataList.Label minWidth="100px">
                                    <Strong>Название</Strong>
                                </DataList.Label>
                                <DataList.Value>
                                    <Badge color="gray">unknown</Badge>
                                </DataList.Value>
                            </DataList.Item>
                        </DataList.Root>
                    </Card>

                    <Card className="grow flex-1 min-w-64">
                        <Flex
                            align="center"
                            justify="center"
                            className="pb-3 gap-2"
                        >
                            <BlendingModeIcon className="w-5 h-5" />
                            <h3 className="font-medium text-center">
                                Цвета крышек
                            </h3>
                        </Flex>

                        <DataList.Root
                            orientation={{
                                initial: "vertical",
                                sm: "horizontal",
                            }}
                        >
                            <DataList.Item>
                                <DataList.Label minWidth="100px">
                                    <Strong>Название</Strong>
                                </DataList.Label>
                                <DataList.Value>
                                    <Badge color="red">Красный</Badge>
                                </DataList.Value>
                            </DataList.Item>

                            <DataList.Item>
                                <DataList.Label minWidth="100px">
                                    <Strong>Название</Strong>
                                </DataList.Label>
                                <DataList.Value>
                                    <Badge color="blue">Синий</Badge>
                                </DataList.Value>
                            </DataList.Item>

                            <DataList.Item>
                                <DataList.Label minWidth="100px">
                                    <Strong>Название</Strong>
                                </DataList.Label>
                                <DataList.Value>
                                    <Badge color="jade">Зеленый</Badge>
                                </DataList.Value>
                            </DataList.Item>

                            <DataList.Item>
                                <DataList.Label minWidth="100px">
                                    <Strong>Название</Strong>
                                </DataList.Label>
                                <DataList.Value>
                                    <Badge color="amber">Желтый</Badge>
                                </DataList.Value>
                            </DataList.Item>

                            <DataList.Item>
                                <DataList.Label minWidth="100px">
                                    <Strong>Название</Strong>
                                </DataList.Label>
                                <DataList.Value>
                                    <Badge color="gray">Черный</Badge>
                                </DataList.Value>
                            </DataList.Item>

                            <DataList.Item>
                                <DataList.Label minWidth="100px">
                                    <Strong>Название</Strong>
                                </DataList.Label>
                                <DataList.Value>
                                    <Badge color="bronze">Белый</Badge>
                                </DataList.Value>
                            </DataList.Item>

                            <DataList.Item>
                                <DataList.Label minWidth="100px">
                                    <Strong>Название</Strong>
                                </DataList.Label>
                                <DataList.Value>
                                    <Badge color="gray">unknown</Badge>
                                </DataList.Value>
                            </DataList.Item>
                        </DataList.Root>
                    </Card>

                    <Card className="grow flex-1 min-w-64">
                        <Flex
                            align="center"
                            justify="center"
                            className="pb-3 gap-2"
                        >
                            <ArchiveIcon className="w-5 h-5" />
                            <h3 className="font-medium text-center">
                                Установки
                            </h3>
                        </Flex>

                        <DataList.Root
                            orientation={{
                                initial: "vertical",
                                sm: "horizontal",
                            }}
                        >
                            <DataList.Item>
                                <DataList.Label minWidth="100px">
                                    <Strong>Код</Strong>
                                </DataList.Label>
                                <DataList.Value>fer2</DataList.Value>
                            </DataList.Item>

                            <DataList.Item>
                                <DataList.Label minWidth="100px">
                                    <Strong>Код</Strong>
                                </DataList.Label>
                                <DataList.Value>mpa3</DataList.Value>
                            </DataList.Item>

                            <DataList.Item>
                                <DataList.Label minWidth="100px">
                                    <Strong>Код</Strong>
                                </DataList.Label>
                                <DataList.Value>gor1</DataList.Value>
                            </DataList.Item>
                        </DataList.Root>
                    </Card>
                </Flex>
            </Flex>
        </main>
    );
}

const scrollStyle = {};
