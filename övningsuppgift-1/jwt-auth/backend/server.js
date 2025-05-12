require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;
const secretKey = process.env.SECRET_KEY;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const users = [
  { id: 1, username: "user1", password: "password1" },
  { id: 2, username: "user2", password: "password2" },
];

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, secretKey, {
    expiresIn: "1h",
  });

  if (process.env.NODE_ENV === "prod") {
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "prod",
    });
    res.json({ message: "Login successful" });
  } else {
    res.json({ token });
  }
});

app.get("/api/public", (req, res) => {
  res.json({ message: "This is a public endpoint" });
});

app.get("/api/private", verifyToken, (req, res) => {
  jwt.verify(req.token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    res.json({ message: "This is a private endpoint", user: decoded });
  });
});

function verifyToken(req, res, next) {
  if (process.env.NODE_ENV === "prod") {
    const token = req.cookies.token;
    if (token) {
      req.token = token;
      next();
    } else {
      res.status(403).json({ message: "Unauthorized" });
    }
  } else {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      const bearerToken = bearerHeader.split(" ")[1];
      req.token = bearerToken;
      next();
    } else {
      res.status(403).json({ message: "Unauthorized" });
    }
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
