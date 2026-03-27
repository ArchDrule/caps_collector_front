import { Flex, Select, ScrollArea, Strong, Box } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import ActivityChart from "./activityChart";

export default function ActivityForm({ activityData }) {
    const [startFilter, setStartFilter] = useState("");
    const [endFilter, setEndFilter] = useState("");

    useEffect(() => {
        if (activityData !== null && activityData.length > 0) {
            setStartFilter(activityData[0].first_activity_time);
            setEndFilter(
                activityData[activityData.length - 1].first_activity_time,
            );
        }
    }, [activityData]);

    const formateDate = (str) => {
        const fullDate = new Date(str);

        return fullDate;
    };

    const getDateStr = (d) => {
        const fullDate = new Date(d);
        const date = fullDate.toLocaleDateString("ru-RU");
        return date;
    };

    const getTimeStr = (d) => {
        const fullDate = new Date(d);
        const time = fullDate.toLocaleTimeString("ru-RU");
        return time;
    };

    const getTimeDif = (t1, t2) => {
        const date1 = new Date(t1);
        const date2 = new Date(t2);

        const difMinutes = (date2 - date1) / 60 / 1000;

        return Math.floor(difMinutes);
    };

    const allSessions = activityData
        .map((session, index) => {
            // Проверяем, что dep - это объект и у него есть id
            if (!session || typeof session !== "object") {
                return null;
            }

            return (
                <Select.Item key={index} value={session.first_activity_time}>
                    {getDateStr(session.first_activity_time)}
                </Select.Item>
            );
        })
        .filter((item) => item !== null);

    return (
        <Box>
            <Flex
                wrap="wrap"
                align="center"
                justify="between"
                gap="3"
                className="px-4"
            >
                <Flex align="center" gap="3" pb="2">
                    <Strong className="leading-4">Начальная дата</Strong>

                    {activityData !== null && activityData.length > 0 ? (
                        <Select.Root
                            size="3"
                            value={startFilter}
                            onValueChange={(day) => setStartFilter(day)}
                        >
                            <Select.Trigger />
                            <Select.Content position="popper">
                                <ScrollArea
                                    type="always"
                                    scrollbars="vertical"
                                    style={{
                                        height: 160,
                                        paddingRight: 18,
                                    }}
                                >
                                    <Select.Group>{allSessions}</Select.Group>
                                </ScrollArea>
                            </Select.Content>
                        </Select.Root>
                    ) : (
                        {}
                    )}
                </Flex>

                <Flex align="center" gap="3" pb="2">
                    <Strong className="leading-4">Конечная дата</Strong>

                    {activityData !== null && activityData.length > 0 ? (
                        <Select.Root
                            size="3"
                            value={endFilter}
                            onValueChange={(day) => setEndFilter(day)}
                        >
                            <Select.Trigger />
                            <Select.Content position="popper">
                                <ScrollArea
                                    type="always"
                                    scrollbars="vertical"
                                    style={{
                                        height: 160,
                                        paddingRight: 18,
                                    }}
                                >
                                    <Select.Group>{allSessions}</Select.Group>
                                </ScrollArea>
                            </Select.Content>
                        </Select.Root>
                    ) : (
                        {}
                    )}
                </Flex>
            </Flex>

            <Box className="min-[256px]:w-[206px] min-[375px]:w-[304px] min-[425px]:w-[354px] min-[584px]:w-[510px] min-[768px]:w-[650px] lg:w-[956px]">
                <ScrollArea
                    type="auto"
                    scrollbars="horizontal"
                    style={{ height: 250 }}
                >
                    <ActivityChart
                        data={activityData}
                        startFilter={startFilter}
                        endFilter={endFilter}
                        formateDate={formateDate}
                        getDateStr={getDateStr}
                        getTimeStr={getTimeStr}
                        getTimeDif={getTimeDif}
                    ></ActivityChart>
                </ScrollArea>
            </Box>
        </Box>
    );
}
