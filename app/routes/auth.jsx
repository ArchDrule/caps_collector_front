import { TextField, Card, Flex, Button, Box, Text } from "@radix-ui/themes";
import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import AuthContext from "../context";

const API_URL = import.meta.env.VITE_API_URL;
// const API_URL = "http://127.0.0.1:8000";

export default function Auth() {
    const navigate = useNavigate();
    const { isAuth, setIsAuth, setIsAdmin } = useContext(AuthContext);

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
            client_type: "web",
        };

        //при разработке указывать просто название роута на сервере
        //при деплое уже менять на полный адрес к роуту на сервере
        setIsSending(true);
        const response = await fetch(`${API_URL}/api/login`, {
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

            setIsAuth(true);
            localStorage.setItem("authentificated", true);

            if (responseData.user.is_admin == true) {
                localStorage.setItem("isAdmin", true);
                setIsAdmin(true);
            }

            navigate("/");
        } else {
            console.log("Failed!");
            console.log(responseData.message);

            const errorFieldOpts = {
                color: "red",
                variant: "soft",
                message: responseData.message,
            };

            if (responseData.message === "Незарегистрированный адрес") {
                setEmailOpts({ ...errorFieldOpts });
            } else if (responseData.message === "Неверный пароль") {
                setPasswordOpts({ ...errorFieldOpts });
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
                    <h2>Авторизация</h2>
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
