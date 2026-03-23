import { index, route } from "@react-router/dev/routes";

export default [
    index("./routes/main.jsx"),
    route("/registration", "./routes/registration.jsx"),
    route("/auth", "./routes/auth.jsx"),
    route("/caps-loading", "./routes/capsLoading.jsx"),
];
