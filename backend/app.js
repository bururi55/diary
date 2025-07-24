require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const routes = require("./routes");

const port = 5000;
const app = express();

app.use(cors());
app.use(express.static("../frontend/dist"));
app.use(cookieParser());
app.use(express.json());
app.use("/api", routes);

app.get("*", (req, res) => {
  res.sendFile(path.resolve("..", "frontend", "dist", "index.html"));
});

mongoose.connect(process.env.MONGODB_URI).then(() => {
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
});
