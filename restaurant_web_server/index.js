import express from 'express';

import menuItem from "./data/menuItem.js";
import workingHours from "./data/workingHours.js";

const PORT = 3000;

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get('/', (req, res) => {
    res.render("index", { name: `What's Fare is Fair` });
});

app.get('/menu', (req, res) => {
    res.render("menu", { menuItem });
});

app.get('/hours', (req, res) => {
    const days = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
    ];
    res.render("hours", { workingHours, days });
});

app.listen(PORT, () => {
    console.log(`Web Server is listening at localhost:${PORT}`)
})