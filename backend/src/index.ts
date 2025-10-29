import express from "express";
import cors from "cors";
import executeRouter from "./api/execute";

const app = express();
const port = process.env.PORT ?? 8081;

app.use(cors({ origin: "http://localhost:8080" }));
app.use(express.json());
app.use("/api/execute", executeRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});