import express from "express";
import { connectToDatabase } from "./services/db.service"
import { usersRouter } from "./routes/users.router";

export const launchDB = async() => {
    const app = express();
    const port = 8080; // default port to listen

    await connectToDatabase()
        .then(() => {
            app.use("/users", usersRouter);

            app.listen(port, () => {
                console.log(`Server started at http://localhost:${port}`);
            });
        })
        .catch((error: Error) => {
            console.error("Database connection failed", error);
            process.exit();
        });
}
