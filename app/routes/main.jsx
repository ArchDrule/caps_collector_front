import {
    Badge,
    Button,
    Card,
    DataList,
    Flex,
    Link,
    ScrollArea,
    SegmentedControl,
    Separator,
    Strong,
    Text,
    HoverCard,
    Skeleton,
    Box,
    Select,
} from "@radix-ui/themes";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState, useContext } from "react";
import DepositsList from "../components/depositsList";
import ActivityForm from "../components/activityForm";
import ActivityChart from "../components/activityChart";
import AuthContext from "../context";

const API_URL = import.meta.env.VITE_API_URL;
// const API_URL = "http://127.0.0.1:8000";

import LightLogo from "../assets/logo/light.svg";
import DarkLogo from "../assets/logo/dark.svg";

export default function Profile() {
    const navigate = useNavigate();
    const { isAuth, setIsAuth, theme } = useContext(AuthContext);
    const hasFetched = useRef(false);

    const [userInfo, setUserInfo] = useState(null);
    const [deposits, setDeposits] = useState(null);
    const [machines, setMachines] = useState(null);

    const [selectedMachine, setSelectedMachine] = useState("");
    const [machineIsNotSelected, setMachineIsNotSelected] = useState(false);

    const [sessions, setSessions] = useState(null);

    useEffect(() => {
        if (hasFetched.current) {
            return;
        }

        if (!isAuth && localStorage.getItem("authentificated") === null) {
            navigate("/auth", { replace: true });
            return;
        }

        // const authentificated = localStorage.getItem("authentificated");
        // console.log("Authentificated: " + authentificated);

        const fetchUserData = async () => {
            const response = await fetch(`${API_URL}/api/current-user`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });
            const responseData = await response.json();
            console.log(responseData);

            if (responseData.status === "Successful") {
                setUserInfo({
                    email: responseData.user.email,
                    idAdmin: responseData.user.isAdmin,
                    balance: responseData.user.balance,
                    telegramId: responseData.user.telegramId,
                    capsCount: responseData.user.deposits.length,
                });

                setDeposits([...responseData.user.deposits]);
                setMachines([...responseData.machines]);
                setSessions([...responseData.user.sessions]);
            } else if (
                responseData.message === "Invalid Token" ||
                responseData.message === "Token Error"
            ) {
                navigate("/auth", { replace: true });
                return;
            }
        };

        hasFetched.current = true;
        fetchUserData();
    }, [hasFetched]);

    const handleStart = async () => {
        if (selectedMachine !== "fer2") {
            setMachineIsNotSelected(true);
            return;
        }
        setMachineIsNotSelected(false);

        navigate("/caps-loading", { replace: true });
        return;
    };

    return (
        <main>
            <Flex direction={"column"} gap={"4"} className="lg:w-5xl px-5">
                <Box className="grow flex-2">
                    <img
                        src={theme === "light" ? LightLogo : DarkLogo}
                        alt="logo"
                        className="px-4 mx-auto mb-6"
                    />

                    <Card>
                        <h2 className="pb-3 font-medium text-center">
                            Внести крышки
                        </h2>

                        <Flex
                            direction="column"
                            className="mx-auto max-w-130 gap-5"
                        >
                            <Flex
                                width="auto"
                                direction="column"
                                className="gap-1"
                            >
                                {machines !== null && machines.length > 0 ? (
                                    <SegmentedControl.Root
                                        value={selectedMachine}
                                        onValueChange={(code) =>
                                            setSelectedMachine(code)
                                        }
                                        size="2"
                                    >
                                        {machines.map((machine, index) => (
                                            <SegmentedControl.Item
                                                key={index}
                                                value={machine.code}
                                                style={
                                                    machine.is_working
                                                        ? {
                                                              pointerEvents:
                                                                  "auto",
                                                          }
                                                        : {
                                                              pointerEvents:
                                                                  "none",
                                                              background:
                                                                  "#DB250084",
                                                          }
                                                }
                                            >
                                                {machine.code}
                                            </SegmentedControl.Item>
                                        ))}
                                    </SegmentedControl.Root>
                                ) : (
                                    <Skeleton>
                                        <SegmentedControl.Root
                                            defaultValue="inbox"
                                            size="2"
                                        >
                                            <SegmentedControl.Item value="inbox">
                                                x2j3
                                            </SegmentedControl.Item>
                                            <SegmentedControl.Item value="drafts">
                                                tp34
                                            </SegmentedControl.Item>
                                            <SegmentedControl.Item value="sent">
                                                g2m1
                                            </SegmentedControl.Item>
                                        </SegmentedControl.Root>
                                    </Skeleton>
                                )}

                                <Flex className="mx-auto">
                                    <HoverCard.Root>
                                        <HoverCard.Trigger>
                                            <Flex className="items-center gap-1">
                                                <Link>
                                                    Выберите код установки
                                                </Link>
                                                <QuestionMarkCircledIcon />
                                            </Flex>
                                        </HoverCard.Trigger>
                                        <HoverCard.Content maxWidth="240px">
                                            <Text as="div" size="2">
                                                У каждой установки есть свой{" "}
                                                <Strong>4-значный</Strong> код.
                                                Выберите код установки, перед
                                                которой вы находитесь.
                                                <br />
                                                <Strong>Неработающие</Strong> в
                                                данный момент установки
                                                подсвечены{" "}
                                                <Strong>красным</Strong>.
                                            </Text>
                                        </HoverCard.Content>
                                    </HoverCard.Root>{" "}
                                </Flex>
                            </Flex>

                            <Button
                                onClick={handleStart}
                                size="3"
                                style={{ fontSize: 20 }}
                            >
                                Начать
                            </Button>

                            {machineIsNotSelected ? (
                                <Text
                                    color="red"
                                    size="4"
                                    className="pl-2 font-medium text-center animate-bounce"
                                >
                                    Выберите код установки!
                                </Text>
                            ) : (
                                ""
                            )}
                        </Flex>
                    </Card>
                </Box>

                <Separator my="2" size="4" />

                <Flex wrap="wrap" gap={"4"} className="grow flex-2">
                    <Card className="grow flex-1 min-w-64">
                        <h3 className="pb-3 font-medium text-center">
                            Аккаунт
                        </h3>
                        <Flex>
                            <DataList.Root
                                orientation={{
                                    initial: "vertical",
                                    sm: "horizontal",
                                }}
                            >
                                <DataList.Item>
                                    <DataList.Label minWidth="100px">
                                        <Strong>Роль</Strong>
                                    </DataList.Label>
                                    <DataList.Value>
                                        {userInfo !== null ? (
                                            <Badge
                                                color={
                                                    userInfo.isAdmin
                                                        ? "tomato"
                                                        : "indigo"
                                                }
                                            >
                                                {userInfo.isAdmin
                                                    ? "Администратор"
                                                    : "Пользователь"}
                                            </Badge>
                                        ) : (
                                            <Skeleton>Loading</Skeleton>
                                        )}
                                    </DataList.Value>
                                </DataList.Item>

                                <DataList.Item>
                                    <DataList.Label minWidth="100px">
                                        <Strong>Email</Strong>
                                    </DataList.Label>
                                    <DataList.Value>
                                        {userInfo !== null ? (
                                            <Link href={userInfo.email}>
                                                {userInfo.email}
                                            </Link>
                                        ) : (
                                            <Skeleton>Loading</Skeleton>
                                        )}
                                    </DataList.Value>
                                </DataList.Item>

                                <DataList.Item>
                                    <DataList.Label minWidth="100px">
                                        <Strong>Telegram ID</Strong>
                                    </DataList.Label>
                                    <DataList.Value>
                                        {userInfo !== null ? (
                                            (userInfo.telegramId ?? (
                                                <Text className="italic">
                                                    Отсутствует
                                                </Text>
                                            ))
                                        ) : (
                                            <Skeleton>Loading</Skeleton>
                                        )}
                                    </DataList.Value>
                                </DataList.Item>

                                <DataList.Item>
                                    <DataList.Label minWidth="100px">
                                        <Strong>Баланс токенов</Strong>
                                    </DataList.Label>
                                    <DataList.Value>
                                        {userInfo !== null ? (
                                            userInfo.balance
                                        ) : (
                                            <Skeleton>Loading</Skeleton>
                                        )}
                                    </DataList.Value>
                                </DataList.Item>

                                <DataList.Item>
                                    <DataList.Label minWidth="100px">
                                        <Strong>Внесено крышек</Strong>
                                    </DataList.Label>
                                    <DataList.Value>
                                        {userInfo !== null ? (
                                            userInfo.capsCount
                                        ) : (
                                            <Skeleton>Loading</Skeleton>
                                        )}
                                    </DataList.Value>
                                </DataList.Item>
                            </DataList.Root>
                        </Flex>
                    </Card>

                    <Card className="grow flex-1 min-w-64">
                        <h3 className="pb-3 font-medium text-center">
                            История
                        </h3>

                        <ScrollArea
                            type="auto"
                            scrollbars="vertical"
                            style={{ height: 364, paddingRight: 18 }}
                        >
                            {deposits !== null && deposits.length > 0 ? (
                                <DepositsList
                                    deposits={deposits}
                                ></DepositsList>
                            ) : deposits !== null && deposits.length == 0 ? (
                                <Box className="max-w-[320px] mx-auto text-center pl-4.5">
                                    <Text>
                                        Вы еще не внесли ни одну крышку.
                                        Воспользуйтесь формой выше, чтобы внести
                                        первые крышки и получить токены!
                                    </Text>
                                </Box>
                            ) : (
                                <Skeleton>
                                    <Box width="100%" height="100%"></Box>
                                </Skeleton>
                            )}
                        </ScrollArea>
                    </Card>
                </Flex>

                {/* <Card className="grow flex-1 min-w-64">
                    <h3 className="pb-3 font-medium text-center">Помощь</h3>

                    <Flex>
                        <DataList.Root
                            orientation={{
                                initial: "vertical",
                                sm: "horizontal",
                            }}
                        >
                            <DataList.Item>
                                <DataList.Label minWidth="100px">
                                    <Strong>FAQ</Strong>
                                </DataList.Label>
                                <DataList.Value>
                                    {userInfo !== null ? (
                                        <Link href="#">Перейти</Link>
                                    ) : (
                                        <Skeleton>Loading</Skeleton>
                                    )}
                                </DataList.Value>
                            </DataList.Item>

                            <DataList.Item>
                                <DataList.Label minWidth="100px">
                                    <Strong>Поддержка</Strong>
                                </DataList.Label>
                                <DataList.Value>
                                    {userInfo !== null ? (
                                        <Link href="#">@kto-to</Link>
                                    ) : (
                                        <Skeleton>Loading</Skeleton>
                                    )}
                                </DataList.Value>
                            </DataList.Item>
                        </DataList.Root>
                    </Flex>
                </Card> */}

                <Card className="grow flex-2 min-w-64">
                    <h3 className="pb-3 font-medium text-center">Активность</h3>

                    {sessions !== null ? (
                        <ActivityForm activityData={sessions}></ActivityForm>
                    ) : (
                        <Skeleton>
                            <Box width="100%" height="250"></Box>
                        </Skeleton>
                    )}
                </Card>
            </Flex>
        </main>
    );
}
