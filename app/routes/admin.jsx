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
    Button,
    Card,
    DataList,
    Dialog,
    Flex,
    ScrollArea,
    Select,
    Skeleton,
    Strong,
    Table,
    Text,
    TextField,
} from "@radix-ui/themes";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import DepositsList from "../components/depositsList";
import ActivityForm from "../components/activityForm";

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

    const allDeposits = [
        {
            id: 5,
            created_at: "2026-03-24 11:22:52.635",
            machine: "fer2",
            size: "M",
            color: "Зеленый",
            tokens_count: 8,
        },
        {
            id: 7,
            created_at: "2026-03-20 12:18:34.514",
            machine: "fer2",
            size: "L",
            color: "Синий",
            tokens_count: 12,
        },
        {
            id: 9,
            created_at: "2026-03-23 12:33:46.489",
            machine: "fer2",
            size: "M",
            color: "Красный",
            tokens_count: 8,
        },
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

    const sessions = [
        {
            id: 23,
            user_id: 12,
            created_at: "2026-03-23 13:12:10.691",
            updated_at: "2026-03-23 14:54:47.387",
            first_activity_time: "2026-03-23 13:12:10.691",
            last_activity_time: "2026-03-23 14:54:47.386",
        },
        {
            id: 24,
            user_id: 12,
            created_at: "2026-03-24 19:55:34.020",
            updated_at: "2026-03-24 20:54:47.387",
            first_activity_time: "2026-03-24 19:55:34.020",
            last_activity_time: "2026-03-24 20:54:47.386",
        },
    ];

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

    const [machineFilter, setMachineFilter] = useState("");
    const [colorFilter, setColorFilter] = useState("");
    const [sizeFilter, setSizeFilter] = useState("");

    const filteredCaps = useMemo(() => {
        return allDeposits.filter(
            (dep) =>
                dep.machine.includes(machineFilter) &&
                dep.color.includes(colorFilter) &&
                dep.size.includes(sizeFilter),
        );
    }, [machineFilter, colorFilter, sizeFilter]);

    const clearFilters = () => {
        setMachineFilter("");
        setColorFilter("");
        setSizeFilter("");
    };

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
                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeaderCell>
                                        Статистика
                                    </Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>
                                        Email
                                    </Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>
                                        Роль
                                    </Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>
                                        Права админа
                                    </Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>
                                        <Button color="jade">Посмотреть</Button>
                                    </Table.Cell>
                                    <Table.Cell>danilo@example.com</Table.Cell>
                                    <Table.Cell>
                                        <Badge color="tomato">
                                            Администратор
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Button
                                            color="tomato"
                                            style={{ lineHeight: 1 }}
                                        >
                                            Забрать права
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>

                                <Table.Row>
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
                                                >
                                                    <h2>
                                                        Статистика пользователя
                                                    </h2>
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
                                                                                userIsAdmin
                                                                                    ? "tomato"
                                                                                    : "indigo"
                                                                            }
                                                                        >
                                                                            {userIsAdmin
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
                                                                            user@example.com
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
                                                                        28
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
                                                                        3
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
                                                            {deposits !==
                                                                null &&
                                                            deposits.length >
                                                                0 ? (
                                                                <DepositsList
                                                                    deposits={
                                                                        deposits
                                                                    }
                                                                ></DepositsList>
                                                            ) : deposits !==
                                                                  null &&
                                                              deposits.length ==
                                                                  0 ? (
                                                                <Box className="max-w-[320px] mx-auto text-center pl-4.5">
                                                                    <Text>
                                                                        Вы еще
                                                                        не
                                                                        внесли
                                                                        ни одну
                                                                        крышку.
                                                                        Воспользуйтесь
                                                                        формой
                                                                        выше,
                                                                        чтобы
                                                                        внести
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

                                                        {sessions !== null &&
                                                            sessions.length >
                                                                0 && (
                                                                <ActivityForm
                                                                    activityData={
                                                                        sessions
                                                                    }
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
                                    <Table.Cell>user@example.com</Table.Cell>
                                    <Table.Cell>
                                        <Badge
                                            color={
                                                userIsAdmin
                                                    ? "tomato"
                                                    : "indigo"
                                            }
                                        >
                                            {userIsAdmin
                                                ? "Администратор"
                                                : "Пользователь"}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Dialog.Root>
                                            <Dialog.Trigger>
                                                <Button
                                                    color="jade"
                                                    style={{ lineHeight: 1 }}
                                                >
                                                    Сделать админом
                                                </Button>
                                            </Dialog.Trigger>

                                            <Dialog.Content maxWidth="450px">
                                                <Dialog.Title
                                                    className="text-center"
                                                    mb="5"
                                                >
                                                    <h2>Вы уверены?</h2>
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
                                                            setUserIsAdmin(true)
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
                                </Table.Row>

                                <Table.Row>
                                    <Table.Cell>
                                        <Button color="jade">Посмотреть</Button>
                                    </Table.Cell>
                                    <Table.Cell>jasper@example.com</Table.Cell>
                                    <Table.Cell>
                                        <Badge color="indigo">
                                            Пользователь
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Button
                                            color="jade"
                                            style={{ lineHeight: 1 }}
                                        >
                                            Сделать админом
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table.Root>
                    </ScrollArea>

                    <TextField.Root
                        size="2"
                        placeholder="Фильтр по Email"
                        className="mt-3"
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
                                    <Table.Row>
                                        <Table.Cell>
                                            {dep.created_at}
                                        </Table.Cell>
                                        <Table.Cell>{dep.machine}</Table.Cell>
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
                                <Dialog.Title className="text-center" mb="5">
                                    <h2>Уведомление отправлено</h2>
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
