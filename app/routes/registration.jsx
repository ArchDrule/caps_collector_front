import { TextField, Card, Flex, Button, Text, Box } from "@radix-ui/themes";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function Registration() {
    const navigate = useNavigate();

    const defaultFieldOpts = {
        color: "",
        variant: "classic",
        message: "",
    };
    const [emailOpts, setEmailOpts] = useState({
        ...defaultFieldOpts,
    });
    const [passwordOpts, setPasswordOpts] = useState({
        ...defaultFieldOpts,
    });

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handleChangeEmail = (event) => {
        setEmail(event.target.value);
    };

    const handleChangePassword = (event) => {
        setPassword(event.target.value);
    };

    const validEmail = (e) => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(e);
    };

    const handleSend = async () => {
        setEmailOpts({ ...defaultFieldOpts });
        setPasswordOpts({ ...defaultFieldOpts });

        if (!validEmail(email)) {
            setEmailOpts({
                color: "red",
                variant: "soft",
                message: "Некорректный формат почты",
            });
            return;
        }
        if (password.length <= 3) {
            setPasswordOpts({
                color: "red",
                variant: "soft",
                message: "Минимальный пароль: 4 символа",
            });
            return;
        }

        const creds = {
            email,
            password,
        };

        //при разработке указывать просто название роута на сервере
        //при деплое уже менять на полный адрес к роуту на сервере
        setIsSending(true);
        const response = await fetch("/api/register", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(creds),
        });
        setIsSending(false);

        const responseData = await response.json();
        console.log(responseData);

        if (responseData.status === "Successful") {
            console.log("Success!");
            console.log(responseData.message);

            navigate("/auth");
        } else {
            console.log("Failed!");
            console.log(responseData.message);

            if (responseData.message === "Такой пользователь уже существует") {
                setEmailOpts({
                    color: "red",
                    variant: "soft",
                    message: responseData.message,
                });
            }
        }
    };

    const handleKeyPressEnter = (event) => {
        if (event.key === "Enter") {
            handleSend();
        }
    };

    return (
        <main>
            <Card>
                <Flex
                    direction="column"
                    gap="3"
                    className="text-center md:w-90"
                >
                    <h2>Регистрация</h2>
                    <Box className="text-left">
                        <TextField.Root
                            color={emailOpts.color}
                            variant={emailOpts.variant}
                            placeholder="Email"
                            size={"3"}
                            type="email"
                            name="email"
                            value={email}
                            onChange={handleChangeEmail}
                            onKeyUp={handleKeyPressEnter}
                        ></TextField.Root>

                        {emailOpts.message ? (
                            <Text color={emailOpts.color} className="pl-2">
                                {emailOpts.message}
                            </Text>
                        ) : (
                            ""
                        )}
                    </Box>

                    <Box className="text-left">
                        <TextField.Root
                            color={passwordOpts.color}
                            variant={passwordOpts.variant}
                            placeholder="Пароль"
                            size={"3"}
                            type="password"
                            name="password"
                            value={password}
                            onChange={handleChangePassword}
                            onKeyUp={handleKeyPressEnter}
                        ></TextField.Root>

                        {passwordOpts.message ? (
                            <Text
                                color={passwordOpts.color}
                                size="2"
                                className="pl-2"
                            >
                                {passwordOpts.message}
                            </Text>
                        ) : (
                            ""
                        )}
                    </Box>

                    <Button size="3" onClick={handleSend} loading={isSending}>
                        Отправить
                    </Button>
                </Flex>
            </Card>
        </main>
    );
}
