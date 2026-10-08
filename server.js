const express = require("express");
const mariadb = require("mariadb");

const app = express();
const PORT = 3000;

const pool = mariadb.createPool({
    host: "localhost",
    user: "feladat_user",
    password: "feladat123",
    database: "feladat20261009",
    connectionLimit: 5
});

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Data Entry</title>

    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            min-height: 100vh;
            font-family: Arial, Helvetica, sans-serif;
            background: linear-gradient(135deg, #667eea, #764ba2);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .card {
            width: 100%;
            max-width: 480px;
            background: white;
            border-radius: 18px;
            padding: 40px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
        }

        .header .icon {
            width: 64px;
            height: 64px;
            margin: 0 auto 18px;
            border-radius: 50%;
            background: #667eea;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
        }

        h1 {
            color: #222;
            font-size: 28px;
            margin-bottom: 8px;
        }

        .subtitle {
            color: #777;
            font-size: 14px;
        }

        .form-group {
            margin-bottom: 22px;
        }

        label {
            display: block;
            color: #333;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 8px;
        }

        input {
            width: 100%;
            padding: 13px 15px;
            border: 2px solid #e5e5e5;
            border-radius: 10px;
            font-size: 15px;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
        }

        input:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.12);
        }

        button {
            width: 100%;
            padding: 14px;
            border: none;
            border-radius: 10px;
            background: #667eea;
            color: white;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.2s, transform 0.1s;
        }

        button:hover {
            background: #5568d9;
        }

        button:active {
            transform: scale(0.98);
        }

        .footer {
            text-align: center;
            margin-top: 25px;
            color: #999;
            font-size: 12px;
        }

        @media (max-width: 500px) {
            .card {
                padding: 30px 22px;
            }
        }
    </style>
</head>

<body>

    <div class="card">

        <div class="header">
            <div class="icon">✓</div>

            <h1>Data Entry</h1>

            <p class="subtitle">
                Enter your information below
            </p>
        </div>

        <form method="POST" action="/submit">

            <div class="form-group">
                <label for="name">Name</label>

                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    required
                >
            </div>

            <div class="form-group">
                <label for="email">Email address</label>

                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                >
            </div>

            <button type="submit">
                Save information
            </button>

        </form>

        <div class="footer">
            Node.js &bull; Express &bull; MariaDB
        </div>

    </div>

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
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Success</title>

    <style>
        * {
            box-sizing: border-box;
        }

        body {
            min-height: 100vh;
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            background: linear-gradient(135deg, #667eea, #764ba2);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .card {
            width: 100%;
            max-width: 480px;
            background: white;
            border-radius: 18px;
            padding: 45px 40px;
            text-align: center;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
        }

        .success-icon {
            width: 75px;
            height: 75px;
            margin: 0 auto 20px;
            border-radius: 50%;
            background: #22c55e;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 38px;
        }

        h1 {
            color: #222;
            margin-bottom: 12px;
        }

        p {
            color: #666;
            line-height: 1.6;
        }

        .data {
            margin: 25px 0;
            padding: 18px;
            background: #f7f7f9;
            border-radius: 10px;
            text-align: left;
        }

        .data strong {
            color: #333;
        }

        a {
            display: inline-block;
            margin-top: 15px;
            padding: 13px 25px;
            border-radius: 10px;
            background: #667eea;
            color: white;
            text-decoration: none;
            font-weight: bold;
        }

        a:hover {
            background: #5568d9;
        }
    </style>
</head>

<body>

    <div class="card">

        <div class="success-icon">✓</div>

        <h1>Success!</h1>

        <p>
            Your information has been saved
            successfully to the database.
        </p>

        <div class="data">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
        </div>

        <a href="/">
            Add another entry
        </a>

    </div>

</body>
</html>
        `);

    } catch (error) {
        console.error(error);

        res.status(500).send(`
            <h1>Database error</h1>
            <p>Could not save the information.</p>
        `);
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
})