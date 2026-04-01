import express from "express";
const app = express();
import { prismaClient } from "@repo/db/client";

app.use(express.json())


app.get("/", async (req, res) => {
    //res.send("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");

    const users = await prismaClient.user.findMany();
    res.json({
        users
    })
})

app.get("/user", async (req, res) => {
    const user = await prismaClient.user.create({
        data: {
            name: "aman",
            email: "aman@gmail.com",
            password: "aman"
        }
    })

    res.json({
        user
    })
})

app.listen(3001, () => {
    console.log("listning on port 3001");
});