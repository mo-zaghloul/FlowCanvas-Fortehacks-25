import "dotenv/config";
import express from "express";
import cors from "cors";
import executeRouter from "./api/execute";
import executeNodeRouter from "./api/execute-node";
import { configureFlow } from "./flow/fclConfig";
const app = express();
const port = process.env.PORT ?? 8081;

app.use(cors({ origin: "http://localhost:8080" }));
app.use(express.json());
configureFlow("emulator"); // or "testnet"
app.use("/api/execute", executeRouter);
app.use("/api/execute-node", executeNodeRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});