import express from "express";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 5500;

const app = express();

app.get("/", (req, res) => {
  res.status(200).json("Hi homepage");
});

app.get("/about", (req, res) => {
  res.status(200).json("This is the about page");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
