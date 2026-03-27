import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import AuthContext from "../context";
import { useContext, useMemo } from "react";

const margin = {
    top: 20,
    right: 30,
    left: -15,
    bottom: 15,
};

export default function ActivityChart({
    data,
    startFilter,
    endFilter,
    formateDate,
    getDateStr,
    getTimeStr,
    getTimeDif,
}) {
    const { theme } = useContext(AuthContext);

    const filteredData = useMemo(() => {
        return data
            .map((item) => {
                return {
                    ...item,
                    login_date: getDateStr(item.first_activity_time),
                    login_time: getTimeStr(item.first_activity_time),
                    logout_time: getTimeStr(item.last_activity_time),
                    minutes: getTimeDif(
                        formateDate(item.first_activity_time),
                        formateDate(item.last_activity_time),
                    ),
                };
            })
            .filter((item) => {
                if (
                    item !== null &&
                    formateDate(item.first_activity_time) >=
                        formateDate(startFilter) &&
                    formateDate(item.first_activity_time) <=
                        formateDate(endFilter)
                )
                    return item;
            });
    }, [data, startFilter, endFilter]);

    return (
        <BarChart
            width={140 * data.length}
            height={240}
            data={filteredData}
            margin={margin}
        >
            <XAxis dataKey="login_date" stroke="#56BA9F" />
            <YAxis dataKey="minutes" />
            <Tooltip
                wrapperStyle={{
                    width: 228,
                    backgroundColor: "#ccc",
                }}
                contentStyle={{
                    backgroundColor: theme === "light" ? "#f5f5f5" : "#202020",
                }}
            />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <Bar dataKey="login_time" fill="#8884d8" name="Первый вход" />
            <Bar
                dataKey="minutes"
                fill="#00976EA9"
                barSize={30}
                name="Время (мин)"
            />
            <Bar dataKey="logout_time" fill="#8884d8" name="Последний выход" />
        </BarChart>
    );
}
