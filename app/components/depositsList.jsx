import {
    Badge,
    Box,
    DataList,
    Separator,
    Strong,
    Text,
} from "@radix-ui/themes";

export default function DepositsList({ deposits }) {
    const formateDate = (str) => {
        const fullDate = new Date(str);

        const time = fullDate.toLocaleTimeString("ru-RU");
        const date = fullDate.toLocaleDateString("ru-RU");

        return `${time} – ${date}`;
    };

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

    const listDeposits = deposits
        .map((dep, index) => {
            // Проверяем, что dep - это объект и у него есть id
            if (!dep || typeof dep !== "object") {
                return null;
            }

            return (
                <Box key={dep.id || `deposit-${index}`}>
                    {index !== 0 && <Separator my="4" size="4"></Separator>}

                    <DataList.Root
                        orientation={{
                            initial: "vertical",
                            sm: "horizontal",
                        }}
                    >
                        <DataList.Item>
                            <DataList.Label minWidth="100px">
                                <Strong>Дата</Strong>
                            </DataList.Label>
                            <DataList.Value>
                                <Text color="jade" className="font-medium">
                                    {formateDate(dep.created_at)}
                                </Text>
                            </DataList.Value>
                        </DataList.Item>

                        <DataList.Item>
                            <DataList.Label minWidth="100px">
                                <Strong>Установка</Strong>
                            </DataList.Label>
                            <DataList.Value>{dep.machine}</DataList.Value>
                        </DataList.Item>

                        <DataList.Item>
                            <DataList.Label minWidth="100px">
                                <Strong>Размер</Strong>
                            </DataList.Label>
                            <DataList.Value>
                                <Badge color={getColorFromSize(dep.size)}>
                                    {dep.size}
                                </Badge>
                            </DataList.Value>
                        </DataList.Item>

                        <DataList.Item>
                            <DataList.Label minWidth="100px">
                                <Strong>Цвет</Strong>
                            </DataList.Label>
                            <DataList.Value>
                                <Badge color={getColorFromColor(dep.color)}>
                                    {dep.color}
                                </Badge>
                            </DataList.Value>
                        </DataList.Item>

                        <DataList.Item>
                            <DataList.Label minWidth="100px">
                                <Strong>Токены</Strong>
                            </DataList.Label>
                            <DataList.Value>{dep.tokens_count}</DataList.Value>
                        </DataList.Item>
                    </DataList.Root>
                </Box>
            );
        })
        .filter((item) => item !== null);

    return listDeposits;
}
