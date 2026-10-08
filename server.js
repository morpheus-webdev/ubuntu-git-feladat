const express = require("express");
const mariadb = require("mariadb");

const app = express();
const PORT = 3000;

const pool = mariadb.createPool({
    host: "localhost",
    user: "feladat_user",
    password: "feladat123",
    database: "feladat",
    connectionLimit: 5
});

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Feladat</title>
        </head>
        <body>
            <h1>Adatbevitel</h1>

            <form method="POST" action="/submit">
                <label>
                    Name:
                    <input type="text" name="name" required>
                </label>

                <br><br>

                <label>
                    Email:
                    <input type="email" name="email" required>
                </label>

                <br><br>

                <button type="submit">Submit</button>
            </form>
        </body>
        </html>
    `);
});

app.post("/submit", async (req, res) => {
    const { name, email } = req.body;

    try {
        const conn = await pool.getConnection();

        await conn.query(
            "INSERT INTO people (name, email) VALUES (?, ?)",
            [name, email]
        );

        conn.release();

        res.send(`
            <h1>Success!</h1>
            <p>Data saved to MariaDB.</p>
            <p>Name: ${name}</p>
            <p>Email: ${email}</p>
            <a href="/">Back</a>
        `);
    } catch (error) {
        console.error(error);
        res.status(500).send("Database error");
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});