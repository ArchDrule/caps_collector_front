import {
    Box,
    Card,
    Flex,
    ScrollArea,
    Skeleton,
    Spinner,
    Text,
} from "@radix-ui/themes";
import { useEffect, useMemo, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router";
import { Player } from "@lordicon/react/dist/player";
import DepositsList from "../components/depositsList";
import AuthContext from "../context";

import LayersIcon from "../assets/icons/wired-flat-12-layers-hover-slide.json";
import ClockIcon from "../assets/icons/wired-outline-45-clock-time-loop-oscillate.json";
import CoinsIcon from "../assets/icons/wired-outline-298-coins-in-reveal.json";

export default function CapsLoading() {
    const navigate = useNavigate();
    const { isAuth, setIsAuth } = useContext(AuthContext);

    const [waitingSeconds, setWaitingSeconds] = useState(null);
    const [mySeconds, setMySeconds] = useState(null);
    const [isActive, setIsActive] = useState(true);

    const hasFetched = useRef(false);

    const [playerIsReady, setPlayerIsReady] = useState(false);
    const playerRef = useRef(null);
    const [currentIconState, setCurrentIconState] = useState(null);

    const [deposits, setDeposits] = useState(null);

    // секунды ожидания очереди
    useEffect(() => {
        if (waitingSeconds === null) {
            return;
        }

        let interval = null;
        // if (playerRef.current) playerRef.current.play();

        if (isActive && waitingSeconds > 0) {
            interval = setInterval(() => {
                setWaitingSeconds((waitingSeconds) => waitingSeconds - 1);
            }, 1000);
        } else if (isActive && waitingSeconds === 0) {
            // setIsActive(false);
            setMySeconds(120);

            setPlayerIsReady(false);
            setCurrentIconState("ClockIcon");
        }

        return () => clearInterval(interval);
    }, [isActive, waitingSeconds]);

    // секунды до конца своего вноса И запрос на последние крышки
    useEffect(() => {
        if (mySeconds === null) {
            return;
        }

        let interval = null;

        const fetchDeposits = async () => {
            const response = await fetch("/api/get-last-deposits", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const responseData = await response.json();
            console.log(responseData);

            if (responseData.status === "Successful") {
                if (
                    responseData.message ===
                    "В эту сессию вы не загружали крышки"
                )
                    setDeposits([]);
                else if (
                    responseData.message === "Данные пользователя получены"
                )
                    setDeposits([...responseData.deposits]);
            } else if (
                responseData.message === "Invalid Token" ||
                responseData.message === "Token Error"
            ) {
                navigate("/auth", { replace: true });
                return;
            }
        };

        if (isActive && mySeconds > 0) {
            interval = setInterval(() => {
                setMySeconds((mySeconds) => mySeconds - 1);
            }, 1000);
        } else if (isActive && mySeconds === 0) {
            setIsActive(false);
            setWaitingSeconds(0);

            setPlayerIsReady(false);
            setCurrentIconState("CoinsIcon");

            fetchDeposits();
        }

        return () => clearInterval(interval);
    }, [isActive, mySeconds]);

    // инициализация страницы и данных с запросом
    useEffect(() => {
        if (hasFetched.current) {
            return;
        }

        if (!isAuth && localStorage.getItem("authentificated") === null) {
            navigate("/auth", { replace: true });
            return;
        }

        const fetchQueue = async () => {
            const creds = {
                machine_code: "fer2",
            };

            const response = await fetch(
                `/api/add-to-queue/${creds.machine_code}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                },
            );
            const responseData = await response.json();
            console.log(responseData);

            if (responseData.status === "Successful") {
                if (
                    responseData.message == "У вас уже есть позиция в очереди"
                ) {
                    if (responseData.data.estimated_wait_time == 0) {
                        setMySeconds(responseData.data.my_time);

                        setPlayerIsReady(false);
                        setCurrentIconState("ClockIcon");
                    } else {
                        setWaitingSeconds(
                            responseData.data.estimated_wait_time,
                        );
                        setPlayerIsReady(false);
                        setCurrentIconState("LayersIcon");
                    }
                } else if (responseData.message == "Вы добавлены в очередь") {
                    if (responseData.data.estimated_wait_time == 0) {
                        setMySeconds(responseData.data.my_time);

                        setPlayerIsReady(false);
                        setCurrentIconState("ClockIcon");
                    } else {
                        setWaitingSeconds(
                            responseData.data.estimated_wait_time,
                        );
                        setPlayerIsReady(false);
                        setCurrentIconState("LayersIcon");
                    }
                }
            } else if (responseData.status === "Failed") {
                if (responseData.message == "Не указан код установки") {
                } else if (
                    responseData.message == "Не удалось найти позицию в очереди"
                ) {
                } else if (
                    responseData.message == "Ошибка при добавлении в очередь"
                ) {
                }
            } else if (
                responseData.message === "Invalid Token" ||
                responseData.message === "Token Error"
            ) {
                navigate("/auth", { replace: true });
                return;
            }
        };

        hasFetched.current = true;
        fetchQueue();

        // setCurrentIconState("LayersIcon");

        // setTimeout(() => {
        //     setPlayerIsReady(false);
        //     setCurrentIconState("ClockIcon");

        //     setTimeout(() => {
        //         setPlayerIsReady(false);
        //         setCurrentIconState("CoinsIcon");
        //     }, 2000);
        // }, 2000);
    }, [hasFetched]);

    const playFromStart = () => {
        if (playerRef.current) {
            playerRef.current.playFromBeginning();
        }
    };

    useEffect(() => {
        // Проверяем, что иконка загружена и Player доступен
        if (playerRef.current && playerIsReady) {
            // Небольшая задержка для гарантии
            const timer = setTimeout(() => {
                playFromStart();
            }, 50);

            return () => clearTimeout(timer);
        }
    }, [playerIsReady]);

    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
    };

    // Универсальный таймер и для waitingSeconds, и для mySeconds
    const TextTimer = () => {
        if (waitingSeconds !== null && waitingSeconds !== 0)
            return (
                <Text color="jade" weight="medium">
                    {formatTime(waitingSeconds)}
                </Text>
            );
        else if (mySeconds !== null && mySeconds !== 0)
            return (
                <Text color="jade" weight="medium">
                    {formatTime(mySeconds)}
                </Text>
            );
        else
            return (
                <Text color="jade" weight="medium">
                    ...
                </Text>
            );
    };

    // Получаем текущую иконку в зависимости от значения currentIconState
    const ThisIcon = useMemo(() => {
        if (playerIsReady) {
            if (currentIconState === "LayersIcon")
                return (
                    <Player
                        ref={playerRef}
                        icon={LayersIcon}
                        size={206}
                        onReady={() => setPlayerIsReady(true)}
                        onComplete={playFromStart}
                    />
                );
            else if (currentIconState === "ClockIcon")
                return (
                    <Player
                        ref={playerRef}
                        icon={ClockIcon}
                        size={206}
                        onReady={() => setPlayerIsReady(true)}
                        onComplete={playFromStart}
                    />
                );
            else if (currentIconState === "CoinsIcon")
                return (
                    <Player
                        ref={playerRef}
                        icon={CoinsIcon}
                        size={206}
                        onReady={() => {
                            setPlayerIsReady(true);
                            playFromStart();
                        }}
                    />
                );
        } else
            return (
                <Player
                    ref={playerRef}
                    icon={CoinsIcon}
                    size={206}
                    onReady={() => {
                        setPlayerIsReady(true);
                        playFromStart();
                    }}
                />
            );
    }, [hasFetched, playerIsReady]);

    const CurrentHeader = () => {
        if (hasFetched.current && currentIconState !== null) {
            if (currentIconState === "LayersIcon")
                return <h2>Ожидайте своей очереди</h2>;
            else if (currentIconState === "ClockIcon")
                return <h2>Погрузка началась</h2>;
            else if (currentIconState === "CoinsIcon") return <h2>Готово!</h2>;
        } else return <h2>Соединение с сервером</h2>;
    };

    const CurrentTimeLog = () => {
        if (hasFetched.current && currentIconState !== null) {
            if (currentIconState === "LayersIcon")
                return (
                    <h3>
                        Осталось: <TextTimer />
                    </h3>
                );
            else if (currentIconState === "ClockIcon")
                return (
                    <h3>
                        Осталось: <TextTimer />
                    </h3>
                );
            else if (currentIconState === "CoinsIcon")
                return <h3>Загруженные крышки:</h3>;
        } else return <h3>Ожидайте ответа</h3>;
    };

    const CurrentInfo = useMemo(() => {
        if (hasFetched.current && currentIconState !== null) {
            if (currentIconState === "LayersIcon")
                return (
                    <Text>
                        Ваша очередь наступит через указанное выше время. Если
                        вы попробуете загрузить крышки в чужую очередь, токены
                        зачислятся на чужой счет!
                    </Text>
                );
            else if (currentIconState === "ClockIcon")
                return <Text>Вам доступны 2 минуты на погрузку крышек.</Text>;
            else if (currentIconState === "CoinsIcon")
                return (
                    <ScrollArea
                        type="auto"
                        scrollbars="vertical"
                        style={{ height: 364, paddingRight: 18 }}
                    >
                        {deposits !== null && deposits.length > 0 ? (
                            <DepositsList deposits={deposits}></DepositsList>
                        ) : deposits !== null && deposits.length == 0 ? (
                            <Box className="max-w-[320px] mx-auto text-center pl-4.5">
                                <Text>Вы не внесли ни одной крышки.</Text>
                            </Box>
                        ) : (
                            <Skeleton>
                                <Box width="100%" height="100%"></Box>
                            </Skeleton>
                        )}
                    </ScrollArea>
                );
        } else
            return (
                <Text>
                    Если ответ от сервера не приходит, перезагрузите страницу.
                </Text>
            );
    }, [hasFetched, currentIconState, deposits]);

    return (
        <main>
            <Card className="md:w-90 mx-5">
                <Flex
                    direction="column"
                    className="px-3 items-center text-center gap-4"
                >
                    <CurrentHeader />

                    {hasFetched.current && currentIconState ? (
                        ThisIcon
                    ) : (
                        <Spinner
                            style={{ width: 166, height: 166, margin: 20 }}
                        ></Spinner>
                    )}

                    <CurrentTimeLog />

                    {CurrentInfo}
                </Flex>
            </Card>
        </main>
    );
}
