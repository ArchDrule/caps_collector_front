import { TextField, Card, Flex, Button } from "@radix-ui/themes";

export default function Form({ fields, handleKeyPressEnter }) {
    return (
        <Card>
            <Flex direction="column" gap="3" className="text-center md:w-90">
                <h2>Авторизация</h2>
                {fields.map((field) => {
                    <TextField.Root
                        placeholder={field.placeholder}
                        size={"3"}
                        type={field.type}
                        name={field.name}
                        value={field.value}
                        onChange={field.handleChange}
                        onKeyUp={handleKeyPressEnter}
                    ></TextField.Root>;
                })}
                <Button size="3" onClick={handleSend}>
                    Отправить
                </Button>
            </Flex>
        </Card>
    );
}
