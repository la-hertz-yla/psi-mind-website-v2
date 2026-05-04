const express = require("express")
const bcrypt = require("bcrypt")
const cors = require("cors")
const app = express()
const mysql = require("mysql2")
app.use(express.json())
app.use(cors())

const db = mysql.createConnection({ 
    host: "localhost",
    user: "root",
    password: "layla",
    database: "psimind_db"
})


db.connect((err) => {
    if (err) {
        console.log("MySQL connection error:", err);
    } else {
        console.log("MySQL connected");
    }
});


app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
    const findUserQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(findUserQuery, [email], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (results.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const insertUserQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        db.query(insertUserQuery, [name, email, hashedPassword], (err) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            res.status(201).json({ message: 'User created successfully' });
        });
    });
    console.log("REGISTER REQUEST REÇU");
    console.log(req.body);
}
catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
}});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    try{
    const findUserQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(findUserQuery, [email], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (results.length === 0) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        res.status(200).json({ message: "Login successful" });
    });
}
catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
}
});


app.listen(3000,()=>{
    console.log("started in port 3000")
});
