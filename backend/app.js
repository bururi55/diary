require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const routes = require("./routes");

const port = 5000;
const app = express();

app.use(
  cors({
    origin: "http://185.177.216.170",
    credentials: true,
  })
);

app.use(express.static(path.resolve("..", "frontend", "dist")));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.get("/{*any}", (req, res) => {
  res.sendFile(path.resolve("..", "frontend", "dist", "index.html"));
});

mongoose.connect(process.env.MONGODB_URI).then(() => {
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
});
